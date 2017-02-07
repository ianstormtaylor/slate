
# `Plain`

```js
import { Plain } from 'slate'
```

A serializer that converts a Slate [`State`](../models/state.md) to and from a plain text string.

- [Example](#example)
- [Static Methods](#methods)
  - [`Plain.deserialize`](#plaindeserialize)
  - [`Plain.serialize`](#plainserialize)


## Example

```txt
The Slate editor gives you full control over the logic you can add.\n
In its simplest form, when representing plain text, Slate is a glorified <textarea>. But you can augment it to be much more than that.\n
Check out http://slatejs.org for examples!
```


## Methods

### `Plain.deserialize`
`Plain.deserialize(string: String, [options: Object]) => State`

Deserialize a plain text `string` into a [`State`](../models/state.md). A series of blocks will be created by splitting the input string on `\n` characters. Each block is given a type of `'line'`.

If you pass `toRaw: true` as an option, the return value will be a [`Raw`](./raw.md) JSON object instead of a [`State`](../models/state.md) object.

### `Plain.serialize`
`Plain.serialize(state: State) => String`

Serialize a `state` into a plain text string. Each direct child block of the document will be separated by a `\n` character.
