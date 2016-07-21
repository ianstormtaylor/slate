
// @flow

import Document from './document'
import Mark from './mark'
import Selection from './selection'
import Transform from './transform'
import uid from '../utils/uid'
import { Record, Set, Stack } from 'immutable'

// FIXME Import here just for flow
import Block from './block'
import Character from './character'
import Data from './data'
import Text from './text'

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

  get kind():string {
    return 'state'
  }

  /**
   * Is the current selection blurred?
   *
   * @return {Boolean} isBlurred
   */

  get isBlurred():boolean {
    return this.selection.isBlurred
  }

  /**
   * Is the current selection focused?
   *
   * @return {Boolean} isFocused
   */

  get isFocused():boolean {
    return this.selection.isFocused
  }

  /**
   * Is the current selection collapsed?
   *
   * @return {Boolean} isCollapsed
   */

  get isCollapsed():boolean {
    return this.selection.isCollapsed
  }

  /**
   * Is the current selection expanded?
   *
   * @return {Boolean} isExpanded
   */

  get isExpanded():boolean {
    return this.selection.isExpanded
  }

  /**
   * Is the current selection backward?
   *
   * @return {Boolean} isBackward
   */

  get isBackward():boolean {
    return this.selection.isBackward
  }

  /**
   * Is the current selection forward?
   *
   * @return {Boolean} isForward
   */

  get isForward():boolean {
    return this.selection.isForward
  }

  /**
   * Get the current start key.
   *
   * @return {String} startKey
   */

  get startKey():string {
    return this.selection.startKey
  }

  /**
   * Get the current end key.
   *
   * @return {String} endKey
   */

  get endKey():string {
    return this.selection.endKey
  }

  /**
   * Get the current start offset.
   *
   * @return {String} startOffset
   */

  get startOffset():string {
    return this.selection.startOffset
  }

  /**
   * Get the current end offset.
   *
   * @return {String} endOffset
   */

  get endOffset():string {
    return this.selection.endOffset
  }

  /**
   * Get the current anchor key.
   *
   * @return {String} anchorKey
   */

  get anchorKey():string {
    return this.selection.anchorKey
  }

  /**
   * Get the current focus key.
   *
   * @return {String} focusKey
   */

  get focusKey():string {
    return this.selection.focusKey
  }

  /**
   * Get the current anchor offset.
   *
   * @return {String} anchorOffset
   */

  get anchorOffset():string {
    return this.selection.anchorOffset
  }

  /**
   * Get the current focus offset.
   *
   * @return {String} focusOffset
   */

  get focusOffset():string {
    return this.selection.focusOffset
  }

  /**
   * Get the current start text node.
   *
   * @return {Text} text
   */

  get startText():Text {
    return this.document.getDescendant(this.selection.startKey)
  }

  /**
   * Get the current end node.
   *
   * @return {Text} text
   */

  get endText():Text {
    return this.document.getDescendant(this.selection.endKey)
  }

  /**
   * Get the current anchor node.
   *
   * @return {Text} text
   */

  get anchorText():Text {
    return this.document.getDescendant(this.selection.anchorKey)
  }

  /**
   * Get the current focus node.
   *
   * @return {Text} text
   */

  get focusText():Text {
    return this.document.getDescendant(this.selection.focusKey)
  }

  /**
   * Get the current start text node's closest block parent.
   *
   * @return {Block} block
   */

  get startBlock():Block {
    return this.document.getClosestBlock(this.selection.startKey)
  }

  /**
   * Get the current end text node's closest block parent.
   *
   * @return {Block} block
   */

  get endBlock():Block {
    return this.document.getClosestBlock(this.selection.endKey)
  }

  /**
   * Get the current anchor text node's closest block parent.
   *
   * @return {Block} block
   */

  get anchorBlock():Block {
    return this.document.getClosestBlock(this.selection.anchorKey)
  }

  /**
   * Get the current focus text node's closest block parent.
   *
   * @return {Block} block
   */

  get focusBlock():Block {
    return this.document.getClosestBlock(this.selection.focusKey)
  }

  /**
   * Get the characters in the current selection.
   *
   * @return {List} characters
   */

  get characters():List<Character> {
    return this.document.getCharactersAtRange(this.selection)
  }

  /**
   * Get the marks of the current selection.
   *
   * @return {Set} marks
   */

  get marks():Set<typeof Mark> {
    return this.cursorMarks || this.document.getMarksAtRange(this.selection)
  }

  /**
   * Get the block nodes in the current selection.
   *
   * @return {List} nodes
   */

  get blocks():List<NodeType> {
    return this.document.getBlocksAtRange(this.selection)
  }

  /**
   * Get the fragment of the current selection.
   *
   * @return {List} nodes
   */

  get fragment():List<NodeType> {
    return this.document.getFragmentAtRange(this.selection)
  }

  /**
   * Get the inline nodes in the current selection.
   *
   * @return {List} nodes
   */

  get inlines():List<NodeType> {
    return this.document.getInlinesAtRange(this.selection)
  }

  /**
   * Get the text nodes in the current selection.
   *
   * @return {List} nodes
   */

  get texts():List<NodeType> {
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

    // When collapsed, there's nothing to do.
    if (selection.isCollapsed) return state

    // Otherwise, delete and update the selection.
    document = document.deleteAtRange(selection)
    selection = selection.collapseToStart()
    state = state.merge({ document, selection })
    return state
  }

  /**
   * Delete backward `n` characters at the current selection.
   *
   * @param {Number} n (optional)
   * @return {State} state
   */

  deleteBackward(n:number = 1) {
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

  deleteForward(n:number = 1) {
    let state = this
    let { document, selection } = state
    let { startKey } = selection
    let after = selection

    // Determine what the selection should be after deleting.
    const block = document.getClosestBlock(startKey)
    const inline = document.getClosestInline(startKey)

    if (selection.isExpanded) {
      after = selection.collapseToStart()
    }

    else if ((block && block.isVoid) || (inline && inline.isVoid)) {
      const next = document.getNextText(startKey)
      const previous = document.getPreviousText(startKey)
      after = next
        ? selection.collapseToStartOf(next)
        : selection.collapseToEndOf(previous)
    }

    // Delete forward and then update the selection.
    document = document.deleteForwardAtRange(selection, n)
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

  insertFragment(fragment:any) {
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
   * Insert a `text` string at the current selection.
   *
   * @param {String} text
   * @return {State} state
   */

  insertText(text:string) {
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
    document = document.insertTextAtRange(selection, text, cursorMarks)
    selection = after
    state = state.merge({ document, selection })
    return state
  }

  /**
   * Add a `mark` to the characters in the current selection.
   *
   * @param {Mark} mark
   * @return {State} state
   */

  addMark(mark:typeof Mark) {
    let state = this
    let { cursorMarks, document, selection } = state

    // If the selection is collapsed, add the mark to the cursor instead.
    if (selection.isCollapsed) {
      if (typeof mark == 'string') mark = new Mark({ type: mark })
      const marks = document.getMarksAtRange(selection)
      state = state.merge({ cursorMarks: marks.add(mark) })
      return state
    }

    document = document.addMarkAtRange(selection, mark)
    state = state.merge({ document })
    return state
  }

  /**
   * Move the selection to a specific anchor and focus point.
   *
   * @param {Object} properties
   * @return {State} state
   */

  moveTo(properties:any) {
    let state = this
    let { document, selection } = state

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

  setBlock(properties:any) {
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

  setInline(properties:any) {
    let state = this
    let { document, selection } = state
    document = document.setInlineAtRange(selection, properties)
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
    selection = selection.collapseToStartOf(nextNode)

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

  removeMark(mark:typeof Mark) {
    let state = this
    let { cursorMarks, document, selection } = state

    // If the selection is collapsed, remove the mark from the cursor instead.
    if (selection.isCollapsed) {
      if (typeof mark == 'string') mark = new Mark({ type: mark })
      const marks = document.getMarksAtRange(selection)
      state = state.merge({ cursorMarks: marks.remove(mark) })
      return state
    }

    document = document.removeMarkAtRange(selection, mark)
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

  wrapBlock(type:string, data:typeof Data) {
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

  unwrapBlock(type:string, data:typeof Data) {
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

  wrapInline(type:string, data:typeof Data) {
    let state = this
    let { document, selection } = state
    document = document.wrapInlineAtRange(selection, type, data)

    // Determine what the selection should be after wrapping.
    if (selection.isCollapsed) {
      selection = selection
    }

    else if (selection.startOffset == 0) {
      const text = document.getDescendant(selection.startKey)
      selection = selection.moveToRangeOf(text)
      selection = selection.normalize(document)
    }

    else {
      const text = document.getNextText(selection.startKey)
      selection = selection.moveToRangeOf(text)
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

  unwrapInline(type:string, data:typeof Data) {
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
