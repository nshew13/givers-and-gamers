import { Coord } from './CanvasUtils';
import type { ConfettiParticleConfig } from './types';

// easing equations from http://gizma.com/easing/
const easeOutCubic = (currentTime: number, startValue: number, delta: number, duration: number): number => {
  currentTime /= duration;
  currentTime--;
  return delta * (currentTime * currentTime * currentTime + 1) + startValue;
};

/**
 * single confetti particle rendered on `<canvas>`
 */
export class ConfettiParticle {
  public static readonly COLOR_RANDOM = 'random';

  /**
   * amount to increment time during each animation cycle
   *
   * When a particle's time reaches (or exceeds) its duration,
   * it is marked completed and no longer drawn nor animated.
   *
   * Smaller values result in a slower animation.
   */
  private static readonly _TIME_STEP = 1 / 60;
  private static readonly _HALF_PI = Math.PI * 0.5;
  private static readonly _TEN_PI = Math.PI * 10;
  private static readonly _RE_HSL_LIGHTNESS = /^hsl\(\s*?(\d+),\s*?(\d+%),.*?\)/i;

  private readonly _context: CanvasRenderingContext2D;

  /**
   * particle quadrilateral's vertices
   */
  private readonly _p0: Coord;
  private readonly _p1: Coord;
  private readonly _p2: Coord;
  private readonly _p3: Coord;

  /**
   * current progress toward completing duration
   */
  private _time: number;

  /**
   * total number of animation steps for this particle
   */
  private readonly _duration: number;

  private readonly _color: string;
  private readonly _w: number;
  private readonly _h: number;

  private _isComplete = false;
  get isComplete (): boolean {
    return this._isComplete;
  }

  private _rotation = 0;
  private _scaleY = 1;
  private _x = 0;
  private _y = 0;

  constructor (config: ConfettiParticleConfig) {
    this._context = config.context;

    /**
     * particle corner coordinates
     */
    this._p0 = config.p0;
    this._p1 = config.p1;
    this._p2 = config.p2;
    this._p3 = config.p3;

    this._color = this._genColor(config?.baseColor);

    this._time = 0;

    /**
     * Add some randomness so some particles fall more slowly than others.
     * These can be in in the range 6 <= duration < 8.
     *
     * The animation is over after roughly duration ÷ _TIME_STEP cycles.
     */
    this._duration = 3 + Math.random() * 2;

    /**
     * dimensions of the particle, before any transformations
     *
     * Use something a little off from square. You can add randomness,
     * if desired.
     */
    this._w = 12;
    this._h = 9;

    /**
     * tracks when we can stop animating this particle
     */
    this._isComplete = false;
  }

  /**
   * draws this ConfettiParticle in the given context
   */
  public draw (): void {
    if (!this._isComplete) {
      // save state before translating, rotating and scaling the particle
      this._context.save();

      this._context.translate(this._x, this._y);
      this._context.rotate(this._rotation);
      this._context.scale(1, this._scaleY);

      this._context.fillStyle = this._color;
      this._context.fillRect(
        this._w * -0.5,
        this._h * -0.5,
        this._w,
        this._h,
      );

      // restore state
      this._context.restore();
    }
  }

  /**
   * calculates next position for this ConfettiParticle
   */
  public update (): void {
    if (!this._isComplete) {
      this._time = Math.min(
        this._duration,
        this._time + ConfettiParticle._TIME_STEP,
      );

      const f = easeOutCubic(this._time, 0, 1, this._duration);
      const p = Coord.cubeBezier(
        this._p0,
        this._p1,
        this._p2,
        this._p3,
        f,
      );

      const dx = p.x - this._x;
      const dy = p.y - this._y;

      this._rotation = Math.atan2(dy, dx) + ConfettiParticle._HALF_PI;
      this._scaleY = Math.sin(ConfettiParticle._TEN_PI * f);
      this._x = p.x;
      this._y = p.y;

      this._isComplete = this._time === this._duration;
    }
  }

  /**
   * generates a semi-(pseudo-)random color
   *
   * currently supports ConfettiParticle.COLOR_RANDOM (the default) or hsl() values
   *
   * @param baseColor
   */
  private _genColor (baseColor: string = ConfettiParticle.COLOR_RANDOM): string {
    if (baseColor === ConfettiParticle.COLOR_RANDOM) {
      return `#${Math.floor(Math.random() * 0xffffff).toString(16)}`;
    } else if (ConfettiParticle._RE_HSL_LIGHTNESS.test(baseColor)) {
      return baseColor.replace(
        ConfettiParticle._RE_HSL_LIGHTNESS,
        `hsl($1, $2, ${Math.floor(Math.random() * (90 - 10) + 10)}%)`,
      );
    }
    return '';
  }
}
