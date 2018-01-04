/* eslint-disable no-console */

import { Editor } from 'slate-react'
import { Value } from 'slate'

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
    object: 'block',
    type: 'heading',
    nodes: [{ object: 'text', leaves: [{ text: faker.lorem.sentence() }] }]
  })

  for (let p = 0; p < PARAGRAPHS; p++) {
    nodes.push({
      object: 'block',
      type: 'paragraph',
      nodes: [{ object: 'text', leaves: [{ text: faker.lorem.paragraph() }] }]
    })
  }
}

/**
 * The huge document example.
 *
 * @type {Component}
 */

class HugeDocument extends React.Component {

  /**
   * Deserialize the initial editor value.
   *
   * @type {Object}
   */

  constructor() {
    super()
    console.time('deserializeHugeDocument')
    this.state = { value: Value.fromJSON(json, { normalize: false }) }
    console.timeEnd('deserializeHugeDocument')
  }

  /**
   * On change.
   *
   * @param {Change} change
   */

  onChange = ({ value }) => {
    this.setState({ value })
  }

  /**
   * Render the editor.
   *
   * @return {Component} component
   */

  render() {
    return (
      <div className="editor">
        <Editor
          placeholder="Enter some text..."
          spellCheck={false}
          value={this.state.value}
          onChange={this.onChange}
          onKeyDown={this.onKeyDown}
          renderNode={this.renderNode}
          renderMark={this.renderMark}
        />
      </div>
    )
  }

  /**
   * Render a Slate node.
   *
   * @param {Object} props
   * @return {Element}
   */

  renderNode = (props) => {
    const { attributes, children, node } = props
    switch (node.type) {
      case 'heading': return <h1 {...attributes}>{children}</h1>
    }
  }

  /**
   * Render a Slate mark.
   *
   * @param {Object} props
   * @return {Element}
   */

  renderMark = (props) => {
    const { children, mark } = props
    switch (mark.type) {
      case 'bold': return <strong>{children}</strong>
      case 'code': return <code>{children}</code>
      case 'italic': return <em>{children}</em>
      case 'underlined': return <u>{children}</u>
    }
  }

}

/**
 * Export.
 */

export default HugeDocument
