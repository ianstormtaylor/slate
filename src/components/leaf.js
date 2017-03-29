
import Debug from 'debug'
import OffsetKey from '../utils/offset-key'
import React from 'react'
import LeafContent from './leafcontent'
import getWindow from 'get-window'
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
    editor: React.PropTypes.object.isRequired,
    index: React.PropTypes.number.isRequired,
    marks: React.PropTypes.object.isRequired,
    node: React.PropTypes.object.isRequired,
    offset: React.PropTypes.number.isRequired,
    parent: React.PropTypes.object.isRequired,
    ranges: React.PropTypes.object.isRequired,
    redrawSelection: React.PropTypes.bool.isRequired,
    schema: React.PropTypes.object.isRequired,
    state: React.PropTypes.object.isRequired,
    text: React.PropTypes.string.isRequired
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
   * When the DOM updates, try updating the selection.
   */

  componentDidMount() {
    this.updateSelection()
  }

  componentDidUpdate() {
    this.updateSelection()
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
   * Update the DOM selection if it's inside the leaf.
   */

  updateSelection() {
    if (!this.props.redrawSelection) return

    const { index, node, ranges, state } = this.props
    const { selection } = state
    const { start, end } = OffsetKey.findBounds(index, ranges)
    const hasAnchor = selection.hasAnchorBetween(node, start, end)
    const hasFocus = selection.hasFocusBetween(node, start, end)

    // If neither matches, the selection doesn't start or end here, so exit.
    if (!hasAnchor && !hasFocus) return

    // We have a selection to render, so prepare a few things...
    const el = this.element.deepestNode
    const window = getWindow(el)
    const native = window.getSelection()
    const anchorOffset = selection.anchorOffset - start
    const focusOffset = selection.focusOffset - start

    // COMPAT: In Firefox, it's not enough to create a range, you also need to
    // focus the contenteditable element. (2016/11/16)
    function focus() {
      if (!IS_FIREFOX) return
      if (parent) setTimeout(() => parent.focus())
    }

    // If both the start and end are here, set the selection all at once.
    if (hasAnchor && hasFocus) {
      native.removeAllRanges()
      const range = window.document.createRange()
      range.setStart(el, anchorOffset)
      native.addRange(range)
      native.extend(el, focusOffset)
      focus()
    }

    // Otherwise we need to set the selection across two different leaves.
    // If the selection is forward, we can set things in sequence. In the
    // first leaf to render, reset the selection and set the new start. And
    // then in the second leaf to render, extend to the new end.
    else if (selection.isForward) {
      if (hasAnchor) {
        native.removeAllRanges()
        const range = window.document.createRange()
        range.setStart(el, anchorOffset)
        native.addRange(range)
      } else if (hasFocus) {
        native.extend(el, focusOffset)
        focus()
      }
    }

    // Otherwise, if the selection is backward, we need to hack the order a bit.
    // In the first leaf to render, set a phony start anchor to store the true
    // end position. And then in the second leaf to render, set the start and
    // extend the end to the stored value.
    else if (hasFocus) {
      native.removeAllRanges()
      const range = window.document.createRange()
      range.setStart(el, focusOffset)
      native.addRange(range)
    }
    else if (hasAnchor) {
      const endNode = native.focusNode
      const endOffset = native.focusOffset
      native.removeAllRanges()
      const range = window.document.createRange()
      range.setStart(el, anchorOffset)
      native.addRange(range)
      native.extend(endNode, endOffset)
      focus()
    }
  }

  /**
   * Render the leaf.
   *
   * @return {Element}
   */

  render() {
    const { parent, text } = this.props
    let isInsideVoid = false
    let isInsideEmptyBlock = false

    if (text == '' && parent.kind == 'block' && parent.text == '') {
      isInsideEmptyBlock = true
    } else if (text == '') {
      isInsideVoid = true
    }

    return (
      <LeafContent
        isInsideVoid={isInsideVoid}
        isInsideEmptyBlock={isInsideEmptyBlock}
        ref={this.ref}
        {...this.props}
      />
    )
  }

}

/**
 * Export.
 *
 * @type {Component}
 */

export default Leaf
