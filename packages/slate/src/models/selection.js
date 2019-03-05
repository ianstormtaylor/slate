import isPlainObject from 'is-plain-object'
import { Record, Set } from 'immutable'

import Mark from './mark'
import Point from './point'
import Range from './range'

/**
 * Default properties.
 *
 * @type {Object}
 */

const DEFAULTS = {
  anchor: undefined,
  focus: undefined,
  isFocused: undefined,
  marks: undefined,
}

/**
 * Selection.
 *
 * @type {Selection}
 */

class Selection extends Record(DEFAULTS) {
  /**
   * Create a new `Selection` with `attrs`.
   *
   * @param {Object|Selection} attrs
   * @return {Selection}
   */

  static create(attrs = {}) {
    if (Selection.isSelection(attrs)) {
      return attrs
    }

    if (Range.isRange(attrs)) {
      return Selection.fromJSON(Range.createProperties(attrs))
    }

    if (isPlainObject(attrs)) {
      return Selection.fromJSON(attrs)
    }

    throw new Error(
      `\`Selection.create\` only accepts objects, ranges or selections, but you passed it: ${attrs}`
    )
  }

  /**
   * Create a dictionary of settable selection properties from `attrs`.
   *
   * @param {Object|String|Selection} attrs
   * @return {Object}
   */

  static createProperties(a = {}) {
    if (Selection.isSelection(a)) {
      return {
        anchor: Point.createProperties(a.anchor),
        focus: Point.createProperties(a.focus),
        isFocused: a.isFocused,
        marks: a.marks,
      }
    }

    if (Range.isRange(a)) {
      return {
        anchor: Point.createProperties(a.anchor),
        focus: Point.createProperties(a.focus),
      }
    }

    if (isPlainObject(a)) {
      const p = {}
      if ('anchor' in a) p.anchor = Point.create(a.anchor)
      if ('focus' in a) p.focus = Point.create(a.focus)
      if ('isFocused' in a) p.isFocused = a.isFocused
      if ('marks' in a)
        p.marks = a.marks == null ? null : Mark.createSet(a.marks)
      return p
    }

    throw new Error(
      `\`Selection.createProperties\` only accepts objects, ranges or selections, but you passed it: ${a}`
    )
  }

  /**
   * Create a `Selection` from a JSON `object`.
   *
   * @param {Object} object
   * @return {Selection}
   */

  static fromJSON(object) {
    const { anchor, focus, isFocused = false, marks = null } = object
    const selection = new Selection({
      anchor: Point.fromJSON(anchor || {}),
      focus: Point.fromJSON(focus || {}),
      isFocused,
      marks: marks == null ? null : new Set(marks.map(Mark.fromJSON)),
    })

    return selection
  }

  /**
   * Check whether the selection is blurred.
   *
   * @return {Boolean}
   */

  get isBlurred() {
    return !this.isFocused
  }

  /**
   * Set the `isFocused` property to a new `value`.
   *
   * @param {Boolean} value
   * @return {Selection}
   */

  setIsFocused(value) {
    const selection = this.set('isFocused', value)
    return selection
  }

  /**
   * Set the `marks` property to a new set of `marks`.
   *
   * @param {Set} marks
   * @return {Selection}
   */

  setMarks(marks) {
    const selection = this.set('marks', marks)
    return selection
  }

  /**
   * Set new `properties` on the selection.
   *
   * @param {Object|Range|Selection} properties
   * @return {Range}
   */

  setProperties(properties) {
    properties = Selection.createProperties(properties)
    const { anchor, focus, ...props } = properties

    if (anchor) {
      props.anchor = Point.create(anchor)
    }

    if (focus) {
      props.focus = Point.create(focus)
    }

    const selection = this.merge(props)
    return selection
  }

  /**
   * Return a JSON representation of the selection.
   *
   * @param {Object} options
   * @return {Object}
   */

  toJSON(options = {}) {
    const object = {
      object: this.object,
      anchor: this.anchor.toJSON(options),
      focus: this.focus.toJSON(options),
      isFocused: this.isFocused,
      marks:
        this.marks == null ? null : this.marks.toArray().map(m => m.toJSON()),
    }

    return object
  }
}

/**
 * Export.
 *
 * @type {Selection}
 */

export default Selection
