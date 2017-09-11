
# `<Placeholder>`

```js
import { Placeholder } from 'slate'
```

A simple component that adds a placeholder to a node. It encapsulates all of the Slate-related logic that determines when to render the placeholder, so you don't have to think about it.

- [Properties](#properties)
  - [`children`](#children)
  - [`className`](#className)
  - [`firstOnly`](#firstOnly)
  - [`node`](#node)
  - [`parent`](#parent)
  - [`state`](#state)
  - [`style`](#style)


## Properties

```js
<Placeholder
  className={String}
  node={Node}
  parent={Node}
  state={State}
  style={Object}
>
  {children}
</Placeholder>
```

### `children`
`Any`

React child elements to render inside the placeholder `<span>` element.

### `className`
`String`

An optional class name string to add to the placeholder `<span>` element.

### `firstOnly`
`Boolean`

An optional toggle that allows the Placeholder to render even if it is not the first node of the parent. This is useful for cases where the Placeholder should show up at every empty instance of the node. Defaults to `true`.

### `node`
`Node`

The node to render the placeholder element on top of. The placeholder is positioned absolutely, covering the entire node.

### `parent`
`Node`

The node to check for non-empty content, to determine whether the placeholder should be shown or not, if `firstOnly` is set to `false`.

### `state`
`State`

The current state of the editor.

### `style`
`Object`

An optional dictionary of styles to pass to the placeholder `<span>` element.
