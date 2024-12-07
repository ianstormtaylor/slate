import getDirection from 'direction'
import React, { useCallback } from 'react'
import { JSX } from 'react'
import {
  Editor,
  Element as SlateElement,
  Node,
  Range,
  DecoratedRange,
} from 'slate'
import { ReactEditor, useReadOnly, useSlateStatic } from '..'
import useChildren from '../hooks/use-children'
import { isElementDecorationsEqual } from 'slate-dom'
import {
  EDITOR_TO_KEY_TO_ELEMENT,
  ELEMENT_TO_NODE,
  NODE_TO_ELEMENT,
  NODE_TO_INDEX,
  NODE_TO_PARENT,
} from 'slate-dom'
import {
  RenderElementProps,
  RenderLeafProps,
  RenderPlaceholderProps,
} from './editable'

import Text from './text'

/**
 * Element.
 */

const Element = (props: {
  decorations: DecoratedRange[]
  element: SlateElement
  renderElement?: (props: RenderElementProps) => JSX.Element
  renderPlaceholder: (props: RenderPlaceholderProps) => JSX.Element
  renderLeaf?: (props: RenderLeafProps) => JSX.Element
  selection: Range | null
}) => {
  const {
    decorations,
    element,
    renderElement = (p: RenderElementProps) => <DefaultElement {...p} />,
    renderPlaceholder,
    renderLeaf,
    selection,
  } = props
  const editor = useSlateStatic()
  const readOnly = useReadOnly()
  const isInline = editor.isInline(element)
  const key = ReactEditor.findKey(editor, element)
  const ref = useCallback(
    (ref: HTMLElement | null) => {
      // Update element-related weak maps with the DOM element ref.
      const KEY_TO_ELEMENT = EDITOR_TO_KEY_TO_ELEMENT.get(editor)
      if (ref) {
        KEY_TO_ELEMENT?.set(key, ref)
        NODE_TO_ELEMENT.set(element, ref)
        ELEMENT_TO_NODE.set(ref, element)
      } else {
        KEY_TO_ELEMENT?.delete(key)
        NODE_TO_ELEMENT.delete(element)
      }
    },
    [editor, key, element]
  )
  let children: React.ReactNode = useChildren({
    decorations,
    node: element,
    renderElement,
    renderPlaceholder,
    renderLeaf,
    selection,
  })

  // Attributes that the developer must mix into the element in their
  // custom node renderer component.
  const attributes: {
    'data-slate-node': 'element'
    'data-slate-void'?: true
    'data-slate-inline'?: true
    contentEditable?: false
    dir?: 'rtl'
    ref: any
  } = {
    'data-slate-node': 'element',
    ref,
  }

  if (isInline) {
    attributes['data-slate-inline'] = true
  }

  // If it's a block node with inline children, add the proper `dir` attribute
  // for text direction.
  if (!isInline && Editor.hasInlines(editor, element)) {
    const text = Node.string(element)
    const dir = getDirection(text)

    if (dir === 'rtl') {
      attributes.dir = dir
    }
  }

  // If it's a void node, wrap the children in extra void-specific elements.
  if (Editor.isVoid(editor, element)) {
    attributes['data-slate-void'] = true

    if (!readOnly && isInline) {
      attributes.contentEditable = false
    }

    const Tag = isInline ? 'span' : 'div'
    const [[text]] = Node.texts(element)

    children = (
      <Tag
        data-slate-spacer
        style={{
          height: '0',
          color: 'transparent',
          outline: 'none',
          position: 'absolute',
        }}
      >
        <Text
          renderPlaceholder={renderPlaceholder}
          decorations={[]}
          isLast={false}
          parent={element}
          text={text}
        />
      </Tag>
    )

    NODE_TO_INDEX.set(text, 0)
    NODE_TO_PARENT.set(text, element)
  }

  return renderElement({ attributes, children, element })
}

const MemoizedElement = React.memo(Element, (prev, next) => {
  return (
    prev.element === next.element &&
    prev.renderElement === next.renderElement &&
    prev.renderLeaf === next.renderLeaf &&
    prev.renderPlaceholder === next.renderPlaceholder &&
    isElementDecorationsEqual(prev.decorations, next.decorations) &&
    (prev.selection === next.selection ||
      (!!prev.selection &&
        !!next.selection &&
        Range.equals(prev.selection, next.selection)))
  )
})

/**
 * The default element renderer.
 */

export const DefaultElement = (props: RenderElementProps) => {
  const { attributes, children, element } = props
  const editor = useSlateStatic()
  const Tag = editor.isInline(element) ? 'span' : 'div'
  return (
    <Tag {...attributes} style={{ position: 'relative' }}>
      {children}
    </Tag>
  )
}

export default MemoizedElement
