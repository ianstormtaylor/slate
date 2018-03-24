# Adding Event Handlers

**Previous:**  
[Installing Slate](installing-slate.md)  
  


## Adding Event Handlers

Okay, so you've got Slate installed and rendered on the page, and when you type in it, you can see the changes reflected. But you want to do more than just type a plaintext string.

What makes Slate great is how easy it is to customize. Just like other React components you're used to, Slate allows you to pass in handlers that are triggered on certain events. You've already seen on the `onChange` handler can be used to store the changed editor value, but let's try add something more...

We'll show you how to use the `onKeyDown` handler to change the editor's content when the user presses a button.

So we start with our app from earlier:

```javascript
class App extends React.Component {
  state = {
    value: initialValue,
  }

  onChange = ({ value }) => {
    this.setState({ value })
  }

  render() {
    return <Editor value={this.state.value} onChange={this.onChange} />
  }
}
```

And now we'll add an `onKeyDown` handler:

```javascript
class App extends React.Component {
  state = {
    value: initialValue,
  }

  onChange = ({ value }) => {
    this.setState({ value })
  }

  // Define a new handler which prints the key that was pressed.
  onKeyDown = (event, change) => {
    console.log(event.key)
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

Okay cool, so now when you press a key in the editor, you'll see the key's code printed to the console. Not very useful, but at least we know it's working.

Now we want to make it actually change the content. For the purposes of our example, let's say we want to make it so that whenever a user types `&` we actually add `and` to the content.

Our `onKeyDown` handler might look like this:

```javascript
class App extends React.Component {
  state = {
    value: initialValue,
  }

  onChange = ({ value }) => {
    this.setState({ value })
  }

  onKeyDown = (event, change) => {
    // Return with no changes if it's not the "&" key.
    if (event.key != '&') return

    // Prevent the ampersand character from being inserted.
    event.preventDefault()

    // Change the value by inserting "and" at the cursor's position.
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

With that added, try typing `&`, and you should see it automatically become `and` instead!

That gives you a sense for what you can do with Slate's event handlers. Each one will be called with the `event` object, and a `change` object that lets you perform changes to the editor's value. Simple!

**Next:**  
[Defining Custom Block Nodes](defining-custom-block-nodes.md)  
  


