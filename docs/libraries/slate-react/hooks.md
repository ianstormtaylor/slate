# Slate React Hooks

- [Check hooks](hooks.md#check-hooks)
- [Editor hooks](hooks.md#editor-hooks)
- [Selection hooks](hooks.md#selection-hooks)

### Check hooks

React hooks for Slate editors

#### `useComposing(): boolean`

Get the current `composing` state of the editor. It deals with `compositionstart`, `compositionupdate`, `compositionend` events.

Composition events are triggered by typing (composing) with a language that uses a composition character (e.g. Chinese, Japanese, Korean, etc.) [example](https://en.wikipedia.org/wiki/Input_method#/media/File:Typing_%EC%9E%88%EC%8A%B5%EB%8B%88%EB%8B%A4_in_Dubeolsik_keyboard_layout.gif).

#### `useFocused(): boolean`

Get the current `focused` state of the editor.

#### `useReadOnly(): boolean`

Get the current `readOnly` state of the editor.

#### `useSelected(): boolean`

Get the current `selected` state of an element.

### Editor hooks

#### `useSlate(): Editor`

Get the current editor object from the React context. Re-renders the context whenever changes occur in the editor.

#### `useSlateWithV(): { editor: Editor, v: number }`

The same as `useSlate()` but includes a version counter which you can use to prevent re-renders.

#### `useSlateStatic(): Editor`

Get the current editor object from the React context. A version of useSlate that does not re-render the context. Previously called `useEditor`.

### Selection hooks

#### `useSlateSelection(): (BaseRange & { placeholder?: string | undefined; onPlaceholderResize?: ((node: HTMLElement | null) => void) | undefined }) | null`

Get the current editor selection from the React context. Only re-renders when the selection changes.

#### `useSlateSelector<T>(selector: (editor: Editor) => T, equalityFn?: (a: T, b: T) => boolean): T`

Similar to `useSlateSelection` but uses redux style selectors to prevent rerendering on every keystroke.

Returns a subset of the full selection value based on the `selector`.

Bear in mind rerendering can only prevented if the returned value is a value type or for reference types (e.g. objects and arrays) add a custom equality function for the `equalityFn` argument.

Example:

```typescript
const isSelectionActive = useSlateSelector(editor => Boolean(editor.selection))
```
