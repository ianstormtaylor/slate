
import { Editor } from 'slate-react'
import { Mark, State } from 'slate'

import Prism from 'prismjs'
import React from 'react'
import initialState from './state.json'

/**
 * Define a code block component.
 *
 * @param {Object} props
 * @return {Element}
 */

function CodeBlock(props) {
  const { editor, node } = props
  const language = node.data.get('language')

  function onChange(e) {
    editor.change(c => c.setNodeByKey(node.key, { data: { language: e.target.value }}))
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

/**
 * Define a Prism.js decorator for code blocks.
 *
 * @param {Text} text
 * @param {Block} block
 */

function codeBlockDecorator(text, block) {
  const characters = text.characters.asMutable()
  const language = block.data.get('language')
  const string = text.text
  const grammar = Prism.languages[language]
  const tokens = Prism.tokenize(string, grammar)
  let offset = 0

  for (const token of tokens) {
    if (typeof token == 'string') {
      offset += token.length
      continue
    }

    const length = offset + token.content.length
    const type = `highlight-${token.type}`
    const mark = Mark.create({ type })

    for (let i = offset; i < length; i++) {
      let char = characters.get(i)
      let { marks } = char
      marks = marks.add(mark)
      char = char.set('marks', marks)
      characters.set(i, char)
    }

    offset = length
  }

  return characters.asImmutable()
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
    }
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
   * @param {Event} e
   * @param {Object} data
   * @param {Change} change
   * @return {Change}
   */

  onKeyDown = (e, data, change) => {
    const { state } = change
    const { startBlock } = state
    if (data.key != 'enter') return
    if (startBlock.type != 'code') return
    if (state.isExpanded) change.delete()
    return change.insertText('\n')
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
