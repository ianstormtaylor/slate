# Slate React

This sub-library contains the React-specific logic for Slate.

- [withReact](./with-react.md)
- [ReactEditor](./react-editor.md)

## Components

React components for rendering Slate editors

### `RenderElementProps`

`RenderElementProps` are passed to the `renderElement` handler.

### `RenderLeafProps`

`RenderLeafProps` are passed to the `renderLeaf` handler.

### `Editable`

The main Slate editor.

#### Event Handling

By default, the `Editable` component comes with a set of event handlers that handle typical rich-text editing behaviors (for example, it implements its own `onCopy`, `onPaste`, `onDrop`, and `onKeyDown` handlers).

In some cases you may want to extend or override Slate's default behavior, which can be done by passing your own event handler(s) to the `Editable` component.

Your custom event handler can control whether or not Slate should execute its own event handling for a given event after your handler runs depending on the return value of your event handler as described below.

```jsx
import {Editable} from 'slate-react';

function MyEditor() {
  const onClick = event => {
    // Implement custom event logic...

    // When no value is returned, Slate will execute its own event handler when
    // neither isDefaultPrevented nor isPropagationStopped was set on the event
  };

  const onDrop = event => {
    // Implement custom event logic...

    // No matter the state of the event, treat it as being handled by returning
    // true here, Slate will skip its own event handler
    return true;
  };

  const onDragStart = event => {
    // Implement custom event logic...

    // No matter the status of the event, treat event as *not* being handled by
    // returning false, Slate will execute its own event handler afterward
    return false;
  };

  return (
    <Editable
      onClick={onClick}
      onDrop={onDrop}
      onDragStart={onDragStart}
      {/*...*/}
    />
  )
}
```

### `DefaultElement(props: RenderElementProps)`

The default element renderer.

### `DefaultLeaf(props: RenderLeafProps)`

The default custom leaf renderer.

### `Slate(editor: ReactEditor, value: Node[], children: React.ReactNode, onChange: (value: Node[]) => void, [key: string]: any)`

A wrapper around the provider to handle `onChange` events, because the editor is a mutable singleton so it won't ever register as "changed" otherwise.

## Hooks

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

## Plugins

React-specific plugins for Slate editors

### `withReact(editor: Editor)`

Adds React and DOM specific behaviors to the editor.

When used with `withHistory`, `withReact` should be applied outside. For example:

```javascript
const [editor] = useState(() => withReact(withHistory(createEditor())))
```

## Utils

Private convenience modules
