# Operation Types

`Operation` objects define the low-level instructions that Slate editors use to apply changes to their internal state. Representing all changes as operations is what allows Slate editors to easily implement history, collaboration, and other features.

- Operation object
  - [Operation](./operation.md)
- Operation subtypes
  - [Node Operations](README.md#node-operations)
  - [Text Operations](README.md#text-operations)
  - [Selection Operation](README.md#selection-operation)
  - [Base Operation](README.md#base-operation)

### Node Operations

Node operations operate on `Node` objects.

```typescript
// insert a new `Node`
type InsertNodeOperation = {
  type: 'insert_node'
  path: Path
  node: Node
}

// merge two `Node` objects
type MergeNodeOperation = {
  type: 'merge_node'
  path: Path
  position: number
  properties: Partial<Node>
}

// move `Node` from one path to another
type MoveNodeOperation = {
  type: 'move_node'
  path: Path
  newPath: Path
}

// Remove a `Node`
type RemoveNodeOperation = {
  type: 'remove_node'
  path: Path
  node: Node
}

// Set properties of a `Node`
type SetNodeOperation = {
  type: 'set_node'
  path: Path
  properties: Partial<Node>
  newProperties: Partial<Node>
}

// Split a node into two separate `Node` objects
type SplitNodeOperation = {
  type: 'split_node'
  path: Path
  position: number
  properties: Partial<Node>
}

export type NodeOperation =
  | InsertNodeOperation
  | MergeNodeOperation
  | MoveNodeOperation
  | RemoveNodeOperation
  | SetNodeOperation
  | SplitNodeOperation
```

### Text Operations

Text operations operate on `Text` objects only.

Note: `Text` objects are `Node` objects so you can use `Node` operations on `Text` objects.

```typescript
// insert text into an existing `Text` node
type InsertTextOperation = {
  type: 'insert_text'
  path: Path
  offset: number
  text: string
}

// remove text from an existing `Text` node
type RemoveTextOperation = {
  type: 'remove_text'
  path: Path
  offset: number
  text: string
}

export type TextOperation = InsertTextOperation | RemoveTextOperation
```

### Selection Operation

Operation to set or unset a selection `Range`.

```typescript
type SetSelectionOperation =
  | {
      type: 'set_selection'
      properties: null
      newProperties: Range
    }
  | {
      type: 'set_selection'
      properties: Partial<Range>
      newProperties: Partial<Range>
    }
  | {
      type: 'set_selection'
      properties: Range
      newProperties: null
    }

export type SelectionOperation = SetSelectionOperation
```

### Base Operation

The combination of all operation types.

```typescript
export type BaseOperation = NodeOperation | SelectionOperation | TextOperation
```
