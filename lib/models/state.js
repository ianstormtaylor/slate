
import Selection from './selection'
import NodeMap from './node-map'
import toCamel from 'to-camel-case'
import { Record } from 'immutable'

/**
 * Record.
 */

const StateRecord = new Record({
  nodes: new NodeMap(),
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
      nodes: NodeMap.create(attrs.nodes),
      selection: Selection.create(attrs.selection)
    })
  }

  /**
   * Delete a single character.
   *
   * @param {Selection} selection (optional)
   * @return {State} state
   */

  delete(selection = this.selection) {
    // when not collapsed, remove the entire selection
    if (!selection.isCollapsed) return this.removeSelection(selection)

    // when already at the end of the content, there's nothing to do
    if (selection.isAtEndOf(this)) return this

    // otherwise, remove one character ahead of the cursor
    let { startKey, startOffset } = selection
    let { nodes } = this
    let node = nodes.get(startKey)
    let endOffset = startOffset + 1
    return this.removeText(node, startOffset, endOffset)
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
    let { text } = node

    text = text.filter((char, i) => {
      return i > startOffset && i < endOffset
    })

    node = node.set('text', text)
    nodes = nodes.set(node.key, node)
    let state = this.set('nodes', nodes)
    return state
  }

}

/**
 * Export.
 */

export default State
