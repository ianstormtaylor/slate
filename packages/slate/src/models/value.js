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
      if (text) selection = selection.collapseToStartOf(text)
      selection = document.createRange(selection)
    }

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
   * Is the current selection collapsed?
   *
   * @return {Boolean}
   */

  get isCollapsed() {
    return this.selection.isCollapsed
  }

  /**
   * Is the current selection expanded?
   *
   * @return {Boolean}
   */

  get isExpanded() {
    return this.selection.isExpanded
  }

  /**
   * Is the current selection backward?
   *
   * @return {Boolean} isBackward
   */

  get isBackward() {
    return this.selection.isBackward
  }

  /**
   * Is the current selection forward?
   *
   * @return {Boolean}
   */

  get isForward() {
    return this.selection.isForward
  }

  /**
   * Get the current start key.
   *
   * @return {String}
   */

  get startKey() {
    return this.selection.startKey
  }

  /**
   * Get the current end key.
   *
   * @return {String}
   */

  get endKey() {
    return this.selection.endKey
  }

  /**
   * Get the current start path.
   *
   * @return {String}
   */

  get startPath() {
    return this.selection.startPath
  }

  /**
   * Get the current end path.
   *
   * @return {String}
   */

  get endPath() {
    return this.selection.endPath
  }

  /**
   * Get the current start offset.
   *
   * @return {String}
   */

  get startOffset() {
    return this.selection.startOffset
  }

  /**
   * Get the current end offset.
   *
   * @return {String}
   */

  get endOffset() {
    return this.selection.endOffset
  }

  /**
   * Get the current anchor key.
   *
   * @return {String}
   */

  get anchorKey() {
    return this.selection.anchorKey
  }

  /**
   * Get the current focus key.
   *
   * @return {String}
   */

  get focusKey() {
    return this.selection.focusKey
  }

  /**
   * Get the current anchor path.
   *
   * @return {String}
   */

  get anchorPath() {
    return this.selection.anchorPath
  }

  /**
   * Get the current focus path.
   *
   * @return {String}
   */

  get focusPath() {
    return this.selection.focusPath
  }

  /**
   * Get the current anchor offset.
   *
   * @return {String}
   */

  get anchorOffset() {
    return this.selection.anchorOffset
  }

  /**
   * Get the current focus offset.
   *
   * @return {String}
   */

  get focusOffset() {
    return this.selection.focusOffset
  }

  /**
   * Get the current start text node's closest block parent.
   *
   * @return {Block}
   */

  get startBlock() {
    return this.startKey && this.document.getClosestBlock(this.startKey)
  }

  /**
   * Get the current end text node's closest block parent.
   *
   * @return {Block}
   */

  get endBlock() {
    return this.endKey && this.document.getClosestBlock(this.endKey)
  }

  /**
   * Get the current anchor text node's closest block parent.
   *
   * @return {Block}
   */

  get anchorBlock() {
    return this.anchorKey && this.document.getClosestBlock(this.anchorKey)
  }

  /**
   * Get the current focus text node's closest block parent.
   *
   * @return {Block}
   */

  get focusBlock() {
    return this.focusKey && this.document.getClosestBlock(this.focusKey)
  }

  /**
   * Get the current start text node's closest inline parent.
   *
   * @return {Inline}
   */

  get startInline() {
    return this.startKey && this.document.getClosestInline(this.startKey)
  }

  /**
   * Get the current end text node's closest inline parent.
   *
   * @return {Inline}
   */

  get endInline() {
    return this.endKey && this.document.getClosestInline(this.endKey)
  }

  /**
   * Get the current anchor text node's closest inline parent.
   *
   * @return {Inline}
   */

  get anchorInline() {
    return this.anchorKey && this.document.getClosestInline(this.anchorKey)
  }

  /**
   * Get the current focus text node's closest inline parent.
   *
   * @return {Inline}
   */

  get focusInline() {
    return this.focusKey && this.document.getClosestInline(this.focusKey)
  }

  /**
   * Get the current start text node.
   *
   * @return {Text}
   */

  get startText() {
    return this.startKey && this.document.getDescendant(this.startKey)
  }

  /**
   * Get the current end node.
   *
   * @return {Text}
   */

  get endText() {
    return this.endKey && this.document.getDescendant(this.endKey)
  }

  /**
   * Get the current anchor node.
   *
   * @return {Text}
   */

  get anchorText() {
    return this.anchorKey && this.document.getDescendant(this.anchorKey)
  }

  /**
   * Get the current focus node.
   *
   * @return {Text}
   */

  get focusText() {
    return this.focusKey && this.document.getDescendant(this.focusKey)
  }

  /**
   * Get the next block node.
   *
   * @return {Block}
   */

  get nextBlock() {
    return this.endKey && this.document.getNextBlock(this.endKey)
  }

  /**
   * Get the previous block node.
   *
   * @return {Block}
   */

  get previousBlock() {
    return this.startKey && this.document.getPreviousBlock(this.startKey)
  }

  /**
   * Get the next inline node.
   *
   * @return {Inline}
   */

  get nextInline() {
    return this.endKey && this.document.getNextInline(this.endKey)
  }

  /**
   * Get the previous inline node.
   *
   * @return {Inline}
   */

  get previousInline() {
    return this.startKey && this.document.getPreviousInline(this.startKey)
  }

  /**
   * Get the next text node.
   *
   * @return {Text}
   */

  get nextText() {
    return this.endKey && this.document.getNextText(this.endKey)
  }

  /**
   * Get the previous text node.
   *
   * @return {Text}
   */

  get previousText() {
    return this.startKey && this.document.getPreviousText(this.startKey)
  }

  /**
   * Get the characters in the current selection.
   *
   * @return {List<Character>}
   */

  get characters() {
    return this.selection.isUnset
      ? new List()
      : this.document.getCharactersAtRange(this.selection)
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
    if (this.isCollapsed) return true
    if (this.endOffset != 0 && this.startOffset != 0) return false
    return this.fragment.isEmpty
  }

  /**
   * Check whether the selection is collapsed in a void node.
   *
   * @return {Boolean}
   */

  get isInVoid() {
    if (this.isExpanded) return false
    return this.document.hasVoidParent(this.startKey)
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

    value = value.mapRanges(range => {
      return range.merge({ anchorPath: null, focusPath: null })
    })

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
    value = value.clearAtomicRanges(node.key, offset)

    value = value.mapRanges(range => {
      const { anchorKey, anchorOffset, isBackward, isAtomic } = range

      if (
        anchorKey === node.key &&
        (anchorOffset > offset ||
          (anchorOffset === offset && (!isAtomic || !isBackward)))
      ) {
        return range.moveAnchor(text.length)
      }

      return range
    })

    value = value.mapRanges(range => {
      const { focusKey, focusOffset, isBackward, isAtomic } = range

      if (
        focusKey === node.key &&
        (focusOffset > offset ||
          (focusOffset == offset && (!isAtomic || isBackward)))
      ) {
        return range.moveFocus(text.length)
      }

      return range
    })

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

        if (range.anchorKey === two.key) {
          range = range.moveAnchorTo(one.key, max + range.anchorOffset)
        }

        if (range.focusKey === two.key) {
          range = range.moveFocusTo(one.key, max + range.focusOffset)
        }
      }

      range = range.merge({ anchorPath: null, focusPath: null })
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

    value = value.mapRanges(range => {
      return range.merge({ anchorPath: null, focusPath: null })
    })

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
      const { startKey, endKey } = range

      if (node.hasNode(startKey)) {
        range = prev
          ? range.moveStartTo(prev.key, prev.text.length)
          : next ? range.moveStartTo(next.key, 0) : range.deselect()
      }

      if (node.hasNode(endKey)) {
        range = prev
          ? range.moveEndTo(prev.key, prev.text.length)
          : next ? range.moveEndTo(next.key, 0) : range.deselect()
      }

      range = range.merge({ anchorPath: null, focusPath: null })
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
      const { anchorKey } = range

      if (anchorKey === node.key) {
        return range.anchorOffset >= rangeOffset
          ? range.moveAnchor(-length)
          : range.anchorOffset > offset
            ? range.moveAnchorTo(range.anchorKey, offset)
            : range
      }

      return range
    })

    value = value.mapRanges(range => {
      const { focusKey } = range

      if (focusKey === node.key) {
        return range.focusOffset >= rangeOffset
          ? range.moveFocus(-length)
          : range.focusOffset > offset
            ? range.moveFocusTo(range.focusKey, offset)
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
    const next = selection.merge(properties)
    selection = document.createRange(next)
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
      const { startKey, startOffset, endKey, endOffset } = range

      // If the start was after the split, move it to the next node.
      if (node.key === startKey && position <= startOffset) {
        range = range.moveStartTo(next.key, startOffset - position)
      }

      // If the end was after the split, move it to the next node.
      if (node.key === endKey && position <= endOffset) {
        range = range.moveEndTo(next.key, endOffset - position)
      }

      range = range.merge({ anchorPath: null, focusPath: null })
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
      if (!next) next = selection.deselect()
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
   * @param {Number} start
   * @param {Number?} end
   * @return {Value}
   */

  clearAtomicRanges(key, start, end = null) {
    return this.mapRanges(range => {
      const { isAtomic, startKey, startOffset, endKey, endOffset } = range
      if (!isAtomic) return range
      if (startKey !== key) return range

      if (startOffset < start && (endKey !== key || endOffset > start)) {
        return null
      }

      if (
        end != null &&
        startOffset < end &&
        (endKey !== key || endOffset > end)
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
}

/**
 * Attach a pseudo-symbol for type checking.
 */

Value.prototype[MODEL_TYPES.VALUE] = true

/**
 * Export.
 */

export default Value
