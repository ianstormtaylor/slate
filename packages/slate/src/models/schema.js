import Debug from 'debug'
import isPlainObject from 'is-plain-object'
import logger from 'slate-dev-logger'
import { Record } from 'immutable'
import {
  CHILD_OBJECT_INVALID,
  CHILD_REQUIRED,
  CHILD_TYPE_INVALID,
  CHILD_UNKNOWN,
  FIRST_CHILD_OBJECT_INVALID,
  FIRST_CHILD_TYPE_INVALID,
  LAST_CHILD_OBJECT_INVALID,
  LAST_CHILD_TYPE_INVALID,
  NODE_DATA_INVALID,
  NODE_IS_VOID_INVALID,
  NODE_MARK_INVALID,
  NODE_OBJECT_INVALID,
  NODE_TEXT_INVALID,
  NODE_TYPE_INVALID,
  PARENT_OBJECT_INVALID,
  PARENT_TYPE_INVALID,
} from 'slate-schema-violations'

import CORE_SCHEMA_RULES from '../constants/core-schema-rules'
import MODEL_TYPES from '../constants/model-types'
import Stack from './stack'
import SlateError from '../utils/slate-error'

/**
 * Debug.
 *
 * @type {Function}
 */

const debug = Debug('slate:schema')

/**
 * Default properties.
 *
 * @type {Object}
 */

const DEFAULTS = {
  stack: Stack.create(),
  rules: [],
}

/**
 * Schema.
 *
 * @type {Schema}
 */

class Schema extends Record(DEFAULTS) {
  /**
   * Create a new `Schema` with `attrs`.
   *
   * @param {Object|Schema} attrs
   * @return {Schema}
   */

  static create(attrs = {}) {
    if (Schema.isSchema(attrs)) {
      return attrs
    }

    if (isPlainObject(attrs)) {
      return Schema.fromJSON(attrs)
    }

    throw new Error(
      `\`Schema.create\` only accepts objects or schemas, but you passed it: ${attrs}`
    )
  }

  /**
   * Create a `Schema` from a JSON `object`.
   *
   * @param {Object} object
   * @return {Schema}
   */

  static fromJSON(object) {
    if (Schema.isSchema(object)) {
      return object
    }

    let { plugins } = object

    if (!plugins) {
      plugins = [{ schema: object }]
    }

    const rules = resolveRules(plugins)
    const stack = Stack.create({ plugins: [...CORE_SCHEMA_RULES, ...plugins] })
    const ret = new Schema({ stack, rules })
    return ret
  }

  /**
   * Alias `fromJS`.
   */

  static fromJS = Schema.fromJSON

  /**
   * Check if `any` is a `Schema`.
   *
   * @param {Any} any
   * @return {Boolean}
   */

  static isSchema(any) {
    return !!(any && any[MODEL_TYPES.SCHEMA])
  }

  /**
   * Object.
   *
   * @return {String}
   */

  get object() {
    return 'schema'
  }

  get kind() {
    logger.deprecate(
      'slate@0.32.0',
      'The `kind` property of Slate objects has been renamed to `object`.'
    )
    return this.object
  }

  /**
   * Validate a `node` with the schema, returning an error if it's invalid.
   *
   * @param {Node} node
   * @return {Error|Void}
   */

  validateNode(node) {
    const rules = []
    const parentRules = []

    for (const rule of this.rules) {
      if (checkRules(node, rule.match)) {
        rules.push(rule)
      }

      if (rule.parent != null) {
        parentRules.push(rule)
      }
    }

    return validateRules(node, rules, parentRules)
  }

  /**
   * Check whether a `node` is valid against the schema.
   *
   * @param {Node} node
   * @return {Boolean}
   */

  checkNode(node) {
    const error = this.validateNode(node)
    return !error
  }

  /**
   * Assert that a `node` is valid against the schema.
   *
   * @param {Node} node
   * @throws
   */

  assertNode(node) {
    const error = this.validateNode(node)
    if (error) throw error
  }

  /**
   * Normalize a `node` with the schema, returning a function that will fix the
   * invalid node, or void if the node is valid.
   *
   * @param {Node} node
   * @return {Function|Void}
   */

  normalizeNode(node) {
    const ret = this.stack.find('normalizeNode', node)
    if (ret) return ret
    if (node.object == 'text') return

    const error = this.validateNode(node)
    if (!error) return

    return change => {
      debug(`normalizing`, { error })
      const { rule } = error
      const { size } = change.operations
      if (rule.normalize) rule.normalize(change, error)
      if (change.operations.size > size) return
      defaultNormalize(change, error)
    }
  }

  /**
   * Return a JSON representation of the schema.
   *
   * @return {Object}
   */

  toJSON() {
    const object = {
      object: this.object,
      rules: this.rules,
    }

    return object
  }

  /**
   * Alias `toJS`.
   */

  toJS() {
    return this.toJSON()
  }
}

/**
 * Resolve a set of schema rules from an array of `plugins`.
 *
 * @param {Array} plugins
 * @return {Object}
 */

function resolveRules(plugins = []) {
  let ret = []

  for (const plugin of plugins) {
    const { schema } = plugin
    if (!schema) continue

    const { document, blocks = {}, inlines = {}, rules = [] } = schema
    ret = [...ret, ...rules]

    if (document) {
      ret.push({
        match: [{ object: 'document' }],
        data: {},
        nodes: null,
        ...document,
      })
    }

    for (const key in blocks) {
      ret.push({
        match: [{ object: 'block', type: key }],
        data: {},
        isVoid: null,
        nodes: null,
        first: null,
        last: null,
        parent: null,
        text: null,
        ...blocks[key],
      })
    }

    for (const key in inlines) {
      ret.push({
        match: [{ object: 'inline', type: key }],
        data: {},
        isVoid: null,
        nodes: null,
        first: null,
        last: null,
        parent: null,
        text: null,
        ...inlines[key],
      })
    }
  }

  return ret
}

/**
 * Normalize an invalid value with `error` with default remedies.
 *
 * @param {Change} change
 * @param {SlateError} error
 */

function defaultNormalize(change, error) {
  switch (error.code) {
    case CHILD_OBJECT_INVALID:
    case CHILD_TYPE_INVALID:
    case CHILD_UNKNOWN:
    case FIRST_CHILD_OBJECT_INVALID:
    case FIRST_CHILD_TYPE_INVALID:
    case LAST_CHILD_OBJECT_INVALID:
    case LAST_CHILD_TYPE_INVALID: {
      const { child, node } = error
      return child.object == 'text' &&
        node.object == 'block' &&
        node.nodes.size == 1
        ? change.removeNodeByKey(node.key)
        : change.removeNodeByKey(child.key)
    }

    case CHILD_REQUIRED:
    case NODE_TEXT_INVALID:
    case PARENT_OBJECT_INVALID:
    case PARENT_TYPE_INVALID: {
      const { node } = error
      return node.object == 'document'
        ? node.nodes.forEach(child => change.removeNodeByKey(child.key))
        : change.removeNodeByKey(node.key)
    }

    case NODE_OBJECT_INVALID:
    case NODE_TYPE_INVALID: {
      const { node } = error
      return change.removeNodeByKey(node.key)
    }

    case NODE_DATA_INVALID: {
      const { node, key } = error
      return node.data.get(key) === undefined && node.object != 'document'
        ? change.removeNodeByKey(node.key)
        : change.setNodeByKey(node.key, { data: node.data.delete(key) })
    }

    case NODE_IS_VOID_INVALID: {
      const { node } = error
      return change.setNodeByKey(node.key, { isVoid: !node.isVoid })
    }

    case NODE_MARK_INVALID: {
      const { node, mark } = error
      return node
        .getTexts()
        .forEach(t => change.removeMarkByKey(t.key, 0, t.text.length, mark))
    }
  }
}

/**
 * Check that a `node` matches one of a set of `rules`.
 *
 * @param {Node} node
 * @param {Object|Function} rules
 * @return {Boolean}
 */

function checkRules(node, rules) {
  if (typeof rules === 'function') {
    return rules(node)
  }

  const error = validateRules(node, rules)
  return !error
}

/**
 * Validate that a `node` matches a `rule` object or array.
 *
 * @param {Node} node
 * @param {Object|Array} rule
 * @param {Array|Void} parentRules
 * @return {Error|Void}
 */

function validateRules(node, rule, parentRules = []) {
  if (Array.isArray(rule)) {
    if (!rule.length) {
      const error = validateRules(node, {}, parentRules)
      return error
    }

    let first

    for (const r of rule) {
      const error = validateRules(node, r, parentRules)
      if (!error) return
      first = first || error
    }

    return first
  }

  const ctx = { rule, node }

  if (rule.normalize) {
    ctx.normalize = rule.normalize
  }

  if (rule.object != null && node.object != rule.object) {
    return new SlateError(NODE_OBJECT_INVALID, { rule, node })
  }

  if (rule.type != null && node.type != rule.type) {
    return new SlateError(NODE_TYPE_INVALID, { rule, node })
  }

  if (rule.isVoid != null && node.isVoid != rule.isVoid) {
    return new SlateError(NODE_IS_VOID_INVALID, { rule, node })
  }

  if (rule.data != null && node.data) {
    for (const key in rule.data) {
      const fn = rule.data[key]
      const value = node.data && node.data.get(key)
      const valid = typeof fn === 'function' ? fn(value) : fn === value

      if (!valid || !node.data) {
        return new SlateError(NODE_DATA_INVALID, { rule, node, key, value })
      }
    }
  }

  if (rule.marks != null) {
    const marks = node.getMarks().toArray()

    for (const mark of marks) {
      if (!rule.marks.some(def => def.type === mark.type)) {
        return new SlateError(NODE_MARK_INVALID, { rule, node, mark })
      }
    }
  }

  if (rule.text != null) {
    const { text } = node

    if (!rule.text.test(text)) {
      return new SlateError(NODE_TEXT_INVALID, { rule, node, text })
    }
  }

  if (rule.first != null) {
    const first = node.nodes.first()
    const error = validateRules(first, rule.first)

    if (error) {
      error.rule = rule
      error.node = node
      error.child = first
      error.code = error.code.replace('node_', 'first_child_')
      return error
    }
  }

  if (rule.last != null) {
    const last = node.nodes.last()
    const error = validateRules(last, rule.last)

    if (error) {
      error.rule = rule
      error.node = node
      error.child = last
      error.code = error.code.replace('node_', 'last_child_')
      return error
    }
  }

  if (rule.nodes != null || (parentRules.length != 0 && node.nodes)) {
    const children = node.nodes.toArray()
    const defs = rule.nodes != null ? rule.nodes.slice() : []

    let offset
    let min
    let index
    let def
    let max
    let child

    function nextDef() {
      offset = offset == null ? null : 0
      def = defs.shift()
      min = def && (def.min == null ? 0 : def.min)
      max = def && (def.max == null ? Infinity : def.max)
      return !!def
    }

    function nextChild() {
      index = index == null ? 0 : index + 1
      offset = offset == null ? 0 : offset + 1
      child = children[index]
      if (max != null && offset == max) nextDef()
      return !!child
    }

    function rewind() {
      offset -= 1
      index -= 1
    }

    if (rule.nodes != null) {
      nextDef()
    }

    while (nextChild()) {
      if (parentRules.length != 0) {
        for (const r of parentRules) {
          if (!checkRules(child, r.match)) continue

          const error = validateRules(node, r.parent)

          if (error) {
            error.rule = r
            error.parent = node
            error.node = child
            error.code = error.code.replace('node_', 'parent_')
            return error
          }
        }
      }

      if (rule.nodes != null) {
        if (!def) {
          return new SlateError(CHILD_UNKNOWN, { ...ctx, child, index })
        }

        const error = validateRules(child, def.match)

        if (error && offset >= min && nextDef()) {
          rewind()
          continue
        }

        if (error) {
          error.rule = rule
          error.node = node
          error.child = child
          error.index = index
          error.code = error.code.replace('node_', 'child_')
          return error
        }
      }
    }

    if (rule.nodes != null) {
      while (min != null) {
        if (offset < min) {
          return new SlateError(CHILD_REQUIRED, { ...ctx, index })
        }

        nextDef()
      }
    }
  }
}

/**
 * Attach a pseudo-symbol for type checking.
 */

Schema.prototype[MODEL_TYPES.SCHEMA] = true

/**
 * Export.
 *
 * @type {Schema}
 */

export default Schema
