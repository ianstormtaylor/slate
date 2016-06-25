
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
  isNative: true,
  copiedFragment: null
}

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
    if (properties instanceof State) return properties
    properties.document = Document.create(properties.document)
    properties.selection = Selection.create(properties.selection)
    return new State(properties)
  }

  /**
   * Is the current selection collapsed?
   *
   * @return {Boolean} isCollapsed
   */

  get isCollapsed() {
    return this.selection.isCollapsed
  }

  /**
   * Is the current selection expanded?
   *
   * @return {Boolean} isExpanded
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
   * @return {Boolean} isForward
   */

  get isForward() {
    return this.selection.isForward
  }

  /**
   * Get the current start key.
   *
   * @return {String} startKey
   */

  get startKey() {
    return this.selection.startKey
  }

  /**
   * Get the current end key.
   *
   * @return {String} endKey
   */

  get endKey() {
    return this.selection.endKey
  }

  /**
   * Get the current start offset.
   *
   * @return {String} startOffset
   */

  get startOffset() {
    return this.selection.startOffset
  }

  /**
   * Get the current end offset.
   *
   * @return {String} endOffset
   */

  get endOffset() {
    return this.selection.endOffset
  }

  /**
   * Get the current anchor key.
   *
   * @return {String} anchorKey
   */

  get anchorKey() {
    return this.selection.anchorKey
  }

  /**
   * Get the current focus key.
   *
   * @return {String} focusKey
   */

  get focusKey() {
    return this.selection.focusKey
  }

  /**
   * Get the current anchor offset.
   *
   * @return {String} anchorOffset
   */

  get anchorOffset() {
    return this.selection.anchorOffset
  }

  /**
   * Get the current focus offset.
   *
   * @return {String} focusOffset
   */

  get focusOffset() {
    return this.selection.focusOffset
  }

  /**
   * Get the current start text node.
   *
   * @return {Text} text
   */

  get startText() {
    return this.document.getDescendant(this.selection.startKey)
  }

  /**
   * Get the current end node.
   *
   * @return {Text} text
   */

  get endText() {
    return this.document.getDescendant(this.selection.endKey)
  }

  /**
   * Get the current anchor node.
   *
   * @return {Text} text
   */

  get anchorText() {
    return this.document.getDescendant(this.selection.anchorKey)
  }

  /**
   * Get the current focus node.
   *
   * @return {Text} text
   */

  get focusText() {
    return this.document.getDescendant(this.selection.focusKey)
  }

  /**
   * Get the current start text node's closest block parent.
   *
   * @return {Block} block
   */

  get startBlock() {
    return this.document.getClosestBlock(this.selection.startKey)
  }

  /**
   * Get the current end text node's closest block parent.
   *
   * @return {Block} block
   */

  get endBlock() {
    return this.document.getClosestBlock(this.selection.endKey)
  }

  /**
   * Get the current anchor text node's closest block parent.
   *
   * @return {Block} block
   */

  get anchorBlock() {
    return this.document.getClosestBlock(this.selection.anchorKey)
  }

  /**
   * Get the current focus text node's closest block parent.
   *
   * @return {Block} block
   */

  get focusBlock() {
    return this.document.getClosestBlock(this.selection.focusKey)
  }

  /**
   * Get the characters in the current selection.
   *
   * @return {List} characters
   */

  get characters() {
    return this.document.getCharactersAtRange(this.selection)
  }

  /**
   * Get the marks of the current selection.
   *
   * @return {Set} marks
   */

  get marks() {
    return this.document.getMarksAtRange(this.selection)
  }

  /**
   * Get the block nodes in the current selection.
   *
   * @return {List} nodes
   */

  get blocks() {
    return this.document.getBlocksAtRange(this.selection)
  }

  /**
   * Get the fragment of the current selection.
   *
   * @return {List} nodes
   */

  get fragment() {
    return this.document.getFragmentAtRange(this.selection)
  }

  /**
   * Get the inline nodes in the current selection.
   *
   * @return {List} nodes
   */

  get inlines() {
    return this.document.getInlinesAtRange(this.selection)
  }

  /**
   * Get the text nodes in the current selection.
   *
   * @return {List} nodes
   */

  get texts() {
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
    const startNode = document.getDescendant(startKey)

    if (selection.isExpanded) {
      after = selection.moveToStart()
    }

    else if (selection.isAtStartOf(document)) {
      after = selection
    }

    else if (selection.isAtStartOf(startNode)) {
      const parent = document.getParent(startNode)
      const previous = document.getPreviousSibling(parent).nodes.first()
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
   * Insert a `fragment` at the current selection.
   *
   * @param {List} fragment
   * @return {State} state
   */

  insertFragment(fragment) {
    let state = this
    let { document, selection } = state

    // If there's nothing in the fragment, do nothing.
    if (!fragment.length) return state

    // Insert the fragment.
    document = document.insertFragmentAtRange(selection, fragment)

    // Determine what the selection should be after inserting.
    const texts = fragment.getTextNodes()
    const first = texts.first()
    const last = texts.last()
    selection = first == last
      ? selection.moveForward(fragment.length)
      : selection.moveToEndOf(last)

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
    let after = selection

    // Determine what the selection should be after inserting.
    if (selection.isExpanded) {
      after = selection.moveToStart()
    }

    // Insert the text and update the selection.
    document = document.insertTextAtRange(selection, text)
    selection = after
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
   * Split the block node at the current selection.
   *
   * @return {State} state
   */

  splitBlock() {
    let state = this
    let { document, selection } = state

    // Split the document.
    document = document.splitBlockAtRange(selection)

    // Determine what the selection should be after splitting.
    const { startKey } = selection
    const startNode = document.getDescendant(startKey)
    const nextNode = document.getNextText(startNode)
    selection = selection.moveToStartOf(nextNode)

    state = state.merge({ document, selection })
    return state
  }

  /**
   * Split the inline nodes at the current selection.
   *
   * @return {State} state
   */

  splitInline() {
    let state = this
    let { document, selection } = state

    // Split the document.
    document = document.splitInlineAtRange(selection)

    // Determine what the selection should be after splitting.
    const { startKey } = selection
    const inlineParent = document.getClosestInline(startKey)

    if (inlineParent) {
      const startNode = document.getDescendant(startKey)
      const nextNode = document.getNextText(startNode)
      selection = selection.moveToStartOf(nextNode)
    }

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
   * @param {Data} data (optional)
   * @return {State} state
   */

  wrapBlock(type, data) {
    let state = this
    let { document, selection } = state
    document = document.wrapBlockAtRange(selection, type, data)
    state = state.merge({ document })
    return state
  }

  /**
   * Unwrap the current selection from a block parent of `type`.
   *
   * @param {String} type (optional)
   * @param {Data} data (optional)
   * @return {State} state
   */

  unwrapBlock(type, data) {
    let state = this
    let { document, selection } = state
    document = document.unwrapBlockAtRange(selection, type, data)
    state = state.merge({ document, selection })
    return state
  }

  /**
   * Wrap the current selection in new inline nodes of `type`.
   *
   * @param {String} type
   * @param {Data} data (optional)
   * @return {State} state
   */

  wrapInline(type, data) {
    let state = this
    let { document, selection } = state
    document = document.wrapInlineAtRange(selection, type, data)

    // Determine what the selection should be after wrapping.
    if (selection.isCollapsed) {
      selection = selection
    }

    else {
      const startText = document.getNextText(selection.startKey)
      const endText = document.getPreviousText(selection.endKey)
      selection = selection.moveToRangeOf(start, end)
      selection = selection.normalize(document)
    }

    state = state.merge({ document, selection })
    return state
  }

  /**
   * Unwrap the current selection from an inline parent of `type`.
   *
   * @param {String} type (optional)
   * @param {Data} data (optional)
   * @return {State} state
   */

  unwrapInline(type, data) {
    let state = this
    let { document, selection } = state
    document = document.unwrapInlineAtRange(selection, type, data)
    state = state.merge({ document, selection })
    return state
  }

}

/**
 * Export.
 */

export default State
