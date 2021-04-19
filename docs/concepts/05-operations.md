# Operations

Operations are the granular, low-level actions that occur while invoking transforms. A single transform could result in many low-level operations being applied to the editor.

Slate's core defines all of the possible operations that can occur on a richtext document. For example:

```javascript
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

Under the covers Slate converts complex transforms into the low-level operations and applies them to the editor automatically. So you rarely have to think about operations unless you're implementing collaborative editing.

> 🤖 Slate's editing behaviors being defined as operations is what makes things like collaborative editing possible, because each change is easily define-able, apply-able, compose-able and even undo-able!
