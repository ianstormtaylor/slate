---
'slate': minor
'slate-react': minor
---

Breaking changes:

- Enhanced error handling by introducing **`undefined`** checks
- Updated return types of many methods to include **`| undefined`** (see below).

**`editor.strict`**:

- `true` (default): keep throwing errors everywhere.
- `false` (experimental): push errors to `editor.errors` array and let the editor continue to operate.

This option has no effect if you override `editor.onError`.

**`editor.onError`**: This function is used to handle errors in methods that depend on the **`editor`**.

```tsx
// Definition
export type EditorError<T extends SlateErrorType = SlateErrorType> = {
  key: string // Unique key: `<methodName>.<case>`
  message: string // Contextual error description
  error?: SlateError<T> // Underlying generic error
  data?: unknown // Additional operation data
  recovery?: unknown // Recovery value to return on error.
}

export type SlateError<T extends SlateErrorType = SlateErrorType> = {
  type: T // Error type
  message: string // Error description
}

export const onError = <T extends SlateErrorType>(
  editor: Editor,
  context: EditorError
): any => {
  const { message, recovery } = context

  if (editor.strict) throw new Error(message)
  editor.errors.push(context)
  return recovery
}

// Overriding example
editor.onError = error => {
  // or send to Sentry
  console.warn(error.message)

  // throw only for `shouldNormalize` case
  if (error.key === 'shouldNormalize') {
    throw new Error(error.message)
  }

  if (error.key === 'isEnd') {
    // return false when the end point is not found
    return false
  }

  // ...

  return error.recovery
}
```

Slate methods will return `editor.onError(error)` on query error, so you can control what is returned for each case.

**Migration:** here is the list of APIs that now return `| undefined`. Find usages for each of these and insert a non-null assertion. For example: `Path.next(...)` to `Path.next(...)!`

```tsx
Path.next
Path.parent
Path.previous
Path.relative
Editor.edges
Editor.end
Editor.first
Editor.last
Editor.leaf
Editor.node
Editor.parent
Editor.path
Editor.point
Editor.range
Editor.start
Node.ancestor
Node.child
Node.children
Node.common
Node.descendant
Node.first
Node.get
Node.last
Node.leaf
Node.parent
ReactEditor.findPath
ReactEditor.toDOMNode
ReactEditor.toDOMPoint
ReactEditor.toDOMRange
ReactEditor.toSlateNode
ReactEditor.findEventRange
```

The alternative is to wrap each of these into a function that does not return `| undefined` (alias type) but this would take more time to refactor.
