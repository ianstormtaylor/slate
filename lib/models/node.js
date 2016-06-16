
import Text from './text'
import uid from 'uid'
import { Map, OrderedMap, Record } from 'immutable'

/**
 * Record.
 */

const NodeRecord = new Record({
  data: new Map(),
  key: null,
  nodes: new OrderedMap(),
  type: null
})

/**
 * Node.
 */

class Node extends NodeRecord {

  /**
   * Create a node record from a Javascript `object`.
   *
   * @param {Object} object
   * @return {Node} node
   */

  static create(object) {
    return new Node({
      data: new Map(object.data || {}),
      key: uid(4),
      nodes: Node.createMap(object.nodes || []),
      type: object.type
    })
  }

  /**
   * Create an ordered map of nodes from a Javascript `array` of nodes.
   *
   * @param {Array} array
   * @return {OrderedMap} nodes
   */

  static createMap(array) {
    return new OrderedMap(array.reduce((map, object) => {
      const node = object.type == 'text'
        ? Text.create(object)
        : Node.create(object)
      map[node.key] = node
      return map
    }, {}))
  }

  /**
   * Get the length of the concatenated text of the node.
   *
   * @return {Number} length
   */

  get length() {
    return this.text.length
  }

  /**
   * Get the concatenated text `string` of all child nodes.
   *
   * @return {String} text
   */

  get text() {
    return this
      .filterNodes(node => node.type == 'text')
      .map(node => node.characters)
      .flatten()
      .map(character => character.text)
      .join('')
  }

  /**
   * Recursively find nodes nodes by `iterator`.
   *
   * @param {Function} iterator
   * @return {Node} node
   */

  findNode(iterator) {
    const shallow = this.nodes.find(iterator)
    if (shallow != null) return shallow

    return this.nodes
      .map(node => node instanceof Node ? node.findNode(iterator) : null)
      .filter(node => node)
      .first()
  }

  /**
   * Recursively filter nodes nodes with `iterator`.
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
   * Get a child node by `key`.
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
    let match = null
    let i

    this.nodes.forEach((node) => {
      if (!node.length > offset + i) return
      match = node.type == 'text'
        ? node
        : node.getNodeAtOffset(offset - i)
      i += node.length
    })

    return match
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
   * Push a new `node` onto the map of nodes.
   *
   * @param {Node} node
   * @return {Node} node
   */

  pushNode(node) {
    let nodes = this.nodes.set(node.key, node)
    return this.merge({ nodes })
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
      return this.set('nodes', nodes)
    }

    const nodes = this.nodes.map((child) => {
      return child instanceof Node
        ? child.setNode(key, node)
        : child
    })

    return this.merge({ nodes })
  }

}

/**
 * Export.
 */

export default Node
