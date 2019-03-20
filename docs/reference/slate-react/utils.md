# Utils

```js
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

`cloneFragment(event: DOMEvent|ReactEvent, editor: Editor, fragment: Document)`

During a cut or copy event, sets `fragment` as the Slate document fragment to be copied.

```js
function onCopy(event, editor, next) {
  const fragment = // ... create a fragment from a set of nodes ...

  if (fragment) {
    cloneFragment(event, editor, fragment)
    return true
  }
}
```

Note that calling `cloneFragment` should be the last thing you do in your event handler. If you change the window selection after calling `cloneFragment`, the browser may copy the wrong content. If you need to perform an action after calling `cloneFragment`, wrap it in `requestAnimationFrame`:

```js
function onCut(event, editor, next) {
  const fragment = // ... create a fragment from a set of nodes ...

  if (fragment) {
    cloneFragment(event, editor, fragment)
    window.requestAnimationFrame(() => {
      editor.delete()
    })
    return true
  }
}
```

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
function onChange(editor) {
  const { value } = editor
  const range = findDOMRange(value.selection)
  // Do something with the DOM `range`...
}
```

### `findNode`

`findNode(element: DOMElement, editor: Editor) => Node`

Find the Slate node from a DOM `element` and Slate `editor`.

```js
function onSomeNativeEvent(event) {
  const node = findNode(event.target, editor)
  // Do something with `node`...
}
```

### `findRange`

`findRange(selection: DOMSelection, editor: Editor) => Range`
`findRange(range: DOMRange, editor: Editor) => Range`

Find the Slate range from a DOM `range` or `selection` and a Slate `editor`.

```js
function onSomeNativeEvent() {
  // You can find a range from a native DOM selection...
  const nativeSelection = window.getSelection()
  const range = findRange(nativeSelection, editor)

  // ...or from a native DOM range...
  const nativeRange = nativeSelection.getRangeAt(0)
  const range = findRange(nativeRange, editor)
}
```

### `getEventRange`

`getEventRange(event: DOMEvent|ReactEvent, editor: Editor) => Range`

Get the affected Slate range from a DOM `event` and Slate `editor`.

```js
function onDrop(event, editor, next) {
  const targetRange = getEventRange(event, editor)
  // Do something at the drop `targetRange`...
}
```

### `getEventTransfer`

`getEventTransfer(event: DOMEvent|ReactEvent) => Object`

Get the Slate-related data from a DOM `event` and Slate `value`.

```js
function onDrop(event, editor, next) {
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
function onDragStart(event, editor, next) {
  const { value } = editor
  const { startNode } = value
  setEventTransfer(event, 'node', startNode)
}
```
