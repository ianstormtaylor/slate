import isPlainObject from 'is-plain-object'
import logger from 'slate-dev-logger'
import { List, Record, Set } from 'immutable'

import PathUtils from '../utils/path-utils'
import MODEL_TYPES from '../constants/model-types'
import Mark from './mark'

/**
 * Default properties.
 *
 * @type {Object}
 */

const DEFAULTS = {
  anchorKey: null,
  anchorOffset: null,
  anchorPath: null,
  focusKey: null,
  focusOffset: null,
  focusPath: null,
  isAtomic: false,
  isFocused: false,
  marks: null,
}

/**
 * Range.
 *
 * @type {Range}
 */

class Range extends Record(DEFAULTS) {
  /**
   * Create a new `Range` with `attrs`.
   *
   * @param {Object|Range} attrs
   * @return {Range}
   */

  static create(attrs = {}) {
    if (Range.isRange(attrs)) {
      return attrs
    }

    if (isPlainObject(attrs)) {
      return Range.fromJSON(attrs)
    }

    throw new Error(
      `\`Range.create\` only accepts objects or ranges, but you passed it: ${attrs}`
    )
  }

  /**
   * Create a list of `Ranges` from `elements`.
   *
   * @param {Array<Range|Object>|List<Range|Object>} elements
   * @return {List<Range>}
   */

  static createList(elements = []) {
    if (List.isList(elements) || Array.isArray(elements)) {
      const list = new List(elements.map(Range.create))
      return list
    }

    throw new Error(
      `\`Range.createList\` only accepts arrays or lists, but you passed it: ${elements}`
    )
  }

  /**
   * Create a dictionary of settable range properties from `attrs`.
   *
   * @param {Object|String|Range} attrs
   * @return {Object}
   */

  static createProperties(a = {}) {
    if (Range.isRange(a)) {
      return {
        anchorKey: a.anchorKey,
        anchorOffset: a.anchorOffset,
        anchorPath: a.anchorPath,
        focusKey: a.focusKey,
        focusOffset: a.focusOffset,
        focusPath: a.focusPath,
        isAtomic: a.isAtomic,
        isFocused: a.isFocused,
        marks: a.marks,
      }
    }

    if (isPlainObject(a)) {
      const p = {}
      if ('anchorKey' in a) p.anchorKey = a.anchorKey
      if ('anchorOffset' in a) p.anchorOffset = a.anchorOffset
      if ('anchorPath' in a) p.anchorPath = PathUtils.create(a.anchorPath)
      if ('focusKey' in a) p.focusKey = a.focusKey
      if ('focusOffset' in a) p.focusOffset = a.focusOffset
      if ('focusPath' in a) p.focusPath = PathUtils.create(a.focusPath)
      if ('isAtomic' in a) p.isAtomic = a.isAtomic
      if ('isFocused' in a) p.isFocused = a.isFocused
      if ('marks' in a)
        p.marks = a.marks == null ? null : Mark.createSet(a.marks)

      // If only a path is set, or only a key is set, ensure that the other is
      // set to null so that it can be normalized back to the right value.
      // Otherwise we won't realize that the path and key don't match anymore.
      if ('anchorPath' in a && !('anchorKey' in a)) p.anchorKey = null
      if ('anchorKey' in a && !('anchorPath' in a)) p.anchorPath = null
      if ('focusPath' in a && !('focusKey' in a)) p.focusKey = null
      if ('focusKey' in a && !('focusPath' in a)) p.focusPath = null

      return p
    }

    throw new Error(
      `\`Range.createProperties\` only accepts objects or ranges, but you passed it: ${a}`
    )
  }

  /**
   * Create a `Range` from a JSON `object`.
   *
   * @param {Object} object
   * @return {Range}
   */

  static fromJSON(object) {
    const {
      anchorKey = null,
      anchorOffset = null,
      anchorPath = null,
      focusKey = null,
      focusOffset = null,
      focusPath = null,
      isAtomic = false,
      isFocused = false,
      marks = null,
    } = object

    const range = new Range({
      anchorKey,
      anchorOffset,
      anchorPath: PathUtils.create(anchorPath),
      focusKey,
      focusOffset,
      focusPath: PathUtils.create(focusPath),
      isAtomic,
      isFocused,
      marks: marks == null ? null : new Set(marks.map(Mark.fromJSON)),
    })

    return range
  }

  /**
   * Alias `fromJS`.
   */

  static fromJS = Range.fromJSON

  /**
   * Check if an `obj` is a `Range`.
   *
   * @param {Any} obj
   * @return {Boolean}
   */

  static isRange(obj) {
    return !!(obj && obj[MODEL_TYPES.RANGE])
  }

  /**
   * Object.
   *
   * @return {String}
   */

  get object() {
    return 'range'
  }

  get kind() {
    logger.deprecate(
      'slate@0.32.0',
      'The `kind` property of Slate objects has been renamed to `object`.'
    )
    return this.object
  }

  /**
   * Check whether the range is blurred.
   *
   * @return {Boolean}
   */

  get isBlurred() {
    return !this.isFocused
  }

  /**
   * Check whether the range is collapsed.
   *
   * @return {Boolean}
   */

  get isCollapsed() {
    return (
      this.anchorKey == this.focusKey && this.anchorOffset == this.focusOffset
    )
  }

  /**
   * Check whether the range is expanded.
   *
   * @return {Boolean}
   */

  get isExpanded() {
    return !this.isCollapsed
  }

  /**
   * Check whether the range is backward.
   *
   * @return {Boolean}
   */

  get isBackward() {
    if (this.isUnset) return null

    // PERF: if the two keys are the same, we can just use the offsets.
    if (this.anchorKey === this.focusKey) {
      return this.anchorOffset > this.focusOffset
    }

    const isBackward = PathUtils.isBefore(this.focusPath, this.anchorPath)
    return isBackward
  }

  /**
   * Check whether the range is forward.
   *
   * @return {Boolean}
   */

  get isForward() {
    const { isBackward } = this
    return isBackward == null ? null : !isBackward
  }

  /**
   * Check whether the range isn't set.
   *
   * @return {Boolean}
   */

  get isUnset() {
    return (
      this.anchorKey == null ||
      this.anchorOffset == null ||
      this.anchorPath == null ||
      this.focusKey == null ||
      this.focusOffset == null ||
      this.focusPath == null
    )
  }

  /**
   * Check whether the range is set.
   *
   * @return {Boolean}
   */

  get isSet() {
    return !this.isUnset
  }

  /**
   * Get the start key.
   *
   * @return {String}
   */

  get startKey() {
    return this.isBackward ? this.focusKey : this.anchorKey
  }

  /**
   * Get the start offset.
   *
   * @return {String}
   */

  get startOffset() {
    return this.isBackward ? this.focusOffset : this.anchorOffset
  }

  /**
   * Get the start path.
   *
   * @return {String}
   */

  get startPath() {
    return this.isBackward ? this.focusPath : this.anchorPath
  }

  /**
   * Get the end key.
   *
   * @return {String}
   */

  get endKey() {
    return this.isBackward ? this.anchorKey : this.focusKey
  }

  /**
   * Get the end offset.
   *
   * @return {String}
   */

  get endOffset() {
    return this.isBackward ? this.anchorOffset : this.focusOffset
  }

  /**
   * Get the end path.
   *
   * @return {String}
   */

  get endPath() {
    return this.isBackward ? this.anchorPath : this.focusPath
  }

  /**
   * Check whether anchor point of the range is at the start of a `node`.
   *
   * @param {Node} node
   * @return {Boolean}
   */

  hasAnchorAtStartOf(node) {
    // PERF: Do a check for a `0` offset first since it's quickest.
    if (this.anchorOffset != 0) return false
    const first = getFirstText(node)
    return this.anchorKey == first.key
  }

  /**
   * Check whether anchor point of the range is at the end of a `node`.
   *
   * @param {Node} node
   * @return {Boolean}
   */

  hasAnchorAtEndOf(node) {
    const last = getLastText(node)
    return this.anchorKey == last.key && this.anchorOffset == last.text.length
  }

  /**
   * Check whether the anchor edge of a range is in a `node` and at an
   * offset between `start` and `end`.
   *
   * @param {Node} node
   * @param {Number} start
   * @param {Number} end
   * @return {Boolean}
   */

  hasAnchorBetween(node, start, end) {
    return (
      this.anchorOffset <= end &&
      start <= this.anchorOffset &&
      this.hasAnchorIn(node)
    )
  }

  /**
   * Check whether the anchor edge of a range is in a `node`.
   *
   * @param {Node} node
   * @return {Boolean}
   */

  hasAnchorIn(node) {
    return node.object == 'text'
      ? node.key == this.anchorKey
      : this.anchorKey != null && node.hasDescendant(this.anchorKey)
  }

  /**
   * Check whether focus point of the range is at the end of a `node`.
   *
   * @param {Node} node
   * @return {Boolean}
   */

  hasFocusAtEndOf(node) {
    const last = getLastText(node)
    return this.focusKey == last.key && this.focusOffset == last.text.length
  }

  /**
   * Check whether focus point of the range is at the start of a `node`.
   *
   * @param {Node} node
   * @return {Boolean}
   */

  hasFocusAtStartOf(node) {
    if (this.focusOffset !== 0) return false
    const first = getFirstText(node)
    return this.focusKey == first.key
  }

  /**
   * Check whether the focus edge of a range is in a `node` and at an
   * offset between `start` and `end`.
   *
   * @param {Node} node
   * @param {Number} start
   * @param {Number} end
   * @return {Boolean}
   */

  hasFocusBetween(node, start, end) {
    return (
      start <= this.focusOffset &&
      this.focusOffset <= end &&
      this.hasFocusIn(node)
    )
  }

  /**
   * Check whether the focus edge of a range is in a `node`.
   *
   * @param {Node} node
   * @return {Boolean}
   */

  hasFocusIn(node) {
    return node.object == 'text'
      ? node.key == this.focusKey
      : this.focusKey != null && node.hasDescendant(this.focusKey)
  }

  /**
   * Check whether the range is at the start of a `node`.
   *
   * @param {Node} node
   * @return {Boolean}
   */

  isAtStartOf(node) {
    return this.isCollapsed && this.hasAnchorAtStartOf(node)
  }

  /**
   * Check whether the range is at the end of a `node`.
   *
   * @param {Node} node
   * @return {Boolean}
   */

  isAtEndOf(node) {
    return this.isCollapsed && this.hasAnchorAtEndOf(node)
  }

  /**
   * Focus the range.
   *
   * @return {Range}
   */

  focus() {
    return this.merge({
      isFocused: true,
    })
  }

  /**
   * Blur the range.
   *
   * @return {Range}
   */

  blur() {
    return this.merge({
      isFocused: false,
    })
  }

  /**
   * Unset the range.
   *
   * @return {Range}
   */

  deselect() {
    return this.merge({
      anchorKey: null,
      anchorOffset: null,
      anchorPath: null,
      focusKey: null,
      focusOffset: null,
      focusPath: null,
      isFocused: false,
    })
  }

  /**
   * Flip the range.
   *
   * @return {Range}
   */

  flip() {
    return this.merge({
      anchorKey: this.focusKey,
      anchorOffset: this.focusOffset,
      anchorPath: this.focusPath,
      focusKey: this.anchorKey,
      focusOffset: this.anchorOffset,
      focusPath: this.anchorPath,
    })
  }

  /**
   * Move the anchor offset `n` characters.
   *
   * @param {Number} n (optional)
   * @return {Range}
   */

  moveAnchor(n = 1) {
    const anchorOffset = this.anchorOffset + n
    return this.merge({ anchorOffset })
  }

  /**
   * Move the anchor offset `n` characters.
   *
   * @param {Number} n (optional)
   * @return {Range}
   */

  moveFocus(n = 1) {
    const focusOffset = this.focusOffset + n
    return this.merge({ focusOffset })
  }

  /**
   * Move the range's anchor point to a new `key` or `path` and `offset`.
   *
   * @param {String|List} key or path
   * @param {Number} offset
   * @return {Range}
   */

  moveAnchorTo(key, offset) {
    const { anchorKey, focusKey, anchorPath, focusPath } = this

    if (typeof key === 'string') {
      const isAnchor = key === anchorKey
      const isFocus = key === focusKey
      return this.merge({
        anchorKey: key,
        anchorPath: isFocus ? focusPath : isAnchor ? anchorPath : null,
        anchorOffset: offset,
      })
    } else {
      const path = key
      const isAnchor = path && path.equals(anchorPath)
      const isFocus = path && path.equals(focusPath)
      return this.merge({
        anchorPath: path,
        anchorKey: isAnchor ? anchorKey : isFocus ? focusKey : null,
        anchorOffset: offset,
      })
    }
  }

  /**
   * Move the range's focus point to a new `key` or `path` and `offset`.
   *
   * @param {String|List} key or path
   * @param {Number} offset
   * @return {Range}
   */

  moveFocusTo(key, offset) {
    const { focusKey, anchorKey, anchorPath, focusPath } = this

    if (typeof key === 'string') {
      const isAnchor = key === anchorKey
      const isFocus = key === focusKey
      return this.merge({
        focusKey: key,
        focusPath: isAnchor ? anchorPath : isFocus ? focusPath : null,
        focusOffset: offset,
      })
    } else {
      const path = key
      const isAnchor = path && path.equals(anchorPath)
      const isFocus = path && path.equals(focusPath)
      return this.merge({
        focusPath: path,
        focusKey: isFocus ? focusKey : isAnchor ? anchorKey : null,
        focusOffset: offset,
      })
    }
  }

  /**
   * Move the range to `anchorOffset`.
   *
   * @param {Number} anchorOffset
   * @return {Range}
   */

  moveAnchorOffsetTo(anchorOffset) {
    return this.merge({ anchorOffset })
  }

  /**
   * Move the range to `focusOffset`.
   *
   * @param {Number} focusOffset
   * @return {Range}
   */

  moveFocusOffsetTo(focusOffset) {
    return this.merge({ focusOffset })
  }

  /**
   * Move the range to `anchorOffset` and `focusOffset`.
   *
   * @param {Number} anchorOffset
   * @param {Number} focusOffset (optional)
   * @return {Range}
   */

  moveOffsetsTo(anchorOffset, focusOffset = anchorOffset) {
    return this.moveAnchorOffsetTo(anchorOffset).moveFocusOffsetTo(focusOffset)
  }

  /**
   * Move the focus point to the anchor point.
   *
   * @return {Range}
   */

  moveToAnchor() {
    return this.moveFocusTo(this.anchorKey, this.anchorOffset)
  }

  /**
   * Move the anchor point to the focus point.
   *
   * @return {Range}
   */

  moveToFocus() {
    return this.moveAnchorTo(this.focusKey, this.focusOffset)
  }

  /**
   * Move the range's anchor point to the start of a `node`.
   *
   * @param {Node} node
   * @return {Range}
   */

  moveAnchorToStartOf(node) {
    node = getFirstText(node)
    return this.moveAnchorTo(node.key, 0)
  }

  /**
   * Move the range's anchor point to the end of a `node`.
   *
   * @param {Node} node
   * @return {Range}
   */

  moveAnchorToEndOf(node) {
    node = getLastText(node)
    return this.moveAnchorTo(node.key, node.text.length)
  }

  /**
   * Move the range's focus point to the start of a `node`.
   *
   * @param {Node} node
   * @return {Range}
   */

  moveFocusToStartOf(node) {
    node = getFirstText(node)
    return this.moveFocusTo(node.key, 0)
  }

  /**
   * Move the range's focus point to the end of a `node`.
   *
   * @param {Node} node
   * @return {Range}
   */

  moveFocusToEndOf(node) {
    node = getLastText(node)
    return this.moveFocusTo(node.key, node.text.length)
  }

  /**
   * Move to the entire range of `start` and `end` nodes.
   *
   * @param {Node} start
   * @param {Node} end (optional)
   * @return {Range}
   */

  moveToRangeOf(start, end = start) {
    const range = this.moveAnchorToStartOf(start).moveFocusToEndOf(end)
    return range
  }

  /**
   * Normalize the range, relative to a `node`, ensuring that the anchor
   * and focus nodes of the range always refer to leaf text nodes.
   *
   * @param {Node} node
   * @return {Range}
   */

  normalize(node) {
    const range = this
    let {
      anchorKey,
      anchorOffset,
      anchorPath,
      focusKey,
      focusOffset,
      focusPath,
    } = range

    // If either point in the range is unset, make sure it is fully unset.
    if (
      (anchorKey == null && anchorPath == null) ||
      (focusKey == null && focusPath == null) ||
      anchorOffset == null ||
      focusOffset == null
    ) {
      return Range.create()
    }

    // Get the anchor and focus nodes.
    let anchorNode = node.getNode(anchorKey || anchorPath)
    let focusNode = node.getNode(focusKey || focusPath)

    // If the range is malformed, warn and zero it out.
    if (!anchorNode || !focusNode) {
      logger.warn(
        'The range was invalid and was reset. The range in question was:',
        range
      )

      const first = node.getFirstText()
      const path = first && node.getPath(first.key)
      return range.merge({
        anchorKey: first ? first.key : null,
        anchorOffset: first ? 0 : null,
        anchorPath: first ? path : null,
        focusKey: first ? first.key : null,
        focusOffset: first ? 0 : null,
        focusPath: first ? path : null,
      })
    }

    // If the anchor node isn't a text node, match it to one.
    if (anchorNode.object != 'text') {
      logger.warn(
        'The range anchor was set to a Node that is not a Text node. This should not happen and can degrade performance. The node in question was:',
        anchorNode
      )

      const anchorText = anchorNode.getTextAtOffset(anchorOffset)
      const offset = anchorNode.getOffset(anchorText.key)
      anchorOffset = anchorOffset - offset
      anchorNode = anchorText
    }

    // If the focus node isn't a text node, match it to one.
    if (focusNode.object != 'text') {
      logger.warn(
        'The range focus was set to a Node that is not a Text node. This should not happen and can degrade performance. The node in question was:',
        focusNode
      )

      const focusText = focusNode.getTextAtOffset(focusOffset)
      const offset = focusNode.getOffset(focusText.key)
      focusOffset = focusOffset - offset
      focusNode = focusText
    }

    anchorKey = anchorNode.key
    focusKey = focusNode.key
    anchorPath = node.getPath(anchorKey)
    focusPath = node.getPath(focusKey)

    // Merge in any updated properties.
    return range.merge({
      anchorKey,
      anchorOffset,
      anchorPath,
      focusKey,
      focusOffset,
      focusPath,
    })
  }

  /**
   * Return a JSON representation of the range.
   *
   * @param {Object} options
   * @return {Object}
   */

  toJSON(options = {}) {
    const object = {
      object: this.object,
      anchorKey: this.anchorKey,
      anchorOffset: this.anchorOffset,
      anchorPath: this.anchorPath && this.anchorPath.toArray(),
      focusKey: this.focusKey,
      focusOffset: this.focusOffset,
      focusPath: this.focusPath && this.focusPath.toArray(),
      isAtomic: this.isAtomic,
      isFocused: this.isFocused,
      marks:
        this.marks == null ? null : this.marks.toArray().map(m => m.toJSON()),
    }

    if (!options.preserveKeys) {
      delete object.anchorKey
      delete object.focusKey
    }

    return object
  }

  /**
   * Alias `toJS`.
   */

  toJS() {
    return this.toJSON()
  }
}

/**
 * Attach a pseudo-symbol for type checking.
 */

Range.prototype[MODEL_TYPES.RANGE] = true

/**
 * Mix in some "move" convenience methods.
 */

const MOVE_METHODS = [
  ['move', ''],
  ['move', 'To'],
  ['move', 'ToStartOf'],
  ['move', 'ToEndOf'],
]

MOVE_METHODS.forEach(([p, s]) => {
  Range.prototype[`${p}${s}`] = function(...args) {
    return this[`${p}Anchor${s}`](...args)[`${p}Focus${s}`](...args)
  }
})

/**
 * Mix in the "start", "end" and "edge" convenience methods.
 */

const EDGE_METHODS = [
  ['has', 'AtStartOf', true],
  ['has', 'AtEndOf', true],
  ['has', 'Between', true],
  ['has', 'In', true],
  ['collapseTo', ''],
  ['move', ''],
  ['moveTo', ''],
  ['move', 'To'],
  ['move', 'OffsetTo'],
]

EDGE_METHODS.forEach(([p, s, hasEdge]) => {
  const anchor = `${p}Anchor${s}`
  const focus = `${p}Focus${s}`

  Range.prototype[`${p}Start${s}`] = function(...args) {
    return this.isBackward ? this[focus](...args) : this[anchor](...args)
  }

  Range.prototype[`${p}End${s}`] = function(...args) {
    return this.isBackward ? this[anchor](...args) : this[focus](...args)
  }

  if (hasEdge) {
    Range.prototype[`${p}Edge${s}`] = function(...args) {
      return this[anchor](...args) || this[focus](...args)
    }
  }
})

/**
 * Mix in some aliases for convenience / parallelism with the browser APIs.
 */

const ALIAS_METHODS = [
  ['collapseTo', 'moveTo'],
  ['collapseToAnchor', 'moveToAnchor'],
  ['collapseToFocus', 'moveToFocus'],
  ['collapseToStart', 'moveToStart'],
  ['collapseToEnd', 'moveToEnd'],
  ['collapseToStartOf', 'moveToStartOf'],
  ['collapseToEndOf', 'moveToEndOf'],
  ['extend', 'moveFocus'],
  ['extendTo', 'moveFocusTo'],
  ['extendToStartOf', 'moveFocusToStartOf'],
  ['extendToEndOf', 'moveFocusToEndOf'],
]

ALIAS_METHODS.forEach(([alias, method]) => {
  Range.prototype[alias] = function(...args) {
    return this[method](...args)
  }
})

/**
 * Get the first text of a `node`.
 *
 * @param {Node} node
 * @return {Text}
 */

function getFirstText(node) {
  return node.object == 'text' ? node : node.getFirstText()
}

/**
 * Get the last text of a `node`.
 *
 * @param {Node} node
 * @return {Text}
 */

function getLastText(node) {
  return node.object == 'text' ? node : node.getLastText()
}

/**
 * Export.
 *
 * @type {Range}
 */

export default Range
