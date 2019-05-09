import ImmutableTypes from 'react-immutable-proptypes'
import React from 'react'
import SlateTypes from 'slate-prop-types'
import Types from 'prop-types'

import Leaf from './leaf'
import DATA_ATTRS from '../constants/data-attributes'

/**
 * Text node.
 *
 * @type {Component}
 */

const Text = React.forwardRef((props, ref) => {
  const { annotations, block, decorations, node, parent, editor, style } = props
  const { key } = node
  const leaves = node.getLeaves(annotations, decorations)
  let at = 0

  return (
    <span
      ref={ref}
      style={style}
      {...{
        [DATA_ATTRS.OBJECT]: node.object,
        [DATA_ATTRS.KEY]: key,
      }}
    >
      {leaves.map((leaf, index) => {
        const { text } = leaf
        const offset = at
        at += text.length

        return (
          <Leaf
            key={`${node.key}-${index}`}
            block={block}
            editor={editor}
            index={index}
            annotations={leaf.annotations}
            decorations={leaf.decorations}
            marks={leaf.marks}
            node={node}
            offset={offset}
            parent={parent}
            leaves={leaves}
            text={text}
          />
        )
      })}
    </span>
  )
})

/**
 * Prop types.
 *
 * @type {Object}
 */

Text.propTypes = {
  annotations: ImmutableTypes.map.isRequired,
  block: SlateTypes.block,
  decorations: ImmutableTypes.list.isRequired,
  editor: Types.object.isRequired,
  node: SlateTypes.node.isRequired,
  parent: SlateTypes.node.isRequired,
  style: Types.object,
}

/**
 * A memoized version of `Text` that updates less frequently.
 *
 * @type {Component}
 */

const MemoizedText = React.memo(Text, (prev, next) => {
  return (
    // PERF: There are cases where it will have
    // changed, but it's properties will be exactly the same (eg. copy-paste)
    // which this won't catch. But that's rare and not a drag on performance, so
    // for simplicity we just let them through.
    next.node === prev.node &&
    // If the node parent is a block node, and it was the last child of the
    // block, re-render to cleanup extra `\n`.
    (next.parent.object === 'block' &&
      prev.parent.nodes.last() === prev.node &&
      next.parent.nodes.last() !== next.node) &&
    // The formatting hasn't changed.
    next.annotations.equals(prev.annotations) &&
    next.decorations.equals(prev.decorations)
  )
})

/**
 * Export.
 *
 * @type {Component}
 */

export default MemoizedText
