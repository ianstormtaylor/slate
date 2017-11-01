
# Utils

```js
import { 
  findDOMNode,
  findDOMRange,
  findNode,
  findRange,
  getEventRange,
  getEventTransfer,
  setEventTransfer,
} from 'slate-react'
```

React-specific utility functions for Slate that may be useful in certain use cases.


## Functions

### `findDOMNode`
`findDOMNode(node: Node) => DOMElement`

Find the DOM node from a Slate [`Node`](../slate/node.md). Modelled after React's built-in `findDOMNode` helper.

```js
function componentDidUpdate() {
  const { node } = this.props
  const element = findDOMNode(node)
  // Do something with the DOM `element`...
}
```

### `findDOMRange`
`findDOMRange(range: Range) => DOMRange`

Find the DOM range from a Slate [`Range`](../slate/range.md).

```js 
function onChange(change) {
  const { value } = change
  const range = findDOMRange(value.selection)
  // Do something with the DOM `range`...
}
```

### `findNode`
`findNode(element: DOMElement, value: Value) => Node`

Find the Slate node from a DOM `element` and Slate `value`.

```js
function onSomeNativeEvent(event) {
  const node = findNode(event.target)
  // Do something with `node`...
}
```

### `findRange`
`findRange(selection: DOMSelection, value: Value) => Range`
`findRange(range: DOMRange, value: Value) => Range`

Find the Slate range from a DOM `range` or `selection` and a Slate `value`.

```js
function onSomeNativeEvent() {
  // You can find a range from a native DOM selection...
  const nativeSelection = window.getSelection()
  const range = findRange(nativeSelection, value)

  // ...or from a native DOM range...
  const nativeRange = nativeSelection.getRangeAt(0)
  const range = findRange(nativeRange, value)
}
```

### `getEventRange`
`getEventRange(event: DOMEvent|ReactEvent, value: Value) => Range`

Get the affected Slate range from a DOM `event` and Slate `value`.

```js
function onDrop(event, change, editor) {
  const targetRange = getEventRange(event)
  // Do something at the drop `targetRange`...
}
```

### `getEventTransfer`
`getEventTransfer(event: DOMEvent|ReactEvent) => Object`

Get the Slate-related data from a DOM `event` and Slate `value`.

```js
function onDrop(event, change, editor) {
  const transfer = getEventTransfer(event)
  const { type, node } = transfer

  if (type == 'node') {
    // Do something with `node`...
  }
}
```

### `setEventTransfer`
`setEventTransfer(event: DOMEvent|ReactEvent, type: String, data: Any)`

Sets the Slate-related `data` with `type` on an `event`. The `type` must be one of the types Slate recognizes: `'fragment'`, `'html'`, `'node'`, `'rich'`, or `'text'`.

```js
function onDragStart(event, change, editor) {
  const { value } = change
  const { startNode } = value
  setEventTransfer(event, 'node', startNode)
}
```
