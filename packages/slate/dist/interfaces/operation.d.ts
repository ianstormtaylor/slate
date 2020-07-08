import { Node, Path, Range } from '..';
export declare type InsertNodeOperation = {
    type: 'insert_node';
    path: Path;
    node: Node;
    [key: string]: unknown;
};
export declare type InsertTextOperation = {
    type: 'insert_text';
    path: Path;
    offset: number;
    text: string;
    [key: string]: unknown;
};
export declare type MergeNodeOperation = {
    type: 'merge_node';
    path: Path;
    position: number;
    properties: Partial<Node>;
    [key: string]: unknown;
};
export declare type MoveNodeOperation = {
    type: 'move_node';
    path: Path;
    newPath: Path;
    [key: string]: unknown;
};
export declare type RemoveNodeOperation = {
    type: 'remove_node';
    path: Path;
    node: Node;
    [key: string]: unknown;
};
export declare type RemoveTextOperation = {
    type: 'remove_text';
    path: Path;
    offset: number;
    text: string;
    [key: string]: unknown;
};
export declare type SetNodeOperation = {
    type: 'set_node';
    path: Path;
    properties: Partial<Node>;
    newProperties: Partial<Node>;
    [key: string]: unknown;
};
export declare type SetSelectionOperation = {
    type: 'set_selection';
    [key: string]: unknown;
    properties: null;
    newProperties: Range;
} | {
    type: 'set_selection';
    [key: string]: unknown;
    properties: Partial<Range>;
    newProperties: Partial<Range>;
} | {
    type: 'set_selection';
    [key: string]: unknown;
    properties: Range;
    newProperties: null;
};
export declare type SplitNodeOperation = {
    type: 'split_node';
    path: Path;
    position: number;
    properties: Partial<Node>;
    [key: string]: unknown;
};
export declare type NodeOperation = InsertNodeOperation | MergeNodeOperation | MoveNodeOperation | RemoveNodeOperation | SetNodeOperation | SplitNodeOperation;
export declare type SelectionOperation = SetSelectionOperation;
export declare type TextOperation = InsertTextOperation | RemoveTextOperation;
/**
 * `Operation` objects define the low-level instructions that Slate editors use
 * to apply changes to their internal state. Representing all changes as
 * operations is what allows Slate editors to easily implement history,
 * collaboration, and other features.
 */
export declare type Operation = NodeOperation | SelectionOperation | TextOperation;
export declare const Operation: {
    /**
     * Check of a value is a `NodeOperation` object.
     */
    isNodeOperation(value: any): value is NodeOperation;
    /**
     * Check of a value is an `Operation` object.
     */
    isOperation(value: any): value is Operation;
    /**
     * Check if a value is a list of `Operation` objects.
     */
    isOperationList(value: any): value is Operation[];
    /**
     * Check of a value is a `SelectionOperation` object.
     */
    isSelectionOperation(value: any): value is SetSelectionOperation;
    /**
     * Check of a value is a `TextOperation` object.
     */
    isTextOperation(value: any): value is TextOperation;
    /**
     * Invert an operation, returning a new operation that will exactly undo the
     * original when applied.
     */
    inverse(op: Operation): Operation;
};
//# sourceMappingURL=operation.d.ts.map