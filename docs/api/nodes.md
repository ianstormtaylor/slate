# Node

The `Node` union type represents all of the different types of nodes that occur in a Slate document tree.

```typescript
type Node = Editor | Element | Text

type Descendant = Element | Text
type Ancestor = Editor | Element
```

## Static methods

###### `Node.ancestor(root: Node, path: Path): Ancestor`

Get the node at a specific `path`, asserting that it is an ancestor node. If the specified node is not an ancestor node, throw an error.

###### `Node.ancestors(root: Node, path: Path, options?): Generator<NodeEntry<Ancestor>>`

Return a generator of all the ancestor nodes above a specific path. By default, the order is bottom-up, from lowest to highest ancestor in the tree, but you can pass the `reverse: true` option to go top-down.

Options: `{reverse?: boolean}`

###### `Node.child(root: Node, index: number): Descendant`

Get the child of a node at the specified `index`.

###### `Node.children(root: Node, path: Path, options?): Generator<NodeEntry<Descendant>>`

Iterate over the children of a node at a specific path.

Options: `{reverse?: boolean}`

###### `Node.common(root: Node, path: Path, another: Path): NodeEntry`

Get an entry for the common ancestor node of two paths.

###### `Node.descendant(root: Node, path: Path): Descendant`

Get the node at a specific path, asserting that it's a descendant node.

###### `Node.descendants(root: Node, options?): Generator<NodeEntry<Descendant>>`

Return a generator of all the descendant node entries inside a root node. Each iteration will return a `NodeEntry` tuple consisting of `[Node, Path]`.

Options: `{from?: Path, to?: Path, reverse?: boolean, pass?: (node: NodeEntry => boolean)}`

###### `Node.elements(root: Node, options?): Generator<ElementEntry>`

Return a generator of all the element nodes inside a root node. Each iteration will return an `ElementEntry` tuple consisting of `[Element, Path]`. If the root node is an element, it will be included in the iteration as well.

Options: `{from?: Path, to?: Path, reverse?: boolean, pass?: (node: NodeEntry => boolean)}`

###### `Node.first(root: Node, path: Path): NodeEntry`

Get the first node entry in a root node from a `path`.

###### `Node.fragment(root: Node, range: Range): Descendant[]`

Get the sliced fragment represented by the `range`.

###### `Node.get(root: Node, path: Path): Node`

Get the descendant node referred to by a specific `path`. If the path is an empty array, get the root node itself.

###### `Node.has(root: Node, path: Path): boolean`

Check if a descendant node exists at a specific `path`.

###### `Node.isNode(value: any): value is Node`

Check if a `value` implements the `Node` interface.

###### `Node.isNodeList(value: any): value is Node[]`

Check if a `value` is a list of `Node` objects.

###### `Node.last(root: Node, path: Path): NodeEntry`

Get the last node entry in a root node at a specific `path`.

###### `Node.leaf(root: Node, path: Path): Text`

Get the node at a specific `path`, ensuring it's a leaf text node. If the node is not a leaf text node, throw an error.

###### `Node.levels(root: Node, path: Path, options?): Generator<NodeEntry>`

Return a generator of the nodes in a branch of the tree, from a specific `path`. By default, the order is top-down, from the lowest to the highest node in the tree, but you can pass the `reverse: true` option to go bottom-up.

Options: `{reverse?: boolean}`

###### `Node.matches(root: Node, props: Partial<Node>): boolean`

Check if a node matches a set of `props`.

###### `Node.nodes(root: Node, options?): Generator<NodeEntry>`

Return a generator of all the node entries of a root node. Each entry is returned as a `[Node, Path]` tuple, with the path referring to the node's position inside the root node.

Options: `{from?: Path, to?: Path, reverse?: boolean, pass?: (node: NodeEntry => boolean)}`

###### `Node.parent(root: Node, path: Path): Ancestor`

Get the parent of a node at a specific `path`.

###### `Node.string(root: Node): string`

Get the concatenated text string of a node's content. Note that this will not include spaces or line breaks between block nodes. This is not intended as a user-facing string, but as a string for performing offset-related computations for a node.

###### `Node.texts(root: Node, options?): Generator<NodeEntry<Text>>`

Return a generator of all leaf text nodes in a root node.

Options: `{from?: Path, to?: Path, reverse?: boolean, pass?: (node: NodeEntry => boolean)}`

## Editor

The `Editor` object stores all the state of a slate editor. It can be extended by plugins to add helpers and implement new behaviors.

```typescript
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

### Instance methods

#### Schema-specific actions

###### `isInline(element: Element)`

Check if a value is an inline `Element` object.

###### `isVoid(element: Element)`

Check if a value is a void `Element` object.

###### `normalizeNode(entry: NodeEntry)`

Normalize a Node according to the schema.

###### `onChange()`

#### Core actions

###### `addMark(key: string, value: any)`

Add a custom property to the leaf text nodes in the current selection. If the selection is currently collapsed, the marks will be added to the `editor.marks` property instead, and applied when text is inserted next.

###### `removeMark(key: string)`

Remove a custom property from the leaf text nodes in the current selection.

###### `deleteBackward(options?: {unit?: 'character' | 'word' | 'line' | 'block'})`

Delete content in the editor backward from the current selection.

###### `deleteForward(options?: {unit?: 'character' | 'word' | 'line' | 'block'})`

Delete content in the editor forward from the current selection.

###### `insertFragment(fragment: Node[])`

Insert a fragment at the current selection. If the selection is currently expanded, delete it first.

###### `deleteFragment()`

Delete the content of the current selection.

###### `insertBreak()`

Insert a block break at the current selection. If the selection is currently expanded, delete it first.

###### `insertNode(node: Node)`

Insert a node at the current selection. If the selection is currently expanded, delete it first.

###### `insertText(text: string)`

Insert text at the current selection. If the selection is currently expanded, delete it first.

###### `apply(operation: Operation)`

Apply an operation in the editor.

## Element

`Element` objects are a type of node in a Slate document that contain other `Element` nodes or `Text` nodes. They can be either "blocks" or "inlines" depending on the Slate editor's configuration.

```typescript
interface Element {
  children: Node[]
  [key: string]: unknown
}
```

### Static methods

###### `Element.isElement(value: any): value is Element`

Check if a `value` implements the `Element` interface.

###### `Element.isElementList(value: any): value is Element[]`

Check if a `value` is an array of `Element` objects.

###### `Element.matches(element: Element, props: Partial<Element>): boolean`

Check if an element matches a set of `props`. Note: This checks custom properties, but it does not ensure that any children are equivalent.

## Text

`Text` objects represent the nodes that contain the actual text content of a Slate document along with any formatting properties. They are always leaf nodes in the document tree as they cannot contain any children.

```typescript
interface Text {
  text: string
  [key: string]: unknown
}
```

### Static methods

###### `Text.equals(text: Text, another: Text, options?): boolean`

Check if two text nodes are equal.

Options: `{loose?: boolean}`

###### `Text.isText(value: any): value is Text`

Check if a `value` implements the `Text` interface.

###### `Text.matches(text: Text, props: Partial<Text>): boolean`

Check if a `text` matches a set of `props`.

###### `Text.decorations(node: Text, decorations: Range[]): Text[]`

Get the leaves for a text node, given `decorations`.
