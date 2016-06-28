

[![Slate](support/banner.png)]()

Slate is a completely customizable framework for building rich text editors in the browser. You can think of it like a pluggable implementation of `contenteditable`, built with React and Immutable. Slate lets you build editors like [Medium](https://medium.com/), [Dropbox Paper](https://www.dropbox.com/paper), or [Canvas](https://usecanvas.com/). It was inspired by libraries like [Draft.js](https://facebook.github.io/draft-js/) and [Prosemirror](http://prosemirror.net/).

- [Principles](#principles)
- [Examples](#examples)
- [Plugins](#plugins)
- [Documentation](#documentation)
- [Contributing](#contributing)

_Slate is currently in **beta**, while work is being done on: cross-browser support, atomic node support, and collaboration support. It's useable now, but you might need to pull request one or two fixes for your use case._


## Principles

**First-class plugins.** The most important factor of Slate is that plugins are first-class entities—the core editor logic is even implemented as its own plugin. This means that you're able to fully customize the editing experience. So you can build complex interations like those found in the Medium or Canvas editors.

**Stateless and immutable.** By using React and Immutable.js, the Slate editor is built in a stateless fashion using immutable data structures, which leads to better performance, and also a much easier time writing plugins.

**Nested document model.** The document model used for Slate is a nested, recursive tree, just like the DOM itself. This means that creating complex components like tables or nested block quotes is possible for advanced use cases. But it's also easy to keep it simple by only using a single level of hierachy.

**Schema-less core.** Slate's core logic doesn't assume anything about the schema of the data you'll be editing, which means that there are no assumptions baked into the library that'll trip you up when you need to go beyond basic usage.

**Collaboration friendly.** The data model Slate uses—specifically how transforms are applied to the document—has been designed to allow for collaborative editing to be layered on top, so you won't need to rethink everything if you decide to make your editor collaborative.


## Examples

To get a sense for how you might use Slate, check out a few of the examples:

- [Plain text](examples/plain-text) — showing the most basic case: a glorified `<textarea>`.
- [Rich text](examples/rich-text) — showing the features you'd expect from a basic editor.
- [Auto-markdown](examples/auto-markdown) — showing how to add key handlers for Markdown-like shortcuts.
- [Links](examples/links) — showing how wrap text in inline nodes with associated data.
- [Tables](examples/tables) — showing how to nest blocks to render more advanced components.


## Documentation

If you're using Slate for the first time, check out the [Getting Started Guide](docs/getting-started.md) to familiarize yourself with Slate's architecture and mental models. After that, you'll probably just want the [API Reference](docs/reference.md).
