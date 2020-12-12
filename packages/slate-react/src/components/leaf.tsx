import React, { useRef, useEffect } from 'react'
import { Element, Text } from 'slate'
import String from './string'
import { PLACEHOLDER_SYMBOL } from '../utils/weak-maps'
import { RenderLeafProps } from './editable'

/**
 * Individual leaves in a text node with unique formatting.
 */

const Leaf = (props: {
  isLast: boolean
  leaf: Text
  parent: Element
  renderLeaf?: (props: RenderLeafProps) => JSX.Element
  text: Text
}) => {
  const {
    leaf,
    isLast,
    text,
    parent,
    renderLeaf = (props: RenderLeafProps) => <DefaultLeaf {...props} />,
  } = props

  const placeholderRef = useRef<HTMLSpanElement | null>(null)

  useEffect(() => {
    const placeholderEl = placeholderRef?.current
    const editorEl = document.querySelector<HTMLDivElement>(
      '[data-slate-editor="true"]'
    )

    if (!placeholderEl || !editorEl) {
      return
    }

    editorEl.style.minHeight = `${placeholderEl.clientHeight}px`

    return () => {
      editorEl.style.minHeight = 'auto'
    }
  }, [placeholderRef])

  let children = (
    <String isLast={isLast} leaf={leaf} parent={parent} text={text} />
  )

  if (leaf[PLACEHOLDER_SYMBOL]) {
    children = (
      <React.Fragment>
        <span
          contentEditable={false}
          style={{
            pointerEvents: 'none',
            display: 'inline-block',
            width: '100%',
            maxWidth: '100%',
            opacity: '0.333',
            userSelect: 'none',
            fontStyle: 'normal',
            fontWeight: 'normal',
            textDecoration: 'none',
            position: 'absolute',
          }}
          ref={placeholderRef}
        >
          {leaf.placeholder}
        </span>
        {children}
      </React.Fragment>
    )
  }

  // COMPAT: Having the `data-` attributes on these leaf elements ensures that
  // in certain misbehaving browsers they aren't weirdly cloned/destroyed by
  // contenteditable behaviors. (2019/05/08)
  const attributes: {
    'data-slate-leaf': true
  } = {
    'data-slate-leaf': true,
  }

  return renderLeaf({ attributes, children, leaf, text })
}

const MemoizedLeaf = React.memo(Leaf, (prev, next) => {
  return (
    next.parent === prev.parent &&
    next.isLast === prev.isLast &&
    next.renderLeaf === prev.renderLeaf &&
    next.text === prev.text &&
    Text.matches(next.leaf, prev.leaf)
  )
})

export const DefaultLeaf = (props: RenderLeafProps) => {
  const { attributes, children } = props
  return <span {...attributes}>{children}</span>
}

export default MemoizedLeaf
