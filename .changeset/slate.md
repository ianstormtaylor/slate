---
'slate': minor
---

New Features:

- All **`Editor`** and **`Transforms`** methods now call **`editor`** methods. For example: **`Transforms.insertBreak`** now calls **`editor.insertBreak`**.
- **`editor.setNodes`** now calls **`setNodes`**, an exported function that implements the default editor behavior.
- You can now override **`editor.setNodes`** with your own implementation.
- You can use either **`Editor.setNodes`** or **`editor.setNodes`** in your code, and both will use your overridden behavior.

The **`editor`** object now has many more methods:

```tsx
export interface BaseEditor {
  // Core state.

  children: Descendant[]
  selection: Selection
  operations: Operation[]
  marks: EditorMarks | null

  // Overrideable core methods.

  apply: (operation: Operation) => void
  getDirtyPaths: (operation: Operation) => Path[]
  getFragment: () => Descendant[]
  isElementReadOnly: (element: Element) => boolean
  isSelectable: (element: Element) => boolean
  markableVoid: (element: Element) => boolean
  normalizeNode: (entry: NodeEntry, options?: { operation?: Operation }) => void
  onChange: (options?: { operation?: Operation }) => void
  shouldNormalize: ({
    iteration,
    dirtyPaths,
    operation,
  }: {
    iteration: number
    initialDirtyPathsLength: number
    dirtyPaths: Path[]
    operation?: Operation
  }) => boolean

  // Overrideable core transforms.

  addMark: OmitFirstArg<typeof Editor.addMark>
  collapse: OmitFirstArg<typeof Transforms.collapse>
  delete: OmitFirstArg<typeof Transforms.delete>
  deleteBackward: (unit: TextUnit) => void
  deleteForward: (unit: TextUnit) => void
  deleteFragment: OmitFirstArg<typeof Editor.deleteFragment>
  deselect: OmitFirstArg<typeof Transforms.deselect>
  insertBreak: OmitFirstArg<typeof Editor.insertBreak>
  insertFragment: OmitFirstArg<typeof Transforms.insertFragment>
  insertNode: OmitFirstArg<typeof Editor.insertNode>
  insertNodes: OmitFirstArg<typeof Transforms.insertNodes>
  insertSoftBreak: OmitFirstArg<typeof Editor.insertSoftBreak>
  insertText: OmitFirstArg<typeof Transforms.insertText>
  liftNodes: OmitFirstArg<typeof Transforms.liftNodes>
  mergeNodes: OmitFirstArg<typeof Transforms.mergeNodes>
  move: OmitFirstArg<typeof Transforms.move>
  moveNodes: OmitFirstArg<typeof Transforms.moveNodes>
  normalize: OmitFirstArg<typeof Editor.normalize>
  removeMark: OmitFirstArg<typeof Editor.removeMark>
  removeNodes: OmitFirstArg<typeof Transforms.removeNodes>
  select: OmitFirstArg<typeof Transforms.select>
  setNodes: <T extends Node>(
    props: Partial<T>,
    options?: {
      at?: Location
      match?: NodeMatch<T>
      mode?: MaximizeMode
      hanging?: boolean
      split?: boolean
      voids?: boolean
      compare?: PropsCompare
      merge?: PropsMerge
    }
  ) => void
  setNormalizing: OmitFirstArg<typeof Editor.setNormalizing>
  setPoint: OmitFirstArg<typeof Transforms.setPoint>
  setSelection: OmitFirstArg<typeof Transforms.setSelection>
  splitNodes: OmitFirstArg<typeof Transforms.splitNodes>
  unsetNodes: OmitFirstArg<typeof Transforms.unsetNodes>
  unwrapNodes: OmitFirstArg<typeof Transforms.unwrapNodes>
  withoutNormalizing: OmitFirstArg<typeof Editor.withoutNormalizing>
  wrapNodes: OmitFirstArg<typeof Transforms.wrapNodes>

  // Overrideable core queries.

  above: <T extends Ancestor>(
    options?: EditorAboveOptions<T>
  ) => NodeEntry<T> | undefined
  after: OmitFirstArg<typeof Editor.after>
  before: OmitFirstArg<typeof Editor.before>
  edges: OmitFirstArg<typeof Editor.edges>
  elementReadOnly: OmitFirstArg<typeof Editor.elementReadOnly>
  end: OmitFirstArg<typeof Editor.end>
  first: OmitFirstArg<typeof Editor.first>
  fragment: OmitFirstArg<typeof Editor.fragment>
  getMarks: OmitFirstArg<typeof Editor.marks>
  hasBlocks: OmitFirstArg<typeof Editor.hasBlocks>
  hasInlines: OmitFirstArg<typeof Editor.hasInlines>
  hasPath: OmitFirstArg<typeof Editor.hasPath>
  hasTexts: OmitFirstArg<typeof Editor.hasTexts>
  isBlock: OmitFirstArg<typeof Editor.isBlock>
  isEdge: OmitFirstArg<typeof Editor.isEdge>
  isEmpty: OmitFirstArg<typeof Editor.isEmpty>
  isEnd: OmitFirstArg<typeof Editor.isEnd>
  isInline: OmitFirstArg<typeof Editor.isInline>
  isNormalizing: OmitFirstArg<typeof Editor.isNormalizing>
  isStart: OmitFirstArg<typeof Editor.isStart>
  isVoid: OmitFirstArg<typeof Editor.isVoid>
  last: OmitFirstArg<typeof Editor.last>
  leaf: OmitFirstArg<typeof Editor.leaf>
  levels: <T extends Node>(
    options?: EditorLevelsOptions<T>
  ) => Generator<NodeEntry<T>, void, undefined>
  next: <T extends Descendant>(
    options?: EditorNextOptions<T>
  ) => NodeEntry<T> | undefined
  node: OmitFirstArg<typeof Editor.node>
  nodes: <T extends Node>(
    options?: EditorNodesOptions<T>
  ) => Generator<NodeEntry<T>, void, undefined>
  parent: OmitFirstArg<typeof Editor.parent>
  path: OmitFirstArg<typeof Editor.path>
  pathRef: OmitFirstArg<typeof Editor.pathRef>
  pathRefs: OmitFirstArg<typeof Editor.pathRefs>
  point: OmitFirstArg<typeof Editor.point>
  pointRef: OmitFirstArg<typeof Editor.pointRef>
  pointRefs: OmitFirstArg<typeof Editor.pointRefs>
  positions: OmitFirstArg<typeof Editor.positions>
  previous: <T extends Node>(
    options?: EditorPreviousOptions<T>
  ) => NodeEntry<T> | undefined
  range: OmitFirstArg<typeof Editor.range>
  rangeRef: OmitFirstArg<typeof Editor.rangeRef>
  rangeRefs: OmitFirstArg<typeof Editor.rangeRefs>
  start: OmitFirstArg<typeof Editor.start>
  string: OmitFirstArg<typeof Editor.string>
  unhangRange: OmitFirstArg<typeof Editor.unhangRange>
  void: OmitFirstArg<typeof Editor.void>
}
```

Note:

- None of these method implementations have changed.
- **`getMarks`** is an exception, as there is already **`editor.marks`** that stores the current marks.
- **`Transforms.insertText`** has not been moved to **`editor`** yet: there is already an **`editor.insertText`** method with extended behavior. This may change in a future release, but this release is trying to avoid any breaking changes.
- **`editor.insertText`** has a new argument (third): **`options?: TextInsertTextOptions`** to match **`Transforms.insertText`**.

Bug Fixes:

- Moving JSDoc's to the interface type to allow IDEs access to the interface methods.
