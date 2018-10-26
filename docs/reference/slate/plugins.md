# Plugins

Plugins can be attached to an editor to alter its behavior in different ways. Each editor has a "stack" of plugins, which has a specific order, which it runs through when certain hooks are triggered.

> 🤖 The core `slate` editor is designed for use across all environments, and defines a limited set of plugin hooks. But when using `slate-react` there are more hooks defined, for managing in rendering, DOM events, etc. Check out the [React Plugins](../slate-react/plugins.md) reference for more information.

## Hooks

Plugins are plain JavaScript objects, containing a set of middleware functions that run for each hook they choose to implement.

```js
{
  normalizeNode: Function,
  onChange: Function,
  onCommand: Function,
  onConstruct: Function,
  onQuery: Function,
  validateNode: Function,
}
```

When a hook is triggered, the middleware function is passed a set of arguments, with the last argument being a `next` function. Choosing whether to call `next` or not determines whether the editor will continue traversing the stack.

### `normalizeNode`

`Function normalizeNode(node: Node, editor: Editor, next: Function) => Function(editor: Editor)|Void`

The `normalizeNode` hook takes a `node` and either returns `undefined` if the node is valid, or a change function that normalizes the node into a valid state if not.

### `onChange`

`onChange(editor: Editor, next: Function) => Void`

```js
{
  onChange(editor, next) {
    ...
    return next()
  }
}
```

The `onChange` hook is called whenever a new change is about to be applied to an editor. This is useful if you'd like to apply some behavior to every change, or even abort certain changes.

### `onCommand`

`onCommand(command: Object, editor: Editor, next: Function) => Void`

```js
{
  onCommand(command, editor, next) {
    const { type, args } = command

    if (type === 'wrapQuote') {
      change.wrapBlock('quote')
    } else {
      return next()
    }
  }
}
```

```js
{
  type: String,
  args: Array,
}
```

The `onQuery` hook is called with a `query` object resulting from an `editor.query(type, ...args)` or a `change[query](...args)` call:

The `onQuery` hook is a low-level way to have access to all of the queries passing through the editor. Most of the time you should use the `queries` shorthand instead.

### `onConstruct`

`onConstruct(editor: Editor, next: Function) => Void`

```js
{
  onConstruct(editor, next) {
    editor.registerCommand('wrapList')
    return next()
  }
}
```

The `onConstruct` hook is called when a new instance of `Editor` is created. This is where you can call `editor.registerCommand` or `editor.registerQuery`.

> 🤖 This is always called with the low-level `Editor` instance, and not the React `<Editor>` component. And it is called before the React editor has its `value` set based on its props. It is purely used for editor-related configuration setup, and not for any schema-related or value-related purposes.

### `onQuery`

`onQuery(query: Object, editor: Editor, next: Function) => Void`

```js
{
  onQuery(query, editor, next) {
    const { type, args } = query

    if (type === 'getActiveList') {
      return ...
    } else {
      return next()
    }
  }
}
```

```js
{
  type: String,
  args: Array,
}
```

The `onQuery` hook is called with a `query` object resulting from an `editor.query(type, ...args)` or a `change[query](...args)` call:

The `onQuery` hook is a low-level way to have access to all of the queries passing through the editor. Most of the time you should use the `queries` shorthand instead.

### `validateNode`

`Function validateNode(node: Node, editor: Editor, next: Function) => SlateError|Void`

The `validateNode` hook takes a `node` and either returns `undefined` if the node is valid, or a `SlateError` object if it is invalid.

## Shorthands

In addition to the middleware functions, Slate also provides three shorthands which implement common behaviors in `commands`, `queries` and `schema`.

```js
{
  commands: Object,
  queries: Object,
  schema: Object,
}
```

### `commands`

`commands: Object`

```js
{
  commands: {
    setHeader(editor, level) {
      editor.setBlocks({ type: 'header', data: { level }})
    }
  }
}
```

The `commands` shorthand defines a set of custom commands that are made available in the editor, and as first-class methods on the `editor`.

Each command has a signature of `(editor, ...args)`.

### `queries`

`queries: Object`

```js
{
  queries: {
    getActiveList(editor) {
      ...
    }
  }
}
```

The `queries` shorthand defines a set of custom queries that are made available in the editor, and as first-class methods on the `editor`.

Each query has a signature of `(editor, ...args)`.

### `schema`

`schema: Object`

```js
{
  schema: {
    blocks: {
      image: {
        isVoid: true,
        parent: { type: 'figure' },
      },
      ...
    }
  }
}
```

```js
{
  document: Object,
  blocks: Object,
  inlines: Object,
  rules: Array,
}
```

The `schema` shorthand defines your custom requires for the data in your editor. It allows you to enforce rules about what "valid" content is in the editor, and how nodes behave.

Check out the [Schema](./schema.md) reference for more information.
