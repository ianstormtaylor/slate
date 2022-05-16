import React, { useRef, useMemo } from 'react'
import { Range, Path, Element, Text as SlateText } from 'slate'

import Leaf from './leaf'
import { ReactEditor, useSlateStatic } from '..'
import { RenderLeafProps, RenderPlaceholderProps } from './editable'
import { useDecorate } from '../hooks/use-decorate'
import { useIsomorphicLayoutEffect } from '../hooks/use-isomorphic-layout-effect'
import {
  NODE_TO_ELEMENT,
  ELEMENT_TO_NODE,
  EDITOR_TO_KEY_TO_ELEMENT,
} from '../utils/weak-maps'
import { isDecoratorRangeListEqual } from '../utils/range-list'
import { useContentKey } from '../hooks/use-content-key'
import { IS_ANDROID } from '../utils/environment'

/**
 * Text.
 */

export interface TextProps {
  decorations: Range[]
  isLast: boolean
  parent: Element
  renderPlaceholder: (props: RenderPlaceholderProps) => JSX.Element
  renderLeaf?: (props: RenderLeafProps) => JSX.Element
  text: SlateText
  path: Path
}

const Text = (props: TextProps) => {
  const {
    decorations,
    isLast,
    parent,
    renderPlaceholder,
    renderLeaf,
    text,
  } = props
  const editor = useSlateStatic()
  const ref = useRef<HTMLSpanElement>(null)
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
  useIsomorphicLayoutEffect(() => {
    const KEY_TO_ELEMENT = EDITOR_TO_KEY_TO_ELEMENT.get(editor)
    if (ref.current) {
      KEY_TO_ELEMENT?.set(key, ref.current)
      NODE_TO_ELEMENT.set(text, ref.current)
      ELEMENT_TO_NODE.set(ref.current, text)
    } else {
      KEY_TO_ELEMENT?.delete(key)
      NODE_TO_ELEMENT.delete(text)
    }
  })

  const contentKey = IS_ANDROID ? useContentKey(text) : undefined

  return (
    <span data-slate-node="text" ref={ref} key={contentKey}>
      {children}
    </span>
  )
}

const MemoizedTextWithDecorations = (props: TextProps) => {
  const decorate = useDecorate()
  const ownDecorations = useMemo(() => decorate([props.text, props.path]), [
    props.text,
    props.path,
    decorate,
  ])
  const decorations = useMemo(() => [...props.decorations, ...ownDecorations], [
    props.decorations,
    ownDecorations,
  ])
  return <MemoizedText {...props} decorations={decorations} />
}

const MemoizedText = React.memo(
  Text,
  (prev, next) =>
    next.parent === prev.parent &&
    next.isLast === prev.isLast &&
    next.renderLeaf === prev.renderLeaf &&
    next.text === prev.text &&
    isDecoratorRangeListEqual(next.decorations, prev.decorations)
)

export default MemoizedTextWithDecorations
