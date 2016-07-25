
import Base64 from '../serializers/base-64'
import React from 'react'
import TYPES from '../utils/types'
import Text from './text'

/**
 * Node.
 *
 * @type {Component}
 */

class Node extends React.Component {

  static propTypes = {
    editor: React.PropTypes.object.isRequired,
    node: React.PropTypes.object.isRequired,
    renderMark: React.PropTypes.func.isRequired,
    renderNode: React.PropTypes.func.isRequired,
    state: React.PropTypes.object.isRequired
  };

  static defaultProps = {
    style: {}
  }

  shouldComponentUpdate = (props) => {
    return (
      props.node != this.props.node ||
      props.state.selection.hasEdgeIn(props.node)
    )
  }

  /**
   * On drag start, add a serialized representation of the node to the data.
   *
   * @param {Event} e
   */

  onDragStart = (e) => {
    const { node } = this.props
    const encoded = Base64.serializeNode(node)
    const data = e.nativeEvent.dataTransfer
    data.setData(TYPES.NODE, encoded)
  }

  /**
   * Render.
   *
   * @return {Element} element
   */

  render = () => {
    const { node } = this.props
    return node.kind == 'text'
      ? this.renderText()
      : this.renderElement()
  }

  /**
   * Render a `node`.
   *
   * @param {Node} node
   * @return {Element} element
   */

  renderNode = (node) => {
    const { editor, renderMark, renderNode, state } = this.props
    return (
      <Node
        key={node.key}
        node={node}
        state={state}
        editor={editor}
        renderNode={renderNode}
        renderMark={renderMark}
      />
    )
  }

  /**
   * Render an element `node`.
   *
   * @return {Element} element
   */

  renderElement = () => {
    const { editor, node, renderNode, state } = this.props
    const Component = renderNode(node)
    const children = node.nodes
      .map(child => this.renderNode(child))
      .toArray()

    // Attributes that the developer has to mix into the element in their custom
    // renderer component.
    const attributes = {
      'data-key': node.key,
      'onDragStart': this.onDragStart
    }

    return (
      <Component
        attributes={attributes}
        key={node.key}
        editor={editor}
        node={node}
        state={state}
      >
        {children}
      </Component>
    )
  }

  /**
   * Render a text node.
   *
   * @return {Element} element
   */

  renderText = () => {
    const { node, editor, renderMark, state } = this.props
    return (
      <Text
        key={node.key}
        editor={editor}
        node={node}
        renderMark={renderMark}
        state={state}
      />
    )
  }

}

/**
 * Export.
 */

export default Node
