
import Editor, { Html, Raw } from '../..'
import React from 'react'
import state from './state.json'

/**
 * Tags to blocks.
 *
 * @type {Object}
 */

const BLOCKS = {
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

const MARKS = {
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
      const block = BLOCKS[el.tagName]
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
      const mark = MARKS[el.tagName]
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
 */

const serializer = new Html(RULES)

/**
 * The rich text example.
 *
 * @type {Component} PasteHtml
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
          renderNode={node => this.renderNode(node)}
          renderMark={mark => this.renderMark(mark)}
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

  renderNode(node) {
    switch (node.type) {
      case 'bulleted-list': return (props) => <ul>{props.children}</ul>
      case 'code': return (props) => <pre><code>{props.children}</code></pre>
      case 'heading-one': return (props) => <h1>{props.children}</h1>
      case 'heading-two': return (props) => <h2>{props.children}</h2>
      case 'heading-three': return (props) => <h3>{props.children}</h3>
      case 'heading-four': return (props) => <h4>{props.children}</h4>
      case 'heading-five': return (props) => <h5>{props.children}</h5>
      case 'heading-six': return (props) => <h6>{props.children}</h6>
      case 'list-item': return (props) => <li>{props.children}</li>
      case 'numbered-list': return (props) => <ol>{props.children}</ol>
      case 'paragraph': return (props) => <p>{props.children}</p>
      case 'quote': return (props) => <blockquote>{props.children}</blockquote>
      case 'link': return (props) => {
        const { data } = props.node
        const href = data.get('href')
        return <a href={href}>{props.children}</a>
      }
    }
  }

  renderMark(mark) {
    switch (mark.type) {
      case 'bold': {
        return {
          fontWeight: 'bold'
        }
      }
      case 'code': {
        return {
          fontFamily: 'monospace',
          backgroundColor: '#eee',
          padding: '3px',
          borderRadius: '4px'
        }
      }
      case 'italic': {
        return {
          fontStyle: 'italic'
        }
      }
      case 'underlined': {
        return {
          textDecoration: 'underline'
        }
      }
    }
  }

}

/**
 * Export.
 */

export default PasteHtml
