/* eslint-disable no-console */

import { Editor, Raw } from '../..'
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
  }
}

const nodes = []

for (let h = 0; h < HEADINGS; h++) {
  nodes.push({
    kind: 'block',
    type: 'heading',
    nodes: [ { kind: 'text', text: faker.lorem.sentence() } ]
  })

  for (let p = 0; p < PARAGRAPHS; p++) {
    nodes.push({
      kind: 'block',
      type: 'paragraph',
      nodes: [ { kind: 'text', text: faker.lorem.paragraph() } ]
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
    this.state = { state: Raw.deserialize({ nodes }, { terse: true }) }
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
   * Render the editor.
   *
   * @return {Component} component
   */

  render = () => {
    return (
      <Editor
        placeholder={'Enter some plain text...'}
        schema={schema}
        spellCheck={false}
        state={this.state.state}
        onChange={this.onChange}
      />
    )
  }

}

/**
 * Export.
 */

export default LargeDocument
