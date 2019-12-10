import React, { useRef } from 'react'
import { Range, Element, Text as SlateText } from 'slate'

import Leaf from './leaf'
import { ReactEditor, useEditor } from '..'
import { RenderLeafProps } from './editable'
import { useIsomorphicLayoutEffect } from '../hooks/use-isomorphic-layout-effect'
import {
  KEY_TO_ELEMENT,
  NODE_TO_ELEMENT,
  ELEMENT_TO_NODE,
} from '../utils/weak-maps'

/**
 * Text.
 */

const Text = (props: {
  decorations: Range[]
  isLast: boolean
  parent: Element
  renderLeaf?: (props: RenderLeafProps) => JSX.Element
  text: SlateText
}) => {
  const { decorations, isLast, parent, renderLeaf, text } = props
  const editor = useEditor()
  const ref = useRef<HTMLSpanElement>(null)
  const leaves = getLeaves(text, decorations)
  const key = ReactEditor.findKey(editor, text)
  const children = []

  for (let i = 0; i < leaves.length; i++) {
    const leaf = leaves[i]

    children.push(
      <Leaf
        isLast={isLast && i === leaves.length - 1}
        key={`${key.id}-${i}`}
        leaf={leaf}
        text={text}
        parent={parent}
        renderLeaf={renderLeaf}
      />
    )
  }

  // Update element-related weak maps with the DOM element ref.
  useIsomorphicLayoutEffect(() => {
    if (ref.current) {
      KEY_TO_ELEMENT.set(key, ref.current)
      NODE_TO_ELEMENT.set(text, ref.current)
      ELEMENT_TO_NODE.set(ref.current, text)
    } else {
      KEY_TO_ELEMENT.delete(key)
      NODE_TO_ELEMENT.delete(text)
    }
  })

  return (
    <span data-slate-node="text" ref={ref}>
      {children}
    </span>
  )
}

/**
 * Get the leaves for a text node given decorations.
 */

const getLeaves = (node: SlateText, decorations: Range[]): SlateText[] => {
  let leaves: SlateText[] = [{ ...node }]

  for (const dec of decorations) {
    const { anchor, focus, ...rest } = dec
    const [start, end] = Range.edges(dec)
    const next = []
    let o = 0

    for (const leaf of leaves) {
      const { length } = leaf.text
      const offset = o
      o += length

      // If the range encompases the entire leaf, add the range.
      if (start.offset <= offset && end.offset >= offset + length) {
        Object.assign(leaf, rest)
        next.push(leaf)
        continue
      }

      // If the range starts after the leaf, or ends before it, continue.
      if (
        start.offset > offset + length ||
        end.offset < offset ||
        (end.offset === offset && offset !== 0)
      ) {
        next.push(leaf)
        continue
      }

      // Otherwise we need to split the leaf, at the start, end, or both,
      // and add the range to the middle intersecting section. Do the end
      // split first since we don't need to update the offset that way.
      let middle = leaf
      let before
      let after

      if (end.offset < offset + length) {
        const off = end.offset - offset
        after = { ...middle, text: middle.text.slice(off) }
        middle = { ...middle, text: middle.text.slice(0, off) }
      }

      if (start.offset > offset) {
        const off = start.offset - offset
        before = { ...middle, text: middle.text.slice(0, off) }
        middle = { ...middle, text: middle.text.slice(off) }
      }

      Object.assign(middle, rest)

      if (before) {
        next.push(before)
      }

      next.push(middle)

      if (after) {
        next.push(after)
      }
    }

    leaves = next
  }

  return leaves
}

const MemoizedText = React.memo(Text, (prev, next) => {
  return (
    next.parent === prev.parent &&
    next.isLast === prev.isLast &&
    next.renderLeaf === prev.renderLeaf &&
    next.text === prev.text
  )
})

export default MemoizedText
