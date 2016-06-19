
import Character from './character'
import Node from './node'
import Selection from './selection'
import Text from './text'
import { OrderedMap, Record } from 'immutable'

/**
 * Defaults.
 */

const DEFAULT_PROPERTIES = {
  nodes: new OrderedMap()
}

/**
 * Node-like methods, that should be mixed into the `Document` prototype.
 */

const NODE_LIKE_METHODS = [
  'filterNodes',
  'findNode',
  'getNextNode',
  'getNode',
  'getParentNode',
  'getPreviousNode',
  'hasNode',
  'pushNode',
  'removeNode',
  'updateNode'
]

/**
 * Document.
 */

class Document extends Record(DEFAULT_PROPERTIES) {

  /**
   * Create a new `Document` with `properties`.
   *
   * @param {Objetc} properties
   * @return {Document} document
   */

  static create(properties = {}) {
    return new Document(properties)
  }

  /**
   * Node-like getters.
   */

  get length() {
    return this.text.length
  }

  get text() {
    return this.nodes
      .map(node => node.text)
      .join('')
  }

  get type() {
    return 'document'
  }

  /**
   * Delete everything in a `range`.
   *
   * @param {Selection} range
   * @return {Document} document
   */

  deleteAtRange(range) {
    let document = this

    // If the range is collapsed, there's nothing to do.
    if (range.isCollapsed) return document

    const { startKey, startOffset, endKey, endOffset } = range
    let startNode = document.getNode(startKey)

    // If the start and end nodes are the same, remove the matching characters.
    if (startKey == endKey) {
      let { characters } = startNode

      characters = characters.filterNot((char, i) => {
        return startOffset <= i && i < endOffset
      })

      startNode = startNode.merge({ characters })
      document = document.updateNode(startNode)
      return document
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

    document = document.deleteAtRange(startRange)
    document = document.deleteAtRange(endRange)

    // Then remove any nodes in between the top-most start and end nodes...
    let startParent = document.getParentNode(startKey)
    let endParent = document.getParentNode(endKey)

    const startGrandestParent = document.nodes.find((node) => {
      return node == startParent || node.hasNode(startParent)
    })

    const endGrandestParent = document.nodes.find((node) => {
      return node == endParent || node.hasNode(endParent)
    })

    const nodes = document.nodes
      .takeUntil(node => node == startGrandestParent)
      .set(startGrandestParent.key, startGrandestParent)
      .concat(document.nodes.skipUntil(node => node == endGrandestParent))

    document = document.merge({ nodes })

    // Then add the end parent's nodes to the start parent node.
    const newNodes = startParent.nodes.concat(endParent.nodes)
    startParent = startParent.merge({ nodes: newNodes })
    document = document.updateNode(startParent)

    // Then remove the end parent.
    let endGrandparent = document.getParentNode(endParent)
    if (endGrandparent == document) {
      document = document.removeNode(endParent)
    } else {
      endGrandparent = endGrandparent.removeNode(endParent)
      document = document.updateNode(endGrandparent)
    }

    // Normalize the document.
    return document.normalize()
  }

  /**
   * Delete backward `n` characters at a `range`.
   *
   * @param {Selection} range
   * @param {Number} n (optional)
   * @return {Document} document
   */

  deleteBackwardAtRange(range, n = 1) {
    let document = this

    // When collapsed at the end of the document, there's nothing to do.
    if (range.isCollapsed && range.isAtEndOf(document)) return document

    // When the range is still expanded, just do a regular delete.
    if (range.isExpanded) return document.deleteAtRange(range)

    // When at start of a text node, merge forwards into the next text node.
    const { startKey } = range
    const startNode = document.getNode(startKey)

    if (range.isAtStartOf(startNode)) {
      const parent = document.getParentNode(startNode)
      const previous = document.getPreviousNode(parent).nodes.first()
      range = range.extendBackwardToEndOf(previous)
      document = document.deleteAtRange(range)
      return document
    }

    // Otherwise, remove `n` characters behind of the cursor.
    range = range.extendBackward(n)
    document = document.deleteAtRange(range)

    // Normalize the document.
    return document.normalize()
  }

  /**
   * Delete forward `n` characters at a `range`.
   *
   * @param {Selection} range
   * @param {Number} n (optional)
   * @return {Document} document
   */

  deleteForwardAtRange(range, n = 1) {
    let document = this

    // When collapsed at the end of the document, there's nothing to do.
    if (range.isCollapsed && range.isAtEndOf(document)) return document

    // When the range is still expanded, just do a regular delete.
    if (range.isExpanded) return document.deleteAtRange(range)

    // When at end of a text node, merge forwards into the next text node.
    const { startKey } = range
    const startNode = document.getNode(startKey)

    if (range.isAtEndOf(startNode)) {
      const parent = document.getParentNode(startNode)
      const next = document.getNextNode(parent).nodes.first()
      range = range.extendForwardToStartOf(next)
      document = document.deleteAtRange(range)
      return document
    }

    // Otherwise, remove `n` characters ahead of the cursor.
    range = range.extendForward(n)
    document = document.deleteAtRange(range)

    // Normalize the document.
    return document.normalize()
  }

  /**
   * Insert `data` at a `range`.
   *
   * @param {Selection} range
   * @param {String or Node or OrderedMap} data
   * @return {Document} document
   */

  insertAtRange(range, data) {
    let document = this

    // When still expanded, remove the current range first.
    if (range.isExpanded) {
      document = document.deleteAtRange(range)
      range = range.moveToStart()
    }

    // When the data is a string of characters...
    if (typeof data == 'string') {
      let { startNode, startOffset } = document
      let { characters } = startNode

      // Create a list of the new characters, with the right marks.
      const marks = characters.has(startOffset)
        ? characters.get(startOffset).marks
        : null

      const newCharacters = data.split('').reduce((list, char) => {
        const obj = { text: char }
        if (marks) obj.marks = marks
        return list.push(Character.create(obj))
      }, Character.createList())

      // Splice in the new characters.
      const resumeOffset = startOffset + data.length - 1
      characters = characters.slice(0, startOffset)
        .concat(newCharacters)
        .concat(characters.slice(resumeOffset, Infinity))

      // Update the existing text node.
      startNode = startNode.merge({ characters })
      document = document.updateNode(startNode)
      return document
    }

    // Normalize the document.
    return document.normalize()
  }

  /**
   * Normalize the document, joining any two adjacent text nodes.
   *
   * @return {Document} document
   */

  normalize() {
    let document = this
    let first = document.findNode((node) => {
      if (node.type != 'text') return
      const parent = document.getParentNode(node)
      const next = parent.getNextNode(node)
      return next && next.type == 'text'
    })

    // If no text node was followed by another, do nothing.
    if (!first) return document

    // Otherwise, add the text of the second node to the first...
    let parent = document.getParentNode(first)
    const second = parent.getNextNode(first)
    const characters = first.characters.concat(second.characters)
    first = first.merge({ characters })
    parent = parent.updateNode(first)

    // Then remove the second node.
    parent = parent.removeNode(second)
    document = document.updateNode(parent)

    // Finally, recurse by normalizing again.
    return document.normalize()
  }

  /**
   * Split the nodes at a `range`.
   *
   * @param {Selection} range
   * @return {Document} document
   */

  splitAtRange(range) {
    let document = this

    // If the range is expanded, remove it first.
    if (range.isExpanded) {
      document = document.deleteAtRange(range)
      range = range.moveToStart()
    }

    const { startKey, startOffset } = range
    const startNode = document.getNode(startKey)

    // Split the text node's characters.
    const { characters, length } = startNode
    const firstCharacters = characters.take(startOffset)
    const secondCharacters = characters.takeLast(length - startOffset)

    // Create a new first node with only the first set of characters.
    const parent = document.getParentNode(startNode)
    const firstText = startNode.set('characters', firstCharacters)
    const firstNode = parent.updateNode(firstText)

    // Create a brand new second node with the second set of characters.
    let secondText = Text.create({})
    let secondNode = Node.create({
      type: firstNode.type,
      data: firstNode.data
    })

    secondText = secondText.set('characters', secondCharacters)
    secondNode = secondNode.pushNode(secondText)

    // Replace the old parent node in the grandparent with the two new ones.
    let grandparent = document.getParentNode(parent)
    const befores = grandparent.nodes.takeUntil(node => node.key == parent.key)
    const afters = grandparent.nodes.skipUntil(node => node.key == parent.key).rest()
    const nodes = befores
      .set(firstNode.key, firstNode)
      .set(secondNode.key, secondNode)
      .concat(afters)

    // If the document is the grandparent, just merge, otherwise deep merge.
    if (grandparent == document) {
      document = document.merge({ nodes })
    } else {
      grandparent = grandparent.merge({ nodes })
      document = document.updateNode(grandparent)
    }

    // Normalize the document.
    return document.normalize()
  }

}

/**
 * Mix in node-like methods.
 */

NODE_LIKE_METHODS.forEach((method) => {
  Document.prototype[method] = Node.prototype[method]
})

/**
 * Export.
 */

export default Document
