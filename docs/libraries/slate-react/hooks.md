# Slate React Hooks

- [Check hooks](hooks.md#check-hooks)
- [Editor hooks](hooks.md#editor-hooks)
- [Selection hooks](hooks.md#selection-hooks)

### Check hooks

React hooks for Slate editors

#### `useFocused(): boolean`

Get the current `focused` state of the editor.

#### `useReadOnly(): boolean`

Get the current `readOnly` state of the editor.

#### `useSelected(): boolean`

Get the current `selected` state of an element.

### Editor hooks

#### `useSlate(): ReactEditor`

Get the current editor object from the React context. Re-renders the context whenever changes occur in the editor.

#### `useSlateWithV(): { editor: ReactEditor, v: number }`

The same as `useSlate()` but includes a version counter which you can use to prevent re-renders.

#### `useSlateStatic(): ReactEditor`

Get the current editor object from the React context. A version of useSlate that does not re-render the context. Previously called `useEditor`.

### Selection hooks

#### `useSlateSelection(): (BaseRange & { placeholder?: string | undefined; onPlaceholderResize?: ((node: HTMLElement | null) => void) | undefined }) | null`

Get the current editor selection from the React context. Only re-renders when the selection changes.

#### `useSlateSelector<T>(selector: (editor: Editor): T, equalityFn?: (a: T, b: T) => boolean): T`

Similar to `useSlateSelection` but uses redux style selectors to prevent rerendering on every keystroke.

Returns a subset of the full selection value based on the `selector`.

Bear in mind rerendering can only prevented if the returned value is a value type or for reference types (e.g. objects and arrays) add a custom equality function for the `equalityFn` argument.

Example:

```typescript
const isSelectionActive = useSlateSelector(editor => Boolean(editor.selection))
```
