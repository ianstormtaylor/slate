<br/>
<p align="center"><strong>Previous:</strong><br/><a href="./defining-custom-block-nodes.md">Defining Custom Block Nodes</a></p>
<br/>

# Applying Custom Formatting

In the previous guide we learned how to create custom block types that render chunks of text inside different containers. But Slate allows for more than just "blocks".

In this guide, we'll show you how to add custom formatting options, like **bold**, _italic_, `code` or ~~strikethrough~~.

So we start with our app from earlier:

```js
class App extends React.Component {
  state = {
    value: initialValue,
  }

  onChange = ({ value }) => {
    this.setState({ value })
  }

  onKeyDown = (event, editor, next) => {
    if (event.key != '`' || !event.ctrlKey) return next()
    event.preventDefault()
    const isCode = editor.value.blocks.some(block => block.type == 'code')

    editor.setBlocks(isCode ? 'paragraph' : 'code')
    return true
  }

  render() {
    return (
      <Editor
        value={this.state.value}
        onChange={this.onChange}
        onKeyDown={this.onKeyDown}
        renderNode={this.renderNode}
      />
    )
  }

  renderNode = (props, editor, next) => {
    switch (props.node.type) {
      case 'code':
        return <CodeNode {...props} />
      default:
        return next()
    }
  }
}
```

And now, we'll edit the `onKeyDown` handler to make it so that when you press `control-B`, it will add a "bold" mark to the currently selected text:

```js
class App extends React.Component {
  state = {
    value: initialValue,
  }

  onChange = ({ value }) => {
    this.setState({ value })
  }

  onKeyDown = (event, editor, next) => {
    if (!event.ctrlKey) return next()

    // Decide what to do based on the key code...
    switch (event.key) {
      // When "B" is pressed, add a "bold" mark to the text.
      case 'b': {
        event.preventDefault()
        editor.addMark('bold')
      }
      // When "`" is pressed, keep our existing code block logic.
      case '`': {
        const isCode = editor.value.blocks.some(block => block.type == 'code')
        event.preventDefault()
        editor.setBlocks(isCode ? 'paragraph' : 'code')
      }
      // Otherwise, let other plugins handle it.
      default: {
        return next()
      }
    }
  }

  render() {
    return (
      <Editor
        value={this.state.value}
        onChange={this.onChange}
        onKeyDown={this.onKeyDown}
        renderNode={this.renderNode}
      />
    )
  }

  renderNode = (props, editor, next) => {
    switch (props.node.type) {
      case 'code':
        return <CodeNode {...props} />
      default:
        return next()
    }
  }
}
```

Okay, so we've got the hotkey handler setup... but! If you happen to now try selecting text and hitting `control-B`, you won't notice any change. That's because we haven't told Slate how to render a "bold" mark.

For every mark type you want to add to your schema, you need to give Slate a "renderer" for that mark, just like nodes. So let's define our `bold` mark:

```js
// Define a React component to render bold text with.
function BoldMark(props) {
  return <strong>{props.children}</strong>
}
```

Pretty simple, right?

And now, let's tell Slate about that mark. To do that, we'll pass in the `renderMark` prop to our editor. Also, let's allow our mark to be toggled by changing `addMark` to `toggleMark`.

```js
function BoldMark(props) {
  return <strong>{props.children}</strong>
}

class App extends React.Component {
  state = {
    value: initialValue,
  }

  onChange = ({ value }) => {
    this.setState({ value })
  }

  onKeyDown = (event, editor, next) => {
    if (!event.ctrlKey) return next()

    switch (event.key) {
      case 'b': {
        event.preventDefault()
        editor.toggleMark('bold')
      }
      case '`': {
        const isCode = editor.value.blocks.some(block => block.type == 'code')
        event.preventDefault()
        editor.setBlocks(isCode ? 'paragraph' : 'code')
      }
      default: {
        return next()
      }
    }
  }

  render() {
    return (
      <Editor
        value={this.state.value}
        onChange={this.onChange}
        onKeyDown={this.onKeyDown}
        renderNode={this.renderNode}
        // Add the `renderMark` prop...
        renderMark={this.renderMark}
      />
    )
  }

  renderNode = (props, editor, next) => {
    switch (props.node.type) {
      case 'code':
        return <CodeNode {...props} />
      default:
        return next()
    }
  }

  // Add a `renderMark` method to render marks.
  renderMark = (props, editor, next) => {
    switch (props.mark.type) {
      case 'bold':
        return <BoldMark {...props} />
      default:
        return next()
    }
  }
}
```

Now, if you try selecting a piece of text and hitting `control-B` you should see it turn bold! Magic!

<br/>
<p align="center"><strong>Next:</strong><br/><a href="./using-plugins.md">Using Plugins</a></p>
<br/>
