# Slate React

This sub-library contains the React-specific logic for Slate.

## Components

React components for rendering Slate editors

###### `RenderElementProps`

`RenderElementProps` are passed to the `renderElement` handler.

###### `RenderLeafProps`

`RenderLeafProps` are passed to the `renderLeaf` handler.

###### `Editable`

The main Slate editor.

###### `DefaultElement(props: RenderElementProps)`

The default element renderer.

###### `DefaultLeaf(props: RenderLeafProps)`

The default custom leaf renderer.

###### `Slate(editor: ReactEditor, value: Node[], children: React.ReactNode, onChange: (value: Node[]) => void, [key: string]: any)`

A wrapper around the provider to handle `onChange` events, because the editor is a mutable singleton so it won't ever register as "changed" otherwise.

## Hooks

React hooks for Slate editors

###### `useEditor`

Get the current editor object from the React context.

###### `useFocused`

Get the current `focused` state of the editor.

###### `useReadOnly`

Get the current `readOnly` state of the editor.

###### `useSelected`

Get the current `selected` state of an element.

###### `useSlate`

Get the current editor object from the React context.

## ReactEditor

A React and DOM-specific version of the `Editor` interface. All about translating between the DOM and Slate.

###### `findKey(editor: ReactEditor, node: Node)`

Find a key for a Slate node.

###### `findPath(editor: ReactEditor, node: Node)`

Find the path of Slate node.

###### `isFocused(editor: ReactEditor)`

Check if the editor is focused.

###### `isReadOnly(editor: ReactEditor)`

Check if the editor is in read-only mode.

###### `blur(editor: ReactEditor)`

Blur the editor.

###### `focus(editor: ReactEditor)`

Focus the editor.

###### `deselect(editor: ReactEditor)`

Deselect the editor.

###### `hasDOMNode(editor: ReactEditor, target: DOMNode, options: { editable?: boolean } = {})`

Check if a DOM node is within the editor.

###### `insertData(editor: ReactEditor, data: DataTransfer)`

Insert data from a `DataTransfer` into the editor.

###### `setFragmentData(editor: ReactEditor, data: DataTransfer)`

Sets data from the currently selected fragment on a `DataTransfer`.

###### `toDOMNode(editor: ReactEditor, node: Node)`

Find the native DOM element from a Slate node.

###### `toDOMPoint(editor: ReactEditor, point: Point)`

Find a native DOM selection point from a Slate point.

###### `toDOMRange(editor: ReactEditor, range: Range)`

Find a native DOM range from a Slate `range`.

###### `toSlateNode(editor: ReactEditor, domNode: DOMNode)`

Find a Slate node from a native DOM `element`.

###### `findEventRange(editor: ReactEditor, event: any)`

Get the target range from a DOM `event`.

###### `toSlatePoint(editor: ReactEditor, domPoint: DOMPoint)`

Find a Slate point from a DOM selection's `domNode` and `domOffset`.

###### `toSlatePoint(editor: ReactEditor, domPoint: DOMPoint)`

Find a Slate range from a DOM range or selection.

## Plugins

React-specific plugins for Slate editors

###### `withReact(editor: Editor)`

Adds React and DOM specific behaviors to the editor.

## Utils

Private convenience modules
