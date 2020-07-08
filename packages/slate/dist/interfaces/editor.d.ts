import { Ancestor, Descendant, Element, Location, Node, NodeEntry, Operation, Path, PathRef, Point, PointRef, Range, RangeRef, Span, Text } from '..';
/**
 * The `Editor` interface stores all the state of a Slate editor. It is extended
 * by plugins that wish to add their own helpers and implement new behaviors.
 */
export interface Editor {
    children: Node[];
    selection: Range | null;
    operations: Operation[];
    marks: Record<string, any> | null;
    [key: string]: unknown;
    isInline: (element: Element) => boolean;
    isVoid: (element: Element) => boolean;
    normalizeNode: (entry: NodeEntry) => void;
    onChange: () => void;
    addMark: (key: string, value: any) => void;
    apply: (operation: Operation) => void;
    deleteBackward: (unit: 'character' | 'word' | 'line' | 'block') => void;
    deleteForward: (unit: 'character' | 'word' | 'line' | 'block') => void;
    deleteFragment: () => void;
    getFragment: () => Descendant[];
    insertBreak: () => void;
    insertFragment: (fragment: Node[]) => void;
    insertNode: (node: Node) => void;
    insertText: (text: string) => void;
    removeMark: (key: string) => void;
}
export declare const Editor: {
    /**
     * Get the ancestor above a location in the document.
     */
    above<T extends Ancestor>(editor: Editor, options?: {
        at?: Range | Path | Point | undefined;
        match?: ((node: Node) => boolean) | ((node: Node) => node is T) | undefined;
        mode?: "highest" | "lowest" | undefined;
        voids?: boolean | undefined;
    }): NodeEntry<T> | undefined;
    /**
     * Add a custom property to the leaf text nodes in the current selection.
     *
     * If the selection is currently collapsed, the marks will be added to the
     * `editor.marks` property instead, and applied when text is inserted next.
     */
    addMark(editor: Editor, key: string, value: any): void;
    /**
     * Get the point after a location.
     */
    after(editor: Editor, at: Location, options?: {
        distance?: number | undefined;
        unit?: "character" | "word" | "line" | "block" | "offset" | undefined;
    }): Point | undefined;
    /**
     * Get the point before a location.
     */
    before(editor: Editor, at: Location, options?: {
        distance?: number | undefined;
        unit?: "character" | "word" | "line" | "block" | "offset" | undefined;
    }): Point | undefined;
    /**
     * Delete content in the editor backward from the current selection.
     */
    deleteBackward(editor: Editor, options?: {
        unit?: "character" | "word" | "line" | "block" | undefined;
    }): void;
    /**
     * Delete content in the editor forward from the current selection.
     */
    deleteForward(editor: Editor, options?: {
        unit?: "character" | "word" | "line" | "block" | undefined;
    }): void;
    /**
     * Delete the content in the current selection.
     */
    deleteFragment(editor: Editor): void;
    /**
     * Get the start and end points of a location.
     */
    edges(editor: Editor, at: Location): [Point, Point];
    /**
     * Get the end point of a location.
     */
    end(editor: Editor, at: Location): Point;
    /**
     * Get the first node at a location.
     */
    first(editor: Editor, at: Location): NodeEntry<Node>;
    /**
     * Get the fragment at a location.
     */
    fragment(editor: Editor, at: Location): Descendant[];
    /**
     * Check if a node has block children.
     */
    hasBlocks(editor: Editor, element: Element): boolean;
    /**
     * Check if a node has inline and text children.
     */
    hasInlines(editor: Editor, element: Element): boolean;
    /**
     * Check if a node has text children.
     */
    hasTexts(editor: Editor, element: Element): boolean;
    /**
     * Insert a block break at the current selection.
     *
     * If the selection is currently expanded, it will be deleted first.
     */
    insertBreak(editor: Editor): void;
    /**
     * Insert a fragment at the current selection.
     *
     * If the selection is currently expanded, it will be deleted first.
     */
    insertFragment(editor: Editor, fragment: Node[]): void;
    /**
     * Insert a node at the current selection.
     *
     * If the selection is currently expanded, it will be deleted first.
     */
    insertNode(editor: Editor, node: Node): void;
    /**
     * Insert text at the current selection.
     *
     * If the selection is currently expanded, it will be deleted first.
     */
    insertText(editor: Editor, text: string): void;
    /**
     * Check if a value is a block `Element` object.
     */
    isBlock(editor: Editor, value: any): value is Element;
    /**
     * Check if a value is an `Editor` object.
     */
    isEditor(value: any): value is Editor;
    /**
     * Check if a point is the end point of a location.
     */
    isEnd(editor: Editor, point: Point, at: Location): boolean;
    /**
     * Check if a point is an edge of a location.
     */
    isEdge(editor: Editor, point: Point, at: Location): boolean;
    /**
     * Check if an element is empty, accounting for void nodes.
     */
    isEmpty(editor: Editor, element: Element): boolean;
    /**
     * Check if a value is an inline `Element` object.
     */
    isInline(editor: Editor, value: any): value is Element;
    /**
     * Check if the editor is currently normalizing after each operation.
     */
    isNormalizing(editor: Editor): boolean;
    /**
     * Check if a point is the start point of a location.
     */
    isStart(editor: Editor, point: Point, at: Location): boolean;
    /**
     * Check if a value is a void `Element` object.
     */
    isVoid(editor: Editor, value: any): value is Element;
    /**
     * Get the last node at a location.
     */
    last(editor: Editor, at: Location): NodeEntry<Node>;
    /**
     * Get the leaf text node at a location.
     */
    leaf(editor: Editor, at: Location, options?: {
        depth?: number | undefined;
        edge?: "start" | "end" | undefined;
    }): NodeEntry<Text>;
    /**
     * Iterate through all of the levels at a location.
     */
    levels<T_1 extends Node>(editor: Editor, options?: {
        at?: Range | Path | Point | undefined;
        match?: ((node: Node) => boolean) | ((node: Node) => node is T_1) | undefined;
        reverse?: boolean | undefined;
        voids?: boolean | undefined;
    }): Iterable<NodeEntry<T_1>>;
    /**
     * Get the marks that would be added to text at the current selection.
     */
    marks(editor: Editor): Record<string, any> | null;
    /**
     * Get the matching node in the branch of the document after a location.
     */
    next<T_2 extends Node>(editor: Editor, options?: {
        at?: Range | Path | Point | undefined;
        match?: ((node: Node) => boolean) | ((node: Node) => node is T_2) | undefined;
        mode?: "highest" | "lowest" | "all" | undefined;
        voids?: boolean | undefined;
    }): NodeEntry<T_2> | undefined;
    /**
     * Get the node at a location.
     */
    node(editor: Editor, at: Location, options?: {
        depth?: number | undefined;
        edge?: "start" | "end" | undefined;
    }): NodeEntry<Node>;
    /**
     * Iterate through all of the nodes in the Editor.
     */
    nodes<T_3 extends Node>(editor: Editor, options?: {
        at?: Range | Path | Point | Span | undefined;
        match?: ((node: Node) => boolean) | ((node: Node) => node is T_3) | undefined;
        mode?: "highest" | "lowest" | "all" | undefined;
        universal?: boolean | undefined;
        reverse?: boolean | undefined;
        voids?: boolean | undefined;
    }): Iterable<NodeEntry<T_3>>;
    /**
     * Normalize any dirty objects in the editor.
     */
    normalize(editor: Editor, options?: {
        force?: boolean | undefined;
    }): void;
    /**
     * Get the parent node of a location.
     */
    parent(editor: Editor, at: Location, options?: {
        depth?: number | undefined;
        edge?: "start" | "end" | undefined;
    }): NodeEntry<Ancestor>;
    /**
     * Get the path of a location.
     */
    path(editor: Editor, at: Location, options?: {
        depth?: number | undefined;
        edge?: "start" | "end" | undefined;
    }): Path;
    /**
     * Create a mutable ref for a `Path` object, which will stay in sync as new
     * operations are applied to the editor.
     */
    pathRef(editor: Editor, path: Path, options?: {
        affinity?: "backward" | "forward" | null | undefined;
    }): PathRef;
    /**
     * Get the set of currently tracked path refs of the editor.
     */
    pathRefs(editor: Editor): Set<PathRef>;
    /**
     * Get the start or end point of a location.
     */
    point(editor: Editor, at: Location, options?: {
        edge?: "start" | "end" | undefined;
    }): Point;
    /**
     * Create a mutable ref for a `Point` object, which will stay in sync as new
     * operations are applied to the editor.
     */
    pointRef(editor: Editor, point: Point, options?: {
        affinity?: "backward" | "forward" | null | undefined;
    }): PointRef;
    /**
     * Get the set of currently tracked point refs of the editor.
     */
    pointRefs(editor: Editor): Set<PointRef>;
    /**
     * Iterate through all of the positions in the document where a `Point` can be
     * placed.
     *
     * By default it will move forward by individual offsets at a time,  but you
     * can pass the `unit: 'character'` option to moved forward one character, word,
     * or line at at time.
     *
     * Note: void nodes are treated as a single point, and iteration will not
     * happen inside their content.
     */
    positions(editor: Editor, options?: {
        at?: Range | Path | Point | undefined;
        unit?: "character" | "word" | "line" | "block" | "offset" | undefined;
        reverse?: boolean | undefined;
    }): Iterable<Point>;
    /**
     * Get the matching node in the branch of the document before a location.
     */
    previous<T_4 extends Node>(editor: Editor, options?: {
        at?: Range | Path | Point | undefined;
        match?: ((node: Node) => boolean) | ((node: Node) => node is T_4) | undefined;
        mode?: "highest" | "lowest" | "all" | undefined;
        voids?: boolean | undefined;
    }): NodeEntry<T_4> | undefined;
    /**
     * Get a range of a location.
     */
    range(editor: Editor, at: Location, to?: Range | Path | Point | undefined): Range;
    /**
     * Create a mutable ref for a `Range` object, which will stay in sync as new
     * operations are applied to the editor.
     */
    rangeRef(editor: Editor, range: Range, options?: {
        affinity?: "backward" | "forward" | "outward" | "inward" | null | undefined;
    }): RangeRef;
    /**
     * Get the set of currently tracked range refs of the editor.
     */
    rangeRefs(editor: Editor): Set<RangeRef>;
    /**
     * Remove a custom property from all of the leaf text nodes in the current
     * selection.
     *
     * If the selection is currently collapsed, the removal will be stored on
     * `editor.marks` and applied to the text inserted next.
     */
    removeMark(editor: Editor, key: string): void;
    /**
     * Get the start point of a location.
     */
    start(editor: Editor, at: Location): Point;
    /**
     * Get the text string content of a location.
     *
     * Note: the text of void nodes is presumed to be an empty string, regardless
     * of what their actual content is.
     */
    string(editor: Editor, at: Location): string;
    /**
     * Transform the editor by an operation.
     */
    transform(editor: Editor, op: Operation): void;
    /**
     * Convert a range into a non-hanging one.
     */
    unhangRange(editor: Editor, range: Range, options?: {
        voids?: boolean | undefined;
    }): Range;
    /**
     * Match a void node in the current branch of the editor.
     */
    void(editor: Editor, options?: {
        at?: Range | Path | Point | undefined;
        mode?: "highest" | "lowest" | undefined;
        voids?: boolean | undefined;
    }): NodeEntry<Element> | undefined;
    /**
     * Call a function, deferring normalization until after it completes.
     */
    withoutNormalizing(editor: Editor, fn: () => void): void;
};
//# sourceMappingURL=editor.d.ts.map