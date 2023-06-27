import React, { forwardRef, memo, useRef, useState } from 'react'
import { Editor, Element, Node, Path, Text } from 'slate'

import { ReactEditor, useSlateStatic } from '..'
import { useIsomorphicLayoutEffect } from '../hooks/use-isomorphic-layout-effect'
import { IS_ANDROID } from '../utils/environment'
import { MARK_PLACEHOLDER_SYMBOL } from '../utils/weak-maps'

/**
 * Leaf content strings.
 */

const String = (props: {
  isLast: boolean
  leaf: Text
  parent: Element
  text: Text
}) => {
  const { isLast, leaf, parent, text } = props
  const editor = useSlateStatic()
  const path = ReactEditor.findPath(editor, text)
  if (!path) {
    return <TextString text={leaf.text} />
  }

  const parentPath = Path.parent(path)
  if (!parentPath) {
    return <TextString text={leaf.text} />
  }

  const isMarkPlaceholder = leaf[MARK_PLACEHOLDER_SYMBOL] === true

  // COMPAT: Render text inside void nodes with a zero-width space.
  // So the node can contain selection but the text is not visible.
  if (editor.isVoid(parent)) {
    return <ZeroWidthString length={Node.string(parent).length} />
  }

  // COMPAT: If this is the last text node in an empty block, render a zero-
  // width space that will convert into a line break when copying and pasting
  // to support expected plain text.
  if (
    leaf.text === '' &&
    parent.children[parent.children.length - 1] === text &&
    !editor.isInline(parent) &&
    Editor.string(editor, parentPath) === ''
  ) {
    return <ZeroWidthString isLineBreak isMarkPlaceholder={isMarkPlaceholder} />
  }

  // COMPAT: If the text is empty, it's because it's on the edge of an inline
  // node, so we render a zero-width space so that the selection can be
  // inserted next to it still.
  if (leaf.text === '') {
    return <ZeroWidthString isMarkPlaceholder={isMarkPlaceholder} />
  }

  // COMPAT: Browsers will collapse trailing new lines at the end of blocks,
  // so we need to add an extra trailing new lines to prevent that.
  if (isLast && leaf.text.slice(-1) === '\n') {
    return <TextString isTrailing text={leaf.text} />
  }

  return <TextString text={leaf.text} />
}

/**
 * Leaf strings with text in them.
 */
const TextString = (props: { text: string; isTrailing?: boolean }) => {
  const { text, isTrailing = false } = props
  const ref = useRef<HTMLSpanElement>(null)
  const getTextContent = () => {
    return `${text ?? ''}${isTrailing ? '\n' : ''}`
  }
  const [initialText] = useState(getTextContent)

  // This is the actual text rendering boundary where we interface with the DOM
  // The text is not rendered as part of the virtual DOM, as since we handle basic character insertions natively,
  // updating the DOM is not a one way dataflow anymore. What we need here is not reconciliation and diffing
  // with previous version of the virtual DOM, but rather diffing with the actual DOM element, and replace the DOM <span> content
  // exactly if and only if its current content does not match our current virtual DOM.
  // Otherwise the DOM TextNode would always be replaced by React as the user types, which interferes with native text features,
  // eg makes native spellcheck opt out from checking the text node.

  // useLayoutEffect: updating our span before browser paint
  useIsomorphicLayoutEffect(() => {
    // null coalescing text to make sure we're not outputing "null" as a string in the extreme case it is nullish at runtime
    const textWithTrailing = getTextContent()

    if (ref.current && ref.current.textContent !== textWithTrailing) {
      ref.current.textContent = textWithTrailing
    }

    // intentionally not specifying dependencies, so that this effect runs on every render
    // as this effectively replaces "specifying the text in the virtual DOM under the <span> below" on each render
  })

  // We intentionally render a memoized <span> that only receives the initial text content when the component is mounted.
  // We defer to the layout effect above to update the `textContent` of the span element when needed.
  return <MemoizedText ref={ref}>{initialText}</MemoizedText>
}

const MemoizedText = memo(
  forwardRef<HTMLSpanElement, { children: string }>((props, ref) => {
    return (
      <span data-slate-string ref={ref}>
        {props.children}
      </span>
    )
  })
)

/**
 * Leaf strings without text, render as zero-width strings.
 */

export const ZeroWidthString = (props: {
  length?: number
  isLineBreak?: boolean
  isMarkPlaceholder?: boolean
}) => {
  const { length = 0, isLineBreak = false, isMarkPlaceholder = false } = props

  const attributes = {
    'data-slate-zero-width': isLineBreak ? 'n' : 'z',
    'data-slate-length': length,
  }

  if (isMarkPlaceholder) {
    attributes['data-slate-mark-placeholder'] = true
  }

  return (
    <span {...attributes}>
      {!IS_ANDROID || !isLineBreak ? '\uFEFF' : null}
      {isLineBreak ? <br /> : null}
    </span>
  )
}

export default String
