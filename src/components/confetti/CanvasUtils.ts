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

  public static cubeBezier (p0: Coord, c0: Coord, c1: Coord, p1: Coord, t: number): Coord {
    const p = new Coord();
    const nt = (1 - t);

    p.x = nt * nt * nt * p0.x + 3 * nt * nt * t * c0.x + 3 * nt * t * t * c1.x + t * t * t * p1.x;
    p.y = nt * nt * nt * p0.y + 3 * nt * nt * t * c0.y + 3 * nt * t * t * c1.y + t * t * t * p1.y;

    return p;
  }

  constructor (x = 0, y = 0, z = 0) {
    this._x = x;
    this._y = y;
    this._z = z;
  }
}

/**
 * simple wrapper class for using `<canvas>` in a 2D context
 *
 * This abstraction also handles canvas resizing. On the window
 * resize event, it sets the canvas element's height and width to
 * match those of the containing element.
 */
export class Canvas2D {
  private readonly _canvasEl: HTMLCanvasElement;
  private readonly _canvasContext: CanvasRenderingContext2D;

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
    if (this._canvasEl === null) {
      throw new Error(`No canvas element found for ID "${canvasId}".`);
    }

    this._canvasContext = this._canvasEl.getContext('2d') as CanvasRenderingContext2D;
    this._resizeToParent();

    window.onresize = () => {
      // console.log('Canvas2D adjusting to resize');
      this._resizeToParent();
    };
  }

  /**
   * resizes canvas's parent container, then canvas to fit
   */
  public resize (dim: number): void {
    if ((this?._canvasEl?.parentElement?.style) !== undefined) {
      this._canvasEl.parentElement.style.width = `${dim}px`;
      this._canvasEl.parentElement.style.height = `${dim}px`;
      this._resizeToParent();
    }
  }

  /**
   * set canvas to fill entire parent element
   */
  private _resizeToParent (): void {
    if ((this?._canvasEl?.parentElement?.style) !== undefined) {
      this._canvasEl.setAttribute('width', `${this._canvasEl.parentElement.clientWidth}px`);
      this._canvasEl.setAttribute('height', `${this._canvasEl.parentElement.clientHeight}px`);
    }
  }
}
