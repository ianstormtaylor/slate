
This document explain the core concepts that Slate is built on around. It is helpful to read it through in it's entirety to get a good mental model for how Slate works.

- [Statelessness & Immutability](#statelessness-immutability)
- [The Document Model](#the-document-model)
- [The Selection Mode](#the-selection-model)
- [Transforms](#transforms)
- [Plugins](#plugins)


### Statelessness & Immutability

- all the data is immutable, for performance
- changes propagated up through the single `onChange` handler


### The Document Model

- recursive, nested tree 
- document, blocks, and inlines implement node interface
- blocks and inlines can be nested to any depth
- blocks contain inlines and text
- inlines contain text
- always a text node at the leaves, for selection handling
- void nodes can't have content, but still have an empty text node


### The Selection Model

- selection is always relative to text nodes (is normalized)
- "blocks" always refers to the closest block parent


### Transforms

- no updating of document/selection outside of transforms
- wrap blocks wraps close to the text
- wrap inline wraps far from the text


### Plugins

- everything is a plugin, even core is one
- the editor's props become the highest-priority plugin
