
# Statelessness & Immutability

All of the data in Slate is immutable, thanks to [Immutable.js](https://facebook.github.io/immutable-js/). This makes it much easier to reason about complex editing logic, and it makes maintaining a history of changes for undo/redo much simpler.

_To learn more, check out the [`State` model reference](../reference/slate/state.md)._


### The `onChange` Handler

Because of Slate's immutability, you don't actually "set" itself a new state when something changes. 

Instead, the new state is propagated to the Slate editor's parent component, who decides what to do with it. Usually, you'll simply give the new state right back to the editor via React's `this.setState()` method, similarly to other internal component state. But that's up to you!

_To learn more, check out the [`<Editor>` component reference](../reference/slate-react/editor.md)._


### Changes

All of the changes in Slate are applied via [`Changes`](../reference/slate/change.md). This makes it possible to enforce some of the constraints that Slate needs to enforce, like requiring that [all leaf nodes be text nodes](./the-document-model.md#leaf-text-nodes). This also makes it possible to implement collaborative editing, where information about changes must be serialized and sent over the network to other editors.

You should never update the `selection` or `document` of an editor other than by using the [`change()`](../reference/slate/state.md#change) method of a `State`.

_To learn more, check out the [`Change` model reference](../reference/slate/change.md)._
