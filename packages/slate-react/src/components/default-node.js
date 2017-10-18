
import React from 'react'
import SlateTypes from 'slate-prop-types'
import Types from 'prop-types'

/**
 * Default node.
 *
 * @type {Component}
 */

class DefaultNode extends React.Component {

  /**
   * Prop types.
   *
   * @type {Object}
   */

  static propTypes = {
    attributes: Types.object.isRequired,
    editor: Types.object.isRequired,
    isSelected: Types.bool.isRequired,
    node: SlateTypes.node.isRequired,
    parent: SlateTypes.node.isRequired,
    readOnly: Types.bool.isRequired,
    state: SlateTypes.state.isRequired,
  }

  /**
   * Render.
   *
   * @return {Element}
   */

  render() {
    const { attributes, children, node } = this.props
    const Tag = node.kind == 'block' ? 'div' : 'span'
    const style = { position: 'relative' }
    return <Tag {...attributes} style={style}>{children}</Tag>
  }

}

/**
 * Export.
 *
 * @type {Component}
 */

export default DefaultNode
