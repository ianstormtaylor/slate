
import Debug from 'debug'
import React from 'react'
import SlateTypes from 'slate-prop-types'
import Types from 'prop-types'
import { Mark } from 'slate'

import Leaf from './leaf'
import OffsetKey from '../utils/offset-key'

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

  onDragOver = event => event.preventDefault()

  onDragEnter = event => event.preventDefault()

  /**
   * Render.
   *
   * @return {Element}
   */

  render() {
    const { props } = this
    const { children, node } = props
    const Tag = node.kind == 'block' ? 'div' : 'span'

    this.debug('render', { props })

    return (
      <Tag
        data-slate-void
        data-key={node.key}
        onClick={this.onClick}
        onDragOver={this.onDragOver}
        onDragEnter={this.onDragEnter}
      >
        {this.renderSpacer()}
        <Tag contentEditable={false}>
          {children}
        </Tag>
      </Tag>
    )
  }

  /**
   * Render a fake spacer leaf, which will catch the cursor when it the void
   * node is navigated to with the arrow keys. Having this spacer there means
   * the browser continues to manage the selection natively, so it keeps track
   * of the right offset when moving across the block.
   *
   * @return {Element}
   */

  renderSpacer = () => {
    const { node } = this.props
    let style

    if (node.kind == 'block') {
      style = {
        display: 'inline-block',
        verticalAlign: 'top',
        width: '0',
        height: '0',
        color: 'transparent'
      }
    } else {
      style = {
        color: 'transparent'
      }
    }

    return (
      <span style={style}>{this.renderLeaf()}</span>
    )
  }

  /**
   * Render a fake leaf.
   *
   * @return {Element}
   */

  renderLeaf = () => {
    const { block, node, schema, state, editor } = this.props
    const child = node.getFirstText()
    const ranges = child.getRanges()
    const text = ''
    const offset = 0
    const marks = Mark.createSet()
    const index = 0
    const offsetKey = OffsetKey.stringify({
      key: child.key,
      index
    })

    return (
      <Leaf
        key={offsetKey}
        block={node.kind == 'block' ? node : block}
        editor={editor}
        index={index}
        marks={marks}
        node={child}
        offset={offset}
        parent={node}
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

export default Void
