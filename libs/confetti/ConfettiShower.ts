import { BehaviorSubject } from 'rxjs';
import { Coord, Canvas2D, Ease } from './CanvasUtils';


export enum EAnimationState {
    READY,
    LOADED,
    STARTED,
    ENDED,
}

/**
 * primary
 *
 * originally adapted from https://codepen.io/chriscoyier/pen/oAcua
 */
export class ConfettiShower {
    private _canvas: Canvas2D;
    private _cycleCounter: number;
    private _animationDelay: number;
    private _animationCycles: number;
    private _numParticles: number;
    private _currentAnimationState: BehaviorSubject<EAnimationState> = new BehaviorSubject(EAnimationState.READY);

    private _particles: ConfettiParticle[] = [];

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
            this._currentAnimationState = new BehaviorSubject(EAnimationState.LOADED);
            this._createParticles();

            this._cycleCounter = 0;
            this._animationDelay = msDelay;
            this._animationCycles = loops;

            setTimeout(() => {
                this._currentAnimationState.next(EAnimationState.STARTED);
                window.requestAnimationFrame(() => { this._loop(); });
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
                baseColor: 'hsl(44, 100%, __LIGHTNESS__)'
            };

            particleConfig.p0 = new Coord(this._canvas.width * 0.5,           this._canvas.height * 0.5);
            particleConfig.p1 = new Coord(this._canvas.width * Math.random(), this._canvas.height * Math.random());
            particleConfig.p2 = new Coord(this._canvas.width * Math.random(), this._canvas.height * Math.random());
            particleConfig.p3 = new Coord(this._canvas.width * Math.random(), this._canvas.height + 64);

            this._particles.push(new ConfettiParticle(<ConfettiParticleConfig>particleConfig));
        }
    }

    /**
     * check remaining ConfettiParticles for completion
     */
    private _checkParticlesComplete (): boolean {
        for (let i = this._particles.length - 1; i >= 0; i--) {
            if (this._particles[i].isComplete === false) {
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
        this._particles.forEach((p: ConfettiParticle) => { p.update(); });

        // clear the display
        this._canvas.context.clearRect(0, 0, this._canvas.width, this._canvas.height);

        // draw the updated objects
        this._particles.forEach((p: ConfettiParticle) => { p.draw(); });

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
                window.requestAnimationFrame(() => { this._loop(); });
            }, this._animationDelay);

            return;
        }

        window.requestAnimationFrame(() => { this._loop(); });
    }
}

export interface ConfettiParticleConfig {
    context: CanvasRenderingContext2D;
    p0: Coord;
    p1: Coord;
    p2: Coord;
    p3: Coord;
    baseColor?: string;
}

/**
 * single confetti particle rendered on `<canvas>`
 *
 *
 */
export class ConfettiParticle {
    public static readonly COLOR_RANDOM = 'random';

    private static readonly _TIME_STEP = 1/60;
    private static readonly _HALF_PI   = Math.PI * 0.5;
    private static readonly _TEN_PI    = Math.PI * 10;

    private static readonly _RE_HSL_LIGHTNESS = /^hsl\(\s*?(\d+),\s*?(\d+%),.*?\)/i;

    private _context: CanvasRenderingContext2D;

    /**
     * particle quadrilateral's vertices
     */
    private _p0: Coord;
    private _p1: Coord;
    private _p2: Coord;
    private _p3: Coord;

    private _time: number;

    /**
     * particle easing duration
     *
     * Value is random, 3 <= d < 5
     */
    private _duration: number;

    private _color: string;

    private _w: number;
    private _h: number;

    private _isComplete: boolean;
    get isComplete (): boolean { return this._isComplete; }

    private _rotation: number;
    private _scaleY: number;
    private _x = 0;
    private _y = 0;


    constructor (config: ConfettiParticleConfig) {
        this._context = config.context;
        this._p0 = config.p0;
        this._p1 = config.p1;
        this._p2 = config.p2;
        this._p3 = config.p3;

        this._genColor(config?.baseColor);

        this._time = 0;
        this._duration = 3 + Math.random() * 2;

        this._w = 8;
        this._h = 6;

        this._isComplete = false;
    }

    /**
     * draws this ConfettiParticle in the given context
     */
    public draw (): void {
        if (!this._isComplete) {
            this._context.save();
            this._context.translate(this._x, this._y);
            this._context.rotate(this._rotation);
            this._context.scale(1, this._scaleY);

            this._context.fillStyle = this._color;
            this._context.fillRect(this._w * -0.5, this._h * -0.5, this._w, this._h);

            this._context.restore();
        }
    }

    /**
     * calculates next position for this ConfettiParticle
     */
    public update (): void {
        if (!this._isComplete) {
            this._time = Math.min(this._duration, this._time + ConfettiParticle._TIME_STEP);

            const f = Ease.outCubic(this._time, 0, 1, this._duration);
            const p = Coord.cubeBezier(this._p0, this._p1, this._p2, this._p3, f);

            const dx = p.x - this._x;
            const dy = p.y - this._y;

            this._rotation = Math.atan2(dy, dx) + ConfettiParticle._HALF_PI;
            this._scaleY   = Math.sin(ConfettiParticle._TEN_PI * f);
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
    private _genColor (baseColor: string = ConfettiParticle.COLOR_RANDOM) {
        if (baseColor === ConfettiParticle.COLOR_RANDOM) {
            this._color =  '#' + Math.floor((Math.random() * 0xffffff)).toString(16);
        } else if (ConfettiParticle._RE_HSL_LIGHTNESS.test(baseColor)) {
            this._color = baseColor.replace(ConfettiParticle._RE_HSL_LIGHTNESS, 'hsl($1, $2, ' + Math.floor(Math.random() * (90 - 10) + 10) + '%)');
        }
    }
}
