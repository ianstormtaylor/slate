import { BaseEditor, Node, Path, Point, Range } from 'slate';
import { Key } from '../utils/key';
import { DOMNode, DOMPoint, DOMRange, DOMSelection, DOMStaticRange } from '../utils/dom';
/**
 * A React and DOM-specific version of the `Editor` interface.
 */
export interface ReactEditor extends BaseEditor {
    insertData: (data: DataTransfer) => void;
    insertFragmentData: (data: DataTransfer) => boolean;
    insertTextData: (data: DataTransfer) => boolean;
    setFragmentData: (data: DataTransfer, originEvent?: 'drag' | 'copy' | 'cut') => void;
    hasRange: (editor: ReactEditor, range: Range) => boolean;
}
export declare const ReactEditor: {
    /**
     * Check if the user is currently composing inside the editor.
     */
    isComposing(editor: ReactEditor): boolean;
    /**
     * Return the host window of the current editor.
     */
    getWindow(editor: ReactEditor): Window;
    /**
     * Find a key for a Slate node.
     */
    findKey(editor: ReactEditor, node: Node): Key;
    /**
     * Find the path of Slate node.
     */
    findPath(editor: ReactEditor, node: Node): Path;
    /**
     * Find the DOM node that implements DocumentOrShadowRoot for the editor.
     */
    findDocumentOrShadowRoot(editor: ReactEditor): Document | ShadowRoot;
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
        editable?: boolean;
    }): boolean;
    /**
     * Insert data from a `DataTransfer` into the editor.
     */
    insertData(editor: ReactEditor, data: DataTransfer): void;
    /**
     * Insert fragment data from a `DataTransfer` into the editor.
     */
    insertFragmentData(editor: ReactEditor, data: DataTransfer): boolean;
    /**
     * Insert text data from a `DataTransfer` into the editor.
     */
    insertTextData(editor: ReactEditor, data: DataTransfer): boolean;
    /**
     * Sets data from the currently selected fragment on a `DataTransfer`.
     */
    setFragmentData(editor: ReactEditor, data: DataTransfer, originEvent?: "drag" | "copy" | "cut" | undefined): void;
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
     *
     * Notice: the returned range will always be ordinal regardless of the direction of Slate `range` due to DOM API limit.
     *
     * there is no way to create a reverse DOM Range using Range.setStart/setEnd
     * according to https://dom.spec.whatwg.org/#concept-range-bp-set.
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
    toSlatePoint<T extends boolean>(editor: ReactEditor, domPoint: DOMPoint, options: {
        exactMatch: T;
        suppressThrow: T;
    }): T extends true ? import("slate").BasePoint | null : import("slate").BasePoint;
    /**
     * Find a Slate range from a DOM range or selection.
     */
    toSlateRange<T_1 extends boolean>(editor: ReactEditor, domRange: DOMRange | DOMStaticRange | DOMSelection, options: {
        exactMatch: T_1;
        suppressThrow: T_1;
    }): T_1 extends true ? import("slate").BaseSelection : import("slate").BaseRange & {
        placeholder?: string | undefined;
    };
    hasRange(editor: ReactEditor, range: Range): boolean;
};
//# sourceMappingURL=react-editor.d.ts.map