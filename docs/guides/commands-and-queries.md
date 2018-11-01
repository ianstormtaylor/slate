# Commands & Queries

All commands to a Slate editor's value, whether it's the `selection`, `document`, `history`, etc. happen via "commands".

Under the covers, Slate takes care of converting each command into a set of low-level [operations](../reference/slate/operation.md) that are applied to produce a new value. This is what makes collaborative editing implementations possible. But you don't have to worry about that, because it happens automatically.

You just need to understand commands...

## Expressiveness is Key

Commands in Slate are designed to prioritize expressiveness above almost all else.

If you're building a powerful editor, it's going to be somewhat complex, and you're going to be writing code to perform all different kinds of programmatic commands. You'll be removing nodes, inserting fragments, moving the selection around, etc.

And if the API for commands was verbose, or if it required lots of in between steps to be continually performed, your code would balloon to be impossible to understand very quickly.

To solve this, Slate has very expressive, chainable commands. Like this:

```js
editor
  .focus()
  .moveToRangeOfDocument()
  .delete()
  .insertText('A bit of rich text, followed by...')
  .moveTo(10)
  .moveFocusForward(4)
  .addMark('bold')
  .moveToEndOfBlock()
  .insertBlock({
    type: 'image',
    data: {
      src: 'http://placekitten.com/200/300',
      alt: 'Kittens',
      className: 'img-responsive',
    },
  })
  .insertBlock('paragraph')
```

Hopefully from reading that you can discern that those commands result in... the entire document's content being selected and deleted, some text being written, a word being bolded, and finally an image block and a paragraph block being added.

Of course you're not usually going to chain that much.

Point is, you can get pretty expressive in just a few lines of code.

That way, when you're scanning to see what behaviors are being triggered, you can understand your code easily. You don't have to sit there and try to parse out a bunch of interim variables to figure out what you're trying to achieve.

To that end, Slate defines _lots_ of commands.

The commands are the one place in Slate where overlap and near-duplication isn't stomped out. Because sometimes the exact-right command is the difference between one line of code and ten. And not just ten once, but ten repeated everywhere throughout your codebase.

## Command Categories

There are a handful of different categories of commands that ship with Slate by default, and understanding them may help you understand which methods to reach for when trying to write your editor's logic...

### At a Specific Range

These are commands like `deleteAtRange()`, `addMarkAtArange()`, `unwrapBlockAtRange()`, etc. that take in a [`Range`](../reference/slate/range.md) argument and apply a change to the document for all of the content in that range. These aren't used that often, because you'll usually be able to get away with using the next category of commands instead...

### At the Current Selection

These are commands like `delete()`, `addMark()`, `insertBlock()`, etc. that are the same as the `*AtRange` equivalents, but don't need to take in a range argument, because they apply their edits based on where the user's current selection is. These are often what you want to use when programmatically editing "like a user".

### On the Selection

These are commands like `blur()`, `moveToStart()`, `moveToRangeOfNode()`, etc. that change the `value.selection` model and update the user's cursor without affecting the content of the document.

### On a Specific Node

There are two types of commands referring to specific nodes, either by `path` or by `key`. These are often what you use when making programmatic commands from inside your custom node components, where you already have a reference to `props.node.key`.

Path-based commands are ones like `removeNodeByPath()`, `insertNodeByPath()`, etc. that take a `path` pinpointing the node in the document. And key-based commands are ones like `removeNodeByKey()`, `setNodeByKey()`, `removeMarkByKey()`, etc. that take a `key` string referring to a specific node, and then change that node in different ways.

### On the Top-level Value

These are commands like `setData()`, `setDecorations()`, etc. that act on the other top-level properties of the [`Value`](../reference/slate/value.md) object. These are more advanced.

### On the History

These are commands like `undo()`, `redo()`, etc. that use the operation history and redo or undo commands that have already happened. You generally don't need to worry about these, because they're already bound to the keyboard shortcuts you'd expect, and the user can use them.

## Running Commands

When you decide you want to make a change to the Slate value, you're almost always in one of four places...

### 1. In Slate Handlers

The first place, is inside a Slate-controlled event handler, like `onKeyDown` or `onPaste`. These handlers take a signature of `event, editor, next`. For example...

```js
function onKeyDown(event, editor, next) {
  if (event.key == 'Enter') {
    editor.splitBlock()
  } else {
    return next()
  }
}
```

Any commands you call will be applied immediately to the `editor` object, and flushed to the `onChange` handler on the next tick.

### 2. From Custom Node Components

The second place is inside a custom node component. For example, you might have an `<Image>` component and you want to make a change when the image is clicked. For example...

```js
class Image extends React.Component {
  onClick = event => {
    const { editor, node } = this.props
    editor.removeNodeByKey(node.key)
  }

  render() {
    return <img {...this.props.attributes} onClick={this.onClick} />
  }
}
```

The `<Image>` node component will be passed the `editor` and the `node` it represents as props, so you can use these to trigger commands.

### 3. From Schema Rules

The third place you may perform change operations—for more complex use cases—is from inside a custom normalization rule in your editor's [`Schema`](../references/slate/schema.md). For example...

```js
{
  blocks: {
    list: {
      nodes: [{
        match: { type: 'item' }
      }],
      normalize: (editor, error) => {
        if (error.code == 'child_type_invalid') {
          editor.wrapBlockByKey(error.child.key, 'item')
        }
      }
    }
  }
}
```

When a rule's validation fails, Slate passes the editor to the `normalize` function of the rule, if one exists. You can use these normalizing functions to apply the commands necessary to make your document valid on the next normalization pass.

### 4. From Outside Slate

The last place is from outside of Slate. Sometimes you'll have components that live next to your
editor in the render tree, and you'll need to explicitly pass them a reference to the Slate `editor` to run changes. In React you do this with the `ref={}` prop...

```js
<Editor
  ref={editor => this.editor = editor}
  ...
/>
```

Which gives you a reference to the Slate editor. And from there you can use the same commands syntax from above to apply changes.

## Running Queries

Queries are similar to commands, but instead of manipulating the current value of the editor, they return information about the current value, or a specific node, etc.

By default, Slate only defines two queries: `isAtomic` for marks and decorations, and `isVoid` for nodes. You can access them directly on the editor:

```js
const isVoid = editor.isVoid(node)
```

But you can also define your own queries that are specific to your schema. For example, you might use a query to determine whether the "bold" mark is active...

```js
const isBold = editor.isBoldActive(value)
```

And then use that information to mark the <kbd>bold</kbd> button in your editor's toolbar as active or not.

## Reusing Commands and Queries

In addition to using the built-in commands, if your editor is of any complexity you'll want to write your own reusable commands. That way, you can reuse a single `insertImage` change instead of constantly writing `insertBlock(...args)`.

To do that, you can define commands in your own Slate plugin, which will be made available as methods on the `editor` object. For example, here are two simple block inserting commands...

```js
const yourPlugin = {
  commands: {
    insertParagraph(editor) {
      editor.insertBlock('paragraph')
    },

    insertImage(editor, src) {
      editor.insertBlock({
        type: 'image',
        data: { src },
      })
    },
  },
}
```

Notice how rewriting that image inserting logic multiple times without having it encapsulated in a single function would get tedious. Now with those change functions defined, you can reuse them!

```js
editor.insertImage('https://google.com/logo.png')
```

And any arguments you pass in are sent to your custom command functions.

The same thing goes for queries, which can be defined in plugins and re-used across your entire codebase. To do so, define a `queries` object:

```js
const yourPlugin = {
  queries: {
    getActiveListItem(editor) {
      ...
    }
  }
}
```

And then you can use them right from the `editor` instance:

```js
editor.getActiveListItem()
```

This reusability is key to being able to organize your commands and queries, and compose them together to create more advanced behaviors.
