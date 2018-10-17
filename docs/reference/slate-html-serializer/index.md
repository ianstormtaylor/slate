# `slate-html-serializer`

```js
import Html from 'slate-html-serializer'
```

The HTML serializer lets you parse and stringify arbitrary HTML content, based on your specific schema's use case. You must pass a series of `rules` to define how your Slate schema should be serialized to and from HTML.

For an example of the HTML serializer in action, check out the [`paste-html` example](../../../examples/paste-html).

## Example

```txt
<p>The Slate editor gives you <em>complete</em> control over the logic you can add.</p>
<p>In its simplest form, when representing plain text, Slate is a glorified <code>&laquo;textarea&raquo;</code>. But you can augment it to be much more than that.</p>
<p>Check out <a href="http://slatejs.org">http://slatejs.org</a> for examples!</p>
```

## Properties

```js
new Html({
  rules: Array,
  defaultBlock: String | Object | Block,
  parseHtml: Function,
})
```

### `rules`

`Array`

An array of rules to initialize the HTML serializer with, defining your schema.

### `defaultBlock`

`String|Object|Block`

A set of properties to use for blocks which do not match any rule. Can be a string such as `'paragraph'` or an object with a `type` attribute such as `{ type: 'paragraph' }`, or even a [`Block`](../slate/block.md).

### `parseHtml`

`Function`

A function to parse an HTML string and return a DOM object. Defaults to using the native `DOMParser` in browser environments that support it. For older browsers or server-side rendering, you can include the [jsdom](https://www.npmjs.com/package/jsdom) package and pass `JSDOM.fragment` as the `parseHtml` option.

This parse function should return the `<body>` node of the DOM.

## Methods

### `Html.deserialize`

`Html.deserialize(html: String, [options: Object]) => Value`

Deserialize an HTML `string` into a [`Value`](../slate/value.md). How the string is deserialized will be determined by the rules that the HTML serializer was constructed with.

If you pass `toJSON: true` as an option, the return value will be a JSON object instead of a [`Value`](../slate/value.md) object.

### `Html.serialize`

`Html.serialize(value: Value, [options: Object]) => String || Array`

Serialize a `value` into an HTML string. How the string is serialized will be determined by the rules that the HTML serializer was constructed with.

If you pass `render: false` as an option, the return value will instead be an iterable list of the top-level React elements, to be rendered as children in your own React component.

## Rules

To initialize an HTML serializer, you must pass it an array of rules, defining your schema. Each rule defines how to deserialize and serialize a node or mark, by implementing two functions.

Each rule must define two properties:

```js
{
  deserialize: Function,
  serialize: Function
}
```

### `rule.deserialize`

`rule.deserialize(el: Element, next: Function) => Object || Void`

The `deserialize` function receives a DOM element and should return a plain JavaScript object representing the deserialized value, or nothing if the rule in question doesn't know how to deserialize the object, in which case the next rule in the stack will be attempted.

The object should be one of:

```js
{
  object: 'block',
  type: String,
  data: Object,
  nodes: next(...)
}

{
  object: 'inline',
  type: String,
  data: Object,
  nodes: next(...)
}

{
  object: 'mark',
  type: String,
  data: Object,
  nodes: next(...)
}

{
  object: 'text',
  leaves: Array
}
```

### `rule.serialize`

`rule.serialize(object: Node || Mark || String, children: String || Element || Array) => Element || Void`

The `serialize` function should return a React element representing the serialized HTML, or nothing if the rule in question doesn't know how to serialize the object, in which case the next rule in the stack will be attempted.

The function will be called with either a `Node`, a `Mark`, or a special `String` immutable object, with a `object: 'string'` property and a `text` property containing the text string.

### Default Text Rule

The HTML serializer includes a default rule to handle "normal text". That is, a final rule exists to serialize `object: 'string'` text (replacing line feed characters with `<br>`), and to deserialize text inversely. To avoid this default handling simply provide your own `deserialize` and `serialize` rules for text.
