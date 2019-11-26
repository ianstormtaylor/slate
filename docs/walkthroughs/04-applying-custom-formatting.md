<br/>
<p align="center"><strong>Previous:</strong><br/><a href="./defining-custom-block-nodes.md">Defining Custom Block Nodes</a></p>
<br/>

# Applying Custom Formatting

In the previous guide we learned how to create custom block types that render chunks of text inside different containers. But Slate allows for more than just "blocks".

In this guide, we'll show you how to add custom formatting options, like **bold**, _italic_, `code` or ~~strikethrough~~.

So we start with our app from earlier:

```js
const App = () => {
  const [value, setValue] = useState(initialValue)
  const editor = useMemo(() => withReact(createEditor()), [])
  const renderElement = useCallback(props => {
    switch (prop.element.type) {
      case 'code':
        return <CodeElement {...props} />
      default:
        return <DefaultElement {...props} />
    }
  }, [])

  return (
    <Editable
      editor={editor}
      value={value}
      renderElement={renderElement}
      onChange={newValue => setValue(newValue)}
      onKeyDown={event => {
        if (event.key === '`' && event.ctrlKey) {
          event.preventDefault()
          // Determine whether any of the currently selected blocks are code blocks.
          const { selection } = editor.value
          const isCode = selection
            ? Editor.match(editor, selection, { type: 'code' })
            : false

          // Toggle the block type depending on `isCode`.
          Editor.setNodes(
            editor,
            { type: isCode ? null : 'code' },
            { match: 'block' }
          )
        }
      }}
    />
  )
}
```

And now, we'll edit the `onKeyDown` handler to make it so that when you press `control-B`, it will add a "bold" mark to the currently selected text:

```js
const App = () => {
  const [value, setValue] = useState(initialValue)
  const editor = useMemo(() => withReact(createEditor()), [])
  const renderElement = useCallback(props => {
    switch (prop.element.type) {
      case 'code':
        return <CodeElement {...props} />
      default:
        return <DefaultElement {...props} />
    }
  }, [])

  return (
    <Editable
      editor={editor}
      value={value}
      renderElement={renderElement}
      onChange={newValue => setValue(newValue)}
      onKeyDown={event => {
        if (!event.ctrlKey) {
          return
        }

        // When "`" is pressed, keep our existing code block logic.
        switch (event.key) {
          case '`': {
            event.preventDefault()
            const { selection } = editor.value
            const isCode = selection
              ? Editor.match(editor, selection, { type: 'code' })
              : false

            Editor.setNodes(
              editor,
              { type: isCode ? null : 'code' },
              { match: 'block' }
            )
            break
          }

          // When "B" is pressed, add a bold mark to the text.
          case 'b': {
            event.preventDefault()
            Editor.toggleMarks(editor, [{ type: 'bold' }])
            break
          }
        }
      }}
    />
  )
}
```

Okay, so we've got the hotkey handler setup... but! If you happen to now try selecting text and hitting `Ctrl-B`, you won't notice any change. That's because we haven't told Slate how to render a "bold" mark.

For every mark type you want to add to your schema, you need to give Slate a "renderer" for that mark, just like elements. So let's define our `bold` mark:

```js
// Define a React component to render bold text with.
const BoldMark = props => {
  return <strong {...props.attributes}>{props.children}</strong>
}
```

Pretty familiar, right?

And now, let's tell Slate about that mark. To do that, we'll pass in the `renderMark` prop to our editor. Also, let's allow our mark to be toggled by changing `addMark` to `toggleMark`.

```js
const App = () => {
  const [value, setValue] = useState(initialValue)
  const editor = useMemo(() => withReact(createEditor()), [])
  const renderElement = useCallback(props => {
    switch (props.element.type) {
      case 'code':
        return <CodeElement {...props} />
      default:
        return <DefaultElement {...props} />
    }
  }, [])

  // Define a mark rendering function that is memoized with `useCallback`.
  const renderMark = useCallback(props => {
    switch (props.mark.type) {
      case 'bold': {
        return <BoldMark {...props} />
      }
    }
  })

  return (
    <Editable
      editor={editor}
      value={value}
      renderElement={renderElement}
      // Pass in the `renderMark` function.
      renderMark={renderMark}
      onChange={newValue => setValue(newValue)}
      onKeyDown={event => {
        if (!event.ctrlKey) {
          return
        }

        switch (event.key) {
          case '`': {
            event.preventDefault()
            const { selection } = editor.value
            const isCode = selection
              ? Editor.match(editor, selection, { type: 'code' })
              : false

            Editor.setNodes(
              editor,
              { type: isCode ? null : 'code' },
              { match: 'block' }
            )
            break
          }

          case 'b': {
            event.preventDefault()
            Editor.toggleMarks(editor, [{ type: 'bold' }])
            break
          }
        }
      }}
    />
  )
}

const BoldMark = props => {
  return <strong {...props.attributes}>{props.children}</strong>
}
```

Now, if you try selecting a piece of text and hitting `Ctrl-B` you should see it turn bold! Magic!

<br/>
<p align="center"><strong>Next:</strong><br/><a href="./05-executing-commands.md">Executing Commands</a></p>
<br/>
