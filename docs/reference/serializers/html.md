
# `Html`

```js
import { Html } from 'slate'
```

The `Html` serializer lets you parse and stringify arbitrary HTML content, based on your specific schema's use case. You must pass a series of `rules` to define how your Slate schema should be serialized to and from HTML.

For an example of the `Html` serializer in action, check out the [`paste-html` example](../../examples/paste-html).

- [Example](#example)
- [Properties](#properties)
  - [`rules`](#rules)
- [Methods](#methods)
  - [`deserialize`](#deserialize)
  - [`serialize`](#serialize)
- [Rules](#rules)
  - [Rule Properties](#rule-properties)
    - [`rule.deserialize`](#ruledeserialize)
    - [`rule.serialize`](#ruleserialize)


## Example

```txt
The Slate editor gives you full control over the logic you can add.\nIn its simplest form, when representing plain text, Slate is a glorified <textarea>. But you can augment it to be much more than that.\nCheck out http://slatejs.org for examples!
```


## Properties

```js
new Html({
  rules: Array
})
```

### `rules`
`Array`

An array of rules to initialize the `Html` serializer with, defining your schema.


## Methods

### `Html.deserialize`
`Html.deserialize(html: String) => State`

Deserialize an HTML `string` into a [`State`](../models/state.md). How the string is deserialized will be determined by the rules that the `Html` serializer was constructed with.

### `Html.serialize`
`Html.serialize(state: State) => String`

Serialize a `state` into an HTML string. How the string is serialized will be determined by the rules that the `Html` serializer was constructed with.


## Rules

To initialize an `Html` serialize, you must pass it an array of rules, defining your schema. Each rule defines how to deserialize and serialize a node or mark, by implementing two functions.

### Rule Properties

```js
{
  deserialize: Function,
  serialize: Function
}
```

Each rule must define two properties:

#### `rule.deserialize`
`rule.deserialize(el: CheerioElement, next: Function) => Object`


#### `rule.serialize`
`rule.serialize(object: Node || Mark) => ReactElement`

_To implement still..._
