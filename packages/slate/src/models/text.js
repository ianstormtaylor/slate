import isPlainObject from 'is-plain-object'
import logger from 'slate-dev-logger'
import { List, OrderedSet, Record, Set, is } from 'immutable'

import Character from './character'
import Mark from './mark'
import Leaf from './leaf'
import MODEL_TYPES from '../constants/model-types'
import generateKey from '../utils/generate-key'
import memoize from '../utils/memoize'

/**
 * Default properties.
 *
 * @type {Object}
 */

const DEFAULTS = {
  characters: new List(),
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

    const { leaves = [], key = generateKey() } = object

    const characters = leaves
      .map(Leaf.fromJSON)
      .reduce((l, r) => l.concat(r.getCharacters()), new List())

    const node = new Text({
      characters,
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

  static isText(any) {
    return !!(any && any[MODEL_TYPES.TEXT])
  }

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
    return this.characters.reduce((string, char) => string + char.text, '')
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
    const marks = new Set([mark])
    return this.addMarks(index, length, marks)
  }

  /**
   * Add a `set` of marks at `index` and `length`.
   *
   * @param {Number} index
   * @param {Number} length
   * @param {Set<Mark>} set
   * @return {Text}
   */

  addMarks(index, length, set) {
    const characters = this.characters.map((char, i) => {
      if (i < index) return char
      if (i >= index + length) return char
      let { marks } = char
      marks = marks.union(set)
      char = char.set('marks', marks)
      return char
    })

    return this.set('characters', characters)
  }

  /**
   * Derive a set of decorated characters with `decorations`.
   *
   * @param {List<Decoration>} decorations
   * @return {List<Character>}
   */

  getDecoratedCharacters(decorations) {
    let node = this
    const { key, characters } = node

    // PERF: Exit early if there are no characters to be decorated.
    if (characters.size == 0) return characters

    decorations.forEach(range => {
      const { startKey, endKey, startOffset, endOffset, marks } = range
      const hasStart = startKey == key
      const hasEnd = endKey == key
      const index = hasStart ? startOffset : 0
      const length = hasEnd ? endOffset - index : characters.size
      node = node.addMarks(index, length, marks)
    })

    return node.characters
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
   * Derive the leaves for a list of `characters`.
   *
   * @param {Array|Void} decorations (optional)
   * @return {List<Leaf>}
   */

  getLeaves(decorations = []) {
    const characters = this.getDecoratedCharacters(decorations)
    let leaves = []

    // PERF: cache previous values for faster lookup.
    let prevChar
    let prevLeaf

    // If there are no characters, return one empty range.
    if (characters.size == 0) {
      leaves.push({})
    } else {
      // Otherwise, loop the characters and build the leaves...
      characters.forEach((char, i) => {
        const { marks, text } = char

        // The first one can always just be created.
        if (i == 0) {
          prevChar = char
          prevLeaf = { text, marks }
          leaves.push(prevLeaf)
          return
        }

        // Otherwise, compare the current and previous marks.
        const prevMarks = prevChar.marks
        const isSame = is(marks, prevMarks)

        // If the marks are the same, add the text to the previous range.
        if (isSame) {
          prevChar = char
          prevLeaf.text += text
          return
        }

        // Otherwise, create a new range.
        prevChar = char
        prevLeaf = { text, marks }
        leaves.push(prevLeaf)
      }, [])
    }

    // PERF: convert the leaves to immutable objects after iterating.
    leaves = new List(leaves.map(object => new Leaf(object)))

    // Return the leaves.
    return leaves
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
    return this.characters.reduce((array, char) => {
      return array.concat(char.marks.toArray())
    }, [])
  }

  /**
   * Get the marks on the text at `index`.
   *
   * @param {Number} index
   * @return {Set<Mark>}
   */

  getMarksAtIndex(index) {
    if (index == 0) return Mark.createSet()
    const { characters } = this
    const char = characters.get(index - 1)
    if (!char) return Mark.createSet()
    return char.marks
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
   * @param {Numbder} index
   * @param {String} text
   * @param {String} marks (optional)
   * @return {Text}
   */

  insertText(index, text, marks) {
    let { characters } = this
    const chars = Character.createList(
      text.split('').map(char => ({ text: char, marks }))
    )

    characters = characters
      .slice(0, index)
      .concat(chars)
      .concat(characters.slice(index))

    return this.set('characters', characters)
  }

  /**
   * Regenerate the node's key.
   *
   * @return {Text}
   */

  regenerateKey() {
    const key = generateKey()
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
    const characters = this.characters.map((char, i) => {
      if (i < index) return char
      if (i >= index + length) return char
      let { marks } = char
      marks = marks.remove(mark)
      char = char.set('marks', marks)
      return char
    })

    return this.set('characters', characters)
  }

  /**
   * Remove text from the text node at `index` for `length`.
   *
   * @param {Number} index
   * @param {Number} length
   * @return {Text}
   */

  removeText(index, length) {
    let { characters } = this
    const start = index
    const end = index + length
    characters = characters.filterNot((char, i) => start <= i && i < end)
    return this.set('characters', characters)
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

    const characters = this.characters.map((char, i) => {
      if (i < index) return char
      if (i >= index + length) return char
      let { marks } = char
      if (!marks.has(mark)) return char
      marks = marks.remove(mark)
      marks = marks.add(newMark)
      char = char.set('marks', marks)
      return char
    })

    return this.set('characters', characters)
  }

  /**
   * Validate the text node against a `schema`.
   *
   * @param {Schema} schema
   * @return {Object|Void}
   */

  validate(schema) {
    return schema.validateNode(this)
  }

  /**
   * The first descendant key requiring validation
   *
   * @param {Schema} schema
   * @returns {String|Null}
   */

  getFirstInvalidDescendantKey(schema) {
    return this.validate(schema) ? this.key : null
  }
}

/**
 * Attach a pseudo-symbol for type checking.
 */

Text.prototype[MODEL_TYPES.TEXT] = true

/**
 * Memoize read methods.
 */

memoize(Text.prototype, ['getMarks', 'getMarksAsArray'], {
  takesArguments: false,
})

memoize(
  Text.prototype,
  [
    'getDecoratedCharacters',
    'getDecorations',
    'getLeaves',
    'getMarksAtIndex',
    'validate',
  ],
  {
    takesArguments: true,
  }
)

/**
 * Export.
 *
 * @type {Text}
 */

export default Text
