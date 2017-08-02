
import { Editor, Raw, Block } from '../..'
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
    state: Raw.deserialize(initialState, { terse: true }),
    schema: {
      nodes: {
        'title': props => <h1 {...props.attrs}>{props.children}</h1>,
        'paragraph': props => <p {...props.attrs}>{props.children}</p>
      },
      rules: [
        /* Rule that always makes the first block a title, normalizes by inserting one if no children, or setting the top to be a title */

        {
          match: node => node.kind === 'document',
          validate: document => !document.nodes.size || document.nodes.first().type !== 'title' ? document.nodes : null,
          normalize: (transform, document, nodes) => {
            if (!nodes.size) {
              const title = Block.create({ type: 'title', data: {}})
              return transform.insertNodeByKey(document.key, 0, title)
            }

            return transform.setNodeByKey(nodes.first().key, 'title')
          }
        },

        /* Rule that only allows for one title, normalizes by making titles paragraphs */

        {
          match: node => node.kind === 'document',
          validate: (document) => {
            const invalidChildren = document.nodes.filter((child, index) => child.type === 'title' && index !== 0)
            return invalidChildren.size ? invalidChildren : null
          },
          normalize: (transform, document, invalidChildren) => {
            let updatedTransform = transform
            invalidChildren.forEach((child) => {
              updatedTransform = transform.setNodeByKey(child.key, 'paragraph')
            })

            return updatedTransform
          }
        },

        /* Rule that forces at least one paragraph, normalizes by inserting an empty paragraph */

        {
          match: node => node.kind === 'document',
          validate: document => document.nodes.size < 2 ? true : null,
          normalize: (transform, document) => {
            const paragraph = Block.create({ type: 'paragraph', data: {}})
            return transform.insertNodeByKey(document.key, 1, paragraph)
          }
        }
      ]
    }
  };

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

  render() {
    return (
      <Editor
        state={this.state.state}
        schema={this.state.schema}
        onChange={this.onChange}
      />
    )
  }

}

/**
 * Export.
 */

export default ForcedLayout
