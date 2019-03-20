# Operation

An operation is the lowest-level description of a specific change to a part of Slate's value. They are designed to be collaborative-editing friendly.

All of the [`Commands`](./commands.md) methods result in operations being created and applied to a [`Value`](./value.md) They're accessible via the `editor.operations` property.

There are a handful of Slate operation types. The goal is to have the fewest possible types, while still maintaining the necessary semantics for collaborative editing to work.

## Properties

See each operation separately below to see what they consist of.

Note that all operations have a `data` property which can be used to attach arbitrary data to the operation, just like the [`Node`](./node.md) models ([`Block`](./block.md), [`Inline`](./inline.md), etc).

## Text Operations

### `insert_text`

```js
{
  type: 'insert_text',
  path: List,
  offset: Number,
  text: String,
  marks: List,
  data: Map,
}
```

Inserts a `text` string at `offset` into a text node at `path`, with optional `marks` to be applied to the inserted characters.

### `remove_text`

```js
{
  type: 'remove_text',
  path: List,
  offset: Number,
  text: String,
  data: Map,
}
```

Removes a string of `text` at `offset` into a text node at `path`.

## Mark Operations

### `add_mark`

```js
{
  type: 'add_mark',
  path: List,
  offset: Number,
  length: Number,
  mark: Mark,
  data: Map,
}
```

Adds a `mark` to the text node at `path` starting at an `offset` and spanning `length` characters.

### `remove_mark`

```js
{
  type: 'remove_mark',
  path: List,
  offset: Number,
  length: Number,
  mark: Mark,
  data: Map,
}
```

Removes a `mark` from a text node at `path` starting at an `offset` and spanning `length` characters.

### `set_mark`

```js
{
  type: 'set_mark',
  path: List,
  offset: Number,
  length: Number,
  mark: Mark,
  properties: Object,
  data: Map,
}
```

Set new `properties` on any marks that match an existing `mark` in a text node at `path`, starting at an `offset` and spanning `length` characters.

## Node Operations

### `insert_node`

```js
{
  type: 'insert_node',
  path: List,
  node: Node,
  data: Map,
}
```

Insert a new `node` at `path`.

### `merge_node`

```js
{
  type: 'merge_node',
  path: List,
  position: Number,
  properties: Object,
  data: Map,
}
```

Merge the node at `path` with its previous sibling. The `position` refers to either the index in the child nodes of the previous sibling in the case of [`Block`](./block.md) or [`Inline`](./inline.md) nodes, and the index in the characters of the previous sibling in the case of [`Text`](./text.md) nodes. The `properties` object contains properties of the merged node in the event that the change is undone.

### `move_node`

```js
{
  type: 'move_node',
  path: List,
  newPath: Array,
  data: Map,
}
```

Move the node at `path` to a `newPath`.

### `remove_node`

```js
{
  type: 'remove_node',
  path: List,
  node: Node,
  data: Map,
}
```

Remove the node at `path`.

### `set_node`

```js
{
  type: 'set_node',
  path: List,
  properties: Object,
  node: Node,
  data: Map,
}
```

Set new `properties` on the node at `path`.

### `split_node`

```js
{
  type: 'split_node',
  path: List,
  position: Number,
  target: Number,
  properties: Object,
  data: Map,
}
```

Split the node at `path` at `position`. The `position` refers to either the index in the child nodes in the case of [`Block`](./block.md) or [`Inline`](./inline.md) nodes, and the index in the characters in the case of [`Text`](./text.md) nodes. In the case of nested splits, `target` refers to the target path of the child split operation. The `properties` object contains properties that should be assigned to the new node created after the split operation is complete.

## Value Operations

### `set_selection`

```js
{
  type: 'set_selection',
  properties: Object,
  selection: Selection,
  data: Map,
}
```

Set new `properties` on the selection.

### `set_value`

```js
{
  type: 'set_value',
  properties: Object,
  value: Value,
  data: Map,
}
```

Set new `properties` on a value. Properties can contain `data` and `decorations`.

## Helpers

### `apply`

`apply(value: Value, operation: Object) => Value`

Applies an `operation` to a `value` object.

### `invert`

`invert(operation: Object) => Object`

Create an inverse operation that will undo the changes made by the original.
