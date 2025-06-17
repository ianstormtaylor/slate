import React, { useCallback, useRef } from 'react'
import { Element, Text as SlateText, DecoratedRange } from 'slate'
import { ReactEditor, useSlateStatic } from '..'
import { isTextDecorationsEqual } from 'slate-dom'
import {
  EDITOR_TO_KEY_TO_ELEMENT,
  ELEMENT_TO_NODE,
  NODE_TO_ELEMENT,
} from 'slate-dom'
import {
  RenderLeafProps,
  RenderPlaceholderProps,
  RenderTextProps,
} from './editable'
import Leaf from './leaf'
import { useDecorations } from '../hooks/use-decorations'

const defaultRenderText = (props: RenderTextProps) => <DefaultText {...props} />

/**
 * Text.
 */

const Text = (props: {
  decorations: DecoratedRange[]
  isLast: boolean
  parent: Element
  renderPlaceholder: (props: RenderPlaceholderProps) => JSX.Element
  renderLeaf?: (props: RenderLeafProps) => JSX.Element
  renderText?: (props: RenderTextProps) => JSX.Element
  text: SlateText
}) => {
  const {
    decorations: parentDecorations,
    isLast,
    parent,
    renderPlaceholder,
    renderLeaf,
    renderText = defaultRenderText,
    text,
  } = props

  const editor = useSlateStatic()
  const ref = useRef<HTMLSpanElement | null>(null)
  const decorations = useDecorations(text, parentDecorations)
  const decoratedLeaves = SlateText.decorations(text, decorations)
  const key = ReactEditor.findKey(editor, text)
  const children = []

  for (let i = 0; i < decoratedLeaves.length; i++) {
    const { leaf, position } = decoratedLeaves[i]

    children.push(
      <Leaf
        isLast={isLast && i === decoratedLeaves.length - 1}
        key={`${key.id}-${i}`}
        renderPlaceholder={renderPlaceholder}
        leaf={leaf}
        leafPosition={position}
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

  const attributes: {
    'data-slate-node': 'text'
    ref: any
  } = {
    'data-slate-node': 'text',
    ref: callbackRef,
  }

  return renderText({
    text,
    children,
    attributes,
  })
}

const MemoizedText = React.memo(Text, (prev, next) => {
  return (
    next.parent === prev.parent &&
    next.isLast === prev.isLast &&
    next.renderText === prev.renderText &&
    next.renderLeaf === prev.renderLeaf &&
    next.renderPlaceholder === prev.renderPlaceholder &&
    next.text === prev.text &&
    isTextDecorationsEqual(next.decorations, prev.decorations)
  )
})

export const DefaultText = (props: RenderTextProps) => {
  const { attributes, children } = props
  return <span {...attributes}>{children}</span>
}

export default MemoizedText
