
import Debug from 'debug'
import React from 'react'
import ReactDOM from 'react-dom'
import Types from 'prop-types'

import OffsetKey from '../utils/offset-key'
import findDeepestNode from '../utils/find-deepest-node'
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
    block: Types.object.isRequired,
    editor: Types.object.isRequired,
    index: Types.number.isRequired,
    marks: Types.object.isRequired,
    node: Types.object.isRequired,
    offset: Types.number.isRequired,
    parent: Types.object.isRequired,
    ranges: Types.object.isRequired,
    schema: Types.object.isRequired,
    state: Types.object.isRequired,
    text: Types.string.isRequired
  }

  /**
   * Constructor.
   *
   * @param {Object} props
   */

  constructor(props) {
    super(props)
    this.tmp = {}
    this.tmp.renders = 0
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
      props.text != this.props.text
    ) {
      return true
    }

    // If the DOM text does not equal the `text` property, re-render, this can
    // happen because React gets out of sync when previously natively rendered.
    const el = findDeepestNode(ReactDOM.findDOMNode(this))
    const text = this.renderText(props)
    if (el.textContent != text) return true

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

    // Increment the renders key, which forces a re-render whenever this
    // component is told it should update. This is required because "native"
    // renders where we don't update the leaves cause React's internal state to
    // get out of sync, causing it to not realize the DOM needs updating.
    this.tmp.renders++

    this.debug('render', { props })

    return (
      <span key={this.tmp.renders} data-offset-key={offsetKey}>
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
