
# `Selection`

```js
import { Selection } from 'slate'
```

A selection of a Slate [`Document`](./document.md). Selections in Slate are modeled after the native [DOM Selection API](https://developer.mozilla.org/en-US/docs/Web/API/Selection), using terms like "anchor", "focus" and "collapsed".

The "anchor" is the fixed point in a selection, and the "focus" is the non-fixed point, which may move when you move the cursor (eg. when pressing `Shift + Right Arrow`).

Often times, you don't need to specifically know which point is the "anchor" and which is the "focus", and you just need to know which comes first and last in the document. For these cases, there are many convenience equivalent properties and methods referring to the "start" and "end" points.

- [Properties](#properties)
  - [`anchorKey`](#anchorkey)
  - [`anchorOffset`](#anchoroffset)
  - [`focusKey`](#focuskey)
  - [`focusOffset`](#focusoffset)
  - [`isBackward`](#isbackward)
  - [`isFocused`](#isfocused)
- [Computed Properties](#computed-properties)
  - [`endKey`](#endkey)
  - [`endOffset`](#endoffset)
  - [`isBlurred`](#isblurred)
  - [`isCollapsed`](#iscollapsed)
  - [`isExpanded`](#isExpanded)
  - [`isForward`](#isForward)
  - [`startKey`](#startkey)
  - [`startOffset`](#startoffset)
- [Static Methods](#static-methods)
  - [`Selection.create`](#selectioncreate)
  - [`Selection.isSelection`](#selectionisselection)
- [Checking Methods](#checking-methods)
  - [`has{Edge}AtEndOf`](#hasedgeatendof)
  - [`has{Edge}AtStartOf`](#hasedgeatstartof)
  - [`has{Edge}Between`](#hasedgebetween)
  - [`has{Edge}In`](#hasedgein)
  - [`isAtEndOf`](#isatendof)
  - [`isAtStartOf`](#isatstartof)


## Properties

```js
Selection({
  anchorKey: String,
  anchorOffset: Number,
  focusKey: String,
  focusOffset: Number,
  isFocused: Boolean,
  isBackward: Boolean  
})
```

### `anchorKey`
`String`

The key of the text node at the selection's anchor point.

### `anchorOffset`
`Number`

The number of characters from the start of the text node at the selection's anchor point.

### `focusKey`
`String`

The key of the text node at the selection's focus point.

### `focusOffset`
`Number`

The number of characters from the start of the text node at the selection's focus point.

### `isBackward`
`Boolean`

Whether the selection is backward. A selection is considered "backward" when its focus point references a location earlier in the document than its anchor point.

### `isFocused`
`Boolean`

Whether the selection currently has focus.


## Computed Properties

These properties aren't supplied when creating a selection, but are instead computed based on the real properties.

### `isBlurred`
`Boolean`

The opposite of `isFocused`, for convenience.

### `isCollapsed`
`Boolean`

Whether the selection is collapsed. A selection is considered "collapsed" when the anchor point and focus point of the selection are the same.

### `isExpanded`
`Boolean`

The opposite of `isCollapsed`, for convenience.

### `isForward`
`Boolean`

The opposite of `isBackward`, for convenience.

### `startKey`
### `startOffset`
### `endKey`
### `endOffset`

A few convenience properties for accessing the first and last point of the selection. When the selection is forward, `start` refers to the `anchor` point and `end` refers to the `focus` point. And when it's backward they are reversed.


## Static Methods

### `Selection.create`
`Selection.create(properties: Object) => Selection`

Create a new `Selection` instance with `properties`.

### `Selection.isSelection`
`Selection.isSelection(maybeSelection: Any) => Boolean`

Returns a boolean if the passed in argument is a `Selection`.


## Checking Methods

### `has{Edge}AtStartOf`
`has{Edge}AtStartOf(node: Node) => Boolean`

Determine whether a selection has an edge at the start of a `node`. Where `{Edge}` can be one of: `Anchor`, `Focus`, `Start`, `End` or `Edge` (referring to either point).

### `has{Edge}AtEndOf`
`has{Edge}AtEndOf(node: Node) => Boolean`

Determine whether a selection has an edge at the end of a `node`. Where `{Edge}` can be one of: `Anchor`, `Focus`, `Start`, `End` or `Edge` (referring to either point).

### `has{Edge}Between`
`has{Edge}Between(node: Node, start: Number, end: Number) => Boolean`

Determine whether a selection has an edge in a `node` between its `start` and `end` offset. Where `{Edge}` can be one of: `Anchor`, `Focus`, `Start`, `End` or `Edge` (referring to either point).

### `has{Edge}In`
`has{Edge}In(node: Node) => Boolean`

Determine whether a selection has an edge inside a `node`. Where `{Edge}` can be one of: `Anchor`, `Focus`, `Start`, `End` or `Edge` (referring to either point).

### `isAtStartOf`
`isAtStartOf(node: Node) => Boolean`

Determine whether the selection is at the start of a `node`.

### `isAtEndOf`
`isAtEndOf(node: Node) => Boolean`

Determine whether the selection is at the end of a `node`.
