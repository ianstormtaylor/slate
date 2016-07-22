
import Leaf from './leaf'
import React from 'react'
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
      props.state.selection.hasEdgeIn(props.node) ||
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
    const { node } = this.props
    return (
      <span data-key={node.key}>
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
    const ranges = node.getDecoratedRanges()

    return ranges.map((range, i, original) => {
      const previous = original.slice(0, i)
      const offset = previous.size
        ? previous.map(r => r.text).join('').length
        : 0
      return this.renderLeaf(range, i, offset)
    })
  }

  /**
   * Render a single leaf node given a `range` and `offset`.
   *
   * @param {Object} range
   * @param {Number} index
   * @param {Number} offset
   * @return {Element} leaf
   */

  renderLeaf(range, index, offset) {
    const { node, renderMark, state } = this.props
    const text = range.text
    const marks = range.marks

    return (
      <Leaf
        key={`${node.key}-${index}`}
        index={index}
        state={state}
        node={node}
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
