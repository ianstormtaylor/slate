
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
    className: React.PropTypes.string,
    editor: React.PropTypes.object.isRequired,
    node: React.PropTypes.object.isRequired,
    state: React.PropTypes.object.isRequired,
    style: React.PropTypes.object
  };

  static defaultProps = {
    style: {}
  }

  shouldComponentUpdate = (props) => {
    return (
      props.node != this.props.node ||
      props.state.selection.hasEdgeIn(props.node)
    )
  }

  render = () => {
    const { children, node, className, style } = this.props
    const Tag = node.kind == 'block' ? 'div' : 'span'

    // Make the outer wrapper relative, so the spacer can overlay it.
    const styles = {
      ...style,
      position: 'relative'
    }

    return (
      <Tag contentEditable={false}>
        <Tag
          contentEditable
          suppressContentEditableWarning
          className={className}
          style={styles}
        >
          {this.renderSpacer()}
          <Tag contentEditable={false}>{children}</Tag>
        </Tag>
      </Tag>
    )
  }

  renderSpacer = () => {
    const style = {
      position: 'absolute',
      top: '0px',
      left: '-9999px',
      textIndent: '-9999px'
    }

    return (
      <span style={style}>{this.renderLeaf()}</span>
    )
  }

  renderLeaf = () => {
    const { node, state } = this.props
    const child = node.getTexts().first()
    const text = ''
    const marks = Mark.createSet()
    const index = 0
    const offsetKey = OffsetKey.stringify({
      key: child.key,
      index
    })

    return (
      <Leaf
        ref={this.renderLeafRefs}
        renderMark={this.renderLeafMark}
        key={offsetKey}
        state={state}
        node={child}
        index={index}
        text={text}
        marks={marks}
      />
    )
  }

  renderLeafMark = (mark) => {
    return {}
  }

  renderLeafRefs = (el) => {
    this.leaf = el
  }

}

/**
 * Export.
 */

export default Void
