
import Editor, { Character, Document, Element, State, Text } from '../..'
import React from 'react'
import ReactDOM from 'react-dom'

/**
 * The initial editor state.
 *
 * @type {String}
 */

const state = 'This is editable plain text, just like a <textarea>!'

/**
 * A helper to deserialize a string into an editor state.
 *
 * @param {String} string
 * @return {State} state
 */

function deserialize(string) {
  const characters = string
    .split('')
    .reduce((list, char) => {
      return list.push(Character.create({ text: char }))
    }, Character.createList())

  const text = Text.create({ characters })
  const texts = Element.createMap([text])
  const node = Element.create({
    type: 'paragraph',
    nodes: texts,
  })

  const nodes = Element.createMap([node])
  const document = Document.create({ nodes })
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
 * The example's app.
 *
 * @type {Component} App
 */

class App extends React.Component {

  state = {
    state: deserialize(state)
  };

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
 * Attach.
 */

const app = <App />
const root = document.body.querySelector('main')
ReactDOM.render(app, root)
