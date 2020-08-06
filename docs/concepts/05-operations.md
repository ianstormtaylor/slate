# Operations

Operations are the granular, low-level actions that occur while invoking commands and transforms. A single high-level command could result in many low-level operations being applied to the editor.

Unlike commands, operations aren't extendable. Slate's core defines all of the possible operations that can occur on a richtext document. For example:

```js
editor.apply({
  type: 'insert_text',
  path: [0, 0],
  offset: 15,
  text: 'A new string of text to be inserted.',
})

editor.apply({
  type: 'remove_node',
  path: [0, 0],
  node: {
    text: 'A line of text!',
  },
})

editor.apply({
  type: 'set_selection',
  properties: {
    anchor: { path: [0, 0], offset: 0 },
  },
  newProperties: {
    anchor: { path: [0, 0], offset: 15 },
  },
})
```

Under the covers Slate converts complex commands into the low-level operations and applies them to the editor automatically, so you rarely have to think about them.

> 🤖 Slate's editing behaviors being defined as operations is what makes things like collaborative editing possible, because each change is easily define-able, apply-able, compose-able and even undo-able!
