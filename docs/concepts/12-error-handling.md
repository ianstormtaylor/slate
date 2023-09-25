# Error Handling

Error handling in Slate is designed to provide more control to users while maintaining code stability, maintainability, and robustness. Slate introduces an **`editor.onError`** function to handle errors in a more flexible and manageable way.

Remember to utilize these error handling mechanisms to tailor your error management based on your specific use case and requirements, ensuring a smoother and more stable experience for your users. For example, you may want to throw errors in development, but in production you would prefer to have non-blocking errors for your users.

## `editor.strict`

- `true` (default): throw errors everywhere.
- `false` (experimental): push errors to `editor.errors` array and let the editor continue to operate.

This option has no effect if you override `editor.onError`.

## `editor.onError`

This function is used to handle errors in methods that depend on the **`editor`**.

Overriding example:

```tsx
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

## `EditorError`

```ts
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
```
