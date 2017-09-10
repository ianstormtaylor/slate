
<br/>
<p align="center"><strong>Previous:</strong><br/><a href="./using-plugins.md">Using Plugins</a></p>
<br/>

# Saving to a Database

Now that you've learned the basics of how to add functionality to the Slate editor, you might be wondering how you'd go about saving the content you've been editing, such that you can come back to your app later and have it load.

In this guide, we'll show you how to add logic to save your Slate content to a database for storage and retrieval later.

Let's start with a basic editor:

```js
import { Editor, State } from 'slate'

const initialState = State.fromJSON({
  document: {
    nodes: [
      {
        kind: 'block',
        type: 'paragraph',
        nodes: [
          {
            kind: 'text',
            ranges: [
              {
                text: 'A line of text in a paragraph.'
              }
            ]
          }
        ]
      }
    ]
  }
})

class App extends React.Component {

  state = {
    state: initialState
  }

  onChange = ({ state }) => {
    this.setState({ state })
  }

  render() {
    return (
      <Editor
        state={this.state.state}
        onChange={this.onChange}
      />
    )
  }

}
```

That will render a basic Slate editor on your page, and when you type things will change. But if you refresh the page, everything will be reverted back to its original state—nothing saves!

What we need to do is save the changes you make somewhere. For this example, we'll just be using [Local Storage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage), but it will give you an idea for where you'd need to add your own database hooks.

So, in our `onChange` handler, we need to save the `state`. But the `state` argument that `onChange` receives is an immutable object, so we can't just save it as-is. We need to serialize it to a format we understand first, like JSON!

```js
const initialState = State.fromJSON({
  document: {
    nodes: [
      {
        kind: 'block',
        type: 'paragraph',
        nodes: [
          {
            kind: 'text',
            ranges: [
              {
                text: 'A line of text in a paragraph.'
              }
            ]
          }
        ]
      }
    ]
  }
})

class App extends React.Component {

  state = {
    state: initialState
  }

  onChange = ({ state }) => {
    // Save the state to Local Storage.
    const content = JSON.stringify(state.toJSON())
    localStorage.setItem('content', content)

    this.setState({ state })
  }

  render() {
    return (
      <Editor
        state={this.state.state}
        onChange={this.onChange}
      />
    )
  }

}
```

Now whenever you edit the page, if you look in Local Storage, you should see the `content` value changing.

But... if you refresh the page, everything is still reset. That's because we need to make sure the initial state is pulled from that same Local Storage location, like so:

```js
// Update the initial content to be pulled from Local Storage if it exists.
const existingState = JSON.parse(localStorage.getItem('content'))
const initialState = State.fromJSON(existingState || {
  document: {
    nodes: [
      {
        kind: 'block',
        type: 'paragraph',
        nodes: [
          {
            kind: 'text',
            ranges: [
              {
                text: 'A line of text in a paragraph.'
              }
            ]
          }
        ]
      }
    ]
  }
})

class App extends React.Component {

  state = {
    state: initialState
  }

  onChange = ({ state }) => {
    const content = JSON.stringify(state.toJSON())
    localStorage.setItem('content', content)

    this.setState({ state })
  }

  render() {
    return (
      <Editor
        state={this.state.state}
        onChange={this.onChange}
      />
    )
  }

}
```

Now you should be able to save changes across refreshes!

However, if you inspect the change handler, you'll notice that it's actually saving the Local Storage value on _every_ change to the editor, even when only the selection changes! This is because `onChange` is called for _every_ change. For Local Storage this doesn't really matter, but if you're saving things to a database via HTTP request this would result in a lot of unnecessary requests. You can fix this by checking against the previous `document` value.

```js
const existingState = JSON.parse(localStorage.getItem('content'))
const initialState = State.fromJSON(existingState || {
  document: {
    nodes: [
      {
        kind: 'block',
        type: 'paragraph',
        nodes: [
          {
            kind: 'text',
            ranges: [
              {
                text: 'A line of text in a paragraph.'
              }
            ]
          }
        ]
      }
    ]
  }
})

class App extends React.Component {

  state = {
    state: initialState
  }

  onChange = ({ state }) => {
    // Check to see if the document has changed before saving.
    if (state.document != this.state.state.document) {
      const content = JSON.stringify(state.toJSON())
      localStorage.setItem('content', content)
    }

    this.setState({ state })
  }

  render() {
    return (
      <Editor
        state={this.state.state}
        onChange={this.onChange}
      />
    )
  }

}
```

Now you're content will be saved only when the content itself changes!

Success—you've got JSON in your database.

But what if you want something other than JSON? Well, you'd need to serialize your state differently. For example, if you want to save your content as plain text instead of JSON, you can use the `Plain` serializer that ships with Slate, like so:

```js
// Switch to using the Plain serializer.
import { Editor, Plain } from 'slate'

const existingState = localStorage.getItem('content')
const initialState = Plain.deserialize(existingState || 'A string of plain text.')

class App extends React.Component {

  state = {
    state: initialState
  }

  onChange = ({ state }) => {
    if (state.document != this.state.state.document) {
      const content = Plain.serialize(state)
      localStorage.setItem('content', content)
    }

    this.setState({ state })
  }

  render() {
    return (
      <Editor
        state={this.state.state}
        onChange={this.onChange}
      />
    )
  }

}
```

That works! Now you're working with plain text.

However, sometimes you may want something a bit more custom, and a bit more complex... good old fashioned HTML. In that case, check out the next guide...


<br/>
<p align="center"><strong>Next:</strong><br/><a href="./saving-and-loading-html-content.md">Saving and Loading HTML Content</a></p>
<br/>
