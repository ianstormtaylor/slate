
# Custom Nodes

Slate will render custom nodes for [`Block`](../slate/block.md) and [`Inline`](../slate/inline.md) models, based on what you pass in as your schema. This allows you to completely customize the rendering behavior of your Slate editor.

- [Properties](#properties)
  - [`attributes`](#attributes)
  - [`children`](#children)
  - [`editor`](#editor)
  - [`isSelected`](#isselected)
  - [`node`](#node)
  - [`parent`](#parent)
  - [`readOnly`](#readonly)
  - [`state`](#state)

## Properties

```js
<{Custom}
  attributes={Object}
  children={Object}
  editor={Editor}
  isSelected={Boolean}
  node={Node}
  parent={Node}
  readOnly={Boolean}
  state={State}
/>
```

### `attributes`
`Object`

A dictionary of DOM attributes that you must attach to the main DOM element of the node you render. For example:

```js
return (
  <p {...props.attributes}>{props.children}</p>
)
```
```js
return (
  <figure {...props.attributes}>
    <img src={...} />
  </figure>
)
```

### `children`
`Object`

A set of React children elements that are composed of internal Slate components that handle all of the editing logic of the editor for you. You must render these as the children of your non-void nodes. For example:

```js
return (
  <p {...props.attributes}>
    {props.children}
  </p>
)
```

### `editor`
`Editor`

A reference to the Slate [`<Editor>`](./editor.md) instance. This allows you to retrieve the current `state` of the editor, or perform a `change` on the state. For example:

```js
const state = editor.getState()
```
```js
editor.change((change) => {
  change.selectAll().delete()
})
```

### `isSelected`
`Boolean`

A boolean representing whether the node you are rendering is currently selected. You can use this to render a visual representation of the selection.

### `node`
`Node`

A reference to the [`Node`](../slate/node.md) being rendered.

### `parent`
`Node`

A reference to the parent of the current [`Node`](../slate/node.md) being rendered.

### `readOnly`
`Boolean`

Whether the editor is in "read-only" mode, where all of the rendering is the same, but the user is prevented from editing the editor's content.

### `state`
`State`

A reference to the current [`State`](../slate/state.md) of the editor.
