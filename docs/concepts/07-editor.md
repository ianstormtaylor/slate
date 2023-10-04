# Editor

All of the behaviors, content and state of a Slate editor is rolled up into a single, top-level `Editor` object. It has an interface of:

```typescript
interface Editor {
  // Current editor state
  children: Node[]
  selection: Range | null
  operations: Operation[]
  marks: Omit<Text, 'text'> | null
  // Schema-specific node behaviors.
  isInline: (element: Element) => boolean
  isVoid: (element: Element) => boolean
  markableVoid: (element: Element) => boolean
  normalizeNode: (entry: NodeEntry) => void
  onChange: (options?: { operation?: Operation }) => void
  // Overrideable core actions.
  addMark: (key: string, value: any) => void
  apply: (operation: Operation) => void
  deleteBackward: (unit: 'character' | 'word' | 'line' | 'block') => void
  deleteForward: (unit: 'character' | 'word' | 'line' | 'block') => void
  deleteFragment: () => void
  insertBreak: () => void
  insertSoftBreak: () => void
  insertFragment: (fragment: Node[]) => void
  insertNode: (node: Node) => void
  insertText: (text: string) => void
  removeMark: (key: string) => void
}
```

It is slightly more complex than the others, because it contains all of the top-level functions that define your custom, domain-specific behaviors.

The `children` property contains the document tree of nodes that make up the editor's content.

The `selection` property contains the user's current selection, if any.
Don't set it directly; use [Transforms.select](04-transforms.md#selection-transforms)

The `operations` property contains all of the operations that have been applied since the last "change" was flushed. \(Since Slate batches operations up into ticks of the event loop.\)

The `marks` property stores formatting to be applied when the editor inserts text. If `marks` is `null`, the formatting will be taken from the current selection.
Don't set it directly; use `Editor.addMark` and `Editor.removeMark`.

## Overriding Behaviors

In previous guides we've already hinted at this, but you can override any of the behaviors of an editor by overriding its function properties.

For example, if you want to define link elements that are inline nodes:

```javascript
const { isInline } = editor

editor.isInline = element => {
  return element.type === 'link' ? true : isInline(element)
}
```

Or maybe you want to override the `insertText` behavior to "linkify" URLs:

```javascript
const { insertText } = editor

editor.insertText = text => {
  if (isUrl(text)) {
    // ...
    return
  }

  insertText(text)
}
```

If you have void "mention" elements that can accept marks like bold or italic:

```javascript
const { isVoid, markableVoid } = editor

editor.isVoid = element => {
  return element.type === 'mention' ? true : isVoid(element)
}

editor.markableVoid = element => {
  return element.type === 'mention' || markableVoid(element)
}
```

Or you can even define custom "normalizations" that take place to ensure that links obey certain constraints:

```javascript
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

Whenever you override behaviors, be sure to call the existing functions as a fallback mechanism for the default behavior. Unless you really do want to completely remove the default behaviors \(which is rarely a good idea\).

> 🤖 For more info, check out the [Editor Instance Methods to Override API Reference](../api/nodes/editor.md#schema-specific-instance-methods-to-override)

## Helper Functions

The `Editor` interface, like all Slate interfaces, exposes helper functions that are useful when implementing certain behaviors. There are many, many editor-related helpers. For example:

```javascript
// Get the start point of a specific node at path.
const point = Editor.start(editor, [0, 0])

// Get the fragment (a slice of the document) at a range.
const fragment = Editor.fragment(editor, range)
```

There are also many iterator-based helpers, for example:

```javascript
// Iterate over every node in a range.
for (const [node, path] of Editor.nodes(editor, { at: range })) {
  // ...
}

// Iterate over every point in every text node in the current selection.
for (const point of Editor.positions(editor)) {
  // ...
}
```

> 🤖 For more info, check out the [Editor Static Methods API Reference](../api/nodes/editor.md#static-methods)
