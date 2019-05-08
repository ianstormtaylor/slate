import Debug from 'debug'
import ImmutableTypes from 'react-immutable-proptypes'
import React from 'react'
import SlateTypes from 'slate-prop-types'
import Types from 'prop-types'

import Leaf from './leaf'
import DATA_ATTRS from '../constants/data-attributes'

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
    annotations: ImmutableTypes.map.isRequired,
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
   * A ref for the contenteditable DOM node.
   *
   * @type {Object}
   */

  ref = React.createRef()

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
    if (n.node !== p.node) return true

    // If the node parent is a block node, and it was the last child of the
    // block, re-render to cleanup extra `\n`.
    if (n.parent.object === 'block') {
      const pLast = p.parent.nodes.last()
      const nLast = n.parent.nodes.last()
      if (p.node === pLast && n.node !== nLast) return true
    }

    // Re-render if the current annotations have changed.
    if (!n.annotations.equals(p.annotations)) return true

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

    const {
      annotations,
      block,
      decorations,
      node,
      parent,
      editor,
      style,
    } = this.props
    const { key } = node
    const leaves = node.getLeaves(annotations, decorations)
    let o = 0

    const children = leaves.map((leaf, index) => {
      const { text } = leaf
      const offset = o
      o += text.length

      return (
        <Leaf
          key={`${node.key}-${index}`}
          block={block}
          editor={editor}
          index={index}
          annotations={leaf.annotations}
          decorations={leaf.decorations}
          marks={leaf.marks}
          node={node}
          offset={offset}
          parent={parent}
          leaves={leaves}
          text={text}
        />
      )
    })

    const attrs = {
      [DATA_ATTRS.OBJECT]: node.object,
      [DATA_ATTRS.KEY]: key,
    }

    return (
      <span ref={this.ref} style={style} {...attrs}>
        {children}
      </span>
    )
  }
}

/**
 * Export.
 *
 * @type {Component}
 */

export default Text
