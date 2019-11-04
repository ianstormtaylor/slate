import React, { useEffect, useRef } from 'react'
import { Range, Element, Text as SlateText } from 'slate'

import Leaf from './leaf'
import { NODE_TO_ELEMENT, ELEMENT_TO_NODE } from '../utils/weak-maps'

/**
 * Text.
 */

const Text = (props: {
  annotations: Range[]
  block: Element | null
  decorations: Range[]
  node: SlateText
  parent: Element
  style?: Record<string, any>
}) => {
  const { annotations, block, decorations, node, parent, style } = props
  const ref = useRef<HTMLSpanElement>(null)
  const leaves = node.getLeaves(annotations, decorations)
  const children = []

  for (let i = 0; i < leaves.length; i++) {
    const leaf = leaves[i]
    const { text } = leaf

    children.push(
      <Leaf
        annotations={leaf.annotations}
        block={block}
        decorations={leaf.decorations}
        index={i}
        leaves={leaves}
        marks={leaf.marks}
        node={node}
        parent={parent}
        text={text}
      />
    )
  }

  // Update element-related weak maps with the DOM element ref.
  useEffect(() => {
    if (ref.current) {
      NODE_TO_ELEMENT.set(node, ref.current)
      ELEMENT_TO_NODE.set(ref.current, node)
    } else {
      NODE_TO_ELEMENT.delete(node)
    }
  })

  return (
    <span data-slate-node="text" style={style} ref={ref}>
      {children}
    </span>
  )
}

export default Text
