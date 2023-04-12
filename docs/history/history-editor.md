# History Editor

The `HistoryEditor` interface is added to the `Editor` when it is instantiated using the `withHistory` method.

```typescript
const [editor] = useState(() => withReact(withHistory(createEditor())))
```

This adds properties to `editor` that enables undo and redo in Slate.

There are also static methods for working with the Editor's undo/redo history.

```typescript
export interface HistoryEditor extends BaseEditor {
  history: History
  undo: () => void
  redo: () => void
  writeHistory: (stack: 'undos' | 'redos', batch: any) => void
}
```

- [Static methods](history-editor.md#static-methods)
  - [Undo and Redo](history-editor.md#undo-and-redo)
  - [Merging and Saving](history-editor.md#merging-and-saving)
  - [Check methods](history-editor.md#check-methods)
- [Instance methods](history-editor.md#instance-methods)

## Static methods

### Undo and Redo

#### `HistoryEditor.redo(editor: HistoryEditor): void`

Redo to the next saved state.

#### `HistoryEditor.undo(editor: HistoryEditor): void`

Undo to the previous saved state.

### Merging and Saving

#### `HistoryEditor.withoutMerging(editor: HistoryEditor, fn: () => void): void`

Apply a series of changes inside a synchronous `fn`, without merging any of
the new operations into previous save point in the history.

#### `HistoryEditor.withoutSaving(editor: HistoryEditor, fn: () => void): void`

Apply a series of changes inside a synchronous `fn`, without saving any of
their operations into the history.

### Check methods

#### `HistoryEditor.isHistoryEditor(value: any): value is HistoryEditor`

Check if a value is a `HistoryEditor` (i.e. it has the `HistoryEditor` interface).

#### `HistoryEditor.isMerging(editor: HistoryEditor): boolean | undefined`

Get the merge flag's current value.

#### `HistoryEditor.isSaving(editor: HistoryEditor): boolean | undefined`

Get the saving flag's current value.

## Instance methods

#### `undo(): void`

Undo the last batch of operations

#### `redo(): void`

Redo the last undone batch of operations

#### `writeHistory(stack: 'undos'| 'redos', batch: any) => void`

Push a batch of operations as either `undos` or `redos` onto `editor.undos` or `editor.redos`
