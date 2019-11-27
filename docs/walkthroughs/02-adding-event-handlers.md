# Adding Event Handlers

Okay, so you've got Slate installed and rendered on the page, and when you type in it, you can see the changes reflected. But you want to do more than just type a plaintext string.

What makes Slate great is how easy it is to customize. Just like other React components you're used to, Slate allows you to pass in handlers that are triggered on certain events. You've already seen how the `onChange` handler can be used to store the changed editor value, but let's try adding more...

Let's use the `onKeyDown` handler to change the editor's content when we press a key.

Here's our app from earlier:

```js
const App = () => {
  const editor = useMemo(() => withReact(createEditor()), [])
  return (
    <Slate editor={editor} defaultValue={defaultValue}>
      <Editable />
    </Slate>
  )
}
```

Now we add an `onKeyDown` handler:

```js
const App = () => {
  const editor = useMemo(() => withReact(createEditor()), [])
  return (
    <Slate editor={editor} defaultValue={defaultValue}>
      <Editable
        // Define a new handler which prints the key that was pressed.
        onKeyDown={event => {
          console.log(event.key)
        }}
      />
    </Slate>
  )
}
```

Cool, now when a key is pressed in the editor, its corresponding keycode is logged in the console.

Now we want to make it actually change the content. For the purposes of our example, let's implement turning all ampersand, `&`, keystrokes into the word `and` upon being typed.

Our `onKeyDown` handler might look like this:

```js
const App = () => {
  const editor = useMemo(() => withReact(createEditor()), [])
  return (
    <Slate editor={editor} defaultValue={defaultValue}>
      <Editable
        onKeyDown={event => {
          if (event.key === '&') {
            // Prevent the ampersand character from being inserted.
            event.preventDefault()
            // Execute a command to insert text when the event occurs.
            editor.exec({ type: 'insert_text', text: 'and' })
          }
        }}
      />
    </Slate>
  )
}
```

With that added, try typing `&`, and you should see it suddenly become `and` instead!

This offers a sense of what can be done with Slate's event handlers. Each one will be called with the `event` object, and the `editor` that lets you perform commands. Simple!
