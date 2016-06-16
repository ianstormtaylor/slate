
import Node from './node'
import TextNode from './text-node'
import { OrderedMap } from 'immutable'

/**
 * Node map.
 */

class NodeMap extends OrderedMap {

  static create(attrs) {
    if (attrs instanceof Array) {
      attrs = attrs.reduce((map, node) => {
        map[node.key] = node.type == 'text'
          ? TextNode.create(node)
          : Node.create(node)
        return map
      }, {})
    }

    return new NodeMap(attrs)
  }

  filterDeep(...args) {
    const shallow = this.filter(...args)
    const deep = shallow.map(node => node.children.filter(...args))
    const all = shallow.reduce((map, node, key) => {
      map = map.concat(node)
      map = map.concat(deep.get(key))
      return map
    }, new NodeMap())

    debugger

    return all
  }

}

/**
 * Export.
 */

export default NodeMap
