# Normalizing

Slate editors can editor complex, nested data structures. And for the most part this is great, but in certain cases inconsistencies in the data structure can be introduced—most often when allowing a user to paste arbitrary richtext content.

"Normalizing" is how you can ensure that your editor's content is always of a certain shape. It's similar to "validating", except instead of just determining whether the content is valid or invalid, its job is to fix the content to make it valid again.

## Built-in Constraints

Slate editors come with a few built-in constraints out of the box. These constraints are there to make working with content _much_ more predictable than standard `contenteditable`. All of the built-in logic in Slate depends on these constraints, so unfortunately you cannot omit them. They are...

1. **All `Element` nodes must contain at least one `Text` descendant.** If an element node does not contain any children, an empty text node will be added as its only child. This constraint exists to ensure that the selection's anchor and focus points (which rely on referencing text nodes) can always be placed inside any node. With this, empty elements (or void elements) wouldn't be selectable.

2. **Two adjacent texts with the same custom properties will be merged.** If two adjacent text nodes have the same formatting, they're merged into a single text node with a combined text string of the two. This exists to prevent the text nodes from only ever expanding in count in the document, since both adding and removing formatting results in splitting text nodes.

3. **Block nodes can only contain other blocks, or inline and text nodes.** For example, a `paragraph` block cannot have another `paragraph` block element _and_ a `link` inline element as children at the same time. The type of children allowed is determined by the first child, and any other non-conforming children are removed. This ensures that common richtext behaviors like "splitting a block in two" function consistently.

4. **The top-level editor node can only contain block nodes.** If any of the top-level children are inline or text nodes they will be removed. This ensures that there are always block nodes in the editor so that behaviors like "splitting a block in two" work as expected.

These default constraints are all mandated because they make working with Slate documents _much_ more preditable.

> 🤖 Although these constraints are the best we've come up with now, we're always looking for ways to have Slate's built-in constraints be less constraining if possible—as long as it keeps standard behaviors easy to reason about. If you come up with a way to reduce or remove a built-in constraint with a different approach, we're all ears!

## Adding Constraints

The built-in constraints are fairly generic. But you can also add your own constraints on top of the built-in ones that are specific to your domain.

To do this, you extend the `normalizeNode` function on the editor. The `normalizeNode` function gets called every time an operation is applied that changes a node (or its descendants), giving you the opportunity to ensure that the changes didn't leave it in an invalid state, and correcting the node if so.

For example here's a plugin that ensures `paragraph` blocks only have text or inline elements as children:

```js
import { Element, Node } from 'slate'

const withParagraphs = editor => {
  const { normalizeNode } = editor

  editor.normalizeNode = entry => {
    const [node, path] = entry

    // If the element is a paragraph, ensure it's children are valid.
    if (Element.isElement(node) && node.type === 'paragraph') {
      for (const [child, childPath] of Node.children(editor, path)) {
        if (Element.isElement(child) && !editor.isInline(child)) {
          Editor.unwrapNodes(editor, { at: childPath })
          return
        }
      }
    }

    // Fall back to the original `normalizeNode` to enforce other constraints.
    normalizeNode(entry)
  }

  return editor
}
```

This example is fairly simple. Whenever `normalizeNode` gets called on a paragraph element, it loops through each of its children ensuring that none of them are block elements. And if one is a block element, it gets unwrapped, so that the block is removed and its children take its place. The node is "fixed".

But what if the child has nested blocks?

## Multi-pass Normalizing

One thing to understand about `normalizeNode` constraints is that they are **multi-pass**.

If you check the example above again, you'll notice the `return` statement:

```js
if (Element.isElement(child) && !editor.isInline(child)) {
  Editor.unwrapNodes(editor, { at: childPath })
  return
}
```

You might at first think this is odd, because with the `return` there, the original `normalizeNodes` will never be called, and the built-in constraints won't get a chance to run their own normalizations.

But, there's a slight "trick" to normalizing.

When you do call `Editor.unwrapNodes`, you're actually changing the content of the node that is currently being normalized. So even though you're ending the current normalization pass, by making a change to the node you're kicking off a _new_ normalization pass. This results in a sort of _recursive_ normalizing.

This multi-pass characteristic makes it _much_ easier to write normalizations, because you only ever have to worry about fixing a single issue at once, and not fixing _every_ possible issue that could be putting a node in an invalid state.

To see how this works in practice, let's start with this invalid document:

```jsx
<editor>
  <paragraph a>
    <paragraph b>
      <paragraph c>word</paragraph>
    </paragraph>
  </paragraph>
</editor>
```

If we ran our `normalizeNode` function on the **bottom** paragraph, it would be valid. It only contains text nodes as children.

But then, we move up the tree, and run it against the **middle** paragraph. The middle paragraph is invalid, since it contains a block element. So it gets unwrapped, resulting in a new document of:

```jsx
<editor>
  <paragraph a>
    <paragraph c>word</paragraph>
  </paragraph>
</editor>
```

And now, with the middle paragraph gone, we move up the tree again arriving at the **top** paragraph. It's also invalid and gets unwrapped. And you end with a document of:

```jsx
<editor>
  <paragraph c>word</paragraph>
</editor>
```

And all normalization passes return no changes.
