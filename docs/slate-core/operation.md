# Operation

An operation is the lowest-level description of a specific change to a part of Slate's value. They are designed to be collaborative-editing friendly.

All of the [`Change`](change.md) methods result in operations being created and applied to a [`Value`](value.md) They're accessible via the `change.operations` property.

There are a handful of Slate operation types. The goal is to have the fewest possible types, while still maintaining the necessary semantics for collaborative editing to work.

## Text Operations

### `insert_text`

```javascript
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

```javascript
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

```javascript
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

```javascript
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

```javascript
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

```javascript
{
  type: 'insert_node',
  path: Array,
  node: Object,
}
```

Insert a new `node` at `path`.

### `merge_node`

```javascript
{
  type: 'merge_node',
  path: Array,
  position: Number,
  properties: Object,
}
```

Merge the node at `path` with its previous sibling. The `position` refers to either the index in the child nodes of the previous sibling in the case of [`Block`](block.md) or [`Inline`](inline.md) nodes, and the index in the characters of the previous sibling in the case of [`Text`](text.md) nodes. The `properties` object contains properties of the merged node in the event that the change is undone.

### `move_node`

```javascript
{
  type: 'move_node',
  path: Array,
  newPath: Array,
}
```

Move the node at `path` to a `newPath`.

### `remove_node`

```javascript
{
  type: 'remove_node',
  path: Array,
  node: Object,
}
```

Remove the node at `path`.

### `set_node`

```javascript
{
  type: 'set_node',
  path: Array,
  properties: Object,
  node: Object,
}
```

Set new `properties` on the node at `path`.

### `split_node`

```javascript
{
  type: 'split_node',
  path: Array,
  position: Number,
  target: Number,
  properties: Object,
}
```

Split the node at `path` at `position`. The `position` refers to either the index in the child nodes in the case of [`Block`](block.md) or [`Inline`](inline.md) nodes, and the index in the characters in the case of [`Text`](text.md) nodes. In the case of nested splits, `target` refers to the target path of the child split operation. The `properties` object contains properties that should be assigned to the new node created after the split operation is complete.

## Value Operations

### `set_selection`

```javascript
{
  type: 'set_selection',
  properties: Object,
  selection: Object,
}
```

Set new `properties` on the selection.

### `set_value`

```javascript
{
  type: 'set_value',
  properties: Object,
  value: Object,
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

