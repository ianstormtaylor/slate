
import Base64 from '../serializers/base-64'
import Debug from 'debug'
import React from 'react'
import ReactDOM from 'react-dom'
import TYPES from '../utils/types'
import Text from './text'
import Void from './void'
import scrollTo from '../utils/scroll-to'

/**
 * Debug.
 *
 * @type {Function}
 */

const debug = Debug('slate:node')

/**
 * Node.
 *
 * @type {Component}
 */

class Node extends React.Component {

  /**
   * Property types.
   *
   * @type {Object}
   */

  static propTypes = {
    editor: React.PropTypes.object.isRequired,
    node: React.PropTypes.object.isRequired,
    renderDecorations: React.PropTypes.func.isRequired,
    renderMark: React.PropTypes.func.isRequired,
    renderNode: React.PropTypes.func.isRequired,
    state: React.PropTypes.object.isRequired
  };

  /**
   * Default properties.
   *
   * @type {Object}
   */

  static defaultProps = {
    style: {}
  }

  /**
   * Constructor.
   *
   * @param {Object} props
   */

  constructor(props) {
    super(props)
    this.state = {}

    if (props.node.kind != 'text') {
      this.state.Component = props.renderNode(props.node)
    }
  }

  /**
   * Debug.
   *
   * @param {String} message
   * @param {Mixed} ...args
   */

  debug = (message, ...args) => {
    const { node } = this.props
    const { key, kind, type } = node
    let id = kind == 'text' ? `${key} (${kind})` : `${key} (${type})`
    debug(message, `${id}`, ...args)
  }

  /**
   * On receiving new props, update the `Component` renderer.
   *
   * @param {Object} props
   */

  componentWillReceiveProps = (props) => {
    if (props.node.kind == 'text') return
    if (props.node == this.props.node) return

    this.setState({
      Component: props.renderNode(props.node)
    })
  }

  /**
   * Should the node update?
   *
   * @param {Object} props
   * @param {Object} state
   * @return {Boolean}
   */

  shouldComponentUpdate = (props) => {
    const { Component } = this.state

    // If the node is rendered with a `Component` that has enabled suppression
    // of update checking, always return true so that it can deal with update
    // checking itself.
    if (Component && Component.suppressShouldComponentUpdate) {
      return true
    }

    // Otherwise, perform a peformant update check by default.
    if (
      props.node != this.props.node ||
      (props.state.isFocused && props.state.selection.hasEdgeIn(props.node))
    ) {
      return true
    }

    // For block and inline nodes, which can have custom renderers, we need to
    // include another check for whether the previous selection had an edge in
    // the node, to allow for intuitive selection-based rendering.
    if (
      this.props.node.kind != 'text' &&
      this.props.state.isFocused &&
      this.props.state.selection.hasEdgeIn(this.props.node)
    ) {
      return true
    }

    // Otherwise, don't update.
    return false
  }

  /**
   * On mount, update the scroll position.
   */

  componentDidMount = () => {
    this.updateScroll()
  }

  /**
   * After update, update the scroll position if the node's content changed.
   *
   * @param {Object} prevProps
   * @param {Object} prevState
   */

  componentDidUpdate = (prevProps, prevState) => {
    if (this.props.node != prevProps.node) this.updateScroll()
  }

  /**
   * Update the scroll position after a change as occured if this is a leaf
   * block and it has the selection's ending edge. This ensures that scrolling
   * matches native `contenteditable` behavior even for cases where the edit is
   * not applied natively, like when enter is pressed.
   */

  updateScroll = () => {
    const { node, state } = this.props
    const { selection } = state

    // If this isn't a block, or it's a wrapping block, abort.
    if (node.kind != 'block') return
    if (node.nodes.first().kind == 'block') return

    // If the selection is blurred, or this block doesn't contain it, abort.
    if (selection.isBlurred) return
    if (!selection.hasEndIn(node)) return

    const el = ReactDOM.findDOMNode(this)
    scrollTo(el)

    this.debug('updateScroll', el)
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

    this.debug('onDragStart', e)
  }

  /**
   * Render.
   *
   * @return {Element} element
   */

  render = () => {
    this.debug('render')

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
    const { editor, node, state } = this.props
    const { Component } = this.state
    const children = node.nodes
      .map(child => this.renderNode(child))
      .toArray()

    // Attributes that the developer must to mix into the element in their
    // custom node renderer component.
    const attributes = {
      'data-key': node.key,
      'onDragStart': this.onDragStart
    }

    // If it's a block node with inline children, add the proper `dir` attribute
    // for text direction.
    if (node.kind == 'block' && node.nodes.first().kind != 'block') {
      const direction = node.getTextDirection()
      if (direction == 'rtl') attributes.dir = 'rtl'
    }

    const element = (
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

    return node.isVoid
      ? <Void {...this.props}>{element}</Void>
      : element
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
