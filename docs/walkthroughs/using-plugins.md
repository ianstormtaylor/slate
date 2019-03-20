<br/>
<p align="center"><strong>Previous:</strong><br/><a href="./applying-custom-formatting.md">Applying Custom Formatting</a></p>
<br/>

# Using Plugins

Up until now, everything we've learned has been about how to write one-off logic for your specific Slate editor. But one of the most beautiful things about Slate is actually its plugin system and how it lets you write less one-off code.

In the previous guide, we actually wrote some pretty useful code for adding **bold** formatting to ranges of text when a key is pressed. But most of that code wasn't really specific to **bold** text; it could just as easily have applied to _italic_ text or `code` text if we switched a few variables.

So let's break that logic out into a reusable plugin that can toggle _any_ mark on _any_ key press.

Starting with our app from earlier:

```js
class App extends React.Component {
  state = {
    value: initialValue,
  }

  onChange = ({ value }) => {
    this.setState({ value })
  }

  onKeyDown = (event, editor, next) => {
    if (event.key != 'b' || !event.ctrlKey) return next()
    event.preventDefault()
    editor.toggleMark('bold')
  }

  render() {
    return (
      <Editor
        value={this.state.value}
        onChange={this.onChange}
        onKeyDown={this.onKeyDown}
        renderMark={this.renderMark}
      />
    )
  }

  renderMark = (props, editor, next) => {
    switch (props.mark.type) {
      case 'bold':
        return <strong {...props.attributes}>{props.children}</strong>
      default:
        return next()
    }
  }
}
```

Let's write a new function that takes a set of options: the mark `type` to toggle and the `key` to press.

```js
function MarkHotkey(options) {
  // Grab our options from the ones passed in.
  const { type, key } = options
}
```

Okay, that was easy. But it doesn't do anything.

To fix that, we need our plugin function to return a "plugin object" that Slate recognizes. Slate's plugin objects are just plain JavaScript objects whose properties map to the same handlers on the `Editor`.

In this case, our plugin object will have one property, an `onKeyDown` handler, with its logic copied right from our current app's code:

```js
function MarkHotkey(options) {
  const { type, key } = options

  // Return our "plugin" object, containing the `onKeyDown` handler.
  return {
    onKeyDown(event, editor, next) {
      // If it doesn't match our `key`, let other plugins handle it.
      if (!event.ctrlKey || event.key != key) return next()

      // Prevent the default characters from being inserted.
      event.preventDefault()

      // Toggle the mark `type`.
      editor.toggleMark(type)
    },
  }
}
```

Boom! Now we're getting somewhere. That code is reusable for any type of mark.

Now that we have our plugin, let's remove the hard-coded logic from our app and replace it with our brand new `MarkHotkey` plugin instead, passing in the same options that will keep our **bold** functionality intact:

```js
// Initialize our bold-mark-adding plugin.
const boldPlugin = MarkHotkey({
  type: 'bold',
  key: 'b',
})

// Create an array of plugins.
const plugins = [boldPlugin]

class App extends React.Component {
  state = {
    value: initialValue,
  }

  onChange = ({ value }) => {
    this.setState({ value })
  }

  render() {
    return (
      // Add the `plugins` property to the editor, and remove `onKeyDown`.
      <Editor
        plugins={plugins}
        value={this.state.value}
        onChange={this.onChange}
        renderMark={this.renderMark}
      />
    )
  }

  renderMark = (props, editor, next) => {
    switch (props.mark.type) {
      case 'bold':
        return <strong>{props.children}</strong>
      default:
        return next()
    }
  }
}
```

Awesome. If you test out the editor now, you'll notice that everything still works just as it did before. But the beauty of the logic being encapsulated in a plugin is that we can add more mark types _extremely_ easily now!

Let's add _italic_, `code`, ~~strikethrough~~ and underline marks:

```js
// Initialize a plugin for each mark...
const plugins = [
  MarkHotkey({ key: 'b', type: 'bold' }),
  MarkHotkey({ key: '`', type: 'code' }),
  MarkHotkey({ key: 'i', type: 'italic' }),
  MarkHotkey({ key: '~', type: 'strikethrough' }),
  MarkHotkey({ key: 'u', type: 'underline' }),
]

class App extends React.Component {
  state = {
    value: initialValue,
  }

  onChange = ({ value }) => {
    this.setState({ value })
  }

  render() {
    return (
      <Editor
        plugins={plugins}
        value={this.state.value}
        onChange={this.onChange}
        renderMark={this.renderMark}
      />
    )
  }

  renderMark = (props, editor, next) => {
    switch (props.mark.type) {
      case 'bold':
        return <strong>{props.children}</strong>
      // Add our new mark renderers...
      case 'code':
        return <code>{props.children}</code>
      case 'italic':
        return <em>{props.children}</em>
      case 'strikethrough':
        return <del>{props.children}</del>
      case 'underline':
        return <u>{props.children}</u>
      default:
        return next()
    }
  }
}
```

And there you have it! We just added a ton of functionality to the editor with very little work. And we can keep all of our mark hotkey logic tested and isolated in a single place, making the code easier to maintain.

That's why plugins are awesome. They let you get really expressive while also making your codebase easier to manage. And since Slate is built with plugins as a primary consideration, using them is dead simple!

<br/>
<p align="center"><strong>Next:</strong><br/><a href="./saving-to-a-database.md">Saving to a Database</a></p>
<br/>
