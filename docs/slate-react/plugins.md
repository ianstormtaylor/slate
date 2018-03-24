# Plugins

Plugins can be attached to an editor to alter its behavior in different ways. Plugins are just simple Javascript objects, containing a set of properties that control different behaviors—event handling, change handling, rendering, etc.

Each editor has a "middleware stack" of plugins, which has a specific order.

When the editor needs to resolve a plugin-related handler, it will loop through its plugin stack, searching for the first plugin that successfully returns a value. After receiving that value, the editor will **not** continue to search the remaining plugins; it returns early. If you'd like for the stack to continue, a plugin handler should return `undefined`.

## Conventions

A plugin should always export a function that takes options. This way even if it doesn't take any options now, it won't be a breaking API change to take more options in the future. So a basic plugin might look like this:

```javascript
export default function MySlatePlugin(options) {
  return {
    // Return properties that describe your logic here...
  }
}
```

## Event Handler Properties

```javascript
{
  onBeforeInput: Function,
  onBlur: Function,
  onFocus: Function,
  onCopy: Function,
  onCut: Function,
  onDrop: Function,
  onKeyDown: Function,
  onKeyUp: Function,
  onPaste: Function,
  onSelect: Function
}
```

All of the event handler properties are passed the same React `event` object you are used to from React's event handlers. They are also passed a `change` object representing any changes that have resulted from the event, and the `editor` instance itself.

Each event handler can choose to call methods on the `change` object, in which case the editor's value will be updated.

If the return value of a plugin handler is `null`, the editor will simply continue resolving the plugin stack. However, if you return a non-null value, the editor will break out of the loop.

### `onBeforeInput`

`Function onBeforeInput(event: Event, change: Change, editor: Editor) => Change || Void`

This handler is called right before a string of text is inserted into the `contenteditable` element.

Make sure to `event.preventDefault()` if you do not want the default insertion behavior to occur!

### `onBlur`

`Function onBlur(event: Event, change: Change, editor: Editor) => Change || Void`

This handler is called when the editor's `contenteditable` element is blurred.

### `onFocus`

`Function onFocus(event: Event, change: Change, editor: Editor) => Change || Void`

This handler is called when the editor's `contenteditable` element is focused.

### `onCopy`

`Function onCopy(event: Event, change: Change, editor: Editor) => Change || Void`

This handler is called when there is a copy event in the editor's `contenteditable` element.

### `onCut`

`Function onCut(event: Event, change: Change, editor: Editor) => Change || Void`

This handler is equivalent to the `onCopy` handler.

### `onDrop`

`Function onDrop(event: Event, change: Change, editor: Editor) => Change || Void`

This handler is called when the user drops content into the `contenteditable` element. The event is already prevented by default, so you must define a value change to have any affect occur.

### `onKeyDown`

`Function onKeyDown(event: Event, change: Change, editor: Editor) => Change || Void`

This handler is called when any key is pressed in the `contenteditable` element, before any action is taken.

Make sure to `event.preventDefault()` if you do not want the default insertion behavior to occur!

### `onKeyUp`

`Function onKeyUp(event: Event, change: Change, editor: Editor) => Change || Void`

This handler is called when any key is released in the `contenteditable` element.

### `onPaste`

`Function onPaste(event: Event, change: Change, editor: Editor) => Change || Void`

This handler is called when the user pastes content into the `contenteditable` element. The event is already prevented by default, so you must define a value change to have any affect occur.

### `onSelect`

`Function onSelect(event: Event, change: Change, editor: Editor) => Change || Void`

This handler is called whenever the native DOM selection changes.

_Note: This is **not** Slate's internal selection representation \(although it mirrors it\). If you want to get notified when Slate's selection changes, use the _[`onChange`](editor.md#onchange)_ property of the _`<Editor>`_. This handler is instead meant to give you lower-level access to the DOM selection handling, which **is not always triggered** as you'd expect._

## Other Properties

```javascript
{
  onChange: Function
}
```

### `onChange`

`Function onChange(change: Change) => Any || Void`

The `onChange` handler isn't a native browser event handler. Instead, it is invoked whenever the editor value changes. This allows plugins to augment a change however they want.

### `renderEditor`

`Function renderEditor(props: Object, editor: Editor) => Object || Void`

The `renderEditor` property allows you to define higher-order-component-like behavior. It is passed all of the properties of the editor, including `props.children`. You can then choose to wrap the existing `children` in any custom elements or proxy the properties however you choose. This can be useful for rendering toolbars, styling the editor, rendering validation, etc. Remember that the `renderEditor` function has to render `props.children` for editor's children to render.

### `schema`

`Object`

The `schema` property allows you to define a set of rules that will be added to the editor's schema. The rules from each of the schemas returned by the plugins are collected into a single schema for the editor.

