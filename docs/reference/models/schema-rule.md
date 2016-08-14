
# Schemas

Every Slate editor has a "schema" associated with it, which contains information about the structure of its content. It lets you specify how to render each different type of node. And for more advanced use cases it lets you enforce rules about what the content of the editor can and cannot be.

- [Properties](#properties)
  - [`marks`](#marks)
  - [`nodes`](#nodes)
  - [`rules`](#rules)
- [Rule Properties](#rule-properties)
  - [`component`](#component)
  - [`decorator`](#decorator)
  - [`match`](#match)
  - [`transform`](#transform)
  - [`validate`](#validate)


## Properties

```js
{
  marks: Object,
  nodes: Object,
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
`Object<type, Component || Function>`
`Object<type, Rule>`

```js
{
  quote: props => <blockquote {...props.attributes}>{props.children}</blockquote>
}
```
```js
{
  code: {
    component: props => <pre {...props.attributes}><code>{props.children}</code></pre>,
    decorator: myCodeHighlighter
  }
}
```

An object that defines the [`Block`](./block.md) and [`Inline`](./inline.md) nodes in the schema by `type`. Each key in the object refers to a node by its `type`. The values defines how Slate will render the node, and can optionall define any other property of a schema `Rule`.

### `rules`
`Array<Rule>`

```js
[
  {
    match: { kind: 'block', type: 'code' },
    component: props => <pre {...props.attributes}><code>{props.children}</code></pre>,
    decorator: myCodeHighlighter
  }
]
```

An array of rules that define the schema's behavior. Each of the rules are evaluated in order to determine a match.

Internally, the `marks` and `nodes` properties of a schema are simply converted into `rules`.


## Rule Properties

```js
{
  match: Function || Object,
  component: Component || Function || Object || String,
  decorator: Function,
  validate: Function || Object,
  transform: Function
}
```

Slate schemas are built up of a set of rules. Each of the properties will add certain functionality to the schema, based on the properties it defines. 

### `match`
`Function`
`Object`

```js
(node) => node.kind == 'block' && node.type == 'quote'
```
```js
{
  kind: 'block',
  type: 'quote'
}
```

The `match` property is the only required property of a rule. It determines which nodes are matched when a rule is matched. In the simplest form it is a function which returns a boolean, but it can also be expressed in object form.

### `component`
`ReactComponent` <br/>
`Function component(props: Object) => Any` <br/>
`Object<cssProperty, cssValue>` <br/>
`String`

```js
(props) => <blockquote {...props.attributes}>{props.children}</blockquote>
```

The `component` property determines how Slate will render the node or mark that was matched by the `match` property. In addition to a React component, marks can also be rendered by supplying an object of styles, or a class name string.

### `decorator`
`Function decorate(text: Text, match: Node) => List<Character>`

The `decorator` property defines a function that can add extra marks to the text inside of a node, for example for code highlighting. It is called with the [`Text`](./text.md) node in question, and the [`Node`](./node.md) matched by the `match` property, and should return a list of [`Characters`](./character.md) with the desired marks applied.

### `validate`
`Function (match: Node) => Any` <br/>
`Object`

```js
{
  nodesAnyOf: [
    { kind: 'block' }
  ],
  nodesNoneOf: [
    { type: 'quote' }
  ]
}
```

The `validate` property defines a series of constraints that the [`Node`](./node.md) must abide by, for example that its children only be other [`Block`](./block.md) nodes. The full list of validations supported is:

- `kind` `String` — the 
- `kinds`
- `maxLength`
- `maxNodes` `Number` — the maximum number of child nodes a node can have.
- `minLength`
- `minNodes` `Number` — 
- `nodesAnyOf` `Array` — an array of `match` objects that the nodes can match.
- `nodesExactlyOf` `Array` — an array of `match` objects that the nodes must all match exactly in order.
- `nodesNoneOf` `Array` — an array of `match` objects that the nodes must not match.
- `text`
- `type`
- `types`


## Matches

For any schema rule to be applied, it has to match a node in the editor's content. The most basic way to do this is to match by `kind` and `type`. For example:



## Components

The most basic use of a schema is to define which React components should be rendered for each node in the editor. For example, you might want to 





## Match Properties

## Validate Properties
