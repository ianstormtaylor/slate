import { Ancestor, ExtendedType, Location, Node, NodeEntry, Operation, Path, PathRef, Point, PointRef, Range, RangeRef, Span, Text } from '..';
import { Descendant } from './node';
import { Element } from './element';
import { LeafEdge, SelectionMode, TextDirection, TextUnit, TextUnitAdjustment, RangeDirection, MaximizeMode } from './types';
export declare type BaseSelection = Range | null;
export declare type Selection = ExtendedType<'Selection', BaseSelection>;
export declare type EditorMarks = Omit<Text, 'text'>;
/**
 * The `Editor` interface stores all the state of a Slate editor. It is extended
 * by plugins that wish to add their own helpers and implement new behaviors.
 */
export interface BaseEditor {
    children: Descendant[];
    selection: Selection;
    operations: Operation[];
    marks: EditorMarks | null;
    isInline: (element: Element) => boolean;
    isVoid: (element: Element) => boolean;
    normalizeNode: (entry: NodeEntry) => void;
    onChange: () => void;
    addMark: (key: string, value: any) => void;
    apply: (operation: Operation) => void;
    deleteBackward: (unit: TextUnit) => void;
    deleteForward: (unit: TextUnit) => void;
    deleteFragment: (direction?: TextDirection) => void;
    getFragment: () => Descendant[];
    insertBreak: () => void;
    insertSoftBreak: () => void;
    insertFragment: (fragment: Node[]) => void;
    insertNode: (node: Node) => void;
    insertText: (text: string) => void;
    removeMark: (key: string) => void;
}
export declare type Editor = ExtendedType<'Editor', BaseEditor>;
export interface EditorAboveOptions<T extends Ancestor> {
    at?: Location;
    match?: NodeMatch<T>;
    mode?: MaximizeMode;
    voids?: boolean;
}
export interface EditorAfterOptions {
    distance?: number;
    unit?: TextUnitAdjustment;
    voids?: boolean;
}
export interface EditorBeforeOptions {
    distance?: number;
    unit?: TextUnitAdjustment;
    voids?: boolean;
}
export interface EditorDirectedDeletionOptions {
    unit?: TextUnit;
}
export interface EditorFragmentDeletionOptions {
    direction?: TextDirection;
}
export interface EditorLeafOptions {
    depth?: number;
    edge?: LeafEdge;
}
export interface EditorLevelsOptions<T extends Node> {
    at?: Location;
    match?: NodeMatch<T>;
    reverse?: boolean;
    voids?: boolean;
}
export interface EditorNextOptions<T extends Descendant> {
    at?: Location;
    match?: NodeMatch<T>;
    mode?: SelectionMode;
    voids?: boolean;
}
export interface EditorNodeOptions {
    depth?: number;
    edge?: LeafEdge;
}
export interface EditorNodesOptions<T extends Node> {
    at?: Location | Span;
    match?: NodeMatch<T>;
    mode?: SelectionMode;
    universal?: boolean;
    reverse?: boolean;
    voids?: boolean;
}
export interface EditorNormalizeOptions {
    force?: boolean;
}
export interface EditorParentOptions {
    depth?: number;
    edge?: LeafEdge;
}
export interface EditorPathOptions {
    depth?: number;
    edge?: LeafEdge;
}
export interface EditorPathRefOptions {
    affinity?: TextDirection | null;
}
export interface EditorPointOptions {
    edge?: LeafEdge;
}
export interface EditorPointRefOptions {
    affinity?: TextDirection | null;
}
export interface EditorPositionsOptions {
    at?: Location;
    unit?: TextUnitAdjustment;
    reverse?: boolean;
    voids?: boolean;
}
export interface EditorPreviousOptions<T extends Node> {
    at?: Location;
    match?: NodeMatch<T>;
    mode?: SelectionMode;
    voids?: boolean;
}
export interface EditorRangeRefOptions {
    affinity?: RangeDirection | null;
}
export interface EditorStringOptions {
    voids?: boolean;
}
export interface EditorUnhangRangeOptions {
    voids?: boolean;
}
export interface EditorVoidOptions {
    at?: Location;
    mode?: MaximizeMode;
    voids?: boolean;
}
export interface EditorInterface {
    above: <T extends Ancestor>(editor: Editor, options?: EditorAboveOptions<T>) => NodeEntry<T> | undefined;
    addMark: (editor: Editor, key: string, value: any) => void;
    after: (editor: Editor, at: Location, options?: EditorAfterOptions) => Point | undefined;
    before: (editor: Editor, at: Location, options?: EditorBeforeOptions) => Point | undefined;
    deleteBackward: (editor: Editor, options?: EditorDirectedDeletionOptions) => void;
    deleteForward: (editor: Editor, options?: EditorDirectedDeletionOptions) => void;
    deleteFragment: (editor: Editor, options?: EditorFragmentDeletionOptions) => void;
    edges: (editor: Editor, at: Location) => [Point, Point];
    end: (editor: Editor, at: Location) => Point;
    first: (editor: Editor, at: Location) => NodeEntry;
    fragment: (editor: Editor, at: Location) => Descendant[];
    hasBlocks: (editor: Editor, element: Element) => boolean;
    hasInlines: (editor: Editor, element: Element) => boolean;
    hasPath: (editor: Editor, path: Path) => boolean;
    hasTexts: (editor: Editor, element: Element) => boolean;
    insertBreak: (editor: Editor) => void;
    insertSoftBreak: (editor: Editor) => void;
    insertFragment: (editor: Editor, fragment: Node[]) => void;
    insertNode: (editor: Editor, node: Node) => void;
    insertText: (editor: Editor, text: string) => void;
    isBlock: (editor: Editor, value: any) => value is Element;
    isEditor: (value: any) => value is Editor;
    isEnd: (editor: Editor, point: Point, at: Location) => boolean;
    isEdge: (editor: Editor, point: Point, at: Location) => boolean;
    isEmpty: (editor: Editor, element: Element) => boolean;
    isInline: (editor: Editor, value: any) => value is Element;
    isNormalizing: (editor: Editor) => boolean;
    isStart: (editor: Editor, point: Point, at: Location) => boolean;
    isVoid: (editor: Editor, value: any) => value is Element;
    last: (editor: Editor, at: Location) => NodeEntry;
    leaf: (editor: Editor, at: Location, options?: EditorLeafOptions) => NodeEntry<Text>;
    levels: <T extends Node>(editor: Editor, options?: EditorLevelsOptions<T>) => Generator<NodeEntry<T>, void, undefined>;
    marks: (editor: Editor) => Omit<Text, 'text'> | null;
    next: <T extends Descendant>(editor: Editor, options?: EditorNextOptions<T>) => NodeEntry<T> | undefined;
    node: (editor: Editor, at: Location, options?: EditorNodeOptions) => NodeEntry;
    nodes: <T extends Node>(editor: Editor, options?: EditorNodesOptions<T>) => Generator<NodeEntry<T>, void, undefined>;
    normalize: (editor: Editor, options?: EditorNormalizeOptions) => void;
    parent: (editor: Editor, at: Location, options?: EditorParentOptions) => NodeEntry<Ancestor>;
    path: (editor: Editor, at: Location, options?: EditorPathOptions) => Path;
    pathRef: (editor: Editor, path: Path, options?: EditorPathRefOptions) => PathRef;
    pathRefs: (editor: Editor) => Set<PathRef>;
    point: (editor: Editor, at: Location, options?: EditorPointOptions) => Point;
    pointRef: (editor: Editor, point: Point, options?: EditorPointRefOptions) => PointRef;
    pointRefs: (editor: Editor) => Set<PointRef>;
    positions: (editor: Editor, options?: EditorPositionsOptions) => Generator<Point, void, undefined>;
    previous: <T extends Node>(editor: Editor, options?: EditorPreviousOptions<T>) => NodeEntry<T> | undefined;
    range: (editor: Editor, at: Location, to?: Location) => Range;
    rangeRef: (editor: Editor, range: Range, options?: EditorRangeRefOptions) => RangeRef;
    rangeRefs: (editor: Editor) => Set<RangeRef>;
    removeMark: (editor: Editor, key: string) => void;
    setNormalizing: (editor: Editor, isNormalizing: boolean) => void;
    start: (editor: Editor, at: Location) => Point;
    string: (editor: Editor, at: Location, options?: EditorStringOptions) => string;
    unhangRange: (editor: Editor, range: Range, options?: EditorUnhangRangeOptions) => Range;
    void: (editor: Editor, options?: EditorVoidOptions) => NodeEntry<Element> | undefined;
    withoutNormalizing: (editor: Editor, fn: () => void) => void;
}
export declare const Editor: EditorInterface;
/**
 * A helper type for narrowing matched nodes with a predicate.
 */
export declare type NodeMatch<T extends Node> = ((node: Node, path: Path) => node is T) | ((node: Node, path: Path) => boolean);
export declare type PropsCompare = (prop: Partial<Node>, node: Partial<Node>) => boolean;
export declare type PropsMerge = (prop: Partial<Node>, node: Partial<Node>) => object;
//# sourceMappingURL=editor.d.ts.map