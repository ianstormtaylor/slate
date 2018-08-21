import isPlainObject from 'is-plain-object'
import logger from 'slate-dev-logger'
import { List, Map, Record } from 'immutable'

import KeyUtils from '../utils/key-utils'
import MODEL_TYPES, { isType } from '../constants/model-types'

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
      nodes: Document.createChildren(nodes),
    })

    return document
  }

  /**
   * Alias `fromJS`.
   */

  static fromJS = Document.fromJSON

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

  get kind() {
    logger.deprecate(
      'slate@0.32.0',
      'The `kind` property of Slate objects has been renamed to `object`.'
    )
    return this.object
  }

  get isVoid() {
    logger.deprecate(
      '0.38.0',
      'The `Node.isVoid` property is deprecated, please use the `Schema.isVoid()` checking method instead.'
    )

    return this.get('isVoid')
  }

  /**
   * Check if the document is empty.
   * Returns true if all it's children nodes are empty.
   *
   * @return {Boolean}
   */

  get isEmpty() {
    logger.deprecate('0.38.0', 'The `Node.isEmpty` property is deprecated.')
    return !this.nodes.some(child => !child.isEmpty)
  }

  /**
   * Get the concatenated text of all the document's children.
   *
   * @return {String}
   */

  get text() {
    return this.getText()
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

  /**
   * Alias `toJS`.
   */

  toJS(options) {
    return this.toJSON(options)
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
