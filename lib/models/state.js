
import Selection from './selection'
import Node from './node'
import Text from './text'
import toCamel from 'to-camel-case'
import { OrderedMap, Record } from 'immutable'

/**
 * Record.
 */

const StateRecord = new Record({
  nodes: new OrderedMap(),
  selection: new Selection()
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
  'moveBackward'
]

/**
 * State.
 */

class State extends StateRecord {

  /**
   * Create a new `State` from `attrs`.
   *
   * @return {State} state
   */

  static create(attrs) {
    return new State({
      nodes: Node.createMap(attrs.nodes),
      selection: Selection.create(attrs.selection)
    })
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
   * Backspace.
   *
   * @return {State} state
   */

  backspace() {
    let state = this

    // When not collapsed, remove the entire selection.
    if (!state.isCollapsed) {
      state = state.removeRange()
      state = state.moveToStart()
      return state
    }

    // When already at the start of the content, there's nothing to do.
    if (state.isAtStartOf(state)) return state

    // When at start of a node, merge backwards into the previous node.
    const { startNode } = state
    if (state.isAtStartOf(startNode)) {
      const { selection, startOffset } = state
      const parent = state.getParentNode(startNode)
      const previous = state.getPreviousNode(parent).nodes.first()
      const range = selection.merge({
        anchorKey: previous.key,
        anchorOffset: previous.length,
        focusKey: startNode.key,
        focusOffset: 0,
        isBackward: false
      })

      state = state.removeRange(range)
      return state
    }

    // Otherwise, remove one character behind of the cursor.
    const { endOffset } = state
    const startOffset = endOffset - 1
    state = state.removeCharacters(startNode.key, startOffset, endOffset)
    state = state.moveBackward()
    return state
  }

  /**
   * Delete a single character.
   *
   * @return {State} state
   */

  delete() {
    let state = this

    // When not collapsed, remove the entire selection range.
    if (!state.isCollapsed) {
      state = state.removeRange()
      state = state.moveToStart()
      return state
    }

    // When already at the end of the content, there's nothing to do.
    if (state.isAtEndOf(state)) return state

    // When at end of a node, merge forwards into the next node.
    const { startNode } = state
    if (state.isAtEndOf(startNode)) {
      const { selection, startOffset } = state
      const parent = state.getParentNode(startNode)
      const next = state.getNextNode(parent).nodes.first()
      const range = selection.merge({
        anchorKey: startNode.key,
        anchorOffset: startNode.length,
        focusKey: next.key,
        focusOffset: 0,
        isBackward: false
      })

      state = state.removeRange(range)
      return state
    }

    // Otherwise, remove one character ahead of the cursor.
    const { startOffset } = state
    const endOffset = startOffset + 1
    state = state.removeCharacters(startNode.key, startOffset, endOffset)
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
   * Remove characters from a node by `key` between offsets.
   *
   * @param {String} key
   * @param {Number} startOffset
   * @param {Number} endOffset
   * @return {State} state
   */

  removeCharacters(key, startOffset, endOffset) {
    let state = this
    let node = state.getNode(key)

    const characters = node.characters.filterNot((char, i) => {
      return startOffset <= i && i < endOffset
    })

    node = node.merge({ characters })
    state = state.updateNode(node)
    return state
  }

  /**
   * Split at a `selection`.
   *
   * @return {State} state
   */

  split() {
    let state = this
    state = state.splitRange()

    const parent = state.getParentNode(state.startKey)
    const next = state.getNextNode(parent)
    const text = next.nodes.first()
    state = state.moveToStartOf(text)

    return state
  }

  /**
   * Split the nodes at a `selection`.
   *
   * @param {Selection} selection (optional)
   * @return {State} state
   */

  splitRange(selection = this.selection) {
    let state = this

    // If there's an existing selection, remove it first.
    if (!selection.isCollapsed) {
      state = state.removeRange(selection)
      selection = selection.moveToStart()
    }

    // Split the text node's characters.
    const { startNode, startOffset } = state
    const parent = state.getParentNode(startNode)
    const { characters , length } = startNode
    const firstCharacters = characters.take(startOffset)
    const secondCharacters = characters.takeLast(length - startOffset)

    // Create a new first node with only the first set of characters.
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

    if (grandparent == state) {
      state = state.merge({ nodes })
    } else {
      grandparent = grandparent.merge({ nodes })
      state = state.updateNode(grandparent)
    }

    return state
  }

  /**
   * Merge the nodes between `selection`.
   *
   * @param {Selection} selection (optional)
   * @return {State} state
   */

  removeRange(selection = this.selection) {
    let state = this

    // If the selection is collapsed, there's nothing to do.
    if (selection.isCollapsed) return state

    // If the start and end nodes are the same, just remove the matching text.
    const { startKey, startOffset, endKey, endOffset } = selection
    if (startKey == endKey) {
      return state.removeCharacters(startKey, startOffset, endOffset)
    }

    // Otherwise, remove the text from the first and last nodes...
    let startText = state.getNode(startKey)
    state = state.removeCharacters(startKey, startOffset, startText.length)
    state = state.removeCharacters(endKey, 0, endOffset)

    // Then remove any nodes in between the top-most start and end nodes...
    let startNode = state.getParentNode(startKey)
    let endNode = state.getParentNode(endKey)
    const startParent = state.nodes.find(node => node == startNode || node.hasNode(startNode))
    const endParent = state.nodes.find(node => node == endNode || node.hasNode(endNode))

    const nodes = state.nodes
      .takeUntil(node => node == startParent)
      .set(startParent.key, startParent)
      .concat(state.nodes.skipUntil(node => node == endParent))

    state = state.merge({ nodes })

    // Then bring the end text node into the start node.
    let endText = state.getNode(endKey)
    startNode = startNode.pushNode(endText)
    endNode = endNode.removeNode(endText)
    state = state.updateNode(startNode)
    state = state.updateNode(endNode)
    return state
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
