import { ExtendedType, Operation, Path } from '..';
import { TextDirection } from './types';
/**
 * `Point` objects refer to a specific location in a text node in a Slate
 * document. Its path refers to the location of the node in the tree, and its
 * offset refers to the distance into the node's string of text. Points can
 * only refer to `Text` nodes.
 */
export interface BasePoint {
    path: Path;
    offset: number;
}
export declare type Point = ExtendedType<'Point', BasePoint>;
export interface PointTransformOptions {
    affinity?: TextDirection | null;
}
export interface PointInterface {
    compare: (point: Point, another: Point) => -1 | 0 | 1;
    isAfter: (point: Point, another: Point) => boolean;
    isBefore: (point: Point, another: Point) => boolean;
    equals: (point: Point, another: Point) => boolean;
    isPoint: (value: any) => value is Point;
    transform: (point: Point, op: Operation, options?: PointTransformOptions) => Point | null;
}
export declare const Point: PointInterface;
/**
 * `PointEntry` objects are returned when iterating over `Point` objects that
 * belong to a range.
 */
export declare type PointEntry = [Point, 'anchor' | 'focus'];
//# sourceMappingURL=point.d.ts.map