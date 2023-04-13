# Editable component

#### `Editable(props: EditableProps)`

The `Editable` component is the main editing component. Note that it must be inside a `Slate` component.

It takes as its props, any props accepted by a Textarea element plus the following props.

```typescript
export type EditableProps = {
  decorate?: (entry: NodeEntry) => Range[]
  onDOMBeforeInput?: (event: InputEvent) => void
  placeholder?: string
  readOnly?: boolean
  role?: string
  style?: React.CSSProperties
  renderElement?: (props: RenderElementProps) => JSX.Element
  renderLeaf?: (props: RenderLeafProps) => JSX.Element
  renderPlaceholder?: (props: RenderPlaceholderProps) => JSX.Element
  scrollSelectionIntoView?: (editor: ReactEditor, domRange: DOMRange) => void
  as?: React.ElementType
  disableDefaultStyles?: boolean
} & React.TextareaHTMLAttributes<HTMLDivElement>
```
