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

import MODEL_TYPES from '../constants/model-types'
import Stack from './stack'
import Text from './text'
import SlateError from '../utils/slate-error'

/**
 * Debug.
 *
 * @type {Function}
 */

const debug = Debug('slate:schema')

/**
 * Define the core schema rules, order-sensitive.
 *
 * @type {Array}
 */

const CORE_RULES = [
  // Only allow block nodes in documents.
  {
    match: { object: 'document' },
    nodes: [
      {
        match: { object: 'block' },
      },
    ],
  },

  // Only allow block nodes or inline and text nodes in blocks.
  {
    match: {
      object: 'block',
      first: { object: 'block' },
    },
    nodes: [
      {
        match: { object: 'block' },
      },
    ],
  },
  {
    match: {
      object: 'block',
      first: [{ object: 'inline' }, { object: 'text' }],
    },
    nodes: [
      {
        match: [{ object: 'inline' }, { object: 'text' }],
      },
    ],
  },

  // Only allow inline and text nodes in inlines.
  {
    match: { object: 'inline' },
    nodes: [{ match: [{ object: 'inline' }, { object: 'text' }] }],
  },

  // Ensure that block and inline nodes have at least one text child.
  {
    match: [{ object: 'block' }, { object: 'inline' }],
    nodes: [{ min: 1 }],
    normalize: (change, error) => {
      const { code, node } = error
      if (code !== 'child_required') return
      change.insertNodeByKey(node.key, 0, Text.create(), { normalize: false })
    },
  },

  // Ensure that inline non-void nodes are never empty.
  {
    match: {
      object: 'inline',
      isVoid: false,
      nodes: [{ match: { object: 'text' } }],
    },
    text: /[\w\W]+/,
  },

  // Ensure that inline void nodes are surrounded by text nodes.
  {
    match: { object: 'block' },
    first: [{ object: 'block' }, { object: 'text' }],
    last: [{ object: 'block' }, { object: 'text' }],
    normalize: (change, error) => {
      const { code, node } = error
      const text = Text.create()
      let i

      if (code === 'first_child_object_invalid') {
        i = 0
      } else if (code === 'last_child_object_invalid') {
        i = node.nodes.size
      } else {
        return
      }

      change.insertNodeByKey(node.key, i, text, { normalize: false })
    },
  },
  {
    match: { object: 'inline' },
    first: [{ object: 'block' }, { object: 'text' }],
    last: [{ object: 'block' }, { object: 'text' }],
    previous: [{ object: 'block' }, { object: 'text' }],
    next: [{ object: 'block' }, { object: 'text' }],
    normalize: (change, error) => {
      const { code, node, index } = error
      const text = Text.create()
      let i

      if (code === 'first_child_object_invalid') {
        i = 0
      } else if (code === 'last_child_object_invalid') {
        i = node.nodes.size
      } else if (code === 'previous_sibling_object_invalid') {
        i = index
      } else if (code === 'next_sibling_object_invalid') {
        i = index + 1
      } else {
        return
      }

      change.insertNodeByKey(node.key, i, text, { normalize: false })
    },
  },

  // Merge adjacent text nodes.
  {
    match: { object: 'text' },
    next: [{ object: 'block' }, { object: 'inline' }],
    normalize: (change, error) => {
      const { code, next } = error
      if (code !== 'next_sibling_object_invalid') return
      change.mergeNodeByKey(next.key, { normalize: false })
    },
  },
]

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

    const plugins = object.plugins ? object.plugins : [{ schema: object }]
    let rules = [...CORE_RULES]

    for (const plugin of plugins) {
      const { schema = {} } = plugin
      const { blocks = {}, inlines = {} } = schema

      if (schema.rules) {
        rules = rules.concat(schema.rules)
      }

      if (schema.document) {
        rules.push({
          match: [{ object: 'document' }],
          ...schema.document,
        })
      }

      for (const key in blocks) {
        rules.push({
          match: [{ object: 'block', type: key }],
          ...blocks[key],
        })
      }

      for (const key in inlines) {
        rules.push({
          match: [{ object: 'inline', type: key }],
          ...inlines[key],
        })
      }
    }

    const stack = Stack.create({ plugins })
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
    const rules = this.rules.filter(r => testRules(node, r.match))
    const failure = validateRules(node, rules, this.rules, { every: true })
    if (!failure) return
    const error = new SlateError(failure.code, failure)
    return error
  }

  /**
   * Test whether a `node` is valid against the schema.
   *
   * @param {Node} node
   * @return {Boolean}
   */

  testNode(node) {
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

      // First run the user-provided `normalize` function if one exists...
      if (rule.normalize) {
        rule.normalize(change, error)
      }

      // If the `normalize` function did not add any operations to the change
      // object, it can't have normalized, so run the default one.
      if (change.operations.size === size) {
        defaultNormalize(change, error)
      }
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

    default: {
      const { node } = error
      return change.removeNodeByKey(node.key)
    }
  }
}

/**
 * Check that a `node` matches one of a set of `rules`.
 *
 * @param {Node} node
 * @param {Object|Array} rules
 * @return {Boolean}
 */

function testRules(node, rules) {
  const error = validateRules(node, rules)
  return !error
}

/**
 * Validate that a `node` matches a `rule` object or array.
 *
 * @param {Node} node
 * @param {Object|Array} rule
 * @param {Array|Void} rules
 * @return {Error|Void}
 */

function validateRules(node, rule, rules, options = {}) {
  const { every = false } = options

  if (Array.isArray(rule)) {
    const array = rule.length ? rule : [{}]
    let first

    for (const r of array) {
      const error = validateRules(node, r, rules)
      first = first || error
      if (every && error) return error
      if (!every && !error) return
    }

    return first
  }

  const error =
    validateObject(node, rule) ||
    validateType(node, rule) ||
    validateIsVoid(node, rule) ||
    validateData(node, rule) ||
    validateMarks(node, rule) ||
    validateText(node, rule) ||
    validateFirst(node, rule) ||
    validateLast(node, rule) ||
    validateNodes(node, rule, rules)

  return error
}

function validateObject(node, rule) {
  if (rule.objects) {
    logger.warn(
      'The `objects` schema validation rule was changed. Please use the new `match` syntax with `object`.'
    )
  }

  if (rule.object == null) return
  if (rule.object === node.object) return
  return fail(NODE_OBJECT_INVALID, { rule, node })
}

function validateType(node, rule) {
  if (rule.types) {
    logger.warn(
      'The `types` schema validation rule was changed. Please use the new `match` syntax with `type`.'
    )
  }

  if (rule.type == null) return
  if (rule.type === node.type) return
  return fail(NODE_TYPE_INVALID, { rule, node })
}

function validateIsVoid(node, rule) {
  if (rule.isVoid == null) return
  if (rule.isVoid === node.isVoid) return
  return fail(NODE_IS_VOID_INVALID, { rule, node })
}

function validateData(node, rule) {
  if (rule.data == null) return
  if (node.data == null) return

  for (const key in rule.data) {
    const fn = rule.data[key]
    const value = node.data && node.data.get(key)
    const valid = typeof fn === 'function' ? fn(value) : fn === value
    if (valid) continue
    return fail(NODE_DATA_INVALID, { rule, node, key, value })
  }
}

function validateMarks(node, rule) {
  if (rule.marks == null) return
  const marks = node.getMarks().toArray()

  for (const mark of marks) {
    const valid = rule.marks.some(def => def.type === mark.type)
    if (valid) continue
    return fail(NODE_MARK_INVALID, { rule, node, mark })
  }
}

function validateText(node, rule) {
  if (rule.text == null) return
  const { text } = node
  const valid = rule.text.test(text)
  if (valid) return
  return fail(NODE_TEXT_INVALID, { rule, node, text })
}

function validateFirst(node, rule) {
  if (rule.first == null) return
  const first = node.nodes.first()
  if (!first) return
  const error = validateRules(first, rule.first)
  if (!error) return
  error.rule = rule
  error.node = node
  error.child = first
  error.code = error.code.replace('node_', 'first_child_')
  return error
}

function validateLast(node, rule) {
  if (rule.last == null) return
  const last = node.nodes.last()
  if (!last) return
  const error = validateRules(last, rule.last)
  if (!error) return
  error.rule = rule
  error.node = node
  error.child = last
  error.code = error.code.replace('node_', 'last_child_')
  return error
}

function validateNodes(node, rule, rules = []) {
  if (node.nodes == null) return

  const children = node.nodes.toArray()
  const defs = rule.nodes != null ? rule.nodes.slice() : []
  let offset
  let min
  let index
  let def
  let max
  let child
  let previous
  let next

  function nextDef() {
    offset = offset == null ? null : 0
    def = defs.shift()
    min = def && def.min
    max = def && def.max
    return !!def
  }

  function nextChild() {
    index = index == null ? 0 : index + 1
    offset = offset == null ? 0 : offset + 1
    previous = child
    child = children[index]
    next = children[index + 1]
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
    const err =
      validateParent(node, child, rules) ||
      validatePrevious(node, child, previous, index, rules) ||
      validateNext(node, child, next, index, rules)

    if (err) return err

    if (rule.nodes != null) {
      if (!def) {
        return fail(CHILD_UNKNOWN, { rule, node, child, index })
      }

      if (def) {
        if (def.objects) {
          logger.warn(
            'The `objects` schema validation rule was changed. Please use the new `match` syntax with `object`.'
          )
        }

        if (def.types) {
          logger.warn(
            'The `types` schema validation rule was changed. Please use the new `match` syntax with `type`.'
          )
        }
      }

      if (def.match) {
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
  }

  if (rule.nodes != null) {
    while (min != null) {
      if (offset < min) {
        return fail(CHILD_REQUIRED, { rule, node, index })
      }

      nextDef()
    }
  }
}

function validateParent(node, child, rules) {
  for (const rule of rules) {
    if (rule.parent == null) continue
    if (!testRules(child, rule.match)) continue

    const error = validateRules(node, rule.parent)
    if (!error) continue

    error.rule = rule
    error.parent = node
    error.node = child
    error.code = error.code.replace('node_', 'parent_')
    return error
  }
}

function validatePrevious(node, child, previous, index, rules) {
  if (!previous) return

  for (const rule of rules) {
    if (rule.previous == null) continue
    if (!testRules(child, rule.match)) continue

    const error = validateRules(previous, rule.previous)
    if (!error) continue

    error.rule = rule
    error.node = node
    error.child = child
    error.index = index
    error.previous = previous
    error.code = error.code.replace('node_', 'previous_sibling_')
    return error
  }
}

function validateNext(node, child, next, index, rules) {
  if (!next) return

  for (const rule of rules) {
    if (rule.next == null) continue
    if (!testRules(child, rule.match)) continue

    const error = validateRules(next, rule.next)
    if (!error) continue

    error.rule = rule
    error.node = node
    error.child = child
    error.index = index
    error.next = next
    error.code = error.code.replace('node_', 'next_sibling_')
    return error
  }
}

/**
 * Create an interim failure object with `code` and `attrs`.
 *
 * @param {String} code
 * @param {Object} attrs
 * @return {Object}
 */

function fail(code, attrs) {
  return { code, ...attrs }
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
