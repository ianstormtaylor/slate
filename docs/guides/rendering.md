# Rendering

One of the best parts of Slate is that it's built with React, so it fits right into your existing application. It doesn't re-invent its own view layer that you have to learn. It tries to keep everything as React-y as possible.

To that end, Slate gives you control over the rendering behavior of every node and mark in your document, any placeholders you want to render, and even the top-level editor itself.

You can define these behaviors by passing `props` into the editor, or you can define them in Slate plugins.

## Nodes & Marks

Using custom components for the nodes and marks is the most common rendering need. Slate makes this easy to do, you just define a `renderNode` function.

The function is called with the node's props, including `props.node` which is the node itself. You can use these to determine what to render. For example, you can render nodes using simple HTML elements:

```js
function renderNode(props, next) {
  const { node, attributes, children } = props

  switch (node.type) {
    case 'paragraph':
      return <p {...attributes}>{children}</p>
    case 'quote':
      return <blockquote {...attributes}>{children}</blockquote>
    case 'image': {
      const src = node.data.get('src')
      return <img {...attributes} src={src} />
    }
    default:
      return next()
  }
}
```

> 🤖 Be sure to mix in `props.attributes` and render `props.children` in your node components! The attributes are required for utilities like Slate's `findDOMNode`, and the children are the actual text content of your nodes.

You don't have to use simple HTML elements, you can use your own custom React components too:

```js
function renderNode(props, next) {
  switch (props.node.type) {
    case 'paragraph':
      return <ParagraphComponent {...props} />
    case 'quote':
      return <QuoteComponent {...props} />
    case 'image':
      return <ImageComponent {...props} />
    default:
      return next()
  }
}
```

And you can just as easily put that `renderNode` logic into a plugin, and pass that plugin into your editor instead:

```js
function SomeRenderingPlugin() {
  return {
    renderNode(props, next) {
      ...
    }
  }
}

const plugins = [
  SomeRenderingPlugin(),
  ...
]

<Editor
  plugins={plugins}
  ...
/>
```

Marks work the same way, except they invoke the `renderMark` function. Like so:

```js
function renderMark(props, next) {
  const { children, mark, attributes } = props
  switch (mark.type) {
    case 'bold':
      return <strong {...{ attributes }}>{children}</strong>
    case 'italic':
      return <em {...{ attributes }}>{children}</em>
    case 'code':
      return <code {...{ attributes }}>{children}</code>
    case 'underline':
      return <u {...{ attributes }}>{children}</u>
    case 'strikethrough':
      return <strike {...{ attributes }}>{children}</strike>
    default:
      return next()
  }
}
```

Be sure to mix `props.attributes` in your `renderMark`. `attributes` provides `data-*` dom attributes for spell-check in non-IE browsers.

That way, if you happen to have a global stylesheet that defines `strong`, `em`, etc. styles then your editor's content will already be formatted!

> 🤖 Be aware though that marks aren't guaranteed to be "contiguous". Which means even though a **word** is bolded, it's not guaranteed to render as a single `<strong>` element. If some of its characters are also italic, it might be split up into multiple elements—one `<strong>wo</strong>` and one `<em><strong>rd</strong></em>`.

## Placeholders

By default Slate will render a placeholder for you which mimics the native DOM `placeholder` attribute of `<input>` and `<textarea>` elements—it's in the same typeface as the editor, and it's slightly translucent. And as soon as the document has any content, the placeholder disappears.

However sometimes you want to customize things. Or maybe you want to render placeholders inside specific blocks like inside an image caption. To do that, you can define your own `renderPlaceholder` function:

```js
function renderPlaceholder(props, next) {
  const { node, editor } = props
  if (node.object != 'block') return next()
  if (node.type != 'caption') return next()
  if (node.text != '') return next()

  return (
    <span
      contentEditable={false}
      style={{ display: 'inline-block', width: '0', whiteSpace: 'nowrap', opacity: '0.33' }}
    >
      {editor.props.placeholder}
    </span>
  )
}

<Editor
  renderPlaceholder={renderPlaceholder}
  ...
/>
```

That will render a simple placeholder element inside all of your `caption` blocks until someone decides to write in a caption.

## The Editor Itself

Not only can you control the rendering behavior of the components inside the editor, but you can also control the rendering of the editor itself.

This sounds weird, but it can be pretty useful if you want to render additional top-level elements from inside a plugin. To do so, you use the `renderEditor` function:

```js
function renderEditor(props, next) {
  const { editor } = props
  const wordCount = countWords(editor.value.text)
  const children = next()
  return (
    <React.Fragment>
      {children}
      <span className="word-count">{wordCount}</span>
    </React.Fragment>
  )
}

<Editor
  renderEditor={renderEditor}
  ...
/>
```

Here we're rendering a small word count number underneath all of the content of the editor. Whenever you change the content of the editor, `renderEditor` will be called, and the word count will be updated.

This is very similar to how higher-order components work! Except it allows each plugin in Slate's plugin stack to wrap the editor's children.

> 🤖 Be sure to remember to render `children` in your `renderEditor` functions, because that contains the editor's own elements!
