import isPlainObject from 'is-plain-object'
import warning from 'tiny-warning'
import { List } from 'immutable'

import Block from './block'
import Data from './data'
import Document from './document'
import Inline from './inline'
import Text from './text'

/**
 * A pseudo-model that is used for its static methods only.
 *
 * @type {Node}
 */

class Node {
  /**
   * Create a new `Node` with `attrs`.
   *
   * @param {Object|Node} attrs
   * @return {Node}
   */

  static create(attrs = {}) {
    if (Node.isNode(attrs)) {
      return attrs
    }

    if (isPlainObject(attrs)) {
      let { object } = attrs

      if (!object && attrs.kind) {
        warning(
          false,
          'As of slate@0.32.0, the `kind` property of Slate objects has been renamed to `object`.'
        )

        object = attrs.kind
      }

      switch (object) {
        case 'block':
          return Block.create(attrs)
        case 'document':
          return Document.create(attrs)
        case 'inline':
          return Inline.create(attrs)
        case 'text':
          return Text.create(attrs)

        default: {
          throw new Error('`Node.create` requires a `object` string.')
        }
      }
    }

    throw new Error(
      `\`Node.create\` only accepts objects or nodes but you passed it: ${attrs}`
    )
  }

  /**
   * Create a list of `Nodes` from an array.
   *
   * @param {Array<Object|Node>} elements
   * @return {List<Node>}
   */

  static createList(elements = []) {
    if (List.isList(elements) || Array.isArray(elements)) {
      const list = List(elements.map(Node.create))
      return list
    }

    throw new Error(
      `\`Node.createList\` only accepts lists or arrays, but you passed it: ${elements}`
    )
  }

  /**
   * Create a dictionary of settable node properties from `attrs`.
   *
   * @param {Object|String|Node} attrs
   * @return {Object}
   */

  static createProperties(attrs = {}) {
    if (Block.isBlock(attrs) || Inline.isInline(attrs)) {
      return {
        data: attrs.data,
        type: attrs.type,
      }
    }

    if (typeof attrs == 'string') {
      return { type: attrs }
    }

    if (isPlainObject(attrs)) {
      const props = {}
      if ('type' in attrs) props.type = attrs.type
      if ('data' in attrs) props.data = Data.create(attrs.data)
      return props
    }

    throw new Error(
      `\`Node.createProperties\` only accepts objects, strings, blocks or inlines, but you passed it: ${attrs}`
    )
  }

  /**
   * Create a `Node` from a JSON `value`.
   *
   * @param {Object} value
   * @return {Node}
   */

  static fromJSON(value) {
    let { object } = value

    if (!object && value.kind) {
      warning(
        false,
        'As of slate@0.32.0, the `kind` property of Slate objects has been renamed to `object`.'
      )

      object = value.kind
    }

    switch (object) {
      case 'block':
        return Block.fromJSON(value)
      case 'document':
        return Document.fromJSON(value)
      case 'inline':
        return Inline.fromJSON(value)
      case 'text':
        return Text.fromJSON(value)

      default: {
        throw new Error(
          `\`Node.fromJSON\` requires an \`object\` of either 'block', 'document', 'inline' or 'text', but you passed: ${value}`
        )
      }
    }
  }

  /**
   * Check if `any` is a `Node`.
   *
   * @param {Any} any
   * @return {Boolean}
   */

  static isNode(any) {
    return (
      Block.isBlock(any) ||
      Document.isDocument(any) ||
      Inline.isInline(any) ||
      Text.isText(any)
    )
  }

  /**
   * Check if `any` is a list of nodes.
   *
   * @param {Any} any
   * @return {Boolean}
   */

  static isNodeList(any) {
    return List.isList(any) && any.every(item => Node.isNode(item))
  }
}

/**
 * Export.
 *
 * @type {Object}
 */

export default Node
