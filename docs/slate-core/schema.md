# Schema

Every Slate editor has a "schema" associated with it, which contains information about the structure of its content. For the most basic cases, you'll just rely on Slate's default core schema. But for advanced use cases you can enforce rules about what the content of a Slate document can contain.

## Properties

```javascript
{
  document: Object,
  blocks: Object,
  inlines: Object,
}
```

The top-level properties of a schema all give you a way to define validation "rules" that the schema enforces.

### `document`

`Object`

```javascript
{
  document: {
    nodes: [{ types: ['paragraph'] }]
  }
}
```

A set of validation rules that apply to the top-level document.

### `blocks`

`Object`

```javascript
{
  blocks: {
    list: {
      nodes: [{ types: ['item'] }]
    },
    item: {
      parent: { types: ['list'] }
    },
  }
}
```

A dictionary of blocks by type, each with its own set of validation rules.

### `inlines`

`Object`

```javascript
{
  inlines: {
    emoji: {
      isVoid: true,
      nodes: [{ objects: ['text'] }]
    },
  }
}
```

A dictionary of inlines by type, each with its own set of validation rules.

## Rule Properties

```javascript
{
  data: Object,
  first: Object,
  isVoid: Boolean,
  last: Object,
  nodes: Array,
  marks: Array,
  normalize: Function,
  parent: Object,
  text: RegExp,
}
```

Slate schemas are built up of a set of validation rules. Each of the properties will validate certain pieces of the document based on the properties it defines.

### `data`

`Object`

```javascript
{
  data: {
    href: v => isUrl(v),
  }
}
```

A dictionary of data attributes and their corresponding validation functions. The functions should return a boolean indicating whether the data value is valid or not.

### `first`

`Object`

```javascript
{
  first: { types: ['quote', 'paragraph'] },
}
```

Will validate the first child node. The `first` definition can declare `objects` and `types` properties.

### `isVoid`

`Boolean`

```javascript
{
  isVoid: true,
}
```

Will validate a node's `isVoid` property.

### `last`

`Object`

```javascript
{
  last: { types: ['quote', 'paragraph'] },
}
```

Will validate the last child node. The `last` definition can declare `objects` and `types` properties.

### `nodes`

`Array`

```javascript
{
  nodes: [
    { types: ['image', 'video'], min: 1, max: 3 },
    { types: ['paragraph'], min: 0 },
  ]
}
```

Will validate a node's children. The `nodes` definitions can declare the `objects`, `types`, `min` and `max` properties.

> 🤖 The `nodes` array is order-sensitive! The example above will require that the first node be either an `image` or `video`, and that it be followed by one or more `paragraph` nodes.

### `marks`

`Array`

```javascript
{
  marks: ['italic']
}
```

Will validate a node's marks. The `marks` definitions can declare a list of marks type to be allowed. If declared, any marks that are not in the list will be removed.

### `normalize`

`normalize(change: Change, violation: String, context: Object) => Void`

```javascript
{
  normalize: (change, violation, context) => {
    case 'child_object_invalid':
      change.wrapBlockByKey(context.child.key, 'paragraph')
      return
    case 'child_type_invalid':
      change.setNodeByKey(context.child.key, 'paragraph')
      return
  }
}
```

A function that can be provided to override the default behavior in the case of a rule being invalid. By default Slate will do what it can, but since it doesn't know much about your schema, it will often remove invalid nodes. If you want to override this behavior, and "fix" the node instead of removing it, pass a custom `normalize` function.

For more information on the arguments passed to `normalize`, see the [Violations](schema.md#violations) reference.

### `parent`

`Array`

```javascript
{
  parent: {
    types: ['list']
  }
}
```

Will validate a node's parent. The parent definition can declare the `objects` and/or `types` properties.

### `text`

`Array`

```javascript
{
  text: /^\w+$/
}
```

Will validate a node's text.

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

## Violations

When supplying your own `normalize` property for a schema rule, it will be called with `(change, violation, context)`. The `violation` will be one of a set of potential violation strings, and `context` will vary depending on the violation.

A set of the invalid violation strings are available as constants via the [`slate-schema-violations`](../other-packages/slate-schema-violations.md) package.

