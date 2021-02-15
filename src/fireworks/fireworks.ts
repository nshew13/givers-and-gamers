// adapted from https://codepen.io/K-T/pen/NjyNQy

import './fireworks.scss';

interface IRange {
    min: number;
    max: number;
}

// move to Sass
// const SKY_COLOR = 'hsla(210, 60%, %luminance%, 0.2)';
const SKY_COLOR = 'hsla(210, 60%, %luminance%, %alpha)';



export class Renderer {
	private static readonly _FIREWORK_INTERVAL_RANGE: IRange = { min: 20, max: 200 };

    private _containerEl: Element;
    private _fireworkEl: HTMLCanvasElement;
    private _canvasContextFireworks: CanvasRenderingContext2D;
    private _maxFireworkInterval: number;
    private _fireworkInterval: number;

    private _fireworks: Firework[] = [];


    constructor () {
        this._containerEl = document.getElementById('fireworks-container');
        this._fireworkEl  = document.getElementById('fireworks') as HTMLCanvasElement;

        this.resize();

        this._canvasContextFireworks = this._fireworkEl.getContext('2d');

        this._fireworks = [new Firework(this._containerEl.clientWidth, this._containerEl.clientHeight)];

        this._maxFireworkInterval = Renderer.genRandomValueInRange(Renderer._FIREWORK_INTERVAL_RANGE) | 0;
        this._fireworkInterval = this._maxFireworkInterval;

        this._renderFrame();
	}

	public static genRandomValueInRange (range: IRange): number {
		return range.min + (range.max - range.min) * Math.random();
	}

    public resize (): void {
        this._fireworkEl.setAttribute('width',  this._containerEl.clientWidth  + 'px');
        this._fireworkEl.setAttribute('height', this._containerEl.clientHeight + 'px');
    }

	private _renderFrame (): void {
        window.requestAnimationFrame(() => { this._renderFrame(); });

        let maxOpacity = 0;
		for (let i = 0; i < this._fireworks.length; i++) {
			maxOpacity = Math.max(maxOpacity, this._fireworks[i].getOpacity());
		}

        const skyAdjustedHSLA = SKY_COLOR.replace('%luminance', (5 + maxOpacity * 15).toString()).replace('%alpha', '0.2');

        // 0.0 = transparent, 1.0 = opaque
        // const gradientFadeAlpha = this._canvasContextFireworks.createLinearGradient(0, 0, 0, 1);
        // gradientFadeAlpha.addColorStop(0,    skyAdjustedHSLA.replace('%alpha', '.5'));
        // gradientFadeAlpha.addColorStop(0.75, skyAdjustedHSLA.replace('%alpha', '0.9'));
        // gradientFadeAlpha.addColorStop(1,    skyAdjustedHSLA.replace('%alpha', '1'));

		this._canvasContextFireworks.fillStyle = skyAdjustedHSLA;
		this._canvasContextFireworks.fillRect(0, 0, this._containerEl.clientWidth, this._containerEl.clientHeight);

		for (let i = this._fireworks.length - 1; i >= 0; i--) {
			if (!this._fireworks[i].render(this._canvasContextFireworks)) {
				this._fireworks.splice(i, 1);
			}
		}

		if (--this._fireworkInterval == 0) {
			this._fireworks.push(new Firework(this._containerEl.clientWidth, this._containerEl.clientHeight));
			this._maxFireworkInterval = Renderer.genRandomValueInRange(Renderer._FIREWORK_INTERVAL_RANGE) | 0;
			this._fireworkInterval = this._maxFireworkInterval;
		}
	}
}

export class Firework {
	private static readonly _COLOR = 'hsl(%hue, 80%, 60%)';
	private static readonly _DELTA_OPACITY = 0.01;
	private static readonly _DELTA_THETA = Math.PI / 10;
	private static readonly _GRAVITY = 0.002;
	private static readonly _PARTICLE_COUNT = 300;
	private static readonly _RADIUS = 2;
	private static readonly _THRESHOLD = 50;
	private static readonly _VELOCITY = -3;
	private static readonly _WAIT_COUNT_RANGE = {min : 30, max : 60};

	private _height: number;
	private _width: number;
    private _color: string;
    private _opacity: number;
    private _particles: Particle[];
    private _status: number; // TODO: enum
    private _theta: number;
    private _velocity: number;
    private _waitCount: number;
    private _x: number;
    private _x0: number;
    private _y: number;
    private _y0: number;

    constructor (width: number, height: number) {
        this._width = width;
        this._height = height;

		this._setParameters();
		this._createParticles();
    }

    private _setParameters (): void {
		const hue = 256 * Math.random() | 0;

		this._x = Renderer.genRandomValueInRange({ min: this._width  / 8,  max: this._width * 7 / 8 });
		this._y = Renderer.genRandomValueInRange({ min: this._height / 4,  max: this._height / 2 });
		this._x0 = this._x;
		this._y0 = this._height + Firework._RADIUS;
		this._color = Firework._COLOR.replace('%hue', hue.toString());
		this._status = 0;
		this._theta = 0;
		this._waitCount = Renderer.genRandomValueInRange(Firework._WAIT_COUNT_RANGE);
		this._opacity = 1;
		this._velocity = Firework._VELOCITY;
		this._particles = [];
	}

    private _createParticles (): void {
		for (let i = 0; i < Firework._PARTICLE_COUNT; i++) {
			this._particles.push(new Particle(this._x, this._y));
		}
	}

    public getOpacity (): number {
		return this._status == 2 ? this._opacity : 0;
	}

	public render (context: CanvasRenderingContext2D): boolean {
		switch (this._status) {
            case 0:
                context.save();
                context.fillStyle = this._color;
                context.globalCompositeOperation = 'lighter';
                context.globalAlpha = (this._y0 - this._y) <= Firework._THRESHOLD ? ((this._y0 - this._y) / Firework._THRESHOLD) : 1;

                // Animate the mortar upward.
                // sin() gives it some horizontal wiggle.
                context.translate(this._x0 + Math.sin(this._theta) / 2, this._y0);

                // stretch things a bit vertically, compress horizontally
                context.scale(0.8, 2.4);

                context.beginPath();
                context.arc(0, 0, Firework._RADIUS, 0, Math.PI * 2, false);
                context.fill();

                context.restore(); // restore to saved state (pop stack)

                this._y0 += this._velocity;

                if (this._y0 <= this._y) {
                    this._status = 1;
                }
                this._theta += Firework._DELTA_THETA;
                this._theta %= Math.PI * 2;
                this._velocity += Firework._GRAVITY;
                return true;

            case 1:
                if (--this._waitCount <= 0) {
                    this._status = 2;
                }
                return true;

            case 2:
                context.save();
                context.globalCompositeOperation = 'lighter';
                context.globalAlpha = this._opacity;
                context.fillStyle = this._color;

                for (let i = 0, length = this._particles.length; i < length; i++) {
                    this._particles[i].render(context);
                }
                context.restore();
                this._opacity -= Firework._DELTA_OPACITY;
                return this._opacity > 0;
		}
	}
}

export class Particle {
	private static readonly _FRICTION = 0.98;
	private static readonly _GRAVITY = 0.02;
	private static readonly _VELOCITY_RANGE: IRange = { min: 0, max: 3 };
    private static readonly _RADIUS = 1.5;

	private _x: number;
	private _y: number;
	private _vx: number;
	private _vy: number;

    constructor (x: number, y: number) {
		const radian = Math.PI * 2 * Math.random();
		const velocity = (1 - Math.pow(Math.random(), 6)) * Particle._VELOCITY_RANGE.max;
		const rate = Math.random();

        this._x = x;
        this._y = y;
		this._vx = velocity * Math.cos(radian) * rate;
		this._vy = velocity * Math.sin(radian) * rate;
	}

	public render (context: CanvasRenderingContext2D): void {
		context.beginPath();
		context.arc(this._x, this._y, Particle._RADIUS, 0, Math.PI * 2, false);
		context.fill();

		this._x += this._vx;
		this._y += this._vy;
		this._vy += Particle._GRAVITY;
		this._vx *= Particle._FRICTION;
		this._vy *= Particle._FRICTION;
	}
}

document.addEventListener('DOMContentLoaded', () => {
    const topRender = new Renderer();

    window.onresize = () => {
        topRender.resize();
    };

});
