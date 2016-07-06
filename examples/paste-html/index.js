
import { Editor, Html, Raw } from '../..'
import React from 'react'
import state from './state.json'

/**
 * Node renderers.
 *
 * @type {Object}
 */

const NODES = {
  'bulleted-list': props => <ul>{props.children}</ul>,
  'code': props => <pre><code>{props.children}</code></pre>,
  'heading-one': props => <h1>{props.children}</h1>,
  'heading-two': props => <h2>{props.children}</h2>,
  'heading-three': props => <h3>{props.children}</h3>,
  'heading-four': props => <h4>{props.children}</h4>,
  'heading-five': props => <h5>{props.children}</h5>,
  'heading-six': props => <h6>{props.children}</h6>,
  'list-item': props => <li>{props.children}</li>,
  'numbered-list': props => <ol>{props.children}</ol>,
  'paragraph': props => <p>{props.children}</p>,
  'quote': props => <blockquote>{props.children}</blockquote>,
  'link': (props) => {
    const { data } = props.node
    const href = data.get('href')
    return <a href={href}>{props.children}</a>
  }
}

/**
 * Mark renderers.
 *
 * @type {Object}
 */

const MARKS = {
  bold: {
    fontWeight: 'bold'
  },
  code: {
    fontFamily: 'monospace',
    backgroundColor: '#eee',
    padding: '3px',
    borderRadius: '4px'
  },
  italic: {
    fontStyle: 'italic'
  },
  underlined: {
    textDecoration: 'underline'
  }
}

/**
 * Tags to blocks.
 *
 * @type {Object}
 */

const BLOCK_TAGS = {
  p: 'paragraph',
  li: 'list-item',
  ul: 'bulleted-list',
  ol: 'numbered-list',
  blockquote: 'quote',
  pre: 'code',
  h1: 'heading-one',
  h2: 'heading-two',
  h3: 'heading-three',
  h4: 'heading-four',
  h5: 'heading-five',
  h6: 'heading-six'
}

/**
 * Tags to marks.
 *
 * @type {Object}
 */

const MARK_TAGS = {
  strong: 'bold',
  em: 'italic',
  u: 'underline',
  s: 'strikethrough',
  code: 'code'
}

/**
 * Serializer rules.
 *
 * @type {Array}
 */

const RULES = [
  {
    deserialize(el, next) {
      const block = BLOCK_TAGS[el.tagName]
      if (!block) return
      return {
        kind: 'block',
        type: block,
        nodes: next(el.children)
      }
    }
  },
  {
    deserialize(el, next) {
      const mark = MARK_TAGS[el.tagName]
      if (!mark) return
      return {
        kind: 'mark',
        type: mark,
        nodes: next(el.children)
      }
    }
  },
  {
    // Special case for code blocks, which need to grab the nested children.
    deserialize(el, next) {
      if (el.tagName != 'pre') return
      const code = el.children[0]
      const children = code && code.tagName == 'code'
        ? code.children
        : el.children

      return {
        kind: 'block',
        type: 'code',
        nodes: next(children)
      }
    }
  },
  {
    // Special case for links, to grab their href.
    deserialize(el, next) {
      if (el.tagName != 'a') return
      return {
        kind: 'inline',
        type: 'link',
        nodes: next(el.children),
        data: {
          href: el.attribs.href
        }
      }
    }
  }
]

/**
 * Create a new HTML serializer with `RULES`.
 *
 * @type {Html}
 */

const serializer = new Html(RULES)

/**
 * The rich text example.
 *
 * @type {Component}
 */

class PasteHtml extends React.Component {

  state = {
    state: Raw.deserialize(state)
  };

  onPaste(e, paste, state, editor) {
    if (paste.type != 'html') return
    const { html } = paste
    const { document } = serializer.deserialize(html)

    return state
      .transform()
      .insertFragment(document)
      .apply()
  }

  render() {
    return (
      <div className="editor">
        <Editor
          state={this.state.state}
          renderNode={node => NODES[node.type]}
          renderMark={mark => MARKS[mark.type]}
          onPaste={(...args) => this.onPaste(...args)}
          onChange={(state) => {
            console.groupCollapsed('Change!')
            console.log('Document:', state.document.toJS())
            console.log('Selection:', state.selection.toJS())
            console.log('Content:', Raw.serialize(state))
            console.groupEnd()
            this.setState({ state })
          }}
        />
      </div>
    )
  }

}

/**
 * Export.
 */

export default PasteHtml
