
import Leaf from './leaf'
import Mark from '../models/mark'
import OffsetKey from '../utils/offset-key'
import React from 'react'
import ReactDOM from 'react-dom'
import keycode from 'keycode'

/**
 * Void.
 */

class Void extends React.Component {

  static propTypes = {
    children: React.PropTypes.any.isRequired,
    editor: React.PropTypes.object.isRequired,
    node: React.PropTypes.object.isRequired,
    state: React.PropTypes.object.isRequired
  };

  onClick(e) {
    e.preventDefault()
    let { editor, node, state } = this.props
    let text = node.getTextNodes().first()

    state = state
      .transform()
      .moveToStartOf(text)
      .focus()
      .apply()

    editor.onChange(state)
  }

  render() {
    const { children, node } = this.props
    const Tag = node.kind == 'block' ? 'div' : 'span'
    const style = {
      position: 'relative'
    }

    return (
      <Tag style={style} onClick={e => this.onClick(e)}>
        {this.renderSpacer()}
        <span contenteditable={false}>{children}</span>
      </Tag>
    )
  }

  renderSpacer() {
    const style = {
      position: 'absolute',
      top: '0px', // vertically the same, to not scroll the window
      left: '-10000px'
    }

    return (
      <span style={style}>{this.renderLeaf()}</span>
    )
  }

  renderLeaf() {
    const { node, state } = this.props
    const child = node.getTextNodes().first()
    const text = ''
    const marks = Mark.createSet()
    const start = 0
    const end = 0
    const offsetKey = OffsetKey.stringify({
      key: child.key,
      start,
      end
    })

    return (
      <Leaf
        ref={el => this.leaf = el}
        key={offsetKey}
        state={state}
        node={child}
        start={start}
        end={end}
        text={text}
        marks={marks}
        renderMark={mark => {}}
      />
    )
  }

}

/**
 * Export.
 */

export default Void
