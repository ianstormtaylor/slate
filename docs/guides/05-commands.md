# Commands

While editing rich-text content, your users will be doing things like inserting text, deleteing text, splitting paragraphs, adding marks, etc. These edits are expressed using two concepts: commands and operations.

Commands are the high-level actions that represent a specific intent of the user. Their interface is simply:

```ts
interface Command {
  type: string
  [key: string]: any
}
```

Slate defines and recognizes a handful of core commands out of the box for common rich-text behaviors, like:

```js
editor.exec({
  type: 'insert_text',
  text: 'A new string of text to be inserted.',
})

editor.exec({
  type: 'delete_backward',
  unit: 'character',
})

editor.exec({
  type: 'add_mark',
  mark: { type: 'bold' },
})
```

But you can (and will!) also define your own custom commands that model your domain. For example, you might want to define a `wrap_quote` command, or a `insert_image` command depending on what types of content you allow.

Commands always describe an action to be taken as if the user themselves was performing the action. For that reason, they never need to define a location to perform the command, because they always act on the user's current selection.

> 🤖 The concept of commands are loosely based on the DOM's built-in [`execCommand`](https://developer.mozilla.org/en-US/docs/Web/API/Document/execCommand) APIs. However Slate defines its own simpler (and extendable!) version of the API, because the DOM's version is overly complex and has known versatility issues.

Under the covers, Slate takes care of converting each command into a set of low-level "operations" that are applied to produce a new value. This is what makes collaborative editing implementations possible. But you don't have to worry about that, because it happens automatically.

## Custom Commands

When defining custom commands, you'll always trigger them by calling the `editor.exec` function:

```js
// Call your custom "insert_image" command.
editor.exec({
  type: 'insert_image',
  url: 'https://unsplash.com/photos/m0By_H6ofeE',
})
```

And then you define what their behaviors are by overriding the default `editor.exec` command:

```js
const withImages = editor => {
  const { exec } = editor

  editor.exec = command => {
    if (command.type === 'insert_image') {
      // Define your behaviors here...
    } else {
      // Call the existing behavior to handle any other commands.
      exec(command)
    }
  }

  return editor
}
```

This makes it easy for you to define a handful of commands specific to your problem domain.

But as you can see with the `withImages` function above, custom logic can be extracted into simple plugins that can be reused and shared with others. This is one of the powerful aspects of Slate's architecture.
