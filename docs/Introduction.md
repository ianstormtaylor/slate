# Slate

[Slate](http://slatejs.org) is a _completely_ customizable framework for building rich text editors.

Slate lets you build rich, intuitive editors like those in [Medium](https://medium.com/), [Dropbox Paper](https://www.dropbox.com/paper) or [Google Docs](https://www.google.com/docs/about/)—which are becoming table stakes for applications on the web—without your codebase getting mired in complexity.

It can do this because all of its logic is implemented with a series of plugins, so you aren't ever constrained by what _is_ or _isn't_ in "core". You can think of it like a pluggable implementation of `contenteditable` built on top of [React](https://facebook.github.io/react/). It was inspired by libraries like [Draft.js](https://facebook.github.io/draft-js/), [Prosemirror](http://prosemirror.net/) and [Quill](http://quilljs.com/).

> 🤖 **Slate is currently in beta**. Its core API is useable now, but you might need to pull request fixes for advanced use cases. Some of its APIs are not "finalized" and will (breaking) change over time as we find better solutions.

## Why?

Why create Slate? Well... _(Beware: this section has a few of [my](https://github.com/ianstormtaylor) opinions!)_

Before creating Slate, I tried a lot of the other rich text libraries out there—[**Draft.js**](https://facebook.github.io/draft-js/), [**Prosemirror**](http://prosemirror.net/), [**Quill**](http://quilljs.com/), etc. What I found was that while getting simple examples to work was easy enough, once you started trying to build something like [Medium](https://medium.com/), [Dropbox Paper](https://www.dropbox.com/paper) or [Google Docs](https://www.google.com/docs/about/), you ran into deeper issues...

- **The editor's "schema" was hardcoded and hard to customize.** Things like bold and italic were supported out of the box, but what about comments, or embeds, or even more domain-specific needs?

- **Transforming the documents programmatically was very convoluted.** Writing as a user may have worked, but making programmatic changes, which is critical for building advanced behaviors, was needlessly complex.

- **Serializing to HTML, Markdown, etc. seemed like an afterthought.** Simple things like transforming a document to HTML or Markdown involved writing lots of boilerplate code, for what seemed like very common use cases.

- **Re-inventing the view layer seemed inefficient and limiting.** Most editors rolled their own views, instead of using existing technologies like React, so you have to learn a whole new system with new "gotchas".

- **Collaborative editing wasn't designed for in advance.** Often the editor's internal representation of data made it impossible to use to for a realtime, collaborative editing use case without basically rewriting the editor.

- **The repostories were monolithic, not small and reusable.** The code bases for many of the editors often didn't expose the internal tooling that could have been re-used by developers, leading to having to reinvent the wheel.

- **Building complex, nested documents was impossible.** Many editors were designed around simplistic "flat" documents, making things like tables, embeds and captions difficult to reason about and sometimes impossible.

Of course not every editor exhibits all of these issues, but if you've tried using another editor you might have run into similar problems. To get around the limitations of their API's and achieve the user experience you're after, you have to resort to very hacky things. And some experiences are just plain impossible to achieve.

If that sounds familiar, you might like Slate.

Which brings me to how Slate solves all of that...

## Principles

Slate tries to solve the question of "[Why?](#why)" with a few principles:

1. **First-class plugins.** The most important part of Slate is that plugins are first-class entities. That means you can _completely_ customize the editing experience, to build complex editors like Medium's or Dropbox's, without having to fight against the library's assumptions.

2. **Schema-less core.** Slate's core logic assumes very little about the schema of the data you'll be editing, which means that there are no assumptions baked into the library that'll trip you up when you need to go beyond the most basic use cases.

3. **Nested document model.** The document model used for Slate is a nested, recursive tree, just like the DOM itself. This means that creating complex components like tables or nested block quotes are possible for advanced use cases. But it's also easy to keep it simple by only using a single level of hierarchy.

4. **Parallel to the DOM.** Slate's data model is based on the DOM—the document is a nested tree, it uses selections and ranges, and it exposes all the standard event handlers. This means that advanced behaviors like tables or nested block quotes are possible. Pretty much anything you can do in the DOM, you can do in Slate.

5. **Intuitive commands.** Slate documents are edited using "commands", that are designed to be high-level and extremely intuitive to write and read, so that custom functionality is as expressive as possible. This greatly increases your ability to reason about your code.

6. **Collaboration-ready data model.** The data model Slate uses—specifically how operations are applied to the document—has been designed to allow for collaborative editing to be layered on top, so you won't need to rethink everything if you decide to make your editor collaborative.

7. **Clear "core" boundaries.** With a plugin-first architecture, and a schema-less core, it becomes a lot clearer where the boundary is between "core" and "custom", which means that the core experience doesn't get bogged down in edge cases.

## Demo

Check out the [**live demo**](http://slatejs.org) of all of the examples!

## Examples

To get a sense for how you might use Slate, check out a few of the examples:

- [**Plain text**](https://www.slatejs.org/examples/plaintext) — showing the most basic case: a glorified `<textarea>`.
- [**Rich text**](https://www.slatejs.org/examples/richtext) — showing the features you'd expect from a basic editor.
- [**Markdown preview**](https://www.slatejs.org/examples/markdown-preview) — showing how to add key handlers for Markdown-like shortcuts.
- [**Links**](https://www.slatejs.org/examples/links) — showing how wrap text in inline nodes with associated data.
- [**Images**](https://www.slatejs.org/examples/images) — showing how to use void (text-less) nodes to add images.
- [**Hovering menu**](https://www.slatejs.org/examples/hovering-menu) — showing how a contextual hovering menu can be implemented.
- [**Tables**](https://www.slatejs.org/examples/tables) — showing how to nest blocks to render more advanced components.
- [**Paste HTML**](https://www.slatejs.org/examples/paste-html) — showing how to use an HTML serializer to handle pasted HTML.
- [**Mentions**](https://www.slatejs.org/examples/mentions) — showing how to use inline void nodes for simple @-mentions.

Each example includes a **View Source** link to the code that implements it. And we have [other examples](https://github.com/ianstormtaylor/slate/tree/master/site/examples) too.

If you have an idea for an example that shows a common use case, pull request it!

## Documentation

If you're using Slate for the first time, check out the [Getting Started](http://docs.slatejs.org/walkthroughs/01-installing-slate) walkthroughs and the [Concepts](http://docs.slatejs.org/concepts) to familiarize yourself with Slate's architecture and mental models.

- [**Walkthroughs**](http://docs.slatejs.org/walkthroughs)
- [**Concepts**](http://docs.slatejs.org/concepts)
- [**FAQ**](http://docs.slatejs.org/general/faq)
- [**Resources**](http://docs.slatejs.org/general/resources)

If even that's not enough, you can always [read the source itself](https://github.com/ianstormtaylor/slate/tree/master/packages), which is heavily commented.

There are also translations of the documentation into other languages:

- [中文](https://doodlewind.github.io/slate-doc-cn/)

If you're maintaining a translation, feel free to pull request it here!

## Contributing!

All contributions are super welcome! Check out the [Contributing instructions](../Contributing.md) for more info!

Slate is [MIT-licensed](../License.md).
