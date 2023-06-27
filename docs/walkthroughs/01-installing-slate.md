# Installing Slate

Slate is a monorepo divided up into multiple npm packages, so to install it you do:

```text
yarn add slate slate-react
```

You'll also need to be sure to install Slate's peer dependencies:

```text
yarn add react react-dom
```

_Note, if you'd rather use a pre-bundled version of Slate, you can `yarn add slate` and retrieve the bundled `dist/slate.js` file! Check out the_ [_Using the Bundled Source_](xx-using-the-bundled-source.md) _guide for more information._

Once you've installed Slate, you'll need to import it.

```jsx
// Import React dependencies.
import React, { useState } from 'react'
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

The next step is to create a new `Editor` object. We want the editor to be stable across renders, so we use the `useState` hook [without a setter](https://github.com/ianstormtaylor/slate/pull/3925#issuecomment-781179930):

```jsx
const App = () => {
  // Create a Slate editor object that won't change across renders.
  const [editor] = useState(() => withReact(createEditor()))
  return null
}
```

Of course we haven't rendered anything, so you won't see any changes.

> If you are using TypeScript, you will also need to extend the `Editor` with `ReactEditor` and add annotations as per the documentation on [TypeScript](../concepts/13-typescript.md). The example below also includes the custom types required for the rest of this example.

```typescript
// TypeScript users only add this code
import { BaseEditor, Descendant } from 'slate'
import { ReactEditor } from 'slate-react'

type CustomElement = { type: 'paragraph'; children: CustomText[] }
type CustomText = { text: string }

declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor
    Element: CustomElement
    Text: CustomText
  }
}
```

Next up is to render a `<Slate>` context provider.

The provider component keeps track of your Slate editor, its plugins, its value, its selection, and any changes that occur. It **must** be rendered above any `<Editable>` components. But it can also provide the editor state to other components like toolbars, menus, etc. using the `useSlate` hook.

```jsx
const initialValue = [
  {
    type: 'paragraph',
    children: [{ text: 'A line of text in a paragraph.' }],
  },
]

const App = () => {
  const [editor] = useState(() => withReact(createEditor()))
  // Render the Slate context.
  return <Slate editor={editor} initialValue={initialValue} />
}
```

You can think of the `<Slate>` component as providing a context to every component underneath it.

> Slate Provider's "value" prop is only used as initial state for editor.children. If your code relies on replacing editor.children you should do so by replacing it directly instead of relying on the "value" prop to do this for you. See [Slate PR 4540](https://github.com/ianstormtaylor/slate/pull/4540) for a more in-depth discussion.

This is a slightly different mental model than things like `<input>` or `<textarea>`, because richtext documents are more complex. You'll often want to include toolbars, or live previews, or other complex components next to your editable content.

By having a shared context, those other components can execute commands, query the editor's state, etc.

The next step is to render the `<Editable>` component itself. The component acts like `contenteditable`; anywhere you render it will render an editable richtext document for the nearest editor context.

```jsx
const initialValue = [
  {
    type: 'paragraph',
    children: [{ text: 'A line of text in a paragraph.' }],
  },
]

const App = () => {
  const [editor] = useState(() => withReact(createEditor()))
  return (
    // Add the editable component inside the context.
    <Slate editor={editor} initialValue={initialValue}>
      <Editable />
    </Slate>
  )
}
```

There you have it!

That's the most basic example of Slate. If you render that onto the page, you should see a paragraph with the text `A line of text in a paragraph.` And when you type, you should see the text change!
