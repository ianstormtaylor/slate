import { Descendant, Editor, Element, Node, Range, Text } from 'slate'
import {
  addAnchorToken,
  addFocusToken,
  AnchorToken,
  FocusToken,
  getAnchorOffset,
  getFocusOffset,
  Token,
} from './tokens'

/**
 * Resolve the descedants of a node by normalizing the children that can be
 * passed into a hyperscript creator function.
 */

const STRINGS: WeakSet<Text> = new WeakSet()

const resolveDescendants = (children: any[]): Descendant[] => {
  const nodes: Node[] = []

  const addChild = (child: Node | Token): void => {
    if (child == null) {
      return
    }

    const prev = nodes[nodes.length - 1]

    if (typeof child === 'string') {
      const text = { text: child }
      STRINGS.add(text)
      child = text
    }

    if (Text.isText(child)) {
      const c = child // HACK: fix typescript complaining

      if (
        Text.isText(prev) &&
        STRINGS.has(prev) &&
        STRINGS.has(c) &&
        Text.equals(prev, c, { loose: true })
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
      }
    } else {
      throw new Error(`Unexpected hyperscript child object: ${child}`)
    }
  }

  for (const child of children.flat(Infinity)) {
    addChild(child)
  }

  return nodes
}

/**
 * Create an anchor token.
 */

export function createAnchor(
  tagName: string,
  attributes: { [key: string]: any },
  children: any[]
): AnchorToken {
  return new AnchorToken(attributes)
}

/**
 * Create an anchor and a focus token.
 */

export function createCursor(
  tagName: string,
  attributes: { [key: string]: any },
  children: any[]
): Token[] {
  return [new AnchorToken(attributes), new FocusToken(attributes)]
}

/**
 * Create an `Element` object.
 */

export function createElement(
  tagName: string,
  attributes: { [key: string]: any },
  children: any[]
): Element {
  return { ...attributes, children: resolveDescendants(children) }
}

/**
 * Create a focus token.
 */

export function createFocus(
  tagName: string,
  attributes: { [key: string]: any },
  children: any[]
): FocusToken {
  return new FocusToken(attributes)
}

/**
 * Create a fragment.
 */

export function createFragment(
  tagName: string,
  attributes: { [key: string]: any },
  children: any[]
): Descendant[] {
  return resolveDescendants(children)
}

/**
 * Create a `Selection` object.
 */

export function createSelection(
  tagName: string,
  attributes: { [key: string]: any },
  children: any[]
): Range {
  const anchor: AnchorToken = children.find(c => c instanceof AnchorToken)
  const focus: FocusToken = children.find(c => c instanceof FocusToken)

  if (!anchor || anchor.offset == null || anchor.path == null) {
    throw new Error(
      `The <selection> hyperscript tag must have an <anchor> tag as a child with \`path\` and \`offset\` attributes defined.`
    )
  }

  if (!focus || focus.offset == null || focus.path == null) {
    throw new Error(
      `The <selection> hyperscript tag must have a <focus> tag as a child with \`path\` and \`offset\` attributes defined.`
    )
  }

  return {
    anchor: {
      offset: anchor.offset,
      path: anchor.path,
    },
    focus: {
      offset: focus.offset,
      path: focus.path,
    },
    ...attributes,
  }
}

/**
 * Create a `Text` object.
 */

export function createText(
  tagName: string,
  attributes: { [key: string]: any },
  children: any[]
): Text {
  const nodes = resolveDescendants(children)

  if (nodes.length > 1) {
    throw new Error(
      `The <text> hyperscript tag must only contain a single node's worth of children.`
    )
  }

  let [node] = nodes

  if (node == null) {
    node = { text: '' }
  }

  if (!Text.isText(node)) {
    throw new Error(`
    The <text> hyperscript tag can only contain text content as children.`)
  }

  // COMPAT: If they used the <text> tag we want to guarantee that it won't be
  // merge with other string children.
  STRINGS.delete(node)

  Object.assign(node, attributes)
  return node
}

/**
 * Create a top-level `Editor` object.
 */

export const createEditor = (makeEditor: () => Editor) => (
  tagName: string,
  attributes: { [key: string]: any },
  children: any[]
): Editor => {
  const otherChildren: any[] = []
  let selectionChild: Range | undefined

  for (const child of children) {
    if (Range.isRange(child)) {
      selectionChild = child
    } else {
      otherChildren.push(child)
    }
  }

  const descendants = resolveDescendants(otherChildren)
  const selection: Partial<Range> = {}
  const editor = makeEditor()
  Object.assign(editor, attributes)
  editor.children = descendants as Element[]

  // Search the document's texts to see if any of them have tokens associated
  // that need incorporated into the selection.
  for (const [node, path] of Node.texts(editor)) {
    const anchor = getAnchorOffset(node)
    const focus = getFocusOffset(node)

    if (anchor != null) {
      const [offset] = anchor
      selection.anchor = { path, offset }
    }

    if (focus != null) {
      const [offset] = focus
      selection.focus = { path, offset }
    }
  }

  if (selection.anchor && !selection.focus) {
    throw new Error(
      `Slate hyperscript ranges must have both \`<anchor />\` and \`<focus />\` defined if one is defined, but you only defined \`<anchor />\`. For collapsed selections, use \`<cursor />\` instead.`
    )
  }

  if (!selection.anchor && selection.focus) {
    throw new Error(
      `Slate hyperscript ranges must have both \`<anchor />\` and \`<focus />\` defined if one is defined, but you only defined \`<focus />\`. For collapsed selections, use \`<cursor />\` instead.`
    )
  }

  if (selectionChild != null) {
    editor.selection = selectionChild
  } else if (Range.isRange(selection)) {
    editor.selection = selection
  }

  return editor
}
