# Installing Slate

Slate is a monorepo divided up into multiple npm packages, so to install it you do:

```
yarn add slate slate-react
```

You'll also need to be sure to install Slate's peer dependencies:

```
yarn add react react-dom
```

_Note, if you'd rather use a pre-bundled version of Slate, you can `yarn add slate` and retrieve the bundled `dist/slate.js` file! Check out the [Using the Bundled Source](./XX-using-the-bundled-source.md) guide for more information._

Once you've installed Slate, you'll need to import it.


```jsx
// Import React dependencies.
import React, { useEffect, useMemo, useState } from "react";
// Import the Slate editor factory.
import { createEditor } from 'slate'

// Import the Slate components and React plugin.
import { Slate, Editable, withReact } from 'slate-react'
```

Before we use those imports, let's start with an empty `<App>` component:

```jsx
// Define our app...
const App = () => {
  return null
}
```

The next step is to create a new `Editor` object. We want the editor to be stable across renders, so we use the `useMemo` hook:

```jsx
const App = () => {
  // Create a Slate editor object that won't change across renders.
  const editor = useMemo(() => withReact(createEditor()), [])
  return null
}
```

Of course we haven't rendered anything, so you won't see any changes.

Next we want to create state for `value`:

```jsx
const App = () => {
  const editor = useMemo(() => withReact(createEditor()), [])

  // Keep track of state for the value of the editor.
  const [value, setValue] = useState([])
  return null
}
```

Next up is to render a `<Slate>` context provider.

The provider component keeps track of your Slate editor, its plugins, its value, its selection, and any changes that occur. It **must** be rendered above any `<Editable>` components. But it can also provide the editor state to other components like toolbars, menus, etc. using the `useSlate` hook.

```jsx
const App = () => {
  const editor = useMemo(() => withReact(createEditor()), [])
  const [value, setValue] = useState([])
  // Render the Slate context.
  return (
    <Slate editor={editor} value={value} onChange={value => setValue(value)} />
  )
}
```

You can think of the `<Slate>` component as providing a "controlled" context to every component underneath it.

This is a slightly different mental model than things like `<input>` or `<textarea>`, because richtext documents are more complex. You'll often want to include toolbars, or live previews, or other complex components next to your editable content.

By having a shared context, those other components can execute commands, query the editor's state, etc.

Okay, so the next step is to render the `<Editable>` component itself:

```jsx
const App = () => {
  const editor = useMemo(() => withReact(createEditor()), [])
  const [value, setValue] = useState([])
  return (
    // Add the editable component inside the context.
    <Slate editor={editor} value={value} onChange={value => setValue(value)}>
      <Editable />
    </Slate>
  )
}
```

The `<Editable>` component acts like `contenteditable`. Anywhere you render it will render an editable richtext document for the nearest editor context.

There's only one last step. So far we've been using an empty `[]` array as the initial value of the editor, so it has no content. Let's fix that by defining an initial value.

The value is just plain JSON. Here's one containing a single paragraph block with some text in it:

```jsx
const App = () => {
  const editor = useMemo(() => withReact(createEditor()), [])
  // Add the initial value when setting up our state.
  const [value, setValue] = useState([
    {
      type: 'paragraph',
      children: [{ text: 'A line of text in a paragraph.' }],
    },
  ])

  return (
    <Slate editor={editor} value={value} onChange={value => setValue(value)}>
      <Editable />
    </Slate>
  )
}
```

There you have it!

That's the most basic example of Slate. If you render that onto the page, you should see a paragraph with the text `A line of text in a paragraph.` And when you type, you should see the text change!
