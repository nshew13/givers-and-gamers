import type { Coord } from "./CanvasUtils";

export enum EAnimationState {
    READY,
    LOADED,
    STARTED,
    ENDED,
}

export type ConfettiParticleConfig = {
    context: CanvasRenderingContext2D;
    p0: Coord;
    p1: Coord;
    p2: Coord;
    p3: Coord;
    baseColor?: string;
};
