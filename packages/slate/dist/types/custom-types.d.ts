/**
 * Extendable Custom Types Interface
 */
type ExtendableTypes = 'Editor' | 'Element' | 'Text' | 'Selection' | 'Range' | 'Point' | 'Operation' | 'InsertNodeOperation' | 'InsertTextOperation' | 'MergeNodeOperation' | 'MoveNodeOperation' | 'RemoveNodeOperation' | 'RemoveTextOperation' | 'SetNodeOperation' | 'SetSelectionOperation' | 'SplitNodeOperation';
export interface CustomTypes {
    [key: string]: unknown;
}
export type ExtendedType<K extends ExtendableTypes, B> = unknown extends CustomTypes[K] ? B : CustomTypes[K];
export {};
//# sourceMappingURL=custom-types.d.ts.map