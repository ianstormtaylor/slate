import warning from 'tiny-warning'
import { List } from 'immutable'

import mixin from '../utils/mixin'
import Block from '../models/block'
import Document from '../models/document'
import Inline from '../models/inline'
import KeyUtils from '../utils/key-utils'
import memoize from '../utils/memoize'
import PathUtils from '../utils/path-utils'
import Text from '../models/text'

/**
 * The interface that `Document`, `Block` and `Inline` all implement, to make
 * working with the recursive node tree easier.
 *
 * @type {Class}
 */

class NodeInterface {
  /**
   * Get the concatenated text of the node.
   *
   * @return {String}
   */

  get text() {
    return this.getText()
  }

  /**
   * Get the first text node of a node, or the node itself.
   *
   * @return {Node|Null}
   */

  getFirstText() {
    if (this.object === 'text') {
      return this
    }

    let descendant = null

    const found = this.nodes.find(node => {
      if (node.object === 'text') return true
      descendant = node.getFirstText()
      return !!descendant
    })

    return descendant || found
  }

  /**
   * Get an object mapping all the keys in the node to their paths.
   *
   * @return {Object}
   */

  getKeysToPathsTable() {
    const ret = {
      [this.key]: [],
    }

    if (this.nodes) {
      this.nodes.forEach((node, i) => {
        const nested = node.getKeysToPathsTable()

        for (const key in nested) {
          const path = nested[key]

          warning(
            !(key in ret),
            `A node with a duplicate key of "${key}" was found! Duplicate keys are not allowed, you should use \`node.regenerateKey\` before inserting if you are reusing an existing node.`
          )

          ret[key] = [i, ...path]
        }
      })
    }

    return ret
  }

  /**
   * Get the last text node of a node, or the node itself.
   *
   * @return {Node|Null}
   */

  getLastText() {
    if (this.object === 'text') {
      return this
    }

    let descendant = null

    const found = this.nodes.findLast(node => {
      if (node.object == 'text') return true
      descendant = node.getLastText()
      return descendant
    })

    return descendant || found
  }

  /**
   * Get a node in the tree, or the node itself.
   *
   * @param {List|String} path
   * @return {Node|Null}
   */

  getNode(path) {
    path = this.resolvePath(path)
    if (!path) return null
    if (this.object === 'text' && path.size) return null
    const node = path.size ? this.getDescendant(path) : this
    return node
  }

  /**
   * Find the path to a node.
   *
   * @param {String|List} key
   * @return {List}
   */

  getPath(key) {
    // Handle the case of passing in a path directly, to match other methods.
    if (List.isList(key)) return key

    const dict = this.getKeysToPathsTable()
    const path = dict[key]
    return path ? List(path) : null
  }

  /**
   * Get the concatenated text string of a node.
   *
   * @return {String}
   */

  getText() {
    const children = this.object === 'text' ? this.leaves : this.nodes
    const text = children.reduce((memo, c) => memo + c.text, '')
    return text
  }

  /**
   * Check if a node exists.
   *
   * @param {List|String} path
   * @return {Boolean}
   */

  hasNode(path) {
    const node = this.getNode(path)
    return !!node
  }

  /**
   * Normalize the text node with an `editor`.
   *
   * @param {Editor} editor
   * @return {Function|Void}
   */

  normalize(editor) {
    const normalizer = editor.run('normalizeNode', this)
    return normalizer
  }

  /**
   * Regenerate the node's key.
   *
   * @return {Node}
   */

  regenerateKey() {
    const key = KeyUtils.create()
    const node = this.set('key', key)
    return node
  }

  /**
   * Resolve a path from a path list or key string.
   *
   * An `index` can be provided, in which case paths created from a key string
   * will have the index pushed onto them. This is helpful in cases where you
   * want to accept either a `path` or a `key, index` combination for targeting
   * a location in the tree that doesn't exist yet, like when inserting.
   *
   * @param {List|String} value
   * @param {Number} index
   * @return {List}
   */

  resolvePath(path, index) {
    if (typeof path === 'string') {
      path = this.getPath(path)

      if (index != null) {
        path = path.concat(index)
      }
    } else {
      path = PathUtils.create(path)
    }

    return path
  }

  /**
   * Validate the node with an `editor`.
   *
   * @param {Editor} editor
   * @return {Error|Void}
   */

  validate(editor) {
    const error = editor.run('validateNode', this)
    return error
  }
}

/**
 * Memoize read methods.
 */

memoize(NodeInterface.prototype, [
  'getFirstText',
  'getKeysToPathsTable',
  'getLastText',
  'getText',
  'normalize',
  'validate',
])

/**
 * Mix in the node interface.
 */

mixin(NodeInterface, [Block, Document, Inline, Text])
