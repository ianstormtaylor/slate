import isPlainObject from 'is-plain-object'
import { List, Record, Map } from 'immutable'

import Annotation from './annotation'
import Mark from './mark'
import Node from './node'
import PathUtils from '../utils/path-utils'
import Selection from './selection'
import Value from './value'
import apply from '../operations/apply'
import invert from '../operations/invert'

/**
 * Operation attributes.
 *
 * @type {Array}
 */

const OPERATION_ATTRIBUTES = {
  add_mark: ['path', 'mark', 'data'],
  add_annotation: ['annotation', 'data'],
  insert_node: ['path', 'node', 'data'],
  insert_text: ['path', 'offset', 'text', 'data'],
  merge_node: ['path', 'position', 'properties', 'target', 'data'],
  move_node: ['path', 'newPath', 'data'],
  remove_annotation: ['annotation', 'data'],
  remove_mark: ['path', 'mark', 'data'],
  remove_node: ['path', 'node', 'data'],
  remove_text: ['path', 'offset', 'text', 'data'],
  set_annotation: ['properties', 'newProperties', 'data'],
  set_mark: ['path', 'properties', 'newProperties', 'data'],
  set_node: ['path', 'properties', 'newProperties', 'data'],
  set_selection: ['properties', 'newProperties', 'data'],
  set_value: ['properties', 'newProperties', 'data'],
  split_node: ['path', 'position', 'properties', 'target', 'data'],
}

/**
 * Default properties.
 *
 * @type {Object}
 */

const DEFAULTS = {
  annotation: undefined,
  data: undefined,
  length: undefined,
  mark: undefined,
  marks: undefined,
  newPath: undefined,
  newProperties: undefined,
  node: undefined,
  offset: undefined,
  path: undefined,
  position: undefined,
  properties: undefined,
  target: undefined,
  text: undefined,
  type: undefined,
}

/**
 * Operation.
 *
 * @type {Operation}
 */

class Operation extends Record(DEFAULTS) {
  /**
   * Create a new `Operation` with `attrs`.
   *
   * @param {Object|Array|List|String|Operation} attrs
   * @return {Operation}
   */

  static create(attrs = {}) {
    if (Operation.isOperation(attrs)) {
      return attrs
    }

    if (isPlainObject(attrs)) {
      return Operation.fromJSON(attrs)
    }

    throw new Error(
      `\`Operation.create\` only accepts objects or operations, but you passed it: ${attrs}`
    )
  }

  /**
   * Create a list of `Operations` from `elements`.
   *
   * @param {Array<Operation|Object>|List<Operation|Object>} elements
   * @return {List<Operation>}
   */

  static createList(elements = []) {
    if (List.isList(elements) || Array.isArray(elements)) {
      const list = new List(elements.map(Operation.create))
      return list
    }

    throw new Error(
      `\`Operation.createList\` only accepts arrays or lists, but you passed it: ${elements}`
    )
  }

  /**
   * Create a `Operation` from a JSON `object`.
   *
   * @param {Object|Operation} object
   * @return {Operation}
   */

  static fromJSON(object) {
    if (Operation.isOperation(object)) {
      return object
    }

    const { type } = object
    const ATTRIBUTES = OPERATION_ATTRIBUTES[type]
    const attrs = { type }

    if (!ATTRIBUTES) {
      throw new Error(
        `\`Operation.fromJSON\` was passed an unrecognized operation type: "${type}"`
      )
    }

    for (const key of ATTRIBUTES) {
      let v = object[key]

      // Default `data` to an empty object.
      if (key === 'data' && v === undefined) {
        v = {}
      }

      if (v === undefined) {
        throw new Error(
          `\`Operation.fromJSON\` was passed a "${type}" operation without the required "${key}" attribute.`
        )
      }

      if (key === 'annotation') {
        v = Annotation.create(v)
      }

      if (key === 'path' || key === 'newPath') {
        v = PathUtils.create(v)
      }

      if (key === 'mark') {
        v = Mark.create(v)
      }

      if (key === 'node') {
        v = Node.create(v)
      }

      if (
        (key === 'properties' || key === 'newProperties') &&
        type === 'set_annotation'
      ) {
        v = Annotation.createProperties(v)
      }

      if (
        (key === 'properties' || key === 'newProperties') &&
        type === 'set_mark'
      ) {
        v = Mark.createProperties(v)
      }

      if (
        (key === 'properties' || key === 'newProperties') &&
        (type === 'set_node' || type === 'merge_node' || type === 'split_node')
      ) {
        v = Node.createProperties(v)
      }

      if (
        (key === 'properties' || key === 'newProperties') &&
        type === 'set_selection'
      ) {
        v = Selection.createProperties(v)
      }

      if (
        (key === 'properties' || key === 'newProperties') &&
        type === 'set_value'
      ) {
        v = Value.createProperties(v)
      }

      if (key === 'data') {
        v = Map(v)
      }

      attrs[key] = v
    }

    const op = new Operation(attrs)
    return op
  }

  /**
   * Check if `any` is a list of operations.
   *
   * @param {Any} any
   * @return {Boolean}
   */

  static isOperationList(any) {
    return List.isList(any) && any.every(item => Operation.isOperation(item))
  }

  /**
   * Apply the operation to a `value`.
   *
   * @param {Value} value
   * @return {Value}
   */

  apply(value) {
    const next = apply(value, this)
    return next
  }

  /**
   * Invert the operation.
   *
   * @return {Operation}
   */

  invert() {
    const inverted = invert(this)
    return inverted
  }

  /**
   * Return a JSON representation of the operation.
   *
   * @param {Object} options
   * @return {Object}
   */

  toJSON(options = {}) {
    const { object, type } = this
    const json = { object, type }
    const ATTRIBUTES = OPERATION_ATTRIBUTES[type]

    for (const key of ATTRIBUTES) {
      let value = this[key]

      if (
        key === 'annotation' ||
        key === 'mark' ||
        key === 'marks' ||
        key === 'node' ||
        key === 'path' ||
        key === 'newPath'
      ) {
        value = value.toJSON()
      }

      if (key === 'properties' && type === 'merge_node') {
        const v = {}
        if ('data' in value) v.data = value.data.toJS()
        if ('type' in value) v.type = value.type
        value = v
      }

      if (
        (key === 'properties' || key === 'newProperties') &&
        type === 'set_annotation'
      ) {
        const v = {}
        if ('anchor' in value) v.anchor = value.anchor.toJS()
        if ('focus' in value) v.focus = value.focus.toJS()
        if ('key' in value) v.key = value.key
        if ('mark' in value) v.mark = value.mark.toJS()
        value = v
      }

      if (
        (key === 'properties' || key === 'newProperties') &&
        type === 'set_mark'
      ) {
        const v = {}
        if ('data' in value) v.data = value.data.toJS()
        if ('type' in value) v.type = value.type
        value = v
      }

      if (
        (key === 'properties' || key === 'newProperties') &&
        type === 'set_node'
      ) {
        const v = {}
        if ('data' in value) v.data = value.data.toJS()
        if ('type' in value) v.type = value.type
        value = v
      }

      if (
        (key === 'properties' || key === 'newProperties') &&
        type === 'set_selection'
      ) {
        const v = {}
        if ('anchor' in value) v.anchor = value.anchor.toJSON()
        if ('focus' in value) v.focus = value.focus.toJSON()
        if ('isFocused' in value) v.isFocused = value.isFocused
        if ('marks' in value) v.marks = value.marks && value.marks.toJSON()
        value = v
      }

      if (
        (key === 'properties' || key === 'newProperties') &&
        type === 'set_value'
      ) {
        const v = {}
        if ('data' in value) v.data = value.data.toJS()
        value = v
      }

      if (key === 'properties' && type === 'split_node') {
        const v = {}
        if ('data' in value) v.data = value.data.toJS()
        if ('type' in value) v.type = value.type
        value = v
      }

      if (key === 'data') {
        value = value.toJSON()
      }

      json[key] = value
    }

    return json
  }
}

/**
 * Export.
 *
 * @type {Operation}
 */

export default Operation
