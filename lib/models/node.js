
import NodeMap from './node-map'
import { Map, Record } from 'immutable'

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
      children: NodeMap.create(attrs.children)
    })
  }

}

/**
 * Export.
 */

export default Node
