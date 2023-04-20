# Editable component

## `Editable(props: EditableProps): JSX.Element`

The `Editable` component is the main editing component. Note that it must be inside a `Slate` component.

### Props

It takes as its props, any props accepted by a Textarea element plus the following props.

```typescript
type EditableProps = {
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

_NOTE: Detailed breakdown of Props not completed. Refer to the source code at the moment. Under construction._

#### `scrollSelectionIntoView?: (editor: ReactEditor, domRange: DOMRange) => void`

Slate has its own default method to scroll a DOM selection into view that works for most cases; however, if the default behavior isn't working for you, possible due to some complex styling, you may need to override the default behavior by providing a different function here.
