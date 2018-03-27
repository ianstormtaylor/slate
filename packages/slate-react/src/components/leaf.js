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
  constructor(props) {
    super(props)
    this.state = {
      regenerateKey: 0,
    }
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
    const ref = this.leafRef
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
        this.forceRegeneration()
        return
      }
    }

    const { node, index } = this.props
    const offsetKey = OffsetKey.stringify({
      key: node.key,
      index,
    })
    const queryString = `[data-offset-key="${offsetKey}"]`
    if (!window.document.querySelector(queryString)) {
      this.forceRegeneration()
      return
    }
  }

  /**
   * Should component update?
   *
   * @param {Object} props
   * @return {Boolean}
   */

  shouldComponentUpdate(props, state) {
    // If any of the regular properties have changed, re-render.
    if (
      props.index != this.props.index ||
      props.marks != this.props.marks ||
      props.text != this.props.text ||
      props.parent != this.props.parent ||
      state !== this.state
    ) {
      return true
    }

    // Otherwise, don't update.
    return false
  }

  setRef = ref => {
    this.leafRef = ref
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
    const key = `${offsetKey}:${this.state.regenerateKey}`

    return (
      <span key={key} ref={this.setRef} data-offset-key={offsetKey}>
        {this.renderMarks()}
      </span>
    )
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

    return marks.reduce((children, mark) => {
      const props = { editor, mark, marks, node, offset, text, children }
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
    const { block, node, parent, text, index, leaves } = this.props

    // COMPAT: Render text inside void nodes with a zero-width space.
    // So the node can contain selection but the text is not visible.
    if (parent.isVoid) {
      return <span data-slate-zero-width="z">{'\u200B'}</span>
    }

    // COMPAT: If this is the last text node in an empty block, render a zero-
    // width space that will convert into a line break when copying and pasting
    // to support expected plain text.
    if (
      text === '' &&
      parent.object === 'block' &&
      parent.text === '' &&
      parent.nodes.size === 1
    ) {
      return <span data-slate-zero-width="n">{'\u200B'}</span>
    }

    // COMPAT: If the text is empty, it's because it's on the edge of an inline
    // void node, so we render a zero-width space so that the selection can be
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
