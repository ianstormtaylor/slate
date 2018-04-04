# `slate-plain-serializer`

```js
import Plain from 'slate-plain-serializer'
```

A serializer that converts a Slate [`Value`](../slate/value.md) to and from a plain text string.

## Example

```txt
The Slate editor gives you full control over the logic you can add.\n
In its simplest form, when representing plain text, Slate is a glorified <textarea>. But you can augment it to be much more than that.\n
Check out http://slatejs.org for examples!
```

## Methods

### `Plain.deserialize`

`Plain.deserialize(string: String, [options: Object]) => Value`

Deserialize a plain text `string` into a [`Value`](../slate/value.md). A series of blocks will be created by splitting the input string on `\n` characters. Each block is given a type of `'line'`.

If you pass `toJSON: true` as an option, the return value will be a JSON object instead of a [`Value`](../slate/value.md) object.

### `Plain.serialize`

`Plain.serialize(value: Value) => String`

Serialize a `value` into a plain text string. Each direct child block of the document will be separated by a `\n` character.
