import isPlainObject from 'is-plain-object'
import logger from 'slate-dev-logger'
import { List, OrderedSet, Record, Set } from 'immutable'

import Leaf from './leaf'
import MODEL_TYPES, { isType } from '../constants/model-types'
import KeyUtils from '../utils/key-utils'
import memoize from '../utils/memoize'

/**
 * Default properties.
 *
 * @type {Object}
 */

const DEFAULTS = {
  leaves: List(),
  key: undefined,
}

/**
 * Text.
 *
 * @type {Text}
 */

class Text extends Record(DEFAULTS) {
  /**
   * Create a new `Text` with `attrs`.
   *
   * @param {Object|Array|List|String|Text} attrs
   * @return {Text}
   */

  static create(attrs = '') {
    if (Text.isText(attrs)) {
      return attrs
    }

    if (typeof attrs == 'string') {
      attrs = { leaves: [{ text: attrs }] }
    }

    if (isPlainObject(attrs)) {
      if (attrs.text) {
        const { text, marks, key } = attrs
        attrs = { key, leaves: [{ text, marks }] }
      }

      return Text.fromJSON(attrs)
    }

    throw new Error(
      `\`Text.create\` only accepts objects, arrays, strings or texts, but you passed it: ${attrs}`
    )
  }

  /**
   * Create a list of `Texts` from `elements`.
   *
   * @param {Array<Text|Object>|List<Text|Object>} elements
   * @return {List<Text>}
   */

  static createList(elements = []) {
    if (List.isList(elements) || Array.isArray(elements)) {
      const list = new List(elements.map(Text.create))
      return list
    }

    throw new Error(
      `\`Text.createList\` only accepts arrays or lists, but you passed it: ${elements}`
    )
  }

  /**
   * Create a `Text` from a JSON `object`.
   *
   * @param {Object|Text} object
   * @return {Text}
   */

  static fromJSON(object) {
    if (Text.isText(object)) {
      return object
    }

    const { key = KeyUtils.create() } = object
    let { leaves } = object

    if (!leaves) {
      if (object.ranges) {
        logger.deprecate(
          'slate@0.27.0',
          'The `ranges` property of Slate objects has been renamed to `leaves`.'
        )

        leaves = object.ranges
      } else {
        leaves = List()
      }
    }

    if (Array.isArray(leaves)) {
      leaves = List(leaves.map(x => Leaf.create(x)))
    } else if (List.isList(leaves)) {
      leaves = leaves.map(x => Leaf.create(x))
    } else {
      throw new Error('leaves must be either Array or Immutable.List')
    }

    const node = new Text({
      leaves: Leaf.createLeaves(leaves),
      key,
    })

    return node
  }

  /**
   * Alias `fromJS`.
   */

  static fromJS = Text.fromJSON

  /**
   * Check if `any` is a `Text`.
   *
   * @param {Any} any
   * @return {Boolean}
   */

  static isText = isType.bind(null, 'TEXT')

  /**
   * Check if `any` is a list of texts.
   *
   * @param {Any} any
   * @return {Boolean}
   */

  static isTextList(any) {
    return List.isList(any) && any.every(item => Text.isText(item))
  }

  /**
   * Get an object mapping all the keys in the node to their paths.
   *
   * @return {Object}
   */

  getKeysToPathsTable() {
    return {
      [this.key]: [],
    }
  }

  /**
   * Object.
   *
   * @return {String}
   */

  get object() {
    return 'text'
  }

  get kind() {
    logger.deprecate(
      'slate@0.32.0',
      'The `kind` property of Slate objects has been renamed to `object`.'
    )
    return this.object
  }

  /**
   * Is the node empty?
   *
   * @return {Boolean}
   */

  get isEmpty() {
    return this.text == ''
  }

  /**
   * Get the concatenated text of the node.
   *
   * @return {String}
   */

  get text() {
    return this.getString()
  }

  /**
   * Get the concatenated text of the node, cached for text getter
   *
   * @returns {String}
   */

  getString() {
    return this.leaves.reduce((string, leaf) => string + leaf.text, '')
  }

  /**
   * Find the 'first' leaf at offset; By 'first' the alorighthm prefers `endOffset === offset` than `startOffset === offset`
   * Corner Cases:
   *   1. if offset is negative, return the first leaf;
   *   2. if offset is larger than text length, the leaf is null, startOffset, endOffset and index is of the last leaf
   *
   * @param {number}
   * @returns {Object}
   *   @property {number} startOffset
   *   @property {number} endOffset
   *   @property {number} index
   *   @property {Leaf} leaf
   */

  searchLeafAtOffset(offset) {
    let endOffset = 0
    let startOffset = 0
    let index = -1

    const leaf = this.leaves.find(l => {
      index++
      startOffset = endOffset
      endOffset = startOffset + l.text.length
      return endOffset >= offset
    })

    return {
      leaf,
      endOffset,
      index,
      startOffset,
    }
  }

  /**
   * Add a `mark` at `index` and `length`.
   *
   * @param {Number} index
   * @param {Number} length
   * @param {Mark} mark
   * @return {Text}
   */

  addMark(index, length, mark) {
    const marks = Set.of(mark)
    return this.addMarks(index, length, marks)
  }

  /**
   * Add a `set` of marks at `index` and `length`.
   * Corner Cases:
   *   1. If empty text, and if length === 0 and index === 0, will make sure the text contain an empty leaf with the given mark.
   *
   * @param {Number} index
   * @param {Number} length
   * @param {Set<Mark>} set
   * @return {Text}
   */

  addMarks(index, length, set) {
    if (this.text === '' && length === 0 && index === 0) {
      const { leaves } = this
      const first = leaves.first()

      if (!first) {
        return this.set(
          'leaves',
          List.of(Leaf.fromJSON({ text: '', marks: set }))
        )
      }

      const newFirst = first.addMarks(set)
      if (newFirst === first) return this
      return this.set('leaves', List.of(newFirst))
    }

    if (this.text === '') return this
    if (length === 0) return this
    if (index >= this.text.length) return this

    const [before, bundle] = Leaf.splitLeaves(this.leaves, index)
    const [middle, after] = Leaf.splitLeaves(bundle, length)
    const leaves = before.concat(middle.map(x => x.addMarks(set)), after)
    return this.setLeaves(leaves)
  }

  /**
   * Get the decorations for the node from a `schema`.
   *
   * @param {Schema} schema
   * @return {Array}
   */

  getDecorations(schema) {
    return schema.__getDecorations(this)
  }

  /**
   * Derive the leaves for a list of `decorations`.
   *
   * @param {Array|Void} decorations (optional)
   * @return {List<Leaf>}
   */

  getLeaves(decorations = []) {
    let { leaves } = this
    if (leaves.size === 0) return List.of(Leaf.create({}))
    if (!decorations || decorations.length === 0) return leaves
    if (this.text.length === 0) return leaves
    const { key } = this

    decorations.forEach(range => {
      const { start, end, marks } = range
      const hasStart = start.key == key
      const hasEnd = end.key == key

      if (hasStart && hasEnd) {
        const index = hasStart ? start.offset : 0
        const length = hasEnd ? end.offset - index : this.text.length - index

        if (length < 1) return
        if (index >= this.text.length) return

        if (index !== 0 || length < this.text.length) {
          const [before, bundle] = Leaf.splitLeaves(leaves, index)
          const [middle, after] = Leaf.splitLeaves(bundle, length)
          leaves = before.concat(middle.map(x => x.addMarks(marks)), after)
          return
        }
      }

      leaves = leaves.map(x => x.addMarks(marks))
    })

    if (leaves === this.leaves) return leaves
    return Leaf.createLeaves(leaves)
  }

  /**
   * Get all of the active marks on between two offsets
   * Corner Cases:
   *   1. if startOffset is equal or bigger than endOffset, then return Set();
   *   2. If no text is selected between start and end, then return Set()
   *
   * @return {Set<Mark>}
   */

  getActiveMarksBetweenOffsets(startOffset, endOffset) {
    if (startOffset <= 0 && endOffset >= this.text.length) {
      return this.getActiveMarks()
    }

    if (startOffset >= endOffset) return Set()
    // For empty text in a paragraph, use getActiveMarks;
    if (this.text === '') return this.getActiveMarks()

    let result = null
    let leafEnd = 0

    this.leaves.forEach(leaf => {
      const leafStart = leafEnd
      leafEnd = leafStart + leaf.text.length

      if (leafEnd <= startOffset) return
      if (leafStart >= endOffset) return false

      if (!result) {
        result = leaf.marks
        return
      }

      result = result.intersect(leaf.marks)
      if (result && result.size === 0) return false
      return false
    })

    return result || Set()
  }

  /**
   * Get all of the active marks on the text
   *
   * @return {Set<Mark>}
   */

  getActiveMarks() {
    if (this.leaves.size === 0) return Set()

    const result = this.leaves.first().marks
    if (result.size === 0) return result

    return result.withMutations(x => {
      this.leaves.forEach(c => {
        x.intersect(c.marks)
        if (x.size === 0) return false
      })
    })
  }

  getFirstText() {
    return this
  }

  getLastText() {
    return this
  }

  /**
   * Get all of the marks on between two offsets
   * Corner Cases:
   *   1. if startOffset is equal or bigger than endOffset, then return Set();
   *   2. If no text is selected between start and end, then return Set()
   *
   * @return {OrderedSet<Mark>}
   */

  getMarksBetweenOffsets(startOffset, endOffset) {
    if (startOffset <= 0 && endOffset >= this.text.length) {
      return this.getMarks()
    }

    if (startOffset >= endOffset) return Set()
    // For empty text in a paragraph, use getActiveMarks;
    if (this.text === '') return this.getActiveMarks()

    let result = null
    let leafEnd = 0

    this.leaves.forEach(leaf => {
      const leafStart = leafEnd
      leafEnd = leafStart + leaf.text.length

      if (leafEnd <= startOffset) return
      if (leafStart >= endOffset) return false

      if (!result) {
        result = leaf.marks
        return
      }

      result = result.union(leaf.marks)
    })

    return result || Set()
  }

  /**
   * Get all of the marks on the text.
   *
   * @return {OrderedSet<Mark>}
   */

  getMarks() {
    const array = this.getMarksAsArray()
    return new OrderedSet(array)
  }

  /**
   * Get all of the marks on the text as an array
   *
   * @return {Array}
   */

  getMarksAsArray() {
    if (this.leaves.size === 0) return []
    const first = this.leaves.first().marks
    if (this.leaves.size === 1) return first.toArray()

    const result = []

    this.leaves.forEach(leaf => {
      result.push(leaf.marks.toArray())
    })

    return Array.prototype.concat.apply(first.toArray(), result)
  }

  /**
   * Get the marks on the text at `index`.
   * Corner Cases:
   *   1. if no text is before the index, and index !== 0, then return Set()
   *   2. (for insert after split node or mark at range) if index === 0, and text === '', then return the leaf.marks
   *   3. if index === 0, text !== '', return Set()
   *
   *
   * @param {Number} index
   * @return {Set<Mark>}
   */

  getMarksAtIndex(index) {
    const { leaf } = this.searchLeafAtOffset(index)
    if (!leaf) return Set()
    return leaf.marks
  }

  /**
   * Get a node by `key`, to parallel other nodes.
   *
   * @param {String} key
   * @return {Node|Null}
   */

  getNode(key) {
    return this.key == key ? this : null
  }

  /**
   * Check if the node has a node by `key`, to parallel other nodes.
   *
   * @param {String} key
   * @return {Boolean}
   */

  hasNode(key) {
    return !!this.getNode(key)
  }

  /**
   * Insert `text` at `index`.
   *
   * @param {Numbder} offset
   * @param {String} text
   * @param {Set} marks (optional)
   * @return {Text}
   */

  insertText(offset, text, marks) {
    if (this.text === '') {
      return this.set('leaves', List.of(Leaf.create({ text, marks })))
    }

    if (text.length === 0) return this
    if (!marks) marks = Set()

    const { startOffset, leaf, index } = this.searchLeafAtOffset(offset)
    const delta = offset - startOffset
    const beforeText = leaf.text.slice(0, delta)
    const afterText = leaf.text.slice(delta)
    const { leaves } = this

    if (leaf.marks.equals(marks)) {
      return this.set(
        'leaves',
        leaves.set(index, leaf.set('text', beforeText + text + afterText))
      )
    }

    const nextLeaves = leaves.splice(
      index,
      1,
      leaf.set('text', beforeText),
      Leaf.create({ text, marks }),
      leaf.set('text', afterText)
    )

    return this.setLeaves(nextLeaves)
  }

  /**
   * Regenerate the node's key.
   *
   * @return {Text}
   */

  regenerateKey() {
    const key = KeyUtils.create()
    return this.set('key', key)
  }

  /**
   * Remove a `mark` at `index` and `length`.
   *
   * @param {Number} index
   * @param {Number} length
   * @param {Mark} mark
   * @return {Text}
   */

  removeMark(index, length, mark) {
    if (this.text === '' && index === 0 && length === 0) {
      const first = this.leaves.first()
      if (!first) return this
      const newFirst = first.removeMark(mark)
      if (newFirst === first) return this
      return this.set('leaves', List.of(newFirst))
    }

    if (length <= 0) return this
    if (index >= this.text.length) return this
    const [before, bundle] = Leaf.splitLeaves(this.leaves, index)
    const [middle, after] = Leaf.splitLeaves(bundle, length)
    const leaves = before.concat(middle.map(x => x.removeMark(mark)), after)
    return this.setLeaves(leaves)
  }

  /**
   * Remove text from the text node at `start` for `length`.
   *
   * @param {Number} start
   * @param {Number} length
   * @return {Text}
   */

  removeText(start, length) {
    if (length <= 0) return this
    if (start >= this.text.length) return this

    // PERF: For simple backspace, we can operate directly on the leaf
    if (length === 1) {
      const { leaf, index, startOffset } = this.searchLeafAtOffset(start + 1)
      const offset = start - startOffset

      if (leaf) {
        if (leaf.text.length === 1) {
          const leaves = this.leaves.remove(index)
          return this.setLeaves(leaves)
        }

        const beforeText = leaf.text.slice(0, offset)
        const afterText = leaf.text.slice(offset + length)
        const text = beforeText + afterText

        if (text.length > 0) {
          return this.set(
            'leaves',
            this.leaves.set(index, leaf.set('text', text))
          )
        }
      }
    }

    const [before, bundle] = Leaf.splitLeaves(this.leaves, start)
    const after = Leaf.splitLeaves(bundle, length)[1]
    const leaves = Leaf.createLeaves(before.concat(after))

    if (leaves.size === 1) {
      const first = leaves.first()

      if (first.text === '') {
        return this.set(
          'leaves',
          List.of(first.set('marks', this.getActiveMarks()))
        )
      }
    }

    return this.set('leaves', leaves)
  }

  /**
   * Return a JSON representation of the text.
   *
   * @param {Object} options
   * @return {Object}
   */

  toJSON(options = {}) {
    const object = {
      object: this.object,
      leaves: this.getLeaves()
        .toArray()
        .map(r => r.toJSON()),
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

  /**
   * Update a `mark` at `index` and `length` with `properties`.
   *
   * @param {Number} index
   * @param {Number} length
   * @param {Mark} mark
   * @param {Object} properties
   * @return {Text}
   */

  updateMark(index, length, mark, properties) {
    const newMark = mark.merge(properties)

    if (this.text === '' && length === 0 && index === 0) {
      const { leaves } = this
      const first = leaves.first()
      if (!first) return this
      const newFirst = first.updateMark(mark, newMark)
      if (newFirst === first) return this
      return this.set('leaves', List.of(newFirst))
    }

    if (length <= 0) return this
    if (index >= this.text.length) return this

    const [before, bundle] = Leaf.splitLeaves(this.leaves, index)
    const [middle, after] = Leaf.splitLeaves(bundle, length)

    const leaves = before.concat(
      middle.map(x => x.updateMark(mark, newMark)),
      after
    )

    return this.setLeaves(leaves)
  }

  /**
   * Split this text and return two different texts
   * @param {Number} position
   * @returns {Array<Text>}
   */

  splitText(offset) {
    const splitted = Leaf.splitLeaves(this.leaves, offset)
    const one = this.set('leaves', splitted[0])
    const two = this.set('leaves', splitted[1]).regenerateKey()
    return [one, two]
  }

  /**
   * merge this text and another text at the end
   * @param {Text} text
   * @returns {Text}
   */

  mergeText(text) {
    const leaves = this.leaves.concat(text.leaves)
    return this.setLeaves(leaves)
  }

  /**
   * Normalize the text node with a `schema`.
   *
   * @param {Schema} schema
   * @return {Function|Void}
   */

  normalize(schema) {
    return schema.normalizeNode(this)
  }

  /**
   * Validate the text node against a `schema`.
   *
   * @param {Schema} schema
   * @return {Error|Void}
   */

  validate(schema) {
    return schema.validateNode(this)
  }

  /**
   * Get the first invalid descendant
   * PERF: Do not cache this method; because it can cause cycle reference
   *
   * @param {Schema} schema
   * @returns {Text|Null}
   */

  getFirstInvalidDescendant(schema) {
    return this.validate(schema) ? this : null
  }

  /**
   * Set leaves with normalized `leaves`
   *
   * @param {Schema} schema
   * @returns {Text|Null}
   */

  setLeaves(leaves) {
    const result = Leaf.createLeaves(leaves)

    if (result.size === 1) {
      const first = result.first()

      if (!first.marks || first.marks.size === 0) {
        if (first.text === '') {
          return this.set('leaves', List())
        }
      }
    }

    return this.set('leaves', Leaf.createLeaves(leaves))
  }
}

/**
 * Attach a pseudo-symbol for type checking.
 */

Text.prototype[MODEL_TYPES.TEXT] = true

/**
 * Memoize read methods.
 */

memoize(Text.prototype, [
  'getDecorations',
  'getActiveMarks',
  'getMarks',
  'getMarksAsArray',
  'normalize',
  'validate',
  'getString',
  'getKeysToPathsTable',
])

/**
 * Export.
 *
 * @type {Text}
 */

export default Text
