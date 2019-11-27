import React, { useLayoutEffect, useRef } from 'react'
import { Range, Element, Text as SlateText } from 'slate'

import Leaf from './leaf'
import { Leaf as SlateLeaf } from '../utils/leaf'
import { ReactEditor, useEditor } from '..'
import {
  KEY_TO_ELEMENT,
  NODE_TO_ELEMENT,
  ELEMENT_TO_NODE,
} from '../utils/weak-maps'
import { CustomDecorationProps, CustomMarkProps } from './custom'

/**
 * Text.
 */

const Text = (props: {
  decorations: Range[]
  isLast: boolean
  parent: Element
  renderDecoration?: (props: CustomDecorationProps) => JSX.Element
  renderMark?: (props: CustomMarkProps) => JSX.Element
  text: SlateText
}) => {
  const {
    decorations,
    isLast,
    parent,
    renderDecoration,
    renderMark,
    text,
  } = props
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
        renderDecoration={renderDecoration}
        renderMark={renderMark}
      />
    )
  }

  // Update element-related weak maps with the DOM element ref.
  useLayoutEffect(() => {
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

const getLeaves = (node: SlateText, decorations: Range[]): SlateLeaf[] => {
  const { text, marks } = node
  let leaves: SlateLeaf[] = [{ text, marks, decorations: [] }]

  const compile = (range: Range, key?: string) => {
    const [start, end] = Range.edges(range)
    const next = []
    let o = 0

    for (const leaf of leaves) {
      const { length } = leaf.text
      const offset = o
      o += length

      // If the range encompases the entire leaf, add the range.
      if (start.offset <= offset && end.offset >= offset + length) {
        leaf.decorations.push(range)
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
        ;[middle, after] = SlateLeaf.split(middle, end.offset - offset)
      }

      if (start.offset > offset) {
        ;[before, middle] = SlateLeaf.split(middle, start.offset - offset)
      }

      middle.decorations.push(range)

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

  for (const range of decorations) {
    compile(range)
  }

  return leaves
}

const MemoizedText = React.memo(Text, (prev, next) => {
  if (
    next.parent === prev.parent &&
    next.isLast === prev.isLast &&
    next.renderDecoration === prev.renderDecoration &&
    next.renderMark === prev.renderMark &&
    next.text === prev.text
  ) {
    return SlateLeaf.equals(
      { ...next.text, decorations: next.decorations },
      { ...prev.text, decorations: prev.decorations }
    )
  }

  return false
})

export default MemoizedText
