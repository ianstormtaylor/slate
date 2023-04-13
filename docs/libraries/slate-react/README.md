# Slate React

This sub-library contains the React-specific logic for Slate.

- [withReact](./with-react.md)
- [ReactEditor](./react-editor.md)
- [Hooks](./hooks.md)
- [Slate](./slate.md)
- [Editable](./editable.md)
- Usage (under construction)
  - [Event Handling](./event-handling.md)

## Components

React components for rendering Slate editors

### `RenderElementProps`

`RenderElementProps` are passed to the `renderElement` handler.

### `RenderLeafProps`

`RenderLeafProps` are passed to the `renderLeaf` handler.

### `Editable`

The main Slate editor.

#### Event Handling

### `DefaultElement(props: RenderElementProps)`

The default element renderer.

### `DefaultLeaf(props: RenderLeafProps)`

The default custom leaf renderer.

### `Slate(props: { editor: ReactEditor, value: Node[], children: React.ReactNode, onChange: (value: Node[]) => void })`

A wrapper around the provider to handle `onChange` events, because the editor is a mutable singleton so it won't ever register as "changed" otherwise.

## Utils

Private convenience modules
