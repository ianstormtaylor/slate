import { ExtendedType, Node, Path, Range } from '..';
export type BaseInsertNodeOperation = {
    type: 'insert_node';
    path: Path;
    node: Node;
};
export type InsertNodeOperation = ExtendedType<'InsertNodeOperation', BaseInsertNodeOperation>;
export type BaseInsertTextOperation = {
    type: 'insert_text';
    path: Path;
    offset: number;
    text: string;
};
export type InsertTextOperation = ExtendedType<'InsertTextOperation', BaseInsertTextOperation>;
export type BaseMergeNodeOperation = {
    type: 'merge_node';
    path: Path;
    position: number;
    properties: Partial<Node>;
};
export type MergeNodeOperation = ExtendedType<'MergeNodeOperation', BaseMergeNodeOperation>;
export type BaseMoveNodeOperation = {
    type: 'move_node';
    path: Path;
    newPath: Path;
};
export type MoveNodeOperation = ExtendedType<'MoveNodeOperation', BaseMoveNodeOperation>;
export type BaseRemoveNodeOperation = {
    type: 'remove_node';
    path: Path;
    node: Node;
};
export type RemoveNodeOperation = ExtendedType<'RemoveNodeOperation', BaseRemoveNodeOperation>;
export type BaseRemoveTextOperation = {
    type: 'remove_text';
    path: Path;
    offset: number;
    text: string;
};
export type RemoveTextOperation = ExtendedType<'RemoveTextOperation', BaseRemoveTextOperation>;
export type BaseSetNodeOperation = {
    type: 'set_node';
    path: Path;
    properties: Partial<Node>;
    newProperties: Partial<Node>;
};
export type SetNodeOperation = ExtendedType<'SetNodeOperation', BaseSetNodeOperation>;
export type BaseSetSelectionOperation = {
    type: 'set_selection';
    properties: null;
    newProperties: Range;
} | {
    type: 'set_selection';
    properties: Partial<Range>;
    newProperties: Partial<Range>;
} | {
    type: 'set_selection';
    properties: Range;
    newProperties: null;
};
export type SetSelectionOperation = ExtendedType<'SetSelectionOperation', BaseSetSelectionOperation>;
export type BaseSplitNodeOperation = {
    type: 'split_node';
    path: Path;
    position: number;
    properties: Partial<Node>;
};
export type SplitNodeOperation = ExtendedType<'SplitNodeOperation', BaseSplitNodeOperation>;
export type NodeOperation = InsertNodeOperation | MergeNodeOperation | MoveNodeOperation | RemoveNodeOperation | SetNodeOperation | SplitNodeOperation;
export type SelectionOperation = SetSelectionOperation;
export type TextOperation = InsertTextOperation | RemoveTextOperation;
/**
 * `Operation` objects define the low-level instructions that Slate editors use
 * to apply changes to their internal state. Representing all changes as
 * operations is what allows Slate editors to easily implement history,
 * collaboration, and other features.
 */
export type BaseOperation = NodeOperation | SelectionOperation | TextOperation;
export type Operation = ExtendedType<'Operation', BaseOperation>;
export interface OperationInterface {
    /**
     * Check if a value is a `NodeOperation` object.
     */
    isNodeOperation: (value: any) => value is NodeOperation;
    /**
     * Check if a value is an `Operation` object.
     */
    isOperation: (value: any) => value is Operation;
    /**
     * Check if a value is a list of `Operation` objects.
     */
    isOperationList: (value: any) => value is Operation[];
    /**
     * Check if a value is a `SelectionOperation` object.
     */
    isSelectionOperation: (value: any) => value is SelectionOperation;
    /**
     * Check if a value is a `TextOperation` object.
     */
    isTextOperation: (value: any) => value is TextOperation;
    /**
     * Invert an operation, returning a new operation that will exactly undo the
     * original when applied.
     */
    inverse: (op: Operation) => Operation;
}
export declare const Operation: OperationInterface;
//# sourceMappingURL=operation.d.ts.map