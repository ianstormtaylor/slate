
import { Editor } from 'slate-react'
import { Block, State } from 'slate'

import React from 'react'
import initialState from './state.json'

/**
 * The Forced Layout example.
 *
 * @type {Component}
 */

class ForcedLayout extends React.Component {

  /**
   * Deserialize the initial editor state.
   *
   * @type {Object}
   */

  state = {
    state: State.fromJSON(initialState),
    schema: {
      document: {
        nodes: [
          { type: 'title', min: 1, max: 1 },
          { type: 'paragraph', min: 1 },
        ],
        defaults: {
          nodes: [
            { kind: 'block', type: 'title' },
            { kind: 'block', type: 'paragraph' },
          ]
        },
      }
    }
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
   * Render the editor.
   *
   * @return {Component} component
   */

  render() {
    return (
      <div className="editor">
        <Editor
          placeholder="Enter a title..."
          state={this.state.state}
          schema={this.state.schema}
          onChange={this.onChange}
          renderNode={this.renderNode}
          validateNode={this.validateNode}
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
    switch (props.node.type) {
      case 'title': return <h2 {...props.attributes}>{props.children}</h2>
      case 'paragraph': return <p {...props.attributes}>{props.children}</p>
    }
  }

  /**
   * Validate a `node`, forcing the layout.
   *
   * @param {Node} node
   * @return {Function|Void}
   */

  // validateNode = (node) => {
  //   const { kind, nodes } = node
  //   if (kind != 'document') return

  //   const first = nodes.first()

  //   if (!first) {
  //     return (change) => {
  //       change.insertNodeByKey(node.key, 0, Block.create('title'))
  //     }
  //   }

  //   if (first.type != 'title') {
  //     return (change) => {
  //       change.setNodeByKey(first.key, 'title')
  //     }
  //   }

  //   const second = nodes.get(1)

  //   if (!second) {
  //     return (change) => {
  //       change.insertNodeByKey(node.key, 1, Block.create('paragraph'))
  //     }
  //   }

  //   const invalids = nodes.rest().filter(n => n.type != 'paragraph')
  //   if (!invalids.size) return

  //   return (change) => {
  //     invalids.forEach(n => change.setNodeByKey(n.key, 'paragraph'))
  //   }
  // }

}

/**
 * Export.
 */

export default ForcedLayout
