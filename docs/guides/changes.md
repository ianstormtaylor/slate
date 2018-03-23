# Changes

All changes to a Slate editor's value, whether it's the `selection`, `document`, `history`, etc. happen via "changes"—specifically, via the [`Change`](../slate-core/change.md) model.

This is important because the `Change` model is responsible for ensuring that every change to a Slate value can be expressed in terms of low-level [operations](../slate-core/operation.md). But you don't have to worry about that, because it happens automatically.

You just need to understand changes...

## Expressiveness is Key

Changes in Slate are designed to prioritize expressiveness above almost all else.

If you're building a powerful editor, it's going to be somewhat complex, and you're going to be writing code to perform all different kinds of programmatic changes. You'll be removing nodes, inserting fragments, moving the selection around, etc.

And if the API for changes was verbose, or if it required lots of in between steps to be continually performed, your code would balloon to be impossible to understand very quickly.

To solve this, Slate has very expressive, chainable changes. Like this:

```javascript
change
  .focus()
  .selectAll()
  .delete()
  .insertText('A bit of rich text, followed by...')
  .moveToOffsets(10, 14)
  .addMark('bold')
  .collapseToEndOfBlock()
  .insertBlock({ type: 'image', isVoid: true })
  .insertBlock('paragraph')
```

Hopefully from reading that you can discern that those changes result in... the entire document's content being selected and deleted, some text bring written, a word being bolded, and finally an image block and a paragraph block being added.

Of course you're not usually going to chain that much.

Point is, you can get pretty expressive in just a few lines of code.

That way, when you're scanning to see what behaviors are being triggered, you can understand your code easily. You don't have to sit there and try to parse out a bunch of interim variables to figure out what you're trying to achieve.

To that end, Slate defines _lots_ of change methods.

The change methods are the one place in Slate where overlap and near-duplication isn't stomped out. Because sometimes the exact-right change method is the difference between one line of code and ten. And not just ten once, but ten repeated everywhere throughout your codebase.

## Change Categories

There are a handful of different categories of changes that ship with Slate by default, and understanding them may help you understand which methods to reach for when trying to write your editor's logic...

### At a Specific Range

These are changes like `deleteAtRange()`, `addMarkAtArange()`, `unwrapBlockAtRange()`, etc. that take in a [`Range`](https://github.com/thesunny/slate/tree/28220e7007adc232fa5fefae52c970d7a3531d3d/docs/guides/range.md) argument and apply a change to the document for all of the content in that range. These aren't used that often, because you'll usually be able to get away with using the next category of changes instead...

### At the Current Selection

These are changes like `delete()`, `addMark()`, `insertBlock()`, etc. that are the same as the `*AtRange` equivalents, but don't need to take in a range argument, because they apply their edits based on where the user's current selection is. These are often what you want to use when programmatically editing "like a user".

### On the Selection

These are changes like `blur()`, `collapseToStart()`, `moveToRangeOf()`, etc. that change the `value.selection` model and update the user's cursor without affecting the content of the document.

### On a Specific Node

These are changes like `removeNodeByKey()`, `setNodeByKey()`, `removeMarkByKey()`, etc. that take a `key` string referring to a specific node, and then change that node in different ways. These are often what you use when making programmatic changes from inside your custom node components, where you already have a reference to `props.node.key`.

### On the Top-level Value

These are changes like `setData()`, `setDecorations()`, etc. that act on the other top-level properties of the [`Value`](../slate-core/value.md) object. These are more advanced.

### On the History

These are changes like `undo()`, `redo()`, etc. that use the operation history and redo or undo changes that have already happened. You generally don't need to worry about these, because they're already bound to the keyboard shortcuts you'd expect, and the user can use them.

## Making Changes

When you decide you want to make a change to the Slate value, you're almost always in one of four places...

### 1. In Slate Handlers

The first place, is inside a Slate-controlled event handler, like `onKeyDown` or `onPaste`. These handlers take a signature of `event, change, editor`. That `change` argument is a [`Change`](../slate-core/change.md) object that you can manipulate. For example...

```javascript
function onKeyDown(event, change, editor) {
  if (event.key == 'Enter') {
    change.splitBlock()
  }
}
```

Any change methods you call will be applied, and when the event handler stack is finished resolving, the editor will automatically update with those changes.

### 2. From Custom Node Components

The second place is inside a custom node component. For example, you might have an `<Image>` component and you want to make a change when the image is clicked.

In that case, you'll need to use the `change()` method on the Slate [`<Editor>`](../slate-react/editor.md) which you have available as `props.editor`. For example...

```javascript
class Image extends React.Component {
  onClick = event => {
    this.props.editor.change(change => {
      change.removeNodeByKey(this.props.node.key)
    })
  }

  render() {
    ;<img {...this.props.attributes} onClick={this.onClick} />
  }
}
```

The `editor.change()` method will create a new [`Change`](../slate-core/change.md) object for you, based on the editor's current value. You can then call any change methods you want, and the new value will be applied to the editor.

### 3. From Schema Rules

The third place you may perform change operations—for more complex use cases—is from inside a custom normalization rule in your editor's [`Schema`](https://github.com/thesunny/slate/tree/28220e7007adc232fa5fefae52c970d7a3531d3d/docs/references/slate/schema.md). For example...

```javascript
{
  blocks: {
    list: {
      nodes: [{ types: ['item'] }],
      normalize: (change, reason, context) => {
        if (reason == 'child_type_invalid') {
          change.wrapBlockByKey(context.child.key, 'item')
        }
      }
    }
  }
}
```

When a rule's validation fails, Slate passes a [`Change`](../slate-core/change.md) object to the `normalize` function of the rule, if one exists. You can use this object to apply the changes necessary to make your document valid on the next normalization pass.

### 4. From Outside Slate

This is the fourth place you might want to make changes, and also the most dangerous. You should know that any changes you make outside of the Slate editor might not be seen by your plugins, might interact with the history in weird ways, and may not work with collaborative editing implements.

That said, if that's okay with you, you can make changes manually by using the `change()` method on a Slate [`Value`](../slate-core/value.md). For example:

```javascript
const change = value
  .change()
  .selectAll()
  .delete()

const newValue = change.value
```

Note that you'll need to then grab the new value by accessing the `change.value` property directly.

## Reusing Changes

In addition to using the built-in changes, if your editor is of any complexity you'll want to write your own reusable changes. That way, you can reuse a single `insertImage` change instead of constantly writing `insertBlock(...args)`.

To do that, you should define change functions just like Slate's core does—as functions that take `(change, ...args)` arguments. Where `change` is the current mutable change object, and `...args` is anything else you want to accept to perform your change.

For example, here are two simple block inserting changes...

```javascript
function insertParagraph(change) {
  change.insertBlock('paragraph')
}

function insertImage(change, src) {
  change.insertBlock({
    type: 'image',
    isVoid: true,
    data: { src },
  })
}
```

Notice how rewriting that image inserting logic multiple times without having it encapsulated in a single function would get tedious. Now with those change functions defined, you can reuse them!

But sadly you can't chain with those functions directly, since `change` objects don't actually know about them. Instead, you use the `.call()` method:

```javascript
change.call(insertParagraph).call(insertImage, 'https://google.com/logo')
```

Not only can you use them with `.call()`, but if you're making one-off changes to the `editor`, you can use them with `editor.change()` as well. For example:

```javascript
editor.change(insertImage, 'https://google.com/logo')
```

That's the benefit of standardizing a function signature!

