
import Debug from 'debug'
import isPlainObject from 'is-plain-object'
import mergeWith from 'lodash/mergeWith'
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
const NODE_CHILD_PARENT_KIND_INVALID = 'node_child_parent_kind_invalid'
const NODE_CHILD_PARENT_TYPE_INVALID = 'node_child_parent_type_invalid'
const NODE_TEXT_INVALID = 'node_text_invalid'

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

      const schema = resolveSchema(plugins)
      const stack = Stack.create({ plugins: [ ...CORE_SCHEMA_RULES, ...plugins ] })
      const ret = new Schema({ ...schema, stack })
      return ret
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
      case 'document': return this.document
      case 'block': return this.blocks[object.type]
      case 'inline': return this.inlines[object.type]
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

    const parents = this.getParentRules()
    const fail = (reason, context) => {
      return (change) => {
        debug(`normalizing node`, { reason, context })

        const count = change.operations.length
        const ctx = { rule, ...context }
        if (rule.normalize) rule.normalize(change, node, reason, ctx)
        if (change.operations.length > count) return

        this.normalizeNode(change, node, reason, ctx)
      }
    }

    if (rule.kind != null && node.kind != rule.kind) {
      return fail(NODE_KIND_INVALID)
    }

    if (rule.isVoid != null && node.isVoid != rule.isVoid) {
      return fail(NODE_IS_VOID_INVALID)
    }

    if (rule.data != null) {
      for (const key in rule.data) {
        const fn = rule.data[key]
        const value = node.data.get(key)

        if (!fn(value)) {
          return fail(NODE_DATA_INVALID, { key, value })
        }
      }
    }

    if (rule.marks != null) {
      const marks = node.getMarks().toArray()

      for (const mark of marks) {
        for (const def of rule.marks) {
          if (def.type != mark.type) {
            return fail(NODE_MARK_INVALID, { mark })
          }
        }
      }
    }

    if (rule.text != null) {
      const { text } = node

      if (typeof rule.text == 'string' && text != rule.text) {
        return fail(NODE_TEXT_INVALID, { text })
      }

      if (rule.text instanceof RegExp && !rule.text.test(text)) {
        return fail(NODE_TEXT_INVALID, { text })
      }
    }

    if (parents != null) debugger

    if (rule.nodes != null || parents != null) {
      const nodes = node.nodes.toArray()
      let offset = 0
      let d = 0
      let n
      let def

      for (let index = 0; index < nodes.length; index++) {
        const child = nodes[index]

        if (parents != null && child.kind != 'text' && child.type in parents) {
          const r = parents[child.type]

          if (r.parent.kind != null && !r.parent.kind.includes(node.kind)) {
            return fail(NODE_CHILD_PARENT_KIND_INVALID, { child, parent: node, rule: r })
          }

          if (r.parent.type != null && !r.parent.type.includes(node.type)) {
            return fail(NODE_CHILD_PARENT_TYPE_INVALID, { child, parent: node, rule: r })
          }
        }

        if (rule.nodes != null) {
          n = index - offset
          def = rule.nodes[d]
          const nextDef = rule.nodes[d + 1]
          const { min = 0, max = Infinity } = def

          if (n >= max) {
            index--
            d++
            offset += min
            break
          }

          if (!def) {
            return fail(NODE_CHILD_UNKNOWN, { child, index })
          }

          if (def.kind != null && !def.kind.includes(child.kind)) {
            if (n >= min && nextDef) {
              index--
              d++
              offset += min
              break
            }

            return fail(NODE_CHILD_KIND_INVALID, { child, index })
          }

          if (def.type != null && !def.type.includes(child.type)) {
            if (n >= min && nextDef) {
              index--
              d++
              offset += min
              break
            }

            return fail(NODE_CHILD_TYPE_INVALID, { child, index })
          }
        }
      }

      if (rule.nodes != null) {
        const { min = 0 } = def

        if (n < min) {
          return fail(NODE_CHILD_REQUIRED, { index: n })
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
    const { state } = change
    const { document } = state

    const { rule } = context
    const { data, nodes, parent, text } = rule.defaults
    const defaultNode = (
      nodes != null &&
      context.index != null &&
      nodes[Math.max(nodes.length - 1, context.index)]
    )

    const remove = (c, n) => {
      if (n.kind == 'document') {
        n.nodes.forEach(child => c.removeNodeByKey(child.key))
      } else {
        c.removeNodeByKey(n.key)
      }
    }

    switch (reason) {
      case NODE_CHILD_KIND_INVALID: {
        const { child } = context
        if (!defaultNode) return change.removeNodeByKey(child.key)
        const { kind } = child
        const defKind = defaultNode.kind

        // If the current kind is a block, the only thing it could be is that
        // it was expecting inline/text nodes, so unwrap it.
        if (kind == 'block') return change.unwrapNodeByKey(child.key)

        // If the current kind is inline, and it needs text, unwrap it.
        if (kind == 'inline' && defKind == 'text') return change.unwrapNodeByKey(child.key)

        // If current kind is a text, and the default is an inline, we can
        // just directly wrap it.
        if (kind == 'text' && defKind == 'inline') return change.wrapNodeByKey(child.key, defaultNode)

        // Otherwise, we need to wrap in a block. But we have to make sure we
        // wrap all of the inline children.
        const block = document.getClosestBlock(child.key)
        const wrapper = Node.create(defaultNode)
        change.insertNodeByKey(block.key, 0, wrapper, { normalize: false })
        block.nodes.forEach((c, i) => change.moveNodeByKey(c.key, wrapper.key, i, { normalize: false }))
        return
      }

      case NODE_CHILD_TYPE_INVALID: {
        const { child } = context
        if (!defaultNode) return change.removeNodeByKey(child.key)
        const { type } = defaultNode
        change.setNodeByKey(child.key, { type })
      }

      case NODE_CHILD_REQUIRED: {
        if (!defaultNode) return change.call(remove, node)
        const { index } = context
        const child = Node.create(defaultNode)
        return change.insertNodeByKey(node.key, index, child)
      }

      case NODE_CHILD_UNKNOWN: {
        const { child } = context
        return change.removeNodeByKey(child.key)
      }

      case NODE_CHILD_PARENT_KIND_INVALID: {
        const { child } = context
        const p = Node.create(parent)
        return change.wrapNodeByKey(child.key, p)
      }

      case NODE_CHILD_PARENT_TYPE_INVALID: {
        const { child } = context
        const p = Node.create(parent)
        return change.wrapNodeByKey(child.key, p)
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

function resolveSchema(plugins = []) {
  const schema = {
    document: {},
    blocks: {},
    inlines: {},
  }

  plugins
    .slice()
    .reverse()
    .filter(p => !!p.schema)
    .forEach((plugin) => {
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

      mergeWith(schema.document, d, customizer)
      mergeWith(schema.blocks, bs, customizer)
      mergeWith(schema.inlines, is, customizer)
    })

  linkSchema(schema)
  assertSchema(schema)
  return schema
}

/**
 * Resolve a document rule `obj`.
 *
 * @param {Object} obj
 * @return {Object}
 */

function resolveDocumentRule(obj) {
  let {
    data = {},
    nodes = null
  } = obj

  const kind = 'document'
  const defaults = {
    kind,
    data: (obj.defaults && obj.defaults.data) || {},
    nodes: obj.defaults && obj.defaults.nodes,
  }

  if (nodes != null && typeof nodes == 'string') {
    nodes = [nodes]
  }

  if (nodes != null && typeof nodes[0] == 'string') {
    nodes = [{ type: nodes }]
    if (!defaults.nodes) defaults.nodes = nodes
  }

  const rule = {
    kind,
    data,
    defaults,
    nodes,
  }

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
  let {
    data = {},
    nodes = null,
    isVoid = null,
    parent = null,
    text = null
  } = obj

  const defaults = {
    kind,
    type,
    data: (obj.defaults && obj.defaults.data) || {},
    isVoid: (obj.defaults && obj.defaults.isVoid) || false,
    nodes: obj.defaults && obj.defaults.nodes,
    parent: obj.defaults && obj.defaults.parent,
  }

  if (nodes != null && typeof nodes == 'string') {
    nodes = [nodes]
  }

  if (nodes != null && typeof nodes[0] == 'string') {
    nodes = [{ type: nodes }]
  }

  if (parent != null && typeof parent == 'string') {
    parent = [parent]
  }

  if (parent != null && typeof parent[0] == 'string') {
    parent = { type: parent }
  }

  const rule = {
    data,
    defaults,
    isVoid,
    kind,
    nodes,
    parent,
    text,
    type,
  }

  return rule
}

/**
 * Link any string references in a schema by type, for convenience.
 *
 * @param {Object} schema
 */

function linkSchema(schema) {
  const { document, blocks, inlines } = schema
  const rules = []
    .concat(document)
    .concat(Object.keys(blocks).map(k => blocks[k]))
    .concat(Object.keys(inlines).map(k => inlines[k]))

  rules.forEach((rule) => {
    // Ensure that each node rule that defines a `type` has the corresponding
    // `kind` filled in as well, for validation specificity.
    if (rule.nodes) {
      rule.nodes.forEach((def) => {
        if (!def.type) return
        def.type.forEach((type) => {
          const node = findNodeRule(type, schema)
          def.kind = def.kind || []
          def.kind.push(node.kind)
        })
      })
    }

    // Ensure the same thing for parent definitions as well.
    if (rule.parent && rule.parent.type) {
      const def = rule.parent
      def.type.forEach((type) => {
        const node = findNodeRule(type, schema)
        def.kind = def.kind || []
        def.kind.push(node.kind)
      })
    }

    // Expand any node string default references to their full properties.
    if (rule.defaults.nodes) {
      rule.defaults.nodes = rule.defaults.nodes.map((ref) => {
        if (typeof ref != 'string') return ref
        const node = findNodeRule(ref, schema)
        return node.defaults
      })
    }
  })
}

function assertSchema(schema) {
  const { document, blocks, inlines } = schema
  const rules = []
    .concat(document)
    .concat(Object.keys(blocks).map(k => blocks[k]))
    .concat(Object.keys(inlines).map(k => inlines[k]))

  rules.forEach((rule) => {
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

    if (
      (kind == 'block' || kind == 'inline') &&
      (blocks[type] && inlines[type])
    ) {
      throw new Error(`A schema cannot have a block and an inline defined with the same type, in this case "${type}".`)
    }
  })
}

function findNodeRule(type, schema) {
  const node = schema.blocks[type] || schema.inlines[type]

  if (!node) {
    throw new Error(`A schema rule referenced a node with type "${type}", but no node was defined.`)
  }

  return node
}

/**
 * A Lodash customizer for merging arrays by concatenation.
 *
 * @param {Mixed} target
 * @param {Mixed} source
 * @return {Array|Void}
 */

function customizer(target, source) {
  if (Array.isArray(target)) {
    return target.concat(source)
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
