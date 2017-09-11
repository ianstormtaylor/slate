
import { Editor, Html, State } from '../..'
import React from 'react'
import initialState from './state.json'

/**
 * Define a schema.
 *
 * @type {Object}
 */

const schema = {
  nodes: {
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
  },
  marks: {
    bold: props => <strong>{props.children}</strong>,
    code: props => <code>{props.children}</code>,
    italic: props => <em>{props.children}</em>,
    underlined: props => <u>{props.children}</u>,
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
      const block = BLOCK_TAGS[el.tagName.toLowerCase()]
      if (!block) return
      return {
        kind: 'block',
        type: block,
        nodes: next(el.childNodes)
      }
    }
  },
  {
    deserialize(el, next) {
      const mark = MARK_TAGS[el.tagName.toLowerCase()]
      if (!mark) return
      return {
        kind: 'mark',
        type: mark,
        nodes: next(el.childNodes)
      }
    }
  },
  {
    // Special case for code blocks, which need to grab the nested childNodes.
    deserialize(el, next) {
      if (el.tagName.toLowerCase() != 'pre') return
      const code = el.childNodes[0]
      const childNodes = code && code.tagName.toLowerCase() == 'code'
        ? code.childNodes
        : el.childNodes

      return {
        kind: 'block',
        type: 'code',
        nodes: next(childNodes)
      }
    }
  },
  {
    // Special case for links, to grab their href.
    deserialize(el, next) {
      if (el.tagName.toLowerCase() != 'a') return
      return {
        kind: 'inline',
        type: 'link',
        nodes: next(el.childNodes),
        data: {
          href: el.attrs.find(({ name }) => name == 'href').value
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

const serializer = new Html({ rules: RULES })

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
    state: State.fromJSON(initialState)
  }

  /**
   * On change, save the new state.
   *
   * @param {Change} change
   */

  onChange = ({ state }) => {
    this.setState({ state })
  }

  /**
   * On paste, deserialize the HTML and then insert the fragment.
   *
   * @param {Event} e
   * @param {Object} data
   * @param {Change} change
   */

  onPaste = (e, data, change) => {
    if (data.type != 'html') return
    if (data.isShift) return
    const { document } = serializer.deserialize(data.html)
    change.insertFragment(document)
    return true
  }

  /**
   * Render.
   *
   * @return {Component}
   */

  render() {
    return (
      <div className="editor">
        <Editor
          schema={schema}
          state={this.state.state}
          onPaste={this.onPaste}
          onChange={this.onChange}
        />
      </div>
    )
  }

}

/**
 * Export.
 */

export default PasteHtml
