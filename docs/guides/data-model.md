# Data Model

Slate is based on an immutable data model that closely resembles the DOM. When you start using Slate, one of the most important things to do is familiarize yourself with this data model. This guide will help you do just that!

## Slate Mirrors the DOM

One of the main principles of Slate is that it tries to mirror the native DOM API's as much as possible.

Mirroring the DOM is an intentional decision given Slate is a richer implementation of `contenteditable,` which uses the DOM. And people use the DOM to represent documents with rich-text-like structures all the time. Mirroring the DOM helps make the library familiar for new users, and it lets us reuse battle-tested patterns without having to reinvent them ourselves.

Because it mirrors the DOM, Slate's data model features a [`Document`](../reference/slate/document.md) with [`Block`](../reference/slate/block.md), [`Inline`](../reference/slate/inline.md) and [`Text`](../reference/slate/text.md) nodes. You can reference parts of the document with a [`Range`](../reference/slate/range.md). And there is a special range-like object called a [`Selection`](../reference/slate/selection.md) that represents the user's current cursor selection.

> The following content on Mozilla's Developer Network may help you learn more about the corresponding DOM concepts:
>
> * [Document](https://developer.mozilla.org/en-US/docs/Web/API/Document)
> * [Block Elements](https://developer.mozilla.org/en-US/docs/Web/HTML/Block-level_elements)
> * [Inline elements](https://developer.mozilla.org/en-US/docs/Web/HTML/Inline_elements)
> * [Text elements](https://developer.mozilla.org/en-US/docs/Web/API/Text)

## Immutable Objects

Slate's data model is implemented using [`Immutable.js`](https://immutable-js.github.io/immutable-js/) objects to allow more performant rendering and ensure objects cannot be accidentally modified (which are especially tricky bugs to track down).

Specifically, Slate's models are [`Immutable.Record`](https://immutable-js.github.io/immutable-js/docs/#/Record) objects, which makes them very similar to JavaScript objects for retrieving values:

```js
const block = Block.create({ type: 'paragraph' })

block.object // "block"
block.type // "paragraph"
```

Changing values requires you to use the [`Immutable.Record` API](https://immutable-js.github.io/immutable-js/docs/#/Record/set).

Collections of Slate objects are represented as immutable `Lists`, `Sets`, `Stacks`, etc, which means we enjoy expressive methods like `filter`, `includes`, `take`, `skip`, `rest` and `last`.

If you haven't used [`Immutable.js`](https://immutable-js.github.io/immutable-js/) before, there is definitely a learning curve. Before you dive into Slate, you are encouraged to become familiar the [Immutable.js documentation](https://immutable-js.github.io/immutable-js/docs/#/). Once you get the hang of the Immutable JS API you'll be quite productive. It might take a few days to get used to Immutable JS. And, you might write some suboptimal code at first. Don't let this discourage you! Learning Immutable JS is well worth the investment!

## The "Value"

The top-level object in Slate—the object encapsulating the entire value of a Slate editor—is called a [`Value`](../reference/slate/value.md).

Value consists of the document which contains all content, and a `selection` representing the user's current cursor selection. Value also has a few other advanced properties such as `decorations` and `data`.

> 📋 For more info, check out the [`Value` reference](../reference/slate/value.md).

The following example illustrates a simple Slate value which has been serialized and logged to the console. Continue reading to learn more about the data types represented.

```json
{
  "object": "value",
  "document": {
    "object": "document",
    "data": {},
    "nodes": [
      {
        "object": "block",
        "type": "paragraph",
        "data": {},
        "nodes": [
          {
            "object": "text",
            "leaves": [
              {
                "object": "leaf",
                "text": "A line of text in a paragraph.",
                "marks": []
              }
            ]
          }
        ]
      }
    ]
  }
}
```

## Documents and Nodes

A Slate document is a nested and recursive structure. In a document block nodes can have child nodes—all which may have child nodes without limit. The nested and recursive structure enable you to model simple behaviors such as user mentions and hashtags or complex behaviors such as tables and figures with captions.

Unlike the DOM, Slate offers some constraints to prevent "impossible" situations from occurring. Slate's constraints include:

* **Documents must have block nodes as direct children.** This constraint mirrors how rich-text editors work. The top-most elements are blocks that may be split when pressing <kbd>Enter</kbd>.

* **Blocks may contain either only block nodes, or a combination of inline and text nodes.** This constraint helps you avoid boilerplate `if` statements. You can trust blocks either wrap (a) exclusively blocks, or (b) a combination of non-block nodes made up of inline and/or text nodes.

* **Inlines can only contain inline or text nodes.** This constraint helps you avoid boilerplate code. When working within the context of an inline you can trust the contents do not contain blocks.

* **Text nodes cannot be adjacent to other text nodes.** Any two adjacent text nodes will automatically be merged into one by Slate which prevents ambiguous cases where a cursor could be at the end of one text node or at the start of the next. However, you may have an inline node surrounded by two texts.

* **Blocks and inlines must always contain at least one text node.** This constraint ensures that the user's cursor can always "enter" the nodes and that ranges can be created referencing them.

Slate enforces all of these constraints for you automatically. As you [run commands](./commands-and-queries.md) to manipulate the document, Slate will normalize the value if it determines the document violates any of these constraints.

> 🙃 Fun fact: "normalizing" is actually based on the DOM's [`Node.normalize()`](https://developer.mozilla.org/en-US/docs/Web/API/Node/normalize)!

In addition to documents, blocks and inlines, Slate introduces one other type of markup that the DOM does not have natively, the [`Mark`](../reference/slate/mark.md) which is used for formatting.

## Marks

Marks are how Slate represents formatting data that is attached to the characters in the text itself. Standard formatting such as **bold**, _italic_, `code`, or custom formatting for your application can be implemented using marks.

There are multiple techniques you might choose to format or style text. You can implement styling based on inlines or marks. Unlike inlines, marks do not affect the structure of the nodes in the document. Marks simply attach themselves to the characters.

Marks may be easier to reason about and manipulate because marks do not affect the structure of the document and are associated to the characters. Marks can be applied to characters no matter how the characters are nested in the document. If you can express it as a `Range`, you can add marks to it. Working with marks instead of inlines does not require you to edit the document's structure, split existing nodes, determine where nodes are in the hierarchy, or other more complex interactions.

When marks are rendered, the characters are grouped into "leaves" of text that each contain the same set of marks applied to them. One disadvantage of marks is that you cannot guarantee how a set of marks will be ordered.

This limitation with respect to the ordering of marks is similar to the DOM, where this is invalid:

<!-- prettier-ignore -->
```html
<em>t<strong>e</em>x</strong>t
```

Because the elements in the above example do not properly close themselves they are invalid. Instead, you would write the above HTML as follows:

```html
<em>t</em><strong><em>e</em>x</strong>t
```

If you happened to add another overlapping section of `<strike>` to that text, you might have to rearrange the closing tags yet again. Rendering marks in Slate is similar—you can't guarantee that even though a word has one mark applied that that mark will be contiguous, because it depends on how it overlaps with other marks.

Of course, this mark ordering stuff sounds pretty complex. But, you do not have to think about it much, as long as you use marks and inlines for their intended purposes:

* Marks represent **unordered**, character-level formatting.
* Inlines represent **contiguous**, semantic elements in the document.

## Ranges, Points and "The Selection"

Just like the DOM, you can reference a part of the document using a `Range`. Slate keeps track of a the user's current cursor selection using a range called the `Selection`.

Ranges are defined by two `Point`s:

* **Anchor point** is where the range starts
* **Focus point** is where the range ends

> Note: The terms "anchor" and "focus" are borrowed from the DOM API (see [anchor](https://developer.mozilla.org/en-US/docs/Web/API/Selection/anchorNode) and [focus](https://developer.mozilla.org/en-US/docs/Web/API/Selection/focusNode)).

Each point is a combination of a "path" or "key" referencing a specific node, and an "offset". This ends up looking like this:

```js
const range = Range.create({
  anchor: {
    key: 'node-a',
    path: [0, 2, 1],
    offset: 0,
  },
  focus: {
    key: 'node-b',
    path: [0, 3, 2],
    offset: 4,
  },
})
```

> Note: Every node has a unique `key` property. The above psuedocode references `node-a` and `node-b`; however, Slate uses auto-incrementing numerical strings by default—`'1', '2', '3', ...`.

An anchor and focus are established by a user interaction. The anchor point isn't always _before_ the focus point in the document. Just like in the DOM, the ordering of an anchor and selection point depend on whether the range is backwards or forwards.

Here's how Mozilla Developer Network explains it:

> A user may make a selection from left to right (in document order) or right to left (reverse of document order). The anchor is where the user began the selection and the focus is where the user ends the selection. If you make a selection with a desktop mouse, the anchor is placed where you pressed the mouse button and the focus is placed where you released the mouse button. Anchor and focus should not be confused with the start and end positions of a selection, since anchor can be placed before the focus or vice versa, depending on the direction you made your selection.
> — [`Selection`, MDN](https://developer.mozilla.org/en-US/docs/Web/API/Selection)

To make working with ranges easier, `Range` objects also provide both `start` and `end` point properties that consider whether the range is forward or backward into account. The `start.key` and `start.path` will always be before the `end.key` and `end.path` in the document to provide you with intuitive methods of working with ranges.

Typically, you will utilize `start` and `end` points since you rarely care which side of the selection is "extendable".

One important thing to note is that the anchor and focus points of ranges **always reference the "leaf-most" text nodes** in a document and never reference blocks or inlines. Said differently ranges always reference child text nodes. This range behavior is different than the DOM API and simplifies working with ranges as there are fewer edge cases for you to handle.

> 📋 For more info, check out the [`Range` reference](../reference/slate/range.md).

The `Selection` model contains slightly more information than the `Range` model because it is responsible for tracking the "focus" and "marks" for the user. Example:

```js
const selection = Selection.create({
  anchor: {
    key: 'node-a',
    path: [0, 2, 1],
    offset: 0,
  },
  focus: {
    key: 'node-b',
    path: [0, 3, 2],
    offset: 4,
  },
  isFocused: true,
  marks: [{ type: 'bold' }],
})
```

However, keeping the `key` and `path` of ranges or selections synchronized yourself is tedious. Instead, you can create selections using either option and have the other automatically be inferred by the document. To do so, you use the `createRange` and `createSelection` methods:

```js
const selection = document.createSelection({
  anchor: {
    key: 'node-a',
    offset: 0,
  },
  focus: {
    key: 'node-b',
    offset: 4,
  },
  isFocused: true,
  marks: [{ type: 'bold' }],
})
```

The resulting `selection` will have a both the `key` and `path` set for its points, with the `key` being used to look up the `path` in the document.
