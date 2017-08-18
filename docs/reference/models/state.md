
# `State`

```js
import { State } from 'slate'
```

A `State` is the top-level representation of data in Slate, containing both a [`Document`](./document.md) and a [`Selection`](./selection.md). It's what you need to paste into the Slate [`<Editor>`](../components/editor.md) to render something onto the page.

All transforms to the document and selection are also performed through the state object, so that they can stay in sync, and be propagated to its internal history of undo/redo state.

For convenience, in addition to transforms, many of the [`Selection`](./selection.md) and [`Document`](./document.md) properties are exposed as proxies on the `State` object.

- [Properties](#properties)
  - [`document`](#document)
  - [`selection`](#selection)
- [Computed Properties](#computed-properties)
  - [`{edge}Text`](#edgetext)
  - [`{edge}Block`](#edgeblock)
  - [`marks`](#marks)
  - [`blocks`](#blocks)
  - [`fragment`](#fragment)
  - [`inlines`](#inlines)
  - [`texts`](#texts)
  - [`hasUndos`](#hasundos)
  - [`hasRedos`](#hasredos)
- [Selection-like Properties](#selection-like-properties)
  - [`{edge}Key`](#edgekey)
  - [`{edge}Offset`](#edgeoffset)
  - [`isBackward`](#isbackward)
  - [`isBlurred`](#isblurred)
  - [`isCollapsed`](#iscollapsed)
  - [`isExpanded`](#isExpanded)
  - [`isFocused`](#isfocused)
  - [`isForward`](#isForward)
  - [`isEmpty`](#isEmpty)
- [Static Methods](#static-methods)
  - [`State.create`](#statecreate)
  - [`State.isState`](#stateisstate)
- [Methods](#methods)
  - [`transform`](#transform)


## Properties

```js
State({
  document: Document,
  selection: Selection
})
```

### `document`
`Document`

The current document of the state.

### `selection`
`Selection`

The current selection of the state.


## Computed Properties

These properties aren't supplied when creating a `State`, but are instead computed based on the current `document` and `selection`.

### `{edge}Text`
`Text`

Get the leaf [`Text`](./text.md) node at `{edge}`. Where `{edge}` is one of: `anchor`, `focus`, `start` or `end`.


### `{edge}Block`
`Block`

Get the leaf [`Block`](./block.md) node at `{edge}`. Where `{edge}` is one of: `anchor`, `focus`, `start` or `end`.

### `marks`
`Set`

Get a  set of the [`Marks`](./mark.md) in the current selection.

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

### `characters`
`List`

Get a list of the [`Character`](./character.md) objects in the current selection.

### `hasUndos`
`Boolean`

Whether there are undoable snapshots to revert to in the history.

### `hasRedos`
`Boolean`

Whether there are redoable snapshots to revert to in the history.

## Selection-like Properties

These properties are exact proxies of their [`Selection`](./selection) equivalents.

### `{edge}Key`
`String`

Get the current key at an `{edge}`. Where `{edge}` is one of: `anchor`, `focus`, `start` or `end`.

### `{edge}Offset`
`Number`

Get the current offset at an `{edge}`. Where `{edge}` is one of: `anchor`, `focus`, `start` or `end`.

### `isBackward`
`Boolean`

Whether the current selection is backward.

### `isBlurred`
`Boolean`

Whether the current selection is blurred.

### `isCollapsed`
`Boolean`

Whether the current selection is collapsed.

### `isExpanded`
`Boolean`

Whether the current selection is expanded.

### `isFocused`
`Boolean`

Whether the current selection is focused.

### `isForward`
`Boolean`

Whether the current selection is forward.

### `isEmpty`
`Boolean`

Whether the current selection is empty.

## Static Methods

### `State.create`
`State.create(properties: Object) => State`

Create a new `State` instance with `properties`.

### `State.isState`
`State.isState(maybeState: Any) => Boolean`

Returns a boolean if the passed in argument is a `State`.


## Methods

### `transform`
`transform() => Transform`

Create a new [`Transform`](./transform.md) that acts on the current state.
