# Glossary

A glossary explaining the terms commonly used in Slate:

### Anchor

### Block

### Blur

### Change

### Character

A "character" is the smallest element that makes up a text node in Slate.

### Collapsed

### Core

### Data

### Decoration

### Document

The "document" is the top-level ["node"](#node) that contains all other nodes that make up the content of the Slate editor.

### Editor

### Extend

### Focus

### Fragment

### History

### Inline

### Key

Keys are unique identifiers given to nodes in Slate to be able to reference them uniquely even as the document changes.

### Mark

### Merge

### Model

### Node

### Normalize

### Offset

An offset is a distance from the start of a text node, measured in ["characters"](#character).

### Operation

### Placeholder

### Plugin

### Point

A point represents a specific location in a document, where a user's cursor could be placed. It is represented by the `key` of the node in the document, and the `offset` of characters into a node.

### Range

A range is a way to represent a specific section of a document between two ["points"](#point). It is modelled after the [DOM Range](https://developer.mozilla.org/en-US/docs/Web/API/Range) concept.

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

### Value

### Wrap

To "wrap" is to surround a piece of text or a node in another node. For example, if you select the text `Google` and want to turn it into a link, you'd "wrap" it with an inline link node.
