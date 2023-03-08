# Serializing

Slate's data model has been built with serialization in mind. Specifically, its text nodes are defined in a way that makes them easier to read at a glance, but also easy to serialize to common formats like HTML and Markdown.

And, because Slate uses plain JSON for its data, you can write serialization logic very easily.

## Plaintext

For example, taking the value of an editor and returning plaintext:

```javascript
import { Node } from 'slate'

const serialize = nodes => {
  return nodes.map(n => Node.string(n)).join('\n')
}
```

Here we're taking the children nodes of an `Editor` as a `nodes` argument, and returning a plaintext representation where each top-level node is separated by a single `\n` new line character.

For an input of:

```javascript
const nodes = [
  {
    type: 'paragraph',
    children: [{ text: 'An opening paragraph...' }],
  },
  {
    type: 'quote',
    children: [{ text: 'A wise quote.' }],
  },
  {
    type: 'paragraph',
    children: [{ text: 'A closing paragraph!' }],
  },
]
```

You'd end up with:

```text
An opening paragraph...
A wise quote.
A closing paragraph!
```

Notice how the quote block isn't distinguishable in any way, that's because we're talking about plaintext. But you can serialize the data to anything you want—it's just JSON after all.

## HTML

For example, here's a similar `serialize` function for HTML:

```javascript
import escapeHtml from 'escape-html'
import { Text } from 'slate'

const serialize = node => {
  if (Text.isText(node)) {
    let string = escapeHtml(node.text)
    if (node.bold) {
      string = `<strong>${string}</strong>`
    }
    return string
  }

  const children = node.children.map(n => serialize(n)).join('')

  switch (node.type) {
    case 'quote':
      return `<blockquote><p>${children}</p></blockquote>`
    case 'paragraph':
      return `<p>${children}</p>`
    case 'link':
      return `<a href="${escapeHtml(node.url)}">${children}</a>`
    default:
      return children
  }
}
```

This one is a bit more aware than the plaintext serializer above. It's actually _recursive_ so that it can keep iterating deeper through a node's children until it gets to the leaf text nodes. And for each node it receives, it converts it to an HTML string.

It also takes a single node as input instead of an array, so if you passed in an editor like:

```javascript
const editor = {
  children: [
    {
      type: 'paragraph',
      children: [
        { text: 'An opening paragraph with a ' },
        {
          type: 'link',
          url: 'https://example.com',
          children: [{ text: 'link' }],
        },
        { text: ' in it.' },
      ],
    },
    {
      type: 'quote',
      children: [{ text: 'A wise quote.' }],
    },
    {
      type: 'paragraph',
      children: [{ text: 'A closing paragraph!' }],
    },
  ],
  // `Editor` objects also have other properties that are omitted here...
}
```

You'd receive back \(line breaks added for legibility\):

```markup
<p>An opening paragraph with a <a href="https://example.com">link</a> in it.</p>
<blockquote><p>A wise quote.</p></blockquote>
<p>A closing paragraph!</p>
```

It's really that easy!

## Deserializing

Another common use case in Slate is doing the reverse—deserializing. This is when you have some arbitrary input and want to convert it into a Slate-compatible JSON structure. For example, when someone pastes HTML into your editor and you want to ensure it gets parsed with the proper formatting for your editor.

Slate has a built-in helper for this: the `slate-hyperscript` package.

The most common way to use `slate-hyperscript` is for writing JSX documents, for example when writing tests. You might use it like so:

```jsx
/** @jsx jsx */
import { jsx } from 'slate-hyperscript'

const input = (
  <fragment>
    <element type="paragraph">A line of text.</element>
  </fragment>
)
```

And the JSX feature of your compiler \(Babel, TypeScript, etc.\) would turn that `input` variable into:

```javascript
const input = [
  {
    type: 'paragraph',
    children: [{ text: 'A line of text.' }],
  },
]
```

This is great for test cases, or places where you want to be able to write a lot of Slate objects in a very readable form.

However! This doesn't help with deserialization.

But `slate-hyperscript` isn't only for JSX. It's just a way to build _trees of Slate content_. Which happens to be exactly what you want to do when you're deserializing something like HTML.

For example, here's a `deserialize` function for HTML:

```javascript
import { jsx } from 'slate-hyperscript'

const deserialize = (el, markAttributes = {}) => {
  if (el.nodeType === Node.TEXT_NODE) {
    return jsx('text', markAttributes, el.textContent)
  } else if (el.nodeType !== Node.ELEMENT_NODE) {
    return null
  }

  const nodeAttributes = { ...markAttributes }

  // define attributes for text nodes
  switch (el.nodeName) {
    case 'STRONG':
      nodeAttributes.bold = true
  }

  const children = Array.from(el.childNodes)
    .map(node => deserialize(node, nodeAttributes))
    .flat()

  if (children.length === 0) {
    children.push(jsx('text', nodeAttributes, ''))
  }

  switch (el.nodeName) {
    case 'BODY':
      return jsx('fragment', {}, children)
    case 'BR':
      return '\n'
    case 'BLOCKQUOTE':
      return jsx('element', { type: 'quote' }, children)
    case 'P':
      return jsx('element', { type: 'paragraph' }, children)
    case 'A':
      return jsx(
        'element',
        { type: 'link', url: el.getAttribute('href') },
        children
      )
    default:
      return children
  }
}
```

It takes in an `el` HTML element object and returns a Slate fragment. So if you have an HTML string, you can parse and deserialize it like so:

```javascript
const html = '...'
const document = new DOMParser().parseFromString(html, 'text/html')
deserialize(document.body)
```

With this input:

```markup
<p>An opening paragraph with a <a href="https://example.com">link</a> in it.</p>
<blockquote><p>A wise quote.</p></blockquote>
<p>A closing paragraph!</p>
```

You'd end up with this output:

```javascript
const fragment = [
  {
    type: 'paragraph',
    children: [
      { text: 'An opening paragraph with a ' },
      {
        type: 'link',
        url: 'https://example.com',
        children: [{ text: 'link' }],
      },
      { text: ' in it.' },
    ],
  },
  {
    type: 'quote',
    children: [
      {
        type: 'paragraph',
        children: [{ text: 'A wise quote.' }],
      },
    ],
  },
  {
    type: 'paragraph',
    children: [{ text: 'A closing paragraph!' }],
  },
]
```

And just like the serializing function, you can extend it to fit your exact domain model's needs.
