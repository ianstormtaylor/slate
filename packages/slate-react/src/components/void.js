
import Debug from 'debug'
import React from 'react'
import SlateTypes from 'slate-prop-types'
import Types from 'prop-types'

import Text from './text'

/**
 * Debug.
 *
 * @type {Function}
 */

const debug = Debug('slate:void')

/**
 * Void.
 *
 * @type {Component}
 */

class Void extends React.Component {

  /**
   * Property types.
   *
   * @type {Object}
   */

  static propTypes = {
    block: SlateTypes.block,
    children: Types.any.isRequired,
    editor: Types.object.isRequired,
    node: SlateTypes.node.isRequired,
    parent: SlateTypes.node.isRequired,
    readOnly: Types.bool.isRequired,
  }

  /**
   * Debug.
   *
   * @param {String} message
   * @param {Mixed} ...args
   */

  debug = (message, ...args) => {
    const { node } = this.props
    const { key, type } = node
    const id = `${key} (${type})`
    debug(message, `${id}`, ...args)
  }

  /**
   * Render.
   *
   * @return {Element}
   */

  render() {
    const { props } = this
    const { children, node, readOnly } = props
    const Tag = node.kind == 'block' ? 'div' : 'span'
    const style = {
      height: '0',
      color: 'transparent',
      outline: 'none',
    }

    const spacer = (
      <Tag
        contentEditable
        data-slate-spacer
        suppressContentEditableWarning
        style={style}
      >
        {this.renderText()}
      </Tag>
    )

    const content = (
      <Tag draggable={readOnly ? null : true}>
        {children}
      </Tag>
    )

    this.debug('render', { props })

    return (
      <Tag
        data-slate-void
        data-key={node.key}
        contentEditable={readOnly ? null : false}
      >
        {readOnly ? null : spacer}
        {content}
      </Tag>
    )
  }

  /**
   * Render the void node's text node, which will catch the cursor when it the
   * void node is navigated to with the arrow keys.
   *
   * Having this text node there means the browser continues to manage the
   * selection natively, so it keeps track of the right offset when moving
   * across the block.
   *
   * @return {Element}
   */

  renderText = () => {
    const { block, decorations, isSelected, node, readOnly, editor } = this.props
    const child = node.getFirstText()
    return (
      <Text
        block={node.kind == 'block' ? node : block}
        decorations={decorations}
        editor={editor}
        isSelected={isSelected}
        key={child.key}
        node={child}
        parent={node}
        readOnly={readOnly}
      />
    )
  }

}

/**
 * Export.
 *
 * @type {Component}
 */

export default Void
