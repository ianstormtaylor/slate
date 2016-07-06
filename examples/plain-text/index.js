
import { Block, Character, Document, Editor, State, Text } from '../..'
import React from 'react'
import state from './state.json'

/**
 * A helper to deserialize a string into an editor state.
 *
 * @param {String} string
 * @return {State} state
 */

function deserialize(string) {
  const characters = string.split('').map(char => {
    return { text: char }
  })

  const text = Text.create({ characters })
  const block = Block.create({
    type: 'paragraph',
    nodes: [text]
  })

  const document = Document.create({ nodes: [block] })
  const state = State.create({ document })
  return state
}

/**
 * A helper to serialize an editor state into a string.
 *
 * @param {State} state
 * @return {String} string
 */

function serialize(state) {
  return state.document.nodes
    .map(node => node.text)
    .join('\n')
}

/**
 * The plain text example.
 *
 * @type {Component} PlainText
 */

class PlainText extends React.Component {

  /**
   * Deserialize the initial editor state.
   *
   * @type {Object}
   */

  state = {
    state: deserialize(state)
  };

  /**
   * Render the editor.
   *
   * @return {Component} component
   */

  render() {
    return (
      <Editor
        state={this.state.state}
        onChange={(state) => {
          console.groupCollapsed('Change!')
          console.log('Document:', state.document.toJS())
          console.log('Selection:', state.selection.toJS())
          console.log('Content:', serialize(state))
          console.groupEnd()
          this.setState({ state })
        }}
      />
    )
  }

}

/**
 * Export.
 */

export default PlainText
