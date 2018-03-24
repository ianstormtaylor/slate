# Applying Custom Formatting

**Previous:**  
[Defining Custom Block Nodes](defining-custom-block-nodes.md)  
  


## Applying Custom Formatting

In the previous guide we learned how to create custom block types that render chunks of text inside different containers. But Slate allows for more than just "blocks".

In this guide, we'll show you how to add custom formatting options, like **bold**, _italic_, `code` or ~~strikethrough~~.

So we start with our app from earlier:

```javascript
class App extends React.Component {
  state = {
    value: initialValue,
  }

  onChange = ({ value }) => {
    this.setState({ value })
  }

  onKeyDown = (event, change) => {
    if (event.key != '`' || !event.ctrlKey) return
    event.preventDefault()
    const isCode = change.value.blocks.some(block => block.type == 'code')

    change.setBlocks(isCode ? 'paragraph' : 'code')
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

  renderNode = props => {
    switch (props.node.type) {
      case 'code':
        return <CodeNode {...props} />
    }
  }
}
```

And now, we'll edit the `onKeyDown` handler to make it so that when you press `control-B`, it will add a "bold" mark to the currently selected text:

```javascript
class App extends React.Component {
  state = {
    value: initialValue,
  }

  onChange = ({ value }) => {
    this.setState({ value })
  }

  onKeyDown = (event, change) => {
    if (!event.ctrlKey) return

    // Decide what to do based on the key code...
    switch (event.key) {
      // When "B" is pressed, add a "bold" mark to the text.
      case 'b': {
        event.preventDefault()
        change.addMark('bold')
        return true
      }
      // When "`" is pressed, keep our existing code block logic.
      case '`': {
        const isCode = change.value.blocks.some(block => block.type == 'code')
        event.preventDefault()
        change.setBlocks(isCode ? 'paragraph' : 'code')
        return true
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

  renderNode = props => {
    switch (props.node.type) {
      case 'code':
        return <CodeNode {...props} />
    }
  }
}
```

Okay, so we've got the hotkey handler setup... but! If you happen to now try selecting text and hitting `control-B`, you won't notice any change. That's because we haven't told Slate how to render a "bold" mark.

For every mark type you want to add to your schema, you need to give Slate a "renderer" for that mark, just like nodes. So let's define our `bold` mark:

```javascript
// Define a React component to render bold text with.
function BoldMark(props) {
  return <strong>{props.children}</strong>
}
```

Pretty simple, right?

And now, let's tell Slate about that mark. To do that, we'll pass in the `renderMark` prop to our editor. Also, let's allow our mark to be toggled by changing `addMark` to `toggleMark`.

```javascript
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

  onKeyDown = (event, change) => {
    if (!event.ctrlKey) return

    switch (event.key) {
      case 'b': {
        event.preventDefault()
        change.toggleMark('bold')
        return true
      }
      case '`': {
        const isCode = change.value.blocks.some(block => block.type == 'code')
        event.preventDefault()
        change.setBlocks(isCode ? 'paragraph' : 'code')
        return true
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

  renderNode = props => {
    switch (props.node.type) {
      case 'code':
        return <CodeNode {...props} />
    }
  }

  // Add a `renderMark` method to render marks.
  renderMark = props => {
    switch (props.mark.type) {
      case 'bold':
        return <BoldMark {...props} />
    }
  }
}
```

Now, if you try selecting a piece of text and hitting `control-B` you should see it turn bold! Magic!

**Next:**  
[Using Plugins](using-plugins.md)  
  


