/* eslint-disable no-console */

import { Editor } from 'slate-react'
import { State } from 'slate'

import React from 'react'
import faker from 'faker'

/**
 * Create a huge JSON document.
 *
 * @type {Object}
 */

const HEADINGS = 100
const PARAGRAPHS = 8 // Paragraphs per heading
const nodes = []
const json = {
  document: { nodes }
}

for (let h = 0; h < HEADINGS; h++) {
  nodes.push({
    kind: 'block',
    type: 'heading',
    nodes: [{ kind: 'text', ranges: [{ text: faker.lorem.sentence() }] }]
  })

  for (let p = 0; p < PARAGRAPHS; p++) {
    nodes.push({
      kind: 'block',
      type: 'paragraph',
      nodes: [{ kind: 'text', ranges: [{ text: faker.lorem.paragraph() }] }]
    })
  }
}

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

/**
 * The huge document example.
 *
 * @type {Component}
 */

class HugeDocument extends React.Component {

  /**
   * Deserialize the initial editor state.
   *
   * @type {Object}
   */

  constructor() {
    super()
    console.time('deserializeHugeDocument')
    this.state = { state: State.fromJSON(json, { normalize: false }) }
    console.timeEnd('deserializeHugeDocument')
  }

  /**
   * On change.
   *
   * @param {Change} change
   */

  onChange = ({ state }) => {
    this.setState({ state })
  }

  /**
   * On key down, if it's a formatting command toggle a mark.
   *
   * @param {Event} e
   * @param {Object} data
   * @param {Change} change
   */

  onKeyDown = (e, data, change) => {
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

    e.preventDefault()
    change.toggleMark(mark)
    return true
  }

  /**
   * Render the editor.
   *
   * @return {Component} component
   */

  render() {
    return (
      <Editor
        placeholder={'Enter some text...'}
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

export default HugeDocument
