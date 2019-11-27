# Rendering

One of the best parts of Slate is that it's built with React, so it fits right into your existing application. It doesn't re-invent its own view layer that you have to learn. It tries to keep everything as React-y as possible.

To that end, Slate gives you control over the rendering behavior of your custom elements and custom marks in your rich-text domain.

You can define these behaviors by passing "render props" to the top-level `<Editable>` component.

For example if you wanted to render custom element components, you'd pass in the `renderElement` prop:

```jsx
import { createEditor } from 'slate'
import { Slate, Editable, withReact } from 'slate-react'

const MyEditor = () => {
  const editor = useMemo(() => withReact(createEditor()), [])
  const renderElement = useCallback(({ attributes, children, element }) => {
    switch (element.type) {
      case 'quote':
        return <blockquote {...attributes}>{children}</blockquote>
      case 'link':
        return (
          <a {...attributes} href={element.url}>
            {children}
          </a>
        )
      default:
        return <p {...attributes}>{children}</p>
    }
  }, [])

  return (
    <Slate editor={editor}>
      <Editable renderElement={renderElement} />
    </Slate>
  )
}
```

> 🤖 Be sure to mix in `props.attributes` and render `props.children` in your custom components! The attributes must be added to the top-level DOM element inside the component, as they are required for Slate's DOM helper functions to work. And the children are the actual text content of your document which Slate manages for you automatically.

You don't have to use simple HTML elements, you can use your own custom React components too:

```js
const renderElement = useCallback(props => {
  switch (props.element.type) {
    case 'quote':
      return <QuoteElement {...props} />
    case 'link':
      return <LinkElement {...props} />
    default:
      return <DefaultElement {...props} />
  }
}, [])
```

The same thing goes for a custom `renderMark` prop:

```jsx
const renderMark = useCallback(({ attributes, children, mark }) => {
  switch (mark.type) {
    case 'bold':
      return <strong {...attributes}>{children}</strong>
    case 'italic':
      return <em {...attributes}>{children}</em>
  }
}, [])
```

> 🤖 Be aware though that marks aren't guaranteed to be "contiguous". Which means even though a **word** is bolded, it's not guaranteed to render as a single `<strong>` element. If some of its characters are also italic, it might be split up into multiple elements—one `<strong>wo</strong>` and one `<em><strong>rd</strong></em>`.

## Toolbars, Menus, Overlays, and more!

In addition to controlling the rendering of elements and marks inside Slate, you can also retrieve the current editor context from inside other components using the `useSlate` hook.

That way other components can execute commands, query the editor state, or anything else.

A common use case for this is rendering a toolbar with formatting buttons that are highlighted based on the current selection:

```jsx
const MyEditor = () => {
  const editor = useMemo(() => withReact(createEditor()), [])
  return (
    <Slate editor={editor}>
      <Toolbar />
      <Editable />
    </Slate>
  )
}

const Toolbar = () => {
  const editor = useSlate()
  return (
    <div>
      <Button active={isBoldActive(editor)}>B</Button>
      <Button active={isItalicActive(editor)}>B</Button>
    </div>
  )
}
```

Because the `<Toolbar>` uses the `useSlate` hook to retrieve the context, it will will re-render whenever the editor changes, so that the active state of the buttons stays in sync.
