
import Base64 from 'slate-base64-serializer'
import Debug from 'debug'
import React from 'react'
import SlateTypes from 'slate-prop-types'
import Types from 'prop-types'

import setTransferData from '../utils/set-transfer-data'
import Text from './text'
import TRANSFER_TYPES from '../constants/transfer-types'

/**
 * Debug.
 *
 * @type {Function}
 */

const debug = Debug('slate:void')

/**
 * Void.
 *
 * @type {Component}
 */

class Void extends React.Component {

  /**
   * Property types.
   *
   * @type {Object}
   */

  static propTypes = {
    block: SlateTypes.block,
    children: Types.any.isRequired,
    editor: Types.object.isRequired,
    node: SlateTypes.node.isRequired,
    parent: SlateTypes.node.isRequired,
    readOnly: Types.bool.isRequired,
    schema: SlateTypes.schema.isRequired,
    state: SlateTypes.state.isRequired,
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
    const id = `${key} (${type})`
    debug(message, `${id}`, ...args)
  }

  /**
   * When one of the wrapper elements it clicked, select the void node.
   *
   * @param {Event} event
   */

  onClick = (event) => {
    if (this.props.readOnly) return

    this.debug('onClick', { event })

    const { node, editor } = this.props

    editor.change((change) => {
      change
        // COMPAT: In Chrome & Safari, selections that are at the zero offset of
        // an inline node will be automatically replaced to be at the last
        // offset of a previous inline node, which screws us up, so we always
        // want to set it to the end of the node. (2016/11/29)
        .collapseToEndOf(node)
        .focus()
    })
  }

  /**
   * On drag enter, prevent default to allow drops.
   *
   * @type {Event} event
   */

  onDragEnter = (event) => {
    if (this.props.readOnly) return
    event.preventDefault()
  }

  /**
   * On drag over, prevent default to allow drops.
   *
   * @type {Event} event
   */

  onDragOver = (event) => {
    if (this.props.readOnly) return
    event.preventDefault()
  }

  /**
   * On drag start, add a serialized representation of the node to the data.
   *
   * @param {Event} event
   */

  onDragStart = (event) => {
    const { node } = this.props
    const encoded = Base64.serializeNode(node, { preserveKeys: true })
    const { dataTransfer } = event.nativeEvent

    setTransferData(dataTransfer, TRANSFER_TYPES.NODE, encoded)

    this.debug('onDragStart', event)
  }

  /**
   * Render.
   *
   * @return {Element}
   */

  render() {
    const { props } = this
    const { children, node, readOnly } = props
    const Tag = node.kind == 'block' ? 'div' : 'span'
    const style = {
      height: '0',
      color: 'transparent'
    }

    this.debug('render', { props })

    return (
      <Tag
        data-slate-void
        data-key={node.key}
        onClick={this.onClick}
        onDragOver={this.onDragOver}
        onDragEnter={this.onDragEnter}
        onDragStart={this.onDragStart}
      >
        {!readOnly && <Tag style={style}>
          {this.renderText()}
        </Tag>}
        <Tag contentEditable={readOnly ? null : false}>
          {children}
        </Tag>
      </Tag>
    )
  }

  /**
   * Render the void node's text node, which will catch the cursor when it the
   * void node is navigated to with the arrow keys.
   *
   * Having this text node there means the browser continues to manage the
   * selection natively, so it keeps track of the right offset when moving
   * across the block.
   *
   * @return {Element}
   */

  renderText = () => {
    const { block, decorations, isSelected, node, readOnly, schema, state, editor } = this.props
    const child = node.getFirstText()
    return (
      <Text
        block={node.kind == 'block' ? node : block}
        decorations={decorations}
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

export default Void
