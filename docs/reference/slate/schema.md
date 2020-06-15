# Schema

Every Slate editor has a "schema" associated with it, which contains information about the structure of its content. For the most basic cases, you'll just rely on Slate's default core schema. But for advanced use cases, you can enforce rules about what the content of a Slate document can contain.

## Properties

```js
{
  document: Object,
  blocks: Object,
  inlines: Object,
  rules: Array,
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

Will determine whether the node is treated as a "void" node or not, making its content a black box that Slate doesn't control editing for.

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

### `next`

`Object|Array`

```js
{
  next: { type: 'quote' },
}
```

```js
{
  next: [{ type: 'quote' }, { type: 'paragraph' }],
}
```

Will validate the next sibling node against a [`match`](#match).

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

`normalize(editor: Editor, error: SlateError) => Void`

```js
{
  normalize: (editor, error) => {
    switch (error.code) {
      case 'child_object_invalid':
        editor.wrapBlockByKey(error.child.key, 'paragraph')
        return
      case 'child_type_invalid':
        editor.setNodeByKey(error.child.key, 'paragraph')
        return
    }
  }
}
```

A function that can be provided to override the default behavior in the case of a rule being invalid. By default, Slate will do what it can, but since it doesn't know much about your schema, it will often remove invalid nodes. If you want to override this behavior and "fix" the node instead of removing it, pass a custom `normalize` function.

For more information on the arguments passed to `normalize`, see the [Errors](#errors) section.

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

### `previous`

`Object|Array`

```js
{
  previous: { type: 'quote' },
}
```

```js
{
  previous: [{ type: 'quote' }, { type: 'paragraph' }],
}
```

Will validate the previous sibling node against a [`match`](#match).

### `text`

`RegExp|Function`

```js
{
  text: /^\w+$/
}
```

```js
{
  text: string => string === 'valid'
}
```

Will validate a node's text with a regex or function.

## Errors

When supplying your own `normalize` property for a schema rule, it will be called with `(editor, error)`. The error `code` will be one of a set of potential code strings, and it will contain additional helpful properties depending on the type of error.

### `'child_object_invalid'`

```js
{
  child: Node,
  index: Number,
  node: Node,
  rule: Object,
}
```

Raised when the `object` property of a child node is invalid.

### `child_min_invalid`

```js
{
  index: Number,
  count: Number,
  limit: Number,
  node: Node,
  rule: Object,
}
```

Raised when a child node repeats less than required by a rule's `min` property.

### `child_max_invalid`

```js
{
  index: Number,
  count: Number,
  limit: Number,
  node: Node,
  rule: Object,
}
```

Raised when a child node repeats more than permitted by a rule's `max`
property.

### `'child_type_invalid'`

```js
{
  child: Node,
  index: Number,
  node: Node,
  rule: Object,
}
```

Raised when the `type` property of a child node is invalid.

### `'child_unknown'`

```js
{
  child: Node,
  index: Number,
  node: Node,
  rule: Object,
}
```

Raised when a child was not expected but one was found.

### `'first_child_object_invalid'`

```js
{
  child: Node,
  node: Node,
  rule: Object,
}
```

Raised when the `object` property of the first child node is invalid, when a specific `first` rule was defined in a schema.

### `'first_child_type_invalid'`

```js
{
  child: Node,
  node: Node,
  rule: Object,
}
```

Raised when the `type` property of the first child node is invalid, when a specific `first` rule was defined in a schema.

### `'last_child_object_invalid'`

```js
{
  child: Node,
  node: Node,
  rule: Object,
}
```

Raised when the `object` property of the last child node is invalid, when a specific `last` rule was defined in a schema.

### `'last_child_type_invalid'`

```js
{
  child: Node,
  node: Node,
  rule: Object,
}
```

Raised when the `type` property of the last child node is invalid, when a specific `last` rule was defined in a schema.

### `'next_sibling_object_invalid'`

```js
{
  next: Node,
  node: Node,
  rule: Object,
}
```

Raised when the `object` property of the next sibling node is invalid, when a specific `next` rule was defined in a schema.

### `'next_sibling_type_invalid'`

```js
{
  next: Node,
  node: Node,
  rule: Object,
}
```

Raised when the `type` property of the next sibling node is invalid, when a specific `next` rule was defined in a schema.

### `'node_data_invalid'`

```js
{
  key: String,
  node: Node,
  rule: Object,
  value: Mixed,
}
```

Raised when the `data` property of a node contains an invalid entry.

### `'node_is_void_invalid'`

```js
{
  node: Node,
  rule: Object,
}
```

Raised when the `isVoid` property of a node is invalid.

### `'node_mark_invalid'`

```js
{
  mark: Mark,
  node: Node,
  rule: Object,
}
```

Raised when one of the marks in a node is invalid.

### `'node_text_invalid'`

```js
{
  text: String,
  node: Node,
  rule: Object,
}
```

Raised when the text content of a node is invalid.

### `'parent_object_invalid'`

```js
{
  node: Node,
  parent: Node,
  rule: Object,
}
```

Raised when the `object` property of the parent of a node is invalid, when a specific `parent` rule was defined in a schema.

### `'parent_type_invalid'`

```js
{
  node: Node,
  parent: Node,
  rule: Object,
}
```

Raised when the `type` property of the parent of a node is invalid, when a specific `parent` rule was defined in a schema.

### `'previous_sibling_object_invalid'`

```js
{
  previous: Node,
  node: Node,
  rule: Object,
}
```

Raised when the `object` property of the previous sibling node is invalid, when a specific `previous` rule was defined in a schema.

### `'previous_sibling_type_invalid'`

```js
{
  previous: Node,
  node: Node,
  rule: Object,
}
```

Raised when the `type` property of the previous sibling node is invalid, when a specific `previous` rule was defined in a schema.
