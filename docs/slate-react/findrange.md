# findRange

```javascript
import {
  cloneFragment,
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

### `cloneFragment`

`cloneFragment(event: DOMEvent|ReactEvent, value: Value, fragment: Document)`

During a cut or copy event, sets `fragment` as the Slate document fragment to be copied.

```javascript
function onCopy(event, change, editor) {
  const { value } = change
  const fragment = // ... create a fragment from a set of nodes ...

  if (fragment) {
    cloneFragment(event, value, fragment)
    return true
  }
}
```

Note that calling `cloneFragment` should be the last thing you do in your event handler. If you change the window selection after calling `cloneFragment`, the browser may copy the wrong content. If you need to perform an action after calling `cloneFragment`, wrap it in `requestAnimationFrame`:

```javascript
function onCut(event, change, editor) {
  const { value } = change
  const fragment = // ... create a fragment from a set of nodes ...

  if (fragment) {
    cloneFragment(event, value, fragment)
    window.requestAnimationFrame(() => {
      editor.change(change => change.delete())
    })
    return true
  }
}
```

### `findDOMNode`

`findDOMNode(node: Node) => DOMElement`

Find the DOM node from a Slate [`Node`](../slate-core/node.md). Modelled after React's built-in `findDOMNode` helper.

```javascript
function componentDidUpdate() {
  const { node } = this.props
  const element = findDOMNode(node)
  // Do something with the DOM `element`...
}
```

### `findDOMRange`

`findDOMRange(range: Range) => DOMRange`

Find the DOM range from a Slate [`Range`](../slate-core/range.md).

```javascript
function onChange(change) {
  const { value } = change
  const range = findDOMRange(value.selection)
  // Do something with the DOM `range`...
}
```

### `findNode`

`findNode(element: DOMElement, value: Value) => Node`

Find the Slate node from a DOM `element` and Slate `value`.

```javascript
function onSomeNativeEvent(event) {
  const node = findNode(event.target)
  // Do something with `node`...
}
```

### `findRange`

`findRange(selection: DOMSelection, value: Value) => Range`  
`findRange(range: DOMRange, value: Value) => Range`

Find the Slate range from a DOM `range` or `selection` and a Slate `value`.

```javascript
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

```javascript
function onDrop(event, change, editor) {
  const targetRange = getEventRange(event)
  // Do something at the drop `targetRange`...
}
```

### `getEventTransfer`

`getEventTransfer(event: DOMEvent|ReactEvent) => Object`

Get the Slate-related data from a DOM `event` and Slate `value`.

```javascript
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

```javascript
function onDragStart(event, change, editor) {
  const { value } = change
  const { startNode } = value
  setEventTransfer(event, 'node', startNode)
}
```

