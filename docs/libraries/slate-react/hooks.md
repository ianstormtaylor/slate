# Slate React Hooks

React hooks for Slate editors

### `useFocused`

Get the current `focused` state of the editor.

### `useReadOnly`

Get the current `readOnly` state of the editor.

### `useSelected`

Get the current `selected` state of an element.

### `useSlate`

Get the current editor object from the React context. Re-renders the context whenever changes occur in the editor.

### `useSlateWithV`

The same as `useSlate()` but includes a version counter which you can use to prevent re-renders.

### `useSlateStatic`

Get the current editor object from the React context. A version of useSlate that does not re-render the context. Previously called `useEditor`.

### `useSlateSelection`

Get the current editor selection from the React context. Only re-renders when the selection changes.
