# ReactEditor

`ReactEditor` is added to `Editor` when it is instantiated using the `withReact` method.

```typescript
const [editor] = useState(() => withReact(withHistory(createEditor())))
```

- [Static methods](react-editor.md#static-methods)
  - [Check methods](react-editor.md#check-methods)
  - [Focus and selection methods](react-editor.md#focus-and-selection-methods)
  - [DOM translation methods](react-editor.md#dom-translation-methods)
  - [DataTransfer methods](react-editor.md#datatransfer-methods)

## Static methods

### Check methods

#### `ReactEditor.isComposing(editor: ReactEditor): boolean`

Check if the user is currently composing inside the editor.

#### `ReactEditor.isFocused(editor: ReactEditor): boolean`

Check if the editor is focused.

#### `ReactEditor.isMounted(editor: ReactEditor): boolean`

Check if the editor is mounted, meaning it is rendered and has a DOM element. Methods that resolve DOM nodes, such as `toDOMNode`, throw for an editor that is not mounted.

#### `ReactEditor.isReadOnly(editor: ReactEditor): boolean`

Check if the editor is in read-only mode.

### Focus and selection methods

#### `ReactEditor.blur(editor: ReactEditor): void`

Blur the editor.

#### `ReactEditor.focus(editor: ReactEditor): void`

Focus the editor.

In tests that run in jsdom, use `ReactEditor.focus(editor)` instead of calling `focus()` on the editable element. `Editable` doesn't treat a native focus event in jsdom as a focus of the editor, partly because jsdom doesn't implement `isContentEditable`, so `ReactEditor.isFocused` and `useFocused` stay `false`. `ReactEditor.focus` sets the focused state itself.

#### `ReactEditor.deselect(editor: ReactEditor): void`

Deselect the editor.

### DOM translation methods

#### `ReactEditor.findKey(editor: ReactEditor, node: Node): Key`

Find a key for a Slate node.

Returns an instance of `Key` which looks like `{ id: string }`

#### `ReactEditor.findPath(editor: ReactEditor, node: Node): Path`

Find the path of Slate node.

#### `ReactEditor.hasDOMNode(editor: ReactEditor, target: DOMNode, options: { editable?: boolean } = {}): boolean`

Check if a DOM node is within the editor.

#### `ReactEditor.toDOMNode(editor: ReactEditor, node: Node): HTMLElement`

Find the native DOM element from a Slate node.

#### `ReactEditor.toDOMPoint(editor: ReactEditor, point: Point): DOMPoint`

Find a native DOM selection point from a Slate point.

#### `ReactEditor.toDOMRange(editor: ReactEditor, range: Range): DOMRange`

Find a native DOM range from a Slate `range`.

#### `ReactEditor.toSlateNode(editor: ReactEditor, domNode: DOMNode): Node`

Find a Slate node from a native DOM `element`.

#### `ReactEditor.findEventRange(editor: ReactEditor, event: any, options?: { suppressThrow?: boolean }): Range | null`

Get the target range from a DOM `event`. The range is resolved from the event's coordinates, which can point outside of the editor even when the event's target lies inside it; with `suppressThrow: true` this returns `null` instead of throwing in that case.

#### `ReactEditor.toSlatePoint(editor: ReactEditor, domPoint: DOMPoint): Point | null`

Find a Slate point from a DOM selection's `domNode` and `domOffset`.

#### `ReactEditor.toSlateRange(editor: ReactEditor, domRange: DOMRange | DOMStaticRange | DOMSelection, options?: { exactMatch?: boolean } = {}): Range | null`

Find a Slate range from a DOM range or selection.

### Word methods

#### `ReactEditor.getWord(editor: ReactEditor, options?: { at?: Point | Range, isWordCharacter?: (character: string) => boolean }): { range: Range, text: string } | undefined`

Like [`Editor.word`](../../api/nodes/editor.md), but while an input method is composing it reads the composing text from the DOM and uses the DOM caret when `at` isn't given. `text` is the word as currently shown. During a composition, `range` counts the composing characters, so it only matches the editor's value once the composition ends.

### DataTransfer methods

#### `ReactEditor.insertData(editor: ReactEditor, data: DataTransfer): void`

Insert data from a `DataTransfer` into the editor. This is a proxy method to call in this order `insertFragmentData(editor: ReactEditor, data: DataTransfer)` and then `insertTextData(editor: ReactEditor, data: DataTransfer)`.

#### `ReactEditor.insertFragmentData(editor: ReactEditor, data: DataTransfer): true`

Insert fragment data from a `DataTransfer` into the editor. Returns true if some content has been effectively inserted.

#### `ReactEditor.insertTextData(editor: ReactEditor, data: DataTransfer): true`

Insert text data from a `DataTransfer` into the editor. Returns true if some content has been effectively inserted.

#### `ReactEditor.setFragmentData(editor: ReactEditor, data: DataTransfer, originEvent?: 'drag' | 'copy' | 'cut'): void`

Sets data from the currently selected fragment on a `DataTransfer`.

#### `ReactEditor.resolveDOMPoint(editor: ReactEditor, point: Point): DOMPoint | null`

Like `toDOMPoint`, but returns `null` instead of throwing. A point that the settled DOM should contain but doesn't is reported through `editor.onDOMError`. While the DOM is still catching up with the model, a missing point is not reported.

#### `ReactEditor.resolveDOMRange(editor: ReactEditor, range: Range): DOMRange | null`

Like `toDOMRange`, but returns `null` instead of throwing, and reports the same way as `resolveDOMPoint`.

#### `ReactEditor.resolveEventRange(editor: ReactEditor, event: any): Range | null`

Like `findEventRange`, but returns `null` when the event doesn't map to a range in the editor.

## Instance methods

#### `editor.onDOMError(error: unknown): void`

Called when `resolveDOMPoint` or `resolveDOMRange`, which Slate's own handlers use, can't map the model to the DOM after rendering has settled. That usually means a broken rendering contract, such as a `renderElement` that doesn't render `children`. Lookups made while the DOM is still catching up, before the editor mounts or while a render is pending, return nothing quietly and are not reported. By default it hands the error to the browser's `reportError`, so it shows in the console and reaches `window.onerror`, without interrupting the handler. Override it to throw, or to send errors to your own logging:

```javascript
const { onDOMError } = editor
editor.onDOMError = error => {
  logger.warn(error)
  onDOMError(error)
}
```

`ReactEditor.toDOMPoint` and `ReactEditor.toDOMRange` still throw; use the `resolve` versions to get `null` instead.
