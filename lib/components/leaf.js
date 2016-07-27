
import OffsetKey from '../utils/offset-key'
import React from 'react'
import ReactDOM from 'react-dom'

/**
 * Leaf.
 */

class Leaf extends React.Component {

  /**
   * Properties.
   */

  static propTypes = {
    index: React.PropTypes.number.isRequired,
    marks: React.PropTypes.object.isRequired,
    node: React.PropTypes.object.isRequired,
    ranges: React.PropTypes.object.isRequired,
    renderMark: React.PropTypes.func.isRequired,
    state: React.PropTypes.object.isRequired,
    text: React.PropTypes.string.isRequired
  };

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
   * Should component update?
   *
   * @param {Object} props
   * @return {Boolean} shouldUpdate
   */

  shouldComponentUpdate(props) {
    const { index, node, state } = props
    const { selection } = state

    if (
      props.index != this.props.index ||
      props.marks != this.props.marks ||
      props.renderMark != this.props.renderMark ||
      props.text != this.props.text
    ) {
      return true
    }

    const { start, end } = OffsetKey.findBounds(index, props.ranges)
    return selection.hasEdgeBetween(node, start, end)
  }

  componentDidMount() {
    this.updateSelection()
  }

  componentDidUpdate() {
    this.updateSelection()
  }

  updateSelection() {
    const { state, ranges } = this.props
    const { selection } = state

    // If the selection is blurred we have nothing to do.
    if (selection.isBlurred) return

    const { anchorOffset, focusOffset } = selection
    const { node, index } = this.props
    const { start, end } = OffsetKey.findBounds(index, ranges)

    // If neither matches, the selection doesn't start or end here, so exit.
    const hasAnchor = selection.hasAnchorBetween(node, start, end)
    const hasFocus = selection.hasFocusBetween(node, start, end)
    if (!hasAnchor && !hasFocus) return

    // We have a selection to render, so prepare a few things...
    const native = window.getSelection()
    const el = ReactDOM.findDOMNode(this).firstChild

    // If both the start and end are here, set the selection all at once.
    if (hasAnchor && hasFocus) {
      native.removeAllRanges()
      const range = window.document.createRange()
      range.setStart(el, anchorOffset - start)
      native.addRange(range)
      native.extend(el, focusOffset - start)
      return
    }

    // If the selection is forward, we can set things in sequence. In
    // the first leaf to render, reset the selection and set the new start. And
    // then in the second leaf to render, extend to the new end.
    if (selection.isForward) {
      if (hasAnchor) {
        native.removeAllRanges()
        const range = window.document.createRange()
        range.setStart(el, anchorOffset - start)
        native.addRange(range)
      } else if (hasFocus) {
        native.extend(el, focusOffset - start)
      }
    }

    // Otherwise, if the selection is backward, we need to hack the order a bit.
    // In the first leaf to render, set a phony start anchor to store the true
    // end position. And then in the second leaf to render, set the start and
    // extend the end to the stored value.
    else {
      if (hasFocus) {
        native.removeAllRanges()
        const range = window.document.createRange()
        range.setStart(el, focusOffset - start)
        native.addRange(range)
      } else if (hasAnchor) {
        const endNode = native.focusNode
        const endOffset = native.focusOffset
        native.removeAllRanges()
        const range = window.document.createRange()
        range.setStart(el, anchorOffset - start)
        native.addRange(range)
        native.extend(endNode, endOffset)
      }
    }
  }

  render() {
    const { node, index } = this.props
    const offsetKey = OffsetKey.stringify({
      key: node.key,
      index
    })

    // Increment the renders key, which forces a re-render whenever this
    // component is told it should update. This is required because "native"
    // renders where we don't update the leaves cause React's internal state to
    // get out of sync, causing it to not realize the DOM needs updating.
    this.tmp.renders++

    return (
      <span
        key={this.tmp.renders}
        data-offset-key={offsetKey}
        style={this.renderStyle()}
      >
        {this.renderText()}
      </span>
    )
  }

  renderText() {
    const { text, parent } = this.props

    // If the text is empty, we need to render a <br/> to get the block to have
    // the proper height.
    if (text == '') return <br />

    // COMPAT: Browsers will collapse trailing new lines, so we need to add an
    // extra trailing new lines to prevent that.
    if (text.charAt(text.length - 1) == '\n') return `${text}\n`

    return text
  }

  renderStyle() {
    const { marks, renderMark } = this.props
    const style = marks.reduce((memo, mark) => {
      const styles = renderMark(mark, marks)

      for (const key in styles) {
        memo[key] = styles[key]
      }

      return memo
    }, {})

    return style
  }

}

/**
 * Export.
 */

export default Leaf
