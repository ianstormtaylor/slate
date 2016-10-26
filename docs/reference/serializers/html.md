
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
  - [`rule.deserialize`](#ruledeserialize)
  - [`rule.serialize`](#ruleserialize)


## Example

```txt
<p>The Slate editor gives you <em>complete</em> control over the logic you can add.</p>
<p>In its simplest form, when representing plain text, Slate is a glorified <code>&laquo;textarea&raquo;</code>. But you can augment it to be much more than that.</p>
<p>Check out <a href="http://slatejs.org">http://slatejs.org</a> for examples!</p>
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
`Html.serialize(state: State, [options: Object]) => String || Array`

Serialize a `state` into an HTML string. How the string is serialized will be determined by the rules that the `Html` serializer was constructed with. If you pass `render: false` as an option, the return value will instead be an iterable list of the top-level React elements, to be rendered as children in your own React component.


## Rules

To initialize an `Html` serialize, you must pass it an array of rules, defining your schema. Each rule defines how to deserialize and serialize a node or mark, by implementing two functions.

Each rule must define two properties:

```js
{
  deserialize: Function,
  serialize: Function
}
```


#### `rule.deserialize`
`rule.deserialize(el: CheerioElement, next: Function) => Object || Void`

The `deserialize` function should return a plain Javascript object representing the deserialized state, or nothing if the rule in question doesn't know how to deserialize the object, in which case the next rule in the stack will be attempted.

The returned object is almost exactly equivalent to the objects returned by the [`Raw`](./raw.md) serializer, except an extra `kind: 'mark'` is added to account for the ability to nest marks.

The object should be one of:

```js
{
  kind: 'block',
  type: String,
  data: Object,
  nodes: next(...)
}

{
  kind: 'inline',
  type: String,
  data: Object,
  nodes: next(...)
}

{
  kind: 'mark',
  type: String,
  data: Object,
  nodes: next(...)
}

{
  kind: 'text',
  ranges: Array
}
```


#### `rule.serialize`
`rule.serialize(object: Node || Mark || String, children: String || Element || Array) => Element || Void`

The `serialize` function should return a React element representing the serialized HTML, or nothing if the rule in question doesn't know how to serialize the object, in which case the next rule in the stack will be attempted.

The function will be called with either a `Node`, a `Mark`, or a special `String` immutable object, with a `kind: 'string'` property and a `text` property containing the text string.
