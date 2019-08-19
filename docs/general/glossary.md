# Glossary

A glossary explaining the terms commonly used in Slate:

### Anchor

An _"anchor point"_ is a point where a range starts.

![An animated gif illustrating an anchor point within a selection.](../images/glossary/anchor-point.gif 'Anchor Point')

### Block

### Blur

### Change

### Character

A _"character"_ is the smallest element that makes up a text node in Slate.

### Collapsed

A selection is _"collapsed"_ when text is deselected. A collapse occurs when a range's start and end points are the same.

![An animated gif illustrating the how a selection is collapsed when text is de-selected.](../images/glossary/collapsed.gif 'Deselection')

### Core

### Data

### Decoration

### Document

The _"document"_ is the top-level ["node"](#node) that contains all other nodes that make up the content of the Slate editor.

### Editor

### Extend

### Focus

Focus is defined differently based on your context:

#### Focus Point

A _"focus point"_ is where a range ends. Unlike a anchor point, a focus point can be expanded.

![An animated gif illustrating the focus point as it changes for an expanding selection.](../images/glossary/focus-point.gif 'Focus Point')

#### Focus Block

The editor value provides a reference to the current _"focus block"_ as a convenience. For example, you access the words within the block a user is focused on like so: `const words = editor.value.focusBlock.text.split(' ');`

### Fragment

### History

### Inline

### Key

A _"keys"_ is a unique identifier assigned to a node in Slate and is used to reference a node uniquely. As as the document changes, new unique keys are issued to avoid collisions within the data model.

### Mark

A _"mark"_ represents formatting data that is attached to characters within text. Standard formatting such as **bold**, _italic_, `code`, or custom formatting for your application can be implemented using marks.

### Match

A `match`, is an object with possible fields of `type` and `object` that are used to _match_ `Nodes` when defining rules in a [Schema](../reference/slate/schema.md). An example of `match` could be `{type: 'paragraph'}`, `{objet: 'inline', type: '@-tag'}`, etc.

### Merge

### Model

### Node

### Normalize

### Offset

An _"offset"_ is a distance from the start of a text node, measured in ["characters"](#character).

### Operation

### Placeholder

### Plugin

A _"plugin"_ is a reusable object that implements one or more of Slate's plugin hooks to add specific behavior to your editor. A plugin helps you express your application while keeping it easy to maintain and reason about.

### Point

A _"point"_ represents a specific location in a document, where a user's cursor could be placed. It is represented by the `key` of the node in the document, and the `offset` of characters into a node.

### Range

A _"range"_ is a way to represent a specific section of a document between two ["points"](#point). It is modelled after the [DOM Range](https://developer.mozilla.org/en-US/docs/Web/API/Range) concept.

### Redo

### Rule

### Schema

A Slate _"schema"_ is a JavaScript object with properties that describe the document, block nodes, and inline nodes in your editor. Every Slate editor has a "schema" associated with it, which contains information about the structure of its content. For the most basic cases, you'll just rely on Slate's default core schema. But for advanced use cases, you can enforce rules about what the content of a Slate document can contain. Read [Schema reference](../reference/slate/schema.md) to learn more.

### Selection

### Serializer

### Split

### Stack

### Text

### Undo

### Unwrap

To _"unwrap"_ is the opposite of to ["wrap"](#wrap), removing a surrounding node from a selection.

### Validate

### Value

A Slate _"value"_ is the top-level object in Slate and is an object encapsulating the entire value of a Slate editor. Read the [Data Model guide](../guides/data-model.md#the-value) to learn more.

### Wrap

To _"wrap"_ is to surround a piece of text or a node in another node. For example, if you select the text `Google` and want to turn it into a link, you'd "wrap" it with an inline link node.
