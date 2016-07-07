
import { Editor, Mark, Raw, Selection } from '../..'
import Prism from 'prismjs'
import React from 'react'
import keycode from 'keycode'
import initialState from './state.json'

/**
 * Node renderers.
 *
 * @type {Object}
 */

const NODES = {
  code: props => <pre><code>{props.children}</code></pre>,
  paragraph: props => <p>{props.children}</p>
}

/**
 * Mark renderers.
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
 * Example.
 *
 * @type {Component}
 */

class CodeHighlighting extends React.Component {

  state = {
    state: Raw.deserialize(initialState)
  };

  onChange = (state) => {
    console.groupCollapsed('Change!')
    console.log('Document:', state.document.toJS())
    console.log('Selection:', state.selection.toJS())
    console.log('Content:', Raw.serialize(state))
    console.groupEnd()
    this.setState({ state })
  }

  onKeyDown = (e, state, editor) => {
    const key = keycode(e.which)
    if (key != 'enter') return
    const { startBlock } = state
    if (startBlock.type != 'code') return

    let transform = state.transform()
    if (state.isExpanded) transform = transform.delete()
    transform = transform.insertText('\n')

    return transform.apply()
  }

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

  renderNode = (node) => {
    return NODES[node.type]
  }

  renderMark = (mark) => {
    return MARKS[mark.type] || {}
  }

  renderDecorations = (text, state, editor) => {
    let characters = text.characters
    const { document } = state
    const block = document.getClosestBlock(text)
    if (block.type != 'code') return characters

    const string = text.text
    const grammar = Prism.languages.javascript
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

    return characters
  }

}

/**
 * Export.
 */

export default CodeHighlighting
