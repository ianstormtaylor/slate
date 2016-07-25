
import Base64 from '../serializers/base-64'
import React from 'react'
import TYPES from '../utils/types'

/**
 * Draggable.
 *
 * @type {Component}
 */

class Draggable extends React.Component {

  static propTypes = {
    children: React.PropTypes.any.isRequired,
    className: React.PropTypes.string,
    editor: React.PropTypes.object.isRequired,
    node: React.PropTypes.object.isRequired,
    state: React.PropTypes.object.isRequired,
    style: React.PropTypes.object
  };

  static defaultProps = {
    style: {}
  }

  shouldComponentUpdate = (props) => {
    return (
      props.node != this.props.node ||
      props.state.selection.hasEdgeIn(props.node) ||
      this.props.state.selection.hasEdgeIn(this.props.node)
    )
  }

  onDragStart = (e) => {
    const { node } = this.props
    const encoded = Base64.serializeNode(node)
    const data = e.nativeEvent.dataTransfer
    data.setData(TYPES.NODE, encoded)
  }

  render = () => {
    const { children, node, className, style } = this.props
    const Tag = node.kind == 'block' ? 'div' : 'span'
    return (
      <Tag
        draggable
        onDragStart={this.onDragStart}
        className={className}
        style={style}
      >
        {children}
      </Tag>
    )
  }

}

/**
 * Export.
 */

export default Draggable
