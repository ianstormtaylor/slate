# `Leaf`

```js
import { Leaf } from 'slate'
```

A leaf node in a Slate [`Document`](./document.md). Leaf nodes are always direct children of a [`Text`](./text.md) node and contains the textual content with associated [`Marks`](./mark.md).

## Properties

```js
Leaf({
  text: string,
  marks: Immutable.Set<Mark>
})
```

### `text`

A string that makes up the leaf node's content.

### `marks`

An immutable set of [`Marks`](./mark.md)

### `object`

`String`

An immutable string value of `'leaf'`.

## Computed Properties

## Static Methods

### `Leaf.create`

`Leaf.create(properties: Object) => Leaf`

Create a leaf from a plain Javascript object of `properties`.

### `Leaf.fromJSON`

`Text.fromJSON(object: Object) => Text`

Create a leaf from a JSON `object`.

### `Text.isLeaf`

`Text.isLeaf(maybeLeaf: Any) => Boolean`

Returns a boolean if the passed in argument is a `Leaf`.

### `Text.splitLeaves`

`Text.splitLeaves(leaves: List<Leaf>, offset: number) => List<Leaf>[]`

Split a list of leaves to two lists; if the leaves are valid leaves, the returned leaves are also valid
Corner Cases:
1. if offset is smaller than 0, then return [List(), leaves]
2. if offset is bigger than the text length, then return [leaves, List()]

### `Text.isLeafList`

`Text.isLeaf(maybeLeafList: Any) => Boolean`

Returns a boolean if the passed in argument is a list of `Leaf`.

## Instance Methods

### `toJSON`

`toJSON() => Object`

Returns a JSON representation of the leaf.

### `updateMark`

`updateMark(mark: Mark, newMark: Mark) => Leaf`

Substitutes a [`Mark`](./mark.md) with a new one. The original leaf is returned if `mark` is not found.

### `addMarks`

`updateMark(marks: Immutable.Set<Mark>) => Leaf`

Creates a union between existing the leaf's marks and `marks`.

### `removeMarks`

`updateMark(mark: Mark) => Leaf`

Removes a [`Mark`](./mark.md) from this leaf. The original leaf is returned if `mark` is not found.

### `toJSON`

`toJSON() => Object`

Returns a JSON representation of the leaf.
