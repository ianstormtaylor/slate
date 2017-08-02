
import Debug from 'debug'
import React from 'react'
import ReactDOM from 'react-dom'
import Types from 'prop-types'

import TRANSFER_TYPES from '../constants/transfer-types'
import Base64 from '../serializers/base-64'
import Leaf from './leaf'
import Void from './void'
import getWindow from 'get-window'
import scrollToSelection from '../utils/scroll-to-selection'
import setTransferData from '../utils/set-transfer-data'

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
    block: Types.object,
    editor: Types.object.isRequired,
    node: Types.object.isRequired,
    parent: Types.object.isRequired,
    readOnly: Types.bool.isRequired,
    schema: Types.object.isRequired,
    state: Types.object.isRequired
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
    const id = kind == 'text' ? `${key} (${kind})` : `${key} (${type})`
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
    const { props } = this
    const { Component } = this.state

    // If the `Component` has enabled suppression of update checking, always
    // return true so that it can deal with update checking itself.
    if (Component && Component.suppressShouldComponentUpdate) return true

    // If the `readOnly` status has changed, re-render in case there is any
    // user-land logic that depends on it, like nested editable contents.
    if (nextProps.readOnly != props.readOnly) return true

    // If the node has changed, update. PERF: There are cases where it will have
    // changed, but it's properties will be exactly the same (eg. copy-paste)
    // which this won't catch. But that's rare and not a drag on performance, so
    // for simplicity we just let them through.
    if (nextProps.node != props.node) return true

    // If the node is a block or inline, which can have custom renderers, we
    // include an extra check to re-render if the node's focus changes, to make
    // it simple for users to show a node's "selected" state.
    if (nextProps.node.kind != 'text') {
      const hasEdgeIn = props.state.selection.hasEdgeIn(props.node)
      const nextHasEdgeIn = nextProps.state.selection.hasEdgeIn(nextProps.node)
      const hasFocus = props.state.isFocused || nextProps.state.isFocused
      const hasEdge = hasEdgeIn || nextHasEdgeIn
      if (hasFocus && hasEdge) return true
    }

    // If the node is a text node, re-render if the current decorations have
    // changed, even if the content of the text node itself hasn't.
    if (nextProps.node.kind == 'text' && nextProps.schema.hasDecorators) {
      const nextDecorators = nextProps.state.document.getDescendantDecorators(nextProps.node.key, nextProps.schema)
      const decorators = props.state.document.getDescendantDecorators(props.node.key, props.schema)
      const nextRanges = nextProps.node.getRanges(nextDecorators)
      const ranges = props.node.getRanges(decorators)
      if (!nextRanges.equals(ranges)) return true
    }

    // If the node is a text node, and its parent is a block node, and it was
    // the last child of the block, re-render to cleanup extra `<br/>` or `\n`.
    if (nextProps.node.kind == 'text' && nextProps.parent.kind == 'block') {
      const last = props.parent.nodes.last()
      const nextLast = nextProps.parent.nodes.last()
      if (props.node == last && nextProps.node != nextLast) return true
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
   * There is a corner case, that some nodes are unmounted right after they update
   * Then, when the timer execute, it will throw the error
   * `findDOMNode was called on an unmounted component`
   * We should clear the timer from updateScroll here
   */

  componentWillUnmount = () => {
    clearTimeout(this.scrollTimer)
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

    // The native selection will be updated after componentDidMount or componentDidUpdate.
    // Use setTimeout to queue scrolling to the last when the native selection has been updated to the correct value.
    this.scrollTimer = setTimeout(() => {
      const el = ReactDOM.findDOMNode(this)
      const window = getWindow(el)
      const native = window.getSelection()
      scrollToSelection(native)

      this.debug('updateScroll', el)
    })
  }

  /**
   * On drag start, add a serialized representation of the node to the data.
   *
   * @param {Event} e
   */

  onDragStart = (e) => {
    const { node } = this.props

    // Only void node are draggable
    if (!node.isVoid) {
      return
    }

    const encoded = Base64.serializeNode(node, { preserveKeys: true })
    const { dataTransfer } = e.nativeEvent

    setTransferData(dataTransfer, TRANSFER_TYPES.NODE, encoded)

    this.debug('onDragStart', e)
  }

  /**
   * Render.
   *
   * @return {Element}
   */

  render() {
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
    const { block, editor, node, readOnly, schema, state } = this.props
    return (
      <Node
        key={child.key}
        node={child}
        block={node.kind == 'block' ? node : block}
        parent={node}
        editor={editor}
        readOnly={readOnly}
        schema={schema}
        state={state}
      />
    )
  }

  /**
   * Render an element `node`.
   *
   * @return {Element}
   */

  renderElement = () => {
    const { editor, node, parent, readOnly, state } = this.props
    const { Component } = this.state
    const children = node.nodes.map(this.renderNode).toArray()

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
        readOnly={readOnly}
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
    const { block, node, parent, schema, state, editor } = this.props
    const { text, marks } = range

    return (
      <Leaf
        key={`${node.key}-${index}`}
        block={block}
        editor={editor}
        index={index}
        marks={marks}
        node={node}
        offset={offset}
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
