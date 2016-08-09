
import { Editor, Mark, Raw, Selection } from '../..'
import Prism from 'prismjs'
import React from 'react'
import initialState from './state.json'

/**
 * Define a set of node renderers.
 *
 * @type {Object}
 */

const NODES = {
  code: (props) => {
    const { attributes, children, editor, node } = props
    const language = node.data.get('language')

    function onChange(e) {
      const state = editor.getState()
      const next = state
        .transform()
        .setNodeByKey(node.key, {
          data: {
            language: e.target.value
          }
        })
        .apply()
      editor.onChange(next)
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
}

/**
 * Define a set of mark renderers.
 *
 * @type {Object}
 */

const MARKS = {
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
    state: Raw.deserialize(initialState, { terse: true })
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
   * On key down inside code blocks, insert soft new lines.
   *
   * @param {Event} e
   * @param {Object} data
   * @param {State} state
   * @return {State}
   */

  onKeyDown = (e, data, state) => {
    if (data.key != 'enter') return
    const { startBlock } = state
    if (startBlock.type != 'code') return

    let transform = state.transform()
    if (state.isExpanded) transform = transform.delete()
    transform = transform.insertText('\n')

    return transform.apply()
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
          renderDecorations={this.renderDecorations}
          onKeyDown={this.onKeyDown}
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
    return MARKS[mark.type] || {}
  }

  /**
   * Render decorations on `text` nodes inside code blocks.
   *
   * @param {Text} text
   * @param {Block} block
   * @return {Characters}
   */

  renderDecorations = (text, block) => {
    if (block.type != 'code') return text.characters

    let characters = text.characters.asMutable()
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

      for (let i = offset; i < length; i++) {
        let char = characters.get(i)
        let { marks } = char
        marks = marks.add(Mark.create({ type }))
        char = char.merge({ marks })
        characters = characters.set(i, char)
      }

      offset = length
    }

    return characters.asImmutable()
  }

}

/**
 * Export.
 */

export default CodeHighlighting
