import { BehaviorSubject } from 'rxjs';
import { Coord, Canvas2D } from './CanvasUtils';
import { EAnimationState } from './types';
import type { ConfettiParticleConfig } from './types';
import { ConfettiParticle } from './ConfettiParticle';

/**
 * creates and animates a confetti shower 🎊
 *
 * originally adapted from https://codepen.io/chriscoyier/pen/oAcua
 */
export class ConfettiShower {
  private readonly _canvas!: Canvas2D;
  private readonly _numParticles!: number;
  private _currentAnimationState =
    new BehaviorSubject<EAnimationState>(EAnimationState.READY as EAnimationState);

  private _animationCycles = 1;
  private _animationDelay = 0;
  private _cycleCounter = 0;
  private _particles: ConfettiParticle[] = [];

  get context (): CanvasRenderingContext2D {
    return this._canvas.context;
  }

  constructor (canvasId: string, numParticles = 128) {
    this._canvas = new Canvas2D(canvasId);
    this._numParticles = numParticles;
  }

  public resize (dim: number): void {
    this._canvas.resize(dim);
  }

  public startAnimation (loops = 1, msDelay = 0): BehaviorSubject<EAnimationState> {
    /*
     * Only start an animation if we're in the READY state. Otherwise,
     * one is already in progress and a new one will "stack", causing
     * the animation frame rate to increase.
     */
    if (this._currentAnimationState.getValue() === EAnimationState.READY) {
      this._currentAnimationState = new BehaviorSubject(
        EAnimationState.LOADED as EAnimationState,
      );
      this._createParticles();

      this._cycleCounter = 0;
      this._animationDelay = msDelay;
      this._animationCycles = loops;

      setTimeout(() => {
        this._currentAnimationState.next(EAnimationState.STARTED);
        window.requestAnimationFrame(() => {
          this._loop();
        });
      }, this._animationDelay);
    }

    return this._currentAnimationState;
  }

  /**
   * initializes _numParticles ConfettiParticles in _particles
   */
  private _createParticles (): void {
    this._particles = [];

    for (let i = 0; i < this._numParticles; i++) {
      const particleConfig: Partial<ConfettiParticleConfig> = {
        context: this._canvas.context,
        // shades of RMHC gold (lightness 10% - 90%)
        baseColor: 'hsl(44, 100%, __LIGHTNESS__)',
      };

      // have one point at the center
      particleConfig.p0 = new Coord(
        this._canvas.width * 0.5,
        this._canvas.height * 0.5,
      );
      particleConfig.p1 = new Coord(
        this._canvas.width * Math.random(),
        this._canvas.height * Math.random(),
      );
      particleConfig.p2 = new Coord(
        this._canvas.width * Math.random(),
        this._canvas.height * Math.random(),
      );
      particleConfig.p3 = new Coord(
        this._canvas.width * Math.random(),
        this._canvas.height + 64,
      );

      this._particles.push(
        new ConfettiParticle(particleConfig as ConfettiParticleConfig),
      );
    }
  }

  /**
   * check remaining ConfettiParticles for completion
   */
  private _checkParticlesComplete (): boolean {
    for (let i = this._particles.length - 1; i >= 0; i--) {
      if (this?._particles?.[i]?.isComplete !== true) {
        return false;
      } else {
        // remove completed particles to shorten loops
        this._particles.splice(i, 1);
      }
    }

    return true;
  }

  private _loop (): void {
    // determine the new positions
    this._particles.forEach((p: ConfettiParticle) => {
      p.update();
    });

    // clear the display
    this._canvas.context.clearRect(
      0,
      0,
      this._canvas.width,
      this._canvas.height,
    );

    // draw the updated objects
    this._particles.forEach((p: ConfettiParticle) => {
      p.draw();
    });

    if (this._checkParticlesComplete()) {
      this._currentAnimationState.next(EAnimationState.ENDED);

      if (++this._cycleCounter >= this._animationCycles) {
        this._currentAnimationState.next(EAnimationState.READY);
        this._currentAnimationState.complete();
        return;
      }

      this._currentAnimationState.next(EAnimationState.LOADED);
      this._createParticles();

      setTimeout(() => {
        this._currentAnimationState.next(EAnimationState.STARTED);
        window.requestAnimationFrame(() => {
          this._loop();
        });
      }, this._animationDelay);

      return;
    }

    window.requestAnimationFrame(() => {
      this._loop();
    });
  }
}
