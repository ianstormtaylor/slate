
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
 * State.
 */

class State extends StateRecord {

  /**
   * Create a new `state` from `attrs`.
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
   *
   * NODES HELPERS.
   * ==============
   *
   * These are all nodes-like helper functions that help with actions related to
   * the recursively-nested node tree.
   *
   */

  /**
   * Get the concatenated text of all nodes.
   *
   * @return {String} text
   */

  get text() {
    return this.nodes
      .map(node => node.text)
      .join('')
  }

  /**
   * Get a node by `key`.
   *
   * @param {String} key
   * @return {Node or Null}
   */

  getNode(key) {
    return this.findNode(node => node.key == key) || null
  }

  /**
   * Get the child node after the one by `key`.
   *
   * @param {String} key
   * @return {Node or Null}
   */

  getNodeAfter(key) {
    const shallow = this.nodes
      .skipUntil(node => node.key == key)
      .rest()
      .first()

    if (shallow != null) return shallow

    return this.nodes
      .map(node => node instanceof Node ? node.getNodeAfter(key) : null)
      .filter(node => node)
      .first()
  }

  /**
   * Get the child text node at `offset`.
   *
   * @param {String} offset
   * @return {Node or Null}
   */

  getNodeAtOffset(offset) {
    let node = null
    let i

    this.nodes.forEach((child) => {
      const match = child.text.length > offset + i
      if (!match) return
      node = match.type == 'text'
        ? match
        : match.getNodeAtOffset(offset - i)
    })

    return node
  }

  /**
   * Get the parent of a child node by `key`.
   *
   * @param {String} key
   * @return {Node or Null}
   */

  getParentOfNode(key) {
    if (this.nodes.get(key)) return this
    let node = null

    this.nodes.forEach((child) => {
      if (!(child instanceof Node)) return
      const match = child.getParentOfNode(key)
      if (match) node = match
    })

    return node
  }

  /**
   * Recursively find children nodes by `iterator`.
   *
   * @param {Function} iterator
   * @return {OrderedMap} matches
   */

  findNode(iterator) {
    const shallow = this.nodes.find(iterator)
    if (shallow != null) return shallow

    const deep = this.nodes
      .map(node => node instanceof Node ? node.findNode(iterator) : null)
      .filter(node => node)
      .first()
    return deep
  }

  /**
   * Recursively filter children nodes with `iterator`.
   *
   * @param {Function} iterator
   * @return {OrderedMap} matches
   */

  filterNodes(iterator) {
    const shallow = this.nodes.filter(iterator)
    const deep = this.nodes
      .map(node => node instanceof Node ? node.filterNodes(iterator) : null)
      .filter(node => node)
      .reduce((all, map) => {
        return all.concat(map)
      }, shallow)

    return deep
  }

  /**
   * Push a new `node` onto the map of nodes.
   *
   * @param {Node} node
   * @return {Node} node
   */

  pushNode(node) {
    let notes = this.notes.set(node.key, node)
    return this.merge({ notes })
  }

  /**
   * Set a new value for a child node by `key`.
   *
   * @param {String} key
   * @param {Node} node
   * @return {Node} node
   */

  setNode(key, node) {
    if (this.nodes.get(key)) {
      const nodes = this.nodes.set(key, node)
      return this.merge({ nodes })
    }

    const nodes = this.nodes.map((child) => {
      return child instanceof Node
        ? child.setNode(key, node)
        : child
    })

    return this.merge({ nodes })
  }

  /**
   *
   * TRANSFORMS.
   * -----------
   *
   * These are all transform helper functions that map to a specific transform
   * type that you can apply to a state.
   *
   */

  /**
   * Backspace a single character.
   *
   * @return {State} state
   */

  backspace() {
    const { selection } = this

    // when not collapsed, remove the entire selection
    if (!selection.isCollapsed) {
      return this
        .removeSelection(selection)
        .collapseBackward()
    }

    // when already at the start of the content, there's nothing to do
    if (selection.isAtStartOf(this)) return this

    // otherwise, remove one character behind of the cursor
    const { startKey, endOffset } = selection
    const node = this.getNode(startKey)
    const startOffset = endOffset - 1
    return this
      .removeCharacters(node, startOffset, endOffset)
      .moveTo({
        anchorOffset: startOffset,
        focusOffset: startOffset
      })
  }

  /**
   * Collapse the current selection backward, towards it's anchor point.
   *
   * @return {State} state
   */

  collapseBackward() {
    let { selection } = this
    let { anchorKey, anchorOffset } = selection

    selection = selection.merge({
      focusKey: anchorKey,
      focusOffset: anchorOffset
    })

    return this.merge({ selection })
  }

  /**
   * Collapse the current selection forward, towards it's focus point.
   *
   * @return {State} state
   */

  collapseForward() {
    let { selection } = this
    const { focusKey, focusOffset } = selection

    selection = selection.merge({
      anchorKey: focusKey,
      anchorOffset: focusOffset
    })

    return this.merge({ selection })
  }

  /**
   * Delete a single character.
   *
   * @return {State} state
   */

  delete() {
    const { selection } = this

    // when not collapsed, remove the entire selection
    if (!selection.isCollapsed) {
      return this
        .removeSelection(selection)
        .collapseBackward()
    }

    // when already at the end of the content, there's nothing to do
    if (selection.isAtEndOf(this)) return this

    // otherwise, remove one character ahead of the cursor
    const { startKey, startOffset } = selection
    const node = this.getNode(startKey)
    const endOffset = startOffset + 1
    return this.removeCharacters(node, startOffset, endOffset)
  }

  /**
   * Move the selection to a specific anchor and focus.
   *
   * @param {Object} properties
   *   @property {String} anchorKey (optional)
   *   @property {Number} anchorOffset (optional)
   *   @property {String} focusKey (optional)
   *   @property {String} focusOffset (optional)
   * @return {State} state
   */

  moveTo(properties) {
    const selection = this.selection.merge(properties)
    return this.merge({ selection })
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
   * Remove the existing selection's content.
   *
   * @param {Selection} selection
   * @return {State} state
   */

  removeSelection(selection) {
    // if already collapsed, there's nothing to remove
    if (selection.isCollapsed) return this

    // if the start and end nodes are the same, just remove the matching text
    const { startKey, startOffset, endKey, endOffset } = selection
    if (startKey == endKey) return this.removeCharacters(startKey, startOffset, endOffset)

    // otherwise, remove all of the other nodes between them...
    const nodes = this.nodes
      .takeUntil(node => node.key == startKey)
      .take(1)
      .skipUntil(node => node.key == endKey)
      .take(Infinity)

    // ...and remove the text from the first and last nodes
    const startNode = this.getNode(startKey)
    return this
      .merge({ nodes })
      .removeCharacters(startKey, startOffset, startNode.text.length)
      .removeCharacters(endKey, 0, endOffset)
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
    let node = this.getNode(key)
    let { characters } = node

    characters = node.characters.filterNot((char, i) => {
      return startOffset <= i && i < endOffset
    })

    node = node.merge({ characters })
    return this.setNode(key, node)
  }

  /**
   * Split at a `selection`.
   *
   * @return {State} state
   */

  split() {
    let { selection } = this
    let state = this.splitSelection(selection)
    let { anchorKey } = state.selection
    let parent = state.getParentOfNode(anchorKey)
    let node = state.getNodeAfter(parent.key)
    let text = node.nodes.first()
    return state.moveTo({
      anchorKey: text.key,
      anchorOffset: 0,
      focusKey: text.key,
      focusOffset: 0
    })
  }

  /**
   * Split the nodes at a `selection`.
   *
   * @param {Selection} selection
   * @return {State} state
   */

  splitSelection(selection) {
    let state = this

    // if there's an existing selection, remove it first
    if (!selection.isCollapsed) {
      state = state.removeSelection(selection)
      selection = selection.merge({
        focusKey: selection.anchorKey,
        focusOffset: selection.anchorOffset
      })
    }

    // then split the node at the selection
    const { startKey, startOffset } = selection
    const text = state.getNode(startKey)
    const parent = state.getParentOfNode(text.key)

    // split the characters
    const { characters , length } = text
    const firstCharacters = characters.take(startOffset)
    const secondCharacters = characters.takeLast(length - startOffset)

    // Create a new first node with only the first set of characters.
    const firstText = text.set('characters', firstCharacters)
    const firstNode = parent.setNode(firstText.key, firstText)

    // Create a brand new second node with the second set of characters.
    let secondText = Text.create({})
    secondText = secondText.set('characters', secondCharacters)

    let secondNode = Node.create({
      type: firstNode.type,
      data: firstNode.data
    })
    secondNode = secondNode.pushNode(secondText)

    // Replace the old parent node in the grandparent with the two new ones.
    let grandparent = state.getParentOfNode(parent.key)
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
      state = state.setNode(grandparent.key, grandparent)
    }

    return state
  }

}

/**
 * Export.
 */

export default State
