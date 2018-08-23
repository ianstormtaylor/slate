# Utils

```js
import { KeyUtils } from 'slate'
```

Utility functions that ship with Slate that may be useful for certain use cases.

## Key Utils

### `KeyUtils.create`

`create() => String`

Create a new key using the current key generator.

### `KeyUtils.resetGenerator`

`resetGenerator() => Void`

Resets Slate's internal key generating function to its default state. This is useful for server-side rendering, or anywhere you want to ensure fresh, deterministic creation of keys.

### `KeyUtils.setGenerator`

`setGenerator(generator: Function) => Void`

Allows you to specify your own key generating function, instead of using Slate's built-in default generator which simply uses auto-incrementing number strings. (eg. `'0'`, `'1'`, `'2'`, ...)

This will act globally on all uses of the Slate dependency.
