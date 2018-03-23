# Defining Custom Block Nodes

**Previous:**  
[Adding Event Handlers](adding-event-handlers.md)  
  


## Defining Custom Block Nodes

In our previous example, we started with a paragraph, but we never actually told Slate anything about the `paragraph` block type. We just let it use its internal default renderer, which uses a plain old `<div>`.

But that's not all you can do. Slate lets you define any type of custom blocks you want, like block quotes, code blocks, list items, etc.

We'll show you how. Let's start with our app from earlier:

```javascript
class App extends React.Component {
  state = {
    value: initialValue,
  }

  onChange = ({ value }) => {
    this.setState({ value })
  }

  onKeyDown = (event, change) => {
    if (event.key != '&') return
    event.preventDefault()
    change.insertText('and')
    return true
  }

  render() {
    return (
      <Editor
        value={this.state.value}
        onChange={this.onChange}
        onKeyDown={this.onKeyDown}
      />
    )
  }
}
```

Now let's add "code blocks" to our editor.

The problem is, code blocks won't just be rendered as a plain paragraph, they'll need to be rendered differently. To make that happen, we need to define a "renderer" for `code` nodes.

Node renderers are just simple React components, like so:

```javascript
// Define a React component renderer for our code blocks.
function CodeNode(props) {
  return (
    <pre {...props.attributes}>
      <code>{props.children}</code>
    </pre>
  )
}
```

Pretty simple.

See the `props.attributes` reference? Slate passes attributes that should be rendered on the top-most element of your blocks, so that you don't have to build them up yourself. You **must** mix the attributes into your component.

And see that `props.children` reference? Slate will automatically render all of the children of a block for you, and then pass them to you just like any other React component would, via `props.children`. That way you don't have to muck around with rendering the proper text nodes or anything like that. You **must** render the children as the lowest leaf in your component.

Now, let's add that renderer to our `Editor`:

```javascript
function CodeNode(props) {
  return (
    <pre {...props.attributes}>
      <code>{props.children}</code>
    </pre>
  )
}

class App extends React.Component {
  state = {
    value: initialValue,
  }

  onChange = ({ value }) => {
    this.setState({ value })
  }

  onKeyDown = (event, change) => {
    if (event.key != '&') return
    event.preventDefault()
    change.insertText('and')
    return true
  }

  render() {
    return (
      // Pass in the `renderNode` prop...
      <Editor
        value={this.state.value}
        onChange={this.onChange}
        onKeyDown={this.onKeyDown}
        renderNode={this.renderNode}
      />
    )
  }

  // Add a `renderNode` method to render a `CodeNode` for code blocks.
  renderNode = props => {
    switch (props.node.type) {
      case 'code':
        return <CodeNode {...props} />
    }
  }
}
```

Okay, but now we'll need a way for the user to actually turn a block into a code block. So let's change our `onKeyDown` function to add a \`control-\`\` shortcut that does just that:

```javascript
function CodeNode(props) {
  return (
    <pre {...props.attributes}>
      <code>{props.children}</code>
    </pre>
  )
}

class App extends React.Component {
  state = {
    value: initialValue,
  }

  onChange = ({ value }) => {
    this.setState({ value })
  }

  onKeyDown = (event, change) => {
    // Return with no changes if it's not the "`" key with ctrl pressed.
    if (event.key != '`' || !event.ctrlKey) return

    // Prevent the "`" from being inserted by default.
    event.preventDefault()

    // Otherwise, set the currently selected blocks type to "code".
    change.setBlocks('code')
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

Now, if you press \`control-\`\` the block your cursor is in should turn into a code block! Magic!

_Note: The Edge browser does not currently support _`control-...`_ key events \(see _[_issue_](https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/742263/)_\), so this example won't work on it._

But we forgot one thing. When you hit \`control-\`\` again, it should change the code block back into a paragraph. To do that, we'll need to add a bit of logic to change the type we set based on whether any of the currently selected blocks are already a code block:

```javascript
function CodeNode(props) {
  return (
    <pre {...props.attributes}>
      <code>{props.children}</code>
    </pre>
  )
}

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

    // Determine whether any of the currently selected blocks are code blocks.
    const isCode = change.value.blocks.some(block => block.type == 'code')

    // Toggle the block type depending on `isCode`.
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

And there you have it! If you press \`control-\`\` while inside a code block, it should turn back into a paragraph!

**Next:**  
[Applying Custom Formatting](applying-custom-formatting.md)  
  


