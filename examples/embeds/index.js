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
   * @return {Element}
   */

  renderNode = props => {
    switch (props.node.type) {
      case 'video':
        return <Video {...props} />
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
