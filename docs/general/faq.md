
# FAQ

A series of common questions people have about Slate:

- [Why is content pasted as plain text?](#why-is-content-is-pasted-as-plain-text)
- [What can a `Block` node have as its children?](#what-can-a-block-node-have-as-its-children)
- [What browsers and devices does Slate support?](#what-browsers-and-devices-does-slate-support)


### Why is content pasted as plain text?

One of Slate's core principles is that, unlike most other editors, it does **not** prescribe a specific "schema" to the content you are editing. This means that Slate's core has no concept of "block quotes" or "bold formatting".

For this most part, this leads to increased flexbility without many downsides, but there are certain cases where you have to do a bit more work. Pasting is one of those cases.

Since Slate knows nothing about your schema, it can't know how to parse pasted HTML content (or other content). So, by default whenever a user pastes content into a Slate editor, it will parse it as plain text. If you want it to be smarter about pasted content, you need to define an [`onPaste`](../reference/components/editor.md#onpaste) handler that parses the content as you wish.

### What can a `Block` node have as its children?

With Slate, you can use `Block` node to created complex nested structures. Block nodes may contain nested block nodes (both void and non-void), inline nodes, text nodes and just regular DOM elements (with `contentEditable = {false}`).

If you have an element that is not going to be editable, you can choose between a `void` node or just a DOM element with `contentEditable = {false}`. Opt for the `void` node if you would like it represented in the Slate schema, and for Slate to be aware of it.


### What browsers and devices does Slate support?

Slate's goal is to support all the modern browsers on both desktop and mobile devices.

However, right now Slate is in beta, so its support is not as full as it will later be. It's currently tested against the latest few versions of Chrome, Firefox and Safari on desktops. It isn't currently tested against Internet Explorer or Edge, or against mobile devices. If you want to add more browser or device support, we'd love for you to submit a pull request!
