import { distSq, distSq2, distSq3, ReadonlyVec } from "@thi.ng/vectors";
import type { IDistance, Metric } from "./api";

export class Squared<T> implements IDistance<T> {
    constructor(public readonly metric: Metric<T>) {}

    to(x: number) {
        return x * x;
    }

    from(x: number) {
        return Math.sqrt(x);
    }
}

export const DIST_SQ = new Squared<ReadonlyVec>(distSq);

export const DIST_SQ1 = new Squared<number>((a, b) => (a - b) ** 2);

export const DIST_SQ2 = new Squared<ReadonlyVec>(distSq2);

export const DIST_SQ3 = new Squared<ReadonlyVec>(distSq3);
