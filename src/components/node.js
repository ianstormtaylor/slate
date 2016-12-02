
import Base64 from '../serializers/base-64'
import Debug from 'debug'
import React from 'react'
import ReactDOM from 'react-dom'
import TYPES from '../constants/types'
import Leaf from './leaf'
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
    parent: React.PropTypes.object.isRequired,
    schema: React.PropTypes.object.isRequired,
    state: React.PropTypes.object.isRequired
  }

  /**
   * Constructor.
   *
   * @param {Object} props
   */

  constructor(props) {
    super(props)
    const { node, schema } = props
    this.state = {}
    this.state.Component = node.kind == 'text' ? null : node.getComponent(schema)
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
    const Component = props.node.getComponent(props.schema)
    this.setState({ Component })
  }

  /**
   * Should the node update?
   *
   * @param {Object} nextProps
   * @param {Object} state
   * @return {Boolean}
   */

  shouldComponentUpdate = (nextProps) => {
    const { Component } = this.state

    // If the node is rendered with a `Component` that has enabled suppression
    // of update checking, always return true so that it can deal with update
    // checking itself.
    if (Component && Component.suppressShouldComponentUpdate) {
      return true
    }

    // If the node has changed, update. PERF: There are certain cases where the
    // node instance will have changed, but it's properties will be exactly the
    // same (copy-paste, delete backwards, etc.) in which case this will not
    // catch a potentially avoidable re-render. But those cases are rare enough
    // that they aren't really a drag on performance, so for simplicity we just
    // let them through.
    if (nextProps.node != this.props.node) {
      return true
    }

    const nextHasEdgeIn = nextProps.state.selection.hasEdgeIn(nextProps.node)

    // If the selection is focused and is inside the node, we need to update so
    // that the selection will be set by one of the <Leaf> components.
    if (
      nextProps.state.isFocused &&
      nextHasEdgeIn
    ) {
      return true
    }

    const hasEdgeIn = this.props.state.selection.hasEdgeIn(nextProps.node)
    // If the selection is blurred but was previously focused (or vice versa) inside the node,
    // we need to update to ensure the selection gets updated by re-rendering.
    if (
      this.props.state.isFocused != nextProps.state.isFocused &&
      (
          hasEdgeIn || nextHasEdgeIn
      )
    ) {
      return true
    }

    // For block and inline nodes, which can have custom renderers, we need to
    // include another check for whether the previous selection had an edge in
    // the node, to allow for intuitive selection-based rendering.
    if (
      this.props.node.kind != 'text' &&
      hasEdgeIn != nextHasEdgeIn
    ) {
      return true
    }

    // For text nodes, which can have custom decorations, we need to check to
    // see if the block has changed, which has caused the decorations to change.
    if (nextProps.node.kind == 'text' && nextProps.schema.hasDecorators) {
      const { node, schema, state } = nextProps

      const { document } = state
      const decorators = document.getDescendantDecorators(node.key, schema)
      const ranges = node.getRanges(decorators)

      const prevNode = this.props.node
      const prevSchema = this.props.schema
      const prevDocument = this.props.state.document
      const prevDecorators = prevDocument.getDescendantDecorators(prevNode.key, prevSchema)
      const prevRanges = prevNode.getRanges(prevDecorators)

      if (!ranges.equals(prevRanges)) {
        return true
      }
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
    const encoded = Base64.serializeNode(node, { preserveKeys: true })
    const data = e.nativeEvent.dataTransfer
    data.setData(TYPES.NODE, encoded)

    this.debug('onDragStart', e)
  }

  /**
   * Render.
   *
   * @return {Element}
   */

  render = () => {
    const { props } = this
    const { node } = this.props

    this.debug('render', { props })

    return node.kind == 'text'
      ? this.renderText()
      : this.renderElement()
  }

  /**
   * Render a `child` node.
   *
   * @param {Node} child
   * @return {Element}
   */

  renderNode = (child) => {
    return (
      <Node
        key={child.key}
        node={child}
        parent={this.props.node}
        editor={this.props.editor}
        schema={this.props.schema}
        state={this.props.state}
      />
    )
  }

  /**
   * Render an element `node`.
   *
   * @return {Element}
   */

  renderElement = () => {
    const { editor, node, parent, state } = this.props
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
        parent={parent}
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
   * @return {Element}
   */

  renderText = () => {
    const { node, schema, state } = this.props
    const { document } = state
    const decorators = schema.hasDecorators ? document.getDescendantDecorators(node.key, schema) : []
    const ranges = node.getRanges(decorators)
    let offset = 0

    const leaves = ranges.map((range, i) => {
      const leaf = this.renderLeaf(ranges, range, i, offset)
      offset += range.text.length
      return leaf
    })

    return (
      <span data-key={node.key}>
        {leaves}
      </span>
    )
  }

  /**
   * Render a single leaf node given a `range` and `offset`.
   *
   * @param {List<Range>} ranges
   * @param {Range} range
   * @param {Number} index
   * @param {Number} offset
   * @return {Element} leaf
   */

  renderLeaf = (ranges, range, index, offset) => {
    const { node, parent, schema, state } = this.props
    const text = range.text
    const marks = range.marks

    return (
      <Leaf
        key={`${node.key}-${index}`}
        index={index}
        marks={marks}
        node={node}
        parent={parent}
        ranges={ranges}
        schema={schema}
        state={state}
        text={text}
      />
    )
  }

}

/**
 * Export.
 *
 * @type {Component}
 */

export default Node
