# Plugins

Plugins can be attached to an editor to alter its behavior in different ways. Each editor has a "stack" of plugins, which has a specific order, which it runs through when certain hooks are triggered.

Plugins are plain JavaScript objects, containing a set of middleware functions that run for each hook they choose to implement.

## Hooks

In addition to the [core plugin hooks](../slate/plugins.md), when using `slate-react` there are additional browser-specific event handling hooks, and React-specific rendering hooks available to plugins.

```js
{
  decorateNode: Function,
  onBeforeInput: Function,
  onBlur: Function,
  onCopy: Function,
  onCut: Function,
  onDrop: Function,
  onFocus: Function,
  onKeyDown: Function,
  onKeyUp: Function,
  onPaste: Function,
  onSelect: Function,
  renderEditor: Function,
  renderMark: Function,
  renderNode: Function,
  shouldNodeComponentUpdate: Function,
}
```

The event hooks have a signature of `(event, editor, next)`—the `event` is a React object that you are used to from React's event handlers.

The rendering hooks are just like render props common to other React API's, and receive `(props, editor, next)`. For more information, see the [Rendering](./rendering.md) reference.

### `decorateNode`

`Function decorateNode(node: Node, editor: Editor, next: Function) => Array<Decoration>|Void`

The `decorateNode` hook takes a `node` and returns an array of decorations with marks to be applied to the node when it is rendered.

### `onBeforeInput`

`Function onBeforeInput(event: Event, editor: Editor, next: Function) => Boolean`

This handler is called right before a string of text is inserted into the `contenteditable` element.

Make sure to `event.preventDefault()` if you do not want the default insertion behavior to occur!

### `onBlur`

`Function onBlur(event: Event, editor: Editor, next: Function) => Boolean`

This handler is called when the editor's `contenteditable` element is blurred.

### `onFocus`

`Function onFocus(event: Event, editor: Editor, next: Function) => Boolean`

This handler is called when the editor's `contenteditable` element is focused.

### `onCopy`

`Function onCopy(event: Event, editor: Editor, next: Function) => Boolean`

This handler is called when there is a copy event in the editor's `contenteditable` element.

### `onCut`

`Function onCut(event: Event, editor: Editor, next: Function) => Boolean`

This handler is equivalent to the `onCopy` handler.

### `onDrop`

`Function onDrop(event: Event, editor: Editor, next: Function) => Boolean`

This handler is called when the user drops content into the `contenteditable` element. The event is already prevented by default, so you must define a value change to have any affect occur.

### `onKeyDown`

`Function onKeyDown(event: Event, editor: Editor, next: Function) => Boolean`

This handler is called when any key is pressed in the `contenteditable` element, before any action is taken.

Make sure to `event.preventDefault()` if you do not want the default insertion behavior to occur!

### `onKeyUp`

`Function onKeyUp(event: Event, editor: Editor, next: Function) => Boolean`

This handler is called when any key is released in the `contenteditable` element.

### `onPaste`

`Function onPaste(event: Event, editor: Editor, next: Function) => Boolean`

This handler is called when the user pastes content into the `contenteditable` element. The event is already prevented by default, so you must define a value change to have any affect occur.

### `onSelect`

`Function onSelect(event: Event, editor: Editor, next: Function) => Boolean`

This handler is called whenever the native DOM selection changes.

> 🤖 This is **not** Slate's internal selection representation. If you want to get notified when Slate's `value.selection` changes, use the [`onChange`](../slate-react/editor.md#onchange) property of the `<Editor>`. This handler is instead meant to give you lower-level access to the DOM selection handling, which **is not always triggered** as you'd expect.

### `renderEditor`

`Function renderEditor(props: Object, editor: Editor, next: Function) => ReactNode|Void`

The `renderEditor` property allows you to define higher-order-component-like behavior. It is passed all of the properties of the editor, including `props.children`. You can then choose to wrap the existing `children` in any custom elements or proxy the properties however you choose. This can be useful for rendering toolbars, styling the editor, rendering validation, etc. Remember that the `renderEditor` function has to render `props.children` for editor's content to render.

### `renderMark`

`Function renderMark(props: Object, editor: Editor, next: Function) => ReactNode|Void`

Render a `Mark` with `props`. The `props` object contains:

```js
{
  attributes: Object,
  children: ReactNode,
  editor: Editor,
  mark: Mark,
  marks: Set<Mark>,
  node: Node,
  offset: Number,
  text: String,
}
```

You must spread the `props.attributes` onto the top-level DOM node you use to render the mark.

### `renderNode`

`Function renderNode(props: Object, editor: Editor, next: Function) => ReactNode|Void`

Render a `Node` with `props`. The `props` object contains:

```js
{
  attributes: Object,
  children: ReactNode,
  editor: Editor,
  isFocused: Boolean,
  isSelected: BOolean,
  node: Node,
  parent: Node,
  readOnly: Boolean,
}
```

You must spread the `props.attributes` onto the top-level DOM node you use to render the node.

### `shouldNodeComponentUpdate`

`Function shouldNodeComponentUpdate(previousProps: Object, props: Object, editor: Editor, next: Function) => Boolean|Void`

If this function returns `true`, it can force updating the node's component where otherwise it wouldn't for performance.
