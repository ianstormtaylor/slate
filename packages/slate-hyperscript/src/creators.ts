import {
  Element,
  Descendant,
  Fragment,
  Mark,
  Node,
  Path,
  Selection,
  Text,
  Value,
} from 'slate'
import {
  AnchorToken,
  AnnotationToken,
  FocusToken,
  Token,
  addAnchorToken,
  addAnnotationToken,
  addFocusToken,
  getAnchorOffset,
  getFocusOffset,
  getAnnotationOffsets,
} from './tokens'

/**
 * Resolve the descedants of a node by normalizing the children that can be
 * passed into a hyperscript creator function.
 */

const STRINGS: WeakSet<Text> = new WeakSet()

const resolveDescendants = (children: any[]): Descendant[] => {
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
 * Create an annotation token, or two.
 */

export function createAnnotation(
  tagName: string,
  attributes: { [key: string]: any },
  children: any[]
): (Node | Token)[] {
  if (!('key' in attributes)) {
    throw new Error(
      `The <annotation> tag must be passed a unique \`key\` string attribute to uniquely identify it.`
    )
  }

  const { key, ...rest } = attributes

  if (children.length === 0) {
    return [new AnnotationToken({ key, ...rest })]
  } else {
    const array: (Node | Token)[] = resolveDescendants(children)
    const start = new AnnotationToken({ key, ...rest })
    const end = new AnnotationToken({ key, ...rest })
    array.unshift(start)
    array.push(end)
    return array
  }
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
  return { ...attributes, nodes: resolveDescendants(children) }
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
 * Create an `Fragment` object.
 */

export function createFragment(
  tagName: string,
  attributes: { [key: string]: any },
  children: any[]
): Fragment {
  return { nodes: resolveDescendants(children) }
}

/**
 * Create a `Text` object with a mark applied.
 */

export function createMark(
  tagName: string,
  attributes: { [key: string]: any },
  children: any[]
): Text {
  const mark = { ...attributes }
  const nodes = resolveDescendants(children)

  if (nodes.length > 1) {
    throw new Error(
      `The <mark> hyperscript tag must only contain a single node's worth of children.`
    )
  }

  if (nodes.length === 0) {
    return { text: '', marks: [mark] }
  }

  const [node] = nodes

  if (!Text.isText(node)) {
    throw new Error(
      `The <mark> hyperscript tag must only contain text content as children.`
    )
  }

  if (!Mark.exists(mark, node.marks)) {
    node.marks.push(mark)
  }

  return node
}

/**
 * Create a `Selection` object.
 */

export function createSelection(
  tagName: string,
  attributes: { [key: string]: any },
  children: any[]
): Selection {
  const anchor: AnchorToken = children.find(c => c instanceof AnchorToken)
  const focus: FocusToken = children.find(c => c instanceof FocusToken)

  if (!anchor || !anchor.offset || !anchor.path) {
    throw new Error(
      `The <selection> hyperscript tag must have an <anchor> tag as a child with \`path\` and \`offset\` attributes defined.`
    )
  }

  if (!focus || !focus.offset || !focus.path) {
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
    isFocused: 'focused' in attributes ? attributes.focused : false,
    marks: 'marks' in attributes ? attributes.marks : null,
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
    node = { text: '', marks: [] }
  }

  if (!Text.isText(node)) {
    throw new Error(`
    The <text> hyperscript tag can only contain text content as children.`)
  }

  // COMPAT: Re-create the node, because if they used the <text> tag we want to
  // guarantee that it won't be merge with other string children.
  STRINGS.delete(node)

  Object.assign(node, attributes)
  return node
}

/**
 * Create a top-level `Value` object.
 */

export function createValue(
  tagName: string,
  attributes: { [key: string]: any },
  children: any[]
) {
  const otherChildren: any[] = []
  let selectionChild: Selection | undefined

  for (const child of children) {
    if (Selection.isSelection(child)) {
      selectionChild = child
    } else {
      otherChildren.push(child)
    }
  }

  const nodes = resolveDescendants(otherChildren)
  const value: Value = {
    nodes,
    selection: null,
    annotations: {},
    ...attributes,
  }

  const selection: any = {
    isFocused: false,
    marks: null,
  }

  const partials: Record<string, [Path, number, AnnotationToken]> = {}

  // Search the document's texts to see if any of them have tokens associated
  // that need incorporated into the selection or annotations.
  for (const [node, path] of Node.texts(value)) {
    const anchor = getAnchorOffset(node)
    const focus = getFocusOffset(node)
    const anns = getAnnotationOffsets(node)

    if (anchor != null) {
      const [offset, token] = anchor
      selection.anchor = { path, offset }
      selection.isFocused = token.focused
      selection.marks = token.marks
    }

    if (focus != null) {
      const [offset, token] = focus
      selection.focus = { path, offset }
      selection.isFocused = token.focused
      selection.marks = token.marks
    }

    for (const o in anns) {
      const offset = parseInt(o)
      const token = anns[offset]
      const { key } = token
      const partial = partials[key]

      if (!partial) {
        partials[key] = [path, offset, token]
      } else {
        const [pPath, pOffset, pToken] = partial
        delete partials[key]
        value.annotations[key] = {
          anchor: { path: pPath, offset: pOffset },
          focus: { path, offset },
          ...pToken.props,
          ...token.props,
        }
      }
    }
  }

  if (Object.keys(partials).length > 0) {
    throw new Error(
      `Slate hyperscript must have both a start and an end defined for each <annotation> tag using the \`key=\` prop.`
    )
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
    value.selection = selectionChild
  } else if (Selection.isSelection(selection)) {
    value.selection = selection
  }

  return value
}
