import React, { useLayoutEffect, useRef } from 'react'
import getDirection from 'direction'
import { Node, Range, NodeEntry, Element as SlateElement, Path } from 'slate'

import Text from './text'
import Children from './children'
import { useEditor } from '../hooks/use-editor'
import { useReadOnly } from '../hooks/use-read-only'
import { SelectedContext } from '../hooks/use-selected'
import {
  NODE_TO_ELEMENT,
  ELEMENT_TO_NODE,
  NODE_TO_PARENT,
  NODE_TO_INDEX,
  KEY_TO_ELEMENT,
} from '../utils/weak-maps'
import {
  CustomAnnotationProps,
  CustomDecorationProps,
  CustomElement,
  CustomElementProps,
  CustomMarkProps,
} from './custom'

/**
 * Element.
 */

const Element = (props: {
  annotations: Range[]
  decorate: (entry: NodeEntry) => Range[]
  decorations: Range[]
  element: SlateElement
  path?: Path
  renderAnnotation?: (props: CustomAnnotationProps) => JSX.Element
  renderDecoration?: (props: CustomDecorationProps) => JSX.Element
  renderElement?: (props: CustomElementProps) => JSX.Element
  renderMark?: (props: CustomMarkProps) => JSX.Element
  selection: Range | null
}) => {
  const {
    annotations,
    decorate,
    decorations,
    element,
    renderAnnotation,
    renderDecoration,
    renderElement = (props: CustomElementProps) => <CustomElement {...props} />,
    renderMark,
    selection,
  } = props
  const ref = useRef<HTMLElement>(null)
  const editor = useEditor()
  const readOnly = useReadOnly()
  const isInline = editor.isInline(element)
  const key = editor.findKey(element)

  let children: JSX.Element | null = (
    <Children
      annotations={annotations}
      decorate={decorate}
      decorations={decorations}
      node={element}
      renderAnnotation={renderAnnotation}
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
  if (!isInline && editor.hasInlines(element)) {
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
      attributes['contentEditable'] = false
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
        <Text
          annotations={[]}
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

  console.log('render (element)')

  // Update element-related weak maps with the DOM element ref.
  useLayoutEffect(() => {
    if (ref.current) {
      console.log('add (element)', key)
      KEY_TO_ELEMENT.set(key, ref.current)
      NODE_TO_ELEMENT.set(element, ref.current)
      ELEMENT_TO_NODE.set(ref.current, element)
    } else {
      console.log('remove (element)', key)
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

export default Element
