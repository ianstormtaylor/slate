
# Utils

```js
import {
  findDOMNode,
  setKeyGenerator
} from 'slate'
```

Utility functions that ship with Slate that may be useful for certain use cases.

- [`findDOMNode`](#finddomnode)
- [`setKeyGenerator`](#setkeygenerator)


## Functions

### `findDOMNode`
`findDOMNode(key: String) => DOMElement`

Allows you to find the DOM node for a Slate [`Node`](../models/node.md) by passing its `key` string. Modelled after React's built-in `findDOMNode` helper.

### `setKeyGenerator`
`setKeyGenerator(generator: Function) => Void`

Allows you to specify your own key generating function, instead of using Slate's built-in default generator which simply uses auto-incrementing number strings. (eg. `'0'`, `'1'`, `'2'`, ...)

This will act globally on all uses of the Slate dependency.
