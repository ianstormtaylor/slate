
import Selection from './selection'
import Node from './node'
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
   * Set a new value for a child node by `key`.
   *
   * @param {String} key
   * @param {Node} node
   * @return {Node} node
   */

  setNode(key, node) {
    if (this.nodes.get(key)) {
      const nodes = this.nodes.set(key, node)
      return this.set('nodes', nodes)
    }

    const nodes = this.nodes.map((child) => {
      return child instanceof Node
        ? child.setNode(key, node)
        : child
    })

    return this.set('nodes', nodes)
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
   * @param {Selection} selection (optional)
   * @return {State} state
   */

  backspace(selection = this.selection) {
    // when not collapsed, remove the entire selection
    if (!selection.isCollapsed) {
      return this
        .removeSelection(selection)
        .collapseBackward()
    }

    // when already at the start of the content, there's nothing to do
    if (selection.isAtStartOf(this)) return this

    // otherwise, remove one character behind of the cursor
    let { startKey, endOffset } = selection
    let { nodes } = this
    let node = this.findNode(node => node.key == startKey)
    let startOffset = endOffset - 1
    return this
      .removeText(node, startOffset, endOffset)
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
    let state = this.set('selection', selection)
    return state
  }

  /**
   * Collapse the current selection forward, towards it's focus point.
   *
   * @return {State} state
   */

  collapseForward() {
    let { selection } = this
    let { focusKey, focusOffset } = selection
    selection = selection.merge({
      anchorKey: focusKey,
      anchorOffset: focusOffset
    })
    let state = this.set('selection', selection)
    return state
  }

  /**
   * Delete a single character.
   *
   * @param {Selection} selection (optional)
   * @return {State} state
   */

  delete(selection = this.selection) {
    // when not collapsed, remove the entire selection
    if (!selection.isCollapsed) {
      return this
        .removeSelection(selection)
        .collapseBackward()
    }

    // when already at the end of the content, there's nothing to do
    if (selection.isAtEndOf(this)) return this

    // otherwise, remove one character ahead of the cursor
    let { startKey, startOffset } = selection
    let { nodes } = this
    let node = this.findNode(node => node.key == startKey)
    let endOffset = startOffset + 1
    return this.removeText(node, startOffset, endOffset)
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
    let selection = this.selection.merge(properties)
    let state = this.merge({ selection })
    return state
  }

  /**
   * Remove the existing selection's content.
   *
   * @param {Selection} selection (optional)
   * @return {State} state
   */

  removeSelection(selection = this.selection) {
    // if already collapsed, there's nothing to remove
    if (selection.isCollapsed) return this

    // if the start and end nodes are the same, just remove the matching text
    let { nodes } = this
    let { startKey, startOffset, endKey, endOffset } = selection
    let startNode = nodes.get(startKey)
    let endNode = nodes.get(endKey)
    if (startNode == endNode) return this.removeText(startNode, startOffset, endOffset)

    // otherwise, remove all of the other nodes between them...
    nodes = nodes
      .takeUntil(node => node.key == startKey)
      .take(1)
      .skipUntil(node => node.key == endKey)
      .take(Infinity)

    // ...and remove the text from the first and last nodes
    let state = this.set('nodes', nodes)
    state = state.removeText(startNode, startOffset, startNode.text.length)
    state = state.removeText(endNode, 0, endOffset)
    return state
  }

  /**
   * Remove the text from a `node`.
   *
   * @param {Node} node
   * @param {Number} startOffset
   * @param {Number} endOffset
   * @return {State} state
   */

  removeText(node, startOffset, endOffset) {
    let { nodes } = this
    let { characters } = node

    characters = characters.filterNot((char, i) => {
      return startOffset <= i && i < endOffset
    })

    node = node.set('characters', characters)
    let state = this.setNode(node.key, node)
    return state
  }

}

/**
 * Export.
 */

export default State
