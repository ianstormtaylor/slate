
# Installing Slate

Slate is an npm module, so to install it you do:

```
npm install slate
```

You'll also need to be sure to install Slate's peer dependencies for React:

```
npm install react react-dom
```

Once you've install it, you'll need to import it.

Slate exposes a set of modules that you'll use to build your editor. The most important of which is an `Editor` component.

```js
// Import the Slate editor.
import { Editor } from 'slate'
```

In addition to loading the editor, you need to give Slate a "initial state" to work with. Without it, Slate knows nothing about the type of content you want to create, since it has no knowledge of your schema.

To keep things simple, we'll use the `Raw` serializer that ships with Slate to create a new initial state that just contains a single paragraph block with some text in it:

```js
// Import the "raw" serializer that ships with Slate.
import { Editor, Raw } from 'slate'

// Create our initial state...
const initialState = Raw.deserialize([
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
])
```

And now that we've our initial state, we define our `App` and pass it into Slate's `Editor` component, like so:

```js
// Import React!
import React from 'react'
import { Editor, Raw } from 'state'

const initialState = Raw.deserialize([
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
])

// Define our app...
class App extends React.Component {

  constructor(props) {
    super(props)

    // Set the initial state when the app is first constructed.
    this.state = {
      state: initialState
    }
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
    // Update the app's React state with the new editor state.
    this.setState({ state })
  }

}
```

You'll notice that the `onChange` handler passed into the `Editor` component just updates the app's state with the newest editor state. That way, when it re-renders the editor, the new state is reflected with your changes.

And that's it! 

That's the most basic example of Slate. If you render that onto the page, you should see a paragraph with the text `A line of text in a paragraph.`. And when you type, you should see the text change!

<br/>
<p align="center"><strong>Next:</strong><br/><a href="./adding-event-handlers.md">Adding Event Handlers</a></p>
<br/>




















