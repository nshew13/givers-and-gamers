import { Circle } from 'progressbar.js';
import { interval, tap } from "rxjs";
import type { Observable } from "rxjs";
import { switchMap } from "rxjs/operators";

import { ConfettiShower } from './confetti/ConfettiShower';
import { Tiltify } from './tiltify/Tiltify';
import { CONFIG } from './config';
import type { TiltifyDonationProgress } from './tiltify/types';
// @ts-ignore
import airHornFile from '/dj-air-horn-sound-effect.mp3';


type ProgressIndicatorParams = Partial<{
    /**
     * DOM ID of the canvas element to hold the confetti
     */
    canvasEl: string,
    /**
     * DOM ID of the DIV element to hold the whole indicator
     */
    indicatorEl: string,
    /**
     * CSS variable name for the color to use for the progress indicator
     */
    progressColorVar: string,
    /**
     * CSS variable name for the color to use for the progress indicator text
     */
    textColorVar: string,
}>

/**
* main entry point for ProgressIndicator, including confetti, airhorn and infinite loop
*/
export class ProgressIndicator {
    public static readonly RE_DIMENSION_NUMBER = /^\s*(\d+)\D*$/;

    /**
    * We want the confetti to disappear at the progressbar's "trail" line
    * (which is really a leading line, but ¯\_ (ツ)_/¯). Because the SVG is
    * added to the DOM after the canvas, it will appear above the confetti.
    * This means the wider, "completed" stroke will also obscure the confetti
    * as it moves around.
    *
    * We know progressbar's stroke width is a percentage of the canvas size.
    * Find the rendered width of the wider ring and subtract half of that (its
    * center) from the canvasCenter (radius) to get a radius for the trail ring.
    *
    * It's possible this could be off a little due to the trail ring's width,
    * but the trail ring should still appear above the confetti and obscure it.
    */
    private static readonly _STROKE_WIDTH = 10;

    private _PROGRESS_COLOR: string;
    private _PROGRESS_TEXT_COLOR: string;

    private _airHorn: HTMLAudioElement;
    private _canvasCenter: number;
    private _canvasSize: number;
    private _confettiShower: ConfettiShower;
    private _indicatorEl: HTMLDivElement;
    private _lastThresholdConfetti = 0;
    private _lastThresholdAirHorn = 0;
    private _polling$: Observable<TiltifyDonationProgress>;
    // @ts-ignore
    private _progressCircle: Circle;

    constructor ({
        canvasEl = 'confetti',
        indicatorEl = 'indicator',
        progressColorVar = '--color-gng-red',
        textColorVar = '--color-gng-grey',
    }: ProgressIndicatorParams) {
        this._confettiShower = new ConfettiShower(canvasEl);
        this._indicatorEl = document.getElementById(indicatorEl) as HTMLDivElement;

        document.addEventListener('DOMContentLoaded', () => {
            // grab CSS variable values
            this._PROGRESS_COLOR = getComputedStyle(document.body).getPropertyValue(progressColorVar);
            this._PROGRESS_TEXT_COLOR = getComputedStyle(document.body).getPropertyValue(textColorVar);

            // measure the output area
            this._canvasSize = parseInt(getComputedStyle(this._indicatorEl).width.replace(ProgressIndicator.RE_DIMENSION_NUMBER, '$1'), 10);
            this._canvasCenter = Math.round(this._canvasSize / 2);

            // fill horn with air
            this._airHorn = new Audio(airHornFile);

            window.onresize = () => {
                this._setConfettiClip();
            };

            this._setConfettiClip();
            this._beginConfettiLoop();
            this._initIndicator();
            this._beginPolling();
        });
    }

    /**
    * create a circular clip path for the confetti to disappear outside the ring
    */
    private _setConfettiClip () {
        const ringWidth = Math.round(this._canvasSize * (ProgressIndicator._STROKE_WIDTH / 100));
        const clipRadius = this._canvasCenter - ringWidth / 2;

        this._confettiShower.context.beginPath();
        this._confettiShower.context.ellipse(this._canvasCenter, this._canvasCenter, clipRadius, clipRadius, 0, 0, 2 * Math.PI);
        this._confettiShower.context.clip();
    }

    private _beginConfettiLoop () {
        this._confettiShower.startAnimation().subscribe({
            error: (error) => {
                console.error('confettiLoop error', error);
            },
            complete: () => {
                this._beginConfettiLoop();
            },
        });
    }

    private _initIndicator () {
        this._progressCircle = new Circle(this._indicatorEl, {
            color: this._PROGRESS_COLOR, // line and text, unless overridden
            strokeWidth: ProgressIndicator._STROKE_WIDTH,
            trailWidth: .75,
            duration: 500, // ms
            svgStyle: null,
        });

        this._progressCircle.setText('');

        // specify individual properties so as to not cancel defaults
        this._progressCircle.text.style.color = this._PROGRESS_TEXT_COLOR;
    }

    private _beginPolling () {
        this._polling$ = interval(CONFIG.POLLING_FREQUENCY * 1000).pipe(
            switchMap(() => Tiltify.getCurrentDonationProgress()),
            tap({
                next: ({ current, goal }: TiltifyDonationProgress) => {
                    const goalPercent = current / goal;
                    this._progressCircle.animate(goalPercent);
                    this._progressCircle.setText(Math.ceil(goalPercent * 100) + '%');

                    /**
                     * Check if we need to throw confetti. If our current total
                     * is GTE our _lastThresholdConfetti plus at least one
                     * other INTERVAL_CONFETTI, make it rain.
                     */
                    if (current >= this._lastThresholdConfetti + CONFIG.INTERVAL_CONFETTI) {
                        do {
                            this._lastThresholdConfetti += CONFIG.INTERVAL_CONFETTI;
                        } while (this._lastThresholdConfetti + CONFIG.INTERVAL_CONFETTI <= current);

                        // if we've hit our goal, the party doesn't stop
                        if (CONFIG.CONTINUOUS_CONFETTI_AT_GOAL && current >= goal) {
                            this._beginConfettiLoop();
                        } else {
                            this._confettiShower.startAnimation();
                        }
                    }

                    /**
                     * Now, repeat the process for air horn.
                     */
                     if (current >= this._lastThresholdAirHorn + CONFIG.INTERVAL_AIR_HORN) {
                        do {
                            this._lastThresholdAirHorn += CONFIG.INTERVAL_AIR_HORN;
                        } while (this._lastThresholdAirHorn + CONFIG.INTERVAL_AIR_HORN <= current);

                        this._airHorn.play().catch(() => {
                            console.info('Unable to play audio until user interacts with page.');
                        });
                    }
                },
            }),
        );
    }
}
