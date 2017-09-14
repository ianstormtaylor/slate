
import Base64 from 'slate-base64-serializer'
import Debug from 'debug'
import React from 'react'
import ReactDOM from 'react-dom'
import SlateTypes from 'slate-prop-types'
import Types from 'prop-types'
import getWindow from 'get-window'

import TRANSFER_TYPES from '../constants/transfer-types'
import Leaf from './leaf'
import Void from './void'
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
    block: SlateTypes.block,
    editor: Types.object.isRequired,
    isSelected: Types.bool.isRequired,
    node: SlateTypes.node.isRequired,
    parent: SlateTypes.node.isRequired,
    readOnly: Types.bool.isRequired,
    schema: SlateTypes.schema.isRequired,
    state: SlateTypes.state.isRequired,
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
    const n = nextProps
    const p = props

    // If the `Component` has enabled suppression of update checking, always
    // return true so that it can deal with update checking itself.
    if (Component && Component.suppressShouldComponentUpdate) return true

    // If the `readOnly` status has changed, re-render in case there is any
    // user-land logic that depends on it, like nested editable contents.
    if (n.readOnly != p.readOnly) return true

    // If the node has changed, update. PERF: There are cases where it will have
    // changed, but it's properties will be exactly the same (eg. copy-paste)
    // which this won't catch. But that's rare and not a drag on performance, so
    // for simplicity we just let them through.
    if (n.node != p.node) return true

    // If the selection state of the node or of some of its children has changed,
    // re-render in case there is any user-land logic depends on it to render.
    // if the node is selected update it, even if it was already selected: the
    // selection state of some of its children could have been changed and they
    // need to be rendered again.
    if (n.isSelected || p.isSelected) return true

    // If the node is a text node, re-render if the current decorations have
    // changed, even if the content of the text node itself hasn't.
    if (n.node.kind == 'text' && n.schema.hasDecorators) {
      const nDecorators = n.state.document.getDescendantDecorators(n.node.key, n.schema)
      const pDecorators = p.state.document.getDescendantDecorators(p.node.key, p.schema)
      const nRanges = n.node.getRanges(nDecorators)
      const pRanges = p.node.getRanges(pDecorators)
      if (!nRanges.equals(pRanges)) return true
    }

    // If the node is a text node, and its parent is a block node, and it was
    // the last child of the block, re-render to cleanup extra `<br/>` or `\n`.
    if (n.node.kind == 'text' && n.parent.kind == 'block') {
      const pLast = p.parent.nodes.last()
      const nLast = n.parent.nodes.last()
      if (p.node == pLast && n.node != nLast) return true
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
   * @param {Boolean} isSelected
   * @return {Element}
   */

  renderNode = (child, isSelected) => {
    const { block, editor, node, readOnly, schema, state } = this.props
    return (
      <Node
        block={node.kind == 'block' ? node : block}
        editor={editor}
        isSelected={isSelected}
        key={child.key}
        node={child}
        parent={node}
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
    const { editor, isSelected, node, parent, readOnly, state } = this.props
    const { Component } = this.state
    const { selection } = state
    const indexes = node.getSelectionIndexes(selection, isSelected)
    const children = node.nodes.toArray().map((child, i) => {
      const isChildSelected = !!indexes && indexes.start <= i && i < indexes.end
      return this.renderNode(child, isChildSelected)
    })

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
        editor={editor}
        isSelected={isSelected}
        key={node.key}
        node={node}
        parent={parent}
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
