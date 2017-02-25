

import Document from './document'
import SCHEMA from '../schemas/core'
import Selection from './selection'
import Transform from './transform'
import { Record, Set, Stack, List } from 'immutable'

/**
 * History.
 *
 * @type {History}
 */

const History = new Record({
  undos: new Stack(),
  redos: new Stack()
})

/**
 * Default properties.
 *
 * @type {Object}
 */

const DEFAULTS = {
  document: new Document(),
  selection: new Selection(),
  history: new History(),
  isNative: false
}

/**
 * State.
 *
 * @type {State}
 */

class State extends new Record(DEFAULTS) {

  /**
   * Create a new `State` with `properties`.
   *
   * @param {Object|State} properties
   * @return {State}
   */

  static create(properties = {}, options = {}) {
    if (properties instanceof State) return properties

    // Create a document and selection.
    const document = Document.create(properties.document)
    let selection = Selection.create(properties.selection)

    // If the selection isn't set, default it to the beginning of the document.
    if (selection.isUnset) {
      const text = document.getFirstText()
      selection = selection.collapseToStartOf(text)
    }

    // Create a new state.
    const state = new State({ document, selection })

    // Normalize the state before returning if requested.
    if (options.normalize) {
      return state
        .transform()
        .normalize(SCHEMA)
        .apply({ save: false })
    } else {
      return state
    }
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
    return this.document.getClosestBlock(this.selection.startKey)
  }

  /**
   * Get the current end text node's closest block parent.
   *
   * @return {Block}
   */

  get endBlock() {
    return this.document.getClosestBlock(this.selection.endKey)
  }

  /**
   * Get the current anchor text node's closest block parent.
   *
   * @return {Block}
   */

  get anchorBlock() {
    return this.document.getClosestBlock(this.selection.anchorKey)
  }

  /**
   * Get the current focus text node's closest block parent.
   *
   * @return {Block}
   */

  get focusBlock() {
    return this.document.getClosestBlock(this.selection.focusKey)
  }

  /**
   * Get the current start text node's closest inline parent.
   *
   * @return {Inline}
   */

  get startInline() {
    return this.document.getClosestInline(this.selection.startKey)
  }

  /**
   * Get the current end text node's closest inline parent.
   *
   * @return {Inline}
   */

  get endInline() {
    return this.document.getClosestInline(this.selection.endKey)
  }

  /**
   * Get the current anchor text node's closest inline parent.
   *
   * @return {Inline}
   */

  get anchorInline() {
    return this.document.getClosestInline(this.selection.anchorKey)
  }

  /**
   * Get the current focus text node's closest inline parent.
   *
   * @return {Inline}
   */

  get focusInline() {
    return this.document.getClosestInline(this.selection.focusKey)
  }

  /**
   * Get the current start text node.
   *
   * @return {Text}
   */

  get startText() {
    return this.document.getDescendant(this.selection.startKey)
  }

  /**
   * Get the current end node.
   *
   * @return {Text}
   */

  get endText() {
    return this.document.getDescendant(this.selection.endKey)
  }

  /**
   * Get the current anchor node.
   *
   * @return {Text}
   */

  get anchorText() {
    return this.document.getDescendant(this.selection.anchorKey)
  }

  /**
   * Get the current focus node.
   *
   * @return {Text}
   */

  get focusText() {
    return this.document.getDescendant(this.selection.focusKey)
  }

  /**
   * Get the characters in the current selection.
   *
   * @return {List<Character>}
   */

  get characters() {
    return this.document.getCharactersAtRange(this.selection)
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
   * Return a new `Transform` with the current state as a starting point.
   *
   * @param {Object} properties
   * @return {Transform}
   */

  transform(properties = {}) {
    const state = this
    return new Transform({
      ...properties,
      state
    })
  }

}

/**
 * Export.
 */

export default State
