
import Text from './text'
import uid from 'uid'
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
      children: Node.createMap(object.children),
      data: new Map(object.data),
      key: uid(4),
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
