# `Value`

```js
import { Value } from 'slate'
```

A `Value` is the top-level representation of data in Slate, containing both a [`Document`](./document.md) and a [`Selection`](./selection.md). It's what you need to pass into the Slate [`<Editor>`](../slate-react/editor.md) to render something onto the page.

## Properties

```js
Value({
  document: Document,
  selection: Selection,
  data: Data,
  decorations: List<Decoration>,
})
```

### `data`

`Data`

An object containing arbitrary data for the value.

### `decorations`

`List<Decoration>`

A list of ranges in the document with marks that aren't part of the content itself—like matches for the current search string.

### `document`

`Document`

The current document of the value.

### `object`

`String`

A string with a value of `'value'`.

### `selection`

`Selection`

The current selection of the value.

## Computed Properties

These properties aren't supplied when creating a `Value`, but are instead computed based on the current `document` and `selection`.

### `{edge}Text`

`Text`

Get the leaf [`Text`](./text.md) node at `{edge}`. Where `{edge}` is one of: `anchor`, `focus`, `start` or `end`.

### `{edge}Block`

`Block`

Get the leaf [`Block`](./block.md) node at `{edge}`. Where `{edge}` is one of: `anchor`, `focus`, `start` or `end`.

### `marks`

`Set`

Get a set of the [`Marks`](./mark.md) in the current selection.

### `activeMarks`

`Set`

Get a subset of the [`Marks`](./mark.md) that are present in _all_ the characters in the current selection. It can be used to determine the active/inactive state of toolbar buttons corresponding to marks, based on the usual rich text editing conventions.

### `blocks`

`List`

Get a list of the lowest-depth [`Block`](./block.md) nodes in the current selection.

### `fragment`

`Document`

Get a [`Document`](./document.md) fragment of the current selection.

### `inlines`

`List`

Get a list of the lowest-depth [`Inline`](./inline.md) nodes in the current selection.

### `texts`

`List`

Get a list of the [`Text`](./text.md) nodes in the current selection.

## Static Methods

### `Value.create`

`Value.create(properties: Object) => Value`

Create a new `Value` instance with `properties`.

### `Value.fromJSON`

`Value.fromJSON(object: Object) => Value`

Create a value from a JSON `object`.

### `Value.isValue`

`Value.isValue(any: Any) => Boolean`

Returns a boolean if the passed in argument is a `Value`.

## Instance Methods

### `toJSON`

`toJSON() => Object`

Returns a JSON representation of the value.
