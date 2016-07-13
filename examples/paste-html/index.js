
import { Editor, Html, Raw } from '../..'
import React from 'react'
import initialState from './state.json'

/**
 * Define a set of node renderers.
 *
 * @type {Object}
 */

const NODES = {
  'bulleted-list': props => <ul {...props.attributes}>{props.children}</ul>,
  'code': props => <pre><code {...props.attributes}>{props.children}</code></pre>,
  'heading-one': props => <h1 {...props.attributes}>{props.children}</h1>,
  'heading-two': props => <h2 {...props.attributes}>{props.children}</h2>,
  'heading-three': props => <h3 {...props.attributes}>{props.children}</h3>,
  'heading-four': props => <h4 {...props.attributes}>{props.children}</h4>,
  'heading-five': props => <h5 {...props.attributes}>{props.children}</h5>,
  'heading-six': props => <h6 {...props.attributes}>{props.children}</h6>,
  'list-item': props => <li {...props.attributes}>{props.children}</li>,
  'numbered-list': props => <ol {...props.attributes}>{props.children}</ol>,
  'quote': props => <blockquote {...props.attributes}>{props.children}</blockquote>,
  'link': (props) => {
    const { data } = props.node
    const href = data.get('href')
    return <a href={href} {...props.attributes}>{props.children}</a>
  }
}

/**
 * Define a set of mark renderers.
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
 * The pasting html example.
 *
 * @type {Component}
 */

class PasteHtml extends React.Component {

  /**
   * Deserialize the raw initial state.
   *
   * @type {Object}
   */

  state = {
    state: Raw.deserialize(initialState)
  };

  /**
   * On change, save the new state.
   *
   * @param {State} state
   */

  onChange = (state) => {
    this.setState({ state })
  }

  /**
   * On paste, deserialize the HTML and then insert the fragment.
   *
   * @param {Event} e
   * @param {Object} paste
   * @param {State} state
   */

  onPaste = (e, paste, state) => {
    if (paste.type != 'html') return
    const { html } = paste
    const { document } = serializer.deserialize(html)

    return state
      .transform()
      .insertFragment(document)
      .apply()
  }

  /**
   * Render.
   *
   * @return {Component}
   */

  render = () => {
    return (
      <div className="editor">
        <Editor
          state={this.state.state}
          renderNode={this.renderNode}
          renderMark={this.renderMark}
          onPaste={this.onPaste}
          onChange={this.onChange}
        />
      </div>
    )
  }

  /**
   * Return a node renderer for a Slate `node`.
   *
   * @param {Node} node
   * @return {Component or Void}
   */

  renderNode = (node) => {
    return NODES[node.type]
  }

  /**
   * Return a mark renderer for a Slate `mark`.
   *
   * @param {Mark} mark
   * @return {Object or Void}
   */

  renderMark = (mark) => {
    return MARKS[mark.type]
  }

}

/**
 * Export.
 */

export default PasteHtml
