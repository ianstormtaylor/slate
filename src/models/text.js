
import Character from './character'
import Mark from './mark'
import Range from './range'
import memoize from '../utils/memoize'
import generateKey from '../utils/generate-key'
import { List, Record, Set } from 'immutable'

/**
 * Default properties.
 *
 * @type {Object}
 */

const DEFAULTS = {
  characters: new List(),
  key: null
}

/**
 * Text.
 *
 * @type {Text}
 */

class Text extends new Record(DEFAULTS) {

  /**
   * Create a new `Text` with `properties`.
   *
   * @param {Object|Text} properties
   * @return {Text}
   */

  static create(properties = {}) {
    if (properties instanceof Text) return properties
    properties.key = properties.key || generateKey()
    properties.characters = Character.createList(properties.characters)
    return new Text(properties)
  }

  /**
   * Create a new `Text` from a string
   *
   * @param {String} text
   * @param {Set<Mark>} marks (optional)
   * @return {Text}
   */

  static createFromString(text, marks = Set()) {
    return Text.createFromRanges([
      Range.create({ text, marks })
    ])
  }

  /**
   * Create a new `Text` from a list of ranges
   *
   * @param {List<Range>|Array<Range>} ranges
   * @return {Text}
   */

  static createFromRanges(ranges) {
    return Text.create({
      characters: ranges.reduce((characters, range) => {
        range = Range.create(range)
        return characters.concat(range.getCharacters())
      }, Character.createList())
    })
  }

  /**
   * Create a list of `Texts` from an array.
   *
   * @param {Array} elements
   * @return {List<Text>}
   */

  static createList(elements = []) {
    if (List.isList(elements)) return elements
    return new List(elements.map(Text.create))
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
   * Get the length of the concatenated text of the node.
   *
   * @return {Number}
   */

  get length() {
    return this.text.length
  }

  /**
   * Get the concatenated text of the node.
   *
   * @return {String}
   */

  get text() {
    return this.characters
      .reduce((result, char) => result + char.text, '')
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
      char = char.merge({ marks })
      return char
    })

    return this.merge({ characters })
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

    for (const decorator of decorators) {
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
    const list = new List()
    let characters = this.getDecorations(decorators)

    // If there are no characters, return one empty range.
    if (characters.size == 0) {
      return list.push(new Range())
    }

    // Convert the now-decorated characters into ranges.
    const ranges = characters.reduce((memo, char, i) => {
      const { marks, text } = char

      // The first one can always just be created.
      if (i == 0) {
        return memo.push(new Range({ text, marks }))
      }

      // Otherwise, compare to the previous and see if a new range should be
      // created, or whether the text should be added to the previous range.
      const previous = characters.get(i - 1)
      const prevMarks = previous.marks
      const added = marks.filterNot(mark => prevMarks.includes(mark))
      const removed = prevMarks.filterNot(mark => marks.includes(mark))
      const isSame = !added.size && !removed.size

      // If the marks are the same, add the text to the previous range.
      if (isSame) {
        const index = memo.size - 1
        let prevRange = memo.get(index)
        let prevText = prevRange.get('text')
        prevRange = prevRange.set('text', prevText += text)
        return memo.set(index, prevRange)
      }

      // Otherwise, create a new range.
      return memo.push(new Range({ text, marks }))
    }, list)

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
    marks = marks || this.getMarksAtIndex(index)
    let { characters } = this
    const chars = Character.createListFromText(text, marks)

    characters = characters.slice(0, index)
      .concat(chars)
      .concat(characters.slice(index))

    return this.merge({ characters })
  }

  /**
   * Regenerate the node's key.
   *
   * @return {Text}
   */

  regenerateKey() {
    return this.merge({ key: generateKey() })
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
      char = char.merge({ marks })
      return char
    })

    return this.merge({ characters })
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
    let start = index
    let end = index + length
    characters = characters.filterNot((char, i) => start <= i && i < end)
    return this.merge({ characters })
  }

  /**
   * Update a `mark` at `index` and `length` with `properties`.
   *
   * @param {Number} index
   * @param {Number} length
   * @param {Mark} mark
   * @param {Mark} newMark
   * @return {Text}
   */

  updateMark(index, length, mark, newMark) {
    const characters = this.characters.map((char, i) => {
      if (i < index) return char
      if (i >= index + length) return char
      let { marks } = char
      if (!marks.has(mark)) return char
      marks = marks.remove(mark)
      marks = marks.add(newMark)
      char = char.merge({ marks })
      return char
    })

    return this.merge({ characters })
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
 * Memoize read methods.
 */

memoize(Text.prototype, [
  'getDecorations',
  'getDecorators',
  'getRanges',
  'validate'
])

/**
 * Export.
 *
 * @type {Text}
 */

export default Text
