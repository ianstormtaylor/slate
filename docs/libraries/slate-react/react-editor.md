# ReactEditor

`ReactEditor` is added to `Editor` when it is instntiated using the `withReact` method.

```typescript
const [editor] = useState(() => withReact(withHistory(createEditor())))
```

- [Static methods](react-editor.md#static-methods)
  - [Check methods](react-editor.md#check-methods)
  - [Focus and selection methods](react-editor.md#focus-and-selection-methods)
  - [DOM translation methods](react-editor.md#dom-translation-methods)
  - [DataTranfer methods](react-editor.md#datatransfer-methods)

## Static methods

### Check methods

#### `ReactEditor.isComposing(editor: ReactEditor)`

Check if the user is currently composing inside the editor.

#### `ReactEditor.isFocused(editor: ReactEditor)`

Check if the editor is focused.

#### `ReactEditor.isReadOnly(editor: ReactEditor)`

Check if the editor is in read-only mode.

### Focus and selection methods

#### `ReactEditor.blur(editor: ReactEditor)`

Blur the editor.

#### `ReactEditor.focus(editor: ReactEditor)`

Focus the editor.

#### `ReactEditor.deselect(editor: ReactEditor)`

Deselect the editor.

### DOM translation methods

#### `ReactEditor.findKey(editor: ReactEditor, node: Node)`

Find a key for a Slate node.

#### `ReactEditor.findPath(editor: ReactEditor, node: Node)`

Find the path of Slate node.

#### `ReactEditor.hasDOMNode(editor: ReactEditor, target: DOMNode, options: { editable?: boolean } = {})`

Check if a DOM node is within the editor.

#### `ReactEditor.toDOMNode(editor: ReactEditor, node: Node)`

Find the native DOM element from a Slate node.

#### `ReactEditor.toDOMPoint(editor: ReactEditor, point: Point)`

Find a native DOM selection point from a Slate point.

#### `ReactEditor.toDOMRange(editor: ReactEditor, range: Range)`

Find a native DOM range from a Slate `range`.

#### `ReactEditor.toSlateNode(editor: ReactEditor, domNode: DOMNode)`

Find a Slate node from a native DOM `element`.

#### `ReactEditor.findEventRange(editor: ReactEditor, event: any)`

Get the target range from a DOM `event`.

#### `ReactEditor.toSlatePoint(editor: ReactEditor, domPoint: DOMPoint)`

Find a Slate point from a DOM selection's `domNode` and `domOffset`.

#### `ReactEditor.toSlateRange(editor: ReactEditor, domRange: DOMRange | DOMStaticRange | DOMSelection, options?: { exactMatch?: boolean } = {})`

Find a Slate range from a DOM range or selection.

### DataTransfer methods

#### `ReactEditor.insertData(editor: ReactEditor, data: DataTransfer)`

Insert data from a `DataTransfer` into the editor. This is a proxy method to call in this order `insertFragmentData(editor: ReactEditor, data: DataTransfer)` and then `insertTextData(editor: ReactEditor, data: DataTransfer)`.

#### `ReactEditor.insertFragmentData(editor: ReactEditor, data: DataTransfer)`

Insert fragment data from a `DataTransfer` into the editor. Returns true if some content has been effectively inserted.

#### `ReactEditor.insertTextData(editor: ReactEditor, data: DataTransfer)`

Insert text data from a `DataTransfer` into the editor. Returns true if some content has been effectively inserted.

#### `ReactEditor.setFragmentData(editor: ReactEditor, data: DataTransfer, originEvent?: 'drag' | 'copy' | 'cut')`

Sets data from the currently selected fragment on a `DataTransfer`.
