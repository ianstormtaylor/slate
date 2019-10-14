import { Descendant, Element, Mark, Node, Text } from 'slate'
import {
  AnchorToken,
  AnnotationToken,
  FocusToken,
  Token,
  addAnchorToken,
  addAnnotationToken,
  addFocusToken,
} from './tokens'

/**
 * Resolve the descedants of a node by normalizing the children that can be
 * passed into a hyperscript creator function.
 */

const STRINGS: WeakSet<Text> = new WeakSet()

export const resolveDescendants = (children: any[]): Descendant[] => {
  const nodes: Node[] = []

  const addChild = (child: Node | Token): void => {
    const prev = nodes[nodes.length - 1]

    if (typeof child === 'string') {
      const text = { text: child, marks: [] }
      STRINGS.add(text)
      child = text
    }

    if (Text.isText(child)) {
      const c = child // HACK: fix typescript complaining
      if (
        Text.isText(prev) &&
        STRINGS.has(prev) &&
        STRINGS.has(c) &&
        c.marks.every(m => Mark.exists(m, prev.marks)) &&
        prev.marks.every(m => Mark.exists(m, c.marks))
      ) {
        prev.text += c.text
      } else {
        nodes.push(c)
      }
    } else if (Element.isElement(child)) {
      nodes.push(child)
    } else if (child instanceof Token) {
      let n = nodes[nodes.length - 1]

      if (!Text.isText(n)) {
        addChild('')
        n = nodes[nodes.length - 1] as Text
      }

      if (child instanceof AnchorToken) {
        addAnchorToken(n, child)
      } else if (child instanceof FocusToken) {
        addFocusToken(n, child)
      } else if (child instanceof AnnotationToken) {
        addAnnotationToken(n, child)
      }
    } else {
      throw new Error(`Unexpected hyperscript child object: ${child}`)
    }
  }

  for (const child of children.flat()) {
    addChild(child)
  }

  return nodes
}
