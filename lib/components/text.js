
import Leaf from './leaf'
import OffsetKey from '../utils/offset-key'
import Raw from '../serializers/raw'
import React from 'react'

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
      <span
        key={node.key}
        data-key={node.key}
        data-type='text'
      >
        {this.renderLeaves()}
      </span>
    )
  }

  renderLeaves() {
    const { node } = this.props
    const { characters } = node
    const ranges = Raw.serializeCharacters(characters)
    return ranges.length
      ? ranges.map((range) => this.renderLeaf(range))
      : this.renderSpacerLeaf()
  }

  renderLeaf(range) {
    const { node, renderMark, state } = this.props
    const { marks, offset, text } = range
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
