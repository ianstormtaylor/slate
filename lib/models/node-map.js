
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

}

/**
 * Export.
 */

export default NodeMap
