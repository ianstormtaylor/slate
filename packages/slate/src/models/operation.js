import isPlainObject from 'is-plain-object'
import { List, Record } from 'immutable'

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
  add_mark: ['value', 'path', 'offset', 'length', 'mark'],
  insert_node: ['value', 'path', 'node'],
  insert_text: ['value', 'path', 'offset', 'text', 'marks'],
  merge_node: ['value', 'path', 'position', 'properties', 'target'],
  move_node: ['value', 'path', 'newPath'],
  remove_mark: ['value', 'path', 'offset', 'length', 'mark'],
  remove_node: ['value', 'path', 'node'],
  remove_text: ['value', 'path', 'offset', 'text', 'marks'],
  set_mark: ['value', 'path', 'offset', 'length', 'mark', 'properties'],
  set_node: ['value', 'path', 'node', 'properties'],
  set_selection: ['value', 'selection', 'properties'],
  set_value: ['value', 'properties'],
  split_node: ['value', 'path', 'position', 'properties', 'target'],
}

/**
 * Default properties.
 *
 * @type {Object}
 */

const DEFAULTS = {
  length: undefined,
  mark: undefined,
  marks: undefined,
  newPath: undefined,
  node: undefined,
  offset: undefined,
  path: undefined,
  position: undefined,
  properties: undefined,
  selection: undefined,
  target: undefined,
  text: undefined,
  type: undefined,
  value: undefined,
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

      if (v === undefined) {
        // Skip keys for objects that should not be serialized, and are only used
        // for providing the local-only invert behavior for the history stack.
        if (key == 'document') continue
        if (key == 'selection') continue
        if (key == 'value') continue
        if (key == 'node' && type != 'insert_node') continue

        throw new Error(
          `\`Operation.fromJSON\` was passed a "${type}" operation without the required "${key}" attribute.`
        )
      }

      if (key === 'path' || key === 'newPath') {
        v = PathUtils.create(v)
      }

      if (key === 'mark') {
        v = Mark.create(v)
      }

      if (key === 'marks' && v != null) {
        v = Mark.createSet(v)
      }

      if (key === 'node') {
        v = Node.create(v)
      }

      if (key === 'selection') {
        v = Selection.create(v)
      }

      if (key === 'value') {
        v = Value.create(v)
      }

      if (key === 'properties' && type === 'merge_node') {
        v = Node.createProperties(v)
      }

      if (key === 'properties' && type === 'set_mark') {
        v = Mark.createProperties(v)
      }

      if (key === 'properties' && type === 'set_node') {
        v = Node.createProperties(v)
      }

      if (key === 'properties' && type === 'set_selection') {
        v = Selection.createProperties(v)
      }

      if (key === 'properties' && type === 'set_value') {
        v = Value.createProperties(v)
      }

      if (key === 'properties' && type === 'split_node') {
        v = Node.createProperties(v)
      }

      attrs[key] = v
    }

    const node = new Operation(attrs)
    return node
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

      // Skip keys for objects that should not be serialized, and are only used
      // for providing the local-only invert behavior for the history stack.
      if (key == 'document') continue
      if (key == 'selection') continue
      if (key == 'value') continue
      if (key == 'node' && type != 'insert_node') continue

      if (
        key == 'mark' ||
        key == 'marks' ||
        key == 'node' ||
        key == 'path' ||
        key == 'newPath'
      ) {
        value = value.toJSON()
      }

      if (key == 'properties' && type == 'merge_node') {
        const v = {}
        if ('data' in value) v.data = value.data.toJS()
        if ('type' in value) v.type = value.type
        value = v
      }

      if (key == 'properties' && type == 'set_mark') {
        const v = {}
        if ('data' in value) v.data = value.data.toJS()
        if ('type' in value) v.type = value.type
        value = v
      }

      if (key == 'properties' && type == 'set_node') {
        const v = {}
        if ('data' in value) v.data = value.data.toJS()
        if ('type' in value) v.type = value.type
        value = v
      }

      if (key == 'properties' && type == 'set_selection') {
        const v = {}
        if ('anchor' in value) v.anchor = value.anchor.toJSON()
        if ('focus' in value) v.focus = value.focus.toJSON()
        if ('isFocused' in value) v.isFocused = value.isFocused
        if ('marks' in value) v.marks = value.marks && value.marks.toJSON()
        value = v
      }

      if (key == 'properties' && type == 'set_value') {
        const v = {}
        if ('data' in value) v.data = value.data.toJS()
        if ('decorations' in value) v.decorations = value.decorations.toJS()
        value = v
      }

      if (key == 'properties' && type == 'split_node') {
        const v = {}
        if ('data' in value) v.data = value.data.toJS()
        if ('type' in value) v.type = value.type
        value = v
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
