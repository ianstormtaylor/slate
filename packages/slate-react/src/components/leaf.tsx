import React, { useRef, useEffect } from 'react'
import { Element, Text } from 'slate'
import String from './string'
import { PLACEHOLDER_SYMBOL } from '../utils/weak-maps'
import { RenderLeafProps } from './editable'

// auto-incrementing key for String component, force it refresh to
// prevent inconsistent rendering by React with IME input
let keyForString = 0
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
    <String
      key={keyForString++}
      isLast={isLast}
      leaf={leaf}
      parent={parent}
      text={text}
    />
  )

  if (leaf[PLACEHOLDER_SYMBOL]) {
    children = (
      <React.Fragment>
        <span
          ref={placeholderRef}
          contentEditable={false}
          style={{
            pointerEvents: 'none',
            display: 'inline-block',
            width: '100%',
            maxWidth: '100%',
            whiteSpace: 'nowrap',
            opacity: '0.333',
            userSelect: 'none',
            fontStyle: 'normal',
            fontWeight: 'normal',
            textDecoration: 'none',
            position: 'absolute',
          }}
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
    next.leaf.text === prev.leaf.text &&
    Text.matches(next.leaf, prev.leaf) &&
    next.leaf[PLACEHOLDER_SYMBOL] === prev.leaf[PLACEHOLDER_SYMBOL]
  )
})

export const DefaultLeaf = (props: RenderLeafProps) => {
  const { attributes, children } = props
  return <span {...attributes}>{children}</span>
}

export default MemoizedLeaf
