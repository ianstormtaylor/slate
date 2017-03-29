
import Debug from 'debug'
import OffsetKey from '../utils/offset-key'
import React from 'react'
import { IS_FIREFOX } from '../constants/environment'

/**
 * Debugger.
 *
 * @type {Function}
 */

const debug = Debug('slate:leafcontent')

/**
 * Leaf.
 *
 * @type {Component}
 */

class LeafContent extends React.Component {

  /**
   * Property types.
   *
   * @type {Object}
   */

  static propTypes = {
    editor: React.PropTypes.object.isRequired,
    index: React.PropTypes.number.isRequired,
    isInsideEmptyBlock: React.PropTypes.bool.isRequired,
    isInsideVoid: React.PropTypes.bool.isRequired,
    marks: React.PropTypes.object.isRequired,
    node: React.PropTypes.object.isRequired,
    offset: React.PropTypes.number.isRequired,
    parent: React.PropTypes.object.isRequired,
    ranges: React.PropTypes.object.isRequired,
    schema: React.PropTypes.object.isRequired,
    state: React.PropTypes.object.isRequired,
    text: React.PropTypes.string.isRequired
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
    if (props.isInsideVoid && this.props.isInsideVoid) return false

    if (this.props.isInsideEmptyBlock) return !props.isInsideEmptyBlock

    if (props.isInsideEmptyBlock) return true

    if (
      props.text === this.deepestNode.textContent &&
      props.index === this.props.index &&
      props.marks === this.props.marks &&
      props.schema === this.props.schema
    ) {
      return false
    }

    return true
  }

  /**
   * When the DOM updates, update the deepest node.
   * It's used to set native selection.
   *
   */

  componentDidMount() {
    this.deepestNode = findDeepestNode(this.element)
  }

  componentDidUpdate() {
    this.deepestNode = findDeepestNode(this.element)
  }

  /**
   * The React ref method to set the root content element locally.
   *
   * @param {Element} element
   */

  ref = (element) => {
    this.element = element
  }

  /**
   * Render the leaf content.
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
      <span
        key={this.tmp.renders}
        data-offset-key={offsetKey}
        ref={this.ref}
      >
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
    const { isInsideVoid, isInsideEmptyBlock, node, state, text, index, ranges } = props

    // COMPAT: If the text is empty and it's the only child, we need to render a
    // <br/> to get the block to have the proper height.
    if (isInsideEmptyBlock) return <br />

    // COMPAT: If the text is on the edge of an inline void node, we render a
    // zero-width space so that the selection can be inserted next to it still.
    if (isInsideVoid) {
      // COMPAT: In Chrome, zero-width space produces graphics glitches, so use
      // hair space in place of it. (2017/02/12)
      const space = IS_FIREFOX ? '\u200B' : '\u200A'
      return <span data-slate-zero-width>{space}</span>
    }

    // COMPAT: Browsers will collapse trailing new lines at the end of blocks,
    // so we need to add an extra trailing new lines to prevent that.
    const block = state.document.getClosestBlock(node.key)
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
 * Find the deepest descendant of a DOM `element`.
 *
 * @param {Element} node
 * @return {Element}
 */

function findDeepestNode(element) {
  return element.firstChild
    ? findDeepestNode(element.firstChild)
    : element
}

/**
 * Export.
 *
 * @type {Component}
 */

export default LeafContent
