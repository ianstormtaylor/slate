
import Leaf from './leaf'
import OffsetKey from '../utils/offset-key'
import React from 'react'
import groupByMarks from '../utils/group-by-marks'
import { List } from 'immutable'

/**
 * Text.
 */

class Text extends React.Component {

  /**
   * Properties.
   */

  static propTypes = {
    editor: React.PropTypes.object.isRequired,
    node: React.PropTypes.object.isRequired,
    renderMark: React.PropTypes.func.isRequired,
    state: React.PropTypes.object.isRequired
  };

  /**
   * Should the component update?
   *
   * @param {Object} props
   * @param {Object} state
   * @return {Boolean} shouldUpdate
   */

  shouldComponentUpdate(props, state) {
    return (
      props.node.decorations != this.props.node.decorations ||
      props.node.characters != this.props.node.characters
    )
  }

  /**
   * Render.
   *
   * @return {Element} element
   */

  render() {
    return (
      <span>
        {this.renderLeaves()}
      </span>
    )
  }

  /**
   * Render the leaf nodes.
   *
   * @return {Array} leaves
   */

  renderLeaves() {
    const { node } = this.props
    const { characters, decorations } = node
    const ranges = groupByMarks(decorations || characters)

    return ranges.map((range, i, ranges) => {
      const previous = ranges.slice(0, i)
      const offset = previous.size
        ? previous.map(range => range.text).join('').length
        : 0
      return this.renderLeaf(range, offset)
    })
  }

  /**
   * Render a single leaf node given a `range` and `offset`.
   *
   * @param {Object} range
   * @param {Number} offset
   * @return {Element} leaf
   */

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
        state={state}
        node={node}
        start={start}
        end={end}
        text={text}
        marks={marks}
        renderMark={renderMark}
      />
    )
  }

}

/**
 * Export.
 */

export default Text
