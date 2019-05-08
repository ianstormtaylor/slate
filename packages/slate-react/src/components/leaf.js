import Debug from 'debug'
import React from 'react'
import Types from 'prop-types'
import SlateTypes from 'slate-prop-types'

import OffsetKey from '../utils/offset-key'
import DATA_ATTRS from '../constants/data-attributes'

/**
 * Debugger.
 *
 * @type {Function}
 */

const debug = Debug('slate:leaves')

/**
 * Components.
 *
 * @type {Component}
 */

const ZeroWidth = ({ length = 0, isLineBreak = false }) => {
  const attrs = {
    [DATA_ATTRS.ZERO_WIDTH]: isLineBreak ? 'n' : 'z',
    [DATA_ATTRS.LENGTH]: length,
  }

  return (
    <span {...attrs}>
      {'\uFEFF'}
      {isLineBreak ? <br /> : null}
    </span>
  )
}

const String = ({ text = '', isTrailing = false }) => {
  const attrs = {
    [DATA_ATTRS.STRING]: true,
  }

  return (
    <span {...attrs}>
      {text}
      {isTrailing ? '\n' : null}
    </span>
  )
}

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
    leaves: Types.object.isRequired,
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
      props.index !== this.props.index ||
      props.marks !== this.props.marks ||
      props.text !== this.props.text ||
      props.parent !== this.props.parent ||
      !props.annotations.equals(this.props.annotations) ||
      !props.decorations.equals(this.props.decorations)
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

    const {
      marks,
      annotations,
      decorations,
      node,
      index,
      offset,
      text,
      editor,
    } = this.props

    const offsetKey = OffsetKey.stringify({
      key: node.key,
      index,
    })

    let children = this.renderText()

    const props = {
      editor,
      marks,
      annotations,
      decorations,
      node,
      offset,
      text,
    }

    // COMPAT: Having the `data-` attributes on these leaf elements ensures that
    // in certain misbehaving browsers they aren't weirdly cloned/destroyed by
    // contenteditable behaviors. (2019/05/08)
    for (const mark of marks) {
      const ret = editor.run('renderMark', {
        ...props,
        mark,
        children,
        attributes: {
          [DATA_ATTRS.OBJECT]: 'mark',
        },
      })

      if (ret) {
        children = ret
      }
    }

    for (const decoration of decorations) {
      const ret = editor.run('renderDecoration', {
        ...props,
        decoration,
        children,
        attributes: {
          [DATA_ATTRS.OBJECT]: 'decoration',
        },
      })

      if (ret) {
        children = ret
      }
    }

    for (const annotation of annotations) {
      const ret = editor.run('renderAnnotation', {
        ...props,
        annotation,
        children,
        attributes: {
          [DATA_ATTRS.OBJECT]: 'annotation',
        },
      })

      if (ret) {
        children = ret
      }
    }

    const attrs = {
      [DATA_ATTRS.LEAF]: true,
      [DATA_ATTRS.OFFSET_KEY]: offsetKey,
    }

    return <span {...attrs}>{children}</span>
  }

  /**
   * Render the text content of the leaf, accounting for browsers.
   *
   * @return {Element}
   */

  renderText() {
    const { block, node, editor, parent, text, index, leaves } = this.props

    // COMPAT: Render text inside void nodes with a zero-width space.
    // So the node can contain selection but the text is not visible.
    if (editor.query('isVoid', parent)) {
      return <ZeroWidth length={parent.text.length} />
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
      return <ZeroWidth isLineBreak />
    }

    // COMPAT: If the text is empty, it's because it's on the edge of an inline
    // node, so we render a zero-width space so that the selection can be
    // inserted next to it still.
    if (text === '') {
      return <ZeroWidth />
    }

    // COMPAT: Browsers will collapse trailing new lines at the end of blocks,
    // so we need to add an extra trailing new lines to prevent that.
    const lastText = block.getLastText()
    const lastChar = text.charAt(text.length - 1)
    const isLastText = node === lastText
    const isLastLeaf = index === leaves.size - 1

    if (isLastText && isLastLeaf && lastChar === '\n') {
      return <String isTrailing text={text} />
    }

    // Otherwise, just return the content.
    return <String text={text} />
  }
}

/**
 * Export.
 *
 * @type {Component}
 */

export default Leaf
