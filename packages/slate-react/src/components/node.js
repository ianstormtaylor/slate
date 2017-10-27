
import Debug from 'debug'
import ImmutableTypes from 'react-immutable-proptypes'
import React from 'react'
import SlateTypes from 'slate-prop-types'
import logger from 'slate-dev-logger'
import Types from 'prop-types'

import Void from './void'
import Text from './text'

/**
 * Debug.
 *
 * @type {Function}
 */

const debug = Debug('slate:node')

/**
 * Node.
 *
 * @type {Component}
 */

class Node extends React.Component {

  /**
   * Property types.
   *
   * @type {Object}
   */

  static propTypes = {
    block: SlateTypes.block,
    decorations: ImmutableTypes.list.isRequired,
    editor: Types.object.isRequired,
    isSelected: Types.bool.isRequired,
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
    debug(message, `${key} (${type})`, ...args)
  }

  /**
   * Should the node update?
   *
   * @param {Object} nextProps
   * @param {Object} value
   * @return {Boolean}
   */

  shouldComponentUpdate = (nextProps) => {
    const { props } = this
    const { stack } = props.editor
    const shouldUpdate = stack.find('shouldNodeComponentUpdate', props, nextProps)
    const n = nextProps
    const p = props

    // If the `Component` has a custom logic to determine whether the component
    // needs to be updated or not, return true if it returns true. If it returns
    // false, we need to ignore it, because it shouldn't be allowed it.
    if (shouldUpdate != null) {
      if (shouldUpdate) {
        return true
      }

      if (shouldUpdate === false) {
        logger.warn('Returning false in `shouldNodeComponentUpdate` does not disable Slate\'s internal `shouldComponentUpdate` logic. If you want to prevent updates, use React\'s `shouldComponentUpdate` instead.')
      }
    }

    // If the `readOnly` status has changed, re-render in case there is any
    // user-land logic that depends on it, like nested editable contents.
    if (n.readOnly != p.readOnly) return true

    // If the node has changed, update. PERF: There are cases where it will have
    // changed, but it's properties will be exactly the same (eg. copy-paste)
    // which this won't catch. But that's rare and not a drag on performance, so
    // for simplicity we just let them through.
    if (n.node != p.node) return true

    // If the selection value of the node or of some of its children has changed,
    // re-render in case there is any user-land logic depends on it to render.
    // if the node is selected update it, even if it was already selected: the
    // selection value of some of its children could have been changed and they
    // need to be rendered again.
    if (n.isSelected || p.isSelected) return true

    // If the decorations have changed, update.
    if (!n.decorations.equals(p.decorations)) return true

    // Otherwise, don't update.
    return false
  }

  /**
   * Render.
   *
   * @return {Element}
   */

  render() {
    this.debug('render', this)

    const { editor, isSelected, node, parent, readOnly } = this.props
    const { value } = editor
    const { selection } = value
    const { stack } = editor
    const indexes = node.getSelectionIndexes(selection, isSelected)
    let children = node.nodes.toArray().map((child, i) => {
      const isChildSelected = !!indexes && indexes.start <= i && i < indexes.end
      return this.renderNode(child, isChildSelected)
    })

    // Attributes that the developer must to mix into the element in their
    // custom node renderer component.
    const attributes = { 'data-key': node.key }

    // If it's a block node with inline children, add the proper `dir` attribute
    // for text direction.
    if (node.kind == 'block' && node.nodes.first().kind != 'block') {
      const direction = node.getTextDirection()
      if (direction == 'rtl') attributes.dir = 'rtl'
    }

    const props = {
      key: node.key,
      editor,
      isSelected,
      node,
      parent,
      readOnly,
    }

    let placeholder = stack.find('renderPlaceholder', props)

    if (placeholder) {
      placeholder = React.cloneElement(placeholder, { key: `${node.key}-placeholder` })
      children = [placeholder, ...children]
    }

    const element = stack.find('renderNode', { ...props, attributes, children })

    return node.isVoid
      ? <Void {...this.props}>{element}</Void>
      : element
  }

  /**
   * Render a `child` node.
   *
   * @param {Node} child
   * @param {Boolean} isSelected
   * @return {Element}
   */

  renderNode = (child, isSelected) => {
    const { block, decorations, editor, node, readOnly } = this.props
    const { stack } = editor
    const Component = child.kind == 'text' ? Text : Node
    const decs = decorations.concat(node.getDecorations(stack))
    return (
      <Component
        block={node.kind == 'block' ? node : block}
        decorations={decs}
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

export default Node
