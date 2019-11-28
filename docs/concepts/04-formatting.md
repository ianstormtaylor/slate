# Formatting: Marks and Decorations

We've already seen how `Element` objects can be extended with custom properties to add semantic meaning to your rich-text documents. But there are other kinds of formatting too.

## `Mark`

Marks are the lowest level of formatting that is applied directly to the text nodes of your document, for things like **bold**, _italic_ and `code`. Their interface is:

```ts
interface Mark {
  [key: string]: any
}
```

Which means that they are entirely composed of your domain-specific custom properties. For simple cases, it can suffice to use a `type` string:

```js
const bold = { type: 'bold' }
const italic = { type: 'italic' }
```

There are multiple techniques you might choose to format or style text. You can implement styling based on inlines or marks. Unlike inlines, marks do not affect the structure of the nodes in the document. Marks simply attach themselves to the characters.

Marks may be easier to reason about and manipulate because marks do not affect the structure of the document and are associated to the characters. Marks can be applied to characters no matter how the characters are nested in the document. If you can express it as a `Range`, you can add marks to it. Working with marks instead of inlines does not require you to edit the document's structure, split existing nodes, determine where nodes are in the hierarchy, or other more complex interactions.

When marks are rendered, the characters are grouped into "leaves" of text that each contain the same set of marks applied to them. One disadvantage of marks is that you cannot guarantee how a set of marks will be ordered.

This limitation with respect to the ordering of marks is similar to the DOM, where this is invalid:

```html
<em>t<strong>e</em>x</strong>t
```

Because the elements in the above example do not properly close themselves they are invalid. Instead, you would write the above HTML as follows:

```html
<em>t</em><strong><em>e</em>x</strong>t
```

If you happened to add another overlapping section of `<strike>` to that text, you might have to rearrange the closing tags yet again. Rendering marks in Slate is similar—you can't guarantee that even though a word has one mark applied that that mark will be contiguous, because it depends on how it overlaps with other marks.

Of course, this mark ordering stuff sounds pretty complex. But, you do not have to think about it much, as long as you use marks and inlines for their intended purposes:

- Marks represent **unordered**, character-level formatting.
- Inlines represent **contiguous**, semantic elements in the document.

## Decorations

Decorations are similar to marks, with each one applying to a range of content. However, they are computed at render-time based on the content itself. This is helpful for dynamic formatting like syntax highlighting or search keywords, where changes to the content (or some external data) has the potential to change the formatting.
