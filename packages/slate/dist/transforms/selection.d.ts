import { Editor, Location, Point, Range } from '..';
export declare const SelectionTransforms: {
    /**
     * Collapse the selection.
     */
    collapse(editor: Editor, options?: {
        edge?: "anchor" | "focus" | "start" | "end" | undefined;
    }): void;
    /**
     * Unset the selection.
     */
    deselect(editor: Editor): void;
    /**
     * Move the selection's point forward or backward.
     */
    move(editor: Editor, options?: {
        distance?: number | undefined;
        unit?: "offset" | "character" | "word" | "line" | undefined;
        reverse?: boolean | undefined;
        edge?: "anchor" | "focus" | "start" | "end" | undefined;
    }): void;
    /**
     * Set the selection to a new value.
     */
    select(editor: Editor, target: Location): void;
    /**
     * Set new properties on one of the selection's points.
     */
    setPoint(editor: Editor, props: Partial<Point>, options: {
        edge?: "anchor" | "focus" | "start" | "end" | undefined;
    }): void;
    /**
     * Set new properties on the selection.
     */
    setSelection(editor: Editor, props: Partial<Range>): void;
};
//# sourceMappingURL=selection.d.ts.map