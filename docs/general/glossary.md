# Glossary

A glossary explaining the terms commonly used in Slate:

### Anchor

The "anchor" point is a point where a range starts.

![An animated gif illustrating an anchor point within a selection.](../images/glossary/anchor-point.gif 'Anchor Point')

### Block

### Blur

### Change

### Character

A "character" is the smallest element that makes up a text node in Slate.

### Collapsed

A selection is "collapsed" when text is deselected. A collapse occurs when a range's start and end points are the same.

![An animated gif illustrating the how a selection is collapsed when text is de-selected.](../images/glossary/collapsed.gif 'Deselection')

### Core

### Data

### Decoration

### Document

The "document" is the top-level ["node"](#node) that contains all other nodes that make up the content of the Slate editor.

### Editor

### Extend

### Focus

The "focus" point is where a range ends. Unlike a anchor point, a focus point can be extended.

![An animated gif illustrating the focus point as it changes for an expanding selection.](../images/glossary/focus-point.gif 'Focus Point')

### Fragment

### History

### Inline

### Key

A "keys" is a unique identifier assigned to a node in Slate and is used to reference a node uniquely. As as the document changes, new unique keys are issued to avoid collisions within the data model.

### Mark

A "mark" represents formatting data that is attached to characters within text. Standard formatting such as **bold**, _italic_, `code`, or custom formatting for your application can be implemented using marks.

### Match

A "match" or ("matcher") is a shorthand argument that is used to determine which objects are concerned with a specific behavior. For example, when dealing with elements a `{ type: 'quote' }` objects matches elements with the `element.type === 'quote'` property.

### Merge

### Model

### Node

### Normalize

### Offset

An "offset" is a distance from the start of a text node, measured in ["characters"](#character).

### Operation

### Placeholder

### Plugin

### Point

A "point" represents a specific location in a document, where a user's cursor could be placed. It is represented by the `key` of the node in the document, and the `offset` of characters into a node.

### Range

A "range" is a way to represent a specific section of a document between two ["points"](#point). It is modelled after the [DOM Range](https://developer.mozilla.org/en-US/docs/Web/API/Range) concept.

### Redo

### Rule

### Schema

### Selection

### Serializer

### Split

### Stack

### Text

### Undo

### Unwrap

To "unwrap" is the opposite of to ["wrap"](#wrap), removing a surrounding node from a selection.

### Validate

### Wrap

To "wrap" is to surround a piece of text or a node in another node. For example, if you select the text `Google` and want to turn it into a link, you'd "wrap" it with an inline link node.
