
import Document from './document'
import Selection from './selection'
import Transform from './transform'
import { Record, Stack } from 'immutable'

/**
 * History.
 */

const History = new Record({
  undos: new Stack(),
  redos: new Stack()
})

/**
 * Default properties.
 */

const DEFAULTS = {
  document: new Document(),
  selection: new Selection(),
  history: new History(),
  isNative: true
}

/**
 * Node-like methods that should be mixed into the `State` prototype.
 */

const NODE_LIKE_METHODS = [
  'deleteAtRange',
  'deleteBackwardAtRange',
  'deleteForwardAtRange',
  'insertTextAtRange',
  'markAtRange',
  'setBlockAtRange',
  'setInlineAtRange',
  'splitBlockAtRange',
  'splitInlineAtRange',
  'unmarkAtRange',
  'unwrapBlockAtRange',
  'wrapBlockAtRange',
  'wrapInlineAtRange'
]

/**
 * State.
 */

class State extends Record(DEFAULTS) {

  /**
   * Create a new `State` with `properties`.
   *
   * @param {Object} properties
   * @return {State} state
   */

  static create(properties = {}) {
    return new State(properties)
  }

  /**
   * Is the current selection collapsed?
   *
   * @return {Boolean} isCollapsed
   */

  get isCurrentlyCollapsed() {
    return this.selection.isCollapsed
  }

  /**
   * Is the current selection expanded?
   *
   * @return {Boolean} isExpanded
   */

  get isCurrentlyExpanded() {
    return this.selection.isExpanded
  }

  /**
   * Is the current selection backward?
   *
   * @return {Boolean} isBackward
   */

  get isCurrentlyBackward() {
    return this.selection.isBackward
  }

  /**
   * Is the current selection forward?
   *
   * @return {Boolean} isForward
   */

  get isCurrentlyForward() {
    return this.selection.isForward
  }

  /**
   * Get the current start key.
   *
   * @return {String} startKey
   */

  get currentStartKey() {
    return this.selection.startKey
  }

  /**
   * Get the current end key.
   *
   * @return {String} endKey
   */

  get currentEndKey() {
    return this.selection.endKey
  }

  /**
   * Get the current start offset.
   *
   * @return {String} startOffset
   */

  get currentStartOffset() {
    return this.selection.startOffset
  }

  /**
   * Get the current end offset.
   *
   * @return {String} endOffset
   */

  get currentEndOffset() {
    return this.selection.endOffset
  }

  /**
   * Get the current anchor key.
   *
   * @return {String} anchorKey
   */

  get currentAnchorKey() {
    return this.selection.anchorKey
  }

  /**
   * Get the current focus key.
   *
   * @return {String} focusKey
   */

  get currentFocusKey() {
    return this.selection.focusKey
  }

  /**
   * Get the current anchor offset.
   *
   * @return {String} anchorOffset
   */

  get currentAnchorOffset() {
    return this.selection.anchorOffset
  }

  /**
   * Get the current focus offset.
   *
   * @return {String} focusOffset
   */

  get currentFocusOffset() {
    return this.selection.focusOffset
  }

  /**
   * Get the characters in the current selection.
   *
   * @return {List} characters
   */

  get currentCharacters() {
    return this.document.getCharactersAtRange(this.selection)
  }

  /**
   * Get the marks of the current selection.
   *
   * @return {Set} marks
   */

  get currentMarks() {
    return this.document.getMarksAtRange(this.selection)
  }

  /**
   * Get the block nodes in the current selection.
   *
   * @return {OrderedMap} nodes
   */

  get currentBlocks() {
    return this.document.getBlocksAtRange(this.selection)
  }

  /**
   * Get the inline nodes in the current selection.
   *
   * @return {OrderedMap} nodes
   */

  get currentInlines() {
    return this.document.getInlinesAtRange(this.selection)
  }

  /**
   * Get the text nodes in the current selection.
   *
   * @return {OrderedMap} nodes
   */

  get currentTexts() {
    return this.document.getTextsAtRange(this.selection)
  }

  /**
   * Return a new `Transform` with the current state as a starting point.
   *
   * @return {Transform} transform
   */

  transform() {
    const state = this
    return new Transform({ state })
  }

  /**
   * Delete at the current selection.
   *
   * @return {State} state
   */

  delete() {
    let state = this
    let { document, selection } = state

    // When collapsed, there's nothing to do.
    if (selection.isCollapsed) return state

    // Otherwise, delete and update the selection.
    document = document.deleteAtRange(selection)
    selection = selection.moveToStart()
    state = state.merge({ document, selection })
    return state
  }

  /**
   * Delete backward `n` characters at the current selection.
   *
   * @param {Number} n (optional)
   * @return {State} state
   */

  deleteBackward(n = 1) {
    let state = this
    let { document, selection } = state
    let after = selection

    // Determine what the selection should be after deleting.
    const { startKey } = selection
    const startNode = document.getDeep(startKey)

    if (selection.isExpanded) {
      after = selection.moveToStart()
    }

    else if (selection.isAtStartOf(document)) {
      after = selection
    }

    else if (selection.isAtStartOf(startNode)) {
      const parent = document.getParent(startNode)
      const previous = document.getPrevious(parent).nodes.first()
      after = selection.moveToEndOf(previous)
    }

    else {
      after = selection.moveBackward(n)
    }

    // Delete backward and then update the selection.
    document = document.deleteBackwardAtRange(selection)
    selection = after
    state = state.merge({ document, selection })
    return state
  }

  /**
   * Delete forward `n` characters at the current selection.
   *
   * @param {Number} n (optional)
   * @return {State} state
   */

  deleteForward(n = 1) {
    let state = this
    let { document, selection } = state
    let after = selection

    // Determine what the selection should be after deleting.
    if (selection.isExpanded) {
      after = selection.moveToStart()
    }

    // Delete forward and then update the selection.
    document = document.deleteForwardAtRange(selection)
    selection = after
    state = state.merge({ document, selection })
    return state
  }

  /**
   * Insert a `text` string at the current selection.
   *
   * @param {String} text
   * @return {State} state
   */

  insertText(text) {
    let state = this
    let { document, selection } = state

    // Insert the text and update the selection.
    document = document.insertTextAtRange(selection, text)
    selection = selection.moveForward(text.length)
    state = state.merge({ document, selection })
    return state
  }

  /**
   * Add a `mark` to the characters in the current selection.
   *
   * @param {Mark} mark
   * @return {State} state
   */

  mark(mark) {
    let state = this
    let { document, selection } = state
    document = document.markAtRange(selection, mark)
    state = state.merge({ document })
    return state
  }

  /**
   * Set the block nodes in the current selection to `type`.
   *
   * @param {String} type
   * @return {State} state
   */

  setBlock(type, data) {
    let state = this
    let { document, selection } = state
    document = document.setBlockAtRange(selection, type, data)
    state = state.merge({ document })
    return state
  }

  /**
   * Set the inline nodes in the current selection to `type`.
   *
   * @param {String} type
   * @return {State} state
   */

  setInline(type, data) {
    let state = this
    let { document, selection } = state
    document = document.setInlineAtRange(selection, type, data)
    state = state.merge({ document })
    return state
  }

  /**
   * Split the node at the current selection.
   *
   * @return {State} state
   */

  split() {
    let state = this
    let { document, selection } = state
    let after

    // Split the document.
    document = document.splitAtRange(selection)

    // Determine what the selection should be after splitting.
    const { startKey } = selection
    const startNode = document.getDeep(startKey)
    const parent = document.getParent(startNode)
    const next = document.getNext(parent)
    const text = next.nodes.first()
    selection = selection.moveToStartOf(text)

    state = state.merge({ document, selection })
    return state
  }

  /**
   * Remove a `mark` to the characters in the current selection.
   *
   * @param {Mark} mark
   * @return {State} state
   */

  unmark(mark) {
    let state = this
    let { document, selection } = state
    document = document.unmarkAtRange(selection, mark)
    state = state.merge({ document })
    return state
  }

  /**
   * Wrap the block nodes in the current selection in new nodes of `type`.
   *
   * @param {String} type
   * @return {State} state
   */

  wrapBlock(type) {
    let state = this
    let { document, selection } = state
    document = document.wrapBlockAtRange(selection, type)
    state = state.merge({ document })
    return state
  }

  /**
   * Unwrap the block nodes in the current selection from a parent of `type`.
   *
   * @param {String} type
   * @return {State} state
   */

  unwrapBlock(type) {
    let state = this
    let { document, selection } = state
    selection = selection.normalize(document)
    document = document.unwrapBlockAtRange(selection, type)
    state = state.merge({ document, selection })
    return state
  }

  /**
   * Wrap the current selection in new inline nodes of `type`.
   *
   * @param {String} type
   * @param {Map} data
   * @return {State} state
   */

  wrapInline(type, data) {
    let state = this
    let { document, selection } = state
    document = document.wrapInlineAtRange(selection, type, data)
    state = state.merge({ document })
    return state
  }

  /**
   * Unwrap the current selection from a parent of `type`.
   *
   * @param {String} type
   * @return {State} state
   */

  unwrapInline(type) {
    let state = this
    let { document, selection } = state
    selection = selection.normalize(document)
    document = document.unwrapInlineAtRange(selection, type)
    state = state.merge({ document, selection })
    return state
  }

}

/**
 * Mix in node-like methods.
 */

NODE_LIKE_METHODS.forEach((method) => {
  State.prototype[method] = function (...args) {
    let { document } = this
    document = document[method](...args)
    return this.merge({ document })
  }
})

/**
 * Export.
 */

export default State
