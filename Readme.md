

<p align="center"><a href="#"><img src="./docs/images/banner.png" /></a></p>

<p align="center">A <em>completely</em> customizable framework <br/>for building rich text editors.</p>
<br/>

<p align="center"><a href="#why"><strong>Why?</strong></a> · <a href="#principles"><strong>Principles</strong></a> · <a href="http://slatejs.org"><strong>Demo</strong></a> · <a href="#examples"><strong>Examples</strong></a> · <a href="#plugins"><strong>Plugins</strong></a> · <a href="#documentation"><strong>Documentation</strong></a> · <a href="./Contributing.md"><strong>Contributing!</strong></a></p>
<br/>

<p align="center"><a href="http://slatejs.org"><img src="./docs/images/preview.png"></a></p>

<p align="center"><a href="https://www.npmjs.com/package/slate"><img src="https://img.shields.io/npm/dt/localeval.svg?maxAge=2592000"></a> <a href="https://slate-slack.herokuapp.com"><img src="https://slate-slack.herokuapp.com/badge.svg"><a/></p>
<br/>

Slate lets you build rich, intuitive editors like those in [Medium](https://medium.com/), [Dropbox Paper](https://www.dropbox.com/paper) or [Canvas](https://usecanvas.com/)—which are becoming table stakes for applications on the web—without your codebase getting mired in complexity.

It can do this because all of its logic is implemented with a series of plugins, so you aren't ever constrained by what _is_ or _isn't_ in "core". You can think of it like a pluggable implementation of `contenteditable`, built on top of [React](https://facebook.github.io/react/) and [Immutable](https://facebook.github.io/immutable-js/). It was inspired by libraries like [Draft.js](https://facebook.github.io/draft-js/), [Prosemirror](http://prosemirror.net/) and [Quill](http://quilljs.com/).

_**Slate is currently in beta**. It's useable now, but you might need to pull request a fix or two for advanced use cases._


<br/>
### Why?

Why create Slate? Well... _(Beware: this section has a few of [my](https://github.com/ianstormtaylor) opinions!)_

Before creating Slate, I tried a lot of the other rich text libraries out there. What I found was that while getting simple examples to work might be possible, once you start trying to build something like [Medium](https://medium.com/), [Dropbox Paper](https://www.dropbox.com/paper) or [Canvas](https://usecanvas.com/), you have to resort to very hacky things to get the user experience you want. And some experiences are just impossible. On the way, your codebase becomes harder and harder to maintain.

Here's how Slate compares to some of the existing editors out there:

- [**Draft.js**](https://facebook.github.io/draft-js/) — Slate borrowed a few concepts from Draft.js, namely its event system, its use of Immutable.js and React, and its goal of being a "framework" for creating editors. It also borrowed its plugin-centric design from the [Draft.js Plugins](https://github.com/draft-js-plugins/draft-js-plugins) project. But the issues I ran into while using Draft.js were: that lots of the logic around the schema is hardcoded in "core" and difficult to customize, that the transform API is complex to use and not suited to collaborative editing in the future, that serialization isn't considered by the core library in a nice way, that the flat document model made certain behaviors impossible, and that lots of the API feels very heavy to work with.

- [**Prosemirror**](http://prosemirror.net/) — Slate borrowed a few concepts from Prosemirror, namely its nested document tree, and its transform model. But the issues I ran into while using it were: that the API is hard to understand, that the codebase wasn't structured around common node module practices, that lots of magic was built into the core library that was hard to customize, that toolbars and buttons are too tied to the editor itself, and that the documentation isn't great. (It's still in beta though!)

- [**Quill**](http://quilljs.com/) — I never used Quill directly, so my hesitations about it are solely from considering it in early stages. The issues I see with it are: that the concept of "toolbars" is too coupled with the editor itself, that the configuration is too coupled to HTML classes and DOM nodes, that the idea of "formats" and "toolbars" being linked is limiting, and generally that too much "core" logic is given special privileges and is hard to customize.

- [**Trix**](https://trix-editor.org/) — I never used Trix directly either, so my issues with it are solely from considering it in early stages. The issues I found with it are: that it aims to be simple by limiting functionality instead of by limiting its own scope, that many behaviors are just impossible to implement with it, that it's too coupled to the DOM, and that the flat document model is limiting.

Of course those are my own opinions, but if you've tried using any of those libraries you might have run into similar problems. Which brings me to how Slate solves all of that...


<br/>
### Principles

Slate tries to solve the question of "[Why?](#why)" with a few principles:

1. **First-class plugins.** The most important part of Slate is that plugins are first-class entities—the core editor logic is even implemented as its own plugin. That means you can _completely_ customize the editing experience, to build complex editors like Medium's or Canvas's without having to fight against the library's assumptions.

2. **Schema-less core.** Slate's core logic doesn't assume anything about the schema of the data you'll be editing, which means that there are no assumptions baked into the library that'll trip you up when you need to go beyond basic usage.

3. **Nested document model.** The document model used for Slate is a nested, recursive tree, just like the DOM itself. This means that creating complex components like tables or nested block quotes are possible for advanced use cases. But it's also easy to keep it simple by only using a single level of hierarchy.

4. **Stateless and immutable data.** By using React and Immutable.js, the Slate editor is built in a stateless fashion using immutable data structures, which leads to much easier to reason about code, and a much easier time writing plugins.

5. **Intuitive transforms.** Slate's content is edited using "transforms", that are designed to be extremely intuitive to use, so that writing plugins and custom functionality is as simple as possible.

6. **Collaboration-ready data model.** The data model Slate uses—specifically how transforms are applied to the document—has been designed to allow for collaborative editing to be layered on top, so you won't need to rethink everything if you decide to make your editor collaborative. (More work is required on this!)

7. **Clear "core" boundaries.** With a plugin-first architecture, and a schema-less core, it becomes a lot clearer where the boundary is between "core" and "custom", which means that the core experience doesn't get bogged down in edge cases.


<br/>
### Demo

Check out the [**live demo**](http://slatejs.org) of all of the examples!


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

- [`slate-auto-replace-text`](https://github.com/ianstormtaylor/slate-auto-replace-text) auto-replaces a string of text when typed. Useful for "smart" typography!
- [`slate-collapse-on-escape`](https://github.com/ianstormtaylor/slate-collapse-on-escape) simply collapses the selection when `escape` is pressed.
- [`slate-paste-linkify`](https://github.com/ianstormtaylor/slate-paste-linkify) wraps the selected text in a link when a URL is pasted from the clipboard.
- [`slate-soft-break`](https://github.com/ianstormtaylor/slate-soft-break) adds a soft break when `enter` is pressed.
- [**View all plugins...**](https://github.com/ianstormtaylor/slate/wiki)

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
  - Adding Images Using Void Nodes
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
### Contributing!

All contributions are super welcome! Check out the [Contributing instructions](./Contributing.md) for more info!

Slate is [MIT-licensed](./License.md).
