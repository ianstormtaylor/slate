import React, { useEffect, useRef } from 'react'
import { Range, Element, Mark, Text as SlateText } from 'slate'

import Leaf from './leaf'
import { NODE_TO_ELEMENT, ELEMENT_TO_NODE } from '../utils/weak-maps'
import {
  CustomAnnotationProps,
  CustomDecorationProps,
  CustomMarkProps,
} from './custom'

/**
 * Text.
 */

const Text = (props: {
  annotations: Range[]
  block: Element | null
  decorations: Range[]
  node: SlateText
  parent: Element
  renderAnnotation?: (props: CustomAnnotationProps) => JSX.Element
  renderDecoration?: (props: CustomDecorationProps) => JSX.Element
  renderMark?: (props: CustomMarkProps) => JSX.Element
  style?: Record<string, any>
}) => {
  const {
    annotations,
    block,
    decorations,
    node,
    parent,
    renderAnnotation,
    renderDecoration,
    renderMark,
    ...rest
  } = props
  const ref = useRef<HTMLSpanElement>(null)
  const leaves = getLeaves(node, annotations, decorations)
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
        renderAnnotation={renderAnnotation}
        renderDecoration={renderDecoration}
        renderMark={renderMark}
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
    <span data-slate-node="text" ref={ref} {...rest}>
      {children}
    </span>
  )
}

interface SlateLeaf {
  annotations: Range[]
  decorations: Range[]
  marks: Mark[]
  text: string
}

/**
 * Get the leaves for a text node given annotations and decorations.
 */

const getLeaves = (
  node: SlateText,
  annotations: Range[],
  decorations: Range[]
): SlateLeaf[] => {
  const { text, marks } = node
  let leaves: SlateLeaf[] = [{ text, marks, annotations: [], decorations: [] }]

  const compile = (range: Range, key: 'annotations' | 'decorations') => {
    const [start, end] = Range.edges(range)
    const next = []
    let o = 0

    for (const leaf of leaves) {
      const { length } = leaf.text
      const offset = o
      o += length

      // If the range encompases the entire leaf, add the range.
      if (start.offset <= offset && end.offset >= offset + length) {
        leaf[key].push(range)
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
        ;[middle, after] = split(middle, end.offset - offset)
      }

      if (start.offset > offset) {
        ;[before, middle] = split(middle, start.offset - offset)
      }

      middle[key].push(range)

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

  for (const range of annotations) {
    compile(range, 'annotations')
  }

  for (const range of decorations) {
    compile(range, 'decorations')
  }

  return leaves
}

/**
 * Split a leaf into two at an offset.
 */

const split = (leaf: SlateLeaf, offset: number): [SlateLeaf, SlateLeaf] => {
  return [
    {
      text: leaf.text.slice(0, offset),
      marks: leaf.marks,
      annotations: [...leaf.annotations],
      decorations: [...leaf.decorations],
    },
    {
      text: leaf.text.slice(offset),
      marks: leaf.marks,
      annotations: [...leaf.annotations],
      decorations: [...leaf.decorations],
    },
  ]
}

export default Text
