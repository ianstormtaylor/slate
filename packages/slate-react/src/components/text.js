import Debug from 'debug'
import ImmutableTypes from 'react-immutable-proptypes'
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

  constructor(props) {
    super(props)
    this.state = {
      regenerateKey: 0,
    }
  }

  /*
   * Remount the node by regenerate the key
   */

  forceRegeneration = () => {
    this.setState(state => ({
      regenerateKey: state.regenerateKey + 1,
    }))
  }

  /*
   * Regenerate Key to unmount and remount
   * Because spell check puts an uncontrolled dom, we detect spell check condition by
   * 1. chiildNodes are removed
   * 2. has a textNode as a child
   * 3. itself is removed
   */

  componentWillReceiveProps(props) {
    const ref = this.textRef
    // check if ref or its all contents are deleted by spell check
    if (!ref) {
      return
    }

    const { childNodes } = ref
    if (!childNodes || childNodes.length === 0) {
      this.forceRegeneration()
      return
    }
    for (let index = 0; index < childNodes.length; index++) {
      const child = childNodes[index]
      if (child.nodeName === '#text') {
        ref.removeChild(child)
        this.forceRegeneration()
        return
      }
    }
    const { node } = this.props
    const { key } = node
    const queryString = `[data-key="${key}"]`
    if (!window.document.querySelector(queryString)) {
      this.forceRegeneration()
      return
    }
  }

  /**
   * Should the node update?
   *
   * @param {Object} nextProps
   * @param {Object} value
   * @return {Boolean}
   */

  shouldComponentUpdate = (nextProps, nextState) => {
    const { props } = this
    const n = nextProps
    const p = props
    if (nextState !== this.state) return true

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

  setRef = ref => {
    this.textRef = ref
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
      const { startKey, endKey } = d
      if (startKey == key || endKey == key) return true
      const startsBefore = document.areDescendantsSorted(startKey, key)
      const endsAfter = document.areDescendantsSorted(key, endKey)
      return startsBefore && endsAfter
    })

    const leaves = node.getLeaves(decs)
    let offset = 0

    const children = leaves.map((leaf, i) => {
      const child = this.renderLeaf(leaves, leaf, i, offset)
      offset += leaf.text.length
      return child
    })
    const reactKey = `text:${key}:${this.state.regenerateKey}`

    return (
      <span ref={this.setRef} key={reactKey} data-key={key} style={style}>
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
