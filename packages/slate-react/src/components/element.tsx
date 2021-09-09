import React, { useRef } from 'react'
import getDirection from 'direction'
import { Editor, Node, Range, Path, Element as SlateElement } from 'slate'

import Text from './text'
import useChildren from '../hooks/use-children'
import { ReactEditor, useSlateStatic, useReadOnly } from '..'
import { useIsomorphicLayoutEffect } from '../hooks/use-isomorphic-layout-effect'
import { useDecorate } from '../hooks/use-decorate'
import {
  NODE_TO_ELEMENT,
  ELEMENT_TO_NODE,
  NODE_TO_PARENT,
  NODE_TO_INDEX,
  EDITOR_TO_KEY_TO_ELEMENT,
} from '../utils/weak-maps'
import { isDecoratorRangeListEqual } from '../utils/range-list'
import {
  RenderChildrenProps,
  RenderElementProps,
  RenderLeafProps,
  RenderPlaceholderProps,
  RenderTextProps,
} from './editable'

const handler = {}
for (const method of ['getOwnPropertyDescriptor', 'get', 'has', 'ownKeys']) {
  handler[method] = (target: any, ...args: any[]) =>
    Reflect[method](target.force(), ...args)
}

function lazy<T>(thunk: () => T) {
  let evaluated = false
  let value: any = undefined
  const force = () => {
    if (!evaluated) {
      value = thunk()
      evaluated = true
    }
    return value
  }

  return new Proxy({ force }, handler)
}

/**
 * Element.
 */

const Element = (props: {
  decorations: Range[]
  element: SlateElement
  path: Path
  renderElement?: (props: RenderElementProps) => JSX.Element
  renderText?: (props: RenderTextProps) => JSX.Element
  renderPlaceholder: (props: RenderPlaceholderProps) => JSX.Element
  renderLeaf?: (props: RenderLeafProps) => JSX.Element
  selection: Range | null
}) => {
  const {
    decorations,
    element,
    path,
    renderElement = (p: RenderElementProps) => <DefaultElement {...p} />,
    renderText,
    renderPlaceholder,
    renderLeaf,
    selection,
  } = props
  const ref = useRef<HTMLElement>(null)
  const editor = useSlateStatic()
  const readOnly = useReadOnly()
  const isInline = editor.isInline(element)
  const key = ReactEditor.findKey(editor, element)

  // we must trigger a re-render in the parent Element when decorate
  // changes, in order to update the lazily-computed `children`.
  // if not, the component returned by `renderElement` is re-rendered
  // (because on the first render, `children` is forced in its context,
  // calling `useDecorate`) but it receives the same `children` from the
  // parent, which has already been forced.
  // TODO(jaked) this is fragile
  // it would be better for each component to compute its own decorations
  // instead of computing them in the parent, as in #4488
  const _ = useDecorate()

  let children

  const renderChildren = (props?: RenderChildrenProps) =>
    useChildren({
      decorations:
        props && props.decorations
          ? [...decorations, ...props.decorations]
          : decorations,
      node: element,
      renderElement,
      renderText,
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
    const [[text, path]] = Node.texts(element)

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
          renderText={renderText}
          renderPlaceholder={renderPlaceholder}
          decorations={[]}
          isLast={false}
          parent={element}
          text={text}
          path={path}
        />
      </Tag>
    )

    NODE_TO_INDEX.set(text, 0)
    NODE_TO_PARENT.set(text, element)
  } else {
    children = lazy(renderChildren)
  }

  // Update element-related weak maps with the DOM element ref.
  useIsomorphicLayoutEffect(() => {
    const KEY_TO_ELEMENT = EDITOR_TO_KEY_TO_ELEMENT.get(editor)
    if (ref.current) {
      KEY_TO_ELEMENT?.set(key, ref.current)
      NODE_TO_ELEMENT.set(element, ref.current)
      ELEMENT_TO_NODE.set(ref.current, element)
    } else {
      KEY_TO_ELEMENT?.delete(key)
      NODE_TO_ELEMENT.delete(element)
    }
  })

  return renderElement({ attributes, children, element, path, renderChildren })
}

const MemoizedElement = React.memo(Element, (prev, next) => {
  return (
    prev.element === next.element &&
    prev.renderElement === next.renderElement &&
    prev.renderLeaf === next.renderLeaf &&
    isDecoratorRangeListEqual(prev.decorations, next.decorations) &&
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
