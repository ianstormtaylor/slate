import { BaseEditor, Editor, Node, Path, Point, Range } from 'slate';
import { TextDiff } from '../utils/diff-text';
import { DOMNode, DOMPoint, DOMRange, DOMSelection, DOMStaticRange } from '../utils/dom';
import { Key } from '../utils/key';
/**
 * A React and DOM-specific version of the `Editor` interface.
 */
export interface ReactEditor extends BaseEditor {
    hasEditableTarget: (editor: ReactEditor, target: EventTarget | null) => target is DOMNode;
    hasRange: (editor: ReactEditor, range: Range) => boolean;
    hasSelectableTarget: (editor: ReactEditor, target: EventTarget | null) => boolean;
    hasTarget: (editor: ReactEditor, target: EventTarget | null) => target is DOMNode;
    insertData: (data: DataTransfer) => void;
    insertFragmentData: (data: DataTransfer) => boolean;
    insertTextData: (data: DataTransfer) => boolean;
    isTargetInsideNonReadonlyVoid: (editor: ReactEditor, target: EventTarget | null) => boolean;
    setFragmentData: (data: DataTransfer, originEvent?: 'drag' | 'copy' | 'cut') => void;
}
export interface ReactEditorInterface {
    /**
     * Experimental and android specific: Get pending diffs
     */
    androidPendingDiffs: (editor: Editor) => TextDiff[] | undefined;
    /**
     * Experimental and android specific: Flush all pending diffs and cancel composition at the next possible time.
     */
    androidScheduleFlush: (editor: Editor) => void;
    /**
     * Blur the editor.
     */
    blur: (editor: ReactEditor) => void;
    /**
     * Deselect the editor.
     */
    deselect: (editor: ReactEditor) => void;
    /**
     * Find the DOM node that implements DocumentOrShadowRoot for the editor.
     */
    findDocumentOrShadowRoot: (editor: ReactEditor) => Document | ShadowRoot;
    /**
     * Get the target range from a DOM `event`.
     */
    findEventRange: (editor: ReactEditor, event: any) => Range;
    /**
     * Find a key for a Slate node.
     */
    findKey: (editor: ReactEditor, node: Node) => Key;
    /**
     * Find the path of Slate node.
     */
    findPath: (editor: ReactEditor, node: Node) => Path;
    /**
     * Focus the editor.
     */
    focus: (editor: ReactEditor, options?: {
        retries: number;
    }) => void;
    /**
     * Return the host window of the current editor.
     */
    getWindow: (editor: ReactEditor) => Window;
    /**
     * Check if a DOM node is within the editor.
     */
    hasDOMNode: (editor: ReactEditor, target: DOMNode, options?: {
        editable?: boolean;
    }) => boolean;
    /**
     * Check if the target is editable and in the editor.
     */
    hasEditableTarget: (editor: ReactEditor, target: EventTarget | null) => target is DOMNode;
    /**
     *
     */
    hasRange: (editor: ReactEditor, range: Range) => boolean;
    /**
     * Check if the target can be selectable
     */
    hasSelectableTarget: (editor: ReactEditor, target: EventTarget | null) => boolean;
    /**
     * Check if the target is in the editor.
     */
    hasTarget: (editor: ReactEditor, target: EventTarget | null) => target is DOMNode;
    /**
     * Insert data from a `DataTransfer` into the editor.
     */
    insertData: (editor: ReactEditor, data: DataTransfer) => void;
    /**
     * Insert fragment data from a `DataTransfer` into the editor.
     */
    insertFragmentData: (editor: ReactEditor, data: DataTransfer) => boolean;
    /**
     * Insert text data from a `DataTransfer` into the editor.
     */
    insertTextData: (editor: ReactEditor, data: DataTransfer) => boolean;
    /**
     * Check if the user is currently composing inside the editor.
     */
    isComposing: (editor: ReactEditor) => boolean;
    /**
     * Check if the editor is focused.
     */
    isFocused: (editor: ReactEditor) => boolean;
    /**
     * Check if the editor is in read-only mode.
     */
    isReadOnly: (editor: ReactEditor) => boolean;
    /**
     * Check if the target is inside void and in an non-readonly editor.
     */
    isTargetInsideNonReadonlyVoid: (editor: ReactEditor, target: EventTarget | null) => boolean;
    /**
     * Sets data from the currently selected fragment on a `DataTransfer`.
     */
    setFragmentData: (editor: ReactEditor, data: DataTransfer, originEvent?: 'drag' | 'copy' | 'cut') => void;
    /**
     * Find the native DOM element from a Slate node.
     */
    toDOMNode: (editor: ReactEditor, node: Node) => HTMLElement;
    /**
     * Find a native DOM selection point from a Slate point.
     */
    toDOMPoint: (editor: ReactEditor, point: Point) => DOMPoint;
    /**
     * Find a native DOM range from a Slate `range`.
     *
     * Notice: the returned range will always be ordinal regardless of the direction of Slate `range` due to DOM API limit.
     *
     * there is no way to create a reverse DOM Range using Range.setStart/setEnd
     * according to https://dom.spec.whatwg.org/#concept-range-bp-set.
     */
    toDOMRange: (editor: ReactEditor, range: Range) => DOMRange;
    /**
     * Find a Slate node from a native DOM `element`.
     */
    toSlateNode: (editor: ReactEditor, domNode: DOMNode) => Node;
    /**
     * Find a Slate point from a DOM selection's `domNode` and `domOffset`.
     */
    toSlatePoint: <T extends boolean>(editor: ReactEditor, domPoint: DOMPoint, options: {
        exactMatch: boolean;
        suppressThrow: T;
    }) => T extends true ? Point | null : Point;
    /**
     * Find a Slate range from a DOM range or selection.
     */
    toSlateRange: <T extends boolean>(editor: ReactEditor, domRange: DOMRange | DOMStaticRange | DOMSelection, options: {
        exactMatch: boolean;
        suppressThrow: T;
    }) => T extends true ? Range | null : Range;
}
export declare const ReactEditor: ReactEditorInterface;
//# sourceMappingURL=react-editor.d.ts.map