
import Character from './character'
import Mark from './mark'
import memoize from '../utils/memoize'
import uid from '../utils/uid'
import { List, Record, Set } from 'immutable'

/**
 * Range.
 */

const Range = new Record({
  kind: 'range',
  marks: new Set(),
  text: ''
})

/**
 * Default properties.
 */

const DEFAULTS = {
  characters: new List(),
  decorations: null,
  key: null,
  cache: null
}

/**
 * Text.
 */

class Text extends new Record(DEFAULTS) {

  /**
   * Create a new `Text` with `properties`.
   *
   * @param {Object} properties
   * @return {Text} text
   */

  static create(properties = {}) {
    if (properties instanceof Text) return properties
    properties.key = properties.key || uid(4)
    properties.characters = Character.createList(properties.characters)
    properties.decorations = null
    properties.cache = null
    return new Text(properties)
  }

  /**
   * Create a list of `Texts` from an array.
   *
   * @param {Array} elements
   * @return {List} map
   */

  static createList(elements = []) {
    if (List.isList(elements)) return elements
    return new List(elements.map(Text.create))
  }

  /**
   * Get the node's kind.
   *
   * @return {String} kind
   */

  get kind() {
    return 'text'
  }

  /**
   * Is the node empty?
   *
   * @return {Boolean} isEmpty
   */

  get isEmpty() {
    return this.length == 0
  }

  /**
   * Get the length of the concatenated text of the node.
   *
   * @return {Number} length
   */

  get length() {
    return this.text.length
  }

  /**
   * Get the concatenated text of the node.
   *
   * @return {String} text
   */

  get text() {
    return this.characters
      .map(char => char.text)
      .join('')
  }

  /**
   * Decorate the text node's characters with a `decorator` function.
   *
   * @param {Function} decorator
   * @return {Text} text
   */

  decorateCharacters(decorator) {
    let { characters, cache } = this
    if (characters == cache) return this

    const decorations = this.getDecoratedCharacters(decorator)
    if (decorations == characters) return this

    return this.merge({
      cache: characters,
      decorations,
    })
  }

  /**
   * Get the decorated characters.
   *
   * @return {List} characters
   */

  getDecoratedCharacters(decorator) {
    return decorator(this)
  }

  /**
   * Get the decorated characters grouped by marks.
   *
   * @return {List} ranges
   */

  getDecoratedRanges() {
    return this.getRangesForCharacters(this.decorations || this.characters)
  }

  /**
   * Get the characters grouped by marks.
   *
   * @return {List} ranges
   */

  getRanges() {
    return this.getRangesForCharacters(this.characters)
  }

  /**
   * Derive the ranges for a list of `characters`.
   *
   * @param {List} characters
   * @return {List}
   */

  getRangesForCharacters(characters) {
    if (characters.size == 0) {
      let ranges = new List()
      ranges = ranges.push(new Range())
      return ranges
    }

    return characters
      .toList()
      .reduce((ranges, char, i) => {
        const { marks, text } = char

        // The first one can always just be created.
        if (i == 0) {
          return ranges.push(new Range({ text, marks }))
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
          const index = ranges.size - 1
          let prevRange = ranges.get(index)
          let prevText = prevRange.get('text')
          prevRange = prevRange.set('text', prevText += text)
          return ranges.set(index, prevRange)
        }

        // Otherwise, create a new range.
        return ranges.push(new Range({ text, marks }))
      }, new List())
  }

  /**
   * Remove characters from the text node from `start` to `end`.
   *
   * @param {Number} start
   * @param {Number} end
   * @return {Text} text
   */

  removeCharacters(start, end) {
    let { characters } = this

    characters = characters.filterNot((char, i) => {
      return start <= i && i < end
    })

    return this.merge({ characters })
  }

  /**
   * Insert text `string` at `index`.
   *
   * @param {Numbder} index
   * @param {String} string
   * @param {String} marks (optional)
   * @return {Text} text
   */

  insertText(index, string, marks) {
    let { characters } = this

    if (!marks) {
      const prev = index ? characters.get(index - 1) : null
      marks = prev ? prev.marks : Mark.createSet()
    }

    const chars = Character.createList(string.split('').map((char) => {
      return {
        text: char,
        marks
      }
    }))

    characters = characters.slice(0, index)
      .concat(chars)
      .concat(characters.slice(index))

    return this.merge({ characters })
  }

}

/**
 * Memoize read methods.
 */

memoize(Text.prototype, [
  'getDecoratedCharacters',
  'getDecoratedRanges',
  'getRanges',
  'getRangesForCharacters'
])

/**
 * Export.
 */

export default Text
