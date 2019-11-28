# Using Commands

Up until now, everything we've learned has been about how to write one-off logic for your specific Slate editor. But one of the most powerful things about Slate is that it lets you model your specific rich text "domain" however you'd like, and write less one-off code.

In the previous guides we've written some useful code to handle formatting code blocks and bold marks. And we've hooked up the `onKeyDown` handler to invoke that code. But we've always done it using the built-in `Editor` helpers directly, instead of using "commands".

Slate lets you augment the built-in `editor` object to handle your own custom rich text commands. And you can even use pre-packaged "plugins" which add a given set of functionality.

Let's see how this works.

We'll start with our app from earlier:

```js
const App = () => {
  const editor = useMemo(() => withReact(createEditor()), [])
  const renderElement = useCallback(props => {
    switch (props.element.type) {
      case 'code':
        return <CodeElement {...props} />
      default:
        return <DefaultElement {...props} />
    }
  }, [])

  const renderMark = useCallback(props => {
    switch (props.mark.type) {
      case 'bold': {
        return <BoldMark {...props} />
      }
    }
  }, [])

  return (
    <Slate editor={editor} defaultValue={defaultValue}>
      <Editable
        renderElement={renderElement}
        renderMark={renderMark}
        onKeyDown={event => {
          if (!event.ctrlKey) {
            return
          }

          switch (event.key) {
            case '`': {
              event.preventDefault()
              const { selection } = editor
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
              Editor.addMarks(editor, [{ type: 'bold' }])
              break
            }
          }
        }}
      />
    </Slate>
  )
}
```

It has the concept of "code blocks" and "bold marks". But these things are all defined in one-off cases inside the `onKeyDown` handler. If you wanted to reuse that logic elsewhere you'd need to extract it.

We can instead implement these domain-specific concepts by extending the `editor` object:

```js
// Create a custom editor plugin function that will augment the editor.
const withCustom = editor => {
  return editor
}

const App = () => {
  // Wrap the editor with our new `withCustom` plugin.
  const editor = useMemo(() => withCustom(withReact(createEditor())), [])
  const renderElement = useCallback(props => {
    switch (props.element.type) {
      case 'code':
        return <CodeElement {...props} />
      default:
        return <DefaultElement {...props} />
    }
  }, [])

  const renderMark = useCallback(props => {
    switch (props.mark.type) {
      case 'bold': {
        return <BoldMark {...props} />
      }
    }
  }, [])

  return (
    <Slate editor={editor} defaultValue={defaultValue}>
      <Editable
        renderElement={renderElement}
        renderMark={renderMark}
        onKeyDown={event => {
          if (!event.ctrlKey) {
            return
          }

          switch (event.key) {
            case '`': {
              event.preventDefault()
              const { selection } = editor
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
    </Slate>
  )
}
```

Since we haven't yet defined (or overridden) any commands in `withCustom`, nothing will change yet. Our app will still function exactly as it did before.

However, now we can start extract bits of logic into reusable methods:

```js
const withCustom = editor => {
  const { exec } = editor

  editor.exec = command => {
    // Define a command to toggle the bold mark formatting.
    if (command.type === 'toggle_bold_mark') {
      const isActive = CustomEditor.isBoldMarkActive(editor)
      // Delegate to the existing `add_mark` and `remove_mark` commands, so that
      // other plugins can override them if they need to still.
      editor.exec({
        type: isActive ? 'remove_mark' : 'add_mark',
        mark: { type: 'bold' },
      })
    }

    // Define a command to toggle the code block formatting.
    else if (command.type === 'toggle_code_block') {
      const isActive = CustomEditor.isCodeBlockActive(editor)
      // There is no `set_nodes` command, so we can transform the editor
      // directly using the helper instead.
      Editor.setNodes(
        editor,
        { type: isActive ? null : 'code' },
        { match: 'block' }
      )
    }

    // Otherwise, fall back to the built-in `exec` logic for everything else.
    else {
      exec(command)
    }
  }

  return editor
}

// Define our own custom set of helpers for common queries.
const CustomEditor = {
  isBoldMarkActive(editor) {
    const { selection } = editor
    const activeMarks = Editor.activeMarks(editor)
    return activeMarks.some(mark => mark.type === 'bold')
  },

  isCodeBlockActive(editor) {
    const { selection } = editor
    const isCode = selection
      ? Editor.match(editor, selection, { type: 'code' })
      : false
    return isCode
  },
}

const App = () => {
  const editor = useMemo(() => withCustom(withReact(createEditor())), [])
  const renderElement = useCallback(props => {
    switch (props.element.type) {
      case 'code':
        return <CodeElement {...props} />
      default:
        return <DefaultElement {...props} />
    }
  }, [])

  const renderMark = useCallback(props => {
    switch (props.mark.type) {
      case 'bold': {
        return <BoldMark {...props} />
      }
    }
  }, [])

  return (
    <Slate editor={editor} defaultValue={defaultValue}>
      <Editable
        renderElement={renderElement}
        renderMark={renderMark}
        // Replace the `onKeyDown` logic with our new commands.
        onKeyDown={event => {
          if (!event.ctrlKey) {
            return
          }

          switch (event.key) {
            case '`': {
              event.preventDefault()
              editor.exec({ type: 'toggle_code_block' })
              break
            }

            case 'b': {
              event.preventDefault()
              editor.exec({ type: 'toggle_bold_mark' })
              break
            }
          }
        }}
      />
    </Slate>
  )
}
```

Now our commands are clearly defined and you can invoke them from anywhere we have access to our `editor` object. For example, from hypothetical toolbar buttons:

```js
const App = () => {
  const [value, setValue] = useState(initialValue)
  const editor = useMemo(() => withCustom(withReact(createEditor())), [])
  const renderElement = useCallback(props => {
    switch (props.element.type) {
      case 'code':
        return <CodeElement {...props} />
      default:
        return <DefaultElement {...props} />
    }
  }, [])

  const renderMark = useCallback(props => {
    switch (props.mark.type) {
      case 'bold': {
        return <BoldMark {...props} />
      }
    }
  }, [])

  return (
    // Add a  toolbar with buttons that call the same methods.
    <Slate editor={editor} defaultValue={defaultValue}>
      <div>
        <button
          onMouseDown={event => {
            event.preventDefault()
            editor.exec({ type: 'toggle_bold_mark' })
          }}
        >
          Bold
        </button>
        <button
          onMouseDown={event => {
            event.preventDefault()
            editor.exec({ type: 'toggle_code_block' })
          }}
        >
          Code Block
        </button>
      </div>
      <Editable
        editor={editor}
        value={value}
        renderElement={renderElement}
        renderMark={renderMark}
        onChange={newValue => setValue(newValue)}
        onKeyDown={event => {
          if (!event.ctrlKey) {
            return
          }

          switch (event.key) {
            case '`': {
              event.preventDefault()
              editor.exec({ type: 'toggle_code_block' })
              break
            }

            case 'b': {
              event.preventDefault()
              editor.exec({ type: 'toggle_bold_mark' })
              break
            }
          }
        }}
      />
    </Slate>
  )
}
```

That's the benefit of extracting the logic.

And you don't necessarily need to define it all in the same plugin. You can use the plugin pattern to add logic and behaviors to an editor from elsewhere.

For example, you can use the `slate-history` package to add a history stack to your editor, like so:

```js
import { Editor } from 'slate'
import { withHistory } from 'slate-history'

const editor = useMemo(
  () => withCustom(withHistory(withReact(createEditor()))),
  []
)
```

And there you have it! We just added a ton of functionality to the editor with very little work. And we can keep all of our command logic tested and isolated in a single place, making the code easier to maintain.

That's why plugins are awesome. They let you get really expressive while also making your codebase easier to manage. And since Slate is built with plugins as a primary consideration, using them is dead simple!
