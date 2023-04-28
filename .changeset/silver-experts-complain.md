---
'slate': minor
'slate-react': minor
---

Breaking changes:

- Enhanced error handling by introducing **`undefined`** checks
- Added **`editor.onError`** function to handle errors in functions that depend on **`editor`**
- Introduced global **`ErrorLogger`** class for error handling in functions not depending on **`editor`**
- No errors are thrown by default, addressing community feedback from issue #3641
- Updated return types of several functions to include **`| undefined`**
- Replaced **`throw new Error()`** statements with either **`editor.onError()`** or **`ErrorLogger.onError()`**
- Implemented conditional checks for variables before accessing them to prevent crashes and improve code stability

You can now filter errors by type:

```tsx
ErrorLogger.addErrorHandler(error => {
  // handle error
  if (error.type === 'Node.get') {
    throw new Error(error.message)
  }

  // access errors array
  console.log(ErrorLogger.getErrors())

  // reset errors array
  console.log(ErrorLogger.resetErrors())
})

// throw only for `move_node` operation
editor.onError = error => {
  if (error.type === 'move_node') {
    throw new Error(error.message)
  }
}
```

If you want to keep the previous behavior, here is the quickest **migration** using non-null assertion (estimating to a couple of minutes):

Throw an error like before:

```tsx
import { ErrorLogger } from 'slate'

ErrorLogger.addErrorHandler(error => {
  throw new Error(error.message)
})

editor.onError = error => {
  throw new Error(error.message)
}
```

Here is the list of APIs that now return `| undefined`. Find usages for each of these and insert a non-null assertion. For example: `Path.next(...)` to `Path.next(...)!`

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
