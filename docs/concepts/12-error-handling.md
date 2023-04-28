# Error Handling

Error handling in Slate is designed to provide more control to users while maintaining code stability, maintainability, and robustness. Slate introduces a global **`ErrorLogger`** class and an **`editor.onError`** function to handle errors in a more flexible and manageable way.

Remember to utilize these error handling mechanisms to tailor your error management based on your specific use case and requirements, ensuring a smoother and more stable experience for your users. For example, you may want to throw errors in development, but in production you would prefer to have non-blocking errors for your users.

## `ErrorLogger`

The global **`ErrorLogger.onError`** function is used to handle errors in functions not depending on the **`editor`**, like `Node.get`. To set custom error handling behavior, call **`ErrorLogger.addErrorHandler()`**.

To throw errors on invalid operations:

```tsx
import { ErrorLogger } from 'slate'

ErrorLogger.addErrorHandler(error => {
  throw new Error(error.message)
})
```

You can also filter errors by type:

```tsx
ErrorLogger.addErrorHandler((error) => {
  // handle error
  if (error.type === 'Node.get') {
    throw new Error(error.message)
  }

  // access errors array
  console.log(ErrorLogger.getErrors());
  
  // reset errors array
  console.log(ErrorLogger.resetErrors());
});
```

## `editor.onError`

The **`editor.onError`** function is used to handle errors in functions that depend on the **`editor`**.

To set custom error handling behavior for the editor, override the **`editor.onError`** function.

To throw errors on invalid operations:

```tsx
editor.onError = error => {
  throw new Error(error.message)
}
```

You can also filter errors by type:

```tsx
// throw only for `move_node` operation
editor.onError = error => {
  if (error.type === 'move_node') {
    throw new Error(error.message)
  }
}
```

## `editor.errors`

By default, Slate pushes errors to the `editor.errors`, `ErrorLogger.getErrors()` arrays. You can actively manage this array to keep it empty by implementing your own error handling strategies. This allows you to effectively monitor and address errors that occur during the editor's operation, contributing to a stable user experience.
