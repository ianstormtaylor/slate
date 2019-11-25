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
import {
  CustomAnnotationProps,
  CustomDecorationProps,
  CustomMarkProps,
} from './custom'

/**
 * Text.
 */

const Text = (props: {
  annotations: Record<string, Range>
  decorations: Range[]
  isLast: boolean
  parent: Element
  renderAnnotation?: (props: CustomAnnotationProps) => JSX.Element
  renderDecoration?: (props: CustomDecorationProps) => JSX.Element
  renderMark?: (props: CustomMarkProps) => JSX.Element
  text: SlateText
}) => {
  const {
    annotations,
    decorations,
    isLast,
    parent,
    renderAnnotation,
    renderDecoration,
    renderMark,
    text,
  } = props
  const editor = useEditor()
  const ref = useRef<HTMLSpanElement>(null)
  const leaves = getLeaves(text, annotations, decorations)
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
        renderAnnotation={renderAnnotation}
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
 * Get the leaves for a text node given annotations and decorations.
 */

const getLeaves = (
  node: SlateText,
  annotations: Record<string, Range>,
  decorations: Range[]
): SlateLeaf[] => {
  const { text, marks } = node
  let leaves: SlateLeaf[] = [{ text, marks, annotations: {}, decorations: [] }]

  const compile = (
    collection: 'annotations' | 'decorations',
    range: Range,
    key?: string
  ) => {
    const [start, end] = Range.edges(range)
    const next = []
    let o = 0

    for (const leaf of leaves) {
      const { length } = leaf.text
      const offset = o
      o += length

      // If the range encompases the entire leaf, add the range.
      if (start.offset <= offset && end.offset >= offset + length) {
        if (collection === 'annotations') {
          leaf.annotations[key!] = range
        } else {
          leaf.decorations.push(range)
        }

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

      if (collection === 'annotations') {
        middle.annotations[key!] = range
      } else {
        middle.decorations.push(range)
      }

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

  for (const key in annotations) {
    const range = annotations[key]
    compile('annotations', range, key)
  }

  for (const range of decorations) {
    compile('decorations', range)
  }

  return leaves
}

const MemoizedText = React.memo(Text, (prev, next) => {
  if (
    next.parent === prev.parent &&
    next.isLast === prev.isLast &&
    next.renderAnnotation === prev.renderAnnotation &&
    next.renderDecoration === prev.renderDecoration &&
    next.renderMark === prev.renderMark &&
    next.text === prev.text
  ) {
    return SlateLeaf.equals(
      {
        ...next.text,
        annotations: next.annotations,
        decorations: next.decorations,
      },
      {
        ...prev.text,
        annotations: prev.annotations,
        decorations: prev.decorations,
      }
    )
  }

  return false
})

export default MemoizedText
