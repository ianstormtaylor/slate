
# `Selection`

```js
import { Selection } from 'Slate'
```

A selection in the document. Selections in Slate are modeled after the native [DOM Selection API](https://developer.mozilla.org/en-US/docs/Web/API/Selection), using terms like "anchor", "focus" and "collapsed".

The "anchor" is the fixed point in a selection, and the "focus" is the non-fixed point, which may move when you move the cursor (eg. when pressing `Shift + Right Arrow`).

Often times, you don't need to specifically know which point is the "anchor" and which is the "focus", and you just need to know which comes first and last in the document. For these cases, there are many convenience equivalent properties and methods referring to the "start" and "end" points.

- [Properties](#properties)
  - [`anchorKey`](#anchorkey-string)
  - [`anchorOffset`](#anchoroffset-number)
  - [`focusKey`](#focuskey-string)
  - [`focusOffset`](#focusoffset-number)
  - [`isBackward`](#isbackward-boolean)
  - [`isFocused`](#isfocused-boolean)
- [Computed Properties](#computed-properties)
  - [`endKey`](#endkey-string)
  - [`endOffset`](#endoffset-number) 
  - [`isBlurred`](#isblurred-boolean)
  - [`isCollapsed`](#iscollapsed-boolean)
  - [`isExpanded`](#isExpanded-boolean)
  - [`isForward`](#isForward-boolean)
  - [`startKey`](#startkey-string)
  - [`startOffset`](#startoffset-number)
- [Static Methods](#static-methods)
  - [`create(properties)`](#create-properties) 
- [Checking Methods](#checking-methods)
  - [`has{Edge}AtEndOf(node)`](hasedgeatendof-node)
  - [`has{Edge}AtStartOf(node)`](hasedgeatstartof-node)
  - [`has{Edge}Between(node, start, end)`](hasedgebetween-node-start-end)
  - [`has{Edge}In(node)`](hasedgein-node)
  - [`isAtEndOf(node)`](isatendof-node)
  - [`isAtStartOf(node)`](isatstartof-node)
- [Transforming Methods](#transforming-methods)
  - [`blur()`](blur)
  - [`extendBackward(n)`](extendbackward-n)
  - [`extendForward(n)`](extendforward-n)
  - [`extendToEndOf(node)`](extendtoendof-node)
  - [`extendToStartOf(node)`](extendtostartof-node)
  - [`focus()`](focus)
  - [`moveBackward(n)`](movebackward-n)
  - [`moveForward(n)`](moveforward-n)
  - [`moveToEndOf(node)`](movetoendof-node)
  - [`moveToRangeOf(node)`](movetorangeof-node)
  - [`moveToStartOf(node)`](movetostartof-node)
  - [`moveTo{Edge}()`](movetoedge)


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

#### `anchorKey: String`

The key of the text node at the selection's anchor point.

#### `anchorOffset: Number`

The numbers of characters from the start of the text node at the selection's anchor point.

#### `focusKey: String`

The key of the text node at the selection's focus point.

#### `focusOffset: Number`

The numbers of characters from the start of the text node at the selection's focus point.

#### `isBackward: Boolean`

Whether the selection is backward. A selection is considered "backward" when its focus point references a location earlier in the document than its anchor point.

#### `isFocused: Boolean`

Whether the selection currently has focus.


## Computed Properties

These properties aren't supplied when creating a selection, but are instead computed based on the real properties.

#### `isBlurred: Boolean`

The opposite of `isFocused`, for convenience.

#### `isCollapsed: Boolean`

Whether the selection is collapsed. A selection is considered "collapsed" when the anchor point and focus point of the selection are the same.

#### `isExpanded: Boolean`

The opposite of `isCollapsed`, for convenience.

#### `isForward: Boolean`

The opposite of `isBackward`, for convenience.

#### `startKey: String`
#### `startOffset: Number`
#### `endKey: String`
#### `endOffset: Number`

A few convenience properties for accessing the first and last point of the selection. When the selection is forward, `start` refers to the `anchor` point and `end` refers to the `focus` point. And when it's backward they are reversed.


## Static Methods

#### `create(properties)`

Create a new `Selection` instance with `properties`.


## Checking Methods

#### `has{Edge}AtStartOf(node: Node) => Boolean`

Determine whether a selection has an edge at the start of a `node`. Where `{Edge}` can be one of: `Anchor`, `Focus`, `Start`, `End` or `Edge` (referring to either point).

#### `has{Edge}AtEndOf(node: Node) => Boolean`

Determine whether a selection has an edge at the end of a `node`. Where `{Edge}` can be one of: `Anchor`, `Focus`, `Start`, `End` or `Edge` (referring to either point).

#### `has{Edge}Between(node: Node, start: Number, end: Number) => Boolean`

Determine whether a selection has an edge in a `node` between its `start` and `end` offset. Where `{Edge}` can be one of: `Anchor`, `Focus`, `Start`, `End` or `Edge` (referring to either point).

#### `has{Edge}In(node: Node, start: Number, end: Number) => Boolean`

Determine whether a selection has an edge inside a `node`. Where `{Edge}` can be one of: `Anchor`, `Focus`, `Start`, `End` or `Edge` (referring to either point).

#### `isAtStartOf(node: Node) => Boolean`

Determine whether the selection is at the start of a `node`.

#### `isAtEndOf(node: Node) => Boolean`

Determine whether the selection is at the end of a `node`.


## Transforming Methods

Since `Selection`s are immutable, all of the transforming methods return a new instance of the selection.

#### `blur() => Selection`

Change the selection's `isFocused` property to `false`.

#### `focus() => Selection`

Change the selection's `isFocused` property to `true`.

#### `moveTo{Edge}() => Selection`

Move both of the selection's points to an edge, collapsing it. Where `{Edge}` can be one of: `Anchor`, `Focus`, `Start` or `End`.

#### `moveToStartOf(node: Node) => Selection`

Move both of the selection's points to the start of a `node`.

#### `moveToEndOf(node: Node) => Selection`

Move both of the selection's points to the end of a `node`.

#### `moveToRangeOf(node: Node) => Selection`

Move the selection's anchor point to the start of a `node`, and its focus point to the end of the same `node`.

#### `moveForward([n = 1: Number]) => Selection`

Increase the selection's `anchorOffset` and `focusOffset` by `n`, defaulting to `1`.

#### `moveBackward([n = 1: Number]) => Selection`

Decrease the selection's `anchorOffset` and `focusOffset` by `n`, defaulting to `1`.

#### `extendForward([n = 1: Number]) => Selection`

Increase the selection's `focusOffset` by `n`, default to `1`.

#### `extendBackward([n = 1: Number]) => Selection`

Decrease the selection's `focusOffset` by `n`, default to `1`.

#### `extendToStartOf(node: Node) => Selection`

Move the selection's `focusOffset` to the start of a `node`.

#### `extendToEndOf(node: Node) => Selection`

Move the selection's `focusOffset` to the end of a `node`.
