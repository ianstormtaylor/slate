import React, {
  useRef,
  useCallback,
  MutableRefObject,
  useState,
  useEffect,
} from 'react'
import { JSX } from 'react'
import { Element, Text } from 'slate'
import { ResizeObserver as ResizeObserverPolyfill } from '@juggle/resize-observer'
import String from './string'
import {
  PLACEHOLDER_SYMBOL,
  EDITOR_TO_PLACEHOLDER_ELEMENT,
  EDITOR_TO_FORCE_RENDER,
} from 'slate-dom'
import { RenderLeafProps, RenderPlaceholderProps } from './editable'
import { useSlateStatic } from '../hooks/use-slate-static'
import { IS_WEBKIT, IS_ANDROID } from 'slate-dom'

// Delay the placeholder on Android to prevent the keyboard from closing.
// (https://github.com/ianstormtaylor/slate/pull/5368)
const PLACEHOLDER_DELAY = IS_ANDROID ? 300 : 0

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

type TimerId = ReturnType<typeof setTimeout> | null

function clearTimeoutRef(timeoutRef: MutableRefObject<TimerId>) {
  if (timeoutRef.current) {
    clearTimeout(timeoutRef.current)
    timeoutRef.current = null
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
  const [showPlaceholder, setShowPlaceholder] = useState(false)
  const showPlaceholderTimeoutRef = useRef<TimerId>(null)

  const callbackPlaceholderRef = useCallback(
    (placeholderEl: HTMLElement | null) => {
      disconnectPlaceholderResizeObserver(
        placeholderResizeObserver,
        placeholderEl == null
      )

      if (placeholderEl == null) {
        EDITOR_TO_PLACEHOLDER_ELEMENT.delete(editor)
        leaf.onPlaceholderResize?.(null)
      } else {
        EDITOR_TO_PLACEHOLDER_ELEMENT.set(editor, placeholderEl)

        if (!placeholderResizeObserver.current) {
          // Create a new observer and observe the placeholder element.
          const ResizeObserver = window.ResizeObserver || ResizeObserverPolyfill
          placeholderResizeObserver.current = new ResizeObserver(() => {
            leaf.onPlaceholderResize?.(placeholderEl)
          })
        }
        placeholderResizeObserver.current.observe(placeholderEl)
        placeholderRef.current = placeholderEl
      }
    },
    [placeholderRef, leaf, editor]
  )

  let children = (
    <String isLast={isLast} leaf={leaf} parent={parent} text={text} />
  )

  const leafIsPlaceholder = Boolean(leaf[PLACEHOLDER_SYMBOL])
  useEffect(() => {
    if (leafIsPlaceholder) {
      if (!showPlaceholderTimeoutRef.current) {
        // Delay the placeholder, so it will not render in a selection
        showPlaceholderTimeoutRef.current = setTimeout(() => {
          setShowPlaceholder(true)
          showPlaceholderTimeoutRef.current = null
        }, PLACEHOLDER_DELAY)
      }
    } else {
      clearTimeoutRef(showPlaceholderTimeoutRef)
      setShowPlaceholder(false)
    }
    return () => clearTimeoutRef(showPlaceholderTimeoutRef)
  }, [leafIsPlaceholder, setShowPlaceholder])

  if (leafIsPlaceholder && showPlaceholder) {
    const placeholderProps: RenderPlaceholderProps = {
      children: leaf.placeholder,
      attributes: {
        'data-slate-placeholder': true,
        style: {
          position: 'absolute',
          top: 0,
          pointerEvents: 'none',
          width: '100%',
          maxWidth: '100%',
          display: 'block',
          opacity: '0.333',
          userSelect: 'none',
          textDecoration: 'none',
          // Fixes https://github.com/udecode/plate/issues/2315
          WebkitUserModify: IS_WEBKIT ? 'inherit' : undefined,
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
