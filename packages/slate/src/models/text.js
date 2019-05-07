import isPlainObject from 'is-plain-object'
import invariant from 'tiny-invariant'
import { List, Record } from 'immutable'

import Leaf from './leaf'
import Mark from './mark'
import KeyUtils from '../utils/key-utils'

/**
 * Default properties.
 *
 * @type {Object}
 */

const DEFAULTS = {
  key: undefined,
  marks: undefined,
  text: undefined,
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

    if (typeof attrs === 'string') {
      attrs = { text: attrs }
    }

    if (isPlainObject(attrs)) {
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

    invariant(
      object.leaves == null,
      'As of slate@0.46, the `leaves` property of text nodes has been removed! Each individual leaf should be created as a text node instead.'
    )

    const { text = '', marks = [], key = KeyUtils.create() } = object
    const node = new Text({
      key,
      text,
      marks: Mark.createSet(marks),
    })

    return node
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
   * Add a `mark`.
   *
   * @param {Mark} mark
   * @return {Text}
   */

  addMark(mark) {
    mark = Mark.create(mark)
    const { marks } = this
    const next = marks.add(mark)
    const node = this.set('marks', next)
    return node
  }

  /**
   * Add a set of `marks`.
   *
   * @param {Set<Mark>} marks
   * @return {Text}
   */

  addMarks(marks) {
    marks = Mark.createSet(marks)
    const node = this.set('marks', this.marks.union(marks))
    return node
  }

  /**
   * Get the leaves for the text node, with `markers`.
   *
   * @param {List<Annotation|Decoration>} markers
   * @return {List<Leaf>}
   */

  getLeaves(markers) {
    const { key, text, marks } = this
    const leaf = Leaf.create({ text, marks })
    let leaves = Leaf.createList([leaf])

    // PERF: We can exit early without markers.
    if (!markers || markers.size === 0) {
      return leaves
    }

    // HACK: this shouldn't be necessary, because the loop below should handle
    // the `0` case without failures. It may already even, not sure.
    if (text === '') {
      const markerMarks = markers.map(m => m.mark)
      const l = Leaf.create({ marks: markerMarks })
      return List([l])
    }

    markers.forEach(m => {
      const { start, end, mark } = m
      const hasStart = start.key === key
      const hasEnd = end.key === key

      if (hasStart && hasEnd) {
        const index = hasStart ? start.offset : 0
        const length = hasEnd ? end.offset - index : text.length - index

        if (length < 1) return
        if (index >= text.length) return

        if (index !== 0 || length < text.length) {
          const [before, bundle] = Leaf.splitLeaves(leaves, index)
          const [middle, after] = Leaf.splitLeaves(bundle, length)
          leaves = before.concat(middle.map(x => x.addMark(mark)), after)
          return
        }
      }

      leaves = leaves.map(x => x.addMark(mark))
    })

    return Leaf.createLeaves(leaves)
  }

  /**
   * Insert `text` at `index`.
   *
   * @param {Number} index
   * @param {String} string
   * @return {Text}
   */

  insertText(index, string) {
    const { text } = this
    const next = text.slice(0, index) + string + text.slice(index)
    const node = this.set('text', next)
    return node
  }

  /**
   * Remove a `mark`.
   *
   * @param {Mark} mark
   * @return {Text}
   */

  removeMark(mark) {
    mark = Mark.create(mark)
    const { marks } = this
    const next = marks.remove(mark)
    const node = this.set('marks', next)
    return node
  }

  /**
   * Remove text from the text node at `index` for `length`.
   *
   * @param {Number} index
   * @param {Number} length
   * @return {Text}
   */

  removeText(index, length) {
    const { text } = this
    const next = text.slice(0, index) + text.slice(index + length)
    const node = this.set('text', next)
    return node
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
      text: this.text,
      marks: this.marks.toArray().map(m => m.toJSON()),
    }

    if (options.preserveKeys) {
      object.key = this.key
    }

    return object
  }

  /**
   * Set a `newProperties` on an existing `mark`.
   *
   * @param {Object} mark
   * @param {Object} newProperties
   * @return {Text}
   */

  setMark(properties, newProperties) {
    const { marks } = this
    const mark = Mark.create(properties)
    const newMark = mark.merge(newProperties)
    const next = marks.remove(mark).add(newMark)
    const node = this.set('marks', next)
    return node
  }

  /**
   * Split the node into two at `index`.
   *
   * @param {Number} index
   * @returns {Array<Text>}
   */

  splitText(index) {
    const { text } = this
    const one = this.set('text', text.slice(0, index))
    const two = this.set('text', text.slice(index)).regenerateKey()
    return [one, two]
  }

  /**
   * Merge the node with an `other` text node.
   *
   * @param {Text} other
   * @returns {Text}
   */

  mergeText(other) {
    const next = this.text + other.text
    const node = this.set('text', next)
    return node
  }
}

/**
 * Export.
 *
 * @type {Text}
 */

export default Text
