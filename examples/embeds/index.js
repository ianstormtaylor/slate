import { Editor } from 'slate-react'
import { Value } from 'slate'

import React from 'react'
import Video from './video'
import initialValue from './value.json'

/**
 * The images example.
 *
 * @type {Component}
 */

class Embeds extends React.Component {
  /**
   * Deserialize the raw initial value.
   *
   * @type {Object}
   */

  state = {
    value: Value.fromJSON(initialValue),
  }

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
        value={this.state.value}
        schema={this.schema}
        onChange={this.onChange}
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

  renderNode = (props, next) => {
    switch (props.node.type) {
      case 'video':
        return <Video {...props} />
      default:
        return next()
    }
  }

  /**
   * On change.
   *
   * @param {Change} change
   */

  onChange = ({ value }) => {
    this.setState({ value })
  }
}

/**
 * Export.
 */

export default Embeds
