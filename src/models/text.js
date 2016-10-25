
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
  key: null
}

/**
 * Text.
 */

class Text extends new Record(DEFAULTS) {

  /**
   * Create a new `Text` with `properties`.
   *
   * @param {Object} properties
   * @return {Text}
   */

  static create(properties = {}) {
    if (properties instanceof Text) return properties
    properties.key = properties.key || uid(4)
    properties.characters = Character.createList(properties.characters)
    return new Text(properties)
  }

  /**
   * Create a new `Text` from a string
   *
   * @param {String} content
   * @return {Text}
   */

  static createFromString(content) {
      return Text.create({
        characters: Character.createList(
          content.split('')
          .map(c => {
            return { text: c }
          })
        )
      })
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
    return this.text == ''
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
   * @return {List}
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
   * @return {Set}
   */

  getMarksAtIndex(index) {
    if (index == 0) return Mark.createSet()
    const { characters } = this
    const char = characters.get(index - 1)
    if (!char) return Mark.createSet()
    return char.marks
  }

  /**
   * Derive the ranges for a list of `characters`.
   *
   * @param {Array || Void} decorators (optional)
   * @return {List}
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
    return this.merge({ key: uid() })
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
   * @param {Object} properties
   * @return {Text}
   */

  updateMark(index, length, mark, properties) {
    const m = mark.merge(properties)
    const characters = this.characters.map((char, i) => {
      if (i < index) return char
      if (i >= index + length) return char
      let { marks } = char
      if (!marks.has(mark)) return char
      marks = marks.remove(mark)
      marks = marks.add(m)
      char = char.merge({ marks })
      return char
    })

    return this.merge({ characters })
  }

  /**
   * Validate the node against a `schema`.
   *
   * @param {Schema} schema
   * @return {Object || Void}
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
  'validate',
])

/**
 * Export.
 */

export default Text
