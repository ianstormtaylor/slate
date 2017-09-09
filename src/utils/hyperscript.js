
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

const DEFAULT_CREATORS = {

  anchor(tagName, attributes, children) {
    return ANCHOR
  },

  block(tagName, attributes, children) {
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
    const mark = Mark.create(attributes)
    let nodes = createChildren(children)
    nodes = nodes.map(node => node.addMark(0, node.text.length, mark))
    return nodes
  },

  selection(tagName, attributes, children) {
    return Selection.create(attributes)
  },

  state(tagName, attributes, children) {
    let state = State.create({
      document: children.find(c => Document.isDocument(c)),
      selection: children.find(c => Selection.isSelection(c)),
    })

    const { document } = state
    let { selection } = state
    const props = {}

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

    if (
      (props.anchorKey && !props.focusKey) ||
      (!props.anchorKey && props.focusKey)
    ) {
      throw new Error(`Hyperscript must have both \`<anchor/>\` and \`<focus/>\` if one is used. For collapsed selections, use \`<cursor/>\`.`)
    }

    if (!isEmpty(props)) {
      selection = selection.merge(props).normalize(document)
      state = state.set('selection', selection)
    }

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

    children = children
      .filter(child => !!child)
      .reduce((memo, child) => memo.concat(child), [])

    if (!creators[tagName]) {
      throw new Error(`No hyperscript creator found for tag "${tagName}"`)
    }

    const element = creators[tagName](tagName, attributes, children)
    return element
  }

  return create
}

/**
 * Create an array of `children`, storing selection anchor and focus.
 *
 * @param {Array} children
 * @return {Array}
 */

function createChildren(children) {
  const array = []
  let length = 0
  let node

  // Create a helper to update the current node while preserving any stored
  // anchor or focus information.
  function setNode(next) {
    if (next == null) next = Text.create()
    const prev = node
    if (prev && prev.__anchor) next.__anchor = prev.__anchor
    if (prev && prev.__focus) next.__focus = prev.__focus
    node = next
  }

  // Create an initial node, so that we're always able to attack anchor and
  // focus logic to something.
  setNode()

  children.forEach((child) => {
    // If the child is a non-text node, push the current node and the new child
    // onto the array, then creating a new node for future selection tracking.
    if (Node.isNode(child) && !Text.isText(child)) {
      array.push(node)
      array.push(child)
      setNode(null)
    }

    // If the child is a string insert it into the node.
    if (typeof child == 'string') {
      setNode(node.insertText(node.text.length, child))
    }

    // If the node is a `Text` add its text and marks to the existing node.
    if (Text.isText(child)) {
      let i = node.text.length

      child.ranges.forEach((range) => {
        setNode(node.insertText(i, range.text, range.marks))
        i += range.text.length
      })
    }

    // If the child is a selection object store the current position.
    if (child == ANCHOR || child == CURSOR) node.__anchor = length
    if (child == FOCUS || child == CURSOR) node.__focus = length

    // Increment the `length` for future selection tracking.
    length += node.text.length
  })

  // If there were no children added, push the existing one on, in case there
  // were any selection points processed.
  if (array.length == 0) {
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
        nodes: createChildren(children),
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

      let nodes = createChildren(children)
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
