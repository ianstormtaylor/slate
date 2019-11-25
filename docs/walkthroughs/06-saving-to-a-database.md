<br/>
<p align="center"><strong>Previous:</strong><br/><a href="./using-plugins.md">Using Plugins</a></p>
<br/>

# Saving to a Database

Now that you've learned the basics of how to add functionality to the Slate editor, you might be wondering how you'd go about saving the content you've been editing, such that you can come back to your app later and have it load.

In this guide, we'll show you how to add logic to save your Slate content to a database for storage and retrieval later.

Let's start with a basic editor:

```js
import React, { useState } from 'react'
import { createEditor } from 'slate'
import { Editable, withReact } from 'slate-react'

const initialValue = {
  selection: null,
  annotations: {},
  children: [
    {
      children: [
        {
          text: 'A line of text in a paragraph.',
          marks: [],
        },
      ],
    },
  ],
}

const App = () => {
  const editor = useMemo(() => withReact(createEditor()), [])
  const [value, setValue] = useState(initialValue)
  return (
    <Editable
      editor={editor}
      value={value}
      onChange={newValue => setValue(newValue)}
    />
  )
}
```

That will render a basic Slate editor on your page, and when you type things will change. But if you refresh the page, everything will be reverted back to its original value—nothing saves!

What we need to do is save the changes you make somewhere. For this example, we'll just be using [Local Storage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage), but it will give you an idea for where you'd need to add your own database hooks.

So, in our `onChange` handler, we need to save the `value`. But the `value` argument that `onChange` receives is a JSON object with stateful properties like `selection`, so we can't just save it as-is. We need to turn it into a string, and only store what we need—in this case `value.children`.

```js
const initialValue = {
  selection: null,
  annotations: {},
  children: [
    {
      children: [
        {
          text: 'A line of text in a paragraph.',
          marks: [],
        },
      ],
    },
  ],
}

const App = () => {
  const editor = useMemo(() => withReact(createEditor()), [])
  const [value, setValue] = useState(initialValue)
  return (
    <Editable
      editor={editor}
      value={value}
      onChange={newValue => {
        // Save the value to Local Storage.
        const { children } = value
        const content = JSON.stringify(children)
        localStorage.setItem('content', content)

        // Continue calling `setValue` so that the editor updates on screen.
        setValue(newValue)
      }}
    />
  )
}
```

Now whenever you edit the page, if you look in Local Storage, you should see the `content` value changing.

But... if you refresh the page, everything is still reset. That's because we need to make sure the initial value is pulled from that same Local Storage location, like so:

```js
// Update the initial content to be pulled from Local Storage if it exists.
const existingContent = JSON.parse(localStorage.getItem('content'))
const initialValue = {
  selection: null,
  annotations: {},
  children: existingContent || [
    {
      children: [
        {
          text: 'A line of text in a paragraph.',
          marks: [],
        },
      ],
    },
  ],
}

const App = () => {
  const editor = useMemo(() => withReact(createEditor()), [])
  const [value, setValue] = useState(initialValue)
  return (
    <Editable
      editor={editor}
      value={value}
      onChange={newValue => {
        const { children } = value
        const content = JSON.stringify(children)
        localStorage.setItem('content', content)
        setValue(newValue)
      }}
    />
  )
}
```

Now you should be able to save changes across refreshes!

However, if you inspect the change handler, you'll notice that it's actually saving the Local Storage value on _every_ change to the editor, even when only the selection changes! This is because `onChange` is called for _every_ change. For Local Storage, this doesn't really matter, but if you're saving things to a database via HTTP request, this would result in a lot of unnecessary requests. You can fix this by checking against the previous `document` value.

```js
const existingContent = JSON.parse(localStorage.getItem('content'))
const initialValue = {
  selection: null,
  annotations: {},
  children: existingContent || [
    {
      children: [
        {
          text: 'A line of text in a paragraph.',
          marks: [],
        },
      ],
    },
  ],
}

const App = () => {
  const editor = useMemo(() => withReact(createEditor()), [])
  const [value, setValue] = useState(initialValue)
  return (
    <Editable
      editor={editor}
      value={value}
      onChange={newValue => {
        // Check to see if the content has changed before saving.
        if (newValue.children !== value.children) {
          const { children } = value
          const content = JSON.stringify(children)
          localStorage.setItem('content', content)
        }

        setValue(newValue)
      }}
    />
  )
}
```

Now your content will be saved only when the content itself changes!

Success—you've got JSON in your database.

But what if you want something other than JSON? Well, you'd need to serialize your value differently. For example, if you want to save your content as plain text instead of JSON, we can write some logic to serialize and deserialize plain text values:

```js
// Import the `Node` utilities from Slate.
import { Node } from 'slate'

// Define a serializing function that takes a value object and returns a string.
const serialize = value => {
  return (
    value.children
      // Return the text content of each paragraph in the value's children.
      .map(n => Node.text(n))
      // Join them all with line breaks denoting paragraphs.
      .join('\n')
  )
}

// Define a deserializing function that takes a string and returns a value.
const deserialize = string => {
  // Return a value JSON object with children derived by splitting the string.
  return {
    selection: null,
    annotations: {},
    children: string.split('\n').map(line => {
      return {
        children: [{ text: line, marks: [] }],
      }
    }),
  }
}

// Use our deserializing function to read the data from Local Storage.
const existingContent = localStorage.getItem('content')
const initialValue = deserialize(existingContent || '')

const App = () => {
  const editor = useMemo(() => withReact(createEditor()), [])
  const [value, setValue] = useState(initialValue)
  return (
    <Editable
      editor={editor}
      value={value}
      onChange={newValue => {
        // Serialize the value and save the string value to Local Storage.
        const content = serialize(newValue)
        localStorage.setItem('content', content)
        setValue(newValue)
      }}
    />
  )
}
```

That works! Now you're working with plain text.

You can emulate this strategy for any format you like. You can serialize to HTML, to Markdown, or even to your own custom JSON format that is tailored to your use case.

> 🤖 Note that even though you _can_ serialize your content however you like, there are tradeoffs. The serialization process has a cost itself, and certain formats may be harder to work with than others. In general we recommend writing your own format only if your use case has a specific need for it. Otherwise, you're often better leaving the data in the format Slate uses.
