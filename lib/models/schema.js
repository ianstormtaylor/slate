
import RULES from '../constants/rules'
import includes from 'lodash/includes'
import isReactComponent from '../utils/is-react-component'
import typeOf from 'type-of'
import memoize from '../utils/memoize'
import { Record } from 'immutable'

/**
 * Default properties.
 *
 * @type {Object}
 */

const DEFAULTS = {
  rules: [],
}

/**
 * Schema.
 *
 * @type {Record}
 */

class Schema extends new Record(DEFAULTS) {

  /**
   * Create a new `Schema` with `properties`.
   *
   * @param {Object} properties
   * @return {Schema} mark
   */

  static create(properties = {}) {
    if (properties instanceof Schema) return properties

    let rules = [
      ...(properties.rules || []),
      ...RULES,
    ]

    return new Schema({
      rules: rules.map(normalizeRule)
    })
  }

  /**
   * Get the kind.
   *
   * @return {String} kind
   */

  get kind() {
    return 'schema'
  }

  /**
   * Normalize a `state` against the schema.
   *
   * @param {State} state
   * @return {State}
   */

  normalize(state) {
    const { document } = state
    let transform = state.transform()

    document.filterDescendants((node) => {
      const rule = this.validateNode(node)
      if (rule) transform = rule.transform(transform, node, state)
    })

    const next = transform.apply({ snapshot: false })
    return next
  }

  /**
   * Validate a `state` against the schema.
   *
   * @param {State} state
   * @return {State}
   */

  validate(state) {
    return !!state.document.findDescendant(node => this.validateNode(node))
  }

  /**
   * Validate a `node` against the schema, returning the rule that was not met
   * if the node is invalid, or null if the rule was valid.
   *
   * @param {Node} node
   * @return {Object || Void}
   */

  validateNode(node) {
    return this.rules
      .filter(rule => rule.match(node))
      .find(rule => !rule.validate(node))
  }

}

/**
 * Memoize read methods.
 */

memoize(Schema.prototype, [
  'normalize',
  'validate',
  'validateNode',
])

/**
 * Normalize the `properties` of a schema.
 *
 * @param {Object} properties
 * @return {Object}
 */

function normalizeProperties(properties) {
  let rules = []

  // If there's a `rules` property, it is not the shorthand.
  if (properties.rules) {
    rules = properties.rules
  }

  // Otherwise it's the shorthand syntax, so expand each of the properties.
  else {
    for (const key in properties) {
      const value = properties[key]
      let rule

      if (isReactComponent(value)) {
        rule.match = { type: key }
        rule.component = value
      } else {
        rule = {
          type: key,
          ...value
        }
      }

      rules.push(rule)
    }
  }

  return {
    rules: rules
      .concat(RULES)
      .map(normalizeRule)
  }
}

/**
 * Normalize a `rule` object.
 *
 * @param {Object} rule
 * @return {Object}
 */

function normalizeRule(rule) {
  return {
    match: normalizeMatch(rule.match),
    validate: normalizeValidate(rule.validate),
    transform: normalizeTransform(rule.transform),
  }
}

/**
 * Normalize a `match` spec.
 *
 * @param {Function || Object || String} match
 * @return {Function}
 */

function normalizeMatch(match) {
  switch (typeOf(match)) {
    case 'function': return match
    case 'object': return normalizeSpec(match)
    default: {
      throw new Error(`Invalid \`match\` spec: "${match}".`)
    }
  }
}

/**
 * Normalize a `validate` spec.
 *
 * @param {Function || Object || String} validate
 * @return {Function}
 */

function normalizeValidate(validate) {
  switch (typeOf(validate)) {
    case 'function': return validate
    case 'object': return normalizeSpec(validate)
    default: {
      throw new Error(`Invalid \`validate\` spec: "${validate}".`)
    }
  }
}

/**
 * Normalize a `transform` spec.
 *
 * @param {Function || Object || String} transform
 * @return {Function}
 */

function normalizeTransform(transform) {
  switch (typeOf(transform)) {
    case 'function': return transform
    default: {
      throw new Error(`Invalid \`transform\` spec: "${transform}".`)
    }
  }
}

/**
 * Normalize a `spec` object.
 *
 * @param {Object} obj
 * @return {Boolean}
 */

function normalizeSpec(obj) {
  const spec = { ...obj }
  const { nodes } = spec

  // Normalize recursively for the node specs.
  if (nodes) {
    if (nodes.exactlyOf) spec.nodes.exactlyOf = nodes.exactlyOf.map(normalizeSpec)
    if (nodes.anyOf) spec.nodes.anyOf = nodes.anyOf.map(normalizeSpec)
    if (nodes.noneOf) spec.nodes.noneOf = nodes.noneOf.map(normalizeSpec)
  }

  // Return a checking function.
  return (node) => {
    // If marked as invalid explicitly, return early.
    if (spec.invalid === true) return false

    // Run the simple equality checks first.
    if (
      (spec.kind != null && spec.kind != node.kind) ||
      (spec.type != null && spec.type != node.type) ||
      (spec.isVoid != null && spec.isVoid != node.type) ||
      (spec.kinds != null && !includes(spec.kinds, node.kind)) ||
      (spec.types != null && !includes(spec.types, node.type))
    ) {
      return false
    }

    // Ensure that the node has nodes.
    if (spec.nodes && !node.nodes) {
      return false
    }

    // Run the node recursive checks next, start with `exactlyOf`, which likely
    // has the  greatest chance of not matching.
    if (spec.nodes && spec.nodes.exactlyOf) {
      const specs = spec.nodes.exactlyOf
      const matches = node.nodes.reduce((valid, child, i) => {
        if (!valid) return false
        const checker = specs[i]
        if (!checker) return false
        return checker(child)
      }, true)

      if (!matches) return false
    }

    // Run the `anyOf` next check.
    if (spec.nodes && spec.nodes.anyOf) {
      const specs = spec.nodes.anyOf
      const matches = node.nodes.reduce((valid, child) => {
        if (!valid) return false
        return specs.reduce((pass, checker) => {
          if (!pass) return false
          return checker(child)
        }, true)
      })

      if (!matches) return false
    }

    // Run the `noneOf` next check.
    if (spec.nodes && spec.nodes.noneOf) {
      const specs = spec.nodes.noneOf
      const matches = node.nodes.reduce((valid, child) => {
        if (!valid) return false
        return specs.reduce((pass, checker) => {
          if (!pass) return false
          return !!checker(child)
        }, true)
      })

      if (!matches) return false
    }

    return true
  }
}

/**
 * Export.
 *
 * @type {Record}
 */

export default Schema
