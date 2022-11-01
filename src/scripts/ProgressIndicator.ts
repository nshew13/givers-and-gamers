import { Circle } from "progressbar.js";
import { tap, timer } from "rxjs";
import type { Subscription } from "rxjs";
import { switchMap } from "rxjs/operators";

import { ConfettiShower } from "^components/confetti/ConfettiShower";
import { Tiltify } from "^components/tiltify/tiltify";
import CONFIG from "../config.json";
import type { TiltifyDonationProgress } from "^components/tiltify/types";
// @ts-ignore
import airHornFile from "/dj-air-horn-sound-effect.mp3";

type InitializationParams = Partial<{
    /**
     * DOM ID of the canvas element to hold the confetti
     */
    canvasEl: string;
    /**
     * DOM ID of the DIV element to hold the whole indicator
     */
    indicatorEl: string;
    /**
     * CSS variable name for the color to use for the progress indicator
     */
    progressColorVar: string;
    /**
     * CSS variable name for the color to use for the progress indicator text
     */
    textColorVar: string;
}>;

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

    private _PROGRESS_COLOR: string | undefined;
    private _PROGRESS_TEXT_COLOR: string | undefined;

    private _airHorn: HTMLAudioElement | undefined;
    private _canvasCenter = 0;
    private _canvasSize = 0;
    // @ts-ignore
    private _confettiShower: ConfettiShower;
    // @ts-ignore
    private _indicatorEl: HTMLDivElement;
    private _lastThresholdConfetti = 0;
    private _lastThresholdAirHorn = 0;
    // @ts-ignore
    private _polling$: Subscription;
    // @ts-ignore
    private _progressCircle: Circle;

    /**
     * create a circular clip path for the confetti to disappear outside the ring
     */
    private _setConfettiClip() {
        const ringWidth = Math.round(
            this._canvasSize * (ProgressIndicator._STROKE_WIDTH / 100)
        );
        const clipRadius = this._canvasCenter - ringWidth / 2;

        this._confettiShower.context.beginPath();
        this._confettiShower.context.ellipse(
            this._canvasCenter,
            this._canvasCenter,
            clipRadius,
            clipRadius,
            0,
            0,
            2 * Math.PI
        );
        this._confettiShower.context.clip();
    }

    private _beginConfettiLoop() {
        this._confettiShower.startAnimation().subscribe({
            error: (error) => {
                console.error("confettiLoop error", error);
            },
            complete: () => {
                this._beginConfettiLoop();
            },
        });
    }

    private _initIndicator() {
        this._progressCircle = new Circle(this._indicatorEl, {
            color: this._PROGRESS_COLOR, // line and text, unless overridden
            strokeWidth: ProgressIndicator._STROKE_WIDTH,
            trailWidth: 0.75,
            duration: 500, // ms
            svgStyle: null,
        });

        this._progressCircle.setText("");

        // specify individual properties so as to not cancel defaults
        this._progressCircle.text.style.color = this._PROGRESS_TEXT_COLOR;
    }

    private _beginPolling() {
        this._polling$ = timer(0, CONFIG.progress.polling_frequency * 1000)
            .pipe(
                // tap((drip) => { console.log('drip', drip); }),
                switchMap(() => Tiltify.getCurrentDonationProgress()),
                tap({
                    next: ({ current, goal }: TiltifyDonationProgress) => {
                        const goalPercent = current / goal;
                        // don't fill ring more than 100%
                        this._progressCircle.animate(Math.min(goalPercent, 1));
                        this._progressCircle.setText(
                            Math.ceil(goalPercent * 100) + "%"
                        );

                        /**
                         * Check if we need to throw confetti. If our current total
                         * is GTE our _lastThresholdConfetti plus at least one
                         * other interval_confetti, make it rain.
                         */
                        if (
                            current >=
                                this._lastThresholdConfetti +
                                    CONFIG.progress.interval_confetti ||
                            CONFIG._dev.trigger_confetti
                        ) {
                            do {
                                this._lastThresholdConfetti +=
                                    CONFIG.progress.interval_confetti;
                            } while (
                                this._lastThresholdConfetti +
                                    CONFIG.progress.interval_confetti <=
                                current
                            );

                            // if we've hit our goal, the party doesn't stop
                            if (
                                (CONFIG.progress.continuous_confetti_at_goal &&
                                    current >= goal) ||
                                CONFIG._dev.trigger_confetti
                            ) {
                                this._beginConfettiLoop();
                            } else {
                                this._confettiShower.startAnimation();
                            }
                        }

                        /**
                         * Now, repeat the process for air horn.
                         */
                        if (
                            current >=
                                this._lastThresholdAirHorn +
                                    CONFIG.progress.interval_air_horn ||
                            CONFIG._dev.trigger_air_horn
                        ) {
                            do {
                                this._lastThresholdAirHorn +=
                                    CONFIG.progress.interval_air_horn;
                            } while (
                                this._lastThresholdAirHorn +
                                    CONFIG.progress.interval_air_horn <=
                                current
                            );
                            this._airHorn?.play().catch(() => {
                                console.info(
                                    "Unable to play audio until user interacts with page."
                                );
                            });
                        }
                    },
                })
            )
            .subscribe();
    }

    /**
     * to be called after DOMContentLoaded
     */
    public init({
        canvasEl = "confetti",
        indicatorEl = "indicator",
        progressColorVar = "--color-gng-red",
        textColorVar = "--color-gng-grey",
    }: InitializationParams = {}): void {
        this._confettiShower = new ConfettiShower(canvasEl);
        this._indicatorEl = document.getElementById(
            indicatorEl
        ) as HTMLDivElement;

        // grab CSS variable values
        this._PROGRESS_COLOR = getComputedStyle(document.body).getPropertyValue(
            progressColorVar
        );
        this._PROGRESS_TEXT_COLOR = getComputedStyle(
            document.body
        ).getPropertyValue(textColorVar);

        // measure the output area
        this._canvasSize = parseInt(
            getComputedStyle(this._indicatorEl).width.replace(
                ProgressIndicator.RE_DIMENSION_NUMBER,
                "$1"
            ),
            10
        );
        this._canvasCenter = Math.round(this._canvasSize / 2);

        // fill horn with air
        this._airHorn = new Audio(airHornFile);

        window.onresize = () => {
            this._setConfettiClip();
        };

        this._setConfettiClip();
        this._initIndicator();
        this._beginPolling();
    }
}
