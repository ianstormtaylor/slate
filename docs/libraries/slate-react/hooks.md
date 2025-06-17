# Slate React Hooks

#### `useComposing(): boolean`

Get the current `composing` state of the editor. It deals with `compositionstart`, `compositionupdate`, `compositionend` events.

Composition events are triggered by typing (composing) with a language that uses a composition character (e.g. Chinese, Japanese, Korean, etc.) [example](https://en.wikipedia.org/wiki/Input_method#/media/File:Typing_%EC%9E%88%EC%8A%B5%EB%8B%88%EB%8B%A4_in_Dubeolsik_keyboard_layout.gif).

#### `useElement(): Element`

Get the current element object. Re-renders whenever the element or any of its descendants changes.

#### `useElementIf(): Element | null`

The same as `useElement()` but returns `null` instead of throwing an error when not inside an element.

#### `useFocused(): boolean`

Get the current `focused` state of the editor.

#### `useReadOnly(): boolean`

Get the current `readOnly` state of the editor.

#### `useSelected(): boolean`

Get the current `selected` state of an element. An element is selected if `editor.selection` exists and overlaps any part of the element.

#### `useSlate(): Editor`

Get the current editor object. Re-renders whenever changes occur in the editor.

#### `useSlateStatic(): Editor`

Get the current editor object from the React context. A version of useSlate that does not re-render the context. Previously called `useEditor`.

#### `useSlateSelection(): (BaseRange & { placeholder?: string | undefined; onPlaceholderResize?: ((node: HTMLElement | null) => void) | undefined }) | null`

Get the current editor selection. Only re-renders when the selection changes.

#### `useSlateSelector<T>(selector: (editor: Editor) => T, equalityFn?: (a: T, b: T) => boolean): T`

Use redux style selectors to prevent re-rendering on every keystroke.

Bear in mind re-rendering can only prevented if the returned value is a value type or for reference types (e.g. objects and arrays) add a custom equality function.

If `selector` is memoized using `useCallback`, then it will only be called when it or the editor state changes. Otherwise, `selector` will be called every time the component renders.

Example:

```typescript
const isSelectionActive = useSlateSelector(editor => Boolean(editor.selection))
```
