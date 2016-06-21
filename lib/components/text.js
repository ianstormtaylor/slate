
import Leaf from './leaf'
import OffsetKey from '../utils/offset-key'
import React from 'react'
import groupByMarks from '../utils/group-by-marks'
import { List } from 'immutable'

/**
 * Text.
 */

class Text extends React.Component {

  static propTypes = {
    node: React.PropTypes.object.isRequired,
    renderMark: React.PropTypes.func.isRequired,
    state: React.PropTypes.object.isRequired
  };

  render() {
    const { node } = this.props
    return (
      <span>
        {this.renderLeaves()}
      </span>
    )
  }

  renderLeaves() {
    const { node } = this.props
    const { characters } = node
    const ranges = groupByMarks(characters)
    return ranges.map((range, i, ranges) => {
      const previous = ranges.slice(0, i)
      const offset = previous.size
        ? previous.map(range => range.text).join('').length
        : 0
      return this.renderLeaf(range, offset)
    })
  }

  renderLeaf(range, offset) {
    const { node, renderMark, state } = this.props
    const text = range.text
    const marks = range.marks
    const start = offset
    const end = offset + text.length
    const offsetKey = OffsetKey.stringify({
      key: node.key,
      start,
      end
    })

    return (
      <Leaf
        key={offsetKey}
        marks={marks}
        node={node}
        start={start}
        end={end}
        renderMark={renderMark}
        state={state}
        text={text}
      />
    )
  }

}

/**
 * Export.
 */

export default Text
