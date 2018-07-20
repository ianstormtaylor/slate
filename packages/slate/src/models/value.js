import isPlainObject from 'is-plain-object'
import logger from 'slate-dev-logger'
import { Record, Set, List, Map } from 'immutable'

import MODEL_TYPES from '../constants/model-types'
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

  static createProperties(attrs = {}) {
    if (Value.isValue(attrs)) {
      return {
        data: attrs.data,
        decorations: attrs.decorations,
        schema: attrs.schema,
      }
    }

    if (isPlainObject(attrs)) {
      const props = {}
      if ('data' in attrs) props.data = Data.create(attrs.data)
      if ('decorations' in attrs)
        props.decorations = Range.createList(attrs.decorations)
      if ('schema' in attrs) props.schema = Schema.create(attrs.schema)
      return props
    }

    throw new Error(
      `\`Value.createProperties\` only accepts objects or values, but you passed it: ${attrs}`
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

    // rebuild selection from anchorPath and focusPath if keys were dropped
    const { anchorPath, focusPath, anchorKey, focusKey } = selection

    if (anchorPath !== undefined && anchorKey === undefined) {
      selection.anchorKey = document.assertPath(anchorPath).key
    }

    if (focusPath !== undefined && focusKey === undefined) {
      selection.focusKey = document.assertPath(focusPath).key
    }

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

    if (selection.isUnset) {
      const text = document.getFirstText()
      if (text) selection = selection.collapseToStartOf(text)
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
      object.data = this.data.toJSON()
    }

    if (options.preserveDecorations) {
      object.decorations = this.decorations
        ? this.decorations.toArray().map(d => d.toJSON())
        : null
    }

    if (options.preserveHistory) {
      object.history = this.history.toJSON()
    }

    if (options.preserveSelection) {
      object.selection = this.selection.toJSON()
    }

    if (options.preserveSchema) {
      object.schema = this.schema.toJSON()
    }

    if (options.preserveSelection && !options.preserveKeys) {
      const { document, selection } = this

      object.selection.anchorPath = selection.isSet
        ? document.getPath(selection.anchorKey)
        : null

      object.selection.focusPath = selection.isSet
        ? document.getPath(selection.focusKey)
        : null

      delete object.selection.anchorKey
      delete object.selection.focusKey
    }

    if (
      options.preserveDecorations &&
      object.decorations &&
      !options.preserveKeys
    ) {
      const { document } = this

      object.decorations = object.decorations.map(decoration => {
        const withPath = {
          ...decoration,
          anchorPath: document.getPath(decoration.anchorKey),
          focusPath: document.getPath(decoration.focusKey),
        }
        delete withPath.anchorKey
        delete withPath.focusKey
        return withPath
      })
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
