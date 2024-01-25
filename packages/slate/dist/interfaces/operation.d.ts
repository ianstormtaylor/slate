import { ExtendedType, Node, Path, Range } from '..';
export declare type BaseInsertNodeOperation = {
    type: 'insert_node';
    path: Path;
    node: Node;
};
export declare type InsertNodeOperation = ExtendedType<'InsertNodeOperation', BaseInsertNodeOperation>;
export declare type BaseInsertTextOperation = {
    type: 'insert_text';
    path: Path;
    offset: number;
    text: string;
};
export declare type InsertTextOperation = ExtendedType<'InsertTextOperation', BaseInsertTextOperation>;
export declare type BaseMergeNodeOperation = {
    type: 'merge_node';
    path: Path;
    position: number;
    properties: Partial<Node>;
};
export declare type MergeNodeOperation = ExtendedType<'MergeNodeOperation', BaseMergeNodeOperation>;
export declare type BaseMoveNodeOperation = {
    type: 'move_node';
    path: Path;
    newPath: Path;
};
export declare type MoveNodeOperation = ExtendedType<'MoveNodeOperation', BaseMoveNodeOperation>;
export declare type BaseRemoveNodeOperation = {
    type: 'remove_node';
    path: Path;
    node: Node;
};
export declare type RemoveNodeOperation = ExtendedType<'RemoveNodeOperation', BaseRemoveNodeOperation>;
export declare type BaseRemoveTextOperation = {
    type: 'remove_text';
    path: Path;
    offset: number;
    text: string;
};
export declare type RemoveTextOperation = ExtendedType<'RemoveTextOperation', BaseRemoveTextOperation>;
export declare type BaseSetNodeOperation = {
    type: 'set_node';
    path: Path;
    properties: Partial<Node>;
    newProperties: Partial<Node>;
};
export declare type SetNodeOperation = ExtendedType<'SetNodeOperation', BaseSetNodeOperation>;
export declare type BaseSetSelectionOperation = {
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
export declare type SetSelectionOperation = ExtendedType<'SetSelectionOperation', BaseSetSelectionOperation>;
export declare type BaseSplitNodeOperation = {
    type: 'split_node';
    path: Path;
    position: number;
    properties: Partial<Node>;
};
export declare type SplitNodeOperation = ExtendedType<'SplitNodeOperation', BaseSplitNodeOperation>;
export declare type NodeOperation = InsertNodeOperation | MergeNodeOperation | MoveNodeOperation | RemoveNodeOperation | SetNodeOperation | SplitNodeOperation;
export declare type SelectionOperation = SetSelectionOperation;
export declare type TextOperation = InsertTextOperation | RemoveTextOperation;
/**
 * `Operation` objects define the low-level instructions that Slate editors use
 * to apply changes to their internal state. Representing all changes as
 * operations is what allows Slate editors to easily implement history,
 * collaboration, and other features.
 */
export declare type BaseOperation = NodeOperation | SelectionOperation | TextOperation;
export declare type Operation = ExtendedType<'Operation', BaseOperation>;
export interface OperationInterface {
    isNodeOperation: (value: any) => value is NodeOperation;
    isOperation: (value: any) => value is Operation;
    isOperationList: (value: any) => value is Operation[];
    isSelectionOperation: (value: any) => value is SelectionOperation;
    isTextOperation: (value: any) => value is TextOperation;
    inverse: (op: Operation) => Operation;
}
export declare const Operation: OperationInterface;
//# sourceMappingURL=operation.d.ts.map