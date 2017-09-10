
import Block from '../models/block'
import Document from '../models/document'
import Inline from '../models/inline'
import Mark from '../models/mark'
import Node from '../models/node'
import Selection from '../models/selection'
import State from '../models/state'
import Text from '../models/text'
import isEmpty from 'is-empty'
import isPlainObject from 'is-plain-object'

/**
 * Create selection point constants, for comparison by reference.
 *
 * @type {Object}
 */

const ANCHOR = {}
const CURSOR = {}
const FOCUS = {}

/**
 * The default Slate hyperscript creator functions.
 *
 * @type {Object}
 */

const CREATORS = {

  anchor(tagName, attributes, children) {
    return ANCHOR
  },

  block(tagName, attributes, children) {
    debugger
    return Block.create({
      ...attributes,
      nodes: createChildren(children),
    })
  },

  cursor(tagName, attributes, children) {
    return CURSOR
  },

  document(tagName, attributes, children) {
    return Document.create({
      ...attributes,
      nodes: createChildren(children),
    })
  },

  focus(tagName, attributes, children) {
    return FOCUS
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

  selection(tagName, attributes, children) {
    return Selection.create(attributes)
  },

  state(tagName, attributes, children) {
    const document = children.find(Document.isDocument)
    let selection = children.find(Selection.isSelection) || Selection.create()
    const props = {}

    // Search the document's texts to see if any of them have the anchor or
    // focus information saved, so we can set the selection.
    if (document) {
      document.getTexts().forEach((text) => {
        if (text.__anchor != null) {
          props.anchorKey = text.key
          props.anchorOffset = text.__anchor
          props.isFocused = true
        }

        if (text.__focus != null) {
          props.focusKey = text.key
          props.focusOffset = text.__focus
          props.isFocused = true
        }
      })
    }

    debugger

    if (
      (props.anchorKey && !props.focusKey) ||
      (!props.anchorKey && props.focusKey)
    ) {
      throw new Error(`Slate hyperscript must have both \`<anchor/>\` and \`<focus/>\` if one is used. For collapsed selections, use \`<cursor/>\`.`)
    }

    if (!isEmpty(props)) {
      selection = selection.merge(props)
    }

    const state = State.create({ document, selection })
    return state
  },

  text(tagName, attributes, children) {
    return Text.create({
      ...attributes,
      ranges: [{ text: children }],
    })
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
  let node = Text.create()

  // Create a helper to update the current node while preserving any stored
  // anchor or focus information.
  function setNode(next) {
    const { __anchor, __focus } = node
    if (__anchor != null) next.__anchor = __anchor
    if (__focus != null) next.__focus = __focus
    node = next
  }

  children.forEach((child) => {
    // If the child is a non-text node, push the current node and the new child
    // onto the array, then creating a new node for future selection tracking.
    if (Node.isNode(child) && !Text.isText(child)) {
      if (node.text.length) array.push(node)
      array.push(child)
      node = Text.create()
      length = 0
    }

    // If the child is a string insert it into the node.
    if (typeof child == 'string') {
      setNode(node.insertText(node.text.length, child, options.marks))
      length += child.length
    }

    // If the node is a `Text` add its text and marks to the existing node.
    if (Text.isText(child)) {
      const { __anchor, __focus } = child
      let i = node.text.length

      child.getRanges().forEach((range) => {
        let { marks } = range
        if (options.marks) marks = marks.union(options.marks)
        setNode(node.insertText(i, range.text, marks))
        i += range.text.length
      })

      if (__anchor != null) node.__anchor = __anchor + length
      if (__focus != null) node.__focus = __focus + length

      length += child.text.length
    }

    // If the child is a selection object store the current position.
    if (child == ANCHOR || child == CURSOR) node.__anchor = length
    if (child == FOCUS || child == CURSOR) node.__focus = length
  })

  // Make sure the most recent node is added.
  array.push(node)

  return array
}

/**
 * Resolve a set of hyperscript creators an `options` object.
 *
 * @param {Object} options
 * @return {Object}
 */

function resolveCreators(options) {
  const {
    blocks = {},
    inlines = {},
    marks = {},
  } = options

  const creators = {
    ...CREATORS,
    ...(options.creators || {}),
  }

  Object.keys(blocks).map((key) => {
    creators[key] = normalizeNode(key, blocks[key], 'block')
  })

  Object.keys(inlines).map((key) => {
    creators[key] = normalizeNode(key, inlines[key], 'inline')
  })

  Object.keys(marks).map((key) => {
    creators[key] = normalizeMark(key, marks[key])
  })

  return creators
}

/**
 * Normalize a node creator with `key` and `value`, of `kind`.
 *
 * @param {String} key
 * @param {Function|Object|String} value
 * @param {String} kind
 * @return {Function}
 */

function normalizeNode(key, value, kind) {
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
        kind,
        key: attrKey,
        data: {
          ...(value.data || {}),
          ...rest,
        }
      }

      return CREATORS[kind](tagName, attrs, children)
    }
  }

  throw new Error(`Slate hyperscript ${kind} creators can be either functions, objects or strings, but you passed: ${value}`)
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
        }
      }

      return CREATORS.mark(tagName, attrs, children)
    }
  }

  throw new Error(`Slate hyperscript mark creators can be either functions, objects or strings, but you passed: ${value}`)
}

/**
 * Export.
 *
 * @type {Function}
 */

export default createHyperscript()
export { createHyperscript }
