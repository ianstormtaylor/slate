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

  onChange = video => {
    const { node, editor } = this.props
    editor.setNodeByKey(node.key, { data: { video } })
  }

  /**
   * When clicks happen in the input, stop propagation so that the void node
   * itself isn't focused, since that would unfocus the input.
   *
   * @type {Event} e
   */

  onClick = e => {
    e.stopPropagation()
  }

  /**
   * Render.
   *
   * @return {Element}
   */

  render() {
    const { isSelected } = this.props

    return (
      <div {...this.props.attributes}>
        {this.renderVideo()}
        {isSelected ? this.renderInput() : null}
      </div>
    )
  }

  /**
   * Render the Youtube iframe, responsively.
   *
   * @return {Element}
   */

  renderVideo = () => {
    const { node, isFocused } = this.props
    const video = node.data.get('video')

    const wrapperStyle = {
      position: 'relative',
      outline: isFocused ? '2px solid blue' : 'none',
    }

    const maskStyle = {
      display: isFocused ? 'none' : 'block',
      position: 'absolute',
      top: '0',
      left: '0',
      height: '100%',
      width: '100%',
      cursor: 'cell',
      zIndex: 1,
    }

    const iframeStyle = {
      display: 'block',
    }

    return (
      <div style={wrapperStyle}>
        <div style={maskStyle} />
        <iframe
          id="ytplayer"
          type="text/html"
          width="640"
          height="476"
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
    const { node } = this.props
    const video = node.data.get('video')
    const style = {
      marginTop: '5px',
      boxSizing: 'border-box',
    }

    return (
      <VideoUrlInput
        defaultValue={video}
        onChange={this.onChange}
        onClick={this.onClick}
        style={style}
      />
    )
  }
}

/**
 * The video URL input as controlled input to avoid loosing cursor position.
 *
 * @type {Component}
 */

const VideoUrlInput = props => {
  const [val, setVal] = React.useState(props.defaultValue)

  const onChange = React.useCallback(
    e => {
      setVal(e.target.value)
      props.onChange(e.target.value)
    },
    [props.onChange]
  )

  return (
    <input
      value={val}
      onChange={onChange}
      onClick={props.onClick}
      style={props.style}
    />
  )
}

/**
 * Export.
 */

export default Video
