
import isPlainObject from 'is-plain-object'
import logger from 'slate-dev-logger'
import { Record, Set, List, Map } from 'immutable'

import MODEL_TYPES from '../constants/model-types'
import SCHEMA from '../schemas/core'
import Change from './change'
import Document from './document'
import History from './history'
import Selection from './selection'

/**
 * Default properties.
 *
 * @type {Object}
 */

const DEFAULTS = {
  document: Document.create(),
  selection: Selection.create(),
  history: History.create(),
  data: new Map(),
}

/**
 * State.
 *
 * @type {State}
 */

class State extends Record(DEFAULTS) {

  /**
   * Create a new `State` with `attrs`.
   *
   * @param {Object|State} attrs
   * @param {Object} options
   * @return {State}
   */

  static create(attrs = {}, options = {}) {
    if (State.isState(attrs)) {
      return attrs
    }

    if (isPlainObject(attrs)) {
      return State.fromJSON(attrs)
    }

    throw new Error(`\`State.create\` only accepts objects or states, but you passed it: ${attrs}`)
  }

  /**
   * Create a `State` from a JSON `object`.
   *
   * @param {Object} object
   * @param {Object} options
   *   @property {Boolean} normalize
   *   @property {Array} plugins
   * @return {State}
   */

  static fromJSON(object, options = {}) {
    let {
      document = {},
      selection = {},
    } = object

    let data = new Map()

    document = Document.fromJSON(document)
    selection = Selection.fromJSON(selection)

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

    let state = new State({
      data,
      document,
      selection,
    })


    if (options.normalize !== false) {
      state = state
        .change({ save: false })
        .normalize(SCHEMA)
        .state
    }

    return state
  }

  /**
   * Alias `fromJS`.
   */

  static fromJS = State.fromJSON

  /**
   * Check if a `value` is a `State`.
   *
   * @param {Any} value
   * @return {Boolean}
   */

  static isState(value) {
    return !!(value && value[MODEL_TYPES.STATE])
  }

  /**
   * Get the kind.
   *
   * @return {String}
   */

  get kind() {
    return 'state'
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
    return this.selection.isUnset
      ? null
      : this.document.getClosestBlock(this.selection.startKey)
  }

  /**
   * Get the current end text node's closest block parent.
   *
   * @return {Block}
   */

  get endBlock() {
    return this.selection.isUnset
      ? null
      : this.document.getClosestBlock(this.selection.endKey)
  }

  /**
   * Get the current anchor text node's closest block parent.
   *
   * @return {Block}
   */

  get anchorBlock() {
    return this.selection.isUnset
      ? null
      : this.document.getClosestBlock(this.selection.anchorKey)
  }

  /**
   * Get the current focus text node's closest block parent.
   *
   * @return {Block}
   */

  get focusBlock() {
    return this.selection.isUnset
      ? null
      : this.document.getClosestBlock(this.selection.focusKey)
  }

  /**
   * Get the current start text node's closest inline parent.
   *
   * @return {Inline}
   */

  get startInline() {
    return this.selection.isUnset
      ? null
      : this.document.getClosestInline(this.selection.startKey)
  }

  /**
   * Get the current end text node's closest inline parent.
   *
   * @return {Inline}
   */

  get endInline() {
    return this.selection.isUnset
      ? null
      : this.document.getClosestInline(this.selection.endKey)
  }

  /**
   * Get the current anchor text node's closest inline parent.
   *
   * @return {Inline}
   */

  get anchorInline() {
    return this.selection.isUnset
      ? null
      : this.document.getClosestInline(this.selection.anchorKey)
  }

  /**
   * Get the current focus text node's closest inline parent.
   *
   * @return {Inline}
   */

  get focusInline() {
    return this.selection.isUnset
      ? null
      : this.document.getClosestInline(this.selection.focusKey)
  }

  /**
   * Get the current start text node.
   *
   * @return {Text}
   */

  get startText() {
    return this.selection.isUnset
      ? null
      : this.document.getDescendant(this.selection.startKey)
  }

  /**
   * Get the current end node.
   *
   * @return {Text}
   */

  get endText() {
    return this.selection.isUnset
      ? null
      : this.document.getDescendant(this.selection.endKey)
  }

  /**
   * Get the current anchor node.
   *
   * @return {Text}
   */

  get anchorText() {
    return this.selection.isUnset
      ? null
      : this.document.getDescendant(this.selection.anchorKey)
  }

  /**
   * Get the current focus node.
   *
   * @return {Text}
   */

  get focusText() {
    return this.selection.isUnset
      ? null
      : this.document.getDescendant(this.selection.focusKey)
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
      : this.selection.marks || this.document.getActiveMarksAtRange(this.selection)
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
    const { startOffset, endOffset } = this

    if (this.isCollapsed) {
      return true
    }

    if (endOffset != 0 && startOffset != 0) {
      return false
    }

    return this.fragment.text.length == 0
  }

  /**
   * Create a new `Change` with the current state as a starting point.
   *
   * @param {Object} attrs
   * @return {Change}
   */

  change(attrs = {}) {
    return new Change({ ...attrs, state: this })
  }

  /**
   * Deprecated.
   *
   * @return {Change}
   */

  transform(...args) {
    logger.deprecate('0.22.0', 'The `state.transform()` method has been deprecated in favor of `state.change()`.')
    return this.change(...args)
  }

  /**
   * Return a JSON representation of the state.
   *
   * @param {Object} options
   * @return {Object}
   */

  toJSON(options = {}) {
    const object = {
      data: this.data.toJSON(),
      document: this.document.toJSON(options),
      kind: this.kind,
      history: this.history.toJSON(),
      selection: this.selection.toJSON(),
    }

    if (!options.preserveHistory) {
      delete object.history
    }

    if (!options.preserveSelection) {
      delete object.selection
    }

    if (!options.preserveStateData) {
      delete object.data
    }

    if (options.preserveSelection && !options.preserveKeys) {
      const { document, selection } = this
      object.selection.anchorPath = document.getPath(selection.anchorKey)
      object.selection.focusPath = document.getPath(selection.focusKey)
      delete object.selection.anchorKey
      delete object.selection.focusKey
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

State.prototype[MODEL_TYPES.STATE] = true

/**
 * Export.
 */

export default State
