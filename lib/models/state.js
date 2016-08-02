

import Document from './document'
import Mark from './mark'
import Selection from './selection'
import Transform from './transform'
import uid from '../utils/uid'
import { Record, Set, Stack } from 'immutable'

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
  cursorMarks: null,
  document: new Document(),
  selection: new Selection(),
  history: new History(),
  isNative: false
}

/**
 * State.
 */

class State extends new Record(DEFAULTS) {

  /**
   * Create a new `State` with `properties`.
   *
   * @param {Object} properties
   * @return {State} state
   */

  static create(properties = {}) {
    if (properties instanceof State) return properties
    properties.document = Document.create(properties.document)
    properties.selection = Selection.create(properties.selection).normalize(properties.document)
    return new State(properties)
  }

  /**
   * Get the kind.
   *
   * @return {String} kind
   */

  get kind() {
    return 'state'
  }

  /**
   * Is there undoable events?
   *
   * @return {Boolean} hasUndos
   */

  get hasUndos() {
    return this.history.undos.size > 0
  }

  /**
   * Is there redoable events?
   *
   * @return {Boolean} hasRedos
   */

  get hasRedos() {
    return this.history.redos.size > 0
  }

  /**
   * Is the current selection blurred?
   *
   * @return {Boolean} isBlurred
   */

  get isBlurred() {
    return this.selection.isBlurred
  }

  /**
   * Is the current selection focused?
   *
   * @return {Boolean} isFocused
   */

  get isFocused() {
    return this.selection.isFocused
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
    return this.cursorMarks || this.document.getMarksAtRange(this.selection)
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
   * Add a `mark` to the characters in the current selection.
   *
   * @param {Mark} mark
   * @return {State} state
   */

  addMark(mark) {
    mark = normalizeMark(mark)
    let state = this
    let { cursorMarks, document, selection } = state

    // If the selection is collapsed, add the mark to the cursor instead.
    if (selection.isCollapsed) {
      const marks = document.getMarksAtRange(selection)
      state = state.merge({ cursorMarks: marks.add(mark) })
      return state
    }

    document = document.addMarkAtRange(selection, mark)
    state = state.merge({ document })
    return state
  }

  /**
   * Move the selection to the start of the previous block.
   *
   * @return {State} state
   */

  collapseToStartOfPreviousBlock() {
    let state = this
    let { document, selection } = state
    let blocks = document.getBlocksAtRange(selection)
    let block = blocks.first()
    if (!block) return state

    let previous = document.getPreviousBlock(block)
    if (!previous) return state

    selection = selection.collapseToStartOf(previous)
    selection = selection.normalize(document)
    state = state.merge({ selection })
    return state
  }

  /**
   * Move the selection to the end of the previous block.
   *
   * @return {State} state
   */

  collapseToEndOfPreviousBlock() {
    let state = this
    let { document, selection } = state
    let blocks = document.getBlocksAtRange(selection)
    let block = blocks.first()
    if (!block) return state

    let previous = document.getPreviousBlock(block)
    if (!previous) return state

    selection = selection.collapseToEndOf(previous)
    selection = selection.normalize(document)
    state = state.merge({ selection })
    return state
  }

  /**
   * Move the selection to the start of the next block.
   *
   * @return {State} state
   */

  collapseToStartOfNextBlock() {
    let state = this
    let { document, selection } = state
    let blocks = document.getBlocksAtRange(selection)
    let block = blocks.last()
    if (!block) return state

    let next = document.getNextBlock(block)
    if (!next) return state

    selection = selection.collapseToStartOf(next)
    selection = selection.normalize(document)
    state = state.merge({ selection })
    return state
  }

  /**
   * Move the selection to the end of the next block.
   *
   * @return {State} state
   */

  collapseToEndOfNextBlock() {
    let state = this
    let { document, selection } = state
    let blocks = document.getBlocksAtRange(selection)
    let block = blocks.last()
    if (!block) return state

    let next = document.getNextBlock(block)
    if (!next) return state

    selection = selection.collapseToEndOf(next)
    selection = selection.normalize(document)
    state = state.merge({ selection })
    return state
  }

  /**
   * Move the selection to the start of the previous text.
   *
   * @return {State} state
   */

  collapseToStartOfPreviousText() {
    let state = this
    let { document, selection } = state
    let texts = document.getTextsAtRange(selection)
    let text = texts.first()
    if (!text) return state

    let previous = document.getPreviousText(text)
    if (!previous) return state

    selection = selection.collapseToStartOf(previous)
    selection = selection.normalize(document)
    state = state.merge({ selection })
    return state
  }

  /**
   * Move the selection to the end of the previous text.
   *
   * @return {State} state
   */

  collapseToEndOfPreviousText() {
    let state = this
    let { document, selection } = state
    let texts = document.getTextsAtRange(selection)
    let text = texts.first()
    if (!text) return state

    let previous = document.getPreviousText(text)
    if (!previous) return state

    selection = selection.collapseToEndOf(previous)
    selection = selection.normalize(document)
    state = state.merge({ selection })
    return state
  }

  /**
   * Move the selection to the start of the next text.
   *
   * @return {State} state
   */

  collapseToStartOfNextText() {
    let state = this
    let { document, selection } = state
    let texts = document.getTextsAtRange(selection)
    let text = texts.last()
    if (!text) return state

    let next = document.getNextText(text)
    if (!next) return state

    selection = selection.collapseToStartOf(next)
    selection = selection.normalize(document)
    state = state.merge({ selection })
    return state
  }

  /**
   * Move the selection to the end of the next text.
   *
   * @return {State} state
   */

  collapseToEndOfNextText() {
    let state = this
    let { document, selection } = state
    let texts = document.getTextsAtRange(selection)
    let text = texts.last()
    if (!text) return state

    let next = document.getNextText(text)
    if (!next) return state

    selection = selection.collapseToEndOf(next)
    selection = selection.normalize(document)
    state = state.merge({ selection })
    return state
  }

  /**
   * Delete at the current selection.
   *
   * @return {State} state
   */

  delete() {
    let state = this
    let { document, selection } = state
    let after

    // When collapsed, there's nothing to do.
    if (selection.isCollapsed) return state

    // Determine what the selection will be after deleting.
    const { startText } = this
    const { startKey, startOffset, endKey, endOffset } = selection
    const block = document.getClosestBlock(startText)
    const highest = block.getHighestChild(startText)
    const previous = block.getPreviousSibling(highest)
    const next = block.getNextSibling(highest)

    if (
      previous &&
      startOffset == 0 &&
      (endKey != startKey || endOffset == startText.length)
    ) {
      if (previous.kind == 'text') {
        if (next && next.kind == 'text') {
          after = selection.merge({
            anchorKey: previous.key,
            anchorOffset: previous.length,
            focusKey: previous.key,
            focusOffset: previous.length
          })
        } else {
          after = selection.collapseToEndOf(previous)
        }
      } else {
        const last = previous.getTexts().last()
        after = selection.collapseToEndOf(last)
      }
    }

    else {
      after = selection.collapseToStart()
    }

    // Delete and update the selection.
    document = document.deleteAtRange(selection)
    selection = after
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
      after = selection.collapseToStart()
    }

    else if (selection.isAtStartOf(document)) {
      after = selection
    }

    else if (selection.isAtStartOf(startNode)) {
      const previous = document.getPreviousText(startNode)
      const prevBlock = document.getClosestBlock(previous)
      const prevInline = document.getClosestInline(previous)

      if (prevBlock && prevBlock.isVoid) {
        after = selection
      } else if (prevInline && prevInline.isVoid) {
        after = selection
      } else {
        after = selection.collapseToEndOf(previous)
      }
    }

    else if (selection.isAtEndOf(startNode) && startNode.length == 1) {
      const block = document.getClosestBlock(startKey)
      const highest = block.getHighestChild(startKey)
      const previous = block.getPreviousSibling(highest)
      const next = block.getNextSibling(highest)

      if (previous) {
        if (previous.kind == 'text') {
          if (next && next.kind == 'text') {
            after = selection.merge({
              anchorKey: previous.key,
              anchorOffset: previous.length,
              focusKey: previous.key,
              focusOffset: previous.length
            })
          } else {
            after = selection.collapseToEndOf(previous)
          }
        } else {
          const last = previous.getTexts().last()
          after = selection.collapseToEndOf(last)
        }
      } else {
        after = selection.moveBackward(n)
      }
    }

    else {
      after = selection.moveBackward(n)
    }

    // Delete backward and then update the selection.
    document = document.deleteBackwardAtRange(selection, n)
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
    let { document, selection, startText } = state
    let { startKey, startOffset } = selection
    let after = selection

    // Determine what the selection should be after deleting.
    const block = document.getClosestBlock(startKey)
    const inline = document.getClosestInline(startKey)
    const highest = block.getHighestChild(startKey)
    const previous = block.getPreviousSibling(highest)
    const next = block.getNextSibling(highest)

    if (selection.isExpanded) {
      after = selection.collapseToStart()
    }

    else if ((block && block.isVoid) || (inline && inline.isVoid)) {
      const nextText = document.getNextText(startKey)
      const prevText = document.getPreviousText(startKey)
      after = next
        ? selection.collapseToStartOf(nextText)
        : selection.collapseToEndOf(prevText)
    }

    else if (previous && startOffset == 0 && startText.length == 1) {
      if (previous.kind == 'text') {
        if (next && next.kind == 'text') {
          after = selection.merge({
            anchorKey: previous.key,
            anchorOffset: previous.length,
            focusKey: previous.key,
            focusOffset: previous.length
          })
        } else {
          after = selection.collapseToEndOf(previous)
        }
      } else {
        const last = previous.getTexts().last()
        after = selection.collapseToEndOf(last)
      }
    }

    // Delete forward and then update the selection.
    document = document.deleteForwardAtRange(selection, n)
    selection = after
    state = state.merge({ document, selection })
    return state
  }

  /**
   * Insert a `block` at the current selection.
   *
   * @param {String || Object || Block} block
   * @return {State} state
   */

  insertBlock(block) {
    let state = this
    let { document, selection } = state
    let after = selection

    // Insert the block
    document = document.insertBlockAtRange(selection, block)

    // Determine what the selection should be after inserting.
    const keys = state.document.getTexts().map(text => text.key)
    const text = document.getTexts().find(n => !keys.includes(n.key))
    selection = selection.collapseToEndOf(text)

    // Update the document and selection.
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
    let after = selection

    // If there's nothing in the fragment, do nothing.
    if (!fragment.length) return state

    // Lookup some nodes for determining the selection next.
    const texts = fragment.getTexts()
    const lastText = texts.last()
    const lastInline = fragment.getClosestInline(lastText)
    const startText = document.getDescendant(selection.startKey)
    const startBlock = document.getClosestBlock(startText)
    const startInline = document.getClosestInline(startText)
    const nextText = document.getNextText(startText)
    const nextBlock = nextText ? document.getClosestBlock(nextText) : null
    const nextNextText = nextText ? document.getNextText(nextText) : null

    const docTexts = document.getTexts()

    // Insert the fragment.
    document = document.insertFragmentAtRange(selection, fragment)

    // Determine what the selection should be after inserting.
    const keys = docTexts.map(text => text.key)
    const text = document.getTexts().findLast(n => !keys.includes(n.key))

    after = text
      ? selection.collapseToStartOf(text).moveForward(lastText.length)
      : selection.collapseToStart().moveForward(lastText.length)

    // Update the document and selection.
    selection = after
    state = state.merge({ document, selection })
    return state
  }

  /**
   * Insert a `inline` at the current selection.
   *
   * @param {String || Object || Block} inline
   * @return {State} state
   */

  insertInline(inline) {
    let state = this
    let { document, selection, startText } = state
    let after = selection
    const hasVoid = document.hasVoidParent(startText)

    // Insert the inline
    document = document.insertInlineAtRange(selection, inline)

    // Determine what the selection should be after inserting.
    if (hasVoid) {
      selection = selection
    }

    else {
      const keys = state.document.getTexts().map(text => text.key)
      const text = document.getTexts().find(n => !keys.includes(n.key))
      selection = selection.collapseToEndOf(text)
    }

    // Update the document and selection.
    state = state.merge({ document, selection })
    return state
  }

  /**
   * Insert a `text` string at the current selection.
   *
   * @param {String} text
   * @param {Set} marks (optional)
   * @return {State} state
   */

  insertText(text, marks) {
    let state = this
    let { cursorMarks, document, selection } = state
    let after = selection

    // Determine what the selection should be after inserting.
    if (selection.isExpanded) {
      after = selection.collapseToStart().moveForward(text.length)
    }

    else {
      after = selection.moveForward(text.length)
    }

    // Insert the text and update the selection.
    document = document.insertTextAtRange(selection, text, marks || cursorMarks)
    selection = after
    state = state.merge({ document, selection })
    return state
  }

  /**
   * Move the selection to a specific anchor and focus point.
   *
   * @param {Object} properties
   * @return {State} state
   */

  moveTo(properties) {
    let state = this
    let { document, selection } = state

    // Allow for passing a `Selection` object.
    if (properties instanceof Selection) {
      properties = {
        anchorKey: properties.anchorKey,
        anchorOffset: properties.anchorOffset,
        focusKey: properties.focusKey,
        focusOffset: properties.focusOffset,
        isFocused: properties.isFocused
      }
    }

    // Pass in properties, and force `isBackward` to be re-resolved.
    selection = selection.merge({
      ...properties,
      isBackward: null
    })

    selection = selection.normalize(document)
    state = state.merge({ selection })
    return state
  }

  /**
   * Set `properties` of the block nodes in the current selection.
   *
   * @param {Object} properties
   * @return {State} state
   */

  setBlock(properties) {
    let state = this
    let { document, selection } = state
    document = document.setBlockAtRange(selection, properties)
    state = state.merge({ document })
    return state
  }

  /**
   * Set `properties` of the inline nodes in the current selection.
   *
   * @param {Object} properties
   * @return {State} state
   */

  setInline(properties) {
    let state = this
    let { document, selection } = state
    document = document.setInlineAtRange(selection, properties)
    state = state.merge({ document })
    return state
  }

  /**
   * Split the block node at the current selection, to optional `depth`.
   *
   * @param {Number} depth (optional)
   * @return {State} state
   */

  splitBlock(depth = 1) {
    let state = this
    let { document, selection } = state

    // Split the document.
    document = document.splitBlockAtRange(selection, depth)

    // Determine what the selection should be after splitting.
    const { startKey } = selection
    const startNode = document.getDescendant(startKey)
    const nextNode = document.getNextText(startNode)
    selection = selection.collapseToStartOf(nextNode)

    state = state.merge({ document, selection })
    return state
  }

  /**
   * Split the inline nodes at the current selection, to optional `depth`.
   *
   * @param {Number} depth (optional)
   * @return {State} state
   */

  splitInline(depth = Infinity) {
    let state = this
    let { document, selection } = state

    // Split the document.
    document = document.splitInlineAtRange(selection, depth)

    // Determine what the selection should be after splitting.
    const { startKey } = selection
    const inlineParent = document.getClosestInline(startKey)

    if (inlineParent) {
      const startNode = document.getDescendant(startKey)
      const nextNode = document.getNextText(startNode)
      selection = selection.collapseToStartOf(nextNode)
    }

    state = state.merge({ document, selection })
    return state
  }

  /**
   * Remove a `mark` from the characters in the current selection.
   *
   * @param {Mark} mark
   * @return {State} state
   */

  removeMark(mark) {
    mark = normalizeMark(mark)
    let state = this
    let { cursorMarks, document, selection } = state

    // If the selection is collapsed, remove the mark from the cursor instead.
    if (selection.isCollapsed) {
      const marks = document.getMarksAtRange(selection)
      state = state.merge({ cursorMarks: marks.remove(mark) })
      return state
    }

    document = document.removeMarkAtRange(selection, mark)
    state = state.merge({ document })
    return state
  }

  /**
   * Add or remove a `mark` from the characters in the current selection,
   * depending on whether it's already there.
   *
   * @param {Mark} mark
   * @return {State} state
   */

  toggleMark(mark) {
    mark = normalizeMark(mark)
    let state = this
    let { marks, document, selection } = state
    const exists = marks.some(m => m.equals(mark))
    return exists
      ? state.removeMark(mark)
      : state.addMark(mark)
  }

  /**
   * Wrap the block nodes in the current selection with a new block node with
   * `properties`.
   *
   * @param {Object or String} properties
   * @return {State} state
   */

  wrapBlock(properties) {
    let state = this
    let { document, selection } = state
    document = document.wrapBlockAtRange(selection, properties)
    state = state.merge({ document })
    return state
  }

  /**
   * Unwrap the current selection from a block parent with `properties`.
   *
   * @param {Object or String} properties
   * @return {State} state
   */

  unwrapBlock(properties) {
    let state = this
    let { document, selection } = state
    document = document.unwrapBlockAtRange(selection, properties)
    state = state.merge({ document, selection })
    return state
  }

  /**
   * Wrap the current selection in new inline nodes with `properties`.
   *
   * @param {Object or String} properties
   * @return {State} state
   */

  wrapInline(properties) {
    let state = this
    let { document, selection } = state
    const { startKey } = selection
    const previous = document.getPreviousText(startKey)

    document = document.wrapInlineAtRange(selection, properties)

    // Determine what the selection should be after wrapping.
    if (selection.isCollapsed) {
      selection = selection
    }

    else if (selection.startOffset == 0) {
      const text = previous
        ? document.getNextText(previous)
        : document.getTexts().first()
      selection = selection.moveToRangeOf(text)
    }

    else {
      const text = document.getNextText(selection.startKey)
      selection = selection.moveToRangeOf(text)
    }

    state = state.merge({ document, selection })
    return state
  }

  /**
   * Unwrap the current selection from an inline parent with `properties`.
   *
   * @param {Object or String} properties
   * @return {State} state
   */

  unwrapInline(properties) {
    let state = this
    let { document, selection } = state
    document = document.unwrapInlineAtRange(selection, properties)
    state = state.merge({ document, selection })
    return state
  }

}

/**
 * Normalize a `mark` argument, which can be a string or plain object too.
 *
 * @param {Mark or String or Object} mark
 * @return {Mark}
 */

function normalizeMark(mark) {
  if (typeof mark == 'string') {
    return Mark.create({ type: mark })
  } else {
    return Mark.create(mark)
  }
}

/**
 * Export.
 */

export default State
