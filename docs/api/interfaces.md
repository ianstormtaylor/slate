# Interfaces

These interfaces define Slate's core functionality. 

## Node

The `Node` union type represents all of the different types of nodes that occur in a Slate document tree.

```typescript
type Node = Editor | Element | Text
```

### Editor

The `Editor` object stores all the state of a slate editor. It can be extended by plugins to add helpers and implement new behaviors.

```typescript
interface Editor {
  children: Node[]
  selection: Range | null
  operations: Operation[]
  marks: Record<string, any> | null
  [key: string]: any

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

#### Instance methods

##### Schema-specific actions

###### `isInline(element: Element)`

Check if a value is an inline `Element` object.

###### `isVoid(element: Element)`

Check if a value is a void `Element` object.

###### `normalizeNode(entry: NodeEntry)`

Normalize a Node according to the schema.

###### `onChange()`

##### Core actions

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

### Element

`Element` objects are a type of node in a Slate document that contain other `Element` nodes or `Text` nodes. They can be either "blocks" or "inlines" depending on the Slate editor's configuration.

```typescript
interface Element {
  children: Node[]
  [key: string]: any
}
```

### 

### Text

`Text` objects represent the nodes that contain the actual text content of a Slate document along with any formatting properties. They are always leaf nodes in the document tree as they cannot contain any children.

```typescript
interface Text {
    text: string,
    [key: string]: any
}
```

## Operation

`Operation` objects define the low-level instructions that Slate editors use to apply changes to their internal state. Representing all changes as operations is what allows Slate editors to easily implement history, collaboration, and other features.

## Location

The `Location` interface is a union of the ways to refer to a specific location in a Slate document: paths, points or ranges. Methods will often accept a `Location` instead of requiring only a `Path`, `Point` or `Range`. 

```typescript
type Location = Path | Point | Range
```

### Path

`Path` arrays are a list of indexes that describe a node's exact position in a Slate node tree. Although they are usually relative to the root `Editor` object, they can be relative to any `Node` object.

```typescript
type Path = number[]
```

### Point

`Point` objects refer to a specific location in a text node in a Slate document. Its `path` refers to the lcoation of the node in the tree, and its offset refers to distance into the node's string of text. Points may only refer to `Text` nodes.

```typescript
interface Point {
    path: Path
    offset: number  
    [key: string]: any
}
```

### Range

`Range` objects are a set of points that refer to a specific span of a Slate document. They can define a span inside a single node or they can span across multiple nodes. The editor's `selection` is stored as a range.

```typescript
interface Range {
    anchor: Point
    focus: Point
    [key: string]: any
}
```

## Ref

`Ref` objects store up-to-date references to a `Point` or `Range` object in the document.

### PointRef

`PointRef` objects keep a specific point in a document synced over time as new operations are applied to the editor. You can access their property `current` at any time for the up-to-date `Point` value.

```typescript
interface PointRef {
    current: Point | null
    affinity: 'forward' | 'backward' | null
    unref(): Point | null
}
```

### RangeRef

`RangeRef` objects keep a specific range in a document synced over time as new operations are applied to the editor. You can access their property `current` at any time for the up-to-date `Range` value.

```typescript
interface RangeRef {
    current: Range | null
    affinity: 'forward' | 'backward' | 'outward' | 'inward' | null
    unref(): Range | null
}
```
