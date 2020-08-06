# Editor

All of the behaviors, content and state of a Slate editor is rolled up into a single, top-level `Editor` object. It has an interface of:

```ts
interface Editor {
  children: Node[]
  selection: Range | null
  operations: Operation[]
  marks: Record<string, any> | null
  [key: string]: unknown

  // Schema-specific node behaviors.
  isInline: (element: Element) => boolean
  isVoid: (element: Element) => boolean
  normalizeNode: (entry: NodeEntry) => void
  onChange: () => void

  // Overrideable core actions.
  addMark: (key: string, value: any) => void
  apply: (operation: Operation) => void
  deleteBackward: (unit: 'character' | 'word' | 'line' | 'block') => void
  deleteForward: (unit: 'character' | 'word' | 'line' | 'block') => void
  deleteFragment: () => void
  insertBreak: () => void
  insertFragment: (fragment: Node[]) => void
  insertNode: (node: Node) => void
  insertText: (text: string) => void
  removeMark: (key: string) => void
}
```

It is slightly more complex than the others, because it contains all of the top-level functions that define your custom, domain-specific behaviors.

The `children` property contains the document tree of nodes that make up the editor's content.

The `selection` property contains the user's current selection, if any.

The `operations` property contains all of the operations that have been applied since the last "change" was flushed. (Since Slate batches operations up into ticks of the event loop.)

The `marks` property stores formatting that is attached to the cursor, and that will be applied to the text that is inserted next.

## Overriding Behaviors

In previous guides we've already hinted at this, but you can override any of the behaviors of an editor by overriding its function properties.

For example, if you want to define link elements that are inline nodes:

```js
const { isInline } = editor

editor.isInline = element => {
  return element.type === 'link' ? true : isInline(element)
}
```

Or maybe you want to override the `insertText` behavior to "linkify" URLs:

```js
const { insertText } = editor

editor.insertText = text => {
  if (isUrl(text)) {
    // ...
    return
  }

  insertText(text)
}
```

Or you can even define custom "normalizations" that take place to ensure that links obey certain constraints:

```js
const { normalizeNode } = editor

editor.normalizeNode = entry => {
  const [node, path] = entry

  if (Element.isElement(node) && node.type === 'link') {
    // ...
    return
  }

  normalizeNode(entry)
}
```

Whenever you override behaviors, be sure to call the existing functions as a fallback mechanism for the default behavior. Unless you really do want to completely remove the default behaviors (which is rarely a good idea).

## Helper Functions

The `Editor` interface, like all Slate interfaces, exposes helper functions that are useful when implementing certain behaviors. There are many, many editor-related helpers. For example:

```js
// Get the start point of a specific node at path.
const point = Editor.start(editor, [0, 0])

// Get the fragment (a slice of the document) at a range.
const fragment = Editor.fragment(editor, range)
```

There are also many iterator-based helpers, for example:

```js
// Iterate over every node in a range.
for (const [node, path] of Editor.nodes(editor, { at: range })) {
  // ...
}

// Iterate over every point in every text node in the current selection.
for (const [point] of Editor.positions(editor)) {
  // ...
}
```
