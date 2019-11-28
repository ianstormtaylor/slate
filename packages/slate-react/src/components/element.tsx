import React, { useLayoutEffect, useRef } from 'react'
import getDirection from 'direction'
import { Editor, Node, Range, NodeEntry, Element as SlateElement } from 'slate'

import Text from './text'
import Children from './children'
import { ReactEditor, useEditor, useReadOnly } from '..'
import { SelectedContext } from '../hooks/use-selected'
import {
  NODE_TO_ELEMENT,
  ELEMENT_TO_NODE,
  NODE_TO_PARENT,
  NODE_TO_INDEX,
  KEY_TO_ELEMENT,
} from '../utils/weak-maps'
import {
  CustomDecorationProps,
  CustomElement,
  CustomElementProps,
  CustomMarkProps,
} from './custom'
import { isRangeListEqual } from '../utils/leaf'

/**
 * Element.
 */

const Element = (props: {
  decorate: (entry: NodeEntry) => Range[]
  decorations: Range[]
  element: SlateElement
  renderDecoration?: (props: CustomDecorationProps) => JSX.Element
  renderElement?: (props: CustomElementProps) => JSX.Element
  renderMark?: (props: CustomMarkProps) => JSX.Element
  selection: Range | null
}) => {
  const {
    decorate,
    decorations,
    element,
    renderDecoration,
    renderElement = (p: CustomElementProps) => <CustomElement {...p} />,
    renderMark,
    selection,
  } = props
  const ref = useRef<HTMLElement>(null)
  const editor = useEditor()
  const readOnly = useReadOnly()
  const isInline = editor.isInline(element)
  const key = ReactEditor.findKey(editor, element)

  let children: JSX.Element | null = (
    <Children
      decorate={decorate}
      decorations={decorations}
      node={element}
      renderDecoration={renderDecoration}
      renderElement={renderElement}
      renderMark={renderMark}
      selection={selection}
    />
  )

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
    const text = Node.text(element)
    const dir = getDirection(text)

    if (dir === 'rtl') {
      attributes.dir = dir
    }
  }

  // If it's a void node, wrap the children in extra void-specific elements.
  if (editor.isVoid(element)) {
    attributes['data-slate-void'] = true

    if (!readOnly && isInline) {
      attributes.contentEditable = false
    }

    const Tag = isInline ? 'span' : 'div'
    const [[text]] = Node.texts(element)

    children = readOnly ? null : (
      <Tag
        data-slate-spacer
        style={{
          height: '0',
          color: 'transparent',
          outline: 'none',
          position: 'absolute',
        }}
      >
        <Text decorations={[]} isLast={false} parent={element} text={text} />
      </Tag>
    )

    NODE_TO_INDEX.set(text, 0)
    NODE_TO_PARENT.set(text, element)
  }

  // Update element-related weak maps with the DOM element ref.
  useLayoutEffect(() => {
    if (ref.current) {
      KEY_TO_ELEMENT.set(key, ref.current)
      NODE_TO_ELEMENT.set(element, ref.current)
      ELEMENT_TO_NODE.set(ref.current, element)
    } else {
      KEY_TO_ELEMENT.delete(key)
      NODE_TO_ELEMENT.delete(element)
    }
  })

  return (
    <SelectedContext.Provider value={!!selection}>
      {renderElement({ attributes, children, element })}
    </SelectedContext.Provider>
  )
}

const MemoizedElement = React.memo(Element, (prev, next) => {
  return (
    prev.decorate === next.decorate &&
    prev.element === next.element &&
    prev.renderDecoration === next.renderDecoration &&
    prev.renderElement === next.renderElement &&
    prev.renderMark === next.renderMark &&
    isRangeListEqual(prev.decorations, next.decorations) &&
    (prev.selection === next.selection ||
      (!!prev.selection &&
        !!next.selection &&
        Range.equals(prev.selection, next.selection)))
  )
})

export default MemoizedElement
