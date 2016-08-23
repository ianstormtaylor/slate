
# Examples

![](../docs/images/preview.png)

This directory contains a set of examples that give you an idea for how you might use Slate to implement your own editor. Take a look around!

- [**Plain text**](./plain-text) — showing the most basic case: a glorified `<textarea>`.
- [**Rich text**](./rich-text) — showing the features you'd expect from a basic editor.
- [**Auto-markdown**](./auto-markdown) — showing how to add key handlers for Markdown-like shortcuts.
- [**Links**](./links) — showing how wrap text in inline nodes with associated data.
- [**Images**](./images) — showing how to use void (text-less) nodes to add images.
- [**Hovering menu**](./hovering-menu) — showing how a contextual hovering menu can be implemented.
- [**Tables**](./tables) — showing how to nest blocks to render more advanced components.
- [**Paste HTML**](./paste-html) — showing how to use an HTML serializer to handle pasted HTML.
- [**Code Highlighting**](./code-highlighting) — showing how to use decorators to dynamically mark text.

If you have an idea for an example that shows a common use case, pull request it!


## Running the Examples

To get the examples running on your machine, you need to have the Slate repository cloned to your computer. After that, you need to `cd` into the directory where you cloned it, and install the dependencies from `npm`.

```
npm install
```

Which will also build the source. Then build the examples:

```
npm run examples
```

And then run the examples server:

```
npm start
```

Now you can open up `http://localhost:8080` in your browser and you'll see the examples site.

If you want to edit the source while running the examples and have those changes immediately reflected, you can use the `watch` command instead, which will watch the source files for changes while running the server:

```
npm run watch
```


## Development Examples

There are also a series of examples that are for development only, for things like checking performance, in the `./development` directory. You can safely ignore those!
