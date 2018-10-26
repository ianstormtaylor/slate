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

A change handler that will be called asynchronously with the `change` that applied the change. When the `onChange` handler is called, the `editor.value` will already reflect the new state.

### `operations`

`List<Operation>`

An immutable list of [`Operation`](./operation.md) models that have already been applied to the editor in the current change. As soon as the first operation is added, the `onChange` is queued to run on the next tick.

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

### `command`

`command(type: String, ...args) => Editor`
`command(fn: Function, ...args) => Editor`

```js
editor.command('insertText', 'word')
editor.command((editor, text) => { ... }, 'word')
```

Invoke a command by `type` on the editor with `args`.

Alternatively, the `type` argument can be a function, which will be invoked with `(editor, ...args)`. This is helpful in situations where you want write one-off commands with customized logic.

### `flush`

`flush() => Editor`

```js
editor.flush()
```

Synchronously flush the current changes to editor, calling `onChange`.

> 🤖 In normal operation you never need to use this method! However, it can be helpful for writing tests to be able to keep the entire test synchronous.

### `query`

`query(type: String, ...args) => Any`
`query(fn: Function, ...args) => Editor`

```js
editor.query('isLinkActive')
editor.query(editor => { ... })
```

Invoke a query by `type` on the editor with `args`, returning its result.

Alternatively, the `type` argument can be a function, which will be invoked with `(editor, ...args)`. This is helpful in situations where you want write one-off queries with customized logic.

### `registerCommand`

`registerCommand(type: String) => Void`

```js
editor.registerCommand('insertLink')
```

Add a new command by `type` with the editor. This will make the command available as a top-level method on the `editor`.

> 🤖 Note that this method only registers the command with the editor, creating the top-level command method. It does not define the queries behaviors, which are defined with the `onCommand` middleware.

### `registerQuery`

`registerQuery(type: String) => Void`

```js
editor.registerQuery('isLinkActive')
```

Add a new query by `type` with the editor. This will make the query available as a top-level method on the `editor`.

> 🤖 Note that this method only registers the query with the editor, creating the top-level query method. It does not define the queries behaviors, which are defined with the `onQuery` middleware.

### `run`

`run(key, ...args) => Any`

```js
editor.run('onKeyDown', { key: 'Tab', ... })
```

Run the middleware stack by `key` with `args`, returning its result.

> 🤖 In normal operation you never need to use this method! However, it's useful for writing tests to be able to simulate plugin behaviors.

### `setReadOnly`

`setReadOnly(readOnly: Boolean) => Editor`

```js
editor.setReadOnly(true)
```

Set the editor's `readOnly` state.

### `setValue`

`setValue(value: Value, options: Object) => Editor`

```js
editor.setValue(value)
```

Set the editor's `value` state.

You can optionally provide a `normalize` option to either for the editor to completely re-normalize the new value based on its schema or not. By default, the editor will re-normalize only if the value is not equal to its previously seen value (which it knows was normalized).
