import { Editor } from 'slate-react'
import { Value } from 'slate'

import Prism from 'prismjs'
import React from 'react'
import initialValue from './value.json'

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
    editor.change(c =>
      c.setNodeByKey(node.key, { data: { language: event.target.value } })
    )
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
  if (typeof token == 'string') {
    return token
  } else if (typeof token.content == 'string') {
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
   * Deserialize the raw initial value.
   *
   * @type {Object}
   */

  state = {
    value: Value.fromJSON(initialValue),
  }

  /**
   * Render.
   *
   * @return {Component}
   */

  render() {
    return (
      <Editor
        placeholder="Write some code..."
        value={this.state.value}
        onChange={this.onChange}
        onKeyDown={this.onKeyDown}
        renderNode={this.renderNode}
        renderMark={this.renderMark}
        decorateNode={this.decorateNode}
      />
    )
  }

  /**
   * Render a Slate node.
   *
   * @param {Object} props
   * @return {Element}
   */

  renderNode = props => {
    switch (props.node.type) {
      case 'code':
        return <CodeBlock {...props} />
      case 'code_line':
        return <CodeBlockLine {...props} />
    }
  }

  /**
   * Render a Slate mark.
   *
   * @param {Object} props
   * @return {Element}
   */

  renderMark = props => {
    const { children, mark, attributes } = props

    switch (mark.type) {
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
    }
  }

  /**
   * On change, save the new value.
   *
   * @param {Change} change
   */

  onChange = ({ value }) => {
    this.setState({ value })
  }

  /**
   * On key down inside code blocks, insert soft new lines.
   *
   * @param {Event} event
   * @param {Change} change
   * @return {Change}
   */

  onKeyDown = (event, change) => {
    const { value } = change
    const { selection, startBlock } = value
    if (event.key != 'Enter') return
    if (startBlock.type != 'code') return
    if (selection.isExpanded) change.delete()
    change.insertText('\n')
    return true
  }

  /**
   * Decorate code blocks with Prism.js highlighting.
   *
   * @param {Node} node
   * @return {Array}
   */

  decorateNode = node => {
    if (node.type != 'code') return

    const language = node.data.get('language')
    const texts = node.getTexts().toArray()
    const string = texts.map(t => t.text).join('\n')
    const grammar = Prism.languages[language]
    const tokens = Prism.tokenize(string, grammar)
    const decorations = []
    let startText = texts.shift()
    let endText = startText
    let startOffset = 0
    let endOffset = 0
    let start = 0

    for (const token of tokens) {
      startText = endText
      startOffset = endOffset

      const content = getContent(token)
      const newlines = content.split('\n').length - 1
      const length = content.length - newlines
      const end = start + length

      let available = startText.text.length - startOffset
      let remaining = length

      endOffset = startOffset + remaining

      while (available < remaining && texts.length > 0) {
        endText = texts.shift()
        remaining = length - available
        available = endText.text.length
        endOffset = remaining
      }

      if (typeof token != 'string') {
        const dec = {
            anchor: { key: startText.key, offset: startOffset, path: node.getPath(startText.key) },
            focus: { key: endText.key, offset: endOffset, path: node.getPath(endText.key) },
            mark: { type: token.type }
          }

        decorations.push(dec)
      }

      start = end
    }

    return decorations
  }
}

/**
 * Export.
 */

export default CodeHighlighting
