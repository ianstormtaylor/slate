
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
    renderDecorations: React.PropTypes.func.isRequired,
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
      (props.state.isFocused && props.state.selection.hasEdgeIn(props.node))
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
   * Render a `child` node.
   *
   * @param {Node} child
   * @return {Element} element
   */

  renderNode = (child) => {
    const { editor, renderDecorations, renderMark, renderNode, state } = this.props
    return (
      <Node
        key={child.key}
        node={child}
        state={state}
        editor={editor}
        renderDecorations={renderDecorations}
        renderMark={renderMark}
        renderNode={renderNode}
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

    // Calcul direction of text
    const dir = node.textDir

    // Attributes that the developer has to mix into the element in their custom
    // renderer component.
    const attributes = {
      'dir': dir !== 'ltr' ? dir : undefined,
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
    const { node, editor, renderDecorations, renderMark, state } = this.props
    return (
      <Text
        key={node.key}
        editor={editor}
        node={node}
        renderDecorations={renderDecorations}
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
