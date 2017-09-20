
import Debug from 'debug'
import React from 'react'
import SlateTypes from 'slate-prop-types'
import Types from 'prop-types'

import Leaf from './leaf'

/**
 * Debug.
 *
 * @type {Function}
 */

const debug = Debug('slate:node')

class Text extends React.Component {

  /**
   * Property types.
   *
   * @type {Object}
   */

  static propTypes = {
    block: SlateTypes.block,
    editor: Types.object.isRequired,
    node: SlateTypes.node.isRequired,
    parent: SlateTypes.node.isRequired,
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
    const { key } = node
    debug(message, `${key} (text)`, ...args)
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
    const n = nextProps
    const p = props

    // If the node has changed, update. PERF: There are cases where it will have
    // changed, but it's properties will be exactly the same (eg. copy-paste)
    // which this won't catch. But that's rare and not a drag on performance, so
    // for simplicity we just let them through.
    if (n.node != p.node) return true

    // Re-render if the current decorations have changed, even if the content of
    // the text node itself hasn't.
    if (n.schema.hasDecorators) {
      const nDecorators = n.state.document.getDescendantDecorators(n.node.key, n.schema)
      const pDecorators = p.state.document.getDescendantDecorators(p.node.key, p.schema)
      const nRanges = n.node.getRanges(nDecorators)
      const pRanges = p.node.getRanges(pDecorators)
      if (!nRanges.equals(pRanges)) return true
    }

    // If the node parent is a block node, and it was the last child of the
    // block, re-render to cleanup extra `<br/>` or `\n`.
    if (n.parent.kind == 'block') {
      const pLast = p.parent.nodes.last()
      const nLast = n.parent.nodes.last()
      if (p.node == pLast && n.node != nLast) return true
    }

    // Otherwise, don't update.
    return false
  }

  /**
   * Render.
   *
   * @return {Element}
   */

  render() {
    const { props } = this
    this.debug('render', { props })

    const { node, schema, state } = props
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

export default Text
