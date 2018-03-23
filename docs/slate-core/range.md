# Range

```javascript
import { Range } from 'slate'
```

A range of a Slate [`Document`](document.md). Ranges in Slate are modeled after a combination of the [DOM Selection API](https://developer.mozilla.org/en-US/docs/Web/API/Selection) and the [DOM Range API](https://developer.mozilla.org/en-US/docs/Web/API/Range), using terms like "anchor", "focus" and "collapsed".

The "anchor" is the fixed point in a range, and the "focus" is the non-fixed point, which may move when you move the cursor \(eg. when pressing `Shift + Right Arrow`\).

Often times, you don't need to specifically know which point is the "anchor" and which is the "focus", and you just need to know which comes first and last in the document. For these cases, there are many convenience equivalent properties and methods referring to the "start" and "end" points.

## Properties

```javascript
Range({
  anchorKey: String,
  anchorOffset: Number,
  focusKey: String,
  focusOffset: Number,
  isFocused: Boolean,
  isBackward: Boolean,
})
```

### `anchorKey`

`String`

The key of the text node at the range's anchor point.

### `anchorOffset`

`Number`

The number of characters from the start of the text node at the range's anchor point.

### `focusKey`

`String`

The key of the text node at the range's focus point.

### `focusOffset`

`Number`

The number of characters from the start of the text node at the range's focus point.

### `isBackward`

`Boolean`

Whether the range is backward. A range is considered "backward" when its focus point references a location earlier in the document than its anchor point.

### `isFocused`

`Boolean`

Whether the range currently has focus.

### `object`

`String`

A string with a value of `'range'`.

## Computed Properties

These properties aren't supplied when creating a range, but are instead computed based on the real properties.

### `isBlurred`

`Boolean`

The opposite of `isFocused`, for convenience.

### `isCollapsed`

`Boolean`

Whether the range is collapsed. A range is considered "collapsed" when the anchor point and focus point of the range are the same.

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

A few convenience properties for accessing the first and last point of the range. When the range is forward, `start` refers to the `anchor` point and `end` refers to the `focus` point. And when it's backward they are reversed.

## Static Methods

### `Range.create`

`Range.create(properties: Object) => Range`

Create a new `Range` instance with `properties`.

### `Range.fromJSON`

`Range.fromJSON(object: Object) => Range`

Create a range from a JSON `object`.

### `Range.isRange`

`Range.isRange(maybeRange: Any) => Boolean`

Returns a boolean if the passed in argument is a `Range`.

## Instance Methods

### `toJSON`

`toJSON() => Object`

Returns a JSON representation of the range.

## Checking Methods

### `has{Edge}AtStartOf`

`has{Edge}AtStartOf(node: Node) => Boolean`

Determine whether a range has an edge at the start of a `node`. Where `{Edge}` can be one of: `Anchor`, `Focus`, `Start`, `End` or `Edge` \(referring to either point\).

### `has{Edge}AtEndOf`

`has{Edge}AtEndOf(node: Node) => Boolean`

Determine whether a range has an edge at the end of a `node`. Where `{Edge}` can be one of: `Anchor`, `Focus`, `Start`, `End` or `Edge` \(referring to either point\).

### `has{Edge}Between`

`has{Edge}Between(node: Node, start: Number, end: Number) => Boolean`

Determine whether a range has an edge in a `node` between its `start` and `end` offset. Where `{Edge}` can be one of: `Anchor`, `Focus`, `Start`, `End` or `Edge` \(referring to either point\).

### `has{Edge}In`

`has{Edge}In(node: Node) => Boolean`

Determine whether a range has an edge inside a `node`. Where `{Edge}` can be one of: `Anchor`, `Focus`, `Start`, `End` or `Edge` \(referring to either point\).

### `isAtStartOf`

`isAtStartOf(node: Node) => Boolean`

Determine whether the range is at the start of a `node`.

### `isAtEndOf`

`isAtEndOf(node: Node) => Boolean`

Determine whether the range is at the end of a `node`.

