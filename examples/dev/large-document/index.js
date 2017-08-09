/* eslint-disable no-console */

import { Editor, Raw } from '../../..'
import React from 'react'
import faker from 'faker'

const HEADINGS = 100
const PARAGRAPHS = 8 // Paragraphs per heading

/**
 * Define a schema.
 *
 * @type {Object}
 */

const schema = {
  nodes: {
    'heading': props => <h1 {...props.attributes}>{props.children}</h1>,
    'paragraph': props => <p {...props.attributes} style={{ marginBottom: 20 }}>{props.children}</p>,
  },
  marks: {
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
}

const nodes = []

for (let h = 0; h < HEADINGS; h++) {
  nodes.push({
    kind: 'block',
    type: 'heading',
    nodes: [{ kind: 'text', text: faker.lorem.sentence() }]
  })

  for (let p = 0; p < PARAGRAPHS; p++) {
    nodes.push({
      kind: 'block',
      type: 'paragraph',
      nodes: [{ kind: 'text', text: faker.lorem.paragraph() }]
    })
  }
}

/**
 * The large text example.
 *
 * @type {Component}
 */

class LargeDocument extends React.Component {

  /**
   * Deserialize the initial editor state.
   *
   * @type {Object}
   */

  constructor() {
    super()
    console.time('deserializeLargeDocument')
    this.state = { state: Raw.deserialize({ nodes }, { normalize: false, terse: true }) }
    console.timeEnd('deserializeLargeDocument')
  }

  /**
   * On change.
   *
   * @param {State} state
   */

  onChange = (state) => {
    this.setState({ state })
  }

  /**
   * On key down, if it's a formatting command toggle a mark.
   *
   * @param {Event} e
   * @param {Object} data
   * @param {State} state
   * @return {State}
   */

  onKeyDown = (e, data, state) => {
    if (!data.isMod) return
    let mark

    switch (data.key) {
      case 'b':
        mark = 'bold'
        break
      case 'i':
        mark = 'italic'
        break
      case 'u':
        mark = 'underlined'
        break
      case '`':
        mark = 'code'
        break
      default:
        return
    }

    state = state
      .transform()
      .toggleMark(mark)
      .apply()

    e.preventDefault()
    return state
  }

  /**
   * Render the editor.
   *
   * @return {Component} component
   */

  render() {
    return (
      <Editor
        placeholder={'Enter some plain text...'}
        schema={schema}
        spellCheck={false}
        state={this.state.state}
        onChange={this.onChange}
        onKeyDown={this.onKeyDown}
      />
    )
  }

}

/**
 * Export.
 */

export default LargeDocument
