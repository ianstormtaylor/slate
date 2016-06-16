
import Text from './text'
import { Map, OrderedMap, Record } from 'immutable'

/**
 * Record.
 */

const NodeRecord = new Record({
  children: new OrderedMap(),
  data: new Map(),
  key: null,
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
      key: object.key,
      type: object.type,
      data: new Map(object.data),
      children: Node.createMap(object.children)
    })
  }

  /**
   * Create an ordered map of nodes from a Javascript `array` of nodes.
   *
   * @param {Array} array
   * @return {OrderedMap} nodes
   */

  static createMap(array) {
    return new OrderedMap(array.reduce((map, node) => {
      map[node.key] = node.type == 'text'
        ? Text.create(node)
        : Node.create(node)
      return map
    }, {}))
  }

  /**
   * Recursively filter children nodes with `iterator`.
   *
   * @param {Function} iterator
   * @return {OrderedMap} matches
   */

  filterNodes(iterator) {
    const shallow = this.children.filter(iterator)
    const deep = this.children
      .map(node => node instanceof Node ? node.filterNodes(iterator) : null)
      .filter(node => node)
      .reduce((all, map) => {
        return all.concat(map)
      }, shallow)

    return deep
  }

}

/**
 * Export.
 */

export default Node
