
# The Document Model

A big difference between Slate and other rich-text editors is that Slate is built on top of a nested, recursive document model—much like the DOM itself. This means you can build complex components like tables or nested block quotes, just like you can with the regular DOM.


### Node Hierarchy

Each Slate document is made up of [`Document`](../reference/slate/document.md), [`Block`](../reference/slate/block.md), [`Inline`](../reference/slate/inline.md) and [`Text`](../reference/slate/text.md) nodes—again, very similar to the DOM.

The top-level node of a Slate document is the `Document` node. The `Document` then has child `Block` node children.

After that, nesting can occur to any depth. `Block` nodes can contain other `Block` nodes, or they can contain `Inline` or `Text` nodes. And `Inline` nodes can contain other `Inline` nodes or simply `Text` nodes.

Each `Document`, `Block` and `Inline` node implements a [`Node`](../reference/slate/node.md) interface, to make working with the nested tree easier.


### Characters & Marks

As the leaves of the tree, `Text` nodes contain both the text content of the document as well as all of the text-level formatting, like **bold** and _italic_. In Slate, that formatting is referred to as [`Marks`](../reference/slate/mark.md), and `Marks` are applied to individual [`Characters`](../reference/slate/character.md).


### Void Nodes

Just like the DOM, Slate's `Block` and `Inline` nodes can be "void" nodes, meaning that they have no content inside of them. When the `isVoid` flag of a node is enabled, it will be specially rendered, to preserve the editing experience that a user expects, without any extra work.

Note that even though the node is "void", it will still have an empty text node inside of it. Because of...


### Leaf Text Nodes

One constraint of Slate documents is that the leaf nodes are always `Text` nodes. No `Block` or `Inline` node will ever have no children. It will always have at least an empty text node. (However, you can _render_ text-less nodes, see the [Void Nodes](#void-nodes) section above!)

This constraint means that [`Selections`](../reference/slate/selection.md) can always refer to text nodes, and many text-node-level operations are always "safe" regardless of the tree's structure.
