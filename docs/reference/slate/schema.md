# `Schema`

Every Slate editor has a "schema" associated with it, which contains information about the structure of its content. For the most basic cases, you'll just rely on Slate's default core schema. But for advanced use cases, you can enforce rules about what the content of a Slate document can contain.

## Properties

```js
{
  document: Object,
  blocks: Object,
  inlines: Object,
}
```

The top-level properties of a schema give you a way to define validation "rules" that the schema enforces.

### `document`

`Object`

```js
{
  document: {
    nodes: [
      {
        match: { type: 'paragraph' },
      },
    ]
  }
}
```

A set of validation rules that apply to the top-level document.

### `blocks`

`Object`

```js
{
  blocks: {
    list: {
      nodes: [{
        match: { type: 'item' }
      }]
    },
    item: {
      parent: { type: 'list' }
    },
  }
}
```

A dictionary of blocks by type, each with its own set of validation rules.

### `inlines`

`Object`

```js
{
  inlines: {
    emoji: {
      isVoid: true,
      nodes: [{
        match: { object: 'text' }
      }]
    },
  }
}
```

A dictionary of inlines by type, each with its own set of validation rules.

## Rule Properties

```js
{
  data: Object,
  first: Object|Array,
  isVoid: Boolean,
  last: Object|Array,
  marks: Array,
  match: Object|Array,
  nodes: Array,
  normalize: Function,
  parent: Object|Array,
  text: RegExp,
}
```

Slate schemas are built using a set of validation rules. Each of the properties will validate certain pieces of the document based on the properties it defines.

### `data`

`Object`

```js
{
  data: {
    level: 2,
    href: v => isUrl(v),
  }
}
```

A dictionary of data attributes and their corresponding values or validation functions. The functions should return a boolean indicating whether the data value is valid or not.

### `first`

`Object|Array`

```js
{
  first: { type: 'quote' },
}
```

```js
{
  first: [{ type: 'quote' }, { type: 'paragraph' }],
}
```

Will validate the first child node against a [`match`](#match).

### `isVoid`

`Boolean`

```js
{
  isVoid: true,
}
```

Will validate a node's `isVoid` property.

### `last`

`Object|Array`

```js
{
  last: { type: 'quote' },
}
```

```js
{
  last: [{ type: 'quote' }, { type: 'paragraph' }],
}
```

Will validate the last child node against a [`match`](#match).

### `nodes`

`Array`

```js
{
  nodes: [
    {
      match: [{ type: 'image' }, { type: 'video' }],
      min: 1,
      max: 3,
    },
    {
      match: { type: 'paragraph' },
      min: 0,
    },
  ],
}
```

Will validate a node's children. The `nodes` definitions can declare a [`match`](#match) as well as `min` and `max` properties.

> 🤖 The `nodes` array is order-sensitive! The example above will require that the first node be either an `image` or `video`, and that it be followed by one or more `paragraph` nodes.

### `marks`

`Array`

```js
{
  marks: [{ type: 'bold' }, { type: 'italic' }]
}
```

Will validate a node's marks. The `marks` definitions can declare the `type` property, providing a list of mark types to be allowed. If declared, any marks that are not in the list will be removed.

### `normalize`

`normalize(change: Change, error: SlateError) => Void`

```js
{
  normalize: (change, error) => {
    switch (error.code) {
      case 'child_object_invalid':
        change.wrapBlockByKey(error.child.key, 'paragraph')
        return
      case 'child_type_invalid':
        change.setNodeByKey(error.child.key, 'paragraph')
        return
    }
  }
}
```

A function that can be provided to override the default behavior in the case of a rule being invalid. By default, Slate will do what it can, but since it doesn't know much about your schema, it will often remove invalid nodes. If you want to override this behavior and "fix" the node instead of removing it, pass a custom `normalize` function.

For more information on the arguments passed to `normalize`, see the [Normalizing](#normalizing) section.

### `parent`

`Object|Array`

```js
{
  parent: { type: 'list' },
}
```

```js
{
  parent: [{ type: 'ordered_list' }, { type: 'unordered_list' }],
}
```

Will validate a node's parent against a [`match`](#match).

### `text`

`Array`

```js
{
  text: /^\w+$/
}
```

Will validate a node's text with a regex.

## Static Methods

### `Schema.create`

`Schema.create(properties: Object) => Schema`

Create a new `Schema` instance with `properties`.

### `Schema.fromJSON`

`Schema.fromJSON(object: Object) => Schema`

Create a schema from a JSON `object`.

### `Schema.isSchema`

`Schema.isSchema(maybeSchema: Any) => Boolean`

Returns a boolean if the passed in argument is a `Schema`.

## Instance Methods

### `toJSON`

`toJSON() => Object`

Returns a JSON representation of the schema.

## Normalizing

When supplying your own `normalize` property for a schema rule, it will be called with `(change, error)`. The error `code` will be one of a set of potential code strings, and it will contain additional helpful properties depending on the type of error.

A set of the invalid violation strings are available as constants via the [`slate-schema-violations`](../slate-schema-violations/index.md) package.
