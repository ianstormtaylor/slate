
import React from 'react'
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
      return value.some(match => match(child))
    })

    if (invalids.size) return invalids
  },

  noneOf(object, value) {
    const { nodes } = object
    if (!nodes) return
    const invalids = nodes.filterNot((child) => {
      return value.every(match => !match(child))
    })

    if (invalids.size) return invalids
  },

  exactlyOf(object, value) {
    const { nodes } = object
    if (!nodes) return
    if (nodes.size != value.length) return nodes

    const invalids = nodes.filterNot((child, i) => {
      const match = value[i]
      if (!match) return false
      return match(child)
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
   * Return the renderer for an `object`.
   *
   * This method is private, because it should always be called on one of the
   * often-changing immutable objects instead, since it will be memoized for
   * much better performance.
   *
   * @param {Mixed} object
   * @return {Component || Void}
   */

  __getComponent(object) {
    const match = this.rules.find(rule => rule.render && rule.match(object))
    if (!match) return
    return match.render
  }

  /**
   * Return the decorators for an `object`.
   *
   * This method is private, because it should always be called on one of the
   * often-changing immutable objects instead, since it will be memoized for
   * much better performance.
   *
   * @param {Mixed} object
   * @return {Array}
   */

  __getDecorators(object) {
    return this.rules
      .filter(rule => rule.decorate && rule.match(object))
      .map((rule) => {
        return (text) => {
          return rule.decorate(text, object)
        }
      })
  }

  /**
   * Validate an `object` against the schema, returning the failing rule and
   * value if the object is invalid, or void if it's valid.
   *
   * This method is private, because it should always be called on one of the
   * often-changing immutable objects instead, since it will be memoized for
   * much better performance.
   *
   * @param {Mixed} object
   * @return {Object || Void}
   */

  __validate(object) {
    let value

    const match = this.rules.find((rule) => {
      if (!rule.validate) return
      if (!rule.match(object)) return

      value = rule.validate(object)
      return value
    })

    if (!value) return

    return {
      rule: match,
      value,
    }
  }

}

/**
 * Normalize the `properties` of a schema.
 *
 * @param {Object} properties
 * @return {Object}
 */

function normalizeProperties(properties) {
  let { rules = [], nodes, marks } = properties

  if (nodes) {
    const array = normalizeNodes(nodes)
    rules = rules.concat(array)
  }

  if (marks) {
    const array = normalizeMarks(marks)
    rules = rules.concat(array)
  }

  return { rules }
}

/**
 * Normalize a `nodes` shorthand argument.
 *
 * @param {Object} nodes
 * @return {Array}
 */

function normalizeNodes(nodes) {
  const rules = []

  for (const key in nodes) {
    let rule = nodes[key]

    if (typeOf(rule) == 'function' || isReactComponent(rule)) {
      rule = { render: rule }
    }

    rule.match = (object) => {
      return (
        (object.kind == 'block' || object.kind == 'inline') &&
        object.type == key
      )
    }

    rules.push(rule)
  }

  return rules
}

/**
 * Normalize a `marks` shorthand argument.
 *
 * @param {Object} marks
 * @return {Array}
 */

function normalizeMarks(marks) {
  const rules = []

  for (const key in marks) {
    let rule = marks[key]

    if (!rule.render && !rule.decorator && !rule.validate) {
      rule = { render: rule }
    }

    rule.render = normalizeMarkComponent(rule.render)
    rule.match = object => object.kind == 'mark' && object.type == key
    rules.push(rule)
  }

  return rules
}

/**
 * Normalize a mark `render` property.
 *
 * @param {Component || Function || Object || String} render
 * @return {Component}
 */

function normalizeMarkComponent(render) {
  if (isReactComponent(render)) return render

  switch (typeOf(render)) {
    case 'function':
      return render
    case 'object':
      return props => <span style={render}>{props.children}</span>
    case 'string':
      return props => <span className={render}>{props.children}</span>
  }
}

/**
 * Export.
 *
 * @type {Record}
 */

export default Schema
