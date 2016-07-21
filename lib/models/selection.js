// @flow

import includes from 'lodash/includes'
import memoize from '../utils/memoize'
import { Record } from 'immutable'

/**
 * Start-and-end convenience methods to auto-generate.
 */

const START_END_METHODS = [
  'collapseTo%'
]

/**
 * Start-end-and-edge convenience methods to auto-generate.
 */

const EDGE_METHODS = [
  'has%AtStartOf',
  'has%AtEndOf',
  'has%Between',
  'has%In'
]

/**
 * Default properties.
 */

const DEFAULTS = {
  anchorKey: null,
  anchorOffset: 0,
  focusKey: null,
  focusOffset: 0,
  isBackward: null,
  isFocused: false
}

/**
 * Selection.
 */

class Selection extends new Record(DEFAULTS) {

  /**
   * Create a new `Selection` with `properties`.
   *
   * @param {Object} properties
   * @return {Selection} selection
   */

  static create(properties = {}) {
    if (properties instanceof Selection) return properties
    return new Selection(properties)
  }

  /**
   * Get the kind.
   *
   * @return {String} kind
   */

  get kind():string {
    return 'selection'
  }

  /**
   * Get whether the selection is blurred.
   *
   * @return {Boolean} isBlurred
   */

  get isBlurred():boolean {
    return !this.isFocused
  }

  /**
   * Get whether the selection is collapsed.
   *
   * @return {Boolean} isCollapsed
   */

  get isCollapsed():boolean {
    return (
      this.anchorKey == this.focusKey &&
      this.anchorOffset == this.focusOffset
    )
  }

  /**
   * Get whether the selection is expanded.
   *
   * @return {Boolean} isExpanded
   */

  get isExpanded():boolean {
    return !this.isCollapsed
  }

  /**
   * Get whether the selection is forward.
   *
   * @return {Boolean} isForward
   */

  get isForward():?boolean {
    return this.isBackward == null ? null : !this.isBackward
  }

  /**
   * Get the start key.
   *
   * @return {String} startKey
   */

  get startKey():string {
    return this.isBackward
      ? this.focusKey
      : this.anchorKey
  }

  get startOffset():number {
    return this.isBackward
      ? this.focusOffset
      : this.anchorOffset
  }

  get endKey():string {
    return this.isBackward
      ? this.anchorKey
      : this.focusKey
  }

  get endOffset():number {
    return this.isBackward
      ? this.anchorOffset
      : this.focusOffset
  }

  /**
   * Check whether anchor point of the selection is at the start of a `node`.
   *
   * @param {Node} node
   * @return {Boolean}
   */

  hasAnchorAtStartOf(node:NodeType):boolean {
    if (this.anchorOffset != 0) return false
    const first = node.kind == 'text' ? node : node.getTexts().first()
    return this.anchorKey == first.key
  }

  /**
   * Check whether anchor point of the selection is at the end of a `node`.
   *
   * @param {Node} node
   * @return {Boolean}
   */

  hasAnchorAtEndOf(node:NodeType):boolean {
    const last = node.kind == 'text' ? node : node.getTexts().last()
    return this.anchorKey == last.key && this.anchorOffset == last.length
  }

  /**
   * Check whether the anchor edge of a selection is in a `node` and at an
   * offset between `start` and `end`.
   *
   * @param {Node} node
   * @param {Number} start
   * @param {Number} end
   * @return {Boolean}
   */

  hasAnchorBetween(node:NodeType, start:number, end:number):boolean {
    return (
      this.anchorOffset <= end &&
      start <= this.anchorOffset &&
      this.hasAnchorIn(node)
    )
  }

  /**
   * Check whether the anchor edge of a selection is in a `node`.
   *
   * @param {Node} node
   * @return {Boolean}
   */

  hasAnchorIn(node:NodeType):boolean {
    const nodes = node.kind == 'text' ? [node] : node.getTexts()
    return nodes.some(n => n.key == this.anchorKey)
  }

  /**
   * Check whether focus point of the selection is at the end of a `node`.
   *
   * @param {Node} node
   * @return {Boolean}
   */

  hasFocusAtEndOf(node:NodeType):boolean {
    const last = node.kind == 'text' ? node : node.getTexts().last()
    return this.focusKey == last.key && this.focusOffset == last.length
  }

  /**
   * Check whether focus point of the selection is at the start of a `node`.
   *
   * @param {Node} node
   * @return {Boolean}
   */

  hasFocusAtStartOf(node:NodeType):boolean {
    if (this.focusOffset != 0) return false
    const first = node.kind == 'text' ? node : node.getTexts().first()
    return this.focusKey == first.key
  }

  /**
   * Check whether the focus edge of a selection is in a `node` and at an
   * offset between `start` and `end`.
   *
   * @param {Node} node
   * @param {Number} start
   * @param {Number} end
   * @return {Boolean}
   */

  hasFocusBetween(node:NodeType, start:number, end:number):boolean {
    return (
      start <= this.focusOffset &&
      this.focusOffset <= end &&
      this.hasFocusIn(node)
    )
  }

  /**
   * Check whether the focus edge of a selection is in a `node`.
   *
   * @param {Node} node
   * @return {Boolean}
   */

  hasFocusIn(node:NodeType):boolean {
    const nodes = node.kind == 'text' ? [node] : node.getTexts()
    return nodes.some(n => n.key == this.focusKey)
  }

  /**
   * Check whether the selection is at the start of a `node`.
   *
   * @param {Node} node
   * @return {Boolean} isAtStart
   */

  isAtStartOf(node:NodeType):boolean {
    const { isExpanded, startKey, startOffset } = this
    if (isExpanded) return false
    if (startOffset != 0) return false
    const first = node.kind == 'text' ? node : node.getTexts().first()
    return startKey == first.key
  }

  /**
   * Check whether the selection is at the end of a `node`.
   *
   * @param {Node} node
   * @return {Boolean} isAtEnd
   */

  isAtEndOf(node:NodeType):boolean {
    const { endKey, endOffset, isExpanded } = this
    if (isExpanded) return false
    const last = node.kind == 'text' ? node : node.getTexts().last()
    return endKey == last.key && endOffset == last.length
  }

  /**
   * Normalize the selection, relative to a `node`, ensuring that the anchor
   * and focus nodes of the selection always refer to leaf text nodes.
   *
   * @param {Node} node
   * @return {Selection} selection
   */

  normalize(node:NodeType):Selection {
    let selection = this
    const { isCollapsed } = selection
    let { anchorKey, anchorOffset, focusKey, focusOffset, isBackward } = selection

    // If the selection isn't formed yet or is malformed, set it to the
    // beginning of the node.
    if (
      anchorKey == null ||
      focusKey == null ||
      !node.hasDescendant(anchorKey) ||
      !node.hasDescendant(focusKey)
    ) {
      const first = node.getTexts().first()
      return selection.merge({
        anchorKey: first.key,
        anchorOffset: 0,
        focusKey: first.key,
        focusOffset: 0,
        isBackward: false
      })
    }

    // Get the anchor and focus nodes.
    let anchorNode = node.getDescendant(anchorKey)
    let focusNode = node.getDescendant(focusKey)

    // If the anchor node isn't a text node, match it to one.
    if (anchorNode.kind != 'text') {
      let anchorText = anchorNode.getTextAtOffset(anchorOffset)
      let offset = anchorNode.getOffset(anchorText)
      anchorOffset = anchorOffset - offset
      anchorNode = anchorText
    }

    // If the focus node isn't a text node, match it to one.
    if (focusNode.kind != 'text') {
      let focusText = focusNode.getTextAtOffset(focusOffset)
      let offset = focusNode.getOffset(focusText)
      focusOffset = focusOffset - offset
      focusNode = focusText
    }

    // If `isBackward` is not set, derive it.
    if (isBackward == null) {
      let texts = node.getTexts()
      let anchorIndex = texts.indexOf(anchorNode)
      let focusIndex = texts.indexOf(focusNode)
      isBackward = anchorIndex == focusIndex
        ? anchorOffset > focusOffset
        : anchorIndex > focusIndex
    }

    // Merge in any updated properties.
    return selection.merge({
      anchorKey: anchorNode.key,
      anchorOffset,
      focusKey: focusNode.key,
      focusOffset,
      isBackward
    })
  }

  /**
   * Focus the selection.
   *
   * @return {Selection} selection
   */

  focus() {
    return this.merge({
      isFocused: true
    })
  }

  /**
   * Blur the selection.
   *
   * @return {Selection} selection
   */

  blur() {
    return this.merge({
      isFocused: false
    })
  }

  /**
   * Move the focus point to the anchor point.
   *
   * @return {Selection} selection
   */

  collapseToAnchor() {
    return this.merge({
      focusKey: this.anchorKey,
      focusOffset: this.anchorOffset,
      isBackward: false
    })
  }

  /**
   * Move the anchor point to the focus point.
   *
   * @return {Selection} selection
   */

  collapseToFocus() {
    return this.merge({
      anchorKey: this.focusKey,
      anchorOffset: this.focusOffset,
      isBackward: false
    })
  }

  /**
   * Move to the start of a `node`.
   *
   * @return {Selection} selection
   */

  collapseToStartOf(node:NodeType):Selection {
    return this.merge({
      anchorKey: node.key,
      anchorOffset: 0,
      focusKey: node.key,
      focusOffset: 0,
      isBackward: false
    })
  }

  /**
   * Move to the end of a `node`.
   *
   * @return {Selection} selection
   */

  collapseToEndOf(node:NodeType):Selection {
    return this.merge({
      anchorKey: node.key,
      anchorOffset: node.length,
      focusKey: node.key,
      focusOffset: node.length,
      isBackward: false
    })
  }

  /**
   * Move to the entire range of `start` and `end` nodes.
   *
   * @param {Node} start
   * @param {Node} end (optional)
   * @return {Selection} selection
   */

  moveToRangeOf(start:NodeType, end:NodeType = start):Selection {
    return this.merge({
      anchorKey: start.key,
      anchorOffset: 0,
      focusKey: end.key,
      focusOffset: end.length,
      isBackward: null
    })
  }

  /**
   * Move the selection forward `n` characters.
   *
   * @param {Number} n (optional)
   * @return {Selection} selection
   */

  moveForward(n:number = 1):Selection {
    return this.merge({
      anchorOffset: this.anchorOffset + n,
      focusOffset: this.focusOffset + n
    })
  }

  /**
   * Move the selection backward `n` characters.
   *
   * @param {Number} n (optional)
   * @return {Selection} selection
   */

  moveBackward(n:number = 1):Selection {
    return this.merge({
      anchorOffset: this.anchorOffset - n,
      focusOffset: this.focusOffset - n
    })
  }

  /**
   * Move the selection to `anchor` and `focus` offsets.
   *
   * @param {Number} anchor
   * @param {Number} focus (optional)
   * @return {Selection} selection
   */

  moveToOffsets(anchor:number, focus:?number = anchor):Selection {
    return this.merge({
      anchorOffset: anchor,
      focusOffset: focus,
      isBackward: null
    })
  }

  /**
   * Extend the focus point forward `n` characters.
   *
   * @param {Number} n (optional)
   * @return {Selection} selection
   */

  extendForward(n:?number = 1):Selection {
    return this.merge({
      focusOffset: this.focusOffset + n,
      isBackward: null
    })
  }

  /**
   * Extend the focus point backward `n` characters.
   *
   * @param {Number} n (optional)
   * @return {Selection} selection
   */

  extendBackward(n:number = 1):Selection {
    return this.merge({
      focusOffset: this.focusOffset - n,
      isBackward: null
    })
  }

  /**
   * Extend the focus point to the start of a `node`.
   *
   * @param {Node} node
   * @return {Selection} selection
   */

  extendToStartOf(node:NodeType):Selection {
    return this.merge({
      focusKey: node.key,
      focusOffset: 0,
      isBackward: null
    })
  }

  /**
   * Extend the focus point to the end of a `node`.
   *
   * @param {Node} node
   * @return {Selection} selection
   */

  extendToEndOf(node:NodeType):Selection {
    return this.merge({
      focusKey: node.key,
      focusOffset: node.length,
      isBackward: null
    })
  }

}

/**
 * Add start, end and edge convenience methods.
 */

START_END_METHODS.concat(EDGE_METHODS).forEach((pattern) => {
  const [ p, s ] = pattern.split('%')
  const anchor = `${p}Anchor${s}`
  const edge = `${p}Edge${s}`
  const end = `${p}End${s}`
  const focus = `${p}Focus${s}`
  const start = `${p}Start${s}`

  Selection.prototype[start] = function (...args) {
    return this.isBackward
      ? this[focus](...args)
      : this[anchor](...args)
  }

  Selection.prototype[end] = function (...args) {
    return this.isBackward
      ? this[anchor](...args)
      : this[focus](...args)
  }

  if (!includes(EDGE_METHODS, pattern)) return

  Selection.prototype[edge] = function (...args) {
    return this[anchor](...args) || this[focus](...args)
  }
})

/**
 * Memoize read methods.
 */

memoize(Selection.prototype, [
  'hasAnchorAtStartOf',
  'hasAnchorAtEndOf',
  'hasAnchorBetween',
  'hasAnchorIn',
  'hasFocusAtEndOf',
  'hasFocusAtStartOf',
  'hasFocusBetween',
  'hasFocusIn',
  'isAtStartOf',
  'isAtEndOf'
])

/**
 * Export.
 */

export default Selection
