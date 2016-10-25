
import React from 'react'

/**
 * An video embed component.
 *
 * @type {Component}
 */

class Video extends React.Component {

  /**
   * When the input text changes, update the `video` data on the node.
   *
   * @param {Event} e
   */

  onChange = (e) => {
    const video = e.target.value
    const { node, editor } = this.props
    const properties = {
      data: { video }
    }

    const next = editor
      .getState()
      .transform()
      .setNodeByKey(node.key, properties)
      .apply()

    editor.onChange(next)
  }

  /**
   * When clicks happen in the input, stop propagation so that the void node
   * itself isn't focused, since that would unfocus the input.
   *
   * @type {Event} e
   */

  onClick = (e) => {
    e.stopPropagation()
  }

  /**
   * Render.
   *
   * @return {Element}
   */

  render = () => {
    return (
      <div {...this.props.attributes}>
        {this.renderVideo()}
        {this.renderInput()}
      </div>
    )
  }

  /**
   * Render the Youtube iframe, responsively.
   *
   * @return {Element}
   */

  renderVideo = () => {
    const video = this.props.node.data.get('video')
    const wrapperStyle = {
      position: 'relative',
      paddingBottom: '66.66%',
      paddingTop: '25px',
      height: '0'
    }

    const iframeStyle = {
      position: 'absolute',
      top: '0px',
      left: '0px',
      width: '100%',
      height: '100%'
    }

    return (
      <div style={wrapperStyle}>
        <iframe
          id="ytplayer"
          type="text/html"
          width="640"
          height="390"
          src={video}
          frameBorder="0"
          style={iframeStyle}
        />
      </div>
    )
  }

  /**
   * Render the video URL input.
   *
   * @return {Element}
   */

  renderInput = () => {
    const video = this.props.node.data.get('video')
    return (
      <input
        value={video}
        onChange={this.onChange}
        onClick={this.onClick}
        style={{ marginTop: '5px' }}
      />
    )
  }

}

/**
 * Export.
 */

export default Video
