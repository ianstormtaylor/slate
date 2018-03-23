# Schemas

One of Slate's principles is that it doesn't assume anything about the type of content you're building an editor for. Some editors will want **bold**, _italic_, ~~strikethrough~~, and some won't. Some will want comments and highlighting, some won't. You _can_ build all of these things with Slate, but Slate doesn't assume anything out of the box.

This turns out to be extremely helpful when building complex editors, because it means you have full control over your content—you are never fighting with assumptions that the "core" library has made.

That said, just because Slate is agnostic doesn't mean you aren't going to need to enforce a "schema" for your documents.

To that end, Slate provides a `Schema` model, which allows you to easily define validations for the structure of your documents, and to fix them if the document ever becomes invalid. This guide will show you how they work.

## Basic Schemas

Slate schemas are defined as Javascript objects, with properties that describe the document, block nodes, and inlines nodes in your editor. Here's a simple schema:

```javascript
const schema = {
  document: {
    nodes: [{ types: ['paragraph', 'image'] }],
  },
  blocks: {
    paragraph: {
      nodes: [{ objects: ['text'] }],
    },
    image: {
      isVoid: true,
      data: {
        src: v => v && isUrl(v),
      },
    },
  },
}
```

> 🤖 Internally, Slate instantiates schemas as immutable `Schema` models, but you don't have to worry about that. In user-land schemas can always be defined as plain Javascript objects, and you can let Slate handle the rest.

Hopefully just by reading this definition you'll understand what kinds of blocks are allowed in the document and what properties they can have—schemas are designed to prioritize legibility.

This schema defines a document that only allows `paragraph` and `image` blocks. In the case of `paragraph` blocks, they can only contain text nodes. And in the case of `image` blocks, they are always void nodes with a `data.src` property that is a URL. Simple enough, right?

The magic is that by passing a schema like this into your editor, it will automatically "validate" the document when changes are made, to make sure the schema is being adhered to. If it is, great. But if it isn't, and one of the nodes in the document is invalid, the editor will automatically "normalize" the node, to make the document valid again.

This way you can guarantee that the data is in a format that you expect, so you don't have to handle tons of edge-cases or invalid states in your own code.

## Custom Normalizers

By default, Slate will normalize any invalid states to ensure that the document is valid again. However, since Slate doesn't have that much information about your schema, its default normalization techniques might not always be what you want.

For example, with the above schema, if a block that isn't a `paragraph` or an `image` is discovered in the document, Slate will simply remove it.

But you might want to preserve the node, and instead just convert it to a `paragraph`, this way you aren't losing whatever the node's content was. Slate doesn't know those kinds of specifics about your data model, and trying to express all of these types of preferences in a declarative schema is a huge recipe for complexity.

Instead, Slate lets you define your own custom normalization logic.

```javascript
const schema = {
  document: {
    nodes: [
      { types: ['paragraph', 'image'] }
    ],
    normalize: (change, reason, context) => {
      if (reason == 'child_type_invalid') {
        change.setNodeByKey(context.child.key, { type: 'paragraph' })
      }
    }
  },
  ...
}
```

That's an example of defining your own custom `normalize` option for the document validation. If the invalid reason is `child_type_invalid`, it will set the child to be a `paragraph`.

When Slate discovers an invalid child, it will first check to see if your custom normalizer handles that case, and if it does Slate won't do any of its default behavior. That way you can opt-in to customizing the normalization logic for specific cases, without having to re-implement all of the defaults yourself.

This gives you the best of both worlds. You can write simple, terse, declarative validation rules that can be highly optimized. But you can still define fine-grained, imperative normalization logic for when invalid states occur.

> 🤖 For a full list of validation `reason` arguments, check out the [`Schema` reference](../slate-core/schema.md).

## Custom Validations

Sometimes though, the declarative validation syntax isn't fine-grained enough to handle a specific piece of validation. That's okay, because you can actually define schema validations in Slate as regular functions when you need more control, using the `validateNode` property of plugins and editors.

> 🤖 Actually, under the covers the declarative schemas are all translated into `validateNode` functions too!

When you define a `validateNode` function, you either return nothing if the node's already valid, or you return a normalizer function that will make the node valid if it isn't. Here's an example:

```javascript
function validateNode(node) {
  if (node.object != 'block') return
  if (node.isVoid) return

  const { nodes } = node
  if (nodes.size != 3) return
  if (nodes.first().object != 'text') return
  if (nodes.last().object != 'text') return

  return change => {
    change.removeNodeByKey(node.key)
  }
}
```

This validation defines a very specific \(honestly, useless\) behavior, where if a node is block, non-void and has three children, the first and last of which are text nodes, it is removed. I don't know why you'd ever do that, but the point is that you can get very specific with your validations this way. Any property of the node can be examined.

When you need this level of specificity, using the `validateNode` property of the editor or plugins is handy.

However, only use it when you absolutely have to. And when you do, you need to be aware of its performance. `validateNode` will be called **every time the node changes**, so it should be as performant as possible. That's why the example above returns early, so that the smallest amount of work is done as possible each time it is called.

## Multi-step Normalizations

Some normalizations will require multiple `change` function calls in order to complete. But after calling the first change function, the resulting document will be normalized, changing it out from under you. This can cause unintended behaviors.

Consider the following validation function that merges adjacent text nodes together.

Note: This functionality is already correctly implemented in slate-core so you don't need to put it in yourself!

```text
/**
  * Merge adjacent text nodes.
  *
  * @type {Object}
  */
validateNode(node) {
  if (node.object != 'block' && node.object != 'inline') return

  const invalids = node.nodes
    .map((child, i) => {
      const next = node.nodes.get(i + 1)
      if (child.object != 'text') return
      if (!next || next.object != 'text') return
      return next
    })
    .filter(Boolean)

  if (!invalids.size) return

  return (change) => {
    // Reverse the list to handle consecutive merges, since the earlier nodes
    // will always exist after each merge.
    invalids.reverse().forEach((n) => {
      change.mergeNodeByKey(n.key)
    })
  }
}
```

There is actually a problem with this code. Because each `change` function call will cause nodes impacted by the mutation to be normalized, this can cause interruptions to carefully implemented sequences of `change` functions and may create performance problems or errors. The normalization logic in the above example will merge the last node in the invalids list together, but then it'll trigger another normalization and start over!

How can we deal with this? Well, normalization can be suppressed temporarily for multiple `change` function calls by using the `change.withoutNormalization` function. `withoutNormalization` accepts a function that takes a `change` object as a parameter, and executes the function while suppressing normalization. Once the function is done executing, the entire document is then normalized to pick up any unnnormalized transformations and ensure your document is in a normalized state.

The above validation function can then be written as below

```text
/**
  * Merge adjacent text nodes.
  *
  * @type {Object}
  */
validateNode(node) {
  ...
  return (change) => {
    change.withoutNormalization((c) => {
      // Reverse the list to handle consecutive merges, since the earlier nodes
      // will always exist after each merge.
      invalids.reverse().forEach((n) => {
        c.mergeNodeByKey(n.key)
      })
    });
  }
}
```

