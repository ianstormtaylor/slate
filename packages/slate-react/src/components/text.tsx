import React, { useRef } from 'react'
import { Element, Path, Range, Text as SlateText } from 'slate'

import Leaf from './leaf'
import { ReactEditor, useSlateStatic } from '..'
import {
  RenderChildrenProps,
  RenderLeafProps,
  RenderPlaceholderProps,
  RenderTextProps,
} from './editable'
import { useIsomorphicLayoutEffect } from '../hooks/use-isomorphic-layout-effect'
import {
  NODE_TO_ELEMENT,
  ELEMENT_TO_NODE,
  EDITOR_TO_KEY_TO_ELEMENT,
} from '../utils/weak-maps'
import { isDecoratorRangeListEqual } from '../utils/range-list'

/**
 * Text.
 */

const Text = (props: {
  decorations: Range[]
  isLast: boolean
  parent: Element
  renderPlaceholder: (props: RenderPlaceholderProps) => JSX.Element
  renderText?: (props: RenderTextProps) => JSX.Element
  renderLeaf?: (props: RenderLeafProps) => JSX.Element
  text: SlateText
  path: Path
}) => {
  const {
    decorations,
    isLast,
    parent,
    renderPlaceholder,
    renderText = (p: RenderTextProps) => <DefaultText {...p} />,
    renderLeaf,
    text,
    path,
  } = props
  const editor = useSlateStatic()
  const ref = useRef<HTMLSpanElement>(null)
  const key = ReactEditor.findKey(editor, text)

  const renderChildren = (props?: RenderChildrenProps) => {
    const ds =
      props && props.decorations
        ? [...decorations, ...props.decorations]
        : decorations
    const leaves = SlateText.decorations(text, ds)
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

    return children
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

  const attributes: {
    'data-slate-node': 'text'
    ref: any
  } = {
    'data-slate-node': 'text',
    ref,
  }

  return renderText({ attributes, text, path, renderChildren })
}

const DefaultText = (props: RenderTextProps) => {
  const { attributes, renderChildren } = props
  return <span {...attributes}>{renderChildren()}</span>
}

const MemoizedText = React.memo(Text, (prev, next) => {
  return (
    next.parent === prev.parent &&
    next.isLast === prev.isLast &&
    next.renderLeaf === prev.renderLeaf &&
    next.text === prev.text &&
    isDecoratorRangeListEqual(next.decorations, prev.decorations)
  )
})

export default MemoizedText
