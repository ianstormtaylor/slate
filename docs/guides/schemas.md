
# Schemas

Every Slate editor has a "schema" associated with it, which contains information about the structure of its content. It lets you specify how to render each different type of node. And for more advanced use cases it lets you enforce rules about what the content of the editor can and cannot be.

- [Rules](#rules)
- [Components](#components)
- [Decorators](#decorators)
- [Validations](#validations)


## Rules

Slate schemas are built up of a set of rules. Every rule has a few properties:

```js
{
  match: Function || Object,
  render: Component || Function || Object || String,
  decorate: Function,
  validate: Function || Object,
  change: Function
}
```

Each of the properties will add certain functionality to the schema. For example,


## Matches

For any schema rule to be applied, it has to match a node in the editor's content. The most basic way to do this is to match by `kind` and `type`. For example:

```js



## Components

The most basic use of a schema is to define which React components should be rendered for each node in the editor. For example, you might want to

```
