
import Leaf from './leaf'
import Mark from '../models/mark'
import OffsetKey from '../utils/offset-key'
import React from 'react'
import ReactDOM from 'react-dom'
import keycode from 'keycode'

/**
 * Void.
 *
 * @type {Component}
 */

class Void extends React.Component {

  /**
   * Property types.
   */

  static propTypes = {
    children: React.PropTypes.any.isRequired,
    className: React.PropTypes.string,
    editor: React.PropTypes.object.isRequired,
    node: React.PropTypes.object.isRequired,
    state: React.PropTypes.object.isRequired,
    style: React.PropTypes.object
  };

  /**
   * Default properties.
   */

  static defaultProps = {
    style: {}
  }

  /**
   * Should the component update?
   *
   * @param {Object} props
   * @param {Object} state
   * @return {Boolean}
   */

  shouldComponentUpdate = (props, state) => {
    return (
      props.node != this.props.node ||
      props.state.selection.hasEdgeIn(props.node)
    )
  }

  /**
   * When one of the wrapper elements it clicked, select the void node.
   *
   * @param {Event} e
   */

  onClick = (e) => {
    e.preventDefault()
    const { state, node, editor } = this.props
    const next = state
      .transform()
      .moveToRangeOf(node)
      .focus()
      .apply()

    editor.onChange(next)
  }

  /**
   * Render.
   *
   * @return {Element}
   */

  render = () => {
    const { children, node, className, style } = this.props
    const Tag = node.kind == 'block' ? 'div' : 'span'

    // Make the outer wrapper relative, so the spacer can overlay it.
    const styles = {
      ...style,
      position: 'relative'
    }

    return (
      <Tag contentEditable={false} onClick={this.onClick}>
        <Tag
          contentEditable
          suppressContentEditableWarning
          className={className}
          style={styles}
        >
          {this.renderSpacer()}
          <Tag contentEditable={false} onClick={this.onClick}>{children}</Tag>
        </Tag>
      </Tag>
    )
  }

  /**
   * Render a fake spacer leaf, which will catch the cursor when it the void
   * node is navigated to with the arrow keys. Having this spacer there means
   * the browser continues to manage the selection natively, so it keeps track
   * of the right offset when moving across the block.
   *
   * @return {Element}
   */

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

  /**
   * Render a fake leaf.
   *
   * @return {Element}
   */

  renderLeaf = () => {
    const { node, state } = this.props
    const child = node.getTexts().first()
    const ranges = child.getRanges()
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
        ranges={ranges}
        index={index}
        text={text}
        marks={marks}
      />
    )
  }

  /**
   * Render a fake leaf mark.
   *
   * @return {Object}
   */

  renderLeafMark = (mark) => {
    return {}
  }

}

/**
 * Export.
 */

export default Void
