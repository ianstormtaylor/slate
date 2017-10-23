
import isPlainObject from 'is-plain-object'
import logger from 'slate-dev-logger'
import { Record } from 'immutable'

import CORE_SCHEMA_RULES from '../constants/core-schema-rules'
import MODEL_TYPES from '../constants/model-types'
import Node from './node'
import Stack from './stack'
import Text from './text'
import memoize from '../utils/memoize'

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
const NODE_IS_VOID_INVALID = 'node_is_void_invalid'
const NODE_KIND_INVALID = 'node_kind_invalid'
const NODE_MARK_INVALID = 'node_mark_invalid'
const NODE_PARENT_KIND_INVALID = 'node_parent_kind_invalid'
const NODE_PARENT_TYPE_INVALID = 'node_parent_type_invalid'
const NODE_TEXT_INVALID = 'node_text_invalid'

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

      if (attrs.nodes) {
        throw new Error('Schemas in Slate have changed! They are no longer accept a `nodes` property.')
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
   * Get the rule for an `object`.
   *
   * @param {Mixed} object
   * @return {Object}
   */

  getRule(object) {
    switch (object.kind) {
      case 'document':
        return this.document
      case 'block':
      case 'inline':
        return this.nodes[object.type]
    }
  }

  /**
   * Get the rule defaults for an `object`.
   *
   * @param {Object} object
   * @return {Object}
   */

  getDefaults(object) {
    const rule = this.getRule(object)
    if (!rule) return null
    return rule.defaults
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
      if (rule.parent == null) return
      parents[key] = rule
    }

    for (const key in inlines) {
      const rule = inlines[key]
      if (rule.parent == null) return
      parents[key] = rule
    }

    return Object.keys(parents) == 0 ? null : parents
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

    const fail = (reason, context) => {
      return (change) => {
        logger.debug(`Normalizing an invalid node...`, { reason, context })

        const count = change.operations.length
        if (rule.normalize) rule.normalize(change, node, reason, context)
        if (change.operations.length > count) return

        this.normalizeNode(change, node, reason, context)
      }
    }

    const { kind, isVoid, marks, nodes, data, text } = rule
    const parents = this.getParentRules()

    if (kind != null && kind != node.kind) {
      return fail(NODE_KIND_INVALID)
    }

    if (isVoid != null && node.isVoid != isVoid) {
      return fail(NODE_IS_VOID_INVALID)
    }

    if (data != null) {
      const d = node.data.toJSON()

      for (const key in data) {
        const v = d[key]
        const fn = data[key]

        if (!fn(v)) {
          return fail(NODE_DATA_INVALID, { key, value: v })
        }
      }
    }

    if (nodes != null) {
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
            return fail(NODE_CHILD_REQUIRED, { index })
          }

          if (def.kind != null && !def.kind.includes(child.kind)) {
            if (n >= min) break
            return fail(NODE_CHILD_KIND_INVALID, { child, index })
          }

          if (def.type != null && !def.type.includes(child.type)) {
            if (n >= min) break
            return fail(NODE_CHILD_TYPE_INVALID, { child, index })
          }

          n++
          index++
        }
      }
    }

    if (marks != null) {
      const ms = node.getMarks()

      for (const m of ms) {
        const isAllowed = marks.some(def => def.type == m.type)

        if (!isAllowed) {
          return fail(NODE_MARK_INVALID, { mark: m })
        }
      }
    }

    if (text != null) {
      const string = node.text

      if (typeof text == 'string' && string != text) {
        return fail(NODE_TEXT_INVALID, { text: string })
      }

      if (text instanceof RegExp && !text.test(string)) {
        return fail(NODE_TEXT_INVALID, { text: string })
      }
    }

    if (parents != null) {
      const children = node.nodes.toArray()

      for (let i = 0; i < children.length; i++) {
        const child = children[i]
        if (child.kind == 'text') continue
        const r = parents[child.type]
        if (!r) continue

        if (r.parent.kind != null && !r.parent.kind.includes(node.kind)) {
          return fail(NODE_PARENT_KIND_INVALID, { node: child, parent: node, rule: r })
        }

        if (r.parent.type != null && !r.parent.type.includes(node.type)) {
          return fail(NODE_PARENT_TYPE_INVALID, { node: child, parent: node, rule: r })
        }
      }
    }
  }

  /**
   * Normalize a `node` with `reason` and `rule`.
   *
   * @param {Change} change
   * @param {Node} node
   * @param {String} reason
   * @param {Mixed} context
   */

  normalizeNode(change, node, reason, context) {
    const { rule } = context
    const { data, nodes, parent, text } = rule.defaults
    const remove = (c, n) => {
      if (n.kind == 'document') {
        n.nodes.forEach(child => c.removeNodeByKey(child.key))
      } else {
        c.removeNodeByKey(n.key)
      }
    }

    switch (reason) {
      case NODE_CHILD_KIND_INVALID: {
        const { child, index } = context
        const { kind } = child
        const def = nodes && nodes[index]
        if (!def) return change.call(remove, node)
        if (kind == 'block') return change.unwrapNodeByKey(child.key)
        if (kind == 'inline' && def.kind == 'text') return change.unwrapNodeByKey(child.key)
        return change.wrapNodeByKey(child.key, def)
      }

      case NODE_CHILD_TYPE_INVALID: {
        const { child, index } = context
        const def = nodes && nodes[index]
        if (!def) return change.call(remove, node)
        const { type } = def
        change.setNodeByKey(child.key, { type })
      }

      case NODE_CHILD_REQUIRED: {
        const { index } = context
        const def = nodes && nodes[index]
        if (!def) return change.call(remove, node)
        const child = Node.create(def)
        return change.insertNodeByKey(node.key, index, child)
      }

      case NODE_CHILD_UNKNOWN: {
        const { child } = context
        return change.removeNodeByKey(child.key)
      }

      case NODE_DATA_INVALID: {
        const { key } = context
        const current = node.data.get(key)
        const value = data[key]
        if (value === undefined && current === undefined) return change.call(remove, node)
        if (value === undefined) return change.setNodeByKey(node.key, { data: data.delete(key) })
        return change.setNodeByKey(node.key, { data: data.set(key, value) })
      }

      case NODE_IS_VOID_INVALID: {
        return change.setNodeByKey(node.key, { isVoid: !node.isVoid })
      }

      case NODE_KIND_INVALID: {
        return change.call(remove, node)
      }

      case NODE_MARK_INVALID: {
        const { mark } = context
        const texts = node.getTexts()
        texts.forEach(t => node.removeMarkByKey(t.key, 0, t.text.length, mark))
        return
      }

      case NODE_PARENT_KIND_INVALID: {
        const { child } = context
        const p = Node.create(parent)
        return change.wrapNodeByKey(child.key, p)
      }

      case NODE_PARENT_TYPE_INVALID: {
        const { child } = context
        const p = Node.create(parent)
        return change.wrapNodeByKey(child.key, p)
      }

      case NODE_TEXT_INVALID: {
        const child = Text.create(text)
        node.nodes.forEach(c => change.removeNodeByKey(c.key, { normalize: false }))
        change.insertTextByKey(child.key, 0, text)
        return
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
  let { data, nodes, isVoid, text } = obj
  const defaults = {
    data: (obj.defaults && obj.defaults.data) || {},
    isVoid: (obj.defaults && obj.defaults.isVoid) || false,
    nodes: obj.defaults && obj.defaults.nodes,
  }

  if (nodes != null && typeof nodes[0] == 'string') {
    nodes = [{ type: nodes }]
  }

  const rule = {
    data,
    defaults,
    isVoid,
    kind,
    nodes,
    text,
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
  const { defaults, kind, nodes, text, type } = rule

  if (kind == null) {
    throw new Error('You must provide a `kind` property in node schema rules.')
  }

  if (kind != 'document' && type == null) {
    throw new Error('You must provide a `type` property in node schema rules.')
  }

  if (nodes != null && defaults.nodes == null) {
    throw new Error('Schema rules that define validation for `nodes` must also include `defaults.nodes` to normalize with.')
  }

  if (text != null && defaults.text == null) {
    throw new Error('Schema rules that define validation for `text` must also include `defaults.text` to normalize with.')
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
