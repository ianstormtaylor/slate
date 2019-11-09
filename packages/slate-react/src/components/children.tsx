import React from 'react'
import { Range, Element, NodeEntry, Ancestor, Descendant } from 'slate'

import ElementComponent from './element'
import TextComponent from './text'
import { useEditor } from '../hooks/use-editor'
import { NODE_TO_INDEX, NODE_TO_PARENT } from '../utils/weak-maps'
import {
  CustomAnnotationProps,
  CustomDecorationProps,
  CustomElementProps,
  CustomMarkProps,
} from './custom'

/**
 * Children.
 */

const Children = (props: {
  annotations: Record<string, Range>
  decorate: (entry: NodeEntry) => Range[]
  decorations: Range[]
  node: Ancestor
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
    node,
    renderAnnotation,
    renderDecoration,
    renderElement,
    renderMark,
    selection,
  } = props
  const editor = useEditor()
  const path = editor.findPath(node)
  const children = []
  const isLeafBlock =
    Element.isElement(node) && !editor.isInline(node) && editor.hasInlines(node)

  for (let i = 0; i < node.nodes.length; i++) {
    const p = path.concat(i)
    const n = node.nodes[i] as Descendant
    const key = editor.findKey(n)
    const range = editor.getRange(p)
    const sel = selection && Range.intersection(range, selection)
    const decs = decorate([n, p])
    const anns = {}

    for (const dec of decorations) {
      const d = Range.intersection(dec, range)

      if (d) {
        decs.push(d)
      }
    }

    for (const k in annotations) {
      const ann = annotations[k]
      const a = Range.intersection(ann, range)

      if (a) {
        anns[k] = a
      }
    }

    if (Element.isElement(n)) {
      children.push(
        <ElementComponent
          annotations={anns}
          decorate={decorate}
          decorations={decs}
          element={n}
          key={key.id}
          renderAnnotation={renderAnnotation}
          renderDecoration={renderDecoration}
          renderElement={renderElement}
          renderMark={renderMark}
          selection={sel}
        />
      )
    } else {
      children.push(
        <TextComponent
          annotations={anns}
          decorations={decs}
          key={key.id}
          isLast={isLeafBlock && i === node.nodes.length}
          parent={node}
          renderAnnotation={renderAnnotation}
          renderDecoration={renderDecoration}
          renderMark={renderMark}
          text={n}
        />
      )
    }

    NODE_TO_INDEX.set(n, i)
    NODE_TO_PARENT.set(n, node)
  }

  return <React.Fragment>{children}</React.Fragment>
}

export default Children
