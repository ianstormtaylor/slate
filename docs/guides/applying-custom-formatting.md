
<br/>
<p align="center"><strong>Previous:</strong><br/><a href="./defining-custom-block-nodes.md">Defining Custom Block Nodes</a></p>
<br/>

# Applying Custom Formatting

In the previous guide we learned how to create custom block types that render chunks of text inside different containers. But Slate allows for more than just "blocks".

In this guide, we'll show you how to add custom formatting options, like **bold**, _italic_, `code` or ~~strikethrough~~.

So we start with our app from earlier:

```js
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
        onChange={state => this.onChange(state)}
        onKeyDown={e, state => this.onKeyDown(e, state)}
      />
    )
  }

  onChange(state) {
    this.setState({ state })
  }

  onKeyDown(event, state) {
    if (event.which != 192 || !event.metaKey) return
    const isCode = state.blocks.some(block => block.type == 'code')

    return state
      .transform()
      .setBlock(isCode ? 'paragraph' : 'code')
      .apply()
    }
  }

}
```

And now, we'll edit the `onKeyDown` handler to make it so that when you press **⌘-B**, it will add a "bold" mark to the currently selected text:

```js
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
        onChange={state => this.onChange(state)}
        onKeyDown={(e, state) => this.onKeyDown(e, state)}
      />
    )
  }

  onChange(state) {
    this.setState({ state })
  }

  onKeyDown(event, state) {
    if (!event.metaKey) return

    // Decide what to do based on the key code...
    switch (event.which) {
      // When "B" is pressed, add a "bold" mark to the text.
      case 66: {
        return state
          .transform()
          .addMark('bold')
          .apply()
      }
      // When "`" is pressed, keep our existing code block logic.
      case 192: {
        const isCode = state.blocks.some(block => block.type == 'code')
        return state
          .transform()
          .setBlock(isCode ? 'paragraph' : 'code')
          .apply()
      }
    }
  }

}
```

Okay, so we've got the hotkey handler setup... but! If you happen to now try selecting text and hitting **⌘-B**, you'll get an error in your console. That's because we haven't told Slate how to render a "bold" mark.

For every mark type you want to add to your schema, you need to give Slate a "renderer" for that mark, just like nodes. Except unlike nodes, mark renderers are just simple objects of styles that will be passed directly to React's `style=` property.

So let's define our `bold` mark:

```js
// Define a set of styles that make text bold.
const BOLD_MARK = {
  fontWeight: 'bold'
}
```

Pretty simple, right?

And now, let's tell Slate about that mark. To do that, we'll need to pass in a `renderMark` function to the `Editor`, which it will call with any mark it finds. And when it calls it with a bold mark, we'll return our `BOLD_MARK` styles. Like so:

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

  // Add the `renderMark` handler to the editor.
  render() {
    return (
      <Editor
        state={this.state.state}
        renderMark={mark => this.renderMark(mark)}
        onChange={state => this.onChange(state)}
        onKeyDown={(e, state) => this.onKeyDown(e, state)}
      />
    )
  }

  // Define a mark rendering function that knows about "bold" marks.
  renderMark(mark) {
    if (mark.type == 'bold') return BOLD_MARK
  }

  onChange(state) {
    this.setState({ state })
  }

  onKeyDown(event, state) {
    if (!event.metaKey) return

    switch (event.which) {
      case 66: {
        return state
          .transform()
          .toggleMark('bold')
          .apply()
      }
      case 192: {
        const isCode = state.blocks.some(block => block.type == 'code')
        return state
          .transform()
          .setBlock(isCode ? 'paragraph' : 'code')
          .apply()
      }
    }
  }

}
```

Now, if you try selecting a piece of text and hitting **⌘-B** you should see it turn bold! Magic!

<br/>
<p align="center"><strong>Next:</strong><br/><a href="./using-plugins.md">Using Plugins</a></p>
<br/>
