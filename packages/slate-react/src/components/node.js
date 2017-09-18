
import Base64 from 'slate-base64-serializer'
import Debug from 'debug'
import React from 'react'
import SlateTypes from 'slate-prop-types'
import logger from 'slate-dev-logger'
import Types from 'prop-types'

import TRANSFER_TYPES from '../constants/transfer-types'
import Void from './void'
import Text from './text'
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
    this.state.Component = node.getComponent(schema)
  }

  /**
   * Debug.
   *
   * @param {String} message
   * @param {Mixed} ...args
   */

  debug = (message, ...args) => {
    const { node } = this.props
    const { key, type } = node
    debug(message, `${key} (${type})`, ...args)
  }

  /**
   * On receiving new props, update the `Component` renderer.
   *
   * @param {Object} props
   */

  componentWillReceiveProps = (props) => {
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
    if (Component && Component.suppressShouldComponentUpdate) {
      logger.deprecate('2.2.0', 'The `suppressShouldComponentUpdate` property is deprecated because it led to an important performance loss, use `shouldNodeComponentUpdate` instead.')
      return true
    }

    // If the `Component` has a custom logic to determine whether the component
    // needs to be updated or not, return true if it returns true.
    // If it returns false, we still want to benefit from the
    // performance gain of the rest of the logic.
    if (Component && Component.shouldNodeComponentUpdate) {
      const shouldUpdate = Component.shouldNodeComponentUpdate(p, n)

      if (shouldUpdate) {
        return true
      }

      if (shouldUpdate === false) {
        logger.warn('Returning false in `shouldNodeComponentUpdate` does not disable Slate\'s internal `shouldComponentUpdate` logic. If you want to prevent updates, use React\'s `shouldComponentUpdate` instead.')
      }
    }

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

    // Otherwise, don't update.
    return false
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

    this.debug('render', { props })

    const { editor, isSelected, node, parent, readOnly, state } = props
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
   * Render a `child` node.
   *
   * @param {Node} child
   * @param {Boolean} isSelected
   * @return {Element}
   */

  renderNode = (child, isSelected) => {
    const { block, editor, node, readOnly, schema, state } = this.props
    const Component = child.kind === 'text' ? Text : Node
    return (
      <Component
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

}

/**
 * Export.
 *
 * @type {Component}
 */

export default Node
