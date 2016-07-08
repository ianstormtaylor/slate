
<br/>
<p align="center"><strong>Previous:</strong><br/><a href="./applying-custom-formatting.md">Applying Custom Formatting</a></p>
<br/>

### Using Formatting

Up to now, everything we've learned has been about how to write one-off logic for your specific Slate editor. But one of the most beautiful things about Slate is actually its plugin system, and how it lets you write less one-off code.

In the previous guide, we actually wrote some pretty useful code for adding **bold** formatting to ranges of text when a key is pressed. But most of that code wasn't really specific to bold text. 

So let's look at how you'd break that code out into it's own reusable plugin that can toggle _any_ formatting mark on _any_ key press.

Starting with our app from earlier:

```js
const BOLD_MARK = {
  fontWeight: 'bold'
}

class App extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      state: initialState
    }
  }

  render() {
    return (
      <Editor
        state={this.state.state}
        renderMark={mark => this.renderMark(mark)}
        renderNode={node => this.renderNode(node)}
        onChange={state => this.onChange(state)}
        onKeyDown={(e, state) => this.onKeyDown(e, state)}
      />
    )
  }

  renderMark(mark) {
    if (mark.type == 'bold') return BOLD_MARK
  }

  renderNode(node) {
    if (node.type == 'paragraph') return ParagraphNode
  }

  onChange(state) {
    this.setState({ state })
  }

  onKeyDown(event, state) {
    if (!event.metaKey || event.which != 66) return

    const isBold = state.marks.some(mark => mark.type == 'bold')
    return state
      .transform()
      [isBold ? 'unmark' : 'mark']('bold')
      .apply()
  }

}
```

Let's write a new function, that takes a set of options: the mark `type` to toggle and the key `code` to press.

```js
function MarkHotkey(options) {
  // Grab our options from the ones passed in.
  const { type, code } = options
}
```

Okay, that was easy.

Now we want to have it return a dictionary of handlers, in this case specifically containing a `onKeyDown` handler with logic pulled from our app:


```js
function MarkHotkey(options) {
  const { type, code } = options

  // Return our "plugin" object, containing the `onKeyDown` handler.
  return {
    onKeyDown(event, state) {
      // Check that the key pressed matches our `code` option.
      if (!event.metaKey || event.which != code) return

      // Determine whether our `type` option mark is currently active.
      const isActive = state.marks.some(mark => mark.type == type)

      // Toggle the mark `type` based on whether it is active.
      return state
        .transform()
        [isActive ? 'unmark' : 'mark'](type)
        .apply()
    }
  }
}
```

Boom! Now we're getting somewhere. That code is reusable for any type of mark.

So now, let's remove the old code from our app, and pass the editor our brand new `MarkHotkey` plugin instead, giving it the same options that will keep our bold functionality intact:

```js
const BOLD_MARK = {
  fontWeight: 'bold'
}

// Initialize our bold-mark-adding plugin.
const boldPlugin = MarkHotkey({
  type: 'bold', 
  code: 66
})

// Create an array of plugins.
const plugins = [
  boldPlugin
]

class App extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      state: initialState
    }
  }

  // Add the `plugins` property to the editor, and remove `onKeyDown`.
  render() {
    return (
      <Editor
        state={this.state.state}
        plugins={plugins}
        renderMark={mark => this.renderMark(mark)}
        renderNode={node => this.renderNode(node)}
        onChange={state => this.onChange(state)}
      />
    )
  }

  renderMark(mark) {
    if (mark.type == 'bold') return BOLD_MARK
  }

  renderNode(node) {
    if (node.type == 'paragraph') return ParagraphNode
  }

  onChange(state) {
    this.setState({ state })
  }

}
```

Awesome. If you test out the editor now, you'll notice that everything still works just as it did before. But the beauty of the logic being encapsulated in a plugin is that we can add more mark types _extremely_ easily now!

Let's add _italic_, `code`, ~~strikethrough~~ and underline marks:

```js
// Add our new mark renderers...
const MARKS = {
  bold: {
    fontWeight: 'bold'
  },
  code: {
    fontFamily: 'monospace'
  },
  italic: {
    fontStyle: 'italic'
  },
  strikethrough: {
    textDecoration: 'strikethrough'
  },
  underline: {
    textDecoration: 'underline'
  }
}

// Initialize our plugins...
const plugins = [
  MarkHotkey({ code: 66, type: 'bold' }),
  MarkHotkey({ code: 192, type: 'code' }),
  MarkHotkey({ code: 73, type: 'italic' }),
  MarkHotkey({ code: 68, type: 'strikethrough' }),
  MarkHotkey({ code: 85, type: 'underline' })
]

class App extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      state: initialState
    }
  }

  render() {
    return (
      <Editor
        state={this.state.state}
        plugins={plugins}
        renderMark={mark => this.renderMark(mark)}
        renderNode={node => this.renderNode(node)}
        onChange={state => this.onChange(state)}
      />
    )
  }

  // Update our render function to handle all the new marks...
  renderMark(mark) {
    return MARKS[mark.type]
  }

  renderNode(node) {
    if (node.type == 'paragraph') return ParagraphNode
  }

  onChange(state) {
    this.setState({ state })
  }

}
```

And there you have it! We just added a ton of functionality to the editor with very little work. And we can keep all of our mark hotkey logic tested and isolated in a single place, making maintaining the code easier.

Of course... now that it's reusable, we could actually make our `MarkHotkey` plugin a little easier to use. What if instead of a `code` argument it took the text of the `key` itself? That would make the calling code a lot clearer, since key codes are really obtuse.

In fact, unless you have weirdly good keycode guessing, there's a good chance you had no idea what our current hotkeys bindings actually mapped to.

Let's fix that.

Using the `keycode` module in npm makes this dead simple.

First install it:

```
npm install keycode
```

And then we can add it our plugin:

```js
// Import the keycode module.
import keycode from `keycode`

function MarkHotkey(options) {
  // Change the options to take a `key`.
  const { type, key } = options

  return {
    onKeyDown(event, state) {
      // Change the comparison to use the key name.
      if (!event.metaKey || keycode(event.which) != key) return

      const isActive = state.marks.some(mark => mark.type == type)
      return state
        .transform()
        [isActive ? 'unmark' : 'mark'](type)
        .apply()
    }
  }
}
```

And finally, we can make our app code clearer:

```js
const MARKS = {
  bold: {
    fontWeight: 'bold'
  },
  code: {
    fontFamily: 'monospace'
  },
  italic: {
    fontStyle: 'italic'
  },
  strikethrough: {
    textDecoration: 'strikethrough'
  },
  underline: {
    textDecoration: 'underline'
  }
}

// Use the much clearer key names instead of key codes!
const plugins = [
  MarkHotkey({ key: 'b', type: 'bold' }),
  MarkHotkey({ key: '`', type: 'code' }),
  MarkHotkey({ key: 'i', type: 'italic' }),
  MarkHotkey({ key: 'd', type: 'strikethrough' }),
  MarkHotkey({ key: 'u', type: 'underline' })
]

class App extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      state: initialState
    }
  }

  render() {
    return (
      <Editor
        state={this.state.state}
        plugins={plugins}
        renderMark={mark => this.renderMark(mark)}
        renderNode={node => this.renderNode(node)}
        onChange={state => this.onChange(state)}
      />
    )
  }

  renderMark(mark) {
    return MARKS[mark.type]
  }

  renderNode(node) {
    if (node.type == 'paragraph') return ParagraphNode
  }

  onChange(state) {
    this.setState({ state })
  }

}
```

That's why plugins are awesome. They let you get really expressive while also making your codebase easier to manage. And since Slate is built with plugins as a primary consideration, using them is dead simple.
