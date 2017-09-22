
import Debug from 'debug'
import React from 'react'
import Types from 'prop-types'
import SlateTypes from 'slate-prop-types'

import OffsetKey from '../utils/offset-key'
import { IS_FIREFOX } from '../constants/environment'

/**
 * Debugger.
 *
 * @type {Function}
 */

const debug = Debug('slate:leaf')

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
    marks: SlateTypes.marks.isRequired,
    node: SlateTypes.node.isRequired,
    offset: Types.number.isRequired,
    parent: SlateTypes.node.isRequired,
    ranges: SlateTypes.ranges.isRequired,
    schema: SlateTypes.schema.isRequired,
    state: SlateTypes.state.isRequired,
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
      props.schema != this.props.schema ||
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
    const { props } = this
    const { node, index } = props
    const offsetKey = OffsetKey.stringify({
      key: node.key,
      index
    })

    this.debug('render', { props })

    return (
      <span data-offset-key={offsetKey}>
        {this.renderMarks(props)}
      </span>
    )
  }

  /**
   * Render the text content of the leaf, accounting for browsers.
   *
   * @param {Object} props
   * @return {Element}
   */

  renderText(props) {
    const { block, node, parent, text, index, ranges } = props

    // COMPAT: If the text is empty and it's the only child, we need to render a
    // <br/> to get the block to have the proper height.
    if (text == '' && parent.kind == 'block' && parent.text == '') return <br />

    // COMPAT: If the text is empty otherwise, it's because it's on the edge of
    // an inline void node, so we render a zero-width space so that the
    // selection can be inserted next to it still.
    if (text == '') {
      // COMPAT: In Chrome, zero-width space produces graphics glitches, so use
      // hair space in place of it. (2017/02/12)
      const space = IS_FIREFOX ? '\u200B' : '\u200A'
      return <span data-slate-zero-width>{space}</span>
    }

    // COMPAT: Browsers will collapse trailing new lines at the end of blocks,
    // so we need to add an extra trailing new lines to prevent that.
    const lastText = block.getLastText()
    const lastChar = text.charAt(text.length - 1)
    const isLastText = node == lastText
    const isLastRange = index == ranges.size - 1
    if (isLastText && isLastRange && lastChar == '\n') return `${text}\n`

    // Otherwise, just return the text.
    return text
  }

  /**
   * Render all of the leaf's mark components.
   *
   * @param {Object} props
   * @return {Element}
   */

  renderMarks(props) {
    const { marks, schema, node, offset, text, state, editor } = props
    const children = this.renderText(props)

    return marks.reduce((memo, mark) => {
      const Component = mark.getComponent(schema)
      if (!Component) return memo
      return (
        <Component
          editor={editor}
          mark={mark}
          marks={marks}
          node={node}
          offset={offset}
          schema={schema}
          state={state}
          text={text}
        >
          {memo}
        </Component>
      )
    }, children)
  }

}

/**
 * Export.
 *
 * @type {Component}
 */

export default Leaf
