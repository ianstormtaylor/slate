import React, { useCallback, useRef } from 'react'
import { Element, DecoratedRange, Text as SlateText } from 'slate'
import { ReactEditor, useSlateStatic } from '..'
import { isTextDecorationsEqual } from 'slate-dom'
import {
  EDITOR_TO_KEY_TO_ELEMENT,
  ELEMENT_TO_NODE,
  NODE_TO_ELEMENT,
} from 'slate-dom'
import { RenderLeafProps, RenderPlaceholderProps } from './editable'
import Leaf from './leaf'

/**
 * Text.
 */

const Text = (props: {
  decorations: DecoratedRange[]
  isLast: boolean
  parent: Element
  renderPlaceholder: (props: RenderPlaceholderProps) => JSX.Element
  renderLeaf?: (props: RenderLeafProps) => JSX.Element
  text: SlateText
}) => {
  const { decorations, isLast, parent, renderPlaceholder, renderLeaf, text } =
    props
  const editor = useSlateStatic()
  const ref = useRef<HTMLSpanElement | null>(null)
  const leaves = SlateText.decorations(text, decorations)
  const key = ReactEditor.findKey(editor, text)
  const children = []

  for (let i = 0; i < leaves.length; i++) {
    const leaf = leaves[i]

    children.push(
      <Leaf
        isLast={isLast && i === leaves.length - 1}
        key={`${key.id}-${i}`}
        renderPlaceholder={renderPlaceholder}
        leaf={leaf}
        text={text}
        parent={parent}
        renderLeaf={renderLeaf}
      />
    )
  }

  // Update element-related weak maps with the DOM element ref.
  const callbackRef = useCallback(
    (span: HTMLSpanElement | null) => {
      const KEY_TO_ELEMENT = EDITOR_TO_KEY_TO_ELEMENT.get(editor)
      if (span) {
        KEY_TO_ELEMENT?.set(key, span)
        NODE_TO_ELEMENT.set(text, span)
        ELEMENT_TO_NODE.set(span, text)
      } else {
        KEY_TO_ELEMENT?.delete(key)
        NODE_TO_ELEMENT.delete(text)
        if (ref.current) {
          ELEMENT_TO_NODE.delete(ref.current)
        }
      }
      ref.current = span
    },
    [ref, editor, key, text]
  )
  return (
    <span data-slate-node="text" ref={callbackRef}>
      {children}
    </span>
  )
}

const MemoizedText = React.memo(Text, (prev, next) => {
  return (
    next.parent === prev.parent &&
    next.isLast === prev.isLast &&
    next.renderLeaf === prev.renderLeaf &&
    next.renderPlaceholder === prev.renderPlaceholder &&
    next.text === prev.text &&
    isTextDecorationsEqual(next.decorations, prev.decorations)
  )
})

export default MemoizedText
