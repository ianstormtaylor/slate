<br/>
<p align="center"><strong>Previous:</strong><br/><a href="./saving-to-a-database.md">Saving to a Database</a></p>
<br/>

# Saving and Loading HTML Content

In the previous guide, we looked at how to serialize the Slate editor's content and save it for later. What if you want to save the content as HTML? It's a slightly more involved process, but this guide will show you how to do it.

Let's start with a basic editor:

```js
import { Editor } from 'slate-react'
import Plain from 'slate-plain-serializer'

class App extends React.Component {
  state = {
    value: Plain.deserialize(''),
  }

  onChange = ({ value }) => {
    this.setState({ value })
  }

  render() {
    return <Editor value={this.state.value} onChange={this.onChange} />
  }
}
```

That will render a basic Slate editor on your page.

Now... we need to add the [`Html`](../reference/slate-html-serializer/index.md) serializer. And to do that, we need to tell it a bit about the schema we plan on using. For this example, we'll work with a schema that has a few different parts:

* A `paragraph` block.
* A `code` block for code samples.
* A `quote` block for quotes...
* And `bold`, `italic` and `underline` formatting.

By default, the `Html` serializer knows nothing about our schema, just like Slate itself. To fix this, we need to pass it a set of `rules`. Each rule defines how to serialize and deserialize a Slate object.

To start, let's create a new rule with a `deserialize` function for paragraph blocks.

```js
const rules = [
  // Add our first rule with a deserializing function.
  {
    deserialize(el, next) {
      if (el.tagName.toLowerCase() == 'p') {
        return {
          object: 'block',
          type: 'paragraph',
          data: {
            className: el.getAttribute('class'),
          },
          nodes: next(el.childNodes),
        }
      }
    },
  },
]
```

The `el` argument that the `deserialize` function receives is just a DOM element. And the `next` argument is a function that will deserialize any element(s) we pass it, which is how you recurse through each node's children.

Okay, that's `deserialize`, now let's define the `serialize` property of the paragraph rule as well:

```js
const rules = [
  {
    deserialize(el, next) {
      if (el.tagName.toLowerCase() == 'p') {
        return {
          object: 'block',
          type: 'paragraph',
          data: {
            className: el.getAttribute('class'),
          },
          nodes: next(el.childNodes),
        }
      }
    },
    // Add a serializing function property to our rule...
    serialize(obj, children) {
      if (obj.object == 'block' && obj.type == 'paragraph') {
        return <p className={obj.data.get('className')}>{children}</p>
      }
    },
  },
]
```

The `serialize` function should also feel familiar. It's just taking [Slate models](../reference/slate) and turning them into React elements, which will then be rendered to an HTML string.

The `object` argument of the `serialize` function will either be a [`Node`](../reference/slate/node.md), a [`Mark`](../reference/slate/mark.md) or a special immutable [`String`](../reference/serializers/html.md#ruleserialize) object. And the `children` argument is a React element describing the nested children of the object in question, for recursing.

Okay, so now our serializer can handle `paragraph` nodes.

Let's add the other types of blocks we want:

```js
// Refactor block tags into a dictionary for cleanliness.
const BLOCK_TAGS = {
  p: 'paragraph',
  blockquote: 'quote',
  pre: 'code',
}

const rules = [
  {
    // Switch deserialize to handle more blocks...
    deserialize(el, next) {
      const type = BLOCK_TAGS[el.tagName.toLowerCase()]
      if (type) {
        return {
          object: 'block',
          type: type,
          data: {
            className: el.getAttribute('class'),
          },
          nodes: next(el.childNodes),
        }
      }
    },
    // Switch serialize to handle more blocks...
    serialize(obj, children) {
      if (obj.object == 'block') {
        switch (obj.type) {
          case 'paragraph':
            return <p className={obj.data.get('className')}>{children}</p>
          case 'quote':
            return <blockquote>{children}</blockquote>
          case 'code':
            return (
              <pre>
                <code>{children}</code>
              </pre>
            )
        }
      }
    },
  },
]
```

Now each of our block types is handled.

You'll notice that even though code blocks are nested in a `<pre>` and a `<code>` element, we don't need to specifically handle that case in our `deserialize` function, because the `Html` serializer will automatically recurse through `el.childNodes` if no matching deserializer is found. This way, unknown tags will just be skipped over in the tree, instead of their contents omitted completely.

Okay. So now our serializer can handle blocks, but we need to add our marks to it as well. Let's do that with a new rule...

```js
const BLOCK_TAGS = {
  blockquote: 'quote',
  p: 'paragraph',
  pre: 'code',
}

// Add a dictionary of mark tags.
const MARK_TAGS = {
  em: 'italic',
  strong: 'bold',
  u: 'underline',
}

const rules = [
  {
    deserialize(el, next) {
      const type = BLOCK_TAGS[el.tagName.toLowerCase()]
      if (type) {
        return {
          object: 'block',
          type: type,
          data: {
            className: el.getAttribute('class'),
          },
          nodes: next(el.childNodes),
        }
      }
    },
    serialize(obj, children) {
      if (obj.object == 'block') {
        switch (obj.type) {
          case 'code':
            return (
              <pre>
                <code>{children}</code>
              </pre>
            )
          case 'paragraph':
            return <p className={obj.data.get('className')}>{children}</p>
          case 'quote':
            return <blockquote>{children}</blockquote>
        }
      }
    },
  },
  // Add a new rule that handles marks...
  {
    deserialize(el, next) {
      const type = MARK_TAGS[el.tagName.toLowerCase()]
      if (type) {
        return {
          object: 'mark',
          type: type,
          nodes: next(el.childNodes),
        }
      }
    },
    serialize(obj, children) {
      if (obj.object == 'mark') {
        switch (obj.type) {
          case 'bold':
            return <strong>{children}</strong>
          case 'italic':
            return <em>{children}</em>
          case 'underline':
            return <u>{children}</u>
        }
      }
    },
  },
]
```

Great, that's all of the rules we need! Now let's create a new `Html` serializer and pass in those rules:

```js
import Html from 'slate-html-serializer'

// Create a new serializer instance with our `rules` from above.
const html = new Html({ rules })
```

And finally, now that we have our serializer initialized, we can update our app to use it to save and load content, like so:

```js
// Load the initial value from Local Storage or a default.
const initialValue = localStorage.getItem('content') || '<p></p>'

class App extends React.Component {
  state = {
    value: html.deserialize(initialValue),
  }

  onChange = ({ value }) => {
    // When the document changes, save the serialized HTML to Local Storage.
    if (value.document != this.state.value.document) {
      const string = html.serialize(value)
      localStorage.setItem('content', string)
    }

    this.setState({ value })
  }

  render() {
    return (
      <Editor
        value={this.state.value}
        onChange={this.onChange}
        // Add the ability to render our nodes and marks...
        renderNode={this.renderNode}
        renderMark={this.renderMark}
      />
    )
  }

  renderNode = (props, editor, next) => {
    switch (props.node.type) {
      case 'code':
        return (
          <pre {...props.attributes}>
            <code>{props.children}</code>
          </pre>
        )
      case 'paragraph':
        return (
          <p {...props.attributes} className={node.data.get('className')}>
            {props.children}
          </p>
        )
      case 'quote':
        return <blockquote {...props.attributes}>{props.children}</blockquote>
      default:
        return next()
    }
  }

  // Add a `renderMark` method to render marks.
  renderMark = (props, editor, next) => {
    const { mark, attributes } = props
    switch (mark.type) {
      case 'bold':
        return <strong {...attributes}>{props.children}</strong>
      case 'italic':
        return <em {...attributes}>{props.children}</em>
      case 'underline':
        return <u {...attributes}>{props.children}</u>
      default:
        return next()
    }
  }
}
```

And that's it! When you make any changes in your editor, you should see the updated HTML being saved to Local Storage. And when you refresh the page, those changes should be carried over.
