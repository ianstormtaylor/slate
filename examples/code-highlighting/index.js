
import { Editor } from 'slate-react'
import { State } from 'slate'

import Prism from 'prismjs'
import React from 'react'
import initialState from './state.json'

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
    editor.change(c => c.setNodeByKey(node.key, { data: { language: event.target.value }}))
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
        <select value={language} onChange={onChange} >
          <option value="css">CSS</option>
          <option value="js">JavaScript</option>
          <option value="html">HTML</option>
        </select>
      </div>
    </div>
  )
}

function CodeBlockLine(props) {
  return (
    <div {...props.attributes}>{props.children}</div>
  )
}

/**
 * Define a Prism.js decorator for code blocks.
 *
 * @param {Block} block
 * @return {Array}
 */

function codeBlockDecorator(block) {
  const language = block.data.get('language')
  const texts = block.getTexts().toArray()
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

    const content = typeof token == 'string' ? token : token.content
    const newlines = content.split('\n').length - 1
    const length = content.length - newlines
    const end = start + length

    let available = startText.text.length - startOffset
    let remaining = length

    endOffset = startOffset + remaining

    while (available < remaining) {
      endText = texts.shift()
      remaining = length - available
      available = endText.text.length
      endOffset = remaining
    }

    if (typeof token != 'string') {
      const range = {
        anchorKey: startText.key,
        anchorOffset: startOffset,
        focusKey: endText.key,
        focusOffset: endOffset,
        marks: [{ type: `highlight-${token.type}` }],
      }

      decorations.push(range)
    }

    start = end
  }

  return decorations
}

/**
 * Define a schema.
 *
 * @type {Object}
 */

const schema = {
  nodes: {
    code: {
      render: CodeBlock,
      decorate: codeBlockDecorator,
    },
    code_line: {
      render: CodeBlockLine,
    },
  },
  marks: {
    'highlight-comment': {
      opacity: '0.33'
    },
    'highlight-keyword': {
      fontWeight: 'bold'
    },
    'highlight-punctuation': {
      opacity: '0.75'
    }
  }
}

/**
 * The code highlighting example.
 *
 * @type {Component}
 */

class CodeHighlighting extends React.Component {

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
   * On key down inside code blocks, insert soft new lines.
   *
   * @param {Event} event
   * @param {Change} change
   * @return {Change}
   */

  onKeyDown = (event, change) => {
    const { state } = change
    const { startBlock } = state
    if (event.key != 'Enter') return
    if (startBlock.type != 'code') return
    if (state.isExpanded) change.delete()
    change.insertText('\n')
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
          onKeyDown={this.onKeyDown}
          onChange={this.onChange}
        />
      </div>
    )
  }

}

/**
 * Export.
 */

export default CodeHighlighting
