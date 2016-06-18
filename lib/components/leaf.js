
import OffsetKey from '../utils/offset-key'
import React from 'react'
import ReactDOM from 'react-dom'

/**
 * Leaf.
 */

class Leaf extends React.Component {

  static propTypes = {
    marks: React.PropTypes.array.isRequired,
    node: React.PropTypes.object.isRequired,
    start: React.PropTypes.number.isRequired,
    end: React.PropTypes.number.isRequired,
    renderMark: React.PropTypes.func.isRequired,
    state: React.PropTypes.object.isRequired,
    text: React.PropTypes.string.isRequired
  };

  componentDidMount() {
    this.updateSelection()
  }

  componentDidUpdate() {
    this.updateSelection()
  }

  updateSelection() {
    const { state } = this.props
    const { selection } = state

    // If the selection is not focused we have nothing to do.
    if (!selection.isFocused) return

    const { anchorKey, anchorOffset, focusKey, focusOffset } = selection
    const { node, start, end } = this.props
    const { key } = node

    // If neither matches, the selection doesn't start or end here, so exit.
    const hasStart = key == anchorKey && start <= anchorOffset && anchorOffset <= end
    const hasEnd = key == focusKey && start <= focusOffset && focusOffset <= end
    if (!hasStart && !hasEnd) return

    // We have a selection to render, so prepare a few things...
    const native = window.getSelection()
    const el = ReactDOM.findDOMNode(this).firstChild

    // If both the start and end are here, set the selection all at once.
    if (hasStart && hasEnd) {
      native.removeAllRanges()
      const range = document.createRange()
      range.setStart(el, anchorOffset - offset)
      native.addRange(range)
      native.extend(el, focusOffset - offset)
      return
    }

    // If the selection is forward, we can set things in sequence. In
    // the first leaf to render, reset the selection and set the new start. And
    // then in the second leaf to render, extend to the new end.
    if (selection.isForward) {
      if (hasStart) {
        native.removeAllRanges()
        const range = document.createRange()
        range.setStart(el, anchorOffset - offset)
        native.addRange(range)
      } else if (hasEnd) {
        native.extend(el, focusOffset - offset)
      }
    }

    // Otherwise, if the selection is backward, we need to hack the order a bit.
    // In the first leaf to render, set a phony start anchor to store the true
    // end position. And then in the second leaf to render, set the start and
    // extend the end to the stored value.
    else {
      if (hasEnd) {
        native.removeAllRanges()
        const range = document.createRange()
        range.setStart(el, focusOffset - offset)
        native.addRange(range)
      } else if (hasStart) {
        const endNode = native.focusNode
        const endOffset = native.focusOffset
        native.removeAllRanges()
        const range = document.createRange()
        range.setStart(el, anchorOffset - offset)
        native.addRange(range)
        native.extend(endNode, endOffset)
      }
    }
  }

  render() {
    const { node, start, end, text, marks } = this.props
    const styles = this.renderStyles()
    const offsetKey = OffsetKey.stringify({
      key: node.key,
      start,
      end
    })

    return (
      <span
        style={styles}
        data-offset-key={offsetKey}
        data-type='leaf'
      >
        {text || <br/>}
      </span>
    )
  }

  renderStyles() {
    const { marks, renderMark } = this.props
    return marks.reduce((styles, mark) => {
      return {
        ...styles,
        ...renderMark(mark),
      }
    }, {})
  }

}

/**
 * Export.
 */

export default Leaf
