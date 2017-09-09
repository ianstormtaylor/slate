
import Block from '../models/block'
import Document from '../models/document'
import Inline from '../models/inline'
import Mark from '../models/mark'
import Node from '../models/node'
import Selection from '../models/selection'
import State from '../models/state'
import Text from '../models/text'
import isPlainObject from 'is-plain-object'

/**
 * The default Slate hyperscript creator functions.
 *
 * @type {Object}
 */

const DEFAULT_CREATORS = {

  block(tagName, attributes, children) {
    return Block.create({
      ...attributes,
      nodes: createTexts(children),
    })
  },

  document(tagName, attributes, children) {
    return Document.create({
      ...attributes,
      nodes: createTexts(children),
    })
  },

  inline(tagName, attributes, children) {
    return Inline.create({
      ...attributes,
      nodes: createTexts(children),
    })
  },

  mark(tagName, attributes, children) {
    const mark = Mark.create(attributes)
    let nodes = createTexts(children)
    nodes = nodes.map(node => node.addMark(0, node.text.length, mark))
    return nodes
  },

  selection(tagName, attributes, children) {
    return Selection.create(attributes)
  },

  state(tagName, attributes, children) {
    return State.create({
      document: children.find(c => Document.isDocument(c)),
      selection: children.find(c => Selection.isSelection(c)),
    })
  },

}

/**
 * Create a Slate hyperscript function.
 *
 * @param {Object} options
 * @return {Function}
 */

function createHyperscript(options = {}) {
  const creators = resolveCreators(options)

  function create(tagName, attributes, ...children) {
    if (attributes == null) {
      attributes = {}
    }

    if (!isPlainObject(attributes)) {
      children = [attributes].concat(children)
      attributes = {}
    }

    children = children.reduce((memo, child) => memo.concat(child), [])
    const creator = creators[tagName]

    if (!creator) {
      throw new Error(`No hyperscript creator found for tag "${tagName}"`)
    }

    const element = creator(tagName, attributes, children)
    return element
  }

  return create
}

/**
 * Turn all string `children` into text nodes.
 *
 * @param {Array} children
 * @return {Array}
 */

function createTexts(children) {
  return children.map(child => typeof child == 'string' ? Text.create(child) : child)
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
    ...DEFAULT_CREATORS,
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
      return Node.create({
        ...value,
        kind,
        key: attrKey,
        nodes: createTexts(children),
        data: {
          ...(value.data || {}),
          ...rest,
        }
      })
    }
  }

  throw new Error(`Hyperscript ${kind} creators can be either functions, objects or strings, but you passed: ${value}`)
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
      const mark = Mark.create({
        ...value,
        data: {
          ...(value.data || {}),
          ...attributes,
        }
      })

      let nodes = createTexts(children)
      nodes = nodes.map(node => node.addMark(0, node.text.length, mark))
      return nodes
    }
  }

  throw new Error(`Hyperscript mark creators can be either functions, objects or strings, but you passed: ${value}`)
}

/**
 * Export.
 *
 * @type {Function}
 */

export default createHyperscript()
export { createHyperscript }
