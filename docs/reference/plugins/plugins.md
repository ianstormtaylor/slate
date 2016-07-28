
# Plugins

Plugins can be attached to an editor to alter its behavior in different ways. Plugins are just simple Javascript objects, containing a set of properties that control different behaviors—event handling, change handling, rendering, etc.

Each editor has a "middleware stack" of plugins, which has a specific order.

When the editor needs to resolve a plugin-related handler, it will loop through its plugin stack, searching for the first plugin that successfully returns a value. After receiving that value, the editor will **not** continue to search the remaining plugins; it returns early.

- [Conventions](#conventions)
- [Event Handler Properties](#event-handle-properties)
  - [`onBeforeInput`](#onbeforeinput)
  - [`onBlur`](#onblur)
  - [`onCopy`](#oncopy)
  - [`onCut`](#oncut)
  - [`onDrop`](#ondrop)
  - [`onKeyDown`](#onkeydown)
  - [`onPaste`](#onpaste)
  - [`onSelect`](#onselect)
- [Renderer Properties](#renderer-properties)
  - [`renderDecorations`](#renderdecorations)
  - [`renderMark`](#rendermark)
  - [`renderNode`](#rendernode)
- [Other Properties](#other-properties)
  - [`onChange`](#onchange)


## Conventions

A plugin should always export a function that takes options. This way even if it doesn't take any options now, it won't be a breaking API change to take more options in the future. So a basic plugin might look like this:

```js
export default MySlatePlugin(options) {
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

Make sure to `event.preventDefault()` if you do not want the default insertion behavior to occur! If no other plugin handles this event, it will be handled by the [Core plugin](./core.md).

### `onBlur`
`Function onBlur(event: Event, data: Object, state: State, editor: Editor) => State || Void`

This handler is called when the editor's `contenteditable` element is blurred.

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

The `data` object is a convenience object created to standardize the drop metadata across browsers. Every data object has a `type` property, can be one of `text`, `html` or `files`, and a `target` property which is a [`Selection`](../models/selection.md) indicating where the drop occured. Depending on the type, it's structure will be:

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

The `data` object contains the `key` which is a string name of the key that was pressed, as well as it's `code`. It also contains a series of helpful utility properties for determining hotkey logic. For example, `isCtrl` which is true if the <kbd>control</kbd> key was pressed, or 

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
  isShift: Boolean,
  isWord: Boolean
}
```

The `isMod` boolean is true if the <kbd>control</kbd> key was pressed on Windows or the <kbd>command</kbd> key was pressed on Mac.

The `isLine` and `isWord` booleans represent whether the "line modifier" or "word modifier" hotkeys are pressed when deleteing or moving the cursor. For example, on a Mac <kbd>option + right</kbd> moves the cursor to the right one word at a time.

Make sure to `event.preventDefault()` if you do not want the default insertion behavior to occur! If no other plugin handles this event, it will be handled by the [Core plugin](./core.md).

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
`Function onSelect(event: Event, data: Object, state: State, editor: Editor => State || Void`

This handler is called whenever the native selection changes.

The `data` object contains a State [`Selection`](../models/selection.md) object representing the new selection.

If no other plugin handles this event, it will be handled by the [Core plugin](./core.md).


## Renderer Properties

```js
{
  renderDecorations: Function,
  renderMark: Function,
  renderNode: Function
}
```

To customize the renderer output of the editor, plugins can define a set of "renderer" properties.

### `renderDecorations` 
`Function renderDecorations(text: Text, state: State, editor: Editor) => Characters || Void`

The `renderDecorations` handler allows you to add dynamic, content-aware [`Marks`](../models/mark.md) to ranges of text, without having them show up in the serialized state of the editor. This is useful for things like code highlighting, where the marks will change as the user types.

`renderDecorations` is called for every `text` node in the document, and should return a set of updated [`Characters`](../models/character.md) for the text node in question. Every plugin's decoration logic is called, and the resulting characters are unioned, such that multiple plugins can apply decorations to the same pieces of text.

### `renderMark` 
`Function renderMark(mark: Mark, marks: Set, state: State, editor: Editor) => Object || Void`

The `renderMark` handler allows you to define the styles that each mark should be rendered with. It takes a [`Mark`](../models/mark.md) object, and should return a dictionary of styles that will be applied via React's `style=` property. For example:

```js
{
  fontWeight: 'bold',
  fontStyle: 'italic'
}
```

### `renderNode` 
`Function renderNode(node: Block || Inline, state: State, editor: Editor) => Component || Void`

The `renderNode` handler allows you to define the component that will be used to render a node—both blocks and inlines. It takes a [`Node`](../models/node.md) object, and should return a React component.

The component will be called with a set of properties:

```js
<Component
  attributes={Object}
  children={Any}
  node={Node}
  state={State}
/>
```

- `attributes` — a dictionary of attributes that **you must** add to the top-level element of the rendered component. Using the [Object Spread Syntax (Stage 2)](https://github.com/sebmarkbage/ecmascript-rest-spread) this is as easy as `...props.attributes`.
- `children` — a set of React element children that **you must** render as the leaf element in your component.
- `node` — the node being rendered.
- `state` — the current state of the editor.

Such that a simple code block renderer might look like this:

```js
const CodeBlockRenderer = (props) => {
  return (
    <pre {...props.attributes}>
      <code>
        {props.children}
      </code>
    </pre>
  )
}    
```

The `node` itself is passed in, so you can access any custom data associated with it via its `data` property.


## Other Properties

```js
{
  onChange: Function
}
```

### `onChange` 
`Function onChange(state: State) => State || Void`

The `onChange` handler isn't a native browser event handler. Instead, it is invoked whenever the editor state changes. Returning a new state will update the editor's state, continuing down the plugin stack.

Unlike the native event handlers, results from the `onChange` handler **are cummulative**! This means that every plugin in the stack that defines an `onChange` handler will have its handler resolved for every change the editor makes; the editor will not return early after the first plugin's handler is called.

This allows you to stack up changes across the entire plugin stack.
