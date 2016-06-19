
import Character from './character'
import Element from './element'
import Selection from './selection'
import Text from './text'
import { OrderedMap } from 'immutable'

/**
 * Node.
 *
 * And interface that `Document` and `Element` both implement, to make working
 * recursively easier with the tree easier.
 */

const Node = {

  /**
   * Delete everything in a `range`.
   *
   * @param {Selection} range
   * @return {Node} node
   */

  deleteAtRange(range) {
    let node = this

    // If the range is collapsed, there's nothing to do.
    if (range.isCollapsed) return node

    // Make sure the children exist.
    const { startKey, startOffset, endKey, endOffset } = range
    if (!node.hasNode(startKey)) throw new Error('Could not find that start node.')
    if (!node.hasNode(endKey)) throw new Error('Could not find that end node.')

    let startNode = node.getNode(startKey)

    // If the start and end nodes are the same, remove the matching characters.
    if (startKey == endKey) {
      let { characters } = startNode

      characters = characters.filterNot((char, i) => {
        return startOffset <= i && i < endOffset
      })

      startNode = startNode.merge({ characters })
      node = node.updateNode(startNode)
      return node
    }

    // Otherwise, remove the text from the first and last nodes...
    const startRange = Selection.create({
      anchorKey: startKey,
      anchorOffset: startOffset,
      focusKey: startKey,
      focusOffset: startNode.length
    })

    const endRange = Selection.create({
      anchorKey: endKey,
      anchorOffset: 0,
      focusKey: endKey,
      focusOffset: endOffset
    })

    node = node.deleteAtRange(startRange)
    node = node.deleteAtRange(endRange)

    // Then remove any nodes in between the top-most start and end nodes...
    let startParent = node.getParentNode(startKey)
    let endParent = node.getParentNode(endKey)

    const startGrandestParent = node.nodes.find((child) => {
      return child == startParent || child.hasNode(startParent)
    })

    const endGrandestParent = node.nodes.find((child) => {
      return child == endParent || child.hasNode(endParent)
    })

    const nodes = node.nodes
      .takeUntil(child => child == startGrandestParent)
      .set(startGrandestParent.key, startGrandestParent)
      .concat(node.nodes.skipUntil(child => child == endGrandestParent))

    node = node.merge({ nodes })

    // Then add the end parent's nodes to the start parent node.
    const newNodes = startParent.nodes.concat(endParent.nodes)
    startParent = startParent.merge({ nodes: newNodes })
    node = node.updateNode(startParent)

    // Then remove the end parent.
    let endGrandparent = node.getParentNode(endParent)
    if (endGrandparent == node) {
      node = node.removeNode(endParent)
    } else {
      endGrandparent = endGrandparent.removeNode(endParent)
      node = node.updateNode(endGrandparent)
    }

    // Normalize the node.
    return node.normalize()
  },

  /**
   * Delete backward `n` characters at a `range`.
   *
   * @param {Selection} range
   * @param {Number} n (optional)
   * @return {Node} node
   */

  deleteBackwardAtRange(range, n = 1) {
    let node = this

    // When collapsed at the start of the node, there's nothing to do.
    if (range.isCollapsed && range.isAtStartOf(node)) return node

    // When the range is still expanded, just do a regular delete.
    if (range.isExpanded) return node.deleteAtRange(range)

    // When at start of a text node, merge forwards into the next text node.
    const { startKey } = range
    const startNode = node.getNode(startKey)

    if (range.isAtStartOf(startNode)) {
      const parent = node.getParentNode(startNode)
      const previous = node.getPreviousNode(parent).nodes.first()
      range = range.extendBackwardToEndOf(previous)
      node = node.deleteAtRange(range)
      return node
    }

    // Otherwise, remove `n` characters behind of the cursor.
    range = range.extendBackward(n)
    node = node.deleteAtRange(range)

    // Normalize the node.
    return node.normalize()
  },

  /**
   * Delete forward `n` characters at a `range`.
   *
   * @param {Selection} range
   * @param {Number} n (optional)
   * @return {Node} node
   */

  deleteForwardAtRange(range, n = 1) {
    let node = this

    // When collapsed at the end of the node, there's nothing to do.
    if (range.isCollapsed && range.isAtEndOf(node)) return node

    // When the range is still expanded, just do a regular delete.
    if (range.isExpanded) return node.deleteAtRange(range)

    // When at end of a text node, merge forwards into the next text node.
    const { startKey } = range
    const startNode = node.getNode(startKey)

    if (range.isAtEndOf(startNode)) {
      const parent = node.getParentNode(startNode)
      const next = node.getNextNode(parent).nodes.first()
      range = range.extendForwardToStartOf(next)
      node = node.deleteAtRange(range)
      return node
    }

    // Otherwise, remove `n` characters ahead of the cursor.
    range = range.extendForward(n)
    node = node.deleteAtRange(range)

    // Normalize the node.
    return node.normalize()
  },

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
   * Insert `text` at a `range`.
   *
   * @param {Selection} range
   * @param {String} text
   * @return {Document} node
   */

  insertTextAtRange(range, text) {
    let node = this

    // When still expanded, remove the current range first.
    if (range.isExpanded) {
      node = node.deleteAtRange(range)
      range = range.moveToStart()
    }

    let { startKey, startOffset } = range
    let startNode = node.getNode(startKey)
    let { characters } = startNode

    // Create a list of the new characters, with the right marks.
    const marks = characters.has(startOffset)
      ? characters.get(startOffset).marks
      : null

    const newCharacters = text.split('').reduce((list, char) => {
      const obj = { text }
      if (marks) obj.marks = marks
      return list.push(Character.create(obj))
    }, Character.createList())

    // Splice in the new characters.
    const resumeOffset = startOffset + text.length - 1
    characters = characters.slice(0, startOffset)
      .concat(newCharacters)
      .concat(characters.slice(resumeOffset, Infinity))

    // Update the existing text node.
    startNode = startNode.merge({ characters })
    node = node.updateNode(startNode)

    // Normalize the node.
    return node.normalize()
  },

  /**
   * Normalize the node, joining any two adjacent text child nodes.
   *
   * @return {Node} node
   */

  normalize() {
    let node = this
    let first = node.findNode((child) => {
      if (child.type != 'text') return
      const parent = node.getParentNode(child)
      const next = parent.getNextNode(child)
      return next && next.type == 'text'
    })

    // If no text node was followed by another, do nothing.
    if (!first) return node

    // Otherwise, add the text of the second node to the first...
    let parent = node.getParentNode(first)
    const second = parent.getNextNode(first)
    const characters = first.characters.concat(second.characters)
    first = first.merge({ characters })
    parent = parent.updateNode(first)

    // Then remove the second node.
    parent = parent.removeNode(second)

    // If the parent isn't this node, it needs to be updated.
    if (parent != node) {
      node = node.updateNode(parent)
    } else {
      node = parent
    }

    // Finally, recurse by normalizing again.
    return node.normalize()
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
   * Split the nodes at a `range`.
   *
   * @param {Selection} range
   * @return {Node} node
   */

  splitAtRange(range) {
    let node = this

    // If the range is expanded, remove it first.
    if (range.isExpanded) {
      node = node.deleteAtRange(range)
      range = range.moveToStart()
    }

    const { startKey, startOffset } = range
    const startNode = node.getNode(startKey)

    // Split the text node's characters.
    const { characters, length } = startNode
    const firstCharacters = characters.take(startOffset)
    const secondCharacters = characters.takeLast(length - startOffset)

    // Create a new first element with only the first set of characters.
    const parent = node.getParentNode(startNode)
    const firstText = startNode.set('characters', firstCharacters)
    const firstElement = parent.updateNode(firstText)

    // Create a brand new second element with the second set of characters.
    let secondText = Text.create({})
    let secondElement = Element.create({
      type: firstElement.type,
      data: firstElement.data
    })

    secondText = secondText.set('characters', secondCharacters)
    secondElement = secondElement.pushNode(secondText)

    // Replace the old parent node in the grandparent with the two new ones.
    let grandparent = node.getParentNode(parent)
    const befores = grandparent.nodes.takeUntil(child => child.key == parent.key)
    const afters = grandparent.nodes.skipUntil(child => child.key == parent.key).rest()
    const nodes = befores
      .set(firstElement.key, firstElement)
      .set(secondElement.key, secondElement)
      .concat(afters)

    // If the node is the grandparent, just merge, otherwise deep merge.
    if (grandparent == node) {
      node = node.merge({ nodes })
    } else {
      grandparent = grandparent.merge({ nodes })
      node = node.updateNode(grandparent)
    }

    // Normalize the node.
    return node.normalize()
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
