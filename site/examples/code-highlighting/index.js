import { Editor } from 'slate-react'
import { Value } from 'slate'

import Prism from 'prismjs'
import React from 'react'

import initialValueAsJson from './value.json'

/**
 * Deserialize the initial editor value.
 *
 * @type {Object}
 */

const initialValue = Value.fromJSON(initialValueAsJson)

/**
 * Define our code components.
 *
 * @param {Object} props
 * @return {Element}
 */

function CodeBlock(props) {
  const { editor, node } = props
  const language = node.data.get('language')

  function onChange(event) {
    editor.setNodeByKey(node.key, { data: { language: event.target.value } })
  }

  return (
    <div style={{ position: 'relative' }}>
      <pre>
        <code {...props.attributes}>{props.children}</code>
      </pre>
      <div
        contentEditable={false}
        style={{ position: 'absolute', top: '5px', right: '5px' }}
      >
        <select value={language} onChange={onChange}>
          <option value="css">CSS</option>
          <option value="js">JavaScript</option>
          <option value="html">HTML</option>
        </select>
      </div>
    </div>
  )
}

function CodeBlockLine(props) {
  return <div {...props.attributes}>{props.children}</div>
}

/**
 * A helper function to return the content of a Prism `token`.
 *
 * @param {Object} token
 * @return {String}
 */

function getContent(token) {
  if (typeof token === 'string') {
    return token
  } else if (typeof token.content === 'string') {
    return token.content
  } else {
    return token.content.map(getContent).join('')
  }
}

/**
 * The code highlighting example.
 *
 * @type {Component}
 */

class CodeHighlighting extends React.Component {
  /**
   * Render.
   *
   * @return {Component}
   */

  render() {
    return (
      <Editor
        placeholder="Write some code..."
        defaultValue={initialValue}
        onKeyDown={this.onKeyDown}
        renderBlock={this.renderBlock}
        renderDecoration={this.renderDecoration}
        decorateNode={this.decorateNode}
      />
    )
  }

  /**
   * Render a Slate block.
   *
   * @param {Object} props
   * @return {Element}
   */

  renderBlock = (props, editor, next) => {
    switch (props.node.type) {
      case 'code':
        return <CodeBlock {...props} />
      case 'code_line':
        return <CodeBlockLine {...props} />
      default:
        return next()
    }
  }

  /**
   * Render a Slate decoration.
   *
   * @param {Object} props
   * @return {Element}
   */

  renderDecoration = (props, editor, next) => {
    const { children, decoration, attributes } = props

    switch (decoration.type) {
      case 'comment':
        return (
          <span {...attributes} style={{ opacity: '0.33' }}>
            {children}
          </span>
        )
      case 'keyword':
        return (
          <span {...attributes} style={{ fontWeight: 'bold' }}>
            {children}
          </span>
        )
      case 'tag':
        return (
          <span {...attributes} style={{ fontWeight: 'bold' }}>
            {children}
          </span>
        )
      case 'punctuation':
        return (
          <span {...attributes} style={{ opacity: '0.75' }}>
            {children}
          </span>
        )
      default:
        return next()
    }
  }

  /**
   * On key down inside code blocks, insert soft new lines.
   *
   * @param {Event} event
   * @param {Editor} editor
   * @param {Function} next
   */

  onKeyDown = (event, editor, next) => {
    const { value } = editor
    const { startBlock } = value

    if (event.key === 'Enter' && startBlock.type === 'code') {
      editor.insertText('\n')
      return
    }

    next()
  }

  /**
   * Decorate code blocks with Prism.js highlighting.
   *
   * @param {Node} node
   * @return {Array}
   */

  decorateNode = (node, editor, next) => {
    const others = next() || []
    if (node.type !== 'code') return others

    const language = node.data.get('language')
    const texts = Array.from(node.texts())
    const string = texts.map(([n]) => n.text).join('\n')
    const grammar = Prism.languages[language]
    const tokens = Prism.tokenize(string, grammar)
    const decorations = []
    let startEntry = texts.shift()
    let endEntry = startEntry
    let startOffset = 0
    let endOffset = 0
    let start = 0

    for (const token of tokens) {
      startEntry = endEntry
      startOffset = endOffset

      const [startText, startPath] = startEntry
      const content = getContent(token)
      const newlines = content.split('\n').length - 1
      const length = content.length - newlines
      const end = start + length

      let available = startText.text.length - startOffset
      let remaining = length

      endOffset = startOffset + remaining

      while (available < remaining && texts.length > 0) {
        endEntry = texts.shift()
        const [endText] = endEntry
        remaining = length - available
        available = endText.text.length
        endOffset = remaining
      }

      const [endText, endPath] = endEntry

      if (typeof token !== 'string') {
        const dec = {
          type: token.type,
          anchor: {
            key: startText.key,
            path: startPath,
            offset: startOffset,
          },
          focus: {
            key: endText.key,
            path: endPath,
            offset: endOffset,
          },
        }

        decorations.push(dec)
      }

      start = end
    }

    return [...others, ...decorations]
  }
}

/**
 * Export.
 */

export default CodeHighlighting
