
This directory contains all of the immutable models that contain the data that powers Slate. They are built using [Immutable.js](https://facebook.github.io/immutable-js/). Here's what each of them does:

- [Block](#block)
- [Character](#character)
- [Data](#data)
- [Document](#document)
- [Inline](#inline)
- [Mark](#mark)
- [Node](#node)
- [Selection](#selection)
- [State](#state)
- [Text](#text)
- [Transform](#transform)


#### Block

Just like in the DOM, `Block` nodes are one that contain other inline content. They can be split apart, and wrapped in other blocks, but they will always contain at least a single [`Text`](#text) node of inline content. They can also contain associated [`Data`](#data)


#### Character

The content of each [`Text`](#text) node is modeled as a `Character` list. Each character contains a single character string, and any associated [`Marks`](#mark) that are applied to it.


#### Data

`Data` is just a thin wrapper around [`Immutable.Map`](https://facebook.github.io/immutable-js/docs/#/Map), which allows for more easily creating maps without having to require [`Immutable`](https://facebook.github.io/immutable-js/) itself.


#### Document

The `Document` is where all of the content in the editor is stored. It is a recursively nested tree of [`Nodes`](#node), just like the DOM itself. Which can either be [`Block`](#block), [`Inline`](#inline), or [`Text`](#text) nodes.


#### Inline

Similar to [`Block`](#block) nodes, but containing inline content instead of block-level content. They too can be nested to any depth, but at the lowest level will always contain a single [`Text`](#text) node.


#### Mark

Marks are the pieces of "formatting" that can be applied to strings of text in the editor. Unlike [`Nodes`](#nodes), `Marks` are modeled as a flat set, such that each character can have multiple marks associated with it. This allows for cases where a link (ie. an inline node) can also have bold (ie. a mark) formatting attached to part of it.


#### Node

`Node` isn't actually a model that is exposed, but instead it's an interface full of convenience methods that [`Document`](#document), [`Block`](#block), [`Inline`](#inline) all implement.


#### Selection

The `Selection` keeps track of where the user's cursor is. It's modeled after the [DOM Selection API](https://developer.mozilla.org/en-US/docs/Web/API/Selection), using terms like "anchor", "focus" and "collapsed".


#### State

The `State` is the highest-level model. It is really just a convenient wrapper around a few other models: [`Document`](#document), [`Selection`](#selection), and a `History` which is not publicly exposed.

Since `State` has knowledge of both the [`Document`](#document) and the [`Selection`](#selection), it provides a handful of convenience methods for updating the both at the same time. For example, when inserting a new content fragment, it inserts the fragment and then moves the selection to the end of the newly inserted content.

The `State` is the object that lets you apply "transforms" that change the current document or selection. By having them all be applied through the top-level state, it can keep track of changes in the `History`, allowing for undoing and redoing changes.


#### Text

`Text` is the lowest-level [`Node`](#node) in the tree. Each `Text` node contains a list of [`Characters`](#characters), which can optionally be dynamically decorated.


#### Transform

`Transform` is not publicly exposed; you access it by calling the `transform()` method on a [`State`](#state) model. It's simply a wrapper around the somewhat-complex transformation logic that allows for a state's history to be populated correctly.
