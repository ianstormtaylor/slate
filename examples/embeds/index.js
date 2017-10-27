
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
    value: Value.fromJSON(initialValue)
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
   * Render the app.
   *
   * @return {Element} element
   */

  render() {
    return (
      <div className="editor">
        <Editor
          placeholder="Enter some text..."
          value={this.state.value}
          onChange={this.onChange}
          renderNode={this.renderNode}
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
      case 'video': return <Video {...props} />
    }
  }

}

/**
 * Export.
 */

export default Embeds
