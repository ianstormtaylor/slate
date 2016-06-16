
import NodeMap from './node-map'
import TextNode from './text-node'
import { Map, OrderedMap, Record } from 'immutable'

/**
 * Record.
 */

const NodeRecord = new Record({
  key: null,
  type: null,
  data: new Map(),
  children: new NodeMap(),
})

/**
 * Node.
 */

class Node extends NodeRecord {

  static create(attrs) {
    return new Node({
      key: attrs.key,
      type: attrs.type,
      data: new Map(attrs.data),
      children: Node.createMap(attrs.children)
    })
  }

  static createMap(array) {
    return new OrderedMap(array.reduce((map, node) => {
      map[node.key] = node.type == 'text'
        ? TextNode.create(node)
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
