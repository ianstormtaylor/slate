# Installing Slate

Slate is a monorepo divided up into multi npm packages, so to install it you do:

```
yarn add slate slate-react
```

You'll also need to be sure to install Slate's peer dependencies:

```
yarn add react react-dom
```

_Note, if you'd rather use a pre-bundled version of Slate, you can `yarn add slate` and retrieve the bundled `dist/slate.js` file! Check out the [Using the Bundled Source](./using-the-bundled-source.md) guide for more information._

Once you've installed Slate, you'll need to import it.

Slate exposes a set of modules that you'll use to build your editor. The most important of which are the `Editor` class and the `<Editable>` component.

```js
// Import the Slate editor factory.
import { createEditor } from 'slate'

// Import the Slate editable component and React plugin.
import { Editable, withReact } from 'slate-react'
```

The `<Editable>` component acts like `contenteditable`.

In addition to rendering the editable, you need to give Slate a "initial value" to render as content. That value is just plain JSON, and we'll set an initial one that contains a single paragraph block with some text in it:

```js
// Create our initial value...
const initialValue = {
  selection: null,
  annotations: {},
  children: [
    {
      type: 'paragraph',
      children: [
        {
          text: 'A line of text in a paragraph.',
          marks: [],
        },
      ],
    },
  ],
}
```

And now that we've created our initial value, we define our `<App>`, initialize a new `Editor` instance and pass it into Slate's `<Editable>` component, like so:

```js
import React, { useState, useMemo } from 'react'
import { createEditor } from 'slate'
import { Editable, withReact } from 'slate-react'

const initialValue = {
  selection: null,
  annotations: {},
  children: [
    {
      type: 'paragraph',
      children: [
        {
          text: 'A line of text in a paragraph.',
          marks: [],
        },
      ],
    },
  ],
}

// Define our app...
const App = () => {
  // Set the initial value when the app is first constructed.
  const [value, setValue] = useState(initialValue)

  // Create a Slate editor object that won't change across renders.
  const editor = useMemo(() => withReact(createEditor()), [])

  // Render the editable component.
  return (
    <Editable
      editor={editor}
      value={value}
      onChange={newValue => setValue(newValue)}
    />
  )
}
```

You'll notice that the `onChange` handler passed into the `<Editable>` component just updates the app's state with the newest changed value. That way, when it re-renders the editor, the new value is reflected with your changes.

And that's it!

That's the most basic example of Slate. If you render that onto the page, you should see a paragraph with the text `A line of text in a paragraph.`. And when you type, you should see the text change!
