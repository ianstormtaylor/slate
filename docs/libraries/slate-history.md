# Slate History

This sub-library tracks changes to the Slate value state over time, and enables undo and redo functionality.

## `withHistory`

The `withHistory` plugin adds the `HistoryEditor` to an `Editor` instance and keeps track of the operation history of a Slate editor as operations are applied to it, using undo and redo stacks.

When used with `withReact`, `withHistory` should be applied inside. For example:

```javascript
const [editor] = useState(() => withReact(withHistory(createEditor())))
```

## [`HistoryEditor`](../history/history-editor.md)

`HistoryEditor` is the Editor with history related methods and the `History` object property. It also contains static helpers for history-enabled editors.

## [`History`](../history/history.md)

`History` objects accessed at `editor.history` on a `HistoryEditor` holds all of the operations that are applied to a value, so they can be undone or redone as necessary.
