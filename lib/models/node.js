
import Block from './block'
import Character from './character'
import Data from './data'
import Mark from './mark'
import Selection from './selection'
import Text from './text'
import { List, Map, Set } from 'immutable'

/**
 * Node.
 *
 * And interface that `Document`, `Block` and `Inline` all implement, to make
 * working with the recursive node tree easier.
 */

const Node = {

  /**
   * Assert that the node has a child by `key`.
   *
   * @param {String or Node} key
   */

  assertHasChild(key) {
    key = normalizeKey(key)
    if (!this.hasChild(key)) {
      throw new Error(`Could not find a child node with key "${key}".`)
    }
  },

  /**
   * Assert that the node has a descendant by `key`.
   *
   * @param {String or Node} key
   */

  assertHasDescendant(key) {
    key = normalizeKey(key)
    if (!this.hasDescendant(key)) {
      throw new Error(`Could not find a descendant node with key "${key}".`)
    }
  },

  /**
   * Delete everything in a `range`.
   *
   * @param {Selection} range
   * @return {Node} node
   */

  deleteAtRange(range) {
    let node = this
    range = range.normalize(node)

    // If the range is collapsed, there's nothing to do.
    if (range.isCollapsed) return node

    // Make sure the children exist.
    const { startKey, startOffset, endKey, endOffset } = range
    node.assertHasDescendant(startKey)
    node.assertHasDescendant(endKey)

    // If the start and end nodes are the same, just remove characters.
    if (startKey == endKey) {
      let text = node.getDescendant(startKey)
      text = text.removeCharacters(startOffset, endOffset)
      node = node.updateDescendant(text)
      return node
    }

    // Split the blocks and determine the edge boundaries.
    const start = range.moveToStart()
    const end = range.moveToEnd()
    node = node.splitBlockAtRange(start, Infinity)
    node = node.splitBlockAtRange(end, Infinity)

    const startText = node.getDescendant(startKey)
    const startEdgeText = node.getNextText(startKey)

    const endText = node.getNextText(endKey)
    const endEdgeText = node.getDescendant(endKey)

    // Remove the new blocks inside the edges.
    const startEdgeBlock = node.getFurthestBlock(startEdgeText)
    const endEdgeBlock = node.getFurthestBlock(endEdgeText)

    const nodes = node.nodes
      .takeUntil(n => n == startEdgeBlock)
      .concat(node.nodes.skipUntil(n => n == endEdgeBlock).rest())

    node = node.merge({ nodes })

    // Take the end edge's split text and move it to the start edge.
    let startBlock = node.getFurthestBlock(startText)
    let endChild = node.getFurthestInline(endText) || endText

    const startNodes = startBlock.nodes.push(endChild)
    startBlock = startBlock.merge({ nodes: startNodes })
    node = node.updateDescendant(startBlock)

    // While the end child is an only child, remove the block it's in.
    let endParent = node.getClosestBlock(endChild)

    while (endParent && endParent.nodes.size == 1) {
      endChild = endParent
      endParent = node.getClosestBlock(endParent)
    }

    node = node.removeDescendant(endChild)

    // Normalize the adjacent text nodes.
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
    range = range.normalize(node)

    // When collapsed at the start of the node, there's nothing to do.
    if (range.isCollapsed && range.isAtStartOf(node)) return node

    // When the range is still expanded, just do a regular delete.
    if (range.isExpanded) return node.deleteAtRange(range)

    // When at start of a text node, merge forwards into the next text node.
    const { startKey } = range
    const startNode = node.getDescendant(startKey)

    if (range.isAtStartOf(startNode)) {
      const previous = node.getPreviousText(startNode)
      range = range.extendToEndOf(previous)
      range = range.normalize(node)
      return node.deleteAtRange(range)
    }

    // Otherwise, remove `n` characters behind of the cursor.
    range = range.extendBackward(n)
    return node.deleteAtRange(range)
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
    range = range.normalize(node)

    // When collapsed at the end of the node, there's nothing to do.
    if (range.isCollapsed && range.isAtEndOf(node)) return node

    // When the range is still expanded, just do a regular delete.
    if (range.isExpanded) return node.deleteAtRange(range)

    // When at end of a text node, merge forwards into the next text node.
    const { startKey } = range
    const startNode = node.getDescendant(startKey)

    if (range.isAtEndOf(startNode)) {
      const next = node.getNextText(startNode)
      range = range.extendToStartOf(next)
      range = range.normalize(node)
      return node.deleteAtRange(range)
    }

    // Otherwise, remove `n` characters ahead of the cursor.
    range = range.extendForward(n)
    return node.deleteAtRange(range)
  },

  /**
   * Recursively find all ancestor nodes by `iterator`.
   *
   * @param {Function} iterator
   * @return {Node} node
   */

  findDescendant(iterator) {
    return (
      this.nodes.find(iterator) ||
      this.nodes
        .map(node => node.kind == 'text' ? null : node.findDescendant(iterator))
        .find(exists => exists)
    )
  },

  /**
   * Recursively filter all ancestor nodes with `iterator`.
   *
   * @param {Function} iterator
   * @return {List} nodes
   */

  filterDescendants(iterator) {
    return this.nodes.reduce((matches, child, i, nodes) => {
      if (iterator(child, i, nodes)) matches = matches.push(child)
      if (child.kind != 'text') matches = matches.concat(child.filterDescendants(iterator))
      return matches
    }, Block.createList())
  },

  /**
   * Get the closest block nodes for each text node in a `range`.
   *
   * @param {Selection} range
   * @return {List} nodes
   */

  getBlocksAtRange(range) {
    range = range.normalize(this)
    return this
      .getTextsAtRange(range)
      .map(text => this.getClosestBlock(text))
  },

  /**
   * Get a list of the characters in a `range`.
   *
   * @param {Selection} range
   * @return {List} characters
   */

  getCharactersAtRange(range) {
    range = range.normalize(this)
    return this
      .getTextsAtRange(range)
      .reduce((characters, text) => {
        const chars = text.characters.filter((char, i) => isInRange(i, text, range))
        return characters.concat(chars)
      }, Character.createList())
  },

  /**
   * Get closest parent of node by `key` that matches `iterator`.
   *
   * @param {String or Node} key
   * @param {Function} iterator
   * @return {Node or Null} node
   */

  getClosest(key, iterator) {
    let node = this.getDescendant(key)

    while (node = this.getParent(node)) {
      if (node == this) return null
      if (iterator(node)) return node
    }

    return null
  },

  /**
   * Get the closest block parent of a `node`.
   *
   * @param {String or Node} key
   * @return {Node or Null} node
   */

  getClosestBlock(key) {
    return this.getClosest(key, parent => parent.kind == 'block')
  },

  /**
   * Get the closest inline parent of a `node`.
   *
   * @param {String or Node} key
   * @return {Node or Null} node
   */

  getClosestInline(key) {
    return this.getClosest(key, parent => parent.kind == 'inline')
  },

  /**
   * Get a child node by `key`.
   *
   * @param {String or Node} key
   * @return {Node or Null} node
   */

  getChild(key) {
    key = normalizeKey(key)
    return this.nodes.find(node => node.key == key)
  },

  /**
   * Get the highest child ancestor of a node by `key`.
   *
   * @param {String or Node} key
   * @return {Node or Null} node
   */

  getHighestChild(key) {
    key = normalizeKey(key)
    return this.nodes.find(node => {
      if (node.key == key) return true
      if (node.kind == 'text') return false
      return node.hasDescendant(key)
    })
  },

  /**
   * Get a descendant node by `key`.
   *
   * @param {String} key
   * @return {Node or Null} node
   */

  getDescendant(key) {
    key = normalizeKey(key)
    return this.findDescendant(node => node.key == key)
  },

  /**
   * Get the depth of a child node by `key`, with optional `startAt`.
   *
   * @param {String or Node} key
   * @param {Number} startAt (optional)
   * @return {Number} depth
   */

  getDepth(key, startAt = 1) {
    key = normalizeKey(key)
    this.assertHasDescendant(key)
    if (this.hasChild(key)) return startAt
    return this
      .getHighestChild(key)
      .getDepth(key, startAt + 1)
  },

  /**
   * Get the furthest block parent of a node by `key`.
   *
   * @param {String or Node} key
   * @return {Node or Null} node
   */

  getFurthestBlock(key) {
    let node = this.getDescendant(key)
    let furthest = null

    while (node = this.getClosestBlock(node)) {
      furthest = node
    }

    return furthest
  },

  /**
   * Get the furthest inline parent of a node by `key`.
   *
   * @param {String or Node} key
   * @return {Node or Null} node
   */

  getFurthestInline(key) {
    let node = this.getDescendant(key)
    let furthest = null

    while (node = this.getClosestInline(node)) {
      furthest = node
    }

    return furthest
  },

  /**
   * Get the closest inline nodes for each text node in a `range`.
   *
   * @param {Selection} range
   * @return {List} nodes
   */

  getInlinesAtRange(range) {
    range = range.normalize(this)
    if (range.isUnset) return Inline.createList()

    return this
      .getTextsAtRange(range)
      .map(text => this.getClosestInline(text))
      .filter(exists => exists)
  },

  /**
   * Get a set of the marks in a `range`.
   *
   * @param {Selection} range
   * @return {Set} marks
   */

  getMarksAtRange(range) {
    range = range.normalize(this)
    const { startKey, startOffset } = range
    const marks = Mark.createSet()

    // If the range isn't set, return an empty set.
    if (range.isUnset) return marks

    // If the range is collapsed at the start of the node, check the previous.
    if (range.isCollapsed && startOffset == 0) {
      const previous = this.getPreviousText(startKey)
      if (!previous) return marks
      const char = text.characters.get(previous.length - 1)
      return char.marks
    }

    // If the range is collapsed, check the character before the start.
    if (range.isCollapsed) {
      const text = this.getDescendant(startKey)
      const char = text.characters.get(range.startOffset - 1)
      return char.marks
    }

    // Otherwise, get a set of the marks for each character in the range.
    this
      .getCharactersAtRange(range)
      .reduce((marks, char) => {
        return marks.union(char.marks)
      }, marks)
  },

  /**
   * Get the node after a descendant by `key`.
   *
   * @param {String or Node} key
   * @return {Node or Null} node
   */

  getNextSibling(key) {
    const node = this.getDescendant(key)
    if (!node) return null
    return this
      .getParent(node)
      .nodes
      .skipUntil(child => child == node)
      .get(1)
  },

  /**
   * Get the text node after a descendant text node by `key`.
   *
   * @param {String or Node} key
   * @return {Node or Null} node
   */

  getNextText(key) {
    key = normalizeKey(key)
    return this.getTextNodes()
      .skipUntil(text => text.key == key)
      .get(1)
  },

  /**
   * Get the offset for a descendant text node by `key`.
   *
   * @param {String or Node} key
   * @return {Number} offset
   */

  getOffset(key) {
    key = normalizeKey(key)
    this.assertHasDescendant(key)

    // Calculate the offset of the nodes before the highest child.
    const child = this.getHighestChild(key)
    const offset = this.nodes
      .takeUntil(node => node == child)
      .reduce((offset, child) => offset + child.length, 0)

    // Recurse if need be.
    return this.hasChild(key)
      ? offset
      : offset + child.getOffset(key)
  },

  /**
   * Get the parent of a child node by `key`.
   *
   * @param {String or Node} key
   * @return {Node or Null} node
   */

  getParent(key) {
    key = normalizeKey(key)
    if (this.hasChild(key)) return this

    let node = null

    this.nodes.forEach((child) => {
      if (child.kind == 'text') return
      const match = child.getParent(key)
      if (match) node = match
    })

    return node
  },

  /**
   * Get the node before a descendant node by `key`.
   *
   * @param {String or Node} key
   * @return {Node or Null} node
   */

  getPreviousSibling(key) {
    const node = this.getDescendant(key)
    if (!node) return null
    return this
      .getParent(node)
      .nodes
      .takeUntil(child => child == node)
      .last()
  },

  /**
   * Get the text node before a descendant text node by `key`.
   *
   * @param {String or Node} key
   * @return {Node or Null} node
   */

  getPreviousText(key) {
    key = normalizeKey(key)
    return this.getTextNodes()
      .takeUntil(text => text.key == key)
      .last()
  },

  /**
   * Get the descendent text node at an `offset`.
   *
   * @param {String} offset
   * @return {Node or Null} node
   */

  getTextAtOffset(offset) {
    let length = 0
    return this
      .getTextNodes()
      .find((text) => {
        length += text.length
        return length >= offset
      })
  },

  /**
   * Recursively get all of the child text nodes in order of appearance.
   *
   * @return {List} nodes
   */

  getTextNodes() {
    return this.nodes.reduce((texts, node) => {
      return node.kind == 'text'
        ? texts.push(node)
        : texts.concat(node.getTextNodes())
    }, Block.createList())
  },

  /**
   * Get all of the text nodes in a `range`.
   *
   * @param {Selection} range
   * @return {List} nodes
   */

  getTextsAtRange(range) {
    range = range.normalize(this)

    // If the selection is unset, return an empty list.
    if (range.isUnset) return Block.createList()

    const { startKey, endKey } = range
    const texts = this.getTextNodes()
    const startText = this.getDescendant(startKey)
    const endText = this.getDescendant(endKey)
    const start = texts.indexOf(startText)
    const end = texts.indexOf(endText)
    return texts.slice(start, end + 1)
  },

  /**
   * Check if a child node exists by `key`.
   *
   * @param {String or Node} key
   * @return {Boolean} exists
   */

  hasChild(key) {
    key = normalizeKey(key)
    return !! this.nodes.find(node => node.key == key)
  },

  /**
   * Recursively check if a child node exists by `key`.
   *
   * @param {String or Node} key
   * @return {Boolean} exists
   */

  hasDescendant(key) {
    key = normalizeKey(key)
    return !! this.nodes.find((node) => {
      return node.kind == 'text'
        ? node.key == key
        : node.key == key || node.hasDescendant(key)
    })
  },

  /**
   * Insert `text` at a `range`.
   *
   * @param {Selection} range
   * @param {String} text
   * @return {Node} node
   */

  insertTextAtRange(range, text) {
    let node = this
    range = range.normalize(node)

    // When still expanded, remove the current range first.
    if (range.isExpanded) {
      node = node.deleteAtRange(range)
      range = range.moveToStart()
    }

    let { startKey, startOffset } = range
    let startNode = node.getDescendant(startKey)
    let { characters } = startNode

    // Create a list of the new characters, with the marks from the previous
    // character if one exists.
    const prev = characters.get(startOffset - 1)
    const marks = prev ? prev.marks : null
    const newChars = Character.createList(text.split('').map((char) => {
      const obj = { text: char }
      if (marks) obj.marks = marks
      return obj
    }))

    // Splice in the new characters.
    characters = characters.slice(0, startOffset)
      .concat(newChars)
      .concat(characters.slice(startOffset))

    // Update the existing text node.
    startNode = startNode.merge({ characters })
    node = node.updateDescendant(startNode)

    // Normalize the node.
    return node.normalize()
  },

  /**
   * Add a new `mark` to the characters at `range`.
   *
   * @param {Selection} range
   * @param {Mark or String} mark
   * @return {Node} node
   */

  markAtRange(range, mark) {
    let node = this
    range = range.normalize(node)

    // Allow for just passing a type for convenience.
    if (typeof mark == 'string') {
      mark = new Mark({ type: mark })
    }

    // When the range is collapsed, do nothing.
    if (range.isCollapsed) return node

    // Otherwise, find each of the text nodes within the range.
    const { startKey, startOffset, endKey, endOffset } = range
    let texts = node.getTextsAtRange(range)

    // Apply the mark to each of the text nodes's matching characters.
    texts = texts.map((text) => {
      let characters = text.characters.map((char, i) => {
        if (!isInRange(i, text, range)) return char
        let { marks } = char
        marks = marks.add(mark)
        return char.merge({ marks })
      })

      return text.merge({ characters })
    })

    // Update each of the text nodes.
    texts.forEach((text) => {
      node = node.updateDescendant(text)
    })

    return node
  },

  /**
   * Normalize the node by joining any two adjacent text child nodes.
   *
   * @return {Node} node
   */

  normalize() {
    let node = this

    // See if there are any adjacent text nodes.
    let firstAdjacent = node.findDescendant((child) => {
      if (child.kind != 'text') return
      const parent = node.getParent(child)
      const next = parent.getNextSibling(child)
      return next && next.kind == 'text'
    })

    // If no text nodes are adjacent, abort.
    if (!firstAdjacent) return node

    // Fix an adjacent text node if one exists.
    let parent = node.getParent(firstAdjacent)
    const second = parent.getNextSibling(firstAdjacent)
    const characters = firstAdjacent.characters.concat(second.characters)
    firstAdjacent = firstAdjacent.merge({ characters })
    parent = parent.updateDescendant(firstAdjacent)

    // Then remove the second node.
    parent = parent.removeDescendant(second)

    // If the parent isn't this node, it needs to be updated.
    if (parent != node) {
      node = node.updateDescendant(parent)
    } else {
      node = parent
    }

    // Recurse by normalizing again.
    return node.normalize()
  },

  /**
   * Remove a `node` from the children node map.
   *
   * @param {String or Node} key
   * @return {Node} node
   */

  removeDescendant(key) {
    key = normalizeKey(key)
    this.assertHasDescendant(key)

    const child = this.getChild(key)

    if (child) {
      const nodes = this.nodes.filterNot(node => node == child)
      return this.merge({ nodes })
    }

    const nodes = this.nodes.map((node) => {
      return node.kind == 'text'
        ? node
        : node.removeDescendant(key)
    })

    return this.merge({ nodes })
  },

  /**
   * Set the block nodes in a range to `type`, with optional `data`.
   *
   * @param {Selection} range
   * @param {String} type (optional)
   * @param {Data} data (optional)
   * @return {Node} node
   */

  setBlockAtRange(range, type, data) {
    let node = this
    range = range.normalize(node)

    // Allow for passing data only.
    if (typeof type == 'object') {
      data = type
      type = null
    }

    // Update each of the blocks.
    const blocks = node.getBlocksAtRange(range)
    blocks.forEach((block) => {
      const obj = {}
      if (type) obj.type = type
      if (data) obj.data = Data.create(data)
      block = block.merge(obj)
      node = node.updateDescendant(block)
    })

    return node
  },

  /**
   * Set the inline nodes in a range to `type`, with optional `data`.
   *
   * @param {Selection} range
   * @param {String} type (optional)
   * @param {Data} data (optional)
   * @return {Node} node
   */

  setInlineAtRange(range, type, data) {
    let node = this
    range = range.normalize(node)

    // Allow for passing data only.
    if (typeof type == 'object') {
      data = type
      type = null
    }

    // Update each of the inlines.
    const inlines = node.getInlinesAtRange(range)
    inlines.forEach((inline) => {
      const obj = {}
      if (type) obj.type = type
      if (data) obj.data = Data.create(data)
      inline = inline.merge(obj)
      node = node.updateDescendant(inline)
    })

    return node
  },

  /**
   * Split the block nodes at a `range`, to optional `depth`.
   *
   * @param {Selection} range
   * @param {Number} depth (optional)
   * @return {Node} node
   */

  splitBlockAtRange(range, depth = 1) {
    let node = this
    range = range.normalize(node)

    // If the range is expanded, remove it first.
    if (range.isExpanded) {
      node = node.deleteAtRange(range)
      range = range.moveToStart()
    }

    // Split the inline nodes at the range.
    node = node.splitInlineAtRange(range)

    // Find the highest inline elements that were split.
    const { startKey } = range
    const firstText = node.getDescendant(startKey)
    const secondText = node.getNextText(startKey)
    let firstChild = node.getFurthestInline(firstText) || firstText
    let secondChild = node.getFurthestInline(secondText) || secondText
    let parent = node.getClosestBlock(firstChild)
    let d = 0

    // While the parent is a block, split the block nodes.
    while (parent && d < depth) {
      firstChild = parent.merge({ nodes: Block.createList([firstChild]) })
      secondChild = Block.create({
        nodes: [secondChild],
        type: parent.type,
        data: parent.data
      })

      // Add the new children.
      const grandparent = node.getParent(parent)
      const nodes = grandparent.nodes
        .takeUntil(n => n.key == firstChild.key)
        .push(firstChild)
        .push(secondChild)
        .concat(grandparent.nodes.skipUntil(n => n.key == firstChild.key).rest())

      // Update the grandparent.
      node = grandparent == node
        ? node.merge({ nodes })
        : node.updateDescendant(grandparent.merge({ nodes }))

      d++
      parent = node.getClosestBlock(firstChild)
    }

    return node
  },

  /**
   * Split the inline nodes at a `range`, to optional `depth`.
   *
   * @param {Selection} range
   * @param {Number} depth (optiona)
   * @return {Node} node
   */

  splitInlineAtRange(range, depth = Infinity) {
    range = range.normalize(this)
    const Inline = require('./inline').default
    let node = this

    // If the range is expanded, remove it first.
    if (range.isExpanded) {
      node = node.deleteAtRange(range)
      range = range.moveToStart()
    }

    // First split the text nodes.
    node = node.splitTextAtRange(range)

    // Find the children that were split.
    const { startKey } = range
    let firstChild = node.getDescendant(startKey)
    let secondChild = node.getNextText(firstChild)
    let parent = node.getClosestInline(firstChild)
    let d = 0

    // While the parent is an inline parent, split the inline nodes.
    while (parent && d < depth) {
      firstChild = parent.merge({ nodes: Inline.createList([firstChild]) })
      secondChild = Inline.create({
        nodes: [secondChild],
        type: parent.type,
        data: parent.data
      })

      // Split the children.
      const grandparent = node.getParent(parent)
      const nodes = grandparent.nodes
        .takeUntil(n => n.key == firstChild.key)
        .push(firstChild)
        .push(secondChild)
        .concat(grandparent.nodes.skipUntil(n => n.key == firstChild.key).rest())

      // Update the grandparent.
      node = grandparent == node
        ? node.merge({ nodes })
        : node.updateDescendant(grandparent.merge({ nodes }))

      d++
      parent = node.getClosestInline(firstChild)
    }

    return node
  },

  /**
   * Split the text nodes at a `range`.
   *
   * @param {Selection} range
   * @return {Node} node
   */

  splitTextAtRange(range) {
    range = range.normalize(this)
    let node = this

    // If the range is expanded, remove it first.
    if (range.isExpanded) {
      node = node.deleteAtRange(range)
      range = range.moveToStart()
    }

    // Split the text node's characters.
    const { startKey, startOffset } = range
    const text = node.getDescendant(startKey)
    const { characters } = text
    const firstChars = characters.take(startOffset)
    const secondChars = characters.skip(startOffset)
    let firstChild = text.merge({ characters: firstChars })
    let secondChild = Text.create({ characters: secondChars })

    // Split the text nodes.
    let parent = node.getParent(text)
    const nodes = parent.nodes
      .takeUntil(c => c.key == firstChild.key)
      .push(firstChild)
      .push(secondChild)
      .concat(parent.nodes.skipUntil(n => n.key == firstChild.key).rest())

    // Update the nodes.
    parent = parent.merge({ nodes })
    node = node.updateDescendant(parent)
    return node
  },

  /**
   * Remove an existing `mark` to the characters at `range`.
   *
   * @param {Selection} range
   * @param {Mark or String} mark
   * @return {Node} node
   */

  unmarkAtRange(range, mark) {
    let node = this
    range = range.normalize(node)

    // Allow for just passing a type for convenience.
    if (typeof mark == 'string') {
      mark = new Mark({ type: mark })
    }

    // When the range is collapsed, do nothing.
    if (range.isCollapsed) return node

    // Otherwise, find each of the text nodes within the range.
    let texts = node.getTextsAtRange(range)

    // Apply the mark to each of the text nodes's matching characters.
    texts = texts.map((text) => {
      let characters = text.characters.map((char, i) => {
        if (!isInRange(i, text, range)) return char
        let { marks } = char
        marks = marks.remove(mark)
        return char.merge({ marks })
      })

      return text.merge({ characters })
    })

    // Update each of the text nodes.
    texts.forEach((text) => {
      node = node.updateDescendant(text)
    })

    return node
  },

  /**
   * Unwrap all of the block nodes in a `range` from a block node of `type.`
   *
   * @param {Selection} range
   * @param {String} type (optional)
   * @param {Data or Object} data (optional)
   * @return {Node} node
   */

  unwrapBlockAtRange(range, type, data) {
    range = range.normalize(this)
    let node = this

    // Allow for only data.
    if (typeof type == 'object') {
      data = type
      type = null
    }

    // Ensure that data is immutable.
    if (data) data = Data.create(data)

    // Find the closest wrapping blocks of each text node.
    const texts = node.getBlocksAtRange(range)
    const wrappers = texts.reduce((wrappers, text) => {
      const match = node.getClosest(text, (parent) => {
        if (parent.kind != 'block') return false
        if (type && parent.type != type) return false
        if (data && !parent.data.isSuperset(data)) return false
        return true
      })

      if (match) wrappers = wrappers.add(match)
      return wrappers
    }, new Set())

    // Replace each of the wrappers with their child nodes.
    wrappers.forEach((wrapper) => {
      const parent = node.getParent(wrapper)

      // Replace the wrapper in the parent's nodes with the block.
      const nodes = parent.nodes.takeUntil(n => n == wrapper)
        .concat(wrapper.nodes)
        .concat(parent.nodes.skipUntil(n => n == wrapper).rest())

      // Update the parent.
      node = parent == node
        ? node.merge({ nodes })
        : node.updateDescendant(parent.merge({ nodes }))
    })

    return node.normalize()
  },

  /**
   * Unwrap the inline nodes in a `range` from an parent inline with `type`.
   *
   * @param {Selection} range
   * @param {String} type (optional)
   * @param {Data} data (optional)
   * @return {Node} node
   */

  unwrapInlineAtRange(range, type, data) {
    range = range.normalize(this)
    let node = this
    let blocks = node.getInlinesAtRange(range)

    // Allow for no type.
    if (typeof type == 'object') {
      data = type
      type = null
    }

    // Ensure that data is immutable.
    if (data) data = Data.create(data)

    // Find the closest matching inline wrappers of each text node.
    const texts = this.getTextNodes()
    const wrappers = texts.reduce((wrappers, text) => {
      const match = node.getClosest(text, (parent) => {
        if (parent.kind != 'inline') return false
        if (type && parent.type != type) return false
        if (data && !parent.data.isSuperset(data)) return false
        return true
      })

      if (match) wrappers = wrappers.add(match)
      return wrappers
    }, new Set())

    // Replace each of the wrappers with their child nodes.
    wrappers.forEach((wrapper) => {
      const parent = node.getParent(wrapper)

      // Replace the wrapper in the parent's nodes with the block.
      const nodes = parent.nodes.takeUntil(n => n == wrapper)
        .concat(wrapper.nodes)
        .concat(parent.nodes.skipUntil(n => n == wrapper).rest())

      // Update the parent.
      node = parent == node
        ? node.merge({ nodes })
        : node.updateDescendant(parent.merge({ nodes }))
    })

    return node.normalize()
  },

  /**
   * Set a new value for a child node by `key`.
   *
   * @param {Node} node
   * @return {Node} node
   */

  updateDescendant(node) {
    if (this.hasChild(node)) {
      const nodes = this.nodes.map(child => child.key == node.key ? node : child)
      return this.merge({ nodes })
    }

    const nodes = this.nodes.map((child) => {
      return child.kind == 'text' ? child : child.updateDescendant(node)
    })

    return this.merge({ nodes })
  },

  /**
   * Wrap all of the blocks in a `range` in a new block node of `type`.
   *
   * @param {Selection} range
   * @param {String} type
   * @param {Data} data (optional)
   * @return {Node} node
   */

  wrapBlockAtRange(range, type, data) {
    range = range.normalize(this)
    data = Data.create(data)
    let node = this

    // Get the block nodes, sorted by depth.
    const blocks = node.getBlocksAtRange(range)
    const sorted = blocks.sort((a, b) => {
      const da = node.getDepth(a)
      const db = node.getDepth(b)
      if (da == db) return 0
      if (da > db) return -1
      if (da < db) return 1
    })

    // Get the lowest common siblings, relative to the highest block.
    const highest = sorted.first()
    const depth = node.getDepth(highest)
    const siblings = blocks.reduce((siblings, block) => {
      const sibling = node.getDepth(block) == depth
        ? block
        : node.getClosest(block, (p) => node.getDepth(p) == depth)
      siblings = siblings.push(sibling)
      return siblings
    }, Block.createList())

    // Wrap the siblings in a new block.
    const wrapper = Block.create({
      nodes: siblings,
      type,
      data
    })

    // Replace the siblings with the wrapper.
    const first = siblings.first()
    const last = siblings.last()
    const parent = node.getParent(highest)
    const nodes = parent.nodes
      .takeUntil(node => node == first)
      .push(wrapper)
      .concat(parent.nodes.skipUntil(node => node == last).rest())

    // Update the parent.
    node = parent == node
      ? node.merge({ nodes })
      : node.updateDescendant(parent.merge({ nodes }))

    return node
  },

  /**
   * Wrap the text and inline nodes in a `range` with a new inline node.
   *
   * @param {Selection} range
   * @param {String} type
   * @param {Data} data (optional)
   * @return {Node} node
   */

  wrapInlineAtRange(range, type, data) {
    range = range.normalize(this)
    data = Data.create(data)

    const Inline = require('./inline').default
    let node = this

    // If collapsed or unset, there's nothing to wrap.
    if (range.isCollapsed || range.isUnset) return node

    // Split at the start of the range.
    const start = range.moveToStart()
    node = node.splitInlineAtRange(start)

    // Determine the new end of the range, and split there.
    const { startKey, startOffset, endKey, endOffset } = range
    const firstNode = node.getDescendant(startKey)
    const nextNode = node.getNextText(startKey)
    const end = startKey != endKey
      ? range.moveToEnd()
      : Selection.create({
          anchorKey: nextNode.key,
          anchorOffset: endOffset - startOffset,
          focusKey: nextNode.key,
          focusOffset: endOffset - startOffset
        })

    node = node.splitInlineAtRange(end)

    // Calculate the new range to wrap around.
    const endNode = node.getDescendant(end.anchorKey)
    range = Selection.create({
      anchorKey: nextNode.key,
      anchorOffset: 0,
      focusKey: endNode.key,
      focusOffset: endNode.length
    })

    // Get the furthest inline nodes in the range.
    const texts = node.getTextsAtRange(range)
    const children = texts.map(text => node.getFurthestInline(text) || text)

    // Iterate each of the child nodes, wrapping them.
    children.forEach((child) => {
      const obj = {}
      obj.nodes = [child]
      obj.type = type
      if (data) obj.data = data
      const wrapper = Inline.create(obj)

      // Replace the child in it's parent with the wrapper.
      const parent = node.getParent(child)
      const nodes = parent.nodes.takeUntil(n => n == child)
        .push(wrapper)
        .concat(parent.nodes.skipUntil(n => n == child).rest())

      // Update the parent.
      node = parent == node
        ? node.merge({ nodes })
        : node.updateDescendant(parent.merge({ nodes }))
    })

    return node
  }

}

/**
 * Normalize a `key`, from a key string or a node.
 *
 * @param {String or Node} key
 * @return {String} key
 */

function normalizeKey(key) {
  if (typeof key == 'string') return key
  return key.key
}

/**
 * Check if an `index` of a `text` node is in a `range`.
 *
 * @param {Number} index
 * @param {Text} text
 * @param {Selection} range
 * @return {Set} characters
 */

function isInRange(index, text, range) {
  const { startKey, startOffset, endKey, endOffset } = range
  let matcher

  if (text.key == startKey && text.key == endKey) {
    return startOffset <= index && index < endOffset
  } else if (text.key == startKey) {
    return startOffset <= index
  } else if (text.key == endKey) {
    return index < endOffset
  } else {
    return true
  }
}

/**
 * Export.
 */

export default Node
