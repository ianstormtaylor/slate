# `<Editor>`

```js
import { Editor } from 'slate'
```

The top-level controller that holds a [`Value`](./value.md) over time, and contains all of the plugins that determine the editor's behavior.

> 🤖 In `slate-react`, the [`<Editor>`](../slate-react/editor.md) component creates an instance of the `Editor` controller which manages its value under the covers.

## Properties

```js
new Editor({
  onChange: Function,
  plugins: Array,
  readOnly: Boolean,
  value: Value,
})
```

### `onChange`

`Function onChange(change: Change)`

A change handler that will be called with the `change` that applied the change. When the `onChange` handler is called, the `editor.value` will already reflect the new state.

### `plugins`

`Array`

An array of [`Plugins`](./plugins.md) that define the editor's behavior. These plugins are only definable when an instance of `Editor` is constructed, and are constant throught the editor's lifecycle.

> 🤖 In `slate-react`, when the `plugins` prop to the [`<Editor>`](../slate-react/editor.md) component changes, an entirely new `Editor` controller is created under the covers. This is why plugins should not be defined inline in the render function.

### `readOnly`

`Boolean`

Whether the editor is in "read-only" mode, where the user is prevented from editing the editor's content.

### `value`

`Value`

A [`Value`](../slate/value.md) object representing the current value of the editor.

## Methods

### `change`

`change(fn) => Void`
`change(fn, ...args) => Void`

Programmatically invoke a change `fn` on the editor. The function will be invoked with a new `change` object representing the editor's current value.

If extra `...args` are passed in, the change `fn` will be invoked with `(change, ...args)`, so you can use this as a shorthand for performing single-function changes.

### `command`

`command(name, ...args) => Void`

Invoke a command by `name` on the editor with `args`.

### `event`

`event(handler, event, ...args) => Any`

Programmatically invoke an `event` on the editor. This isn't something you should normally use except in test environments.

### `focus`

`focus() => Void`

Programmatically focus the editor.

### `query`

`query(name, ...args) => Any`

Invoke a query by `name` on the editor with `args`, returning its result.

### `registerCommand`

`registerCommand(command: String) => Void`

Register a new `command` by name with the editor. This will make the command available as a method on the editor's `Change` objects.

### `registerQuery`

`registerQuery(query: String) => Void`

Register a new `query` by name with the editor. This will make the query available as a method on the editor's `Change` objects.

### `run`

`run(key, ...args) => Any`

Run the middleware stack by `key` with `args`, returning its result.

### `setReadOnly`

`setReadOnly(readOnly: Boolean) => Editor`

Set the editor's `readOnly` state.

### `setValue`

`setValue(value: Value, options: Object) => Editor`

Set the editor's `value` state.

You can optionally provide a `normalize` option to either for the editor to completely re-normalize the new value based on its schema or not. By default, the editor will re-normalize only if the value is not equal to its previously seen value (which it knows was normalized).
