# History

The `History` object contains the undo and redo history for the editor.

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

It can be accessed from an `Editor` instance as the property `history`.

This property is only available on the `Editor` if it was instantiated using the `withHistory` method which adds undo/redo functionality to the Slate editor.
