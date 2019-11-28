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

Next up is to render a `<Slate>` context provider.

The provider component keeps track of your Slate editor, it's plugins, it's default value, and any changes that occur. It **must** be rendered above any `<Editable>` components. But it can also provide the editor state to other components like toolbars, menus, etc. using the `useSlate` hook.

```jsx
const App = () => {
  const editor = useMemo(() => withReact(createEditor()), [])
  // Render the Slate editor context.
  return <Slate editor={editor} />
}
```

You can think of the `<Slate>` component as provided an "un-controlled" editor context to every component underneath it.

This is a slightly different mental model than things like `<input>` or `<textarea>`, because rich-text documents are more complex. You'll often want to include toolbars, or live previews, or other complex components next to your editable content.

By having a shared context, those other components can execute commands, query the editor's state, etc.

Okay, so the next step is to render the `<Editable>` component itself:

```jsx
const App = () => {
  const editor = useMemo(() => withReact(createEditor()), [])
  return (
    // Add the editable component inside the context.
    <Slate editor={editor}>
      <Editable />
    </Slate>
  )
}
```

The `<Editable>` component acts like `contenteditable`. Anywhere you render it will render an editable rich-text document for the nearest editor context.

There's only one last step. So far we haven't defined what the default value of the editor is, so it's empty. Let's fix that by defining an initial value.

The value is just plain JSON. Here's one contains a single paragraph block with some text in it:

```js
// Create our default value...
const defaultValue = [
  {
    type: 'paragraph',
    children: [
      {
        text: 'A line of text in a paragraph.',
        marks: [],
      },
    ],
  },
]

const App = () => {
  const editor = useMemo(() => withReact(createEditor()), [])
  return (
    // Add the default value as a prop to the editor context.
    <Slate editor={editor} defaultValue={defaultValue}>
      <Editable />
    </Slate>
  )
}
```

There you have it!

That's the most basic example of Slate. If you render that onto the page, you should see a paragraph with the text `A line of text in a paragraph.`. And when you type, you should see the text change!

You'll notice that there is no `onChange` handler defined. That's because the `<Slate>` context acts like an **un-controlled** component, with the changes automatically being propagated to any context consumers. However, just like with un-controlled components you can attach an `onChange` prop to listen for changes. We'll cover that later.
