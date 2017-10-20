
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

const NODE_CHILD_KIND_INVALID = 'node_child_kind_invalid'
const NODE_CHILD_TYPE_INVALID = 'node_child_type_invalid'
const NODE_CHILD_REQUIRED = 'node_child_required'
const NODE_CHILD_UNKNOWN = 'node_child_unknown'
const NODE_DATA_INVALID = 'node_data_invalid'
const NODE_DATA_REQUIRED = 'node_data_required'
const NODE_DATA_UNKNOWN = 'node_data_unknown'
const NODE_IS_VOID_INVALID = 'node_is_void_invalid'
const NODE_KIND_INVALID = 'node_kind_invalid'

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

  getRule(obj) {
    switch (obj.kind) {
      case 'document': return this.document
      case 'block':
      case 'inline': return this.nodes[obj.type]
    }
  }

  /**
   * Get the rule defaults for a `node`.
   *
   * @param {Node} node
   * @return {Object}
   */

  getDefaults(obj) {
    const rule = this.getRule(obj)
    if (!rule) return null
    return rule.defaults
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

    const rule = this.getRule(node)
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
      return fail(NODE_KIND_INVALID)
    }

    if (isVoid != null && node.isVoid != isVoid) {
      return fail(NODE_IS_VOID_INVALID)
    }

    if (data) {
      const d = node.data.toJSON()

      for (const key in data) {
        const v = d[key]
        const dataDef = typeof data[key] == 'function' ? { value: data[key] } : data[key]
        const { validate, required } = dataDef

        if (required && v == null) {
          return fail(NODE_DATA_REQUIRED, key)
        }

        if (validate && !validate(v)) {
          return fail(NODE_DATA_INVALID, key, v)
        }
      }

      for (const k in d) {
        if (!(k in data)) return fail(NODE_DATA_UNKNOWN, k, d[k])
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
            return fail(NODE_CHILD_REQUIRED, index)
          }

          if (def.kind != null && !def.kind.includes(child.kind)) {
            if (n >= min) break
            return fail(NODE_CHILD_KIND_INVALID, child, index)
          }

          if (def.type != null && !def.type.includes(child.type)) {
            if (n >= min) break
            return fail(NODE_CHILD_TYPE_INVALID, child, index)
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
    const rule = this.getRule(node)
    if (!rule) return

    function setNodeData(data) {
      change.setNodeByKey(node.key, { data })
      logger.debug('Normalized by setting `data`.', { node, data })
    }

    function setNodeIsVoid(isVoid) {
      change.setNodeByKey(node.key, { isVoid })
      logger.debug('Normalized by setting `isVoid`.', { node, isVoid })
    }

    function removeNode() {
      if (node.kind == 'document') return insertDefaults()
      change.removeNodeByKey(node.key)
      logger.debug('Normalized by removing the node entirely.', { node })
    }

    function insertDefaults() {
      const { nodes } = rule.defaults
      if (!nodes) return removeNode()
      const children = Node.createList(nodes || [])
      node.nodes.forEach(child => change.removeNodeByKey(child.key, { normalize: false }))
      children.forEach((child, i) => change.insertNodeByKey(node.key, i, child))
      logger.debug('Normalized by replacing with default children.', { node, children })
    }

    function insertDefaultChild(index) {
      const { nodes } = rule.defaults
      if (!nodes) return removeNode()
      const def = nodes[index]
      if (!def) return removeNode()
      const child = Node.create(def)
      change.insertNodeByKey(node.key, index, child)
      logger.debug('Normalized by insert a default child.', { node, index, child })
    }

    function fixChildKind(child, index) {
      const { nodes } = rule.defaults
      if (!nodes) return removeChild(child)
      const def = nodes[index]
      if (!def) return removeChild(child)
      const { kind } = def
      change.setNodeByKey(child.key, { kind })
      logger.debug('Normalized by changing child `kind`.', { node, child, kind })
    }

    function fixChildType(child, index) {
      const { nodes } = rule.defaults
      if (!nodes) return removeChild(child)
      const def = nodes[index]
      if (!def) return removeChild(child)
      const { type } = def
      change.setNodeByKey(child.key, { type })
      logger.debug('Normalized by changing child `type`.', { node, child, type })
    }

    function removeChild(child, opts) {
      change.removeNodeByKey(child.key, opts)
      logger.debug('Normalized by removing the child.', { node, child })
    }

    switch (reason) {
      case NODE_CHILD_KIND_INVALID: {
        const [ child, index ] = args
        return fixChildKind(child, index)
      }

      case NODE_CHILD_TYPE_INVALID: {
        const [ child, index ] = args
        return fixChildType(child, index)
      }
      case NODE_CHILD_REQUIRED: {
        const [ index ] = args
        return insertDefaultChild(index)
      }

      case NODE_CHILD_UNKNOWN: {
        const [ child ] = args
        return removeChild(child)
      }

      case NODE_DATA_INVALID: {
        const [ key ] = args
        const newData = node.data.delete(key)
        return setNodeData(newData)
      }

      case NODE_DATA_UNKNOWN: {
        const [ key ] = args
        const newData = node.data.delete(key)
        return setNodeData(newData)
      }

      case NODE_DATA_REQUIRED: {
        const [ key ] = args
        const defValue = rule.defaults.data[key]
        const newData = node.data.set(key, defValue)
        return defValue === undefined ? removeNode() : setNodeData(newData)
      }

      case NODE_IS_VOID_INVALID: {
        return setNodeIsVoid(rule.isVoid)
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
    blocks: {},
    inlines: {},
  }

  plugins.slice().reverse().forEach((plugin) => {
    if (!plugin.schema) return

    const {
      document = {},
      blocks = {},
      inlines = {},
      rules,
      nodes
    } = plugin.schema

    if (rules) {
      throw new Error('Schemas in Slate have changed! They are no longer accept a `rules` property.')
    }

    if (nodes) {
      throw new Error('Schemas in Slate have changed! They are no longer accept a `rules` property.')
    }

    const d = resolveDocumentRule(document)
    const bs = {}
    const is = {}

    for (const key in blocks) {
      bs[key] = resolveNodeRule('block', key, blocks[key])
    }

    for (const key in inlines) {
      is[key] = resolveNodeRule('inline', key, inlines[key])
    }

    Object.assign(schema.document, d)
    Object.assign(schema.blocks, bs)
    Object.assign(schema.inlines, is)
  })

  expandReferences(schema)
  return schema
}

/**
 * Resolve a document rule `obj`.
 *
 * @param {Object} obj
 * @return {Object}
 */

function resolveDocumentRule(obj) {
  let { data, nodes } = obj
  const kind = 'document'
  const defaults = {
    data: (obj.defaults && obj.defaults.data) || {},
    nodes: obj.defaults && obj.defaults.nodes,
  }

  if (nodes != null && typeof nodes[0] == 'string') {
    nodes = [{ type: nodes }]
  }

  const rule = {
    kind,
    data,
    defaults,
    nodes,
  }

  assertNodeRule(rule)
  return rule
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
  let { data, nodes, isVoid } = obj
  const defaults = {
    data: (obj.defaults && obj.defaults.data) || {},
    isVoid: (obj.defaults && obj.defaults.isVoid) || false,
    nodes: obj.defaults && obj.defaults.nodes,
  }

  if (nodes != null && typeof nodes[0] == 'string') {
    nodes = [{ type: nodes }]
  }

  if (data != null) {
    for (const key in data) {
      data[key].required = !!data[key].required
      if (typeof data[key] == 'function') data[key] = { validate: data[key] }
    }
  }

  const rule = {
    data,
    defaults,
    isVoid,
    kind,
    nodes,
    type,
  }

  assertNodeRule(rule)
  return rule
}

/**
 * Expand the references in a schema by type, for convenience.
 *
 * @param {Object} schema
 */

function expandReferences(schema) {
  const { document, blocks, inlines } = schema
  const nodes = []
    .concat(document)
    .concat(Object.keys(blocks).map(k => blocks[k]))
    .concat(Object.keys(inlines).map(k => inlines[k]))

  nodes.forEach((rule) => {
    const { defaults, kind, type } = rule

    if (kind != 'document') {
      if (blocks[type] && inlines[type]) {
        throw new Error(`A schema cannot have a block and an inline defined with the same type, in this case "${type}".`)
      }
    }

    if (defaults.nodes != null) {
      defaults.nodes = defaults.nodes.map((ref) => {
        if (typeof ref != 'string') return ref
        const node = blocks[ref] || inlines[ref]

        if (!node) {
          throw new Error(`A schema rule referenced a node with type "${ref}", but no node was defined.`)
        }

        return {
          kind: node.kind,
          type: node.type,
          isVoid: node.isVoid,
          data: node.defaults.data,
          nodes: node.defaults.nodes || [],
        }
      })
    }
  })
}

/**
 * Assert that a node `rule` is correctly formed.
 *
 * @param {Object} rule
 */

function assertNodeRule(rule) {
  const { data, defaults, kind, nodes, type } = rule

  if (kind == null) {
    throw new Error('You must provide a `kind` property in node schema rules.')
  }

  if (kind != 'document' && type == null) {
    throw new Error('You must provide a `type` property in node schema rules.')
  }

  if (nodes != null && defaults.nodes == null) {
    throw new Error('Schema rules that define validation for `nodes` must also include `defaults.nodes` to normalize with.')
  }

  if (data != null) {
    for (const key in data) {
      if (data[key].required == true && defaults.data[key] == null) {
        throw new Error('Schema rules that define required `data[key]` properties must also include a non-null `defaults.data[key]` for those properties to normalize with.')
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
