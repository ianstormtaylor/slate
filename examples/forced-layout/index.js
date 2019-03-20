import { Editor } from 'slate-react'
import { Block, Value } from 'slate'

import React from 'react'
import initialValueAsJson from './value.json'

/**
 * Deserialize the initial editor value.
 *
 * @type {Object}
 */

const initialValue = Value.fromJSON(initialValueAsJson)

/**
 * A simple schema to enforce the nodes in the Slate document.
 *
 * @type {Object}
 */

const schema = {
  document: {
    nodes: [
      { match: { type: 'title' }, min: 1, max: 1 },
      { match: { type: 'paragraph' }, min: 1 },
    ],
    normalize: (editor, { code, node, child, index }) => {
      switch (code) {
        case 'child_type_invalid': {
          const type = index === 0 ? 'title' : 'paragraph'
          return editor.setNodeByKey(child.key, type)
        }
        case 'child_min_invalid': {
          const block = Block.create(index === 0 ? 'title' : 'paragraph')
          return editor.insertNodeByKey(node.key, index, block)
        }
      }
    },
  },
}

/**
 * The Forced Layout example.
 *
 * @type {Component}
 */

class ForcedLayout extends React.Component {
  /**
   * Render the editor.
   *
   * @return {Component} component
   */

  render() {
    return (
      <Editor
        placeholder="Enter a title..."
        defaultValue={initialValue}
        schema={schema}
        renderNode={this.renderNode}
      />
    )
  }

  /**
   * Render a Slate node.
   *
   * @param {Object} props
   * @param {Editor} editor
   * @param {Function} next
   * @return {Element}
   */

  renderNode = (props, editor, next) => {
    const { attributes, children, node } = props

    switch (node.type) {
      case 'title':
        return <h2 {...attributes}>{children}</h2>
      case 'paragraph':
        return <p {...attributes}>{children}</p>
      default:
        return next()
    }
  }
}

/**
 * Export.
 */

export default ForcedLayout
