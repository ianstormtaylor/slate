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

  shouldComponentUpdate = nextProps => {
    const { props } = this
    const { stack } = props.editor
    const shouldUpdate = stack.find(
      'shouldNodeComponentUpdate',
      props,
      nextProps
    )
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
        logger.warn(
          "Returning false in `shouldNodeComponentUpdate` does not disable Slate's internal `shouldComponentUpdate` logic. If you want to prevent updates, use React's `shouldComponentUpdate` instead."
        )
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
   * orders the children of this node and the decoration endpoints (start, end) 
   * so that decorations can be passed only to relevant children (see use in render())
   * 
   * @param {List} childNodes
   * @param {List} decorations
   * @return {Array}
   */

  getDecoratedByIndex = (childNodes, decorations) => {
    const { node } = this.props
    const keyIndices = node.getKeysAsArray()

    let endPoints = childNodes.map((child, i) => ({
      isChild: true,
      offset: keyIndices.indexOf(child.key),
      key: child.key,
      child,
    }))

    decorations.forEach(d => {
      endPoints.push({
        isRangeStart: true,
        offset: keyIndices.indexOf(d.startKey) - 0.5,
        key: d.startKey,
        d,
      })
      endPoints.push({
        isRangeEnd: true,
        offset: keyIndices.indexOf(d.endKey) + 0.5,
        key: d.endKey,
        d,
      })
    })

    const order = (a, b) => a.offset > b.offset ? 1 : -1

    return endPoints.sort((a,b) => 
      // if comparing a rangeStart with a child,
      // move it before the child that owns its startKey
      a.isRangeStart && b.isChild && b.child.getKeysAsArray
        ? b.child.getKeysAsArray().includes(a.key) ? -1 : order(a,b)
        : b.isRangeStart && a.isChild && a.child.getKeysAsArray
          ? a.child.getKeysAsArray().includes(b.key) ? 1 : order(a,b)
          : order(a,b)
    )
  }

  /**
   * Render.
   *
   * @return {Element}
   */

  render() {
    this.debug('render', this)
    const { editor, isSelected, node, decorations, parent, readOnly } = this.props
    const { value } = editor
    const { selection } = value
    const { stack } = editor
    const indexes = node.getSelectionIndexes(selection, isSelected)
    const decs = decorations.concat(node.getDecorations(stack))

    const childNodes = node.nodes.toArray()
    let activeDecorations = new Set()
    let children = []

    this.getDecoratedByIndex(childNodes, decs).forEach(item => {
      if (item.isChild) {
        const isChildSelected = !!indexes && indexes.start <= item.i && item.i < indexes.end
        return children.push(
          this.renderNode(
            item.child, 
            isChildSelected, 
            // using decorations.clear() to obtain empty List w/out importing immutable
            decorations.clear().concat(Array.from(activeDecorations.values()))
          )
        )
      }
      // if range start, add it to tracked set
      if (item.isRangeStart) return activeDecorations.add(item.d)
      // else must be rangeEnd; stop tracking it
      activeDecorations.delete(item.d)
    })

    // Attributes that the developer must to mix into the element in their
    // custom node renderer component.
    const attributes = { 'data-key': node.key }

    // If it's a block node with inline children, add the proper `dir` attribute
    // for text direction.
    if (node.object == 'block' && node.nodes.first().object != 'block') {
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
      placeholder = React.cloneElement(placeholder, {
        key: `${node.key}-placeholder`,
      })
      children = [placeholder, ...children]
    }

    const element = stack.find('renderNode', {
      ...props,
      attributes,
      children,
    })

    return node.isVoid ? <Void {...this.props}>{element}</Void> : element
  }

  /**
   * Render a `child` node.
   *
   * @param {Node} child
   * @param {Boolean} isSelected
   * @return {Element}
   */

  renderNode = (child, isSelected, decorations) => {
    const { block, editor, node, readOnly } = this.props
    const { stack } = editor
    const Component = child.object == 'text' ? Text : Node
    
    return (
      <Component
        block={node.object == 'block' ? node : block}
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

export default Node
