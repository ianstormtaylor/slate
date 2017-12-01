
import Debug from 'debug'
import isPlainObject from 'is-plain-object'
import mergeWith from 'lodash/mergeWith'
import { Record } from 'immutable'

import CORE_SCHEMA_RULES from '../constants/core-schema-rules'
import MODEL_TYPES from '../constants/model-types'
import Stack from './stack'
import memoize from '../utils/memoize'

/**
 * Validation failure reasons.
 *
 * @type {Object}
 */

const CHILD_KIND_INVALID = 'child_kind_invalid'
const CHILD_REQUIRED = 'child_required'
const CHILD_TYPE_INVALID = 'child_type_invalid'
const CHILD_UNKNOWN = 'child_unknown'
const FIRST_CHILD_KIND_INVALID = 'first_child_kind_invalid'
const FIRST_CHILD_TYPE_INVALID = 'first_child_type_invalid'
const LAST_CHILD_KIND_INVALID = 'last_child_kind_invalid'
const LAST_CHILD_TYPE_INVALID = 'last_child_type_invalid'
const NODE_DATA_INVALID = 'node_data_invalid'
const NODE_IS_VOID_INVALID = 'node_is_void_invalid'
const NODE_MARK_INVALID = 'node_mark_invalid'
const NODE_TEXT_INVALID = 'node_text_invalid'
const PARENT_KIND_INVALID = 'parent_kind_invalid'
const PARENT_TYPE_INVALID = 'parent_type_invalid'

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
  document: {},
  blocks: {},
  inlines: {},
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

    throw new Error(`\`Schema.create\` only accepts objects or schemas, but you passed it: ${attrs}`)
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

    if (object.rules) {
      throw new Error('Schemas in Slate have changed! They are no longer accept a `rules` property.')
    }

    if (object.nodes) {
      throw new Error('Schemas in Slate have changed! They are no longer accept a `nodes` property.')
    }

    if (!plugins) {
      plugins = [{ schema: object }]
    }

    const schema = resolveSchema(plugins)
    const stack = Stack.create({ plugins: [ ...CORE_SCHEMA_RULES, ...plugins ] })
    const ret = new Schema({ ...schema, stack })
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
   * Get the kind.
   *
   * @return {String}
   */

  get kind() {
    return 'schema'
  }

  /**
   * Get the rule for an `object`.
   *
   * @param {Mixed} object
   * @return {Object}
   */

  getRule(object) {
    switch (object.kind) {
      case 'document': return this.document
      case 'block': return this.blocks[object.type]
      case 'inline': return this.inlines[object.type]
    }
  }

  /**
   * Get a dictionary of the parent rule validations by child type.
   *
   * @return {Object|Null}
   */

  getParentRules() {
    const { blocks, inlines } = this
    const parents = {}

    for (const key in blocks) {
      const rule = blocks[key]
      if (rule.parent == null) continue
      parents[key] = rule
    }

    for (const key in inlines) {
      const rule = inlines[key]
      if (rule.parent == null) continue
      parents[key] = rule
    }

    return Object.keys(parents).length == 0 ? null : parents
  }

  /**
   * Fail validation by returning a normalizing change function.
   *
   * @param {String} reason
   * @param {Object} context
   * @return {Function}
   */

  fail(reason, context) {
    return (change) => {
      debug(`normalizing`, { reason, context })
      const { rule } = context
      const { size } = change.operations
      if (rule.normalize) rule.normalize(change, reason, context)
      if (change.operations.size > size) return
      this.normalize(change, reason, context)
    }
  }

  /**
   * Normalize an invalid value with `reason` and `context`.
   *
   * @param {Change} change
   * @param {String} reason
   * @param {Mixed} context
   */

  normalize(change, reason, context) {
    switch (reason) {
      case CHILD_KIND_INVALID:
      case CHILD_TYPE_INVALID:
      case CHILD_UNKNOWN:
      case FIRST_CHILD_KIND_INVALID:
      case FIRST_CHILD_TYPE_INVALID:
      case LAST_CHILD_KIND_INVALID:
      case LAST_CHILD_TYPE_INVALID: {
        const { child, node } = context
        return child.kind == 'text' && node.kind == 'block' && node.nodes.size == 1
          ? change.removeNodeByKey(node.key)
          : change.removeNodeByKey(child.key)
      }

      case CHILD_REQUIRED:
      case NODE_TEXT_INVALID:
      case PARENT_KIND_INVALID:
      case PARENT_TYPE_INVALID: {
        const { node } = context
        return node.kind == 'document'
          ? node.nodes.forEach(child => change.removeNodeByKey(child.key))
          : change.removeNodeByKey(node.key)
      }

      case NODE_DATA_INVALID: {
        const { node, key } = context
        return node.data.get(key) === undefined && node.kind != 'document'
          ? change.removeNodeByKey(node.key)
          : change.setNodeByKey(node.key, { data: node.data.delete(key) })
      }

      case NODE_IS_VOID_INVALID: {
        const { node } = context
        return change.setNodeByKey(node.key, { isVoid: !node.isVoid })
      }

      case NODE_MARK_INVALID: {
        const { node, mark } = context
        return node.getTexts().forEach(t => change.removeMarkByKey(t.key, 0, t.text.length, mark))
      }
    }
  }

  /**
   * Validate a `node` with the schema, returning a function that will fix the
   * invalid node, or void if the node is valid.
   *
   * @param {Node} node
   * @return {Function|Void}
   */

  validateNode(node) {
    const ret = this.stack.find('validateNode', node)
    if (ret) return ret

    if (node.kind == 'text') return

    const rule = this.getRule(node) || {}
    const parents = this.getParentRules()
    const ctx = { node, rule }

    if (rule.isVoid != null) {
      if (node.isVoid != rule.isVoid) {
        return this.fail(NODE_IS_VOID_INVALID, ctx)
      }
    }

    if (rule.data != null) {
      for (const key in rule.data) {
        const fn = rule.data[key]
        const value = node.data.get(key)

        if (!fn(value)) {
          return this.fail(NODE_DATA_INVALID, { ...ctx, key, value })
        }
      }
    }

    if (rule.marks != null) {
      const marks = node.getMarks().toArray()

      for (const mark of marks) {
        for (const def of rule.marks) {
          if (def.type != mark.type) {
            return this.fail(NODE_MARK_INVALID, { ...ctx, mark })
          }
        }
      }
    }

    if (rule.text != null) {
      const { text } = node

      if (!rule.text.test(text)) {
        return this.fail(NODE_TEXT_INVALID, { ...ctx, text })
      }
    }

    if (rule.first != null) {
      const { kinds, types } = rule.first
      const child = node.nodes.first()

      if (child && kinds && !kinds.includes(child.kind)) {
        return this.fail(FIRST_CHILD_KIND_INVALID, { ...ctx, child })
      }

      if (child && types && !types.includes(child.type)) {
        return this.fail(FIRST_CHILD_TYPE_INVALID, { ...ctx, child })
      }
    }

    if (rule.last != null) {
      const { kinds, types } = rule.last
      const child = node.nodes.last()

      if (child && kinds && !kinds.includes(child.kind)) {
        return this.fail(LAST_CHILD_KIND_INVALID, { ...ctx, child })
      }

      if (child && types && !types.includes(child.type)) {
        return this.fail(LAST_CHILD_TYPE_INVALID, { ...ctx, child })
      }
    }

    if (rule.nodes != null || parents != null) {
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

      if (rule.nodes != null) {
        nextDef()
      }

      while (nextChild()) {
        if (parents != null && child.kind != 'text' && child.type in parents) {
          const r = parents[child.type]

          if (r.parent.kinds != null && !r.parent.kinds.includes(node.kind)) {
            return this.fail(PARENT_KIND_INVALID, { node: child, parent: node, rule: r })
          }

          if (r.parent.types != null && !r.parent.types.includes(node.type)) {
            return this.fail(PARENT_TYPE_INVALID, { node: child, parent: node, rule: r })
          }
        }

        if (rule.nodes != null) {
          if (!def) {
            return this.fail(CHILD_UNKNOWN, { ...ctx, child, index })
          }

          if (def.kinds != null && !def.kinds.includes(child.kind)) {
            if (offset >= min && nextDef()) continue
            return this.fail(CHILD_KIND_INVALID, { ...ctx, child, index })
          }

          if (def.types != null && !def.types.includes(child.type)) {
            if (offset >= min && nextDef()) continue
            return this.fail(CHILD_TYPE_INVALID, { ...ctx, child, index })
          }
        }
      }

      if (rule.nodes != null) {
        while (min != null) {
          if (offset < min) {
            return this.fail(CHILD_REQUIRED, { ...ctx, index })
          }

          nextDef()
        }
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
      kind: this.kind,
      document: this.document,
      blocks: this.blocks,
      inlines: this.inlines,
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

function resolveSchema(plugins = []) {
  const schema = {
    document: {},
    blocks: {},
    inlines: {},
  }

  plugins.slice().reverse().forEach((plugin) => {
    if (!plugin.schema) return

    if (plugin.schema.rules) {
      throw new Error('Schemas in Slate have changed! They are no longer accept a `rules` property.')
    }

    if (plugin.schema.nodes) {
      throw new Error('Schemas in Slate have changed! They are no longer accept a `nodes` property.')
    }

    const { document = {}, blocks = {}, inlines = {}} = plugin.schema
    const d = resolveDocumentRule(document)
    const bs = {}
    const is = {}

    for (const key in blocks) {
      bs[key] = resolveNodeRule('block', key, blocks[key])
    }

    for (const key in inlines) {
      is[key] = resolveNodeRule('inline', key, inlines[key])
    }

    mergeWith(schema.document, d, customizer)
    mergeWith(schema.blocks, bs, customizer)
    mergeWith(schema.inlines, is, customizer)
  })

  return schema
}

/**
 * Resolve a document rule `obj`.
 *
 * @param {Object} obj
 * @return {Object}
 */

function resolveDocumentRule(obj) {
  return {
    data: {},
    nodes: null,
    ...obj,
  }
}

/**
 * Resolve a node rule with `type` from `obj`.
 *
 * @param {String} kind
 * @param {String} type
 * @param {Object} obj
 * @return {Object}
 */

function resolveNodeRule(kind, type, obj) {
  return {
    data: {},
    isVoid: null,
    nodes: null,
    first: null,
    last: null,
    parent: null,
    text: null,
    ...obj,
  }
}

/**
 * A Lodash customizer for merging schema definitions. Special cases `kinds`
 * and `types` arrays to be unioned, and ignores new `null` values.
 *
 * @param {Mixed} target
 * @param {Mixed} source
 * @return {Array|Void}
 */

function customizer(target, source, key) {
  if (key == 'kinds' || key == 'types') {
    return target == null ? source : target.concat(source)
  } else {
    return source == null ? target : source
  }
}

/**
 * Attach a pseudo-symbol for type checking.
 */

Schema.prototype[MODEL_TYPES.SCHEMA] = true

/**
 * Memoize read methods.
 */

memoize(Schema.prototype, [
  'getParentRules',
], {
  takesArguments: true,
})

/**
 * Export.
 *
 * @type {Schema}
 */

export default Schema
