import React from 'react'
import { Range, Element, Ancestor, Descendant } from 'slate'

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
  annotations: Range[]
  block: Element | null
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
    block,
    decorations,
    node,
    renderAnnotation,
    renderDecoration,
    renderElement,
    renderMark,
    selection,
  } = props
  const editor = useEditor()
  const newDecorations = editor.getDecorations(node)
  const path = editor.findPath(node)
  const children = []

  for (let i = 0; i < node.nodes.length; i++) {
    const p = path.concat(i)
    const n = node.nodes[i] as Descendant
    const range = editor.getRange(p)
    const sel = selection && Range.intersection(range, selection)
    const anns = []
    const decs = []

    for (let dec of newDecorations.concat(decorations)) {
      const d = Range.intersection(dec, range)

      if (d) {
        decs.push(d)
      }
    }

    for (let ann of annotations) {
      const a = Range.intersection(ann, range)

      if (a) {
        anns.push(a)
      }
    }

    if (Element.isElement(n)) {
      children.push(
        <ElementComponent
          annotations={anns}
          block={editor.isInline(node) ? block : node}
          decorations={decs}
          element={n}
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
          block={block}
          decorations={decs}
          node={n}
          parent={node}
          renderAnnotation={renderAnnotation}
          renderDecoration={renderDecoration}
          renderMark={renderMark}
        />
      )
    }

    NODE_TO_INDEX.set(n, i)
    NODE_TO_PARENT.set(n, node)
  }

  return <React.Fragment>{children}</React.Fragment>
}

export default Children
