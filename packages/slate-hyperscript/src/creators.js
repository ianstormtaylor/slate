import {
  Annotation,
  Document,
  Mark,
  Node,
  Point,
  Selection,
  Text,
  Value,
} from 'slate'

/**
 * Auto-incrementing ID to keep track of paired annotations.
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
  const block = createNode(null, attrs, children)
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
 * Create a annotation point, or wrap a list of leaves and set the annotation
 * point tracker on them.
 *
 * @param {String} tagName
 * @param {Object} attributes
 * @param {Array} children
 * @return {AnnotationPoint|List<Leaf>}
 */

export function createAnnotation(tagName, attributes, children) {
  const { key, data } = attributes
  const type = tagName

  if (key) {
    return new AnnotationPoint({ id: key, type, data })
  }

  const texts = createChildren(children)
  const first = texts.first()
  const last = texts.last()
  const id = `${uid++}`
  const start = new AnnotationPoint({ id, type, data })
  const end = new AnnotationPoint({ id, type, data })
  setPoint(first, start, 0)
  setPoint(last, end, last.text.length)
  return texts
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
  const document = createNode(null, attrs, children)
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
  const inline = createNode(null, attrs, children)
  return inline
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
  const { key, ...mark } = attributes
  const marks = Mark.createSet([mark])
  const list = createChildren(children)
  let node

  if (list.size > 1) {
    throw new Error(
      `The <mark> hyperscript tag must only contain a single node's worth of children.`
    )
  } else if (list.size === 0) {
    node = Text.create({ key, marks })
  } else {
    node = list.first()

    node = preservePoints(node, n => {
      if (key) n = n.set('key', key)
      if (marks) n = n.set('marks', n.marks.union(marks))
      return n
    })
  }

  return node
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
    const text = createText(null, attributes, children)
    return text
  }

  const nodes = createChildren(children)
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
  const { key, marks } = attributes
  const list = createChildren(children)
  let node

  if (list.size > 1) {
    throw new Error(
      `The <text> hyperscript tag must only contain a single node's worth of children.`
    )
  } else if (list.size === 0) {
    node = Text.create({ key })
  } else {
    node = list.first()

    node = preservePoints(node, n => {
      if (key) n = n.set('key', key)
      if (marks) n = n.set('marks', Mark.createSet(marks))
      return n
    })
  }

  return node
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
  let annotations = {}
  const partials = {}

  // Search the document's texts to see if any of them have the anchor or
  // focus information saved, or annotations applied.
  if (document) {
    for (const [node, path] of document.texts()) {
      const { __anchor, __annotations, __focus } = node

      if (__anchor != null) {
        anchor = Point.create({ path, key: node.key, offset: __anchor.offset })
        marks = __anchor.marks
        isFocused = __anchor.isFocused
      }

      if (__focus != null) {
        focus = Point.create({ path, key: node.key, offset: __focus.offset })
        marks = __focus.marks
        isFocused = __focus.isFocused
      }

      if (__annotations != null) {
        for (const ann of __annotations) {
          const { id } = ann
          const partial = partials[id]
          delete partials[id]

          if (!partial) {
            ann.key = node.key
            partials[id] = ann
            continue
          }

          const annotation = Annotation.create({
            key: id,
            type: ann.type,
            data: ann.data,
            anchor: {
              key: partial.key,
              path: document.getPath(partial.key),
              offset: partial.offset,
            },
            focus: {
              path,
              key: node.key,
              offset: ann.offset,
            },
          })

          annotations[id] = annotation
        }
      }
    }
  }

  if (Object.keys(partials).length > 0) {
    throw new Error(
      `Slate hyperscript must have both a start and an end defined for each annotation using the \`key=\` prop.`
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

  if (annotations.length > 0) {
    annotations = annotations.map(a => a.normalize(document))
  }

  const value = Value.fromJSON({
    data,
    annotations,
    document,
    selection,
    ...attributes,
  })

  return value
}

/**
 * Create a list of text nodes.
 *
 * @param {Array} children
 * @return {List<Leaf>}
 */

export function createChildren(children) {
  let nodes = Node.createList()

  const push = node => {
    const last = nodes.last()
    const isString = typeof node === 'string'

    if (last && last.__string && (isString || node.__string)) {
      const text = isString ? node : node.text
      const { length } = last.text
      const next = preservePoints(last, l => l.insertText(length, text))
      incrementPoints(node, length)
      copyPoints(node, next)
      next.__string = true
      nodes = nodes.pop().push(next)
    } else if (isString) {
      node = Text.create({ text: node })
      node.__string = true
      nodes = nodes.push(node)
    } else {
      nodes = nodes.push(node)
    }
  }

  children.forEach(child => {
    if (Node.isNodeList(child)) {
      child.forEach(c => push(c))
    }

    if (Node.isNode(child)) {
      push(child)
    }

    if (typeof child === 'string') {
      push(child)
    }

    if (isPoint(child)) {
      if (!nodes.size) {
        push('')
      }

      let last = nodes.last()

      if (last.object !== 'text') {
        push('')
        last = nodes.last()
      }

      if (!last || !last.__string) {
        push('')
        last = nodes.last()
      }

      setPoint(last, child, last.text.length)
    }
  })

  return nodes
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

class AnnotationPoint {
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

function incrementPoints(object, n) {
  const { __anchor, __focus, __annotations } = object

  if (__anchor != null) {
    __anchor.offset += n
  }

  if (__focus != null && __focus !== __anchor) {
    __focus.offset += n
  }

  if (__annotations != null) {
    __annotations.forEach(a => (a.offset += n))
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
    object instanceof AnnotationPoint ||
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

function preservePoints(object, updator) {
  const next = updator(object)
  copyPoints(object, next)
  return next
}

function copyPoints(object, other) {
  const { __anchor, __focus, __annotations } = object
  if (__anchor != null) other.__anchor = __anchor
  if (__focus != null) other.__focus = __focus
  if (__annotations != null) other.__annotations = __annotations
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

  if (point instanceof AnnotationPoint) {
    point.offset = offset
    object.__annotations = object.__annotations || []
    object.__annotations = object.__annotations.concat(point)
  }
}
