# Commands

While editing richtext content, your users will be doing things like inserting text, deleting text, splitting paragraphs, adding formatting, etc. Under the cover these edits are expressed using transforms and operations. But at a high level we talk about them as "commands".

Commands are the high-level actions that represent a specific intent of the user. They are represented as helper functions on the `Editor` interface. A handful of helpers are included in core for common richtext behaviors, but you are encouraged to write your own that model your specific domain.

For example, here are some of the built-in commands:

```javascript
Editor.insertText(editor, 'A new string of text to be inserted.')

Editor.deleteBackward(editor, { unit: 'word' })

Editor.insertBreak(editor)
```

But you can \(and will!\) also define your own custom commands that model your domain. For example, you might want to define a `formatQuote` command, or an `insertImage` command, or a `toggleBold` command depending on what types of content you allow.

Commands always describe an action to be taken as if the **user** was performing the action. For that reason, they never need to define a location to perform the command, because they always act on the user's current selection.

> 🤖 The concept of commands is loosely based on the DOM's built-in [`execCommand`](https://developer.mozilla.org/en-US/docs/Web/API/Document/execCommand) APIs. However Slate defines its own simpler \(and extendable!\) version of the API, because the DOM's version is too opinionated and inconsistent.

Under the covers, Slate takes care of converting each command into a set of low-level "operations" that are applied to produce a new value. This is what makes collaborative editing implementations possible. But you don't have to worry about that, because it happens automatically.

## Custom Commands

When defining custom commands, you can create your own namespace:

```javascript
const MyEditor = {
  ...Editor,

  insertParagraph(editor) {
    // ...
  },
}
```

When writing your own commands, you'll often make use of the `Transforms` helpers that ship with Slate.

## Transforms

Transforms are a specific set of helpers that allow you to perform a wide variety of specific changes to the document, for example:

```javascript
// Set a "bold" format on all of the text nodes in a range.
// Normally you would apply a style like bold using the Editor.addMark() command.
// The addMark() command performs a similar setNodes transform, but it uses a more
// complicated match function in order to apply marks within markableVoid elements.
Transforms.setNodes(
  editor,
  { bold: true },
  {
    at: range,
    match: node => Text.isText(node),
    split: true,
  }
)

// Wrap the lowest block at a point in the document in a quote block.
Transforms.wrapNodes(
  editor,
  { type: 'quote', children: [] },
  {
    at: point,
    match: node => Editor.isBlock(editor, node),
    mode: 'lowest',
  }
)

// Insert new text to replace the text in a node at a specific path.
Transforms.insertText(editor, 'A new string of text.', { at: path })

// ...there are many more transforms!
```

The transform helpers are designed to be composed together. So you might use a handful of them for each command.
