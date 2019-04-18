import Debug from 'debug'
import ImmutableTypes from 'react-immutable-proptypes'
import React from 'react'
import SlateTypes from 'slate-prop-types'
import Types from 'prop-types'
import { PathUtils } from 'slate'

import Leaf from './leaf'

/**
 * Debug.
 *
 * @type {Function}
 */

const debug = Debug('slate:node')

/**
 * Text.
 *
 * @type {Component}
 */

class Text extends React.Component {
  /**
   * Property types.
   *
   * @type {Object}
   */

  static propTypes = {
    block: SlateTypes.block,
    decorations: ImmutableTypes.list.isRequired,
    editor: Types.object.isRequired,
    node: SlateTypes.node.isRequired,
    parent: SlateTypes.node.isRequired,
    style: Types.object,
  }

  /**
   * Default prop types.
   *
   * @type {Object}
   */

  static defaultProps = {
    style: null,
  }

  /**
   * Debug.
   *
   * @param {String} message
   * @param {Mixed} ...args
   */

  debug = (message, ...args) => {
    const { node } = this.props
    const { key } = node
    debug(message, `${key} (text)`, ...args)
  }

  /**
   * Should the node update?
   *
   * @param {Object} nextProps
   * @param {Object} value
   * @return {Boolean}
   */

  shouldComponentUpdate = nextProps => {
    const { props } = this
    const n = nextProps
    const p = props

    // If the node has changed, update. PERF: There are cases where it will have
    // changed, but it's properties will be exactly the same (eg. copy-paste)
    // which this won't catch. But that's rare and not a drag on performance, so
    // for simplicity we just let them through.
    if (n.node != p.node) return true

    // If the node parent is a block node, and it was the last child of the
    // block, re-render to cleanup extra `\n`.
    if (n.parent.object == 'block') {
      const pLast = p.parent.nodes.last()
      const nLast = n.parent.nodes.last()
      if (p.node == pLast && n.node != nLast) return true
    }

    // Re-render if the current decorations have changed.
    if (!n.decorations.equals(p.decorations)) return true

    // Otherwise, don't update.
    return false
  }

  /**
   * Render.
   *
   * @return {Element}
   */

  render() {
    this.debug('render', this)

    const { decorations, editor, node, style } = this.props
    const { value } = editor
    const { document } = value
    const { key } = node

    const decs = decorations.filter(d => {
      const { start, end } = d

      // If either of the decoration's keys match, include it.
      if (start.key === key || end.key === key) return true

      // Otherwise, if the decoration is in a single node, it's not ours.
      if (start.key === end.key) return false

      // If the node's path is before the start path, ignore it.
      const path = document.assertPath(key)
      if (PathUtils.compare(path, start.path) === -1) return false

      // If the node's path is after the end path, ignore it.
      if (PathUtils.compare(path, end.path) === 1) return false

      // Otherwise, include it.
      return true
    })

    // PERF: Take advantage of cache by avoiding arguments
    const leaves = decs.size === 0 ? node.getLeaves() : node.getLeaves(decs)
    let offset = 0

    const children = leaves.map((leaf, i) => {
      const child = this.renderLeaf(leaves, leaf, i, offset)
      offset += leaf.text.length
      return child
    })

    return (
      <span data-key={key} style={style}>
        {children}
      </span>
    )
  }

  /**
   * Render a single leaf given a `leaf` and `offset`.
   *
   * @param {List<Leaf>} leaves
   * @param {Leaf} leaf
   * @param {Number} index
   * @param {Number} offset
   * @return {Element} leaf
   */

  renderLeaf = (leaves, leaf, index, offset) => {
    const { block, node, parent, editor } = this.props
    const { text, marks } = leaf

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
        leaves={leaves}
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

export default Text
