
# Schemas

Every Slate editor has a "schema" associated with it, which contains information about the structure of its content. It lets you specify how to render each different type of node. And for more advanced use cases it lets you enforce rules about what the content of the editor can and cannot be.

- [Properties](#properties)
  - [`marks`](#marks)
  - [`nodes`](#nodes)
  - [`rules`](#rules)
- [Rule Properties](#rule-properties)
  - [`decorate`](#decorate)
  - [`match`](#match)
  - [`normalize`](#normalize)
  - [`render`](#render)
  - [`validate`](#validate)
- [Static Methods](#static-methods)
  - [`Schema.isSchema`](#schemaisschema)


## Properties

```js
{
  nodes: Object,
  marks: Object,
  rules: Array
}
```

The top-level properties of a schema all give you a way to define `rules` that the schema enforces. The `nodes` and `marks` properties are just convenient ways to define the most common set of rules.

### `marks`
`Object type: Component || Function || Object || String`

```js
{
  bold: props => <strong>{props.children}</strong>
}
```
```js
{
  bold: {
    fontWeight: 'bold'
  }
}
```
```js
{
  bold: 'my-bold-class-name'
}
```

An object that defines the [`Marks`](./mark.md) in the schema by `type`. Each key in the object refers to a mark by its `type`. The value defines how Slate will render the mark, and can either be a React component, an object of styles, or a class name.

### `nodes`
`Object<type, Component || Function>` <br/>
`Object<type, Rule>`

```js
{
  quote: props => <blockquote {...props.attributes}>{props.children}</blockquote>
}
```
```js
{
  code: {
    render: props => <pre {...props.attributes}><code>{props.children}</code></pre>,
    decorate: myCodeHighlighter
  }
}
```

An object that defines the [`Block`](./block.md) and [`Inline`](./inline.md) nodes in the schema by `type`. Each key in the object refers to a node by its `type`. The values defines how Slate will render the node, and can optionally define any other property of a schema `Rule`.

### `rules`
`Array<Rule>`

```js
[
  {
    match: { kind: 'block', type: 'code' },
    component: props => <pre {...props.attributes}><code>{props.children}</code></pre>,
    decorate: myCodeHighlighter
  }
]
```

An array of rules that define the schema's behavior. Each of the rules are evaluated in order to determine a match.

Internally, the `marks` and `nodes` properties of a schema are simply converted into `rules`.


## Rule Properties

```js
{
  match: Function,
  decorate: Function,
  normalize: Function,
  render: Component || Function || Object || String,
  validate: Function
}
```

Slate schemas are built up of a set of rules. Each of the properties will add certain functionality to the schema, based on the properties it defines. 

### `match`
`Function match(object: Node || Mark)`

```js
{
  match: (object) => object.kind == 'block' && object.type == 'code'
}
```

The `match` property is the only required property of a rule. It determines which objects the rule applies to. 

### `decorate`
`Function decorate(text: Node, object: Node) => List<Characters>`

```js
{
  decorate: (text, node) => {
    let { characters } = text
    let first = characters.get(0)
    let { marks } = first
    let mark = Mark.create({ type: 'bold' })
    marks = marks.add(mark)
    first = first.merge({ marks })
    characters = characters.set(0, first)
    return characters
  }
}
```

The `decorate` property allows you define a function that will apply extra marks to all of the ranges of text inside a node. It is called with a [`Text`](./text.md) node and the matched node. It should return a list of characters with the desired marks, which will then be added to the text before rendering.

### `normalize`
`Function normalize(transform: Transform, object: Node, failure: Any) => Transform`

```js
{
  normalize: (transform, node, invalidChildren) => {
    invalidChildren.forEach((child) => {
      transform.removeNodeByKey(child.key)
    })

    return transform
  }
}
```

The `normalize` property is a function to run that recovers the editor's state after the `validate` property of a rule has determined that an object is invalid. It is passed a [`Transform`](./transform.md) that it can use to make modifications. It is also passed the return value of the `validate` function, which makes it easy to quickly determine the failure reason from the validation.

### `render`
`Component` <br/>
`Function` <br/>
`Object` <br/>
`String`

```js
{
  render: (props) => <pre {...props.attributes}><code>{props.children}</code></pre>
}
```

The `render` property determines which React component Slate will use to render a [`Node`](./node.md) or [`Mark`](./mark.md). Mark renderers can also be defined as an object of styles or a class name string for convenience.

### `validate`
`Function validate(object: Node) => Any || Void`

```js
{
  validate: (node) => {
    const invalidChildren = node.nodes.filter(child => child.kind == 'block')
    return invalidChildren.size ? invalidChildren : null
  }
}
```

The `validate` property allows you to define a constraint that the matching object must abide by. It should return either `Void` if the object is valid, or any non-void value if it is invalid. This makes it easy to return the exact reason that the object is invalid, which makes it simple to recover from the invalid state with the `normalize` property.

## Static Methods

### `Schema.isSchema`
`Schema.isSchema(maybeSchema: Any) => Boolean`

Returns a boolean if the passed in argument is a `Schema`.
