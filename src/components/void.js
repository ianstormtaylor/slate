
import Debug from 'debug'
import Leaf from './leaf'
import Mark from '../models/mark'
import OffsetKey from '../utils/offset-key'
import React from 'react'
import noop from '../utils/noop'
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
    children: React.PropTypes.any.isRequired,
    editor: React.PropTypes.object.isRequired,
    node: React.PropTypes.object.isRequired,
    parent: React.PropTypes.object.isRequired,
    schema: React.PropTypes.object.isRequired,
    state: React.PropTypes.object.isRequired,
  };

  /**
   * Debug.
   *
   * @param {String} message
   * @param {Mixed} ...args
   */

  debug = (message, ...args) => {
    const { node } = this.props
    const { key, type } = node
    let id = `${key} (${type})`
    debug(message, `${id}`, ...args)
  }

  /**
   * When one of the wrapper elements it clicked, select the void node.
   *
   * @param {Event} event
   */

  onClick = (event) => {
    event.preventDefault()
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
   * Render.
   *
   * @return {Element}
   */

  render = () => {
    const { props } = this
    const { children, node } = props
    const Tag = node.kind == 'block' ? 'div' : 'span'

    // Make the outer wrapper relative, so the spacer can overlay it.
    const style = {
      position: 'relative'
    }

    this.debug('render', { props })

    return (
      <Tag data-slate-void style={style} onClick={this.onClick}>
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
        position: 'relative',
        top: '0px',
        left: '-9999px',
        textIndent: '-9999px',
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
    const { node, schema, state } = this.props
    const child = node.getFirstText()
    const ranges = child.getRanges()
    const text = ''
    const marks = Mark.createSet()
    const index = 0
    const offsetKey = OffsetKey.stringify({
      key: child.key,
      index
    })

    return (
      <Leaf
        isVoid
        renderMark={noop}
        key={offsetKey}
        schema={schema}
        state={state}
        node={child}
        parent={node}
        ranges={ranges}
        index={index}
        text={text}
        marks={marks}
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
