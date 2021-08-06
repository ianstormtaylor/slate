# Locations

Locations are how you refer to specific places in the document when inserting, deleting, or doing anything else with a Slate editor. There are a few different kinds of location interfaces, each for different use cases.

## `Path`

Paths are the lowest-level way to refer to a location. Each path is a simple array of numbers that refers to a node in the document tree by its indexes in each of its ancestor nodes down the tree:

```typescript
type Path = number[]
```

For example, in this document:

```javascript
const editor = {
  children: [
    {
      type: 'paragraph',
      children: [
        {
          text: 'A line of text!',
        },
      ],
    },
  ],
}
```

The leaf text node would have a path of: `[0, 0]`.

## `Point`

Points are slightly more specific than paths, and contain an `offset` into a specific text node. Their interface is:

```typescript
interface Point {
  path: Path
  offset: number
}
```

For example, with that same document, if you wanted to refer to the very first place you could put your cursor it would be:

```javascript
const start = {
  path: [0, 0],
  offset: 0,
}
```

Or, if you wanted to refer to the end of the sentence:

```javascript
const end = {
  path: [0, 0],
  offset: 15,
}
```

It can be helpful to think of points as being "cursors" \(or "carets"\) of a selection.

> 🤖 Points _always_ refer to text nodes! Since they are the only ones with strings that can have cursors.

## `Range`

Ranges are a way to refer not just to a single point in the document, but to a wider span of content between two points. \(An example of a range is when you make a selection.\) Their interface is:

```typescript
interface Range {
  anchor: Point
  focus: Point
}
```

> 🤖 The terms "anchor" and "focus" are borrowed from the DOM, see [Anchor](https://developer.mozilla.org/en-US/docs/Web/API/Selection/anchorNode) and [Focus](https://developer.mozilla.org/en-US/docs/Web/API/Selection/focusNode).

An anchor and focus are established by a user interaction. The anchor point isn't always _before_ the focus point in the document. Just like in the DOM, the ordering of an anchor and selection point depend on whether the range is backwards or forwards.

Here's how Mozilla Developer Network explains it:

> A user may make a selection from left to right \(in document order\) or right to left \(reverse of document order\). The anchor is where the user began the selection and the focus is where the user ends the selection. If you make a selection with a desktop mouse, the anchor is placed where you pressed the mouse button and the focus is placed where you released the mouse button. Anchor and focus should not be confused with the start and end positions of a selection, since anchor can be placed before the focus or vice versa, depending on the direction you made your selection. — [`Selection`, MDN](https://developer.mozilla.org/en-US/docs/Web/API/Selection)

One important distinction is that the anchor and focus points of ranges **always reference the leaf-level text nodes** in a document and never reference elements. This behavior is different than the DOM, but it simplifies working with ranges as there are fewer edge cases for you to handle.

> 🤖 For more info, check out the [Range API reference](../api/locations/range.md).

## Selection

Ranges are used in many places in Slate's API when you need to refer to a span of content between two points. One of the most common though is the user's current "selection".

The selection is a special range that is a property of the top-level `Editor`. For example, say someone has the whole sentence currently selected:

```javascript
const editor = {
  selection: {
    anchor: { path: [0, 0], offset: 0 },
    focus: { path: [0, 0], offset: 15 },
  },
  children: [
    {
      type: 'paragraph',
      children: [
        {
          text: 'A line of text!',
        },
      ],
    },
  ],
}
```

> 🤖 The selection concept is also borrowed from the DOM, see [`Selection`, MDN](https://developer.mozilla.org/en-US/docs/Web/API/Selection), although in a greatly-simplified form because Slate doesn't allow for multiple ranges inside a single selection, which makes things a lot easier to work with.

There isn't a special `Selection` interface. It's just an object that happens to respect the more general-purpose `Range` interface instead.
