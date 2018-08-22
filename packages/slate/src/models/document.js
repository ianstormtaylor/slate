import isPlainObject from 'is-plain-object'
import { List, Map, Record } from 'immutable'

import KeyUtils from '../utils/key-utils'
import MODEL_TYPES, { isType } from '../constants/model-types'
import Node from './node'

/**
 * Default properties.
 *
 * @type {Object}
 */

const DEFAULTS = {
  data: new Map(),
  key: undefined,
  nodes: new List(),
}

/**
 * Document.
 *
 * @type {Document}
 */

class Document extends Record(DEFAULTS) {
  /**
   * Create a new `Document` with `attrs`.
   *
   * @param {Object|Array|List|Text} attrs
   * @return {Document}
   */

  static create(attrs = {}) {
    if (Document.isDocument(attrs)) {
      return attrs
    }

    if (List.isList(attrs) || Array.isArray(attrs)) {
      attrs = { nodes: attrs }
    }

    if (isPlainObject(attrs)) {
      return Document.fromJSON(attrs)
    }

    throw new Error(
      `\`Document.create\` only accepts objects, arrays, lists or documents, but you passed it: ${attrs}`
    )
  }

  /**
   * Create a `Document` from a JSON `object`.
   *
   * @param {Object|Document} object
   * @return {Document}
   */

  static fromJSON(object) {
    if (Document.isDocument(object)) {
      return object
    }

    const { data = {}, key = KeyUtils.create(), nodes = [] } = object

    const document = new Document({
      key,
      data: new Map(data),
      nodes: Node.createList(nodes),
    })

    return document
  }

  /**
   * Check if `any` is a `Document`.
   *
   * @param {Any} any
   * @return {Boolean}
   */

  static isDocument = isType.bind(null, 'DOCUMENT')

  /**
   * Object.
   *
   * @return {String}
   */

  get object() {
    return 'document'
  }

  /**
   * Return a JSON representation of the document.
   *
   * @param {Object} options
   * @return {Object}
   */

  toJSON(options = {}) {
    const object = {
      object: this.object,
      data: this.data.toJSON(),
      nodes: this.nodes.toArray().map(n => n.toJSON(options)),
    }

    if (options.preserveKeys) {
      object.key = this.key
    }

    return object
  }
}

/**
 * Attach a pseudo-symbol for type checking.
 */

Document.prototype[MODEL_TYPES.DOCUMENT] = true

/**
 * Export.
 *
 * @type {Document}
 */

export default Document
