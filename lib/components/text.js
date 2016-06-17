
import Leaf from './leaf'
import React from 'react'
import convertCharactersToRanges from '../utils/convert-characters-to-ranges'
import createOffsetKey from '../utils/create-offset-key'

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
    const { characters } = node
    const ranges = convertCharactersToRanges(characters)
    const leaves = ranges.length
      ? ranges.map(range => this.renderLeaf(range))
      : this.renderSpacerLeaf()

    return (
      <span
        key={node.key}
        data-key={node.key}
        data-type='text'
      >
        {leaves}
      </span>
    )
  }

  renderLeaf(range) {
    const { node, renderMark, state } = this.props
    const key = createOffsetKey(node, range)
    return (
      <Leaf
        key={key}
        range={range}
        node={node}
        renderMark={renderMark}
        state={state}
      />
    )
  }

  renderSpacerLeaf() {
    return this.renderLeaf({
      offset: 0,
      text: '',
      marks: []
    })
  }

}

/**
 * Export.
 */

export default Text
