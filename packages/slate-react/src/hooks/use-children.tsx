import React from 'react'
import { Editor, Range, Element, Path, Ancestor, Descendant } from 'slate'

import ElementComponent from '../components/element'
import TextComponent from '../components/text'
import { ReactEditor } from '..'
import { useSlateStatic } from './use-slate-static'
import { useDecorate } from './use-decorate'
import { NODE_TO_INDEX, NODE_TO_PARENT } from '../utils/weak-maps'
import {
  RenderElementProps,
  RenderLeafProps,
  RenderPlaceholderProps,
} from '../components/editable'
import { SelectedContext } from './use-selected'

/**
 * Children.
 */

const Child = (props: {
  decorations: Range[]
  parent: Ancestor
  path: Path
  child: Descendant
  isLast: boolean
  renderElement?: (props: RenderElementProps) => JSX.Element
  renderPlaceholder: (props: RenderPlaceholderProps) => JSX.Element
  renderLeaf?: (props: RenderLeafProps) => JSX.Element
  selection: Range | null
}) => {
  const {
    decorations,
    parent,
    path,
    child,
    isLast,
    renderElement,
    renderPlaceholder,
    renderLeaf,
    selection,
  } = props
  const decorate = useDecorate()
  const editor = useSlateStatic()

  const range = Editor.range(editor, path)
  const sel = selection && Range.intersection(range, selection)
  const ds = decorate([child, path])

  for (const dec of decorations) {
    const d = Range.intersection(dec, range)

    if (d) {
      ds.push(d)
    }
  }

  if (Element.isElement(child)) {
    return (
      <SelectedContext.Provider value={!!sel}>
        <ElementComponent
          decorations={ds}
          element={child}
          renderElement={renderElement}
          renderPlaceholder={renderPlaceholder}
          renderLeaf={renderLeaf}
          selection={sel}
        />
      </SelectedContext.Provider>
    )
  }
  return (
    <TextComponent
      decorations={ds}
      isLast={isLast}
      parent={parent}
      renderPlaceholder={renderPlaceholder}
      renderLeaf={renderLeaf}
      text={child}
    />
  )
}

const useChildren = (props: {
  decorations: Range[]
  node: Ancestor
  renderElement?: (props: RenderElementProps) => JSX.Element
  renderPlaceholder: (props: RenderPlaceholderProps) => JSX.Element
  renderLeaf?: (props: RenderLeafProps) => JSX.Element
  selection: Range | null
}) => {
  const {
    decorations,
    node,
    renderElement,
    renderPlaceholder,
    renderLeaf,
    selection,
  } = props
  const editor = useSlateStatic()
  const path = ReactEditor.findPath(editor, node)
  const children = []
  const isLeafBlock =
    Element.isElement(node) &&
    !editor.isInline(node) &&
    Editor.hasInlines(editor, node)

  for (let i = 0; i < node.children.length; i++) {
    const p = path.concat(i)
    const n = node.children[i] as Descendant
    const key = ReactEditor.findKey(editor, n)

    children.push(
      <Child
        decorations={decorations}
        parent={node}
        path={p}
        child={n}
        key={key.id}
        isLast={isLeafBlock && i === node.children.length - 1}
        renderElement={renderElement}
        renderPlaceholder={renderPlaceholder}
        renderLeaf={renderLeaf}
        selection={selection}
      />
    )

    NODE_TO_INDEX.set(n, i)
    NODE_TO_PARENT.set(n, node)
  }

  return children
}

export default useChildren
