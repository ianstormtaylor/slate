import isPlainObject from 'is-plain-object'
import logger from 'slate-dev-logger'
import { Record, Set, List, Map } from 'immutable'

import MODEL_TYPES from '../constants/model-types'
import PathUtils from '../utils/path-utils'
import Change from './change'
import Data from './data'
import Document from './document'
import History from './history'
import Range from './range'
import Schema from './schema'

/**
 * Default properties.
 *
 * @type {Object}
 */

const DEFAULTS = {
  data: new Map(),
  decorations: null,
  document: Document.create(),
  history: History.create(),
  schema: Schema.create(),
  selection: Range.create(),
}

/**
 * Value.
 *
 * @type {Value}
 */

class Value extends Record(DEFAULTS) {
  /**
   * Create a new `Value` with `attrs`.
   *
   * @param {Object|Value} attrs
   * @param {Object} options
   * @return {Value}
   */

  static create(attrs = {}, options = {}) {
    if (Value.isValue(attrs)) {
      return attrs
    }

    if (isPlainObject(attrs)) {
      return Value.fromJSON(attrs, options)
    }

    throw new Error(
      `\`Value.create\` only accepts objects or values, but you passed it: ${attrs}`
    )
  }

  /**
   * Create a dictionary of settable value properties from `attrs`.
   *
   * @param {Object|Value} attrs
   * @return {Object}
   */

  static createProperties(a = {}) {
    if (Value.isValue(a)) {
      return {
        data: a.data,
        decorations: a.decorations,
        schema: a.schema,
      }
    }

    if (isPlainObject(a)) {
      const p = {}
      if ('data' in a) p.data = Data.create(a.data)
      if ('decorations' in a) p.decorations = Range.createList(a.decorations)
      if ('schema' in a) p.schema = Schema.create(a.schema)
      return p
    }

    throw new Error(
      `\`Value.createProperties\` only accepts objects or values, but you passed it: ${a}`
    )
  }

  /**
   * Create a `Value` from a JSON `object`.
   *
   * @param {Object} object
   * @param {Object} options
   *   @property {Boolean} normalize
   *   @property {Array} plugins
   * @return {Value}
   */

  static fromJSON(object, options = {}) {
    let { document = {}, selection = {}, schema = {}, history = {} } = object
    let data = new Map()
    document = Document.fromJSON(document)
    selection = Range.fromJSON(selection)
    schema = Schema.fromJSON(schema)
    history = History.fromJSON(history)

    // Allow plugins to set a default value for `data`.
    if (options.plugins) {
      for (const plugin of options.plugins) {
        if (plugin.data) data = data.merge(plugin.data)
      }
    }

    // Then merge in the `data` provided.
    if ('data' in object) {
      data = data.merge(object.data)
    }

    selection = document.createRange(selection)

    if (selection.isUnset) {
      const text = document.getFirstText()
      if (text) selection = selection.moveToStartOfNode(text)
      selection = document.createRange(selection)
    }

    selection = document.createRange(selection)

    let value = new Value({
      data,
      document,
      selection,
      schema,
      history,
    })

    if (options.normalize !== false) {
      value = value.change({ save: false }).normalize().value
    }

    return value
  }

  /**
   * Alias `fromJS`.
   */

  static fromJS = Value.fromJSON

  /**
   * Check if a `value` is a `Value`.
   *
   * @param {Any} value
   * @return {Boolean}
   */

  static isValue(value) {
    return !!(value && value[MODEL_TYPES.VALUE])
  }

  /**
   * Object.
   *
   * @return {String}
   */

  get object() {
    return 'value'
  }

  get kind() {
    logger.deprecate(
      'slate@0.32.0',
      'The `kind` property of Slate objects has been renamed to `object`.'
    )
    return this.object
  }

  /**
   * Are there undoable events?
   *
   * @return {Boolean}
   */

  get hasUndos() {
    return this.history.undos.size > 0
  }

  /**
   * Are there redoable events?
   *
   * @return {Boolean}
   */

  get hasRedos() {
    return this.history.redos.size > 0
  }

  /**
   * Is the current selection blurred?
   *
   * @return {Boolean}
   */

  get isBlurred() {
    return this.selection.isBlurred
  }

  /**
   * Is the current selection focused?
   *
   * @return {Boolean}
   */

  get isFocused() {
    return this.selection.isFocused
  }

  /**
   * Get the current start text node's closest block parent.
   *
   * @return {Block}
   */

  get startBlock() {
    return (
      this.selection.start.key &&
      this.document.getClosestBlock(this.selection.start.key)
    )
  }

  /**
   * Get the current end text node's closest block parent.
   *
   * @return {Block}
   */

  get endBlock() {
    return (
      this.selection.end.key &&
      this.document.getClosestBlock(this.selection.end.key)
    )
  }

  /**
   * Get the current anchor text node's closest block parent.
   *
   * @return {Block}
   */

  get anchorBlock() {
    return (
      this.selection.anchor.key &&
      this.document.getClosestBlock(this.selection.anchor.key)
    )
  }

  /**
   * Get the current focus text node's closest block parent.
   *
   * @return {Block}
   */

  get focusBlock() {
    return (
      this.selection.focus.key &&
      this.document.getClosestBlock(this.selection.focus.key)
    )
  }

  /**
   * Get the current start text node's closest inline parent.
   *
   * @return {Inline}
   */

  get startInline() {
    return (
      this.selection.start.key &&
      this.document.getClosestInline(this.selection.start.key)
    )
  }

  /**
   * Get the current end text node's closest inline parent.
   *
   * @return {Inline}
   */

  get endInline() {
    return (
      this.selection.end.key &&
      this.document.getClosestInline(this.selection.end.key)
    )
  }

  /**
   * Get the current anchor text node's closest inline parent.
   *
   * @return {Inline}
   */

  get anchorInline() {
    return (
      this.selection.anchor.key &&
      this.document.getClosestInline(this.selection.anchor.key)
    )
  }

  /**
   * Get the current focus text node's closest inline parent.
   *
   * @return {Inline}
   */

  get focusInline() {
    return (
      this.selection.focus.key &&
      this.document.getClosestInline(this.selection.focus.key)
    )
  }

  /**
   * Get the current start text node.
   *
   * @return {Text}
   */

  get startText() {
    return (
      this.selection.start.key &&
      this.document.getDescendant(this.selection.start.key)
    )
  }

  /**
   * Get the current end node.
   *
   * @return {Text}
   */

  get endText() {
    return (
      this.selection.end.key &&
      this.document.getDescendant(this.selection.end.key)
    )
  }

  /**
   * Get the current anchor node.
   *
   * @return {Text}
   */

  get anchorText() {
    return (
      this.selection.anchor.key &&
      this.document.getDescendant(this.selection.anchor.key)
    )
  }

  /**
   * Get the current focus node.
   *
   * @return {Text}
   */

  get focusText() {
    return (
      this.selection.focus.key &&
      this.document.getDescendant(this.selection.focus.key)
    )
  }

  /**
   * Get the next block node.
   *
   * @return {Block}
   */

  get nextBlock() {
    return (
      this.selection.end.key &&
      this.document.getNextBlock(this.selection.end.key)
    )
  }

  /**
   * Get the previous block node.
   *
   * @return {Block}
   */

  get previousBlock() {
    return (
      this.selection.start.key &&
      this.document.getPreviousBlock(this.selection.start.key)
    )
  }

  /**
   * Get the next inline node.
   *
   * @return {Inline}
   */

  get nextInline() {
    return (
      this.selection.end.key &&
      this.document.getNextInline(this.selection.end.key)
    )
  }

  /**
   * Get the previous inline node.
   *
   * @return {Inline}
   */

  get previousInline() {
    return (
      this.selection.start.key &&
      this.document.getPreviousInline(this.selection.start.key)
    )
  }

  /**
   * Get the next text node.
   *
   * @return {Text}
   */

  get nextText() {
    return (
      this.selection.end.key &&
      this.document.getNextText(this.selection.end.key)
    )
  }

  /**
   * Get the previous text node.
   *
   * @return {Text}
   */

  get previousText() {
    return (
      this.selection.start.key &&
      this.document.getPreviousText(this.selection.start.key)
    )
  }

  /**
   * Get the marks of the current selection.
   *
   * @return {Set<Mark>}
   */

  get marks() {
    return this.selection.isUnset
      ? new Set()
      : this.selection.marks || this.document.getMarksAtRange(this.selection)
  }

  /**
   * Get the active marks of the current selection.
   *
   * @return {Set<Mark>}
   */

  get activeMarks() {
    return this.selection.isUnset
      ? new Set()
      : this.selection.marks ||
          this.document.getActiveMarksAtRange(this.selection)
  }

  /**
   * Get the block nodes in the current selection.
   *
   * @return {List<Block>}
   */

  get blocks() {
    return this.selection.isUnset
      ? new List()
      : this.document.getBlocksAtRange(this.selection)
  }

  /**
   * Get the fragment of the current selection.
   *
   * @return {Document}
   */

  get fragment() {
    return this.selection.isUnset
      ? Document.create()
      : this.document.getFragmentAtRange(this.selection)
  }

  /**
   * Get the inline nodes in the current selection.
   *
   * @return {List<Inline>}
   */

  get inlines() {
    return this.selection.isUnset
      ? new List()
      : this.document.getInlinesAtRange(this.selection)
  }

  /**
   * Get the text nodes in the current selection.
   *
   * @return {List<Text>}
   */

  get texts() {
    return this.selection.isUnset
      ? new List()
      : this.document.getTextsAtRange(this.selection)
  }

  /**
   * Check whether the selection is empty.
   *
   * @return {Boolean}
   */

  get isEmpty() {
    if (this.selection.isCollapsed) return true
    if (this.selection.end.offset != 0 && this.selection.start.offset != 0)
      return false
    return this.fragment.isEmpty
  }

  /**
   * Check whether the selection is collapsed in a void node.
   *
   * @return {Boolean}
   */

  get isInVoid() {
    if (this.selection.isExpanded) return false
    return this.document.hasVoidParent(this.selection.start.key)
  }

  /**
   * Create a new `Change` with the current value as a starting point.
   *
   * @param {Object} attrs
   * @return {Change}
   */

  change(attrs = {}) {
    return new Change({ ...attrs, value: this })
  }

  /**
   * Add mark to text at `offset` and `length` in node by `path`.
   *
   * @param {List|String} path
   * @param {Number} offset
   * @param {Number} length
   * @param {Mark} mark
   * @return {Value}
   */

  addMark(path, offset, length, mark) {
    let value = this
    let { document } = value
    document = document.addMark(path, offset, length, mark)
    value = this.set('document', document)
    return value
  }

  /**
   * Insert a `node`.
   *
   * @param {List|String} path
   * @param {Node} node
   * @return {Value}
   */

  insertNode(path, node) {
    let value = this
    let { document } = value
    document = document.insertNode(path, node)
    value = value.set('document', document)

    value = value.mapRanges(range =>
      range.updatePoints(point => point.setPath(null))
    )

    return value
  }

  /**
   * Insert `text` at `offset` in node by `path`.
   *
   * @param {List|String} path
   * @param {Number} offset
   * @param {String} text
   * @param {Set} marks
   * @return {Value}
   */

  insertText(path, offset, text, marks) {
    let value = this
    let { document } = value
    document = document.insertText(path, offset, text, marks)
    value = value.set('document', document)

    // Update any ranges that were affected.
    const node = document.assertNode(path)

    value = value.mapRanges(range => {
      const { anchor, focus, isBackward, isAtomic } = range

      if (
        anchor.key === node.key &&
        (anchor.offset > offset ||
          (anchor.offset === offset && (!isAtomic || !isBackward)))
      ) {
        range = range.moveAnchorForward(text.length)
      }

      if (
        focus.key === node.key &&
        (focus.offset > offset ||
          (focus.offset == offset && (!isAtomic || isBackward)))
      ) {
        range = range.moveFocusForward(text.length)
      }

      return range
    })

    value = value.clearAtomicRanges(node.key, offset)
    return value
  }

  /**
   * Merge a node backwards its previous sibling.
   *
   * @param {List|Key} path
   * @return {Value}
   */

  mergeNode(path) {
    let value = this
    const { document } = value
    const newDocument = document.mergeNode(path)
    path = document.resolvePath(path)
    const withPath = PathUtils.decrement(path)
    const one = document.getNode(withPath)
    const two = document.getNode(path)
    value = value.set('document', newDocument)

    value = value.mapRanges(range => {
      if (two.object === 'text') {
        const max = one.text.length

        if (range.anchor.key === two.key) {
          range = range.moveAnchorTo(one.key, max + range.anchor.offset)
        }

        if (range.focus.key === two.key) {
          range = range.moveFocusTo(one.key, max + range.focus.offset)
        }
      }

      range = range.updatePoints(point => point.setPath(null))

      return range
    })

    return value
  }

  /**
   * Move a node by `path` to `newPath`.
   *
   * A `newIndex` can be provided when move nodes by `key`, to account for not
   * being able to have a key for a location in the tree that doesn't exist yet.
   *
   * @param {List|Key} path
   * @param {List|Key} newPath
   * @param {Number} newIndex
   * @return {Value}
   */

  moveNode(path, newPath, newIndex = 0) {
    let value = this
    let { document } = value
    document = document.moveNode(path, newPath, newIndex)
    value = value.set('document', document)

    value = value.mapRanges(range =>
      range.updatePoints(point => point.setPath(null))
    )

    return value
  }

  /**
   * Remove mark from text at `offset` and `length` in node.
   *
   * @param {List|String} path
   * @param {Number} offset
   * @param {Number} length
   * @param {Mark} mark
   * @return {Value}
   */

  removeMark(path, offset, length, mark) {
    let value = this
    let { document } = value
    document = document.removeMark(path, offset, length, mark)
    value = this.set('document', document)
    return value
  }

  /**
   * Remove a node by `path`.
   *
   * @param {List|String} path
   * @return {Value}
   */

  removeNode(path) {
    let value = this
    let { document } = value
    const node = document.assertNode(path)
    const first = node.object == 'text' ? node : node.getFirstText() || node
    const last = node.object == 'text' ? node : node.getLastText() || node
    const prev = document.getPreviousText(first.key)
    const next = document.getNextText(last.key)

    document = document.removeNode(path)
    value = value.set('document', document)

    value = value.mapRanges(range => {
      const { start, end } = range

      if (node.hasNode(start.key)) {
        range = prev
          ? range.moveStartTo(prev.key, prev.text.length)
          : next ? range.moveStartTo(next.key, 0) : Range.create()
      }

      if (node.hasNode(end.key)) {
        range = prev
          ? range.moveEndTo(prev.key, prev.text.length)
          : next ? range.moveEndTo(next.key, 0) : Range.create()
      }

      range = range.updatePoints(point => point.setPath(null))

      return range
    })

    return value
  }

  /**
   * Remove `text` at `offset` in node by `path`.
   *
   * @param {List|Key} path
   * @param {Number} offset
   * @param {String} text
   * @return {Value}
   */

  removeText(path, offset, text) {
    let value = this
    let { document } = value
    document = document.removeText(path, offset, text)
    value = value.set('document', document)

    const node = document.assertNode(path)
    const { length } = text
    const rangeOffset = offset + length
    value = value.clearAtomicRanges(node.key, offset, offset + length)

    value = value.mapRanges(range => {
      const { anchor, focus } = range

      if (anchor.key === node.key) {
        range =
          anchor.offset >= rangeOffset
            ? range.moveAnchorBackward(length)
            : anchor.offset > offset
              ? range.moveAnchorTo(anchor.key, offset)
              : range
      }

      if (focus.key === node.key) {
        range =
          focus.offset >= rangeOffset
            ? range.moveFocusBackward(length)
            : focus.offset > offset
              ? range.moveFocusTo(focus.key, offset)
              : range
      }

      return range
    })

    return value
  }

  /**
   * Set `properties` on a node.
   *
   * @param {List|String} path
   * @param {Object} properties
   * @return {Value}
   */

  setNode(path, properties) {
    let value = this
    let { document } = value
    document = document.setNode(path, properties)
    value = value.set('document', document)
    return value
  }

  /**
   * Set `properties` on `mark` on text at `offset` and `length` in node.
   *
   * @param {List|String} path
   * @param {Number} offset
   * @param {Number} length
   * @param {Mark} mark
   * @param {Object} properties
   * @return {Value}
   */

  setMark(path, offset, length, mark, properties) {
    let value = this
    let { document } = value
    document = document.setMark(path, offset, length, mark, properties)
    value = value.set('document', document)
    return value
  }

  /**
   * Set `properties` on the selection.
   *
   * @param {Value} value
   * @param {Operation} operation
   * @return {Value}
   */

  setSelection(properties) {
    let value = this
    let { document, selection } = value
    const next = selection.setProperties(properties)
    selection = document.resolveRange(next)
    value = value.set('selection', selection)
    return value
  }

  /**
   * Split a node by `path` at `position` with optional `properties` to apply
   * to the newly split node.
   *
   * @param {List|String} path
   * @param {Number} position
   * @param {Object} properties
   * @return {Value}
   */

  splitNode(path, position, properties) {
    let value = this
    const { document } = value
    const newDocument = document.splitNode(path, position, properties)
    const node = document.assertNode(path)
    value = value.set('document', newDocument)

    value = value.mapRanges(range => {
      const next = newDocument.getNextText(node.key)
      const { start, end } = range

      // If the start was after the split, move it to the next node.
      if (node.key === start.key && position <= start.offset) {
        range = range.moveStartTo(next.key, start.offset - position)
      }

      // If the end was after the split, move it to the next node.
      if (node.key === end.key && position <= end.offset) {
        range = range.moveEndTo(next.key, end.offset - position)
      }

      range = range.updatePoints(point => point.setPath(null))

      return range
    })

    return value
  }

  /**
   * Map all range objects to apply adjustments with an `iterator`.
   *
   * @param {Function} iterator
   * @return {Value}
   */

  mapRanges(iterator) {
    let value = this
    const { document, selection, decorations } = value

    if (selection) {
      let next = selection.isSet ? iterator(selection) : selection
      if (!next) next = Range.create()
      if (next !== selection) next = document.createRange(next)
      value = value.set('selection', next)
    }

    if (decorations) {
      let next = decorations.map(decoration => {
        let n = decoration.isSet ? iterator(decoration) : decoration
        if (n && n !== decoration) n = document.createRange(n)
        return n
      })

      next = next.filter(decoration => !!decoration)
      next = next.size ? next : null
      value = value.set('decorations', next)
    }
    return value
  }

  /**
   * Remove any atomic ranges inside a `key`, `offset` and `length`.
   *
   * @param {String} key
   * @param {Number} from
   * @param {Number?} to
   * @return {Value}
   */

  clearAtomicRanges(key, from, to = null) {
    return this.mapRanges(range => {
      const { isAtomic, start, end } = range
      if (!isAtomic) return range
      if (start.key !== key) return range

      if (start.offset < from && (end.key !== key || end.offset > from)) {
        return null
      }

      if (
        to != null &&
        start.offset < to &&
        (end.key !== key || end.offset > to)
      ) {
        return null
      }

      return range
    })
  }

  /**
   * Return a JSON representation of the value.
   *
   * @param {Object} options
   * @return {Object}
   */

  toJSON(options = {}) {
    const object = {
      object: this.object,
      document: this.document.toJSON(options),
    }

    if (options.preserveData) {
      object.data = this.data.toJSON(options)
    }

    if (options.preserveDecorations) {
      object.decorations = this.decorations
        ? this.decorations.toArray().map(d => d.toJSON(options))
        : null
    }

    if (options.preserveHistory) {
      object.history = this.history.toJSON(options)
    }

    if (options.preserveSelection) {
      object.selection = this.selection.toJSON(options)
    }

    if (options.preserveSchema) {
      object.schema = this.schema.toJSON(options)
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
   * Deprecated.
   */

  get isCollapsed() {
    logger.deprecate(
      '0.37.0',
      'The `value.isCollapsed` property is deprecated, please use `selection.isCollapsed` instead.'
    )

    return this.selection.isCollapsed
  }

  get isExpanded() {
    logger.deprecate(
      '0.37.0',
      'The `value.isExpanded` property is deprecated, please use `selection.isExpanded` instead.'
    )

    return this.selection.isExpanded
  }

  get isBackward() {
    logger.deprecate(
      '0.37.0',
      'The `value.isBackward` property is deprecated, please use `selection.isBackward` instead.'
    )

    return this.selection.isBackward
  }

  get isForward() {
    logger.deprecate(
      '0.37.0',
      'The `value.isForward` property is deprecated, please use `selection.isForward` instead.'
    )

    return this.selection.isForward
  }

  get startKey() {
    logger.deprecate(
      '0.37.0',
      'The `value.startKey` property is deprecated, please use `selection.start.key` instead.'
    )

    return this.selection.start.key
  }

  get endKey() {
    logger.deprecate(
      '0.37.0',
      'The `value.endKey` property is deprecated, please use `selection.end.key` instead.'
    )

    return this.selection.end.key
  }

  get startPath() {
    logger.deprecate(
      '0.37.0',
      'The `value.startPath` property is deprecated, please use `selection.start.path` instead.'
    )

    return this.selection.start.path
  }

  get endPath() {
    logger.deprecate(
      '0.37.0',
      'The `value.endPath` property is deprecated, please use `selection.end.path` instead.'
    )

    return this.selection.end.path
  }

  get startOffset() {
    logger.deprecate(
      '0.37.0',
      'The `value.startOffset` property is deprecated, please use `selection.start.offset` instead.'
    )

    return this.selection.start.offset
  }

  get endOffset() {
    logger.deprecate(
      '0.37.0',
      'The `value.endOffset` property is deprecated, please use `selection.end.offset` instead.'
    )

    return this.selection.end.offset
  }

  get anchorKey() {
    logger.deprecate(
      '0.37.0',
      'The `value.anchorKey` property is deprecated, please use `selection.anchor.key` instead.'
    )

    return this.selection.anchor.key
  }

  get focusKey() {
    logger.deprecate(
      '0.37.0',
      'The `value.focusKey` property is deprecated, please use `selection.focus.key` instead.'
    )

    return this.selection.focus.key
  }

  get anchorPath() {
    logger.deprecate(
      '0.37.0',
      'The `value.anchorPath` property is deprecated, please use `selection.anchor.path` instead.'
    )

    return this.selection.anchor.path
  }

  get focusPath() {
    logger.deprecate(
      '0.37.0',
      'The `value.focusPath` property is deprecated, please use `selection.focus.path` instead.'
    )

    return this.selection.focus.path
  }

  get anchorOffset() {
    logger.deprecate(
      '0.37.0',
      'The `value.anchorOffset` property is deprecated, please use `selection.anchor.offset` instead.'
    )

    return this.selection.anchor.offset
  }

  get focusOffset() {
    logger.deprecate(
      '0.37.0',
      'The `value.focusOffset` property is deprecated, please use `selection.focus.offset` instead.'
    )

    return this.selection.focus.offset
  }
}

/**
 * Attach a pseudo-symbol for type checking.
 */

Value.prototype[MODEL_TYPES.VALUE] = true

/**
 * Export.
 */

export default Value
