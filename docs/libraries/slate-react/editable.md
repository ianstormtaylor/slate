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

_NOTE: Detailed breakdown of Props not completed. Refer to the [source code](https://github.com/ianstormtaylor/slate/blob/main/packages/slate-react/src/components/editable.tsx) at the moment. Under construction._

#### `placeholder?: string`

The text to display as a placeholder when the Editor is empty. A typical value for `placeholder` would be "Enter text here..." or "Start typing...". The placeholder text will not be treated as an actual value and will disappear when the user starts typing in the Editor.

### `readOnly?: boolean`

The readOnly prop is an optional boolean attribute that, when set to true, renders the editor in a "read-only" state. In this state, user input and interactions will not modify the editor's content.

If this prop is omitted or set to false, the editor remains in the default "editable" state, allowing users to interact with and modify the content.

This prop is particularly useful when you want to display text or rich media content without allowing users to edit it, such as when displaying published content or a preview of the user's input.

### `renderElement?: (props: RenderElementProps) => JSX.Element`

The `renderElement` prop is a function used to render a custom component for a specific type of Element node in the Slate.js document model. The function receives a RenderElementProps object as its argument and returns a JSX element.

Here is the type of the `RenderElementProps` passed into the function.

```typescript
export interface RenderElementProps {
  children: any
  element: Element
  attributes: {
    'data-slate-node': 'element'
    'data-slate-inline'?: true
    'data-slate-void'?: true
    dir?: 'rtl'
    ref: any
  }
}
```

The `attributes` must be added to the props of the top level HTML element returned from the function and the `children` must be rendered somewhere inside the returned JSX.

Here is a typical usage of `renderElement` with two types of elements.

```javascript
const initialValue = [
  {
    type: 'paragraph',
    children: [{ text: 'A line of text in a paragraph.' }],
  },
]

const App = () => {
  const [editor] = useState(() => withReact(createEditor()))

  // Define a rendering function based on the element passed to `props`. We use
  // `useCallback` here to memoize the function for subsequent renders.
  const renderElement = useCallback(props => {
    switch (props.element.type) {
      case 'code':
        return <CodeElement {...props} />
      default:
        return <DefaultElement {...props} />
    }
  }, [])

  return (
    <Slate editor={editor} initialValue={initialValue}>
      <Editable
        // Pass in the `renderElement` function.
        renderElement={renderElement}
      />
    </Slate>
  )
}

const CodeElement = props => {
  return (
    <pre {...props.attributes}>
      <code>{props.children}</code>
    </pre>
  )
}

const DefaultElement = props => {
  return <p {...props.attributes}>{props.children}</p>
}
```

#### `renderLeaf?: (props: RenderLeafProps) => JSX.Element`

The `renderLeaf` prop is an optional function that allows you to customize the rendering of leaf nodes in the document tree of your Slate editor. A "leaf" in Slate is the smallest chunk of text and its associated formatting attributes.

This function should return a JSX element, which defines how the leaf node is displayed in the editor.

The `renderLeaf` function receives an object of type `RenderLeafProps` as its argument, which contains the following properties:

```typescript
export interface RenderLeafProps {
  children: any
  leaf: Text
  text: Text
  attributes: {
    'data-slate-leaf': true
  }
}
```

By providing your own `renderLeaf` function, you can control the rendering of different types of text, such as bold, italic, underlined text, or even custom types like mentions or hashtags.

Example usage:

```typescript
<Editor
  renderLeaf={({ attributes, children, leaf }) => {
    return (
      <span
        {...attributes}
        style={{ fontWeight: leaf.bold ? 'bold' : 'normal' }}
      >
        {children}
      </span>
    )
  }}
/>
```

In this example, text marked as bold will be rendered with `fontWeight: bold` or otherwise with a `fontWeight: normal`.

#### `renderPlaceholder?: (props: RenderPlaceholderProps) => JSX.Element`

The `renderPlaceholder` prop is an optional function that allows you to customize how the placeholder of the Slate.js `Editable` component is rendered when the editor is empty.

The `renderPlaceholder` function receives an object `props` of type `RenderPlaceholderProps` and should return a JSX element that will be rendered as the placeholder.

The `RenderPlaceholderProps` interface might contain properties such as:

```typescript
export type RenderPlaceholderProps = {
  children: any
  attributes: {
    'data-slate-placeholder': boolean
    dir?: 'rtl'
    contentEditable: boolean
    ref: React.RefCallback<any>
    style: React.CSSProperties
  }
}
```

The `attributes` property is an object with various properties that should be applied to the element that wraps your placeholder, to ensure Slate's event handling works correctly.

The `children` property is the `placeholder` content.

An example usage might look like:

```jsx
<Editable
  renderPlaceholder={({ attributes, children }) => (
    <div {...attributes} style={{ fontStyle: 'italic', color: 'gray' }}>
      {children}
    </div>
  )}
/>
```

In this example, the placeholder text is styled to be italic and gray. The `{...attributes}` spread ensures that the necessary Slate data and event handlers are applied to the placeholder element.

Note: The placeholder will only be shown when the editor's content is empty.

#### `scrollSelectionIntoView?: (editor: ReactEditor, domRange: DOMRange) => void`

Slate has its own default method to scroll a DOM selection into view that works for most cases; however, if the default behavior isn't working for you, possible due to some complex styling, you may need to override the default behavior by providing a different function here.

#### `disableDefaultStyles?: boolean`

The `disableDefaultStyles` prop is an optional boolean that determines whether the default styles of the Slate.js `Editable` component are applied or not.

If `disableDefaultStyles` is set to `true`, the default styles will be removed. This gives you more control over the styling of your editor component, as you can then provide your own styles without the need to override the default ones.

Here's an example of how you might use this prop:

```jsx
<Editable disableDefaultStyles={true} />
```

In this example, all default styles of the `Editable` component are disabled, giving you a clean slate for applying your own styles.

Please note that with this prop set to `true`, you will need to ensure that your styles cater to all the functionalities of the editor that rely on specific styles to work properly.

Default value is `false`, which means by default, the `Editable` component will use Slate's built-in styles.

Here are the default styles:

```typescript
const defaultStyles = {
  // Allow positioning relative to the editable element.
  position: 'relative',
  // Preserve adjacent whitespace and new lines.
  whiteSpace: 'pre-wrap',
  // Allow words to break if they are too long.
  wordWrap: 'break-word',
  // Make the minimum height that of the placeholder.
  ...(placeholderHeight ? { minHeight: placeholderHeight } : {}),
}
```
