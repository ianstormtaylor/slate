# Batching Mutations

## Immutability

Slate documents are immutable by default, meaning that Node, Location, and Operation objects (besides the Editor) are each treated by slate as atomic data blocks that never change (or "mutate"). Any node you save to a variable will have the same properties and children forever, even if the node in the document is changed. Whenever a node would be altered, instead a copy of that node is made with all of the same properties except for the one alteration. This copying procedure is then propogated from child to parent so that no parent is ever mutated. This allows node references to act as snapshots in time and users can be assured a value they stored will never unexpectedly become a different value later on. (If your goal is to have a live reference to a node, consider a PathRef)

For example: if a Text node is bolded inside a `list-item` Element, a copy of the Text object is made with its `bold` property set to `true`, that copy becomes the child of a new copy of the `list-item` Element, which in turn becomes the child of a new copy of its parent `list` Element, which becomes the child of a new `Editor#children` array, which replaces the old array.
The old Text, `list-item` and `list` nodes are all untouched and do not `===` the new altered nodes, but no longer exist in the document.

### Inefficiencies

Ensuring absolute immutability 

By default, slate Operations are applied one at a time, assuring immutability both before and after each individual operation. This means each node operation creates X new node objects and X new children arrays, where X is its depth in the document tree. Most commands create multiple operations, which results in the creation of multiple intermediary states where the command is only partially applied, which are often entirely unused and not needed.

For example: Bolding a paragraph might create operations for 20 Text nodes that are 3 levels deep in the document tree. This will create 60 new node objects and 60 new arrays. 20 of those will be the paragraph node, one for each individual node operation, meaning 19 of them will represent a partially-bolded paragraph, and only the final one is a fully bolded paragraph. These 19 intermediate states are unnecessary and solely a byproduct of implementation. We can avoid creating them by batching mutations.

## Mutation Batches

Mutation batching is a way of grouping operations to reduce copying and memory overhead. During a mutation batch, only the first modification to a element's children will clone it, following modifications will simply mutate the clone in place. After a batch has ended, no further mutatations are made to elements, they're locked in. This means that before and after a batch all nodes are immutable, but during a batch element references should not be stored, because the value of their children array will continue to live update throught the batch.

### How to Create a Mutation Batch

To execute a group of operations or commands on editor `e` as a batch, simply wrap them with `e.asMutationBatch(() => { /* commands here */ })`. Any mutation applied during the closure is part of a single mutation batch.

### Dangers of Mutation Batches

References to nodes and children arrays can behave unexpectedly during batches because no node or children array can be guaranteed to be immutable, references might change value during the batch.

> Note: Many nodes and children arrays are immutable until their first change, so nodes and children arrays can't be guaranteed to be live-updating either.

As a rule-of-thumb, during the batch, references to nodes and children arrays should not be kept between operations, instead their values should be saved directly or they should be cloned.

#### Extending Editor Methods

Editor methods may be called internally by slate during internal mutation batches, so any plugins overriding those methods should be able to work in either context. `Editor#isBatchingMutations` can be used to adjust behavior depending on the context.
