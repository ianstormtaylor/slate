# Data Model

Slate is based on an immutable data model that closely resembles the DOM. When you start using Slate, one of the most important things to do is familiarize yourself with this data model. This guide will help you do just that!

## Mirror the DOM

One of the main principles of Slate is that it tries to mirror the native DOM API's as much as possible.

If you think about it, this makes sense. Slate is kind of like a nicer implementation of `contenteditable`, which itself is built with the DOM. And people use the DOM to represent documents with rich-text-like structures all the time. Mirroring the DOM helps make the library familiar for new users, and it lets us reuse battle-tested patterns without having to reinvent them ourselves.

Because it mirrors the DOM, Slate's data model features a [`Document`](../slate-core/document.md) with [`Block`](../slate-core/block.md), [`Inline`](../slate-core/inline.md) and [`Text`](../slate-core/text.md) nodes. You can reference parts of the document with a [`Range`](../slate-core/range.md). And there is a special range called a "selection" that represents the user's current cursor selection.

## Immutable Objects

Slate's data model is built out of [`Immutable.js`](https://facebook.github.io/immutable-js/) objects. This allows us to make rendering much more performant, and it ensures that we don't end up with hard to track down bugs.

Specifically, Slate's models are [`Immutable.Record`](https://facebook.github.io/immutable-js/docs/#/Record) objects, which makes them very similar to Javascript objects for retrieiving values:

```javascript
const block = Block.create({ type: 'paragraph' })

block.object // "block"
block.type // "paragraph"
```

But for updating values, you'll need to use the [`Immutable.Record` API](https://facebook.github.io/immutable-js/docs/#/Record/set).

Collections of Slate objects are represented as immutable `Lists`, `Sets`, `Stacks`, etc. Which means we get nice support for expressive methods like `filter`, `includes`, `take`, `skip`, `rest`, `last`, etc.

If you haven't used Immutable.js before, there is definitely a learning curve. Before you dive into Slate, you should check out the [Immutable.js docs](https://facebook.github.io/immutable-js/docs/#/). Once you get the hang of it, it won't slow you down at all, but it will take a few days to get used to, and you might write things a little "un-performantly" to start.

## The "Value"

The top-level object in Slate—the object encapsulates the entire value of an Slate editor—is called a [`Value`](../slate-core/value.md).

It is made up of a document filled with content, and a selection representing the user's current cursor selection. It also has a history, to keep track of changes, and a few other more advanced properties like `decorations` and `data`.

> 📋 For more info, check out the [`Value` reference](../slate-core/value.md).

## Documents and Nodes

Slate documents are nested and recursive. This means that a document has block nodes, and those block nodes can have child block nodes—all the way down. This lets you model more complex nested behaviors like tables, or figures with captions.

Unlike the DOM though, Slate enforces a few more restrictions on its documents, to reduce the complexity involved in manipulating them, and to prevent "impossible" situations from arising. These restrictions are:

* **Documents can only contain block nodes as direct children.** This restriction mirrors how rich-text editors work, with the top-most elements being blocks that can be split when pressing enter.
* **Blocks can only contain either other block nodes, or inlines and text nodes.** This is another "sane" restriction that allows you to avoid lots of boilerplate `if` statements in your code. Blocks either wrap other blocks, or contain actual content.
* **Inlines can only contain inline or text nodes.** This one is also for sanity and avoiding boilerplate. Once you've descended into an "inline" context, you can't have block nodes inside them.
* **Inlines can't contain no text.** Any inline node whose text is an empty string \(`''`\) will be automatically removed. This makes sense when you think about a user backspacing through an inline. When they delete that last character, they'd expect the inline to be removed. And when there are no characters, you can't really put your selection into the inline anymore. So Slate removes them from the document automatically, to simplify things.
* **Text nodes can't be adjacent to other text nodes.** Any two adjacent text nodes will automatically be merged into one. This prevents ambiguous cases where a cursor could be at the end of one text node or at the start of the next. However, you can have an inline node surrounded by two texts.
* **Blocks and inlines must always contain at least one text node.** This is to ensure that the user's cursor can always "enter" the nodes, and to make sure that ranges can be created referencing them.

Slate enforces all of these restrictions for you automatically. Any time you [perform changes](changes.md) to the document, Slate will check if the document is invalid, and if so it will return it to a "normalized" value.

> 🙃 Fun fact: normalizing is actually based on the DOM's [`Node.normalize()`](https://developer.mozilla.org/en-US/docs/Web/API/Node/normalize)!

In addition to documents, blocks and inlines, Slate introduces one other type of markup that the DOM doesn't have natively: the [`Mark`](../slate-core/mark.md).

## Marks

Marks are how Slate represents formatting data that is attached to the characters in the text itself—things like **bold**, _italic_, `code`, or even more complex formatting like comments.

Although you can change styling based on either inlines or marks, marks differ from inlines in that they don't affect the structure of the nodes in the document, they simply attach themselves to the characters.

This makes marks easier to reason about and easier to manipulate. Because inlines involve editing the document's structure, you have to worry about things like splitting any existing nodes, what their order in the hierarchy is, etc. Marks on the other hand can be applied to characters no matter how the characters are nested in the document. If you can express it as a `Range`, you can add marks to it.

But this also has implications on how marks are rendered. When marks are rendered, the characters are grouped into "leaves" of text that each contain the same set of marks applied to them. But you cannot guarantee how a set of marks will be ordered.

This is actually similar to the DOM, where this is invalid:

```markup
<em>t<strong>e</em>x</strong>t
```

Because the elements don't properly close themselves. Instead you have to write it like this:

```markup
<em>t</em><strong><em>e</em>x</strong>t
```

And if you happened to add another overlapping section of `<strike>` to that text, you might have to rearrange the closing tags again. Rendering marks in Slate is similar—you can't guarantee that even though a word has one mark applied that that mark will be contiguous, because it depends on how it overlaps with other marks.

That all sounds pretty complex, but you don't have to think about it much, as long as you use marks and inlines for their intended purposes...

* Marks represent **unordered**, character-level formatting.
* Inlines represent **contiguous**, semantic elements in the document.

## Ranges and "The Selection"

Just like in the DOM, you can reference a part of the document using a `Range`. And there's one special range that Slate keeps track of called the "selection" that refers to the user's current cursor selection.

Ranges are defined by an "anchor" and "focus" point. The anchor is where the range starts, and the focus is where it ends. And each point is a combination of a "key" referencing a specific node, and an "offset". This ends up looking like this:

```javascript
const range = Range.create({
  anchorKey: 'node-a',
  anchorOffset: 0,
  focusKey: 'node-b',
  focusOffset: 4,
  isBackward: false,
})
```

The more readable `node-a` name is just pseudocode, because Slate uses auto-incrementing numerical strings by default—`'1', '2', '3', ...` But the important part is that every node has a unique `key` property, and a range references nodes by their keys.

The terms "anchor" and "focus" are borrowed from the DOM, where they mean the same thing. The anchor is where a range starts, and the focus is where it ends. However, be careful because the anchor point isn't always _before_ the focus point in the document. Just like in the DOM, it depends on whether the range is backwards or forwards.

Here's how MDN explains it:

> A user may make a selection from left to right \(in document order\) or right to left \(reverse of document order\). The anchor is where the user began the selection and the focus is where the user ends the selection. If you make a selection with a desktop mouse, the anchor is placed where you pressed the mouse button and the focus is placed where you released the mouse button. Anchor and focus should not be confused with the start and end positions of a selection, since anchor can be placed before the focus or vice versa, depending on the direction you made your selection.  
> — [`Selection`, MDN](https://developer.mozilla.org/en-US/docs/Web/API/Selection)

To make dealing with ranges easier though, they also provide "start" and "end" properties that take whether the range is forward or backward into account. The `startKey` and `startOffset` will always be before the `endKey` and `endOffset` in the document.

One important thing to note is that the anchor and focus points of ranges **always reference the "leaf-most" text nodes**. They never reference blocks or inlines, always their child text nodes. This makes dealing with ranges a _lot_ easier.

> 📋 For more info, check out the [`Range` reference](../slate-core/range.md).

