# Schemas

One of Slate's principles is that it doesn't assume anything about the type of content you're building an editor for. Some editors will want **bold**, _italic_, ~~strikethrough~~, and some won't. Some will want comments and highlighting, some won't. You _can_ build all of these things with Slate, but Slate doesn't assume anything out of the box.

This turns out to be extremely helpful when building complex editors, because it means you have full control over your content—you are never fighting with assumptions that the "core" library has made.

That said, just because Slate is agnostic doesn't mean you aren't going to need to enforce a "schema" for your documents.

To that end, Slate lets you define validations for the structure of your documents, and to fix them if the document ever becomes invalid. This guide will show you how they work.

> 🤖 To see a full example of a schema in affect, check out the [Forced Layout](https://github.com/ianstormtaylor/slate/blob/405cef0225c314b4162d587c74cfce6b65a7b257/examples/forced-layout/index.js#L62) example.

## Basic Schemas

Slate schemas are defined as JavaScript objects, with properties that describe the document, block nodes, and inline nodes in your editor. Here's a simple schema:

```jsx
const schema = {
  document: {
    nodes: [
      {
        match: [{ type: 'paragraph' }, { type: 'image' }],
      },
    ],
  },
  blocks: {
    paragraph: {
      nodes: [
        {
          match: { object: 'text' },
        },
      ],
    },
    image: {
      isVoid: true,
      data: {
        src: v => v && isUrl(v),
      },
    },
  },
}

<Editor
  schema={schema}
  value={this.state.value}
  ...
/>
```

Hopefully just by reading this definition you'll understand what kinds of blocks are allowed in the document and what properties they can have—schemas are designed to prioritize legibility.

This schema defines a document that only allows `paragraph` and `image` blocks. In the case of `paragraph` blocks, they can only contain text nodes. And in the case of `image` blocks, they are void nodes with a `data.src` property that is a URL. Simple enough, right?

The magic is that by passing a schema like this into your editor, it will automatically "validate" the document when changes are made, to make sure the schema is being adhered to. If it is, great. But if it isn't, and one of the nodes in the document is invalid, the editor will automatically "normalize" the node, to make the document valid again.

This way you can guarantee that the data is in a format that you expect, so you don't have to handle tons of edge-cases or invalid states in your own code.

> 🤖 Internally, Slate converts those schema definitions into plugins that enforce certain behaviors when changes are applied to the document.

## Custom Normalizers

By default, Slate will normalize any invalid states to ensure that the document is valid again. However, since Slate doesn't have that much information about your schema, its default normalization techniques might not always be what you want.

For example, with the above schema, if a block that isn't a `paragraph` or an `image` is discovered in the document, Slate will simply remove it.

But you might want to preserve the node, and instead just convert it to a `paragraph`-this way you aren't losing whatever the node's content was. Slate doesn't know those kinds of specifics about your data model, and trying to express all of these types of preferences in a declarative schema is a huge recipe for complexity.

Instead, Slate lets you define your own custom normalization logic.

```js
const schema = {
  document: {
    nodes: [{
      match: [{ type: 'paragraph' }, { type: 'image' }],
    }],
    normalize: (editor, error) => {
      if (error.code == 'child_type_invalid') {
        editor.setNodeByKey(error.child.key, { type: 'paragraph' })
      }
    }
  },
  ...
}
```

That's an example of defining your own custom `normalize` option for the document validation. If the invalid reason is `child_type_invalid`, it will set the child to be a `paragraph`.

When Slate discovers an invalid child, it will first check to see if your custom normalizer handles that case; if your normalizer handles it, then Slate won't run any of its default behavior. This way, you can opt-in to customizing the normalization logic for specific cases without having to re-implement all of the defaults yourself.

This gives you the best of both worlds. You can write simple, terse, declarative validation rules that can be highly optimized. But you can still define fine-grained, imperative normalization logic for when invalid states occur.

> 🤖 For a full list of error `code` types, check out the [`Schema` reference](../reference/slate/schema.md).

## Low-level Normalizations

Sometimes though, the declarative validation syntax isn't fine-grained enough to handle a specific piece of validation. That's okay, because you can actually define schema validations in Slate as regular functions when you need more control, using the `normalizeNode` property of plugins and editors.

> 🤖 Actually, under the covers the declarative schemas are all translated into `normalizeNode` functions too!

When you define a `normalizeNode` function, you either return nothing if the node's already valid, or you return a normalizer function that will make the node valid if it isn't. Here's an example:

```js
function normalizeNode(node, editor, next) {
  const { nodes } = node
  if (node.object !== 'block') return next()
  if (nodes.size !== 3) return next()
  if (nodes.first().object !== 'text') return next()
  if (nodes.last().object !== 'text') return next()
  return () => editor.removeNodeByKey(node.key)
}
```

This validation defines a very specific (honestly, useless) behavior, where if a node is a block and has three children, the first and last of which are text nodes, it is removed. I don't know why you'd ever do that, but the point is that you can get very specific with your validations this way. Any property of the node can be examined.

When you need this level of specificity, using the `normalizeNode` property of the editor or plugins is handy.

However, only use it when you absolutely have to. And when you do, make sure to optimize the function's performance. `normalizeNode` will be called **every time the node changes**, so it should be as performant as possible. That's why the example above returns early, so that the smallest amount of work is done each time it is called.
