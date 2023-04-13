# Operation API

`Operation` objects define the low-level instructions that Slate editors use to apply changes to their internal state. Representing all changes as operations is what allows Slate editors to easily implement history, collaboration, and other features.

- [Static methods](operation.md#static-methods)
  - [Manipulation methods](operation.md#manipulation-methods)
  - [Check methods](operation.md#check-methods)

## Static methods

### Manipulation methods

#### `Operation.inverse(op: Operation) => Operation`

Invert an operation, returning a new operation that will exactly undo the original when applied.

### Check methods

#### `Operation.isNodeOperation(value: any) => boolean`

Check if a value is a `NodeOperation` object. Returns the value as a `NodeOperation` if it is one.

#### `Operation.isOperation(value: any) => boolean`

Check if a value is an `Operation` object. Returns the value as an `Operation` if it is one.

#### `Operation.isOperationList(value: any) => boolean`

Check if a value is a list of `Operation` objects. Returns the value as an `Operation[]` if it is one.

#### `Operation.isSelectionOperation(value: any) => boolean`

Check if a value is a `SelectionOperation` object. Returns the value as a `SelectionOperation` if it is one.

#### `Operation.isTextOperation(value: any) => boolean`

Check if a value is a `TextOperation` object. Returns the value as a `TextOperation` if it is one.
