

![Slate](support/banner.png)

Slate is a completely customizable framework for building rich text editors in the browser. You can think of it like a pluggable implementation of `contenteditable`, built with React and Immutable. Slate was inspired by [Draft.js](https://facebook.github.io/draft-js/) and [Prosemirror](http://prosemirror.net/).

- [Principles](#principles)
- [Examples](#examples)
- [Plugins](#plugins)
- [Documentation](#documentation)
- [Contributing](#contributing)

_Slate is currently in **beta**, while work is being done on: cross-browser support, atomic node support, and collaboration support. It's useable now, but you might need to pull request one or two fixes for your use case._


## Principles

- Built with React and Immutable for performant stateless re-rendering and developing ease.
- Based on a nested, recursive tree model just like the DOM, so that complex components are possible.
- Made with plugins as a first-class consideration, so that almost all the logic is customizable.
- Doesn't bake any opinions about the schema being edited into the core library.
- Designed to allow for collaborative editing to be layered on top.


## Examples

To get a sense for how you might use Slate, check out a few of the examples:

- [Rich Text](examples/rich-text)
- [Plain Text](examples/plain-text)
- [Auto-markdown](examples/auto-markdown)
- [Links](examples/links)
- [Tables](examples/tables)


## Documentation

If you're using Slate for the first time, check out the [Getting Started Guide](docs/getting-started.md) to familiarize yourself with Slate's architecture and mental models. After that, you'll probably just want the [API Reference](docs/reference.md).
