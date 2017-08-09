
<br/>
<p align="center"><strong>Previous:</strong><br/><a href="./adding-event-handlers.md">Adding Event Handlers</a></p>
<br/>

# Defining Custom Block Nodes

In our previous example, we started with a paragraph, but we never actually told Slate anything about the `paragraph` block type. We just let it use its internal default renderer, which uses a plain old `<div>`.

But that's not all you can do. Slate lets you define any type of custom blocks you want, like block quotes, code blocks, list items, etc. 

We'll show you how. Let's start with our app from earlier:

```js
class App extends React.Component {

  state = {
    state: initialState
  }
  
  onChange = (state) => {
    this.setState({ state })
  }

  onKeyDown = (event, data, state) => {
    if (event.which != 55 || !event.shiftKey) return
      
    event.preventDefault()

    const newState = state
      .transform()
      .insertText('and')
      .apply()
    
    return newState
  }

  render() {
    return (
      <Editor
        state={this.state.state}
        onChange={this.onChange}
        onKeyDown={this.onKeyDown}
      />
    )
  }

}
```

Now let's add "code blocks" to our editor.

The problem is, code blocks won't just be rendered as a plain paragraph, they'll need to be rendered differently. To make that happen, we need to define a "renderer" for `code` nodes

Node renderers are just simple React components, like so:

```js
// Define a React component renderer for our code blocks.
function CodeNode(props) {
  return <pre {...props.attributes}><code>{props.children}</code></pre>
}
```

Pretty simple. 

See the `props.attributes` reference? Slate passes attributes that should be rendered on the top-most element of your blocks, so that you don't have to build them up yourself. You **must** mix the attributes into your component.

And see that `props.children` reference? Slate will automatically render all of the children of a block for you, and then pass them to you just like any other React component would, via `props.children`. That way you don't have to muck around with rendering the proper text nodes or anything like that. You **must** render the children as the lowest leaf in your component.

Now, let's add that renderer to our `Editor`:

```js
function CodeNode(props) {
  return <pre {...props.attributes}><code>{props.children}</code></pre>
}

class App extends React.Component {

  state = {
    state: initialState,
    // Add a "schema" to our app's state that we can pass to the Editor.
    schema: {
      nodes: {
        code: CodeNode
      }
    }
  }
  
  onChange = (state) => {
    this.setState({ state })
  }

  onKeyDown = (event, data, state) => {
    if (event.which != 55 || !event.shiftKey) return
      
    event.preventDefault()

    const newState = state
      .transform()
      .insertText('and')
      .apply()
    
    return newState
  }

  render() {
    return (
      // Pass in the `schema` property...
      <Editor
        schema={this.state.schema}
        state={this.state.state}
        onChange={this.onChange}
        onKeyDown={this.onKeyDown}
      />
    )
  }

}
```

Okay, but now we'll need a way for the user to actually turn a block into a code block. So let's change our `onKeyDown` function to add a `⌘-Alt-C` shortcut that does just that:

```js
function CodeNode(props) {
  return <pre {...props.attributes}><code>{props.children}</code></pre>
}

class App extends React.Component {

  state = {
    state: initialState,
    schema: {
      nodes: {
        code: CodeNode
      }
    }
  }
  
  onChange = (state) => {
    this.setState({ state })
  }

  onKeyDown = (event, data, state) => {
    // Return with no changes if it's not the "`" key with cmd/ctrl pressed.
    if (event.which != 67 || !event.metaKey || !event.altKey) return
    
    // Prevent the "`" from being inserted by default.
    event.preventDefault()

    // Otherwise, set the currently selected blocks type to "code".
    return state
      .transform()
      .setBlock('code')
      .apply()
  }

  render() {
    return (
      <Editor
        schema={this.state.schema}
        state={this.state.state}
        onChange={this.onChange}
        onKeyDown={this.onKeyDown}
      />
    )
  }

}
```

Now, if you press `⌘-Alt-C`, the block your cursor is in should turn into a code block! Magic!

But we forgot one thing. When you hit `⌘-Alt-C` again, it should change the code block back into a paragraph. To do that, we'll need to add a bit of logic to change the type we set based on whether any of the currently selected blocks are already a code block:

```js
function CodeNode(props) {
  return <pre {...props.attributes}><code>{props.children}</code></pre>
}

class App extends React.Component {

  state = {
    state: initialState,
    schema: {
      nodes: {
        code: CodeNode
      }
    }
  }
  
  onChange = (state) => {
    this.setState({ state })
  }

  onKeyDown = (event, data, state) => {
    if (event.which != 67 || !event.metaKey || !event.altKey) return
    
    event.preventDefault()

    // Determine whether any of the currently selected blocks are code blocks.
    const isCode = state.blocks.some(block => block.type == 'code')

    // Toggle the block type depending on `isCode`.
    return state
      .transform()
      .setBlock(isCode ? 'paragraph' : 'code')
      .apply()
    
  }

  render() {
    return (
      <Editor
        schema={this.state.schema}
        state={this.state.state}
        onChange={this.onChange}
        onKeyDown={this.onKeyDown}
      />
    )
  }

}
```

And there you have it! If you press `⌘-Alt-C` while inside a code block, it should turn back into a paragraph!

<br/>
<p align="center"><strong>Next:</strong><br/><a href="./applying-custom-formatting.md">Applying Custom Formatting</a></p>
<br/>
