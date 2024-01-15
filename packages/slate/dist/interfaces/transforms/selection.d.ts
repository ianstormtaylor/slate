import { Editor, Location, Point, Range } from '../../index';
import { MoveUnit, SelectionEdge } from '../../types/types';
export interface SelectionCollapseOptions {
    edge?: SelectionEdge;
}
export interface SelectionMoveOptions {
    distance?: number;
    unit?: MoveUnit;
    reverse?: boolean;
    edge?: SelectionEdge;
}
export interface SelectionSetPointOptions {
    edge?: SelectionEdge;
}
export interface SelectionTransforms {
    /**
     * Collapse the selection.
     */
    collapse: (editor: Editor, options?: SelectionCollapseOptions) => void;
    /**
     * Unset the selection.
     */
    deselect: (editor: Editor) => void;
    /**
     * Move the selection's point forward or backward.
     */
    move: (editor: Editor, options?: SelectionMoveOptions) => void;
    /**
     * Set the selection to a new value.
     */
    select: (editor: Editor, target: Location) => void;
    /**
     * Set new properties on one of the selection's points.
     */
    setPoint: (editor: Editor, props: Partial<Point>, options?: SelectionSetPointOptions) => void;
    /**
     * Set new properties on the selection.
     */
    setSelection: (editor: Editor, props: Partial<Range>) => void;
}
export declare const SelectionTransforms: SelectionTransforms;
//# sourceMappingURL=selection.d.ts.map