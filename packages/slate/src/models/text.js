import isPlainObject from 'is-plain-object'
import invariant from 'tiny-invariant'
import { List, Record } from 'immutable'

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

const Leaf = Record({
  text: undefined,
  marks: undefined,
  annotations: undefined,
  decorations: undefined,
})

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
   * Get a list of uniquely-formatted leaves for the text node, given its
   * existing marks, and its current `annotations` and `decorations`.
   *
   * @param {Map<String,Annotation>} annotations
   * @param {List<Decoration>} decorations
   * @return {List<Leaf>}
   */

  getLeaves(annotations, decorations) {
    const { text, marks } = this
    let leaves = [{ text, marks, annotations: [], decorations: [] }]

    // Helper to split a leaf into two `at` an offset.
    const split = (leaf, at) => {
      return [
        {
          text: leaf.text.slice(0, at),
          marks: leaf.marks,
          annotations: [...leaf.annotations],
          decorations: [...leaf.decorations],
        },
        {
          text: leaf.text.slice(at),
          marks: leaf.marks,
          annotations: [...leaf.annotations],
          decorations: [...leaf.decorations],
        },
      ]
    }

    // Helper to compile the leaves for a `kind` of format.
    const compile = kind => {
      const formats =
        kind === 'annotations' ? annotations.values() : decorations

      for (const format of formats) {
        const { start, end } = format
        const next = []
        let o = 0

        for (const leaf of leaves) {
          const { length } = leaf.text
          const offset = o
          o += length

          // If the range encompases the entire leaf, add the format.
          if (start.offset <= offset && end.offset >= offset + length) {
            leaf[kind].push(format)
            next.push(leaf)
            continue
          }

          // If the range starts after the leaf, or ends before it, continue.
          if (
            start.offset > offset + length ||
            end.offset < offset ||
            (end.offset === offset && offset !== 0)
          ) {
            next.push(leaf)
            continue
          }

          // Otherwise we need to split the leaf, at the start, end, or both,
          // and add the format to the middle intersecting section. Do the end
          // split first since we don't need to update the offset that way.
          let middle = leaf
          let before
          let after

          if (end.offset < offset + length) {
            ;[middle, after] = split(middle, end.offset - offset)
          }

          if (start.offset > offset) {
            ;[before, middle] = split(middle, start.offset - offset)
          }

          middle[kind].push(format)

          if (before) {
            next.push(before)
          }

          next.push(middle)

          if (after) {
            next.push(after)
          }
        }

        leaves = next
      }
    }

    compile('annotations')
    compile('decorations')

    leaves = leaves.map(leaf => {
      return new Leaf({
        ...leaf,
        annotations: List(leaf.annotations),
        decorations: List(leaf.decorations),
      })
    })

    const list = List(leaves)
    return list
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
