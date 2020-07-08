import { Editor, Node, Path, Point, Range } from 'slate';
import { Key } from '../utils/key';
import { DOMNode, DOMPoint, DOMRange, DOMSelection, DOMStaticRange } from '../utils/dom';
/**
 * A React and DOM-specific version of the `Editor` interface.
 */
export interface ReactEditor extends Editor {
    insertData: (data: DataTransfer) => void;
    setFragmentData: (data: DataTransfer) => void;
}
export declare const ReactEditor: {
    /**
     * Find a key for a Slate node.
     */
    findKey(editor: ReactEditor, node: Node): Key;
    /**
     * Find the path of Slate node.
     */
    findPath(editor: ReactEditor, node: Node): Path;
    /**
     * Check if the editor is focused.
     */
    isFocused(editor: ReactEditor): boolean;
    /**
     * Check if the editor is in read-only mode.
     */
    isReadOnly(editor: ReactEditor): boolean;
    /**
     * Blur the editor.
     */
    blur(editor: ReactEditor): void;
    /**
     * Focus the editor.
     */
    focus(editor: ReactEditor): void;
    /**
     * Deselect the editor.
     */
    deselect(editor: ReactEditor): void;
    /**
     * Check if a DOM node is within the editor.
     */
    hasDOMNode(editor: ReactEditor, target: DOMNode, options?: {
        editable?: boolean | undefined;
    }): boolean;
    /**
     * Insert data from a `DataTransfer` into the editor.
     */
    insertData(editor: ReactEditor, data: DataTransfer): void;
    /**
     * Sets data from the currently selected fragment on a `DataTransfer`.
     */
    setFragmentData(editor: ReactEditor, data: DataTransfer): void;
    /**
     * Find the native DOM element from a Slate node.
     */
    toDOMNode(editor: ReactEditor, node: Node): HTMLElement;
    /**
     * Find a native DOM selection point from a Slate point.
     */
    toDOMPoint(editor: ReactEditor, point: Point): DOMPoint;
    /**
     * Find a native DOM range from a Slate `range`.
     */
    toDOMRange(editor: ReactEditor, range: Range): DOMRange;
    /**
     * Find a Slate node from a native DOM `element`.
     */
    toSlateNode(editor: ReactEditor, domNode: DOMNode): Node;
    /**
     * Get the target range from a DOM `event`.
     */
    findEventRange(editor: ReactEditor, event: any): Range;
    /**
     * Find a Slate point from a DOM selection's `domNode` and `domOffset`.
     */
    toSlatePoint(editor: ReactEditor, domPoint: DOMPoint): Point;
    /**
     * Find a Slate range from a DOM range or selection.
     */
    toSlateRange(editor: ReactEditor, domRange: DOMRange | DOMStaticRange | DOMSelection): Range;
};
//# sourceMappingURL=react-editor.d.ts.map