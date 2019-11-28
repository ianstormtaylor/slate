# Editor

All of the behaviors, content and state of a Slate editor is rollup up into a single, top-level `Editor` object. It has an interface of:

```ts
interface Editor {
  apply: (operation: Operation) => void
  exec: (command: Command) => void
  isInline: (element: Element) => boolean
  isVoid: (element: Element) => boolean
  normalizeNode: (entry: NodeEntry) => void
  onChange: (children: Node[], operations: Operation[]) => void
  children: Node[]
  operations: Operation[]
  selection: Range | null
  [key: string]: any
}
```

Slightly more complex than the others, because it contains all of the top-level functions that define your custom, domain-specific behaviors.

The `children` property contains the document tree of nodes that make up the editor's content.

The `selection` property contains the user's current selection, if any.

And the `operations` property contains all of the operations that have been applied since the last "change" was flushed. (Since Slate batches operations up into ticks of the event loop.)

## Overriding Behaviors

In previous guides we've already hinted at this, but you can overriding any of the behaviors of an editor by overriding it's function properties.

For example, if you want define link elements that are inline nodes:

```js
const { isInline } = editor

editor.isInline = element => {
  return element.type === 'link' ? true : isInline(element)
}
```

Or maybe you want to define a custom command:

```js
const { exec } = editor

editor.exec = command => {
  if (command.type === 'insert_link') {
    const { url } = command
    // ...
  } else {
    exec(command)
  }
}
```

Or you can even define custom "normalizations" that take place to ensure that links obey certain constraints:

```js
const { normalizeNode } = editor

editor.normalizeNode = entry => {
  const [node, path] = entry

  if (Element.isElement(node) && node.type === 'link') {
    // ...
  }

  normalizeNode(entry)
}
```

Whenever you override behaviors, be sure to call in to the existing functions as a fallback mechanism for the default behavior. Unless you really do want to completely remove the default behaviors (which is rarely a good idea).

## Helper Functions

The `Editor` interface, like all Slate interfaces, exposes helper functions that are useful when implementing certain behaviors. There are many, many editor-related helpers. For example:

```js
// Get the start point of a specific node at path.
const point = Editor.start(editor, [0, 0])

// Check whether an element matches a set of properties.
const isMatch = Editor.isMatch(editor, element, { type: 'quote' })

// Get the fragment (a slice of the document) at a range.
const fragment = Editor.fragment(editor, range)
```

There are also many iterator-based helpers, for example:

```js
// Iterate over every element in a range.
for (const [element, path] of Editor.elements(editor, { at: range })) {
  // ...
}

// Iterate over every mark in every text node in the current selection.
for (const [mark, index, text, path] of Editor.marks(editor)) {
  // ...
}
```

Another special group of helper functions exposed on the `Editor` interface are the "transform" helpers. They are the lower-level functions that commands use to define their behaviors. For example:

```js
// Insert an element node at a specific path.
Editor.insertNodes(editor, [element], { at: path })

// Split the nodes in half at a specific point.
Editor.splitNodes(editor, { at: point })

// Add a mark to all the text in a range.
Editor.addMarks(editor, [mark], { at: range })
```

The editor-specific helpers are the ones you'll use most often when working with Slate editors, so it pays to become very familiar with them.
