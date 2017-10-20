
import isPlainObject from 'is-plain-object'
import logger from 'slate-dev-logger'
import { Record } from 'immutable'

import CORE_SCHEMA_RULES from '../constants/core-schema-rules'
import MODEL_TYPES from '../constants/model-types'
import Node from './node'
import Stack from './stack'

/**
 * Validation failure reasons.
 *
 * @type {Object}
 */

const REASONS = {
  NODE: {
    CHILD_INVALID: 'node_child_invalid',
    CHILD_REQUIRED: 'node_child_required',
    DATA_INVALID: 'node_data_invalid',
    DATA_REQUIRED: 'node_data_required',
    DATA_UNKNOWN: 'node_data_unknown',
    IS_VOID_INVALID: 'node_is_void_invalid',
  }
}

/**
 * Default properties.
 *
 * @type {Object}
 */

const DEFAULTS = {
  stack: Stack.create(),
  document: {},
  nodes: {},
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
      let { plugins } = attrs

      if (attrs.rules) {
        throw new Error('Schemas in Slate have changed! They are no longer accept a `rules` property.')
      }

      if (!plugins) {
        plugins = [{ schema: attrs }]
      }

      const rules = resolveRules(plugins)
      const stack = Stack.create({ plugins: [ ...CORE_SCHEMA_RULES, ...plugins ] })
      const schema = new Schema({ ...rules, stack })
      return schema
    }

    throw new Error(`\`Schema.create\` only accepts objects or schemas, but you passed it: ${attrs}`)
  }

  /**
   * Check if a `value` is a `Schema`.
   *
   * @param {Any} value
   * @return {Boolean}
   */

  static isSchema(value) {
    return !!(value && value[MODEL_TYPES.SCHEMA])
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
   * Get the rule for a `node`.
   *
   * @param {Node} node
   * @return {Object}
   */

  getRuleForNode(node) {
    return node.kind == 'document' ? this.document : this.nodes[node.type]
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

    const rule = this.getRuleForNode(node)
    if (!rule) return

    const fail = (reason, ...args) => {
      return (change) => {
        logger.debug(`Normalizing an invalid node...`, { reason, args })

        const count = change.operations.length
        if (rule.normalize) rule.normalize(change, node, ...args)
        if (change.operations.length > count) return

        this.normalizeNode(change, node, reason, ...args)
      }
    }

    const { kind, isVoid, nodes, data } = rule

    if (kind != null && kind != node.kind) {
      return fail(REASONS.NODE.KIND_INVALID)
    }

    if (isVoid != null && node.isVoid != isVoid) {
      return fail(REASONS.NODE.IS_VOID_INVALID)
    }

    if (data) {
      const d = node.data.toJSON()

      for (const key in data) {
        const v = d[key]
        const dataDef = typeof data[key] == 'function' ? { value: data[key] } : data[key]
        const { validate, required } = dataDef

        if (required && v == null) {
          return fail(REASONS.NODE.DATA_REQUIRED, key)
        }

        if (validate && !validate(v)) {
          return fail(REASONS.NODE.DATA_INVALID, key, v)
        }
      }

      for (const k in d) {
        if (!(k in data)) return fail(REASONS.NODE.DATA_UNKNOWN, k, d[k])
      }
    }

    if (nodes) {
      const children = node.nodes.toArray()
      let index = 0
      let start = 0
      let n

      for (let i = 0; i < nodes.length; i++) {
        const def = nodes[i]
        const { min = 0, max = Infinity } = def
        n = index - start
        start += min

        while (n < min && n < max) {
          const child = children[index]

          if (!child) {
            return fail(REASONS.NODE.CHILD_REQUIRED, index)
          }

          if (
            (def.kind != null && !def.kind.includes(child.kind)) ||
            (def.type != null && !def.type.includes(child.type))
          ) {
            if (n >= min) break
            return fail(REASONS.NODE.CHILD_INVALID, child, index)
          }

          n++
          index++
        }
      }
    }
  }

  /**
   * Normalize a `node` with `reason` and `rule`.
   *
   * @param {Change} change
   * @param {Node} node
   * @param {Object} rule
   * @param {String} reason
   * @param {Mixed} ...args
   */

  normalizeNode(change, node, reason, ...args) {
    const rule = this.getRuleForNode(node)
    if (!rule) return

    function insertDefaults() {
      const defaults = Node.createList(rule.defaults.nodes || [])
      node.nodes.forEach(child => change.removeNodeByKey(child.key, { normalize: false }))
      defaults.forEach((child, i) => change.insertNodeByKey(node.key, i, child))
      logger.debug('Normalized by replacing with defaults.', { node, defaults })
    }

    function removeNode() {
      if (node.kind == 'document') return insertDefaults()
      change.removeNodeByKey(node.key)
      logger.debug('Normalized by removing the node entirely.', { node })
    }

    function removeChild(child, opts) {
      change.removeNodeByKey(child.key, opts)
      logger.debug('Normalized by removing the child.', { node, child })
    }

    function setData(data) {
      change.setNodeByKey(node.key, { data })
      logger.debug('Normalized by setting data.', { node, data })
    }

    function setIsVoid(isVoid) {
      change.setNodeByKey(node.key, { isVoid })
      logger.debug('Normalized by setting is void.', { node, isVoid })
    }

    switch (reason) {
      case REASONS.NODE.IS_VOID_INVALID: {
        return setIsVoid(rule.isVoid)
      }

      case REASONS.NODE.DATA_INVALID:
      case REASONS.NODE.DATA_UNKNOWN: {
        const [ key ] = args
        const newData = node.data.delete(key)
        return setData(newData)
      }

      case REASONS.NODE.DATA_REQUIRED: {
        const [ key ] = args
        const defValue = rule.defaults.data[key]
        const newData = node.data.set(key, defValue)
        return defValue == null ? removeNode() : setData(newData)
      }

      case REASONS.NODE.CHILD_INVALID: {
        const [ child ] = args
        return node.nodes.size > 1 ? removeChild(child) : insertDefaults()
      }

      case REASONS.NODE.CHILD_REQUIRED: {
        return rule.defaults.nodes == null ? removeNode() : insertDefaults()
      }

      case REASONS.NODE.CHILD_UNKNOWN: {
        const [ child ] = args
        return removeChild(child)
      }
    }
  }

}

/**
 * Resolve a set of schema rules from an array of `plugins`.
 *
 * @param {Array} plugins
 * @return {Object}
 */

function resolveRules(plugins = []) {
  const schema = {
    document: {},
    nodes: {},
  }

  plugins.forEach((plugin) => {
    if (!plugin.schema) return

    if (plugin.schema.rules) {
      throw new Error('Schemas in Slate have changed! They are no longer accept a `rules` property.')
    }

    const document = resolveDocumentRule(plugin.schema.document || {})

    const nodes = Object.keys(plugin.schema.nodes || {}).reduce((memo, type) => {
      const obj = plugin.schema.nodes[type]
      memo[type] = resolveNodeRule(type, obj)
    }, {})

    Object.assign(schema.document, document)
    Object.assign(schema.nodes, nodes)
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
  const { data } = obj
  const defaults = { ...(obj.defaults || {}) }
  let nodes

  if (!defaults.data) {
    defaults.data = {}
  }

  if (obj.nodes) {
    nodes = typeof obj.nodes[0] == 'string'
      ? [{ type: obj.nodes }]
      : obj.nodes
  }

  return {
    nodes,
    data,
    defaults,
  }
}

/**
 * Resolve a node rule `obj` with `type`.
 *
 * @param {String} type
 * @param {Object} obj
 * @return {Object}
 */

function resolveNodeRule(type, obj) {
  if (typeof obj == 'function') {
    throw new Error('Schemas in Slate have changed! They are no longer used for rendering.')
  }

  const { data, kind, isVoid = false } = obj
  const defaults = { data: {}}
  let nodes

  if (!kind) {
    throw new Error('You must provide a `kind` property in node schema rules.')
  }

  if (obj.nodes) {
    nodes = typeof obj.nodes[0] == 'string'
      ? [{ type: obj.nodes }]
      : obj.nodes
  }

  else if (kind == 'block') {
    defaults.nodes = [{ kind: 'text' }]
    nodes = [{ kind: ['text', 'inline'], min: 1, max: Infinity }]
  }

  else if (kind == 'inline') {
    defaults.nodes = [{ kind: 'text' }]
    nodes = [{ kind: ['text'], min: 1, max: Infinity }]
  }

  return {
    kind,
    type,
    isVoid,
    nodes,
    data,
    defaults,
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
