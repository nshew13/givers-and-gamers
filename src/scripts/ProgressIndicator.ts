import { Circle } from 'progressbar.js';
import { tap, timer } from 'rxjs';
import type { Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { ConfettiShower } from '^components/confetti/ConfettiShower';
import { getCurrentDonationProgress } from '^components/tiltify/Tiltify';
import CONFIG from '^config/config.json';
import type { TiltifyDonationProgress } from '^components/tiltify/types';
import airHornFile from '../dj-air-horn-sound-effect.mp3';

type ProgressCircle = InstanceType<typeof Circle>;
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

  private readonly _PROGRESS_COLOR: string;
  private readonly _PROGRESS_TEXT_COLOR: string;

  private readonly _airHorn: HTMLAudioElement;
  private readonly _canvasCenter: number = 0;
  private readonly _canvasSize: number = 0;
  private readonly _confettiShower: ConfettiShower;
  private readonly _indicatorEl: HTMLDivElement;
  // private readonly _polling$: Subscription;
  private readonly _progressCircle: ProgressCircle;

  private _lastThresholdConfetti = 0;
  private _lastThresholdAirHorn = 0;

  constructor ({
    canvasEl = 'confetti',
    indicatorEl = 'indicator',
    progressColorVar = '--color-gng-red',
    textColorVar = '--color-gng-grey',
  }: InitializationParams = {}) {
    this._confettiShower = new ConfettiShower(canvasEl);
    this._indicatorEl = document.getElementById(
      indicatorEl,
    ) as HTMLDivElement;

    // grab CSS variable values
    this._PROGRESS_COLOR = getComputedStyle(document.body).getPropertyValue(
      progressColorVar,
    );
    this._PROGRESS_TEXT_COLOR = getComputedStyle(
      document.body,
    ).getPropertyValue(textColorVar);

    // measure the output area
    this._canvasSize = parseInt(
      getComputedStyle(this._indicatorEl).width.replace(
        ProgressIndicator.RE_DIMENSION_NUMBER,
        '$1',
      ),
      10,
    );
    this._canvasCenter = Math.round(this._canvasSize / 2);

    // fill horn with air
    this._airHorn = new Audio(airHornFile);

    window.onresize = () => {
      this._setConfettiClip();
    };

    this._setConfettiClip();
    this._progressCircle = this._initIndicator();
    /* this._polling$ = */ this._initPolling();
  }

  /**
   * create a circular clip path for the confetti to disappear outside the ring
   */
  private _setConfettiClip (): void {
    const ringWidth = Math.round(
      this._canvasSize * (ProgressIndicator._STROKE_WIDTH / 100),
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
      2 * Math.PI,
    );
    this._confettiShower.context.clip();
  }

  private _beginConfettiLoop (): void {
    this._confettiShower.startAnimation().subscribe({
      error: (error) => {
        console.error('confettiLoop error', error);
      },
      complete: () => {
        this._beginConfettiLoop();
      },
    });
  }

  private _initIndicator (): ProgressCircle {
    const circle: ProgressCircle = new Circle(this._indicatorEl, {
      color: this._PROGRESS_COLOR, // line and text, unless overridden
      strokeWidth: ProgressIndicator._STROKE_WIDTH,
      trailWidth: 0.75,
      duration: 500, // ms
      svgStyle: null,
    });

    circle.setText('');

    // specify individual properties so as to not cancel defaults
    if ((circle?.text) != null) {
      circle.text.style.color = this._PROGRESS_TEXT_COLOR;
    }

    return circle;
  }

  private _initPolling (): Subscription {
    return timer(0, CONFIG.progress.polling_frequency_sec * 1000)
      .pipe(
        // tap((drip) => { console.log('drip', drip); }),
        switchMap(async () => await getCurrentDonationProgress()),
        tap({
          next: ({ current, goal }: TiltifyDonationProgress) => {
            const goalPercent = (current + CONFIG.progress.add_to_base ?? 0) / goal;
            // don't fill ring more than 100%
            this._progressCircle.animate(Math.min(goalPercent, 1));
            this._progressCircle.setText(`${Math.ceil(goalPercent * 100)}%`);

            /**
             * Check if we need to throw confetti. If our current total
             * is GTE our _lastThresholdConfetti plus at least one
             * other interval_confetti, make it rain.
             */
            if (
              current >= this._lastThresholdConfetti +
                         CONFIG.progress.interval_confetti ||
                         CONFIG._dev.trigger_confetti
            ) {
              do {
                this._lastThresholdConfetti += CONFIG.progress.interval_confetti;
              } while (
                (this._lastThresholdConfetti + CONFIG.progress.interval_confetti) <= current
              );

              // if we've hit our goal, the party doesn't stop
              if (
                (CONFIG.progress.continuous_confetti_at_goal && current >= goal) ||
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
              current >= this._lastThresholdAirHorn +
                         CONFIG.progress.interval_air_horn ||
                         CONFIG._dev.trigger_air_horn
            ) {
              do {
                this._lastThresholdAirHorn += CONFIG.progress.interval_air_horn;
              } while (
                (this._lastThresholdAirHorn + CONFIG.progress.interval_air_horn) <= current
              );
              this._airHorn?.play().catch(() => {
                console.info(
                  'Unable to play audio until user interacts with page.',
                );
              });
            }
          },
        }),
      )
      .subscribe();
  }
}
