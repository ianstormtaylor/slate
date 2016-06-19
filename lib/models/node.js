
import { OrderedMap } from 'immutable'

/**
 * Node.
 *
 * And interface that `Document` and `Element` both implement, to make working
 * recursively easier with the tree easier.
 */

const Node = {

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
      .map(node => node.type == 'text' ? null : node.findNode(iterator))
      .filter(node => node)
      .first()
  },

  /**
   * Recursively filter nodes nodes with `iterator`.
   *
   * @param {Function} iterator
   * @return {OrderedMap} matches
   */

  filterNodes(iterator) {
    const shallow = this.nodes.filter(iterator)
    const deep = this.nodes
      .map(node => node.type == 'text' ? null : node.filterNodes(iterator))
      .filter(node => node)
      .reduce((all, map) => {
        return all.concat(map)
      }, shallow)

    return deep
  },

  /**
   * Get a child node by `key`.
   *
   * @param {String} key
   * @return {Node or Null}
   */

  getNode(key) {
    return this.findNode(node => node.key == key) || null
  },

  /**
   * Get the child node after the one by `key`.
   *
   * @param {String or Node} key
   * @return {Node or Null}
   */

  getNextNode(key) {
    if (typeof key != 'string') {
      key = key.key
    }

    const shallow = this.nodes
      .skipUntil(node => node.key == key)
      .rest()
      .first()

    if (shallow != null) return shallow

    return this.nodes
      .map(node => node.type == 'text' ? null : node.getNextNode(key))
      .filter(node => node)
      .first()
  },

  /**
   * Get the child node before the one by `key`.
   *
   * @param {String or Node} key
   * @return {Node or Null}
   */

  getPreviousNode(key) {
    if (typeof key != 'string') {
      key = key.key
    }

    const matches = this.nodes.get(key)

    if (matches) {
      return this.nodes
        .takeUntil(node => node.key == key)
        .last()
    }

    return this.nodes
      .map(node => node.type == 'text' ? null : node.getPreviousNode(key))
      .filter(node => node)
      .first()
  },

  /**
   * Get the parent of a child node by `key`.
   *
   * @param {String or Node} key
   * @return {Node or Null}
   */

  getParentNode(key) {
    if (typeof key != 'string') {
      key = key.key
    }

    if (this.nodes.get(key)) return this
    let node = null

    this.nodes.forEach((child) => {
      if (child.type == 'text') return
      const match = child.getParentNode(key)
      if (match) node = match
    })

    return node
  },

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
      match = node.type == 'text' ? node : node.getNodeAtOffset(offset - i)
      i += node.length
    })

    return match
  },

  /**
   * Recursively check if a child node exists by `key`.
   *
   * @param {String or Node} key
   * @return {Boolean} true
   */

  hasNode(key) {
    if (typeof key != 'string') {
      key = key.key
    }

    const shallow = this.nodes.has(key)
    if (shallow) return true

    const deep = this.nodes
      .map(node => node.type == 'text' ? false : node.hasNode(key))
      .some(has => has)
    if (deep) return true

    return false
  },

  /**
   * Push a new `node` onto the map of nodes.
   *
   * @param {String or Node} key
   * @param {Node} node
   * @return {Node} node
   */

  pushNode(key, node) {
    if (typeof key != 'string') {
      node = key
      key = node.key
    }

    let nodes = this.nodes.set(key, node)
    return this.merge({ nodes })
  },

  /**
   * Remove a `node` from the children node map.
   *
   * @param {String or Node} key
   * @return {Node} node
   */

  removeNode(key) {
    if (typeof key != 'string') {
      key = key.key
    }

    let nodes = this.nodes.remove(key)
    return this.merge({ nodes })
  },

  /**
   * Set a new value for a child node by `key`.
   *
   * @param {String or Node} key
   * @param {Node} node
   * @return {Node} node
   */

  updateNode(key, node) {
    if (typeof key != 'string') {
      node = key
      key = node.key
    }

    if (this.nodes.get(key)) {
      const nodes = this.nodes.set(key, node)
      return this.set('nodes', nodes)
    }

    const nodes = this.nodes.map((child) => {
      return child.type == 'text' ? child : child.updateNode(key, node)
    })

    return this.merge({ nodes })
  }

}

/**
 * Export.
 */

export default Node
