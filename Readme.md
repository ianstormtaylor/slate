

<p align="center"><img src="./docs/banner.png" /></p>

<p align="center">A <em>completely</em> customizable framework <br/>for building rich text editors in the browser.</p>
<br/>

<p align="center"><a href="#principles"><strong>Principles</strong></a> · <a href="#examples"><strong>Examples</strong></a> · <a href="#plugins"><strong>Plugins</strong></a> · <a href="#documentation"><strong>Documentation</strong></a> · <a href="./Contributing.md"><strong>Contributing!</strong></a></p>
<br/>

Slate lets you build rich, intuitive editors like those in [Medium](https://medium.com/), [Dropbox Paper](https://www.dropbox.com/paper) or [Canvas](https://usecanvas.com/)—which are becoming table stakes for applications on the web—without your codebase getting mired in complexity.

It can do this because all of its logic is implemented with a series of plugins, so you aren't ever constrained by what _is_ or _isn't_ in "core". You can think of it like a pluggable implementation of `contenteditable`, built on top of [React](https://facebook.github.io/react/) and [Immutable](https://facebook.github.io/immutable-js/). It was inspired by libraries like [Draft.js](https://facebook.github.io/draft-js/), [Prosemirror](http://prosemirror.net/) and [Quill](http://quilljs.com/).

_**Slate is currently in beta**. It's useable now, but you might need to pull request a fix or two for advanced use cases._


<br/>
### Principles

1. **First-class plugins.** The most important part of Slate is that plugins are first-class entities—the core editor logic is even implemented as its own plugin. That means you can _completely_ customize the editing experience, to build complex editors like Medium's or Canvas's without having to fight against the library's assumptions.

2. **Schema-less core.** Slate's core logic doesn't assume anything about the schema of the data you'll be editing, which means that there are no assumptions baked into the library that'll trip you up when you need to go beyond basic usage.

3. **Nested document model.** The document model used for Slate is a nested, recursive tree, just like the DOM itself. This means that creating complex components like tables or nested block quotes are possible for advanced use cases. But it's also easy to keep it simple by only using a single level of hierachy.

4. **Stateless and immutable data.** By using React and Immutable.js, the Slate editor is built in a stateless fashion using immutable data structures, which leads to better performance, and also a much easier time writing plugins.

5. **Intuitive transforms.** Slate's content is edited using "transforms", that are designed to be extremely intuitive to use, so that writing plugins and custom functionality is as simple as possible.

6. **Collaboration-ready data model.** The data model Slate uses—specifically how transforms are applied to the document—has been designed to allow for collaborative editing to be layered on top, so you won't need to rethink everything if you decide to make your editor collaborative. (More work is required on this!)


<br/>
### Examples

To get a sense for how you might use Slate, check out a few of the examples:

- [**Plain text**](./examples/plain-text) — showing the most basic case: a glorified `<textarea>`.
- [**Rich text**](./examples/rich-text) — showing the features you'd expect from a basic editor.
- [**Auto-markdown**](./examples/auto-markdown) — showing how to add key handlers for Markdown-like shortcuts.
- [**Links**](./examples/links) — showing how wrap text in inline nodes with associated data.
- [**Images**](./examples/images) — showing how to use void (text-less) nodes to add images.
- [**Hovering menu**](./examples/hovering-menu) — showing how a contextual hovering menu can be implemented.
- [**Tables**](./examples/tables) — showing how to nest blocks to render more advanced components.
- [**Paste HTML**](./examples/paste-html) — showing how to use an HTML serializer to handle pasted HTML.
- [**Code Highlighting**](./examples/code-highlighting) — showing how to use decorators to dynamically mark text.

If you have an idea for an example that shows a common use case, pull request it!


<br/>
### Plugins

Slate encourages you to write small, reusable modules. Check out the public ones you can use in your project!

- [**Plugins**](https://github.com/ianstormtaylor/slate/wiki#plugins) 
- [**Serializers**](https://github.com/ianstormtaylor/slate/wiki#serializers)


<br/>
### Documentation

If you're using Slate for the first time, check out the [Getting Started](./docs/guides/installing-slate.md) guides and the [Core Concepts](./docs/concepts) to familiarize yourself with Slate's architecture and mental models. Once you've gotten familiar with those, you'll probably want to check out the full [API Reference](./docs/reference).

- [**Guides**](./docs/guides)
  - [Installing Slate](./docs/guides/installing-slate.md)
  - [Adding Event Handlers](./docs/guides/adding-event-handlers.md)
  - [Defining Custom Block Nodes](./docs/guides/defining-custom-block-nodes.md)
  - [Applying Custom Formatting](./docs/guides/applying-custom-formatting.md)
  - [Using Plugins](./docs/guides/using-plugins.md)
  - Saving to a Database
  - Adding a Hovering Menu
  - Rendering Adjacent Elements in Components
- [**Concepts**](./docs/concepts)
  - [Statelessness & Immutability](./docs/concepts/statelessness-and-immutability.md)
  - [The Document Model](./docs/concepts/the-document-model.md)
  - [The Selection Model](./docs/concepts/the-selection-model.md)
  - [Plugins](./docs/concepts/plugins.md)
- [**Reference**](./docs/reference)
  - Components
    - [Editor](./docs/reference/components/editor.md)
    - [Placeholder](./docs/reference/components/placeholder.md)
  - Models
    - [Block](./docs/reference/models/block.md)
    - [Character](./docs/reference/models/character.md)
    - [Data](./docs/reference/data.md)
    - [Document](./docs/reference/models/document.md)
    - [Inline](./docs/reference/models/inline.md)
    - [Mark](./docs/reference/mark.md)
    - [Node](./docs/reference/models/node.md)
    - [Selection](./docs/reference/models/selection.md)
    - [State](./docs/reference/models/state.md)
    - [Text](./docs/reference/text.md)
    - [Transform](./docs/reference/models/transform.md)
  - Plugins
    - [Plugins](./docs/reference/plugins/plugins.md)
    - [Core](./docs/reference/plugins/core.md)

If even that's not enough, you can always [read the source itself](./lib), which is explained along with a handful of readme's.


<br/>
### Contributing

All contributions are super welcome! Check out the [Contributing instructions](./Contributing.md) for more info!


<br/>
### License

The MIT License

Copyright &copy; 2016, [Ian Storm Taylor](https://ianstormtaylor.com)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
