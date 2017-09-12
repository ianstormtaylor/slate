
import isPlainObject from 'is-plain-object'
import logger from 'slate-dev-logger'
import { List, Record, OrderedSet, is } from 'immutable'

import Character from './character'
import Mark from './mark'
import Range from './range'
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

  static create(attrs = {}) {
    if (Text.isText(attrs)) {
      return attrs
    }

    if (typeof attrs == 'string') {
      attrs = { ranges: [{ text: attrs }] }
    }

    if (isPlainObject(attrs)) {
      if (attrs.text) {
        const { text, marks, key } = attrs
        attrs = { key, ranges: [{ text, marks }] }
      }

      return Text.fromJSON(attrs)
    }

    throw new Error(`\`Text.create\` only accepts objects, arrays, strings or texts, but you passed it: ${attrs}`)
  }

  /**
   * Create a list of `Texts` from a `value`.
   *
   * @param {Array<Text|Object>|List<Text|Object>} value
   * @return {List<Text>}
   */

  static createList(value = []) {
    if (List.isList(value) || Array.isArray(value)) {
      const list = new List(value.map(Text.create))
      return list
    }

    throw new Error(`\`Text.createList\` only accepts arrays or lists, but you passed it: ${value}`)
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

    let {
      ranges = [],
      key = generateKey(),
    } = object

    if (object.text) {
      logger.deprecate('0.23.0', 'Passing `object.text` to `Text.fromJSON` has been deprecated, please use `object.ranges` instead.')
      ranges = [{ text: object.text }]
    }

    const characters = ranges
      .map(Range.fromJSON)
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
   * Check if a `value` is a `Text`.
   *
   * @param {Any} value
   * @return {Boolean}
   */

  static isText(value) {
    return !!(value && value[MODEL_TYPES.TEXT])
  }

  /**
   * Check if a `value` is a list of texts.
   *
   * @param {Any} value
   * @return {Boolean}
   */

  static isTextList(value) {
    return List.isList(value) && value.every(item => Text.isText(item))
  }

  /**
   * Deprecated.
   */

  static createFromString(string) {
    logger.deprecate('0.22.0', 'The `Text.createFromString(string)` method is deprecated, use `Text.create(string)` instead.')
    return Text.create(string)
  }

  /**
   * Deprecated.
   */

  static createFromRanges(ranges) {
    logger.deprecate('0.22.0', 'The `Text.createFromRanges(ranges)` method is deprecated, use `Text.create(ranges)` instead.')
    return Text.create(ranges)
  }

  /**
   * Get the node's kind.
   *
   * @return {String}
   */

  get kind() {
    return 'text'
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
    const characters = this.characters.map((char, i) => {
      if (i < index) return char
      if (i >= index + length) return char
      let { marks } = char
      marks = marks.add(mark)
      char = char.set('marks', marks)
      return char
    })

    return this.set('characters', characters)
  }

  /**
   * Derive a set of decorated characters with `decorators`.
   *
   * @param {Array} decorators
   * @return {List<Character>}
   */

  getDecorations(decorators) {
    const node = this
    let { characters } = node
    if (characters.size == 0) return characters

    for (let i = 0; i < decorators.length; i++) {
      const decorator = decorators[i]
      const decorateds = decorator(node)
      characters = characters.merge(decorateds)
    }

    return characters
  }

  /**
   * Get the decorations for the node from a `schema`.
   *
   * @param {Schema} schema
   * @return {Array}
   */

  getDecorators(schema) {
    return schema.__getDecorators(this)
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
    return this.key == key
      ? this
      : null
  }

  /**
   * Derive the ranges for a list of `characters`.
   *
   * @param {Array|Void} decorators (optional)
   * @return {List<Range>}
   */

  getRanges(decorators = []) {
    const characters = this.getDecorations(decorators)
    let ranges = []

    // PERF: cache previous values for faster lookup.
    let prevChar
    let prevRange

    // If there are no characters, return one empty range.
    if (characters.size == 0) {
      ranges.push({})
    }

    // Otherwise, loop the characters and build the ranges...
    else {
      characters.forEach((char, i) => {
        const { marks, text } = char

        // The first one can always just be created.
        if (i == 0) {
          prevChar = char
          prevRange = { text, marks }
          ranges.push(prevRange)
          return
        }

        // Otherwise, compare the current and previous marks.
        const prevMarks = prevChar.marks
        const isSame = is(marks, prevMarks)

        // If the marks are the same, add the text to the previous range.
        if (isSame) {
          prevChar = char
          prevRange.text += text
          return
        }

        // Otherwise, create a new range.
        prevChar = char
        prevRange = { text, marks }
        ranges.push(prevRange)
      }, [])
    }

    // PERF: convert the ranges to immutable objects after iterating.
    ranges = new List(ranges.map(object => new Range(object)))

    // Return the ranges.
    return ranges
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
    const chars = Character.createList(text.split('').map(char => ({ text: char, marks })))

    characters = characters.slice(0, index)
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
      key: this.key,
      kind: this.kind,
      ranges: this.getRanges().toArray().map(r => r.toJSON()),
    }

    if (!options.preserveKeys) {
      delete object.key
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
    return schema.__validate(this)
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
  'getMarks',
  'getMarksAsArray',
], {
  takesArguments: false,
})

memoize(Text.prototype, [
  'getDecorations',
  'getDecorators',
  'getMarksAtIndex',
  'getRanges',
  'validate'
], {
  takesArguments: true,
})

/**
 * Export.
 *
 * @type {Text}
 */

export default Text
