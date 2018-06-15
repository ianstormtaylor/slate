# Examples

![](../docs/images/preview.png)

This directory contains a set of examples that give you an idea for how you might use Slate to implement your own editor. Take a look around!

* [**Plain text**](./plain-text) — showing the most basic case: a glorified `<textarea>`.
* [**Rich text**](./rich-text) — showing the features you'd expect from a basic editor.
* [**Forced Layout**](./forced-layout) - showing how to use schema rules to enforce document structure
* [**Auto-markdown**](./auto-markdown) — showing how to add key handlers for Markdown-like shortcuts.
* [**Links**](./links) — showing how wrap text in inline nodes with associated data.
* [**Images**](./images) — showing how to use void (text-less) nodes to add images.
* [**Hovering menu**](./hovering-menu) — showing how a contextual hovering menu can be implemented.
* [**Tables**](./tables) — showing how to nest blocks to render more advanced components.
* [**Paste HTML**](./paste-html) — showing how to use an HTML serializer to handle pasted HTML.
* [**Code Highlighting**](./code-highlighting) — showing how to use decorators to dynamically mark text.
* ...and more!

If you have an idea for an example that shows a common use case, pull request it!

## Running the Examples

To get the examples running on your machine, you need to have the Slate repository cloned to your computer. After that, you need to `cd` into the directory where you cloned it, and install the dependencies with `yarn` and build the monorepo:

```
yarn install
yarn build
```

Then start the watcher and examples server:

```
yarn start
```

Now you can open up `http://localhost:8080` in your browser and you'll see the examples site. Any changes you make to the source code will be immediately reflected when you refresh the page. You can open the examples URL quickly with:

```
yarn open
```
