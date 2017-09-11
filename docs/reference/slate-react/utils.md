
# Utils

```js
import {
  findDOMNode,
  setKeyGenerator
} from 'slate'
```

Utility functions that ship with Slate that may be useful for certain use cases.

- [`findDOMNode`](#finddomnode)
- [`resetKeyGenerator`](#resetkeygenerator)
- [`setKeyGenerator`](#setkeygenerator)


## Functions

### `findDOMNode`
`findDOMNode(node : Node) => DOMElement`

Allows you to find the DOM node for a Slate [`Node`](../models/node.md). Modelled after React's built-in `findDOMNode` helper.

### `resetKeyGenerator`
`resetkeygenerator() => Void`

Resets Slate's internal key generating function to its default state. This is useful for server-side rendering, or anywhere you want to ensure fresh, deterministic creation of keys.

### `setKeyGenerator`
`setKeyGenerator(generator: Function) => Void`

Allows you to specify your own key generating function, instead of using Slate's built-in default generator which simply uses auto-incrementing number strings. (eg. `'0'`, `'1'`, `'2'`, ...)

This will act globally on all uses of the Slate dependency.
