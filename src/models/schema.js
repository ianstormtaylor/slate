
import React from 'react'
import isReactComponent from '../utils/is-react-component'
import typeOf from 'type-of'
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
   * Return true if one rule can normalize the document
   */

  get isNormalization() {
    const { rules } = this
    return rules.some(rule => rule.validate)
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
