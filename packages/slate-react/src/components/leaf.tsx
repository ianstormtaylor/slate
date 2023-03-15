import React, { useRef, useCallback, MutableRefObject } from 'react'
import { Element, Text } from 'slate'
import { ResizeObserver as ResizeObserverPolyfill } from '@juggle/resize-observer'
import String from './string'
import {
  PLACEHOLDER_SYMBOL,
  EDITOR_TO_PLACEHOLDER_ELEMENT,
  EDITOR_TO_FORCE_RENDER,
} from '../utils/weak-maps'
import { RenderLeafProps, RenderPlaceholderProps } from './editable'
import { useSlateStatic } from '../hooks/use-slate-static'

function disconnectPlaceholderResizeObserver(
  placeholderResizeObserver: MutableRefObject<ResizeObserver | null>,
  releaseObserver: boolean
) {
  if (placeholderResizeObserver.current) {
    placeholderResizeObserver.current.disconnect()
    if (releaseObserver) {
      placeholderResizeObserver.current = null
    }
  }
}
/**
 * Individual leaves in a text node with unique formatting.
 */
const Leaf = (props: {
  isLast: boolean
  leaf: Text
  parent: Element
  renderPlaceholder: (props: RenderPlaceholderProps) => JSX.Element
  renderLeaf?: (props: RenderLeafProps) => JSX.Element
  text: Text
}) => {
  const {
    leaf,
    isLast,
    text,
    parent,
    renderPlaceholder,
    renderLeaf = (props: RenderLeafProps) => <DefaultLeaf {...props} />,
  } = props

  const editor = useSlateStatic()
  const placeholderResizeObserver = useRef<ResizeObserver | null>(null)
  const placeholderRef = useRef<HTMLElement | null>(null)

  const callbackPlaceholderRef = useCallback(
    (placeholderEl: HTMLElement | null) => {
      disconnectPlaceholderResizeObserver(
        placeholderResizeObserver,
        placeholderEl == null
      )

      if (placeholderEl == null) {
        EDITOR_TO_PLACEHOLDER_ELEMENT.delete(editor)

        if (placeholderRef.current) {
          // Force a re-render of the editor so its min-height can be reset.
          const forceRender = EDITOR_TO_FORCE_RENDER.get(editor)
          forceRender?.()
        }
      } else {
        EDITOR_TO_PLACEHOLDER_ELEMENT.set(editor, placeholderEl)

        if (!placeholderResizeObserver.current) {
          // Create a new observer and observe the placeholder element.
          const ResizeObserver = window.ResizeObserver || ResizeObserverPolyfill
          placeholderResizeObserver.current = new ResizeObserver(() => {
            // Force a re-render of the editor so its min-height can be updated
            // to the new height of the placeholder.
            const forceRender = EDITOR_TO_FORCE_RENDER.get(editor)
            forceRender?.()
          })
        }
        placeholderResizeObserver.current.observe(placeholderEl)

        placeholderRef.current = placeholderEl
      }
    },
    [placeholderRef, editor]
  )

  let children = (
    <String isLast={isLast} leaf={leaf} parent={parent} text={text} />
  )

  if (leaf[PLACEHOLDER_SYMBOL]) {
    const placeholderProps: RenderPlaceholderProps = {
      children: leaf.placeholder,
      attributes: {
        'data-slate-placeholder': true,
        style: {
          position: 'absolute',
          pointerEvents: 'none',
          width: '100%',
          maxWidth: '100%',
          display: 'block',
          opacity: '0.333',
          userSelect: 'none',
          textDecoration: 'none',
        },
        contentEditable: false,
        ref: callbackPlaceholderRef,
      },
    }

    children = (
      <React.Fragment>
        {renderPlaceholder(placeholderProps)}
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
    next.renderPlaceholder === prev.renderPlaceholder &&
    next.text === prev.text &&
    Text.equals(next.leaf, prev.leaf) &&
    next.leaf[PLACEHOLDER_SYMBOL] === prev.leaf[PLACEHOLDER_SYMBOL]
  )
})

export const DefaultLeaf = (props: RenderLeafProps) => {
  const { attributes, children } = props
  return <span {...attributes}>{children}</span>
}

export default MemoizedLeaf
