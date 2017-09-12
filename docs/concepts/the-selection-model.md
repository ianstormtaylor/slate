
# The Selection Model

Slate keeps track of the user's selection in the editor in an immutable data store called a [`Selection`](../reference/slate/selection.md). By doing this, it lets Slate manipulate the selection with changes, but still update it in the DOM on `render`.


### Always References Text

One of the constraints of the Slate document model is that [leaf nodes are always text nodes](./the-document-model.md#leaf-text-nodes). This constraint exists to make selection logic simpler. 

A selection always refers to text nodes. Such that even if you set a selection relative to a non-text node, Slate will automatically correct it for you.

This makes selections easier to reason about, while still giving us the benefits of a recursive document tree, and it makes for a lot less boilerplate.


### Leaf Blocks

When a selection is used to compute a set of [`Block`](../reference/slate/block.md) nodes, by convention those nodes are always the leaf-most `Block` nodes (ie. the lowest `Block` nodes in the tree at their location). This is important, because the nested document model allows for nested `Block` nodes.

This convention makes it much simpler to implement selection and changeation logic, since the user's actions are very often supposed to effect the leaf blocks.


### Trunk Inlines

Unline `Block` nodes, when a selection is used to compute a set of [`Inline`](../reference/slate/inline.md) nodes, the trunk-most nodes are used (ie. the highest `Inline` nodes in the tree at their location). This is done for the same reason, that most user actions are supposed to act at the highest level of inline nodes.
