# Operation API

`Operation` objects define the low-level instructions that Slate editors use to apply changes to their internal state. Representing all changes as operations is what allows Slate editors to easily implement history, collaboration, and other features.

### Check methods

#### `isNodeOperation(value: any) => boolean`

Check if a value is a `NodeOperation` object. Returns the value as a `NodeOperation` if it is one.

#### `isOperation(value: any) => boolean`

Check if a value is an `Operation` object. Returns the value as an `Operation` if it is one.

#### `isOperationList(value: any) => boolean`

Check if a value is a list of `Operation` objects. Returns the value as an `Operation[]` if it is one.

#### `isSelectionOperation(value: any) => boolean`

Check if a value is a `SelectionOperation` object. Returns the value as a `SelectionOperation` if it is one.

#### `isTextOperation(value: any) => boolean`

Check if a value is a `TextOperation` object. Returns the value as a `TextOperation` if it is one.

### Static methods

#### `inverse(op: Operation) => Operation`

Invert an operation, returning a new operation that will exactly undo the original when applied.
