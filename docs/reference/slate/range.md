# `Range`

```js
import { Range } from 'slate'
```

A range of a Slate [`Document`](./document.md). Ranges in Slate are modeled after a combination of the [DOM Selection API](https://developer.mozilla.org/en-US/docs/Web/API/Selection) and the [DOM Range API](https://developer.mozilla.org/en-US/docs/Web/API/Range), using terms like "anchor", "focus" and "collapsed".

The "anchor" is the fixed point in a range, and the "focus" is the non-fixed point, which may move when you move the cursor (eg. when pressing `Shift + Right Arrow`).

Often times, you don't need to specifically know which point is the "anchor" and which is the "focus", and you just need to know which comes first and last in the document. For these cases, there are many convenience equivalent properties and methods referring to the "start" and "end" points.

The `Range` model is also used as an interface and implemented by the [`Decoration`](./decoration.md) and [`Selection`](./selection.md) models.

## Properties

```js
Range({
  anchor: Point,
  focus: Point,
})
```

### `anchor`

`Point`

The range's anchor point.

### `focus`

`Point`

The range's focus point.

### `object`

`String`

A string with a value of `'range'`.

## Computed Properties

These properties aren't supplied when creating a range, but are instead computed based on the real properties.

### `end`

Either the `anchor` or the `focus` point, depending on which comes last in the document order.

### `isBackward`

`Boolean`

Whether the range is backward. A range is considered "backward" when its focus point references a location earlier in the document than its anchor point.

### `isCollapsed`

`Boolean`

Whether the range is collapsed. A range is considered "collapsed" when the anchor point and focus point of the range are the same.

### `isExpanded`

`Boolean`

The opposite of `isCollapsed`, for convenience.

### `isForward`

`Boolean`

The opposite of `isBackward`, for convenience.

### `isSet`

`Boolean`

Whether both the `anchor` and `focus` points are set.

### `isUnset`

`Boolean`

Whether either the `anchor` and `focus` points are unset.

### `start`

Either the `anchor` or the `focus` point, depending on which comes first in the document order.

## Static Methods

### `Range.create`

`Range.create(properties: Object) => Range`

Create a new `Range` instance with `properties`.

### `Range.createProperties`

`Range.createProperties(object: Object|Range) => Object`

Create a new dictionary of range properties from an `object`.

### `Range.fromJSON`

`Range.fromJSON(object: Object) => Range`

Create a range from a JSON `object`.

### `Range.isRange`

`Range.isRange(value: Any) => Boolean`

Check whether a `value` is a `Range`.

## Instance Methods

### `toJSON`

`toJSON() => Object`

Return a JSON representation of the range.

## Mutating Methods

### `move{Point}Backward`

`move{Point}Backward(n: Number) => Range`

Move the `{Point}` of the range backwards by `n` characters. The `{Point}` can be one of: `Anchor`, `Focus`, `Start`, `End`, or ommited to move both the `anchor` and `focus` point at once.

### `move{Point}Forward`

`move{Point}Forward(n: Number) => Range`

Move the `{Point}` of the range forwards by `n` characters. The `{Point}` can be one of: `Anchor`, `Focus`, `Start`, `End`, or ommited to move both the `anchor` and `focus` point at once.

### `move{Point}To`

`move{Point}To(path: List, offset: Number) => Range`
`move{Point}To(key: String, offset: Number) => Range`
`move{Point}To(offset: Number) => Range`

Move the `{Point}` of the range to a new `key`, `path` and `offset`. The `{Point}` can be one of: `Anchor`, `Focus`, `Start`, `End`, or ommited to move both the `anchor` and `focus` point at once.

> 🤖 When using `range.move{Point}To`, since the range isn't aware of the document, it's possible it will become "unset" if the path or key changes and need to be re-normalized relative to the document using `range.normalize(document)`.

### `move{Point}ToEndOfNode`

`move{Point}ToEndOfNode(node: Node) => Range`

Move the `{Point}` to the end of a `node`. The `{Point}` can be one of: `Anchor`, `Focus`, `Start`, `End`, or ommited to move both the `anchor` and `focus` point at once.

> 🤖 This method may need to be followed by `point.normalize(document)`, like [`move{Point}To`](#movepointto).

### `move{Point}ToStartOfNode`

`move{Point}ToStartOfNode(node: Node) => Range`

Move the `{Point}` to the start of a `node`. The `{Point}` can be one of: `Anchor`, `Focus`, `Start`, `End`, or ommited to move both the `anchor` and `focus` point at once.

> 🤖 This method may need to be followed by `point.normalize(document)`, like [`move{Point}To`](#movepointto).

### `moveTo{Point}`

`moveTo{Point}() => Range`

Move both points of the range to `{Point}`, collapsing it. The `{Point}` can be one of: `Anchor`, `Focus`, `Start` or `End`.

### `moveToRangeOfNode`

`moveToRangeOfNode(node: Node) => Range`

Move the range to be spanning the entirity of a `node`, by placing its `anchor` point at the start of the node and its `focus` point at the end of the node.

> 🤖 This method may need to be followed by `point.normalize(document)`, like [`move{Point}To`](#movepointto).

### `normalize`

`normalize(node: Node) => Range`

Normalize the range relative to a `node`, ensuring that its anchor and focus points exist in the `node`, that their keys and paths are in sync, that their offsets are valid, and that they references leaf text nodes.

### `setAnchor`

`setAnchor(anchor: Point) => Range`

Return a new range with a new `anchor` point.

### `setEnd`

`setEnd(end: Point) => Range`

Return a new range with a new `end` point.

### `setFocus`

`setFocus(focus: Point) => Range`

Return a new range with a new `focus` point.

### `setProperties`

`setProperties(properties: Object|Range) => Range`

Return a new range with new `properties` set.

### `setStart`

`setStart(start: Point) => Range`

Return a new range with a new `start` point.

### `unset`

`unset() => Range`

Return a new range with both of its point unset.
