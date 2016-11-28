
# Utils

These are extra utility functions that ship with Slate that may be useful for certain use cases.


## `setKeyGenerator`
`setKeyGenerator(generator: Function) => Void`

Allows you to specify your own key generating function, instead of using Slate's built-in default generator which simply uses auto-incrementing number strings. (eg. `'0'`, `'1'`, `'2'`, ...)

This will act globally on all uses of the Slate dependency.
