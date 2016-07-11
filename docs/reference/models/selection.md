
### `Selection`

A selection in the document. Selections in Slate are modeled after the native [DOM Selection API](https://developer.mozilla.org/en-US/docs/Web/API/Selection), using terms like "anchor", "focus" and "collapsed".

The "anchor" is the fixed point in a selection, and the "focus" is the non-fixed point, which may move when you move the cursor (eg. when pressing `Shift + Right Arrow`).

Often times, you don't need to specifically know which point is the "anchor" and which is the "focus", and you just need to know which comes first and last in the document. For these cases, there are many convenience equivalent properties and methods referring to the "start" and "end" points.

- [Module](#module)
- [Properties](#properties)
- [Methods](#methods)


### Module

```js
import { Selection } from 'Slate'
```


### Properties

```js
new Selection({
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


### Computed Properties

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

A few convenience properties for accessing the first and last point of the selection. When the selection is forward, `start` refers to the `anchor` point and `end` refers to the `focus` point, and when it's backward they are reversed.


### Methods

#### `hasAnchorAtStartOf(node: Node) => Boolean`
#### `hasFocusAtStartOf(node: Node) => Boolean`
#### `hasStartAtStartOf(node: Node) => Boolean`
#### `hasEndAtStartOf(node: Node) => Boolean`

Determine whether a selection has an edge at the start of a `node`. Where `{Edge}` can be one of: `Anchor`, `Focus`, `Start` or `End`.


### Methods

#### `getState() => State`

Return the editor's current internal state.

#### `onChange(state: State) => Void`

Effectively the same as `setState`. Invoking this method will update the state of the editor, running it through all of it's plugins, and passing it the parent component, before it cycles back down as the new `state` property of the editor.
