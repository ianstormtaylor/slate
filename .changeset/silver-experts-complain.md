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

To throw errors on invalid operations like before:

```tsx
import { ErrorLogger } from 'slate'

ErrorLogger.addErrorHandler(error => {
  throw new Error(error.message)
})

editor.onError = error => {
  throw new Error(error.message)
}
```

You can also filter errors by type:

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
