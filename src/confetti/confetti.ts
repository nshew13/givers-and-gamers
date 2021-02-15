import './confetti.scss';


const TWO_PI = Math.PI * 2;
const HALF_PI = Math.PI * 0.5;

// adapted from https://codepen.io/chriscoyier/pen/oAcua

export enum Phase {
    // LOADING,
    EXPLODING,
    FALLING,
}

export class Coord {
    private _x: number;
    get x (): number { return this._x; }
    set x (val: number) { this._x = val; }

    private _y: number;
    get y (): number { return this._y; }
    set y (val: number) { this._y = val; }

    private _z: number;
    get z (): number { return this._z; }
    set z (val: number) { this._z = val; }

    constructor (x = 0, y = 0, z = 0) {
        this._x = x;
        this._y = y;
        this._z = z;
    }
}

export class Canvas2D {
    private _canvasEl: HTMLCanvasElement;
    private _canvasContext: CanvasRenderingContext2D;

    get context (): CanvasRenderingContext2D {
        return this._canvasContext;
    }
    get height (): number {
        return this._canvasEl.clientHeight;
    }
    get width (): number {
        return this._canvasEl.clientWidth;
    }

    constructor (canvasId: string) {
        this._canvasEl = document.getElementById(canvasId) as HTMLCanvasElement;
        this._canvasContext = this._canvasEl.getContext('2d');
        this.resize();

        window.onresize = () => {
            this.resize();
        };
    }

    /**
     * set canvas to fill entire parent element
     */
    public resize (): void {
        this._canvasEl.setAttribute('width',  this._canvasEl.parentElement.clientWidth  + 'px');
        this._canvasEl.setAttribute('height', this._canvasEl.parentElement.clientHeight + 'px');
    }
}

export class Confetti {
    private _canvas: Canvas2D;
    private _exploader: Exploader;
    // private _loader: Loader;
    private _loopCounter: number;
    private _delay: number;
    private _loops: number;

    private _particles: Particle[] = [];
    private _phase = Phase.EXPLODING;

    constructor (canvasId: string/* , sourceX: number, sourceY: number */) {
        this._canvas = new Canvas2D(canvasId);

        // this._loader    = new Loader(this._canvas.context, this._canvas.width * 0.5, this._canvas.height * 0.5);
        this._exploader = new Exploader(this._canvas.context, this._canvas.width * 0.5, this._canvas.height * 0.5);

        this._createParticles();
    }

    public startAnimation (loops = 1, msDelay = 500): void {
        this._loopCounter = 0;
        this._delay = msDelay;
        this._loops = loops;

        console.log('starting animation delay of ', msDelay);
        setTimeout(() => {
            window.requestAnimationFrame(() => { this._loop(); });
        }, this._delay);
    }

    private _createParticles (): void {
        for (let i = 0; i < 128; i++) {
            const p0 = new Coord(this._canvas.width * 0.5,           this._canvas.height * 0.5);
            const p1 = new Coord(this._canvas.width * Math.random(), this._canvas.height * Math.random());
            const p2 = new Coord(this._canvas.width * Math.random(), this._canvas.height * Math.random());
            const p3 = new Coord(this._canvas.width * Math.random(), this._canvas.height + 64);

            this._particles.push(new Particle(this._canvas.context, p0, p1, p2, p3));
        }
    }

    private _checkParticlesComplete (): boolean {
        for (let i = 0; i < this._particles.length; i++) {
            if (this._particles[i].complete === false) {
                return false;
            }
        }
        return true;
    }

    private _loop (): void {
        switch (this._phase) {
            // case Phase.LOADING:
            //     this._loader.progress += 1/45;
            //     break;
            case Phase.EXPLODING:
                this._exploader.update();
                break;
            case Phase.FALLING:
                this._particles.forEach((p) => {
                    p.update();
                });
                break;
        }

        this._canvas.context.clearRect(0, 0, this._canvas.width, this._canvas.height);

        switch (this._phase) {
            // case Phase.LOADING:
            //     this._loader.draw();
            //     break;
            case Phase.EXPLODING:
                this._exploader.draw();
                break;
            case Phase.FALLING:
                this._particles.forEach((p) => {
                    p.draw();
                });
            break;
        }

        // if (this._phase === Phase.LOADING && this._loader.complete) {
            // this._phase = Phase.EXPLODING;
        // } else
        if (this._phase === Phase.EXPLODING && this._exploader.complete) {
            this._phase = Phase.FALLING;
        } else if (this._phase === Phase.FALLING && this._checkParticlesComplete()) {
            // reset
            // this._phase = Phase.LOADING;
            this._phase = Phase.EXPLODING;
            // this._loader.reset();
            this._exploader.reset();
            this._particles.length = 0;

            if (++this._loopCounter >= this._loops) {
                return;
            }

            this._createParticles();
            console.log('starting animation delay of ', this._delay);

            setTimeout(() => {
                window.requestAnimationFrame(() => { this._loop(); });
            }, this._delay);
            return;
        }

        window.requestAnimationFrame(() => { this._loop(); });
    }
}

export class Particle {
    private static readonly _TIME_STEP = 1/60;

    private _context: CanvasRenderingContext2D;
    private _p0: Coord;
    private _p1: Coord;
    private _p2: Coord;
    private _p3: Coord;

    private _time: number;
    private _duration: number;
    private _color: string;
    private _w: number;
    private _h: number;
    private _complete: boolean;
    get complete (): boolean { return this._complete; }

    private _rotation: number;
    private _scaleY: number;
    private _x = 0;
    private _y = 0;


    private static _cubeBezier (p0: Coord, c0: Coord, c1: Coord, p1: Coord, t: number): Coord {
        const p = new Coord();
        const nt = (1 - t);

        p.x = nt * nt * nt * p0.x + 3 * nt * nt * t * c0.x + 3 * nt * t * t * c1.x + t * t * t * p1.x;
        p.y = nt * nt * nt * p0.y + 3 * nt * nt * t * c0.y + 3 * nt * t * t * c1.y + t * t * t * p1.y;

        return p;
    }


    constructor (context: CanvasRenderingContext2D, p0: Coord, p1: Coord, p2: Coord, p3: Coord) {
        this._context = context;
        this._p0 = p0;
        this._p1 = p1;
        this._p2 = p2;
        this._p3 = p3;

        this._time = 0;
        this._duration = 3 + Math.random() * 2;
        this._color =  '#' + Math.floor((Math.random() * 0xffffff)).toString(16);

        this._w = 8;
        this._h = 6;

        this._complete = false;
    }

    public draw (): void {
        this._context.save();
        this._context.translate(this._x, this._y);
        this._context.rotate(this._rotation);
        this._context.scale(1, this._scaleY);

        this._context.fillStyle = this._color;
        this._context.fillRect(-this._w * 0.5, -this._h * 0.5, this._w, this._h);

        this._context.restore();
    }

    public update (): void {
        this._time = Math.min(this._duration, this._time + Particle._TIME_STEP);

        const f = Ease.outCubic(this._time, 0, 1, this._duration);
        const p = Particle._cubeBezier(this._p0, this._p1, this._p2, this._p3, f);

        const dx = p.x - this._x;
        const dy = p.y - this._y;

        this._rotation =  Math.atan2(dy, dx) + HALF_PI;
        this._scaleY = Math.sin(Math.PI * f * 10);
        this._x = p.x;
        this._y = p.y;

        this._complete = this._time === this._duration;
    }
}

/**
 * The Loader is an invisible (transparent) arc that grows until it completes
 * a circle. It seems to be meant only as a resettable delay in animation.
 */
// export class Loader {
//     private static readonly _RADIUS = 24;

//     private _context: CanvasRenderingContext2D;
//     private _x: number;
//     private _y: number;

//     private _progress = 0;
//     set progress (val: number) {
//         this._progress = val < 0 ? 0 : (val > 1 ? 1 : val);
//         this._complete = this._progress === 1;
//     }
//     get progress (): number { return this._progress; }

//     private _complete = false;
//     get complete (): boolean { return this._complete; }

//     constructor (context: CanvasRenderingContext2D, x: number, y: number) {
//         this._context = context;
//         this._x = x;
//         this._y = y;
//     }

//     public reset (): void {
//         this._progress = 0;
//         this._complete = false;
//     }

//     public draw (): void {
//         this._context.fillStyle = 'transparent';
//         this._context.beginPath();
//         this._context.arc(this._x, this._y, Loader._RADIUS, -HALF_PI, TWO_PI * this._progress - HALF_PI);
//         this._context.lineTo(this._x, this._y);
//         this._context.closePath();
//         this._context.fill();
//     }
// }

// pun intended
export class Exploader {
    private static readonly _DURATION = 0.4;
    private static readonly _START_RADIUS = 24;
    private static readonly _TIME_STEP = 1/60;

    private _context: CanvasRenderingContext2D;
    private _x: number;
    private _y: number;

    private _time = 0;
    private _progress = 0;
    private _complete = false;
    get complete (): boolean { return this._complete; }


    constructor (context: CanvasRenderingContext2D, x: number, y: number) {
        this._context = context;
        this._x = x;
        this._y = y;
    }

    public reset (): void {
        this._time = 0;
        this._progress = 0;
        this._complete = false;
    }

    public update (): void {
        this._time = Math.min(Exploader._DURATION, this._time + Exploader._TIME_STEP);
        this._progress = Ease.inBack(this._time, 0, 1, Exploader._DURATION);
        this._complete = this._time === Exploader._DURATION;
    }

    public draw (): void {
        this._context.fillStyle = 'transparent';
        this._context.beginPath();
        this._context.arc(this._x, this._y, Exploader._START_RADIUS * (1 - this._progress), 0, TWO_PI);
        this._context.fill();
    }
}



/**
 * easing equations from http://gizma.com/easing/
 * t = current time
 * b = start value
 * c = delta value
 * d = duration
 */
export class Ease {
    public static inCubic (t: number, b: number, c: number, d: number): number {
        t /= d;
        return c*t*t*t + b;
    }

    public static outCubic (t: number, b: number, c: number, d: number): number {
        t /= d;
        t--;
        return c*(t*t*t + 1) + b;
    }

    public static inOutCubic (t: number, b: number, c: number, d: number): number {
        t /= d/2;
        if (t < 1) return c/2*t*t*t + b;
        t -= 2;
        return c/2*(t*t*t + 2) + b;
    }

    public static inBack (t: number, b: number, c: number, d: number, s = 1.70158): number {
        return c*(t/=d)*t*((s+1)*t - s) + b;
    }
}





document.addEventListener('DOMContentLoaded', () => {
    const confetti = new Confetti('confetti');
    confetti.startAnimation(3, 3000);
});
