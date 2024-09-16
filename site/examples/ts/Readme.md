# Examples

This directory contains a set of examples that give you an idea for how you might use Slate to implement your own editor. Take a look around!

- [**Plain text**](./plaintext.tsx) — showing the most basic case: a glorified `<textarea>`.
- [**Rich text**](./richtext.tsx) — showing the features you'd expect from a basic editor.
- [**Forced Layout**](./forced-layout.tsx) - showing how to use constraints to enforce a document structure.
- [**Markdown Shortcuts**](./markdown-shortcuts.tsx) — showing how to add key handlers for Markdown-like shortcuts.
- [**Inlines**](./inlines.tsx) — showing how wrap text in inline nodes with associated data.
- [**Images**](./images.tsx) — showing how to use void (text-less) nodes to add images.
- [**Hovering toolbar**](./hovering-toolbar.tsx) — showing how a hovering toolbar can be implemented.
- [**Tables**](./tables.tsx) — showing how to nest blocks to render more advanced components.
- [**Paste HTML**](./paste-html.tsx) — showing how to use an HTML serializer to handle pasted HTML.
- [**Code Highlighting**](./code-highlighting.tsx) — showing how to use decorations to dynamically format text.
- ...and more!

If you have an idea for an example that shows a common use case, pull request it!

## Running the Examples

To get the examples running on your machine, you need to have the Slate repository cloned to your computer. After that, you need to `cd` into the directory where you cloned it, and install the dependencies with `yarn` and build the monorepo:

```sh
yarn install
yarn build
```

Then start the watcher and examples server:

```sh
yarn start
```

Now you can open up `http://localhost:3000` in your browser and you'll see the examples site. Any changes you make to the source code will be immediately reflected when you refresh the page. You can open the examples URL quickly with:

```sh
yarn open
```
