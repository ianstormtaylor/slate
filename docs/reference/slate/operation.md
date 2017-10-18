
# Operation

An operation is the lowest-level description of a specific change to a part of Slate's state. They are designed to be collaborative-editing friendly.

All of the [`Change`](./change.md) methods result in operations being created and applied to a [`State`](./state.md) They're accessible via the `change.operations` property.

There are a handful of Slate operation types. The goal is to have the fewest possible types, while still maintaining the necessary semantics for collaborative editing to work.


## Properties

### `mark`
`Array`

A mark that is being added or removed by the operation, or being used as a comparison point when updating an existing mark.

### `marks`
`Array`

A set of marks that are being added by the operation.

### `offset`
`Number`

The offset inside a [`Text`](./text.md) node that the operation acts on.

### `path`
`Array`

The path to the node the operation acts on. The array contains a list of indexes, representing where the node is in the `document` hierarchy.

### `text`
`String`

The text that is being inserted or removed by the operation.

### `type`
`String`

The `type` of the operation.


## Text Operations

### `insert_text`

```js
{
  type: 'insert_text',
  path: Array,
  offset: Number,
  text: String,
  marks: Array,
}
```

Inserts a `text` string at `offset` into a text node at `path`, with optional `marks` to be applied to the inserted characters.

### `remove_text`

```js
{
  type: 'remove_text',
  path: Array,
  offset: Number,
  text: String,
}
```

Removes a string of `text` at `offset` into a text node at `path`.


## Mark Operations

### `add_mark`

```js
{
  type: 'add_mark',
  path: Array,
  offset: Number,
  length: Number,
  mark: Object,
}
```

Adds a `mark` to the text node at `path` starting at an `offset` and spanning `length` characters.

### `remove_mark`

```js
{
  type: 'remove_mark',
  path: Array,
  offset: Number,
  length: Number,
  mark: Object,
}
```

Removes a `mark` from a text node at `path` starting at an `offset` and spanning `length` characters.

### `set_mark`

```js
{
  type: 'set_mark',
  path: Array,
  offset: Number,
  length: Number,
  mark: Object,
  properties: Object,
}
```

Set new `properties` on any marks that match an existing `mark` in a text node at `path`, starting at an `offset` and spanning `length` characters.


## Node Operations

### `insert_node`

```js
{
  type: 'insert_node',
  path: Array,
  node: Object,
}
```

Insert a new `node` at `path`.

### `merge_node`

```js
{
  type: 'merge_node',
  path: Array,
}
```

Merge the node at `path` with it's previously sibling.

### `move_node`

```js
{
  type: 'move_node',
  path: Array,
  newPath: Array,
}
```

Move the node at `path` to a `newPath`.

### `remove_node`

```js
{
  type: 'remove_node',
  path: Array,
  node: Object,
}
```

Remove the node at `path`.

### `set_node`

```js
{
  type: 'set_node',
  path: Array,
  properties: Object,
  node: Object,
}
```

Set new `properties` on the node at `path`.

### `split_node`

```js
{
  type: 'split_node',
  path: Array,
  position: Number,
  target: Number,
}
```

Split the node at `path` at `position`. The `position` refers to either the index in the child nodes in the case of [`Block`](./block.md) or [`Inline`](./inline.md) nodes, and the index in the characters in the case of [`Text`](./text.md) nodes. In the case of nested splits, `target` refers to the target path of the child split operation.


## State Operations

### `set_selection`

```js
{
  type: 'set_selection',
  properties: Object,
  selection: Object,
}
```

Set new `properties` on the state's selection.

### `set_state`

```js
{
  type: 'set_state',
  properties: Object,
  state: Object,
}
```

Set new `properties` on a state. Properties can contain `data` and `decorations`.


## Helpers

### `apply`
`apply(state: State, operation: Object) => State`

Applies an `operation` to a `state` object.

### `invert`
`invert(operation: Object) => Object`

Create an inverse operation that will undo the changes made by the original.
