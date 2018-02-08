# Installing Slate

Slate is a monorepo divided up into multi npm packages, so to install it you do:

```
npm install slate slate-react
```

You'll also need to be sure to install Slate's peer dependencies:

```
npm install react react-dom immutable
```

_Note, if you'd rather use a pre-bundled version of Slate, you can `npm install slate` and retrieve the bundled `dist/slate.js` file! Check out the [Using the Bundled Source](./using-the-bundled-source.md) guide for more information._

Once you've installed Slate, you'll need to import it.

Slate exposes a set of modules that you'll use to build your editor. The most important of which is an `Editor` component.

```js
// Import the Slate editor.
import { Editor } from 'slate-react'
```

In addition to rendering the editor, you need to give Slate a "initial value" to render as content. We'll use the `Value` model that ships with Slate to create a new initial value that just contains a single paragraph block with some text in it:

```js
// Import the `Value` model.
import { Editor } from 'slate-react'
import { Value } from 'slate'

// Create our initial value...
const initialValue = Value.fromJSON({
  document: {
    nodes: [
      {
        object: 'block',
        type: 'paragraph',
        nodes: [
          {
            object: 'text',
            leaves: [
              {
                text: 'A line of text in a paragraph.',
              },
            ],
          },
        ],
      },
    ],
  },
})
```

And now that we've our initial value, we define our `App` and pass it into Slate's `Editor` component, like so:

```js
// Import React!
import React from 'react'
import { Editor } from 'slate-react'
import { Value } from 'slate'

const initialValue = Value.fromJSON({
  document: {
    nodes: [
      {
        object: 'block',
        type: 'paragraph',
        nodes: [
          {
            object: 'text',
            leaves: [
              {
                text: 'A line of text in a paragraph.',
              },
            ],
          },
        ],
      },
    ],
  },
})

// Define our app...
class App extends React.Component {
  // Set the initial value when the app is first constructed.
  state = {
    value: initialValue,
  }

  // On change, update the app's React state with the new editor value.
  onChange = ({ value }) => {
    this.setState({ value })
  }

  // Render the editor.
  render() {
    return <Editor value={this.state.value} onChange={this.onChange} />
  }
}
```

You'll notice that the `onChange` handler passed into the `Editor` component just updates the app's state with the newest changed value. That way, when it re-renders the editor, the new value is reflected with your changes.

And that's it!

That's the most basic example of Slate. If you render that onto the page, you should see a paragraph with the text `A line of text in a paragraph.`. And when you type, you should see the text change!

<br/>
<p align="center"><strong>Next:</strong><br/><a href="./adding-event-handlers.md">Adding Event Handlers</a></p>
<br/>
