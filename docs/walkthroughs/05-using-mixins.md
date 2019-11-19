<br/>
<p align="center"><strong>Previous:</strong><br/><a href="./applying-custom-formatting.md">Applying Custom Formatting</a></p>
<br/>

# Using Mixins

Up until now, everything we've learned has been about how to write one-off logic for your specific Slate editor. But one of the most powerful things about Slate is that it lets you model your specific rich text "domain" however you'd like, and write less one-off code.

In the previous guides we've written some useful code to handle formatting code blocks and bold marks. And we've hooked up the `onKeyDown` handler to invoke that code. But we've always done it using the built-in `Editor` class.

Slate lets you augment the built-in `Editor` with your own custom methods. And you can even use pre-packaged "mixins" which add a given set of functionality.

Let's see how this works.

We'll start with our app from earlier:

```js
const App = () => {
  const [value, setValue] = useState(initialValue)
  const editor = useSlate(Editor)
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
  })

  return (
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
            const { selection } = editor.value
            const isCode = selection
              ? editor.getMatch(selection, { type: 'code' })
              : false

            editor.setNodes(
              { type: isCode ? null : 'code' },
              { match: 'block' }
            )
            break
          }

          case 'b': {
            event.preventDefault()
            editor.toggleMarks([{ type: 'bold' }])
            break
          }
        }
      }}
    />
  )
}
```

It has the concept of "code blocks" and "bold marks". But these things are all defined in one-off cases inside the `onKeyDown` handler. If you wanted to reuse that logic elsewhere you'd need to extract it.

We can instead implement these domain-specific concepts on a custom `Editor` subclass:

```js
// Create a custom editor class that extends the base editor.
class CustomEditor extends Editor {}

const App = () => {
  const [value, setValue] = useState(initialValue)
  // Pass in the new `CustomEditor` to the `useSlate` hook instead.
  const editor = useSlate(CustomEditor)
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
  })

  return (
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
            const { selection } = editor.value
            const isCode = selection
              ? editor.getMatch(selection, { type: 'code' })
              : false

            editor.setNodes(
              { type: isCode ? null : 'code' },
              { match: 'block' }
            )
            break
          }

          case 'b': {
            event.preventDefault()
            editor.toggleMarks([{ type: 'bold' }])
            break
          }
        }
      }}
    />
  )
}
```

Since we haven't yet defined (or overridden) any methods on our `CustomEditor`, nothing will change. Our app will still function exactly as it did before.

However, now we can start extract bits of logic into reusable methods:

```js
class CustomEditor extends Editor {
  // Define a method that checks whether a code block is "active"
  isCodeBlockActive() {
    const { selection } = this.value
    const isCode = selection
      ? this.getMatch(selection, { type: 'code' })
      : false
    return isCode
  }

  // Define a method that toggle the code block formatting.
  toggleCodeBlock() {
    const isActive = this.isCodeBlockActive()
    this.setNodes({ type: isActive ? null : 'code' }, { match: 'block' })
  }

  // Define a method specifically for toggling the bold mark formatting.
  toggleBoldMark() {
    this.toggleMarks([{ type: 'bold' }])
  }
}

const App = () => {
  const [value, setValue] = useState(initialValue)
  const editor = useSlate(CustomEditor)
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
  })

  return (
    <Editable
      editor={editor}
      value={value}
      renderElement={renderElement}
      renderMark={renderMark}
      onChange={newValue => setValue(newValue)}
      // Replace the `onKeyDown` logic with your new methods.
      onKeyDown={event => {
        if (!event.ctrlKey) {
          return
        }

        switch (event.key) {
          case '`': {
            event.preventDefault()
            editor.toggleCodeBlock()
            break
          }

          case 'b': {
            event.preventDefault()
            editor.toggleBoldMark()
            break
          }
        }
      }}
    />
  )
}
```

Now your methods are clearly defined and you can invoke them from anywhere you have access to your `editor` instead. For example, from hypothetical toolbar buttons:

```js
const App = () => {
  const [value, setValue] = useState(initialValue)
  const editor = useSlate(CustomEditor)
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
  })

  return (
    <React.Fragment>
      // Add a hypothetical toolbar with buttons that call the same methods.
      <Toolbar>
        <Button
          text="Bold"
          onMouseDown={event => {
            event.preventDefault()
            editor.toggleBoldMark()
          }}
        />
        <Button
          text="Code Block"
          onMouseDown={event => {
            event.preventDefault()
            editor.toggleCodeBlock()
          }}
        />
      </Toolbar>
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
              editor.toggleCodeBlock()
              break
            }

            case 'b': {
              event.preventDefault()
              editor.toggleBoldMark()
              break
            }
          }
        }}
      />
    </React.Fragment>
  )
}
```

That's the benefit of extracting the logic.

And you don't necessarily need to define it all in the same class. You can use the "mixin" pattern to add logic to behaviors to an editor from elsewhere.

For example, you can use the `slate-history` package to add a history stack to your editor, like so:

```js
import { Editor } from 'slate'
import { withHistory } from 'slate-history'

class CustomEditor extends withHistory(Editor) {
  // Your custom logic here...
}
```

And there you have it! We just added a ton of functionality to the editor with very little work. And we can keep all of our mark hotkey logic tested and isolated in a single place, making the code easier to maintain.

That's why plugins are awesome. They let you get really expressive while also making your codebase easier to manage. And since Slate is built with plugins as a primary consideration, using them is dead simple!

<br/>
<p align="center"><strong>Next:</strong><br/><a href="./saving-to-a-database.md">Saving to a Database</a></p>
<br/>
