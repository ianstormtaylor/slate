
# Changes

All changes to a Slate editor's state, whether it's the `selection`, `document`, `history`, etc. happen via "changes"—specifically, via the [`Change`](../reference/slate/change.md) model.

This is important because the `Change` model is responsible for ensuring that every change to a Slate state can be expressed in terms of low-level [operations](./operation.md).


## Categories of Changes

There are a handled of different categories of changes that ship with Slate by default, and understanding them may help you understand which methods to reach for when trying to write your editor's logic...

### On the Selection

These are changes like `blur()`, `collapseToStart()`, etc. that change the `state.selection` model and update the user's cursor without affecting the content of the document.

### On the Document at a Specific Range

These are changes like `deleteAtRange()`, `addMarkAtArange()`, etc. that take in a [`Range`](./range.md) argument and apply a change to the document for all of the content in that range.

### On the Document at the Current Selection

These are changes like `delete()`, `addMark()`, etc. that don't need to take in a range argument, because they apply make their edits based on where the user's current selection is. These are often what you want to use when programmatically editing "like a user".

### On a Specific Node

These are changes like `removeNodeByKey()`, `setNodeByKey()`, etc. that take a `key` string referring to a specific node, and then change that node in different ways. These are often what you use when making programmatic changes from inside your custom node components, where you already have a reference to `props.node.key`.

### On the Top-level State

These are changes like `setData()`, `setDecorations()`, etc. that act on the other top-level properties of the [`State`](../reference/slate/state.md) object. These are more advanced.

### On the History

These are changes like `undo()` and `redo()` that use the operation history and redo or undo changes that have already happened. You generally don't need to worry about these, because they're already bound to the keyboard shortcuts you'd expect, and the user can use them.


## Making Changes

When you decide you want to make a change to the Slate state, you're almost always in one of three places...

### 1. In Slate Handlers

The first place, is inside a Slate-controlled event handler, like `onKeyDown` or `onPaste`. These handlers take a signature of `event, change, editor`. That `change` argument is a [`Change`](../reference/slate/change.md) object that you can manipulate. For example...

```js
function onKeyDown(event, change, editor) {
  if (event.key == 'Enter') {
    change.splitBlock()
  }
}
```

Any change methods you call will be applied, and when the event handler stack is finished resolving, the editor will automatically update with those changes. 

### 2. From Custom Node Components

The second place you is inside a custom node component. For example, you might have an `<Image>` component and you want to make a change when the image is clicked.

In that case, you'll need to use the `change()` method on the Slate [`<Editor>`](../reference/slate-react/editor.md) which you have available as `props.editor`. For example...

```js
class Image extends React.Component {

  onClick = (event) => {
    this.props.editor.change((change) => {
      change.removeNodeByKey(this.props.node.key)
    })
  }

  render() {
    <img 
      {...this.props.attributes} 
      onClick={this.onClick}
    />
  }

}
```

The `editor.change()` method will create a new [`Change`](../reference/slate/change.md) object for you, based on the editor's current state. You can then call any change methods you want, and the new state will be applied to the editor.

### 3. From Outside Slate

This is the third place you might want to make changes, and also the most dangerous. You should know that any changes you make outside of the Slate editor might not be seen by your plugins, might interact with the history in weird ways, and may not work with collaborative editing implements.

That said, if that's okay with you, you can make changes manually by using the `change()` method on a Slate [`State`](../reference/slate/state.md). For example:

```js
const change = state.change()
  .selectAll()
  .delete()

const newState = change.state
```

Note that you'll need to then grab the new state value by accessing the `change.state` property directly.
