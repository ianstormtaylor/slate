
import Debug from 'debug'
import React from 'react'
import Types from 'prop-types'

import Leaf from './leaf'
import Mark from '../models/mark'
import OffsetKey from '../utils/offset-key'
import { IS_FIREFOX } from '../constants/environment'

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
    block: Types.object,
    children: Types.any.isRequired,
    editor: Types.object.isRequired,
    node: Types.object.isRequired,
    parent: Types.object.isRequired,
    readOnly: Types.bool.isRequired,
    schema: Types.object.isRequired,
    state: Types.object.isRequired,
  }

  /**
   * State
   *
   * @type {Object}
   */

  state = {
    dragCounter: 0,
    editable: false
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
    const next = editor
      .getState()
      .transform()
      // COMPAT: In Chrome & Safari, selections that are at the zero offset of
      // an inline node will be automatically replaced to be at the last offset
      // of a previous inline node, which screws us up, so we always want to set
      // it to the end of the node. (2016/11/29)
      .collapseToEndOf(node)
      .focus()
      .apply()

    editor.onChange(next)
  }

  /**
   * Increment counter, and temporarily switch node to editable to allow drop events
   * Counter required as onDragLeave fires when hovering over child elements
   *
   * @param {Event} event
   */

  onDragEnter = () => {
    this.setState((prevState) => {
      const dragCounter = prevState.dragCounter + 1
      return { dragCounter, editable: undefined }
    })
  }

  /**
   * Decrement counter, and if counter 0, then no longer dragging over node
   * and thus switch back to non-editable
   *
   * @param {Event} event
   */

  onDragLeave = () => {
    this.setState((prevState) => {
      const dragCounter = prevState.dragCounter + 1
      const editable = dragCounter === 0 ? false : undefined
      return { dragCounter, editable }
    })
  }

  /**
   * If dropped item onto node, then reset state
   *
   * @param {Event} event
   */

  onDrop = () => {
    this.setState({ dragCounter: 0, editable: false })
  }

  /**
   * Render.
   *
   * @return {Element}
   */

  render() {
    const { props } = this
    const { children, node } = props
    let Tag, style

    // Make the outer wrapper relative, so the spacer can overlay it.
    if (node.kind === 'block') {
      Tag = 'div'
      style = { position: 'relative' }
    } else {
      Tag = 'span'
    }

    this.debug('render', { props })

    return (
      <Tag
        data-slate-void
        style={style}
        onClick={this.onClick}
        onDragEnter={this.onDragEnter}
        onDragLeave={this.onDragLeave}
        onDrop={this.onDrop}
      >
        {this.renderSpacer()}
        <Tag contentEditable={this.state.editable}>
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
      style = IS_FIREFOX
        ? {
          pointerEvents: 'none',
          width: '0px',
          height: '0px',
          lineHeight: '0px',
          visibility: 'hidden'
        }
        : {
          position: 'absolute',
          top: '0px',
          left: '-9999px',
          textIndent: '-9999px'
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
