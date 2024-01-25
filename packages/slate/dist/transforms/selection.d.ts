import { Editor, Location, Point, Range } from '..';
import { SelectionEdge, MoveUnit } from '../interfaces/types';
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
    collapse: (editor: Editor, options?: SelectionCollapseOptions) => void;
    deselect: (editor: Editor) => void;
    move: (editor: Editor, options?: SelectionMoveOptions) => void;
    select: (editor: Editor, target: Location) => void;
    setPoint: (editor: Editor, props: Partial<Point>, options?: SelectionSetPointOptions) => void;
    setSelection: (editor: Editor, props: Partial<Range>) => void;
}
export declare const SelectionTransforms: SelectionTransforms;
//# sourceMappingURL=selection.d.ts.map