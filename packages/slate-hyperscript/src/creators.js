import {
  Decoration,
  Document,
  Leaf,
  Mark,
  Node,
  Point,
  Selection,
  Text,
  Value,
} from 'slate'

/**
 * Auto-incrementing ID to keep track of paired decorations.
 *
 * @type {Number}
 */

let uid = 0

/**
 * Create an anchor point.
 *
 * @param {String} tagName
 * @param {Object} attributes
 * @param {Array} children
 * @return {AnchorPoint}
 */

export function createAnchor(tagName, attributes, children) {
  return new AnchorPoint(attributes)
}

/**
 * Create a block.
 *
 * @param {String} tagName
 * @param {Object} attributes
 * @param {Array} children
 * @return {Block}
 */

export function createBlock(tagName, attributes, children) {
  const attrs = { ...attributes, object: 'block' }
  const block = createNode('node', attrs, children)
  return block
}

/**
 * Create a cursor point.
 *
 * @param {String} tagName
 * @param {Object} attributes
 * @param {Array} children
 * @return {CursorPoint}
 */

export function createCursor(tagName, attributes, children) {
  return new CursorPoint(attributes)
}

/**
 * Create a decoration point, or wrap a list of leaves and set the decoration
 * point tracker on them.
 *
 * @param {String} tagName
 * @param {Object} attributes
 * @param {Array} children
 * @return {DecorationPoint|List<Leaf>}
 */

export function createDecoration(tagName, attributes, children) {
  const { key, data } = attributes
  const type = tagName

  if (key) {
    return new DecorationPoint({ id: key, type, data })
  }

  const leaves = createLeaves('leaves', {}, children)
  const first = leaves.first()
  const last = leaves.last()
  const id = `__decoration_${uid++}__`
  const start = new DecorationPoint({ id, type, data })
  const end = new DecorationPoint({ id, type, data })
  setPoint(first, start, 0)
  setPoint(last, end, last.text.length)
  return leaves
}

/**
 * Create a document.
 *
 * @param {String} tagName
 * @param {Object} attributes
 * @param {Array} children
 * @return {Document}
 */

export function createDocument(tagName, attributes, children) {
  const attrs = { ...attributes, object: 'document' }
  const document = createNode('node', attrs, children)
  return document
}

/**
 * Create a focus point.
 *
 * @param {String} tagName
 * @param {Object} attributes
 * @param {Array} children
 * @return {FocusPoint}
 */

export function createFocus(tagName, attributes, children) {
  return new FocusPoint(attributes)
}

/**
 * Create an inline.
 *
 * @param {String} tagName
 * @param {Object} attributes
 * @param {Array} children
 * @return {Inline}
 */

export function createInline(tagName, attributes, children) {
  const attrs = { ...attributes, object: 'inline' }
  const inline = createNode('node', attrs, children)
  return inline
}

/**
 * Create a list of leaves.
 *
 * @param {String} tagName
 * @param {Object} attributes
 * @param {Array} children
 * @return {List<Leaf>}
 */

export function createLeaves(tagName, attributes, children) {
  const { marks = Mark.createSet() } = attributes
  let length = 0
  let leaves = Leaf.createList([])
  let leaf

  children.forEach(child => {
    if (Leaf.isLeafList(child)) {
      if (leaf) {
        leaves = leaves.push(leaf)
        leaf = null
      }

      child.forEach(l => {
        l = preservePoint(l, obj => obj.addMarks(marks))
        leaves = leaves.push(l)
      })
    } else {
      if (!leaf) {
        leaf = Leaf.create({ marks, text: '' })
        length = 0
      }

      if (typeof child === 'string') {
        const offset = leaf.text.length
        leaf = preservePoint(leaf, obj => obj.insertText(offset, child))
        length += child.length
      }

      if (isPoint(child)) {
        setPoint(leaf, child, length)
      }
    }
  })

  if (!leaves.size && !leaf) {
    leaf = Leaf.create({ marks, text: '' })
  }

  if (leaf) {
    leaves = leaves.push(leaf)
  }

  return leaves
}

/**
 * Create a list of leaves from a mark.
 *
 * @param {String} tagName
 * @param {Object} attributes
 * @param {Array} children
 * @return {List<Leaf>}
 */

export function createMark(tagName, attributes, children) {
  const marks = Mark.createSet([attributes])
  const leaves = createLeaves('leaves', { marks }, children)
  return leaves
}

/**
 * Create a node.
 *
 * @param {String} tagName
 * @param {Object} attributes
 * @param {Array} children
 * @return {Node}
 */

export function createNode(tagName, attributes, children) {
  const { object } = attributes

  if (object === 'text') {
    return createText('text', {}, children)
  }

  const nodes = []
  let others = []

  children.forEach(child => {
    if (Node.isNode(child)) {
      if (others.length) {
        const text = createText('text', {}, others)
        nodes.push(text)
      }

      nodes.push(child)
      others = []
    } else {
      others.push(child)
    }
  })

  if (others.length) {
    const text = createText('text', {}, others)
    nodes.push(text)
  }

  const node = Node.create({ ...attributes, nodes })
  return node
}

/**
 * Create a selection.
 *
 * @param {String} tagName
 * @param {Object} attributes
 * @param {Array} children
 * @return {Selection}
 */

export function createSelection(tagName, attributes, children) {
  const anchor = children.find(c => c instanceof AnchorPoint)
  const focus = children.find(c => c instanceof FocusPoint)
  const { marks, focused } = attributes
  const selection = Selection.create({
    marks,
    isFocused: focused,
    anchor: anchor && {
      key: anchor.key,
      offset: anchor.offset,
      path: anchor.path,
    },
    focus: focus && {
      key: focus.key,
      offset: focus.offset,
      path: focus.path,
    },
  })

  return selection
}

/**
 * Create a text node.
 *
 * @param {String} tagName
 * @param {Object} attributes
 * @param {Array} children
 * @return {Text}
 */

export function createText(tagName, attributes, children) {
  const { key } = attributes
  const leaves = createLeaves('leaves', {}, children)
  const text = Text.create({ key, leaves })
  let length = 0

  leaves.forEach(leaf => {
    incrementPoint(leaf, length)
    preservePoint(leaf, () => text)
    length += leaf.text.length
  })

  return text
}

/**
 * Create a value.
 *
 * @param {String} tagName
 * @param {Object} attributes
 * @param {Array} children
 * @return {Value}
 */

export function createValue(tagName, attributes, children) {
  const { data } = attributes
  const document = children.find(Document.isDocument)
  let selection = children.find(Selection.isSelection)
  let anchor
  let focus
  let marks
  let isFocused
  let decorations = []
  const partials = {}

  // Search the document's texts to see if any of them have the anchor or
  // focus information saved, or decorations applied.
  if (document) {
    document.getTexts().forEach(text => {
      const { __anchor, __decorations, __focus } = text

      if (__anchor != null) {
        anchor = Point.create({ key: text.key, offset: __anchor.offset })
        marks = __anchor.marks
        isFocused = __anchor.isFocused
      }

      if (__focus != null) {
        focus = Point.create({ key: text.key, offset: __focus.offset })
        marks = __focus.marks
        isFocused = __focus.isFocused
      }

      if (__decorations != null) {
        for (const dec of __decorations) {
          const { id } = dec
          const partial = partials[id]
          delete partials[id]

          if (!partial) {
            dec.key = text.key
            partials[id] = dec
            continue
          }

          const decoration = Decoration.create({
            anchor: {
              key: partial.key,
              offset: partial.offset,
            },
            focus: {
              key: text.key,
              offset: dec.offset,
            },
            mark: {
              type: dec.type,
              data: dec.data,
            },
          })

          decorations.push(decoration)
        }
      }
    })
  }

  if (Object.keys(partials).length > 0) {
    throw new Error(
      `Slate hyperscript must have both a start and an end defined for each decoration using the \`key=\` prop.`
    )
  }

  if (anchor && !focus) {
    throw new Error(
      `Slate hyperscript ranges must have both \`<anchor />\` and \`<focus />\` defined if one is defined, but you only defined \`<anchor />\`. For collapsed selections, use \`<cursor />\` instead.`
    )
  }

  if (!anchor && focus) {
    throw new Error(
      `Slate hyperscript ranges must have both \`<anchor />\` and \`<focus />\` defined if one is defined, but you only defined \`<focus />\`. For collapsed selections, use \`<cursor />\` instead.`
    )
  }

  if (anchor || focus) {
    if (!selection) {
      selection = Selection.create({ anchor, focus, isFocused, marks })
    } else {
      selection = selection.setPoints([anchor, focus])
    }
  } else if (!selection) {
    selection = Selection.create()
  }

  selection = selection.normalize(document)

  if (decorations.length > 0) {
    decorations = decorations.map(d => d.normalize(document))
  }

  const value = Value.fromJSON({
    data,
    decorations,
    document,
    selection,
    ...attributes,
  })

  return value
}

/**
 * Point classes that can be created at different points in the document and
 * then searched for afterwards, for creating ranges.
 *
 * @type {Class}
 */

class CursorPoint {
  constructor(attrs = {}) {
    const { isFocused = true, marks = null } = attrs
    this.isFocused = isFocused
    this.marks = marks
    this.offset = null
  }
}

class AnchorPoint {
  constructor(attrs = {}) {
    const {
      isFocused = true,
      key = null,
      marks = null,
      offset = null,
      path = null,
    } = attrs
    this.isFocused = isFocused
    this.key = key
    this.marks = marks
    this.offset = offset
    this.path = path
  }
}

class FocusPoint {
  constructor(attrs = {}) {
    const {
      isFocused = true,
      key = null,
      marks = null,
      offset = null,
      path = null,
    } = attrs
    this.isFocused = isFocused
    this.key = key
    this.marks = marks
    this.offset = offset
    this.path = path
  }
}

class DecorationPoint {
  constructor(attrs) {
    const { id = null, data = {}, type } = attrs
    this.id = id
    this.offset = null
    this.type = type
    this.data = data
  }
}

/**
 * Increment any existing `point` on object by `n`.
 *
 * @param {Any} object
 * @param {Number} n
 */

function incrementPoint(object, n) {
  const { __anchor, __focus, __decorations } = object

  if (__anchor != null) {
    __anchor.offset += n
  }

  if (__focus != null && __focus !== __anchor) {
    __focus.offset += n
  }

  if (__decorations != null) {
    __decorations.forEach(d => (d.offset += n))
  }
}

/**
 * Check whether an `object` is a point.
 *
 * @param {Any} object
 * @return {Boolean}
 */

function isPoint(object) {
  return (
    object instanceof AnchorPoint ||
    object instanceof CursorPoint ||
    object instanceof DecorationPoint ||
    object instanceof FocusPoint
  )
}

/**
 * Preserve any point information on an object.
 *
 * @param {Any} object
 * @param {Function} updator
 * @return {Any}
 */

function preservePoint(object, updator) {
  const { __anchor, __focus, __decorations } = object
  const next = updator(object)
  if (__anchor != null) next.__anchor = __anchor
  if (__focus != null) next.__focus = __focus
  if (__decorations != null) next.__decorations = __decorations
  return next
}

/**
 * Set a `point` on an `object`.
 *
 * @param {Any} object
 * @param {*Point} point
 * @param {Number} offset
 */

function setPoint(object, point, offset) {
  if (point instanceof AnchorPoint || point instanceof CursorPoint) {
    point.offset = offset
    object.__anchor = point
  }

  if (point instanceof FocusPoint || point instanceof CursorPoint) {
    point.offset = offset
    object.__focus = point
  }

  if (point instanceof DecorationPoint) {
    point.offset = offset
    object.__decorations = object.__decorations || []
    object.__decorations = object.__decorations.concat(point)
  }
}
