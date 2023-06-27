# Error Handling

Error handling in Slate is designed to provide more control to users while maintaining code stability, maintainability, and robustness. Slate introduces an **`editor.onError`** function to handle errors in a more flexible and manageable way.

Remember to utilize these error handling mechanisms to tailor your error management based on your specific use case and requirements, ensuring a smoother and more stable experience for your users. For example, you may want to throw errors in development, but in production you would prefer to have non-blocking errors for your users.

To disable error throwing everywhere, either set `editor.strict = false` or override `onError` to handle errors.

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
// throw only for `shouldNormalize` case
editor.onError = error => {
  if (error.key === 'shouldNormalize') {
    throw new Error(error.message)
  }
}
```

## `editor.errors`

By default, Slate pushes errors to the `editor.errors` arrays. You can actively manage this array to keep it empty by implementing your own error handling strategies. This allows you to effectively monitor and address errors that occur during the editor's operation, contributing to a stable user experience.
