
<br/>
<p align="center"><strong>Previous:</strong><br/><a href="./using-plugins.md">Using Plugins</a></p>
<br/>

# Saving to a Database

Now that you've learned the basics of how to add functionality to the Slate editor, you might be wondering how you'd go about saving the content you've been editing, such that you can come back to your app later and have it load.

In this guide, we'll show you how to add logic to save your Slate content to a database for storage and retrieval later.

Let's start with a basic, plain text rendering editor:

```js
import { Editor, Plain } from 'slate'

const initialState = Plain.deserialize('The initial state string!')

class App extends React.Component {

  state = {
    state: initialState
  }

  render() {
    return (
      <Editor
        state={this.state.state}
        onChange={state => this.onChange(state)}
      />
    )
  }

  onChange(state) {
    this.setState({ state })
  }

}
```

That will render a basic Slate editor on your page, and when you type things will change. But if you refresh the page, everything will be reverted back to its original stage.

What we need to do is save the changes you make somewhere. For this example, we'll just be using [Local Storage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage), but it will give you an idea for where you'd need to add your own database hooks.

So, in our `onChange` handler, we need to save the `state`. But the `state` argument that `onChange` receives is an immutable object, so we can't just save it as-is. We need to serialize it to a format we understand first.

In this case, we're already using the [`Plain`](../reference/serializers/plain.md) serializer to create our intial state, so let's use it to serialize our saved state as well, like so:

```js
const initialState = Plain.deserialize('The initial state string!')

class App extends React.Component {

  state = {
    state: initialState
  }

  render() {
    return (
      <Editor
        state={this.state.state}
        onChange={state => this.onChange(state)}
      />
    )
  }

  onChange(state) {
    this.setState({ state })

    // Save the state to Local Storage.
    const string = Plain.serialize(state)
    localStorage.setItem('content', string)
  }

}
```

Now whenever you edit the page, if you look in Local Storage, you should see the content string changing.

But... if you refresh the page, everything is still reset. That's because we need to make sure the initial state is pulled from that same Local Storage location, like so:

```js
// Update the initial value to be pulled from Local Storage.
const initialState = (
  Plain.deserialize(localStorage.getItem('content')) ||
  'The initial state string!'
)

class App extends React.Component {

  state = {
    state: initialState
  }

  render() {
    return (
      <Editor
        state={this.state.state}
        onChange={state => this.onChange(state)}
      />
    )
  }

  onChange(state) {
    this.setState({ state })

    const string = Plain.serialize(state)
    localStorage.setItem('content', string)
  }

}
```

Now you should be able to save changes across refreshes!

However, if you inspect the change handler, you'll notice that it's actually saving the Local Storage value on _every_ change to the editor, even when only the selection changes! This is because `onChange` is called for _every_ change. For Local Storage this doesn't really matter, but if you're saving things to a database via HTTP request this would result in a lot of unnecessary requests.

Instead of using `onChange`, Slate's editor also accepts an `onDocumentChange` convenience handler that you can use to isolate saving logic to only happen when the document itself has changed, like so:

```js
const initialState = (
  Plain.deserialize(localStorage.getItem('content')) ||
  'The initial state string!'
)

class App extends React.Component {

  state = {
    state: initialState
  }

  render() {
    // Add the `onDocumentChange` handler to the editor.
    return (
      <Editor
        state={this.state.state}
        onChange={state => this.onChange(state)}
        onDocumentChange={(document, state) => this.onDocumentChange(document, state)}
      />
    )
  }

  onChange(state) {
    this.setState({ state })
  }

  // Pull the saving logic out into the `onDocumentChange` handler.
  onDocumentChange(document, state) {
    const string = Plain.serialize(state)
    localStorage.setItem('content', string)
  }

}
```

Now you're content will be saved only when the content itself changes!

Success. But we're only saving plain text strings here. If you're working with rich text, you'll need to serialize the `state` object differently. The easiest option is to just replace calls to `Plain` with `Raw`:


```js
const initialState = (
  Raw.deserialize(localStorage.getItem('content')) ||
  {
    nodes: [
      {
        kind: 'block',
        type: 'paragraph'
      }
    ]
  }
)

class App extends React.Component {

  state = {
    state: initialState
  }

  render() {
    return (
      <Editor
        state={this.state.state}
        onChange={state => this.onChange(state)}
        onDocumentChange={(document, state) => this.onDocumentChange(document, state)}
      />
    )
  }

  onChange(state) {
    this.setState({ state })
  }

  onDocumentChange(document, state) {
      // Switch to using the Raw serializer.
    localStorage.setItem('content', Raw.serialize(state))
  }

}
```

That works! Now you can preserve any formatting that the user added.

However, sometimes you may not want to use the raw JSON representation that Slate understands, and you may want something slightly more standardized, like good old fashioned HTML. In that case, check out the next guide...


<br/>
<p align="center"><strong>Next:</strong><br/><a href="./saving-and-loading-html-content.md">Saving and Loading HTML Content</a></p>
<br/>
