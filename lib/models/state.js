
import Selection from './selection'
import Node from './node'
import Text from './text'
import toCamel from 'to-camel-case'
import { OrderedMap, Record, Stack } from 'immutable'

/**
 * Record.
 */

const StateRecord = new Record({
  nodes: new OrderedMap(),
  selection: new Selection(),
  undoStack: new Stack(),
  redoStack: new Stack()
})

/**
 * Node-like methods, that should be mixed into the `State` prototype.
 */

const NODE_LIKE_METHODS = [
  'filterNodes',
  'findNode',
  'getNextNode',
  'getNode',
  'getParentNode',
  'getPreviousNode',
  'hasNode',
  'pushNode',
  'removeNode',
  'updateNode'
]

/**
 * Selection-like methods, that should be mixed into the `State` prototype.
 */

const SELECTION_LIKE_METHODS = [
  'moveTo',
  'moveToAnchor',
  'moveToEnd',
  'moveToFocus',
  'moveToStart',
  'moveToStartOf',
  'moveToEndOf',
  'moveToRangeOf',
  'moveForward',
  'moveBackward',
  'extendForward',
  'extendBackward'
]

/**
 * State.
 */

class State extends StateRecord {

  /**
   * Create a new `State` with `properties`.
   *
   * @param {Objetc} properties
   * @return {State} state
   */

  static create(properties = {}) {
    return new State(properties)
  }

  /**
   * Node-like getters.
   */

  get length() {
    return this.text.length
  }

  get text() {
    return this.nodes
      .map(node => node.text)
      .join('')
  }

  get type() {
    return 'state'
  }

  /**
   * Selection-like getters.
   */

  get isCollapsed() {
    return this.selection.isCollapsed
  }

  get isExpanded() {
    return this.selection.isExpanded
  }

  get isExtended() {
    return this.selection.isExtended
  }

  get anchorKey() {
    return this.selection.anchorKey
  }

  get anchorOffset() {
    return this.selection.anchorOffset
  }

  get focusKey() {
    return this.selection.focusKey
  }

  get focusOffset() {
    return this.selection.focusOffset
  }

  get startKey() {
    return this.selection.startKey
  }

  get startOffset() {
    return this.selection.startOffset
  }

  get endKey() {
    return this.selection.endKey
  }

  get endOffset() {
    return this.selection.endOffset
  }

  /**
   * Get the current anchor node.
   *
   * @return {Node} node
   */

  get anchorNode() {
    return this.getNode(this.anchorKey)
  }

  /**
   * Get the current focus node.
   *
   * @return {Node} node
   */

  get focusNode() {
    return this.getNode(this.focusKey)
  }

  /**
   * Get the current start node.
   *
   * @return {Node} node
   */

  get startNode() {
    return this.getNode(this.startKey)
  }

  /**
   * Get the current end node.
   *
   * @return {Node} node
   */

  get endNode() {
    return this.getNode(this.endKey)
  }

  /**
   * Is the selection at the start of `node`?
   *
   * @param {Node} node
   * @return {Boolean} isAtStart
   */

  isAtStartOf(node) {
    return this.selection.isAtStartOf(node)
  }

  /**
   * Is the selection at the end of `node`?
   *
   * @param {Node} node
   * @return {Boolean} isAtEnd
   */

  isAtEndOf(node) {
    return this.selection.isAtEndOf(node)
  }

  /**
   * Delete a single character.
   *
   * @return {State} state
   */

  delete() {
    let state = this

    // When collapsed, there's nothing to do.
    if (state.isCollapsed) return state

    // Otherwise, delete and update the selection.
    state = state.deleteAtRange(state.selection)
    state = state.moveToStart()
    return state
  }

  /**
   * Delete everything in a `range`.
   *
   * @param {Selection} range
   * @return {State} state
   */

  deleteAtRange(range) {
    let state = this

    // If the range is collapsed, there's nothing to do.
    if (range.isCollapsed) return state

    const { startKey, startOffset, endKey, endOffset } = range
    let startNode = state.getNode(startKey)

    // If the start and end nodes are the same, remove the matching characters.
    if (startKey == endKey) {
      let { characters } = startNode

      characters = characters.filterNot((char, i) => {
        return startOffset <= i && i < endOffset
      })

      startNode = startNode.merge({ characters })
      state = state.updateNode(startNode)
      return state
    }

    // Otherwise, remove the text from the first and last nodes...
    const startRange = Selection.create({
      anchorKey: startKey,
      anchorOffset: startOffset,
      focusKey: startKey,
      focusOffset: startNode.length
    })

    const endRange = Selection.create({
      anchorKey: endKey,
      anchorOffset: 0,
      focusKey: endKey,
      focusOffset: endOffset
    })

    state = state.deleteAtRange(startRange)
    state = state.deleteAtRange(endRange)

    // Then remove any nodes in between the top-most start and end nodes...
    let startParent = state.getParentNode(startKey)
    let endParent = state.getParentNode(endKey)

    const startGrandestParent = state.nodes.find((node) => {
      return node == startParent || node.hasNode(startParent)
    })

    const endGrandestParent = state.nodes.find((node) => {
      return node == endParent || node.hasNode(endParent)
    })

    const nodes = state.nodes
      .takeUntil(node => node == startGrandestParent)
      .set(startGrandestParent.key, startGrandestParent)
      .concat(state.nodes.skipUntil(node => node == endGrandestParent))

    state = state.merge({ nodes })

    // Then bring the end text node into the start node.
    let endText = state.getNode(endKey)
    startParent = startParent.pushNode(endText)
    endParent = endParent.removeNode(endText)
    state = state.updateNode(startParent)
    state = state.updateNode(endParent)
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
    let selection = state.selection

    // Determine what the selection should be after deleting.
    const startNode = state.startNode

    if (state.isCollapsed && state.isAtStartOf(startNode)) {
      const parent = state.getParentNode(startNode)
      const previous = state.getPreviousNode(parent).nodes.first()
      selection = selection.moveToEndOf(previous)
    }

    else if (state.isCollapsed && !state.isAtEndOf(state)) {
      selection = selection.moveBackward(n)
    }

    // Delete backward and then update the selection.
    state = state.deleteBackwardAtRange(state.selection)
    state = state.merge({ selection })
    return state
  }

  /**
   * Delete backward `n` characters at a `range`.
   *
   * @param {Selection} range
   * @param {Number} n (optional)
   * @return {State} state
   */

  deleteBackwardAtRange(range, n = 1) {
    let state = this

    // When collapsed at the end of the document, there's nothing to do.
    if (range.isCollapsed && range.isAtEndOf(state)) return state

    // When the range is still expanded, just do a regular delete.
    if (range.isExpanded) return state.deleteAtRange(range)

    // When at start of a text node, merge forwards into the next text node.
    const { startKey } = range
    const startNode = state.getNode(startKey)

    if (range.isAtStartOf(startNode)) {
      const parent = state.getParentNode(startNode)
      const previous = state.getPreviousNode(parent).nodes.first()
      range = range.extendBackwardToEndOf(previous)
      state = state.deleteAtRange(range)
      return state
    }

    // Otherwise, remove `n` characters behind of the cursor.
    range = range.extendBackward(n)
    state = state.deleteAtRange(range)
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
    state = state.deleteForwardAtRange(state.selection)
    return state
  }

  /**
   * Delete forward `n` characters at a `range`.
   *
   * @param {Selection} range
   * @param {Number} n (optional)
   * @return {State} state
   */

  deleteForwardAtRange(range, n = 1) {
    let state = this

    // When collapsed at the end of the document, there's nothing to do.
    if (range.isCollapsed && range.isAtEndOf(state)) return state

    // When the range is still expanded, just do a regular delete.
    if (range.isExpanded) return state.deleteAtRange(range)

    // When at end of a text node, merge forwards into the next text node.
    const { startKey } = range
    const startNode = state.getNode(startKey)

    if (range.isAtEndOf(startNode)) {
      const parent = state.getParentNode(startNode)
      const next = state.getNextNode(parent).nodes.first()
      range = range.extendForwardToStartOf(next)
      state = state.deleteAtRange(range)
      return state
    }

    // Otherwise, remove `n` characters ahead of the cursor.
    range = range.extendForward(n)
    state = state.deleteAtRange(range)
    return state
  }

  /**
   * Insert a `text` string at the current cursor position.
   *
   * @param {String or Node or OrderedMap} data
   * @return {State} state
   */

  insert(data) {
    let state = this
    state = state.insertAtRange(state.selection, data)

    // When the data is a string of characters...
    if (typeof data == 'string') {
      state = state.moveForward(data.length)
    }

    return state
  }

  /**
   * Insert `data` at a `range`.
   *
   * @param {Selection} range
   * @param {String or Node or OrderedMap} data
   * @return {State} state
   */

  insertAtRange(range, data) {
    let state = this

    // When still expanded, remove the current range first.
    if (range.isExpanded) {
      state = state.deleteAtRange(range)
      range = range.moveToStart()
    }

    // When the data is a string of characters...
    if (typeof data == 'string') {

      // Insert text at the current cursor.
      const ranges = [{ text: data }]
      let { startNode, startOffset } = state
      let { characters } = startNode
      let newCharacters = convertRangesToCharacters(ranges)
      const { size } = newCharacters

      // Splice in the new characters.
      characters = characters.slice(0, startOffset)
        .concat(newCharacters)
        .concat(characters.slice(startOffset + size - 1, Infinity))

      // Update the existing text node.
      startNode = startNode.merge({ characters })
      state = state.updateNode(startNode)
      return state
    }

    return state
  }

  /**
   * Normalize all nodes, ensuring that no two text nodes are adjacent.
   *
   * @return {State} state
   */

  normalize() {
    // TODO
  }

  /**
   * Split at a `selection`.
   *
   * @return {State} state
   */

  split() {
    let state = this
    state = state.splitAtRange(state.selection)

    const parent = state.getParentNode(state.startNode)
    const next = state.getNextNode(parent)
    const text = next.nodes.first()
    state = state.moveToStartOf(text)

    // const next = state.getNextTextNode(state.startNode)
    // state = state.moveToStartOf(next)

    return state
  }

  /**
   * Split the nodes at a `range`.
   *
   * @param {Selection} range
   * @return {State} state
   */

  splitAtRange(range) {
    let state = this

    // If the range is expanded, remove it first.
    if (range.isExpanded) {
      state = state.deleteAtRange(range)
      range = range.moveToStart()
    }

    const { startKey, startOffset } = range
    const startNode = state.getNode(startKey)

    // Split the text node's characters.
    const { characters, length } = startNode
    const firstCharacters = characters.take(startOffset)
    const secondCharacters = characters.takeLast(length - startOffset)

    // Create a new first node with only the first set of characters.
    const parent = state.getParentNode(startNode)
    const firstText = startNode.set('characters', firstCharacters)
    const firstNode = parent.updateNode(firstText)

    // Create a brand new second node with the second set of characters.
    let secondText = Text.create({})
    let secondNode = Node.create({
      type: firstNode.type,
      data: firstNode.data
    })

    secondText = secondText.set('characters', secondCharacters)
    secondNode = secondNode.pushNode(secondText)

    // Replace the old parent node in the grandparent with the two new ones.
    let grandparent = state.getParentNode(parent)
    const befores = grandparent.nodes.takeUntil(node => node.key == parent.key)
    const afters = grandparent.nodes.skipUntil(node => node.key == parent.key).rest()
    const nodes = befores
      .set(firstNode.key, firstNode)
      .set(secondNode.key, secondNode)
      .concat(afters)

    // If the state is the grandparent, just merge, otherwise deep merge.
    if (grandparent == state) {
      state = state.merge({ nodes })
    } else {
      grandparent = grandparent.merge({ nodes })
      state = state.updateNode(grandparent)
    }

    return state
  }

  /**
   * Save the current state into the history.
   *
   * @return {State} state
   */

  save() {
    let state = this
    let { undoStack, redoStack } = state

    undoStack = undoStack.unshift(state)
    redoStack = redoStack.clear()
    state = state.merge({
      undoStack,
      redoStack
    })

    return state
  }

  /**
   * Undo.
   *
   * @return {State} state
   */

  undo() {
    let state = this
    let { undoStack, redoStack } = state

    // If there's no previous state, do nothing.
    let previous = undoStack.peek()
    if (!previous) return state

    // Remove the previous state from the undo stack.
    undoStack = undoStack.shift()

    // Move the current state into the redo stack.
    redoStack = redoStack.unshift(state)

    // Return the previous state, with the new history.
    return previous.merge({
      undoStack,
      redoStack
    })
  }

  /**
   * Redo.
   *
   * @return {State} state
   */

  redo() {
    let state = this
    let { undoStack, redoStack } = state

    // If there's no next state, do nothing.
    let next = redoStack.peek()
    if (!next) return state

    // Remove the next state from the redo stack.
    redoStack = redoStack.shift()

    // Move the current state into the undo stack.
    undoStack = undoStack.unshift(state)

    // Return the next state, with the new history.
    return next.merge({
      undoStack,
      redoStack
    })
  }

}

/**
 * Mix in node-like methods.
 */

NODE_LIKE_METHODS.forEach((method) => {
  State.prototype[method] = Node.prototype[method]
})

/**
 * Mix in selection-like methods.
 */

SELECTION_LIKE_METHODS.forEach((method) => {
  State.prototype[method] = function (...args) {
    let selection = this.selection[method](...args)
    return this.merge({ selection })
  }
})

/**
 * Export.
 */

export default State
