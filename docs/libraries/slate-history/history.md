# History

The `History` object contains the undo and redo history for the editor.

It can be accessed from an `Editor` instance as the property `history`.

This property is only available on the `Editor` if the editor was instantiated using the `withHistory` method which adds undo/redo functionality to the Slate editor.

```typescript
export interface History {
  redos: Batch[]
  undos: Batch[]
}

interface Batch {
  operations: Operation[]
  selectionBefore: Range | null
}
```

- [Static Methods](history.md#static-methods)

## Static Methods

#### `History.isHistory(value: any): value is History`

Returns `true` if the passed in `value` is a `History` object and also acts as a type guard for `History`.
