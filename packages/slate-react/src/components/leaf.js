import Debug from 'debug'
import React from 'react'
import Types from 'prop-types'
import SlateTypes from 'slate-prop-types'

import OffsetKey from '../utils/offset-key'

/**
 * Debugger.
 *
 * @type {Function}
 */

const debug = Debug('slate:leaves')

/**
 * Leaf.
 *
 * @type {Component}
 */

class Leaf extends React.Component {
  /**
   * Property types.
   *
   * @type {Object}
   */

  static propTypes = {
    block: SlateTypes.block.isRequired,
    editor: Types.object.isRequired,
    index: Types.number.isRequired,
    leaves: SlateTypes.leaves.isRequired,
    marks: SlateTypes.marks.isRequired,
    node: SlateTypes.node.isRequired,
    offset: Types.number.isRequired,
    parent: SlateTypes.node.isRequired,
    text: Types.string.isRequired,
  }

  /**
   * Debug.
   *
   * @param {String} message
   * @param {Mixed} ...args
   */

  debug = (message, ...args) => {
    debug(message, `${this.props.node.key}-${this.props.index}`, ...args)
  }

  /**
   * Should component update?
   *
   * @param {Object} props
   * @return {Boolean}
   */

  shouldComponentUpdate(props) {
    // If any of the regular properties have changed, re-render.
    if (
      props.index != this.props.index ||
      props.marks != this.props.marks ||
      props.text != this.props.text ||
      props.parent != this.props.parent
    ) {
      return true
    }

    // Otherwise, don't update.
    return false
  }

  /**
   * Render the leaf.
   *
   * @return {Element}
   */

  render() {
    this.debug('render', this)

    const { node, index } = this.props
    const offsetKey = OffsetKey.stringify({
      key: node.key,
      index,
    })

    return <span data-offset-key={offsetKey}>{this.renderMarks()}</span>
  }

  /**
   * Render all of the leaf's mark components.
   *
   * @return {Element}
   */

  renderMarks() {
    const { marks, node, offset, text, editor } = this.props
    const { stack } = editor
    const leaf = this.renderText()
    const attributes = {
      'data-slate-leaf': true,
    }

    return marks.reduce((children, mark) => {
      const props = {
        editor,
        mark,
        marks,
        node,
        offset,
        text,
        children,
        attributes,
      }
      const element = stack.find('renderMark', props)
      return element || children
    }, leaf)
  }

  /**
   * Render the text content of the leaf, accounting for browsers.
   *
   * @return {Element}
   */

  renderText() {
    const { block, node, editor, parent, text, index, leaves } = this.props
    const { value } = editor
    const { schema } = value

    // COMPAT: Render text inside void nodes with a zero-width space.
    // So the node can contain selection but the text is not visible.
    if (schema.isVoid(parent)) {
      return <span data-slate-zero-width="z">{'\u200B'}</span>
    }

    // COMPAT: If this is the last text node in an empty block, render a zero-
    // width space that will convert into a line break when copying and pasting
    // to support expected plain text.
    if (
      text === '' &&
      parent.object === 'block' &&
      parent.text === '' &&
      parent.nodes.last() === node
    ) {
      return <span data-slate-zero-width="n">{'\u200B'}</span>
    }

    // COMPAT: If the text is empty, it's because it's on the edge of an inline
    // node, so we render a zero-width space so that the selection can be
    // inserted next to it still.
    if (text === '') {
      return <span data-slate-zero-width="z">{'\u200B'}</span>
    }

    // COMPAT: Browsers will collapse trailing new lines at the end of blocks,
    // so we need to add an extra trailing new lines to prevent that.
    const lastText = block.getLastText()
    const lastChar = text.charAt(text.length - 1)
    const isLastText = node === lastText
    const isLastLeaf = index === leaves.size - 1
    if (isLastText && isLastLeaf && lastChar === '\n') return `${text}\n`

    // Otherwise, just return the text.
    return text
  }
}

/**
 * Export.
 *
 * @type {Component}
 */

export default Leaf
