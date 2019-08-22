import Debug from 'debug'
import ImmutableTypes from 'react-immutable-proptypes'
import React from 'react'
import SlateTypes from 'slate-prop-types'
import warning from 'tiny-warning'
import Types from 'prop-types'
import { PathUtils } from 'slate'

import Void from './void'
import Text from './text'
import DATA_ATTRS from '../constants/data-attributes'

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
    annotations: ImmutableTypes.map.isRequired,
    block: SlateTypes.block,
    decorations: ImmutableTypes.list.isRequired,
    editor: Types.object.isRequired,
    node: SlateTypes.node.isRequired,
    parent: SlateTypes.node,
    readOnly: Types.bool.isRequired,
    selection: SlateTypes.selection,
  }

  /**
   * Temporary values.
   *
   * @type {Object}
   */

  tmp = {
    nodeRefs: {},
  }

  /**
   * A ref for the contenteditable DOM node.
   *
   * @type {Object}
   */

  ref = React.createRef()

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

  shouldComponentUpdate(nextProps) {
    const { props } = this
    const { editor } = props
    const shouldUpdate = editor.run(
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
      warning(
        false,
        'As of slate-react@0.22 the `shouldNodeComponentUpdate` middleware is deprecated. You can pass specific values down the tree using React\'s built-in "context" construct instead.'
      )

      if (shouldUpdate) {
        return true
      }

      warning(
        shouldUpdate !== false,
        "Returning false in `shouldNodeComponentUpdate` does not disable Slate's internal `shouldComponentUpdate` logic. If you want to prevent updates, use React's `shouldComponentUpdate` instead."
      )
    }

    // If the `readOnly` status has changed, re-render in case there is any
    // user-land logic that depends on it, like nested editable contents.
    if (n.readOnly !== p.readOnly) {
      return true
    }

    // If the node has changed, update. PERF: There are cases where it will have
    // changed, but it's properties will be exactly the same (eg. copy-paste)
    // which this won't catch. But that's rare and not a drag on performance, so
    // for simplicity we just let them through.
    if (n.node !== p.node) {
      return true
    }

    // If the selection value of the node or of some of its children has changed,
    // re-render in case there is any user-land logic depends on it to render.
    // if the node is selected update it, even if it was already selected: the
    // selection value of some of its children could have been changed and they
    // need to be rendered again.
    if (
      (!n.selection && p.selection) ||
      (n.selection && !p.selection) ||
      (n.selection && p.selection && !n.selection.equals(p.selection))
    ) {
      return true
    }

    // If the annotations have changed, update.
    if (!n.annotations.equals(p.annotations)) {
      return true
    }

    // If the decorations have changed, update.
    if (!n.decorations.equals(p.decorations)) {
      return true
    }

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
    const {
      annotations,
      block,
      decorations,
      editor,
      node,
      parent,
      readOnly,
      selection,
    } = this.props

    const newDecorations = node.getDecorations(editor)
    const children = node.nodes.toArray().map((child, i) => {
      const Component = child.object === 'text' ? Text : Node
      const sel = selection && getRelativeRange(node, i, selection)

      const decs = newDecorations
        .concat(decorations)
        .map(d => getRelativeRange(node, i, d))
        .filter(d => d)

      const anns = annotations
        .map(a => getRelativeRange(node, i, a))
        .filter(a => a)

      return (
        <Component
          block={node.object === 'block' ? node : block}
          editor={editor}
          annotations={anns}
          decorations={decs}
          selection={sel}
          key={child.key}
          node={child}
          parent={node}
          readOnly={readOnly}
          // COMPAT: We use this map of refs to lookup a DOM node down the
          // tree of components by path.
          ref={ref => {
            if (ref) {
              this.tmp.nodeRefs[i] = ref
            } else {
              delete this.tmp.nodeRefs[i]
            }
          }}
        />
      )
    })

    // Attributes that the developer must mix into the element in their
    // custom node renderer component.
    const attributes = {
      [DATA_ATTRS.OBJECT]: node.object,
      [DATA_ATTRS.KEY]: node.key,
      ref: this.ref,
    }

    // If it's a block node with inline children, add the proper `dir` attribute
    // for text direction.
    if (node.isLeafBlock()) {
      const direction = node.getTextDirection()
      if (direction === 'rtl') attributes.dir = 'rtl'
    }

    let render

    if (node.object === 'block') {
      render = 'renderBlock'
    } else if (node.object === 'document') {
      render = 'renderDocument'
    } else if (node.object === 'inline') {
      render = 'renderInline'
    }

    const element = editor.run(render, {
      attributes,
      children,
      editor,
      isFocused: !!selection && selection.isFocused,
      isSelected: !!selection,
      node,
      parent,
      readOnly,
    })

    return editor.isVoid(node) ? (
      <Void
        {...this.props}
        textRef={ref => {
          if (ref) {
            this.tmp.nodeRefs[0] = ref
          } else {
            delete this.tmp.nodeRefs[0]
          }
        }}
      >
        {element}
      </Void>
    ) : (
      element
    )
  }
}

/**
 * Return a `range` relative to a child at `index`.
 *
 * @param {Range} range
 * @param {Number} index
 * @return {Range}
 */

function getRelativeRange(node, index, range) {
  if (range.isUnset) {
    return null
  }

  const child = node.nodes.get(index)
  let { start, end } = range
  const { path: startPath } = start
  const { path: endPath } = end
  const startIndex = startPath.first()
  const endIndex = endPath.first()

  if (startIndex === index) {
    start = start.setPath(startPath.rest())
  } else if (startIndex < index && index <= endIndex) {
    if (child.object === 'text') {
      start = start.moveTo(PathUtils.create([index]), 0).setKey(child.key)
    } else {
      const [first] = child.texts()
      const [firstNode, firstPath] = first
      start = start.moveTo(firstPath, 0).setKey(firstNode.key)
    }
  } else {
    start = null
  }

  if (endIndex === index) {
    end = end.setPath(endPath.rest())
  } else if (startIndex <= index && index < endIndex) {
    if (child.object === 'text') {
      const length = child.text.length
      end = end.moveTo(PathUtils.create([index]), length).setKey(child.key)
    } else {
      const [last] = child.texts({ direction: 'backward' })
      const [lastNode, lastPath] = last
      end = end.moveTo(lastPath, lastNode.text.length).setKey(lastNode.key)
    }
  } else {
    end = null
  }

  if (!start || !end) {
    return null
  }

  range = range.setAnchor(start)
  range = range.setFocus(end)
  return range
}

/**
 * Export.
 *
 * @type {Component}
 */

export default Node
