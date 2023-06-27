---
'slate': minor
'slate-react': minor
---

Breaking changes:

- Enhanced error handling by introducing **`undefined`** checks
- Added **`editor.onError`** function to handle errors in functions that depend on **`editor`**
- Introduced `editor.strict`. If `true` (default), `editor.onError` will throw errors like before (unchanged behavior). If `false`, it will push the errors in `editor.errors` (new behavior).
- Updated return types of several functions to include **`| undefined`**

You can now filter errors by type:

```tsx
// throw only for `shouldNormalize` case
editor.onError = error => {
  if (error.key === 'shouldNormalize') {
    throw new Error(error.message)
  }
}
```

If you want to adopt the new error-free behavior, set `editor.strict = false`, the default being `true`. Or you can just override `onError` to handle errors.

Here is the quickest **migration** using non-null assertion (estimating to a couple of minutes):

Throw an error like before:

```tsx
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
