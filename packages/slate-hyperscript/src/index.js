import isPlainObject from 'is-plain-object'

import {
  createAnchor,
  createBlock,
  createCursor,
  createDecoration,
  createDocument,
  createFocus,
  createInline,
  createMark,
  createNode,
  createSelection,
  createText,
  createValue,
} from './creators'

/**
 * Create a Slate hyperscript function with `options`.
 *
 * @param {Object} options
 * @return {Function}
 */

function createHyperscript(options = {}) {
  const { blocks = {}, inlines = {}, marks = {}, decorations = {} } = options

  const creators = {
    anchor: createAnchor,
    block: createBlock,
    cursor: createCursor,
    decoration: createDecoration,
    document: createDocument,
    focus: createFocus,
    inline: createInline,
    mark: createMark,
    node: createNode,
    selection: createSelection,
    text: createText,
    value: createValue,
    ...(options.creators || {}),
  }

  for (const key in blocks) {
    creators[key] = normalizeCreator(blocks[key], createBlock)
  }

  for (const key in inlines) {
    creators[key] = normalizeCreator(inlines[key], createInline)
  }

  for (const key in marks) {
    creators[key] = normalizeCreator(marks[key], createMark)
  }

  for (const key in decorations) {
    creators[key] = normalizeCreator(decorations[key], createDecoration)
  }

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

    const ret = creator(tagName, attributes, children)
    return ret
  }

  return create
}

/**
 * Normalize a `creator` of `value`.
 *
 * @param {Function|Object|String} value
 * @param {Function} creator
 * @return {Function}
 */

function normalizeCreator(value, creator) {
  if (typeof value == 'function') {
    return value
  }

  if (typeof value == 'string') {
    value = { type: value }
  }

  if (isPlainObject(value)) {
    return (tagName, attributes, children) => {
      const { key, ...rest } = attributes
      const attrs = {
        ...value,
        key,
        data: {
          ...(value.data || {}),
          ...rest,
        },
      }

      return creator(tagName, attrs, children)
    }
  }

  throw new Error(
    `Slate hyperscript creators can be either functions, objects or strings, but you passed: ${value}`
  )
}

/**
 * Export.
 *
 * @type {Function}
 */

export default createHyperscript()
export { createHyperscript }
