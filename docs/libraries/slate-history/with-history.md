# withHistory

The `withHistory` plugin adds the `HistoryEditor` to an `Editor` instance and keeps track of the operation history of a Slate editor as operations are applied to it, using undo and redo stacks.

#### `withHistory<T extends Editor>(editor: T): T & HistoryEditor`

Add `HistoryEditor` interface to an instance of any `Editor`.

When used with `withReact`, `withHistory` should be applied inside. For example:

```javascript
const [editor] = useState(() => withReact(withHistory(createEditor())))
```
