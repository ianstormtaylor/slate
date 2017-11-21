import Html from 'slate-html-serializer'

import { Block } from 'slate';
import { Editor } from 'slate-react'
import React from 'react'

import { preprocess } from './normalize';

const DEFAULT_NODE = 'paragraph'


// key (tag name you want to parse in html string) -> value (type name you defined in js object model)
const BLOCK_TAGS = {
  blockquote: 'block-quote',
  ol: 'numbered-list',
  ul: 'bulleted-list',
  li: 'list-item',
  h4: 'heading-four',
  p: 'paragraph',
  iframe: 'video',
  img: 'image',
}

const INLINE_TAGS = {
  a: 'link',
}

const MARK_TAGS = {
  strong: 'bold',
  code: 'code',
  em: 'italic',
}

// serialize: object to string
// deserialize: string to object
const rules = [
  {
    // handle block level element
    deserialize(el, next) {
      const type = BLOCK_TAGS[el.tagName.toLowerCase()]
      if (!type) return undefined
      // console.log('block deserialize:', el.tagName.toLowerCase());
      let data
      switch (type) {
        case 'video': {
          const videoSrc = el.getAttribute('src')
          data = { video: videoSrc }
          return {
            kind: 'block',
            type,
            nodes: next(el.childNodes),
            data,
            isVoid: true,
          }
        }
        case 'image': {
          const src = el.getAttribute('src')
          console.log('block deserialize:', src)
          return {
            kind: 'block',
            type,
            nodes: next(el.childNodes),
            data: { src },
            isVoid: true,
          }
        }
        default: return {
          kind: 'block',
          type,
          nodes: next(el.childNodes),
        }
      }
    },
    serialize(object, children) {
      if (object.kind !== 'block') return undefined
      // console.log('block serialize:', object.kind, object);
      switch (object.type) {
        case 'block-quote': return <blockquote>{children}</blockquote>
        case 'numbered-list': return <ol>{children}</ol>
        case 'bulleted-list': return <ul>{children}</ul>
        case 'list-item': return <li>{children}</li>
        case 'heading-four': return <h4>{children}</h4>
        case 'paragraph': return <p>{children}</p>
        case 'video': {
          const videoSrc = object.data.get('video')
          return <iframe src={videoSrc}>{children}</iframe>
        };
        case 'image': {
          const src = object.data.get('src')
          return <img src={src} />
        }
        default: return null
      }
    },
  },
  // handle inline level element
  {
    deserialize(el, next) {
      const type = INLINE_TAGS[el.tagName.toLowerCase()]
      if (!type) return undefined
      // console.log('inline deserialize:', el.tagName.toLowerCase());
      let data
      switch (type) {
        case 'link': {
          const href = el.getAttribute('href')
          data = { href }
          break;
        }
        default: return null
      }
      return {
        kind: 'inline',
        type,
        nodes: next(el.childNodes),
        data,
      }
    },
    serialize(object, children) {
      if (object.kind !== 'inline') return undefined
      // console.log('inline serialize:', object.kind);
      switch (object.type) {
        case 'link': {
          const href = object.data.get('href')
          return <a href={href}>{children}</a>
        }
        default: return null
      }
    },
  },
  // Add a new rule that handles marks...
  {
    deserialize(el, next) {
      const type = MARK_TAGS[el.tagName.toLowerCase()]
      if (!type) return undefined
      // console.log('mark deserialize:', el.tagName.toLowerCase());
      // console.log('childNodes:', el.childNodes);
      return {
        kind: 'mark',
        type,
        nodes: next(el.childNodes),
      }
    },
    serialize(object, children) {
      if (object.kind !== 'mark') return undefined
      switch (object.type) {
        case 'bold': return <strong>{children}</strong>
        case 'italic': return <em>{children}</em>
        case 'code': return <code>{children}</code>
        default: return null
      }
    },
  },
]

const deserialize = (html, value) => {
  console.log('Start deserializing...')
  return html.deserialize(value)
}

const html = new Html({ rules })


const schema = {
  document: {
    last: { types: ['paragraph'] },
    normalize: (change, reason, { node, child }) => {
      switch (reason) {
        case 'last_child_type_invalid': {
          const paragraph = Block.create('paragraph')
          return change.insertNodeByKey(node.key, node.nodes.size, paragraph)
        }
      }
    }
  }
}

class PlainText extends React.Component {

  constructor(props) {
    super(props)
    // const initialValue = deserialize(html, preprocess('<p>abcde<img src="https://hahow.in/images/598ecc6344ac3e0700236e33?width=600"></p>'))
    const initialValue = deserialize(html, '<p>abcde<img src="https://hahow.in/images/598ecc6344ac3e0700236e33?width=600"></p>')
    this.state = {
      value: initialValue,
    }
  }

  onChange = ({ value }) => {
    // When the document changes, save the serialized HTML to Local Storage.
    if (value.document !== this.state.value.document) {
      const string = html.serialize(value)
      localStorage.setItem('content', string)
    }

    this.setState({ value })
  }


  renderEditor = () => (
    <div className="editor">
      <Editor
        placeholder="Enter some rich text..."
        value={this.state.value}
        schema={schema}
        onChange={this.onChange}
        onKeyDown={this.onKeyDown}
        renderNode={this.renderNode}
        renderMark={this.renderMark}
        onPaste={this.onPaste}
        spellCheck
      />
    </div>
  )

  /**
   * Render a Slate node.
   *
   * @param {Object} props
   * @return {Element}
   */

  renderNode = (props) => {
    const { attributes, children, node, isSelected } = props

    switch (node.type) {
      case 'block-quote': return <blockquote {...attributes}>{children}</blockquote>
      case 'bulleted-list': return <ul {...attributes}>{children}</ul>
      case 'heading-four': return <h4 {...attributes}>{children}</h4>
      case 'list-item': return <li {...attributes}>{children}</li>
      case 'numbered-list': return <ol {...attributes}>{children}</ol>
      case 'link': {
        const href = node.data.get('href')
        return <a href={href} {...attributes}>{children}</a>
      }
      case 'video': return <Video {...props} />
      case 'image': {
        const src = node.data.get('src')
        console.log('render image:', src)
        const className = isSelected ? 'active' : null
        const style = { display: 'block' }
        return <img src={src} className={className} style={style} {...attributes} />
      }
      default: return null
    }
  }

  /**
   * Render a Slate mark.
   *
   * @param {Object} props
   * @return {Element}
   */

  renderMark = (props) => {
    const { children, mark } = props
    switch (mark.type) {
      case 'bold': return <strong>{children}</strong>
      case 'code': return <pre><code>{children}</code></pre>
      case 'italic': return <em>{children}</em>
      default: return null
    }
  }

  render() {
    return (
      <div className="editor">
        {this.renderEditor()}
        <button
onClick={(event) => {
          event.preventDefault()
          console.log('state:', this.state.value.toJSON(), 'localStorage:', localStorage.getItem('content'))
        }}
        > log </button>
      </div>
    )
  }

}

/**
 * Export.
 */

export default PlainText
