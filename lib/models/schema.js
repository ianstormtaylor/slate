
import RULES from '../constants/rules'
import includes from 'lodash/includes'
import isReactComponent from '../utils/is-react-component'
import typeOf from 'type-of'
import memoize from '../utils/memoize'
import { Record } from 'immutable'

/**
 * Checks that the schema can perform, ordered by performance.
 *
 * @type {Object}
 */

const CHECKS = {

  kind(object, value) {
    if (object.kind != value) return object.kind
  },

  type(object, value) {
    if (object.type != value) return object.type
  },

  isVoid(object, value) {
    if (object.isVoid != value) return object.isVoid
  },

  minChildren(object, value) {
    if (object.nodes.size < value) return object.nodes.size
  },

  maxChildren(object, value) {
    if (object.nodes.size > value) return object.nodes.size
  },

  kinds(object, value) {
    if (!includes(value, object.kind)) return object.kind
  },

  types(object, value) {
    if (!includes(value, object.type)) return object.type
  },

  minLength(object, value) {
    const { length } = object
    if (length < value) return length
  },

  maxLength(object, value) {
    const { length } = object
    if (length > value) return length
  },

  text(object, value) {
    const { text } = object
    switch (typeOf(value)) {
      case 'function': if (value(text)) return text
      case 'regexp': if (!text.match(value)) return text
      default: if (text != value) return text
    }
  },

  anyOf(object, value) {
    const { nodes } = object
    if (!nodes) return
    const invalids = nodes.filterNot((child) => {
      return value.some(fail => !fail(child))
    })

    if (invalids.size) return invalids
  },

  noneOf(object, value) {
    const { nodes } = object
    if (!nodes) return
    const invalids = nodes.filterNot((child) => {
      return value.every(fail => fail(child))
    })

    if (invalids.size) return invalids
  },

  exactlyOf(object, value) {
    const { nodes } = object
    if (!nodes) return
    if (nodes.size != value.length) return nodes

    const invalids = nodes.filter((child, i) => {
      const fail = value[i]
      if (!fail) return true
      return fail(child)
    })

    if (invalids.size) return invalids
  },

}

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
    return new Schema(normalizeProperties(properties))
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
   * Transform a `state` to abide by the schema.
   *
   * @param {State} state
   * @return {State}
   */

  transform(state) {
    const { document } = state
    let transform = state.transform()
    let failure

    document.filterDescendantsDeep((node) => {
      if (failure = this.validateNode(node)) {
        const { reason, rule } = failure
        transform = rule.transform(transform, node, reason)
      }
    })

    if (failure = this.validateNode(document)) {
      const { reason, rule } = failure
      transform = rule.transform(transform, document, reason)
    }

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
    let reason
    let match = this.rules
      .filter(rule => !rule.match(node))
      .find((rule) => {
        reason = rule.validate(node)
        if (reason) return true
      })

    if (!match) return

    return {
      rule: match,
      reason
    }
  }

}

/**
 * Memoize read methods.
 */

memoize(Schema.prototype, [
  'transform',
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
  let { rules, nodes, marks } = properties
  if (!rules) rules = []

  // If there's a `nodes` property, it's the node rule shorthand dictionary.
  if (nodes) {
    for (const key in nodes) {
      const value = nodes[key]
      let rule

      if (isReactComponent(value)) {
        rule.match = { type: key }
        rule.component = value
      } else {
        rule = {
          kinds: ['block', 'inline'],
          type: key,
          ...value
        }
      }

      rules.push(rule)
    }
  }

  // If there's a `marks` property, it's the mark rule shorthand dictionary.
  if (marks) {
    for (const key in marks) {
      const value = marks[key]
      let rule

      if (rule.match) {
        rule = {
          kind: 'mark',
          type: key,
          ...value
        }
      } else {
        rule.match = { type: key }
        rule.component = value
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
    case 'boolean': return () => match
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
    case 'boolean': return () => validate
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
  if (spec.exactlyOf) spec.exactlyOf = spec.exactlyOf.map(normalizeSpec)
  if (spec.anyOf) spec.anyOf = spec.anyOf.map(normalizeSpec)
  if (spec.noneOf) spec.noneOf = spec.noneOf.map(normalizeSpec)

  return (node) => {
    for (const key in CHECKS) {
      const value = spec[key]
      if (value == null) continue

      const fail = CHECKS[key]
      const failure = fail(node, value)

      if (failure != undefined) {
        return {
          type: key,
          value: failure
        }
      }
    }
  }
}

/**
 * Export.
 *
 * @type {Record}
 */

export default Schema
