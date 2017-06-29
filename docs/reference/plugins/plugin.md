
# Plugins

Plugins can be attached to an editor to alter its behavior in different ways. Plugins are just simple Javascript objects, containing a set of properties that control different behaviors—event handling, change handling, rendering, etc.

Each editor has a "middleware stack" of plugins, which has a specific order.

When the editor needs to resolve a plugin-related handler, it will loop through its plugin stack, searching for the first plugin that successfully returns a value. After receiving that value, the editor will **not** continue to search the remaining plugins; it returns early.

- [Conventions](#conventions)
- [Event Handler Properties](#event-handle-properties)
  - [`onBeforeInput`](#onbeforeinput)
  - [`onBlur`](#onblur)
  - [`onFocus`](#onfocus)
  - [`onCopy`](#oncopy)
  - [`onCut`](#oncut)
  - [`onDrop`](#ondrop)
  - [`onKeyDown`](#onkeydown)
  - [`onPaste`](#onpaste)
  - [`onSelect`](#onselect)
- [Other Properties](#other-properties)
  - [`onChange`](#onchange)
  - [`onBeforeChange`](#onbeforechange)
  - [`render`](#render)
  - [`schema`](#schema)


## Conventions

A plugin should always export a function that takes options. This way even if it doesn't take any options now, it won't be a breaking API change to take more options in the future. So a basic plugin might look like this:

```js
export default function MySlatePlugin(options) {
  return {
    // Return properties that describe your logic here...
  }
}
```


## Event Handler Properties

```js
{
  onBeforeInput: Function,
  onBlur: Function,
  onFocus: Function,
  onCopy: Function,
  onCut: Function,
  onDrop: Function,
  onKeyDown: Function,
  onPaste: Function,
  onSelect: Function
}
```

All of the event handler properties are passed the same React `event` object you are used to from React's event handlers. They are also passed a `data` object with Slate-specific information relating to the event, the current `state` of the editor, and the `editor` instance itself.

Each event handler can choose to return a new `state` object, in which case the editor's state will be updated. If nothing is returned, the editor will simply continue resolving the plugin stack.

### `onBeforeInput`
`Function onBeforeInput(event: Event, data: Object, state: State, editor: Editor) => State || Void`

This handler is called right before a string of text is inserted into the `contenteditable` element.

Make sure to `event.preventDefault()` (and return `state`) if you do not want the default insertion behavior to occur! If no other plugin handles this event, it will be handled by the [Core plugin](./core.md).

### `onBlur`
`Function onBlur(event: Event, data: Object, state: State, editor: Editor) => State || Void`

This handler is called when the editor's `contenteditable` element is blurred.

If no other plugin handles this event, it will be handled by the [Core plugin](./core.md).

### `onFocus`
`Function onFocus(event: Event, data: Object, state: State, editor: Editor) => State || Void`

This handler is called when the editor's `contenteditable` element is focused.

If no other plugin handles this event, it will be handled by the [Core plugin](./core.md).

### `onCopy`
`Function onCopy(event: Event, data: Object, state: State, editor: Editor) => State || Void`

This handler is called when the editor's `contenteditable` element is blurred.

The `data` object contains a `type` string and associated data for that type. Right now the only type supported is `"fragment"`:

```js
{
  type: 'fragment',
  fragment: Document
}
```

If no other plugin handles this event, it will be handled by the [Core plugin](./core.md).

### `onCut`
`Function onCut(event: Event, data: Object, state: State, editor: Editor) => State || Void`

This handler is equivalent to the `onCopy` handler.

If no other plugin handles this event, it will be handled by the [Core plugin](./core.md).

### `onDrop`
`Function onDrop(event: Event, data: Object, state: State, editor: Editor) => State || Void`

This handler is called when the user drops content into the `contenteditable` element. The event is already prevented by default, so you must define a state change to have any affect occur.

The `data` object is a convenience object created to standardize the drop metadata across browsers. Every data object has a `type` property, which can be one of `text`, `html` or `files`, and a `target` property which is a [`Selection`](../models/selection.md) indicating where the drop occurred. Depending on the type, its structure will be:

```js
{
  type: 'text',
  target: Selection,
  text: String
}

{
  type: 'html',
  target: Selection,
  text: String,
  html: String
}

{
  type: 'files',
  target: Selection,
  files: FileList
}
```

If no other plugin handles this event, it will be handled by the [Core plugin](./core.md).

### `onKeyDown`
`Function onKeyDown(event: Event, data: Object, state: State, editor: Editor) => State || Void`

This handler is called when any key is pressed in the `contenteditable` element, before any action is taken.

The `data` object contains the `key` which is a string name of the key that was pressed, as well as it's `code`. It also contains a series of helpful utility properties for determining hotkey logic. For example, `isCtrl` which is true if the `control` key was pressed, or

```js
{
  key: String,
  code: Number,
  isAlt: Boolean,
  isCmd: Boolean,
  isCtrl: Boolean,
  isLine: Boolean,
  isMeta: Boolean,
  isMod: Boolean,
  isModAlt: Boolean,
  isShift: Boolean,
  isWord: Boolean
}
```

The `isMod` boolean is `true` if the `control` key was pressed on Windows or the `command` key was pressed on Mac _without_ the `alt/option` key also being pressed. This is a convenience for adding hotkeys like `command+b`.

The `isModAlt` boolean is `true` if the `control` key was pressed on Windows or the `command` key was pressed on Mac _and_ the `alt/option` key was also being pressed. This is a convenience for secondary hotkeys like `command+option+1`.

The `isLine` and `isWord` booleans represent whether the "line modifier" or "word modifier" hotkeys are pressed when deleting or moving the cursor. For example, on a Mac `option + right` moves the cursor to the right one word at a time.

Make sure to `event.preventDefault()` (and return `state`) if you do not want the default insertion behavior to occur! If no other plugin handles this event, it will be handled by the [Core plugin](./core.md).

### `onPaste`
`Function onPaste(event: Event, data: Object, state: State, editor: Editor) => State || Void`

This handler is called when the user pastes content into the `contenteditable` element. The event is already prevented by default, so you must define a state change to have any affect occur.

The `data` object is a convenience object created to standardize the paste metadata across browsers. Every data object has a `type` property, which can be one of `text`, `html` or `files`. Depending on the type, it's structure will be:

```js
{
  type: 'text',
  text: String
}

{
  type: 'html',
  text: String,
  html: String
}

{
  type: 'files',
  files: FileList
}
```

If no other plugin handles this event, it will be handled by the [Core plugin](./core.md).

### `onSelect`
`Function onSelect(event: Event, data: Object, state: State, editor: Editor) => State || Void`

This handler is called whenever the native DOM selection changes. 

The `data` object contains a State [`Selection`](../models/selection.md) object representing the new selection.

If no other plugin handles this event, it will be handled by the [Core plugin](./core.md).

_Note: This is **not** Slate's internal selection representation (although it mirrors it). If you want to get notified when Slate's selection changes, use the [`onSelectionChange`](../components/editor.md#onselectionchange) property of the `<Editor>`. This handler is instead meant to give you lower-level access to the DOM selection handling._


## Other Properties

```js
{
  onChange: Function
}
```

### `onChange`
`Function onChange(state: State) => State || Void`

The `onChange` handler isn't a native browser event handler. Instead, it is invoked whenever the editor state changes. Returning a new state will update the editor's state, continuing down the plugin stack.

Unlike the native event handlers, results from the `onChange` handler **are cumulative**! This means that every plugin in the stack that defines an `onChange` handler will have its handler resolved for every change the editor makes; the editor will not return early after the first plugin's handler is called.

This allows you to stack up changes across the entire plugin stack.

### `onBeforeChange`
`Function onBeforeChange(state: State) => State || Void`

The `onBeforeChange` handler isn't a native browser event handler. Instead, it is invoked whenever the editor receives a new state and before propagating a new state to `onChange`. Returning a new state will update the editor's state before rendering, continuing down the plugin stack.

Like `onChange`, `onBeforeChange` is cumulative.

### `render`
`Function render(props: Object, state: State, editor: Editor) => Object || Void`

The `render` property allows you to define higher-order-component-like behavior. It is passed all of the properties of the editor, including `props.children`. You can then choose to wrap the existing `children` in any custom elements or proxy the properties however you choose. This can be useful for rendering toolbars, styling the editor, rendering validation, etc. Remember that the `render` function has to render `props.children` for editor's children to render.

### `schema`
`Object`

The `schema` property allows you to define a set of rules that will be added to the editor's schema. The rules from each of the schemas returned by the plugins are collected into a single schema for the editor, and the rules are applied in the same order as the plugin stack.
