import { Editor } from 'slate-react'
import { Value } from 'slate'

import React from 'react'
import Video from './video'
import initialValueAsJson from './value.json'

/**
 * Deserialize the initial editor value.
 *
 * @type {Object}
 */

const initialValue = Value.fromJSON(initialValueAsJson)

/**
 * The images example.
 *
 * @type {Component}
 */

class Embeds extends React.Component {
  /**
   * The editor's schema.
   *
   * @type {Object}
   */

  schema = {
    blocks: {
      video: {
        isVoid: true,
      },
    },
  }

  /**
   * Render the app.
   *
   * @return {Element} element
   */

  render() {
    return (
      <Editor
        placeholder="Enter some text..."
        defaultValue={initialValue}
        schema={this.schema}
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
   */

  renderNode = (props, editor, next) => {
    switch (props.node.type) {
      case 'video':
        return <Video {...props} />
      default:
        return next()
    }
  }
}

/**
 * Export.
 */

export default Embeds
