# Nodes

The most important types are the `Node` objects:

- A root-level `Editor` node that contains the entire document's content.
- Container `Element` nodes that have semantic meaning in your domain.
- And leaf-level `Text` nodes which contain the document's text.

These three interfaces are combined to form a tree—just like the DOM. For example, here's a simple plaintext value:

```javascript
const editor = {
  children: [
    {
      type: 'paragraph',
      children: [
        {
          text: 'A line of text!',
        },
      ],
    },
  ],
  // ...the editor has other properties too.
}
```

Mirroring the DOM as much as possible is one of Slate's principles. People use the DOM to represent documents with rich text-like structures all the time. Mirroring the DOM helps make the library familiar for new users, and it lets us reuse battle-tested patterns without having to reinvent them ourselves.

> 🤖 The following content on Mozilla's Developer Network may help you learn more about the corresponding DOM concepts:
>
> - [Document](https://developer.mozilla.org/en-US/docs/Web/API/Document)
> - [Block Elements](https://developer.mozilla.org/en-US/docs/Web/HTML/Block-level_elements)
> - [Inline elements](https://developer.mozilla.org/en-US/docs/Web/HTML/Inline_elements)
> - [Text elements](https://developer.mozilla.org/en-US/docs/Web/API/Text)

A Slate document is a nested and recursive structure. In a document, elements can have children nodes—all of which may have children nodes without limit. The nested and recursive structure enables you to model simple behaviors such as user mentions and hashtags or complex behaviors such as tables and figures with captions.

## `Editor`

The top-level node in a Slate document is the `Editor` itself. It encapsulates all of the rich text "content" of the document. Its interface is:

```typescript
interface Editor {
  children: Node[]
  ...
}
```

We'll cover its functionality later, but the important part as far as nodes are concerned is its `children` property which contains a tree of `Node` objects.

## `Element`

Elements make up the middle layers of a rich text document. They are the nodes that are custom to your domain. Their interface is:

```typescript
interface Element {
  children: Node[]
}
```

You can define custom elements for any type of content you want. For example, you might have paragraphs and quotes in your data model which are differentiated by a `type` property:

```javascript
const paragraph = {
  type: 'paragraph',
  children: [...],
}

const quote = {
  type: 'quote',
  children: [...],
}
```

It's important to note that you can use _any_ custom properties you want. The `type` property in that example isn't something Slate knows or cares about. If you were defining your own "link" nodes, you might have a `url` property:

```javascript
const link = {
  type: 'link',
  url: 'https://example.com',
  children: [...],
}
```

Or maybe you want to give all of your nodes an ID property:

```javascript
const paragraph = {
  id: 1,
  type: 'paragraph',
  children: [...],
}
```

All that matters is that elements always have a `children` property.

## Node IDs

IDs are custom properties. Slate does not assign them or enforce their uniqueness. By default, splitting a node copies its properties onto the new right-hand node, including its `id`. The left-hand node keeps its original properties.

Override `editor.getSplitProperties` to choose the new node's properties. This example gives each new element a fresh ID while keeping text marks and other split policies:

```javascript
import { Element } from 'slate'

const withNodeIds = (editor, createId) => {
  const { getSplitProperties } = editor

  editor.getSplitProperties = (node, path) => {
    const properties = getSplitProperties(node, path)
    if (!Element.isElement(node)) return properties

    const { id, ...rest } = properties
    return { ...rest, id: createId() }
  }

  return editor
}
```

Pass an ID generator that produces unique values. Return `rest` instead if another part of your application assigns missing IDs. Return the other properties too: the hook supplies the new node's complete property set, rather than a patch. Do not include `children` or `text` in the returned properties.

The hook receives the node and its current path for every node actually split by `Transforms.splitNodes`, including text nodes and multiple ancestor levels. It also covers commands that use that transform, such as Enter, fragment insertion and `setNodes` with `split: true`, and inline elements split by `Transforms.wrapNodes`. Keep text properties when overriding it so formatting survives these operations.

With `slate-history`, undo restores the original node and its ID; redo reuses the properties recorded in the split operation. The hook does not assign or deduplicate IDs on incoming content that is inserted without a split. Apply your ID policy to initial and pasted content separately.

## Blocks vs. Inlines

Depending on your use case, you might want to define another behavior for `Element` nodes which determines their editing "flow".

All elements default to being "block" elements. They each appear separated by vertical space, and they never run into each other.

But in certain cases, like for links, you might want to make them "inline" flowing elements instead. That way they live at the same level as text nodes, and flow.

> 🤖 This is a concept borrowed from the DOM's behavior, see [Block Elements](https://developer.mozilla.org/en-US/docs/Web/HTML/Block-level_elements) and [Inline Elements](https://developer.mozilla.org/en-US/docs/Web/HTML/Inline_elements).

You can define which nodes are treated as inline nodes by overriding the `editor.isInline` function. \(By default it always returns `false`.\) Note that inline nodes cannot be the first or last child of a parent block, nor can they be next to another inline node in the `children` array. Slate will automatically space these with `{ text: '' }` children by default with [`normalizeNode`](11-normalizing.md#built-in-constraints).

Elements can either contain block elements or inline elements intermingled with text nodes as children. But elements **cannot** contain some children that are blocks and some that are inlined.

## Voids

Similar to blocks and inlines, there is another element-specific behavior you can define depending on your use case: their "void"-ness.

Elements default to being non-void, meaning that their children are fully editable as text. But in some cases, like for images, you want to ensure that Slate doesn't treat their content as editable text, but instead as a black box.

> 🤖 This is a concept borrowed from the HTML spec, see [Void Elements](https://www.w3.org/TR/2011/WD-html-markup-20110405/syntax.html#void-element).

You can define which elements are treated as void by overriding the `editor.isVoid` function. \(By default it always returns `false`.\) See [Rendering Void Elements](../api/nodes/element.md#rendering-void-elements) for implementation details.

## `Text`

Text nodes are the lowest-level nodes in the tree, containing the text content of the document, along with any formatting. Their interface is:

```typescript
interface Text {
  text: string
}
```

For example, a string of bold text:

```javascript
const text = {
  text: 'A string of bold text',
  bold: true,
}
```

Text nodes too can contain any custom properties you want, and that's how you implement custom formatting like **bold**, _italic_, `code`, etc.
These custom properties are sometimes called [marks](../api/nodes/editor.md#mark-methods).
