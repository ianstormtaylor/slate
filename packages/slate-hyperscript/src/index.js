import isPlainObject from 'is-plain-object'

import {
  Block,
  Document,
  Inline,
  Mark,
  Node,
  Point,
  Range,
  Text,
  Value,
} from 'slate'

/**
 * Point classes that can be created at different points in the document and
 * then searched for afterwards, for creating ranges.
 *
 * @type {Class}
 */

class CursorPoint {
  constructor() {
    this.offset = null
  }
}

class AnchorPoint {
  constructor(attrs = {}) {
    const { key = null, offset = null, path = null } = attrs
    this.key = key
    this.offset = offset
    this.path = path
  }
}

class FocusPoint {
  constructor(attrs = {}) {
    const { key = null, offset = null, path = null } = attrs
    this.key = key
    this.offset = offset
    this.path = path
  }
}

class DecorationPoint {
  constructor(attrs) {
    const { key = null, data = {}, marks } = attrs
    this.id = key
    this.offset = 0
    this.marks = marks
    this.attribs = data || {}
    this.isAtomic = !!this.attribs.atomic
    delete this.attribs.atomic
    return this
  }
  combine = focus => {
    if (!(focus instanceof DecorationPoint))
      throw new Error('misaligned decorations')
    return Range.create({
      anchor: {
        key: this.key,
        offset: this.offset,
      },
      focus: {
        key: focus.key,
        offset: focus.offset,
      },
      marks: this.marks,
      isAtomic: this.isAtomic,
      ...this.attribs,
    })
  }
}

/**
 * The default Slate hyperscript creator functions.
 *
 * @type {Object}
 */

const CREATORS = {
  anchor(tagName, attributes, children) {
    return new AnchorPoint(attributes)
  },

  block(tagName, attributes, children) {
    return Block.create({
      ...attributes,
      nodes: createChildren(children),
    })
  },

  cursor(tagName, attributes, children) {
    return new CursorPoint()
  },

  document(tagName, attributes, children) {
    return Document.create({
      ...attributes,
      nodes: createChildren(children),
    })
  },

  focus(tagName, attributes, children) {
    return new FocusPoint(attributes)
  },

  inline(tagName, attributes, children) {
    return Inline.create({
      ...attributes,
      nodes: createChildren(children),
    })
  },

  mark(tagName, attributes, children) {
    const marks = Mark.createSet([attributes])
    const nodes = createChildren(children, { marks })
    return nodes
  },

  decoration(tagName, attributes, children) {
    if (attributes.key) {
      return new DecorationPoint({
        ...attributes,
        marks: [{ type: tagName }],
      })
    }

    const nodes = createChildren(children)
    const node = nodes[0]
    const { __decorations = [] } = node
    const __decoration = {
      anchorOffset: 0,
      focusOffset: nodes.reduce((len, n) => len + n.text.length, 0),
      marks: [{ type: tagName }],
      isAtomic: !!attributes.data.atomic,
    }

    __decorations.push(__decoration)
    node.__decorations = __decorations
    return nodes
  },

  selection(tagName, attributes, children) {
    const anchor = children.find(c => c instanceof AnchorPoint)
    const focus = children.find(c => c instanceof FocusPoint)
    const selection = Range.create({
      ...attributes,
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
  },

  value(tagName, attributes, children) {
    const { data, normalize = true } = attributes
    const document = children.find(Document.isDocument)
    let selection = children.find(Range.isRange) || Range.create()
    let anchor
    let focus
    let decorations = []
    const partials = {}

    // Search the document's texts to see if any of them have the anchor or
    // focus information saved, or decorations applied.
    if (document) {
      document.getTexts().forEach(text => {
        if (text.__anchor != null) {
          anchor = Point.create({ key: text.key, offset: text.__anchor.offset })
        }

        if (text.__focus != null) {
          focus = Point.create({ key: text.key, offset: text.__focus.offset })
        }

        if (text.__decorations != null) {
          text.__decorations.forEach(dec => {
            const { id } = dec
            let range

            if (!id) {
              range = Range.create({
                anchor: {
                  key: text.key,
                  offset: dec.anchorOffset,
                },
                focus: {
                  key: text.key,
                  offset: dec.focusOffset,
                },
                marks: dec.marks,
                isAtomic: dec.isAtomic,
              })
            } else if (partials[id]) {
              const partial = partials[id]
              delete partials[id]

              range = Range.create({
                anchor: {
                  key: partial.key,
                  offset: partial.offset,
                },
                focus: {
                  key: text.key,
                  offset: dec.offset,
                },
                marks: partial.marks,
                isAtomic: partial.isAtomic,
              })
            } else {
              dec.key = text.key
              partials[id] = dec
            }

            if (range) {
              decorations.push(range)
            }
          })
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

    let value = Value.fromJSON({ data, document, selection }, { normalize })

    if (anchor || focus) {
      selection = selection.setPoints([anchor, focus])
      selection = selection.merge({ isFocused: true })
      selection = selection.normalize(value.document)
      value = value.set('selection', selection)
    }

    if (decorations.length > 0) {
      decorations = decorations.map(d => d.normalize(value.document))
      decorations = Range.createList(decorations)
      value = value.set('decorations', decorations)
    }

    return value
  },

  text(tagName, attributes, children) {
    const nodes = createChildren(children, { key: attributes.key })
    return nodes
  },
}

/**
 * Create a Slate hyperscript function with `options`.
 *
 * @param {Object} options
 * @return {Function}
 */

function createHyperscript(options = {}) {
  const creators = resolveCreators(options)

  function create(tagName, attributes, ...children) {
    const creator = creators[tagName]

    if (!creator) {
      throw new Error(`No hyperscript creator found for tag: "${tagName}"`)
    }

    if (attributes == null) {
      attributes = {}
    }

    if (!isPlainObject(attributes)) {
      children = [attributes].concat(children)
      attributes = {}
    }

    children = children
      .filter(child => Boolean(child))
      .reduce((memo, child) => memo.concat(child), [])

    const element = creator(tagName, attributes, children)
    return element
  }

  return create
}

/**
 * Create an array of `children`, storing selection anchor and focus.
 *
 * @param {Array} children
 * @param {Object} options
 * @return {Array}
 */

function createChildren(children, options = {}) {
  const array = []
  let length = 0

  // When creating the new node, try to preserve a key if one exists.
  const firstNodeOrText = children.find(c => typeof c !== 'string')
  const firstText = Text.isText(firstNodeOrText) ? firstNodeOrText : null
  const key = options.key ? options.key : firstText ? firstText.key : undefined
  let node = Text.create({ key, leaves: [{ text: '', marks: options.marks }] })

  // Create a helper to update the current node while preserving any stored
  // anchor or focus information.
  function setNode(next) {
    const { __anchor, __focus, __decorations } = node
    if (__anchor != null) next.__anchor = __anchor
    if (__focus != null) next.__focus = __focus
    if (__decorations != null) next.__decorations = __decorations
    node = next
  }

  children.forEach((child, index) => {
    const isLast = index === children.length - 1

    // If the child is a non-text node, push the current node and the new child
    // onto the array, then creating a new node for future selection tracking.
    if (Node.isNode(child) && !Text.isText(child)) {
      if (
        node.text.length ||
        node.__anchor != null ||
        node.__focus != null ||
        node.getMarksAtIndex(0).size
      ) {
        array.push(node)
      }

      array.push(child)

      node = isLast
        ? null
        : Text.create({ leaves: [{ text: '', marks: options.marks }] })

      length = 0
    }

    // If the child is a string insert it into the node.
    if (typeof child == 'string') {
      setNode(node.insertText(node.text.length, child, options.marks))
      length += child.length
    }

    // If the node is a `Text` add its text and marks to the existing node. If
    // the existing node is empty, and the `key` option wasn't set, preserve the
    // child's key when updating the node.
    if (Text.isText(child)) {
      const { __anchor, __focus, __decorations } = child
      let i = node.text.length

      if (!options.key && node.text.length == 0) {
        setNode(node.set('key', child.key))
      }

      child.getLeaves().forEach(leaf => {
        let { marks } = leaf
        if (options.marks) marks = marks.union(options.marks)
        setNode(node.insertText(i, leaf.text, marks))
        i += leaf.text.length
      })

      if (__anchor != null) {
        node.__anchor = new AnchorPoint()
        node.__anchor.offset = __anchor.offset + length
      }

      if (__focus != null) {
        node.__focus = new FocusPoint()
        node.__focus.offset = __focus.offset + length
      }

      if (__decorations != null) {
        __decorations.forEach(d => {
          if (d instanceof DecorationPoint) {
            d.offset += length
          } else {
            d.anchorOffset += length
            d.focusOffset += length
          }
        })

        node.__decorations = node.__decorations || []
        node.__decorations = node.__decorations.concat(__decorations)
      }

      length += child.text.length
    }

    if (child instanceof AnchorPoint || child instanceof CursorPoint) {
      child.offset = length
      node.__anchor = child
    }

    if (child instanceof FocusPoint || child instanceof CursorPoint) {
      child.offset = length
      node.__focus = child
    }

    if (child instanceof DecorationPoint) {
      child.offset = length
      node.__decorations = node.__decorations || []
      node.__decorations = node.__decorations.concat(child)
    }
  })

  // Make sure the most recent node is added.
  if (node != null) {
    array.push(node)
  }

  return array
}

/**
 * Resolve a set of hyperscript creators an `options` object.
 *
 * @param {Object} options
 * @return {Object}
 */

function resolveCreators(options) {
  const { blocks = {}, inlines = {}, marks = {}, decorations = {} } = options

  const creators = {
    ...CREATORS,
    ...(options.creators || {}),
  }

  Object.keys(blocks).map(key => {
    creators[key] = normalizeNode(key, blocks[key], 'block')
  })

  Object.keys(inlines).map(key => {
    creators[key] = normalizeNode(key, inlines[key], 'inline')
  })

  Object.keys(marks).map(key => {
    creators[key] = normalizeMark(key, marks[key])
  })

  Object.keys(decorations).map(key => {
    creators[key] = normalizeNode(key, decorations[key], 'decoration')
  })

  return creators
}

/**
 * Normalize a node creator with `key` and `value`, of `object`.
 *
 * @param {String} key
 * @param {Function|Object|String} value
 * @param {String} object
 * @return {Function}
 */

function normalizeNode(key, value, object) {
  if (typeof value == 'function') {
    return value
  }

  if (typeof value == 'string') {
    value = { type: value }
  }

  if (isPlainObject(value)) {
    return (tagName, attributes, children) => {
      const { key: attrKey, ...rest } = attributes
      const attrs = {
        ...value,
        object,
        key: attrKey,
        data: {
          ...(value.data || {}),
          ...rest,
        },
      }

      return CREATORS[object](tagName, attrs, children)
    }
  }

  throw new Error(
    `Slate hyperscript ${object} creators can be either functions, objects or strings, but you passed: ${value}`
  )
}

/**
 * Normalize a mark creator with `key` and `value`.
 *
 * @param {String} key
 * @param {Function|Object|String} value
 * @return {Function}
 */

function normalizeMark(key, value) {
  if (typeof value == 'function') {
    return value
  }

  if (typeof value == 'string') {
    value = { type: value }
  }

  if (isPlainObject(value)) {
    return (tagName, attributes, children) => {
      const attrs = {
        ...value,
        data: {
          ...(value.data || {}),
          ...attributes,
        },
      }

      return CREATORS.mark(tagName, attrs, children)
    }
  }

  throw new Error(
    `Slate hyperscript mark creators can be either functions, objects or strings, but you passed: ${value}`
  )
}

/**
 * Export.
 *
 * @type {Function}
 */

export default createHyperscript()
export { createHyperscript }
