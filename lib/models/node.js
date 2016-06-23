
import Block from './block'
import Character from './character'
import Data from './data'
import Mark from './mark'
import Selection from './selection'
import Text from './text'
import { List, Map, OrderedMap, OrderedSet, Set } from 'immutable'

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

  assertHasDeep(key) {
    if (!this.hasDeep(key)) throw new Error('Could not find that child node.')
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
    node.assertHasDeep(startKey)
    node.assertHasDeep(endKey)

    let startNode = node.getDeep(startKey)

    // If the start and end nodes are the same, remove the matching characters.
    if (startKey == endKey) {
      let { characters } = startNode

      characters = characters.filterNot((char, i) => {
        return startOffset <= i && i < endOffset
      })

      startNode = startNode.merge({ characters })
      node = node.updateDeep(startNode)
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
    let startParent = node.getParent(startKey)
    let endParent = node.getParent(endKey)

    const startGrandestParent = node.nodes.find((child) => {
      return child == startParent || child.hasDeep(startParent)
    })

    const endGrandestParent = node.nodes.find((child) => {
      return child == endParent || child.hasDeep(endParent)
    })

    const nodes = node.nodes
      .takeUntil(child => child == startGrandestParent)
      .set(startGrandestParent.key, startGrandestParent)
      .concat(node.nodes.skipUntil(child => child == endGrandestParent))

    node = node.merge({ nodes })

    // Then add the end parent's nodes to the start parent node.
    const newNodes = startParent.nodes.concat(endParent.nodes)
    startParent = startParent.merge({ nodes: newNodes })
    node = node.updateDeep(startParent)

    // Then remove the end parent.
    let endGrandparent = node.getParent(endParent)
    if (endGrandparent == node) {
      node = node.removeDeep(endParent)
    } else {
      endGrandparent = endGrandparent.removeDeep(endParent)
      node = node.updateDeep(endGrandparent)
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
    range = range.normalize(node)

    // When collapsed at the start of the node, there's nothing to do.
    if (range.isCollapsed && range.isAtStartOf(node)) return node

    // When the range is still expanded, just do a regular delete.
    if (range.isExpanded) return node.deleteAtRange(range)

    // When at start of a text node, merge forwards into the next text node.
    const { startKey } = range
    const startNode = node.getDeep(startKey)

    if (range.isAtStartOf(startNode)) {
      const previous = node.getPreviousText(startNode)
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
    range = range.normalize(node)

    // When collapsed at the end of the node, there's nothing to do.
    if (range.isCollapsed && range.isAtEndOf(node)) return node

    // When the range is still expanded, just do a regular delete.
    if (range.isExpanded) return node.deleteAtRange(range)

    // When at end of a text node, merge forwards into the next text node.
    const { startKey } = range
    const startNode = node.getDeep(startKey)

    if (range.isAtEndOf(startNode)) {
      const next = node.getNextText(startNode)
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

  findDeep(iterator) {
    const shallow = this.nodes.find(iterator)
    if (shallow != null) return shallow

    return this.nodes
      .map(node => node.kind == 'text' ? null : node.findDeep(iterator))
      .filter(node => node)
      .first()
  },

  /**
   * Recursively filter nodes nodes with `iterator`.
   *
   * @param {Function} iterator
   * @return {OrderedMap} matches
   */

  filterDeep(iterator) {
    return this.nodes.reduce((matches, child) => {
      if (iterator(child, child.key, this.nodes)) {
        matches = matches.set(child.key, child)
      }

      if (child.kind != 'text') {
        matches = matches.concat(child.filterDeep(iterator))
      }

      return matches
    }, new OrderedMap())
  },

  /**
   * Get the closest block nodes for each text node in a `range`.
   *
   * @param {Selection} range
   * @return {OrderedMap} nodes
   */

  getBlocksAtRange(range) {
    range = range.normalize(this)
    const texts = this.getTextNodesAtRange(range)
    const blocks = texts.map((text) => {
      return this.getClosest(text, p => p.kind == 'block')
    })

    return blocks
  },

  /**
   * Get a list of the characters in a `range`.
   *
   * @param {Selection} range
   * @return {List} characters
   */

  getCharactersAtRange(range) {
    range = range.normalize(this)
    const texts = this.getTextNodesAtRange(range)
    let list = new List()

    texts.forEach((text) => {
      let { characters } = text
      characters = characters.filter((char, i) => isInRange(i, text, range))
      list = list.concat(characters)
    })

    return list
  },

  /**
   * Get closest parent of `node` that matches `iterator`.
   *
   * @param {Node} node
   * @param {Function} iterator
   * @return {Node or Null} node
   */

  getClosest(node, iterator) {
    while (node) {
      if (node == this) return null
      if (iterator(node)) return node
      node = this.getParent(node)
    }

    return null
  },

  /**
   * Get a child node by `key`.
   *
   * @param {String} key
   * @return {Node or Null}
   */

  getDeep(key) {
    key = normalizeKey(key)
    const match = this.findDeep(node => node.key == key)
    return match || null
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
    if (this.nodes.has(key)) return startAt

    const child = this.nodes.find(node => {
      return node.kind == 'text'
        ? null
        : node.hasDeep(key)
    })

    return child
      ? child.getDepth(key, startAt + 1)
      : null
  },

  /**
   * Get the first text child node.
   *
   * @return {Text or Null} text
   */

  getFirstText() {
    return this.getTextNodes().first() || null
  },

  /**
   * Get the closest inline nodes for each text node in a `range`.
   *
   * @param {Selection} range
   * @return {OrderedMap} nodes
   */

  getInlinesAtRange(range) {
    range = range.normalize(this)
    const node = this
    const texts = node.getTextNodesAtRange(range)
    const inlines = texts
      .map(text => node.getClosest(text, p => p.kind == 'inline'))
      .filter(inline => inline)

    return inlines
  },

  /**
   * Get the last text child node.
   *
   * @return {Text or Null} text
   */

  getLastText() {
    return this.getTextNodes().last() || null
  },

  /**
   * Get a set of the marks in a `range`.
   *
   * @param {Selection} range
   * @return {Set} marks
   */

  getMarksAtRange(range) {
    range = range.normalize(this)
    const { startKey, startOffset, endKey } = range

    // If the selection isn't set, return nothing.
    if (startKey == null || endKey == null) return new Set()

    // If the range is collapsed, and at the start of the node, check the
    // previous text node.
    if (range.isCollapsed && startOffset == 0) {
      const previous = this.getPreviousText(startKey)
      if (!previous) return new Set()
      const char = text.characters.get(previous.length - 1)
      return char.marks
    }

    // If the range is collapsed, check the character before the start.
    if (range.isCollapsed) {
      const text = this.getDeep(startKey)
      const char = text.characters.get(range.startOffset - 1)
      return char.marks
    }

    // Otherwise, get a set of the marks for each character in the range.
    const characters = this.getCharactersAtRange(range)
    let set = new Set()

    characters.forEach((char) => {
      set = set.union(char.marks)
    })

    return set
  },

  /**
   * Get the child node after the one by `key`.
   *
   * @param {String or Node} key
   * @return {Node or Null}
   */

  getNextSibling(key) {
    key = normalizeKey(key)

    if (this.nodes.has(key)) {
      return this.nodes
        .skipUntil(node => node.key == key)
        .rest()
        .first()
    }

    return this.nodes
      .map(node => node.kind == 'text' ? null : node.getNextSibling(key))
      .filter(node => node)
      .first()
  },

  /**
   * Get the text node after a text node by `key`.
   *
   * @param {String or Node} key
   * @return {Node or Null} node
   */

  getNextText(key) {
    key = normalizeKey(key)
    return this.getTextNodes()
      .skipUntil(text => text.key == key)
      .take(2)
      .last()
  },

  /**
   * Get the offset for a child text node by `key`.
   *
   * @param {String or Node} key
   * @return {Number} offset
   */

  getOffset(key) {
    this.assertHasDeep(key)
    const match = this.getDeep(key)

    // Find the shallow matching child.
    const child = this.nodes.find((node) => {
      if (node == match) return true
      return node.kind == 'text'
        ? false
        : node.hasDeep(match)
    })

    // Get all of the nodes that come before the matching child.
    const befores = this.nodes.takeUntil(node => node.key == child.key)

    // Calculate the offset of the nodes before the matching child.
    const offset = befores.reduce((offset, child) => {
      return offset + child.length
    }, 0)

    // If the child's parent is this node, return the offset of all of the nodes
    // before it, otherwise recurse.
    return this.nodes.has(match.key)
      ? offset
      : offset + child.getOffset(key)
  },

  /**
   * Get the parent of a child node by `key`.
   *
   * @param {String or Node} key
   * @return {Node or Null}
   */

  getParent(key) {
    key = normalizeKey(key)

    if (this.nodes.get(key)) return this

    let node = null
    this.nodes.forEach((child) => {
      if (child.kind == 'text') return
      const match = child.getParent(key)
      if (match) node = match
    })

    return node
  },

  /**
   * Get the child node before the one by `key`.
   *
   * @param {String or Node} key
   * @return {Node or Null}
   */

  getPreviousSibling(key) {
    key = normalizeKey(key)

    if (this.nodes.has(key)) {
      return this.nodes
        .takeUntil(node => node.key == key)
        .last()
    }

    return this.nodes
      .map(node => node.kind == 'text' ? null : node.getPreviousSibling(key))
      .filter(node => node)
      .first()
  },

  /**
   * Get the text node before a text node by `key`.
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
   * Get the child text node at an `offset`.
   *
   * @param {String} offset
   * @return {Node or Null}
   */

  getTextAtOffset(offset) {
    let length = 0
    let texts = this.getTextNodes()
    let match = texts.find((node) => {
      length += node.length
      return length >= offset
    })

    return match
  },

  /**
   * Recursively get all of the child text nodes in order of appearance.
   *
   * @return {OrderedMap} nodes
   */

  getTextNodes() {
    return this.nodes.reduce((texts, node) => {
      return node.kind == 'text'
        ? texts.set(node.key, node)
        : texts.concat(node.getTextNodes())
    }, new OrderedMap())
  },

  /**
   * Get all of the text nodes in a `range`.
   *
   * @param {Selection} range
   * @return {OrderedMap} nodes
   */

  getTextNodesAtRange(range) {
    range = range.normalize(this)
    const { startKey, endKey } = range

    // If the selection is unset, return an empty map.
    if (range.isUnset) return new OrderedMap()

    // Assert that the nodes exist before searching.
    this.assertHasDeep(startKey)
    this.assertHasDeep(endKey)

    // Return the text nodes after the start offset and before the end offset.
    const texts = this.getTextNodes()
    const endNode = this.getDeep(endKey)
    const afterStart = texts.skipUntil(node => node.key == startKey)
    const upToEnd = afterStart.takeUntil(node => node.key == endKey)
    const matches = upToEnd.set(endNode.key, endNode)
    return matches
  },

  /**
   * Recursively check if a child node exists by `key`.
   *
   * @param {String or Node} key
   * @return {Boolean} true
   */

  hasDeep(key) {
    key = normalizeKey(key)
    return !! this.nodes.find((node) => {
      return node.kind == 'text'
        ? node.key == key
        : node.key == key || node.hasDeep(key)
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
    let startNode = node.getDeep(startKey)
    let { characters } = startNode

    // Create a list of the new characters, with the marks from the previous
    // character if one exists.
    const prev = characters.get(startOffset - 1)
    const marks = prev ? prev.marks : null
    const newChars = Character.createList(
      text.split('').map((char) => {
        const obj = { text: char }
        if (marks) obj.marks = marks
        return Character.create(obj)
      })
    )

    // Splice in the new characters.
    characters = characters.slice(0, startOffset)
      .concat(newChars)
      .concat(characters.slice(startOffset))

    // Update the existing text node.
    startNode = startNode.merge({ characters })
    node = node.updateDeep(startNode)

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
    let texts = node.getTextNodesAtRange(range)

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
      node = node.updateDeep(text)
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
    let firstAdjacent = node.findDeep((child) => {
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
    parent = parent.updateDeep(firstAdjacent)

    // Then remove the second node.
    parent = parent.removeDeep(second)

    // If the parent isn't this node, it needs to be updated.
    if (parent != node) {
      node = node.updateDeep(parent)
    } else {
      node = parent
    }

    // Recurse by normalizing again.
    return node.normalize()
  },

  /**
   * Push a new `node` onto the map of nodes.
   *
   * @param {String or Node} key
   * @param {Node} node (optional)
   * @return {Node} node
   */

  pushNode(key, node) {
    if (arguments.length == 1) {
      node = key
      key = normalizeKey(key)
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

  removeDeep(key) {
    key = normalizeKey(key)

    let nodes = this.nodes.remove(key)
    return this.merge({ nodes })
  },

  /**
   * Set the block nodes in a range to `type`, with optional `data`.
   *
   * @param {Selection} range
   * @param {String} type
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

    // If data is passed, ensure it's immutable.
    if (data) data = Data.create(data)

    // Update each of the blocks.
    const blocks = node.getBlocksAtRange(range)
    blocks.forEach((block) => {
      const obj = {}
      if (type) obj.type = type
      if (data) obj.data = data
      block = block.merge(obj)
      node = node.updateDeep(block)
    })

    return node
  },

  /**
   * Set the inline nodes in a range to `type`, with optional `data`.
   *
   * @param {Selection} range
   * @param {String} type
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

    // If data is passed, ensure it's immutable.
    if (data) data = Data.create(data)

    // Update each of the inlines.
    const inlines = node.getInlinesAtRange(range)
    inlines.forEach((inline) => {
      const obj = {}
      if (type) obj.type = type
      if (data) obj.data = data
      inline = inline.merge(obj)
      node = node.updateDeep(inline)
    })

    return node
  },

  /**
   * Split the block nodes at a `range`.
   *
   * @param {Selection} range
   * @return {Node} node
   */

  splitBlockAtRange(range) {
    let node = this
    range = range.normalize(node)

    // If the range is expanded, remove it first.
    if (range.isExpanded) {
      node = node.deleteAtRange(range)
      range = range.moveToStart()
    }

    const { startKey, startOffset } = range
    const startNode = node.getDeep(startKey)

    // Split the text node's characters.
    const { characters, length } = startNode
    const firstCharacters = characters.take(startOffset)
    const secondCharacters = characters.takeLast(length - startOffset)

    // Create a new first element with only the first set of characters.
    const parent = node.getParent(startNode)
    const firstText = startNode.set('characters', firstCharacters)
    const firstElement = parent.updateDeep(firstText)

    // Create a brand new second element with the second set of characters.
    let secondText = Text.create({})
    let secondElement = Block.create({
      type: firstElement.type,
      data: firstElement.data
    })

    secondText = secondText.set('characters', secondCharacters)
    secondElement = secondElement.merge({
      nodes: secondElement.nodes.set(secondText.key, secondText)
    });

    // Replace the old parent node in the grandparent with the two new ones.
    let grandparent = node.getParent(parent)
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
      node = node.updateDeep(grandparent)
    }

    // Normalize the node.
    return node.normalize()
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
    let texts = node.getTextNodesAtRange(range)

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
      node = node.updateDeep(text)
    })

    return node
  },

  /**
   * Set a new value for a child node by `key`.
   *
   * @param {String or Node} key
   * @param {Node} node (optional)
   * @return {Node} node
   */

  updateDeep(key, node) {
    if (arguments.length == 1) {
      node = key
      key = normalizeKey(key)
    }

    if (this.nodes.get(key)) {
      const nodes = this.nodes.set(key, node)
      return this.set('nodes', nodes)
    }

    const nodes = this.nodes.map((child) => {
      return child.kind == 'text' ? child : child.updateDeep(key, node)
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
      siblings = siblings.set(sibling.key, sibling)
      return siblings
    }, new OrderedMap())

    // Wrap the siblings in a new block.
    const wrapper = Block.create({
      nodes: siblings,
      type,
      data
    })

    // Replace the siblings with the wrapper.
    const isDirectChild = node.nodes.has(highest.key)
    let parent = isDirectChild ? node : node.getParent(highest)
    const nodes = parent.nodes
      .takeUntil(node => node == highest)
      .set(wrapper.key, wrapper)
      .concat(parent.nodes.skipUntil(node => node == highest).rest())

    // Update the parent.
    if (isDirectChild) {
      node = node.merge({ nodes })
    } else {
      parent = parent.merge({ nodes })
      node = node.updateDeep(parent)
    }

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
    const blocks = node.getBlocksAtRange(range)

    // Allow for only data.
    if (typeof type == 'object') {
      data = type
      type = null
    }

    // Ensure that data is immutable.
    if (data) data = Data.create(data)

    // Find the closest wrappers of each block.
    const wrappers = blocks.reduce((wrappers, block) => {
      const match = node.getClosest(block, (parent) => {
        if (type && parent.type != type) return false
        if (data && !parent.data.isSuperset(data)) return false
        return true
      })

      if (match) wrappers = wrappers.set(match.key, match)
      return wrappers
    }, new OrderedMap())

    // Replace each of the wrappers with their child nodes.
    wrappers.forEach((wrapper) => {
      const isDirectChild = node.nodes.has(wrapper.key)
      let parent = isDirectChild ? node : node.getParent(wrapper)

      // Replace the wrapper in the parent's nodes with the block.
      const nodes = parent.nodes.takeUntil(n => n == wrapper)
        .concat(wrapper.nodes)
        .concat(parent.nodes.skipUntil(n => n == wrapper).rest())

      // Update the parent.
      if (isDirectChild) {
        node = node.merge({ nodes })
      } else {
        parent = parent.merge({ nodes })
        node = node.updateDeep(parent)
      }
    })

    return node.normalize()
  },



  getClosestInline(child) {
    return this.getClosest(child, p => p.kind == 'inline')
  },

  getFurthestInline(child) {
    let furthest = null
    let next

    while (next = this.getClosestInline(child)) {
      furthest = next
      child = next
    }

    return furthest
  },

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
    const text = node.getDeep(startKey)
    const { characters } = text
    const firstChars = characters.take(startOffset)
    const secondChars = characters.skip(startOffset)
    let firstChild = text.merge({ characters: firstChars })
    let secondChild = Text.create({ characters: secondChars })

    // Split the text nodes.
    let parent = node.getParent(text)
    const nodes = parent.nodes
      .takeUntil(c => c.key == firstChild.key)
      .set(firstChild.key, firstChild)
      .set(secondChild.key, secondChild)
      .concat(parent.nodes.skipUntil(n => n.key == firstChild.key).rest())

    // Update the nodes.
    parent = parent.merge({ nodes })
    node = node.updateDeep(parent)
    return node
  },

  splitInlineAtRange(range) {
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
    let firstChild = node.getDeep(range.startKey)
    let secondChild = node.getNextText(firstChild)
    let parent

    // While the parent is an inline parent, split the inline nodes.
    while (parent = node.getClosestInline(firstChild)) {
      const firstNodes = Inline.createMap([firstChild])
      const secondNodes = Inline.createMap([secondChild])
      firstChild = parent.merge({ nodes: firstNodes })
      secondChild = Inline.create({
        nodes: secondNodes,
        type: parent.type,
        data: parent.data
      })

      // Split the children.
      const isGrandparent = node.nodes.has(parent.key)
      const grandparent = isGrandparent ? node : node.getParent(parent)
      const nodes = grandparent.nodes
        .takeUntil(c => c.key == firstChild.key)
        .set(firstChild.key, firstChild)
        .set(secondChild.key, secondChild)
        .concat(parent.nodes.skipUntil(n => n.key == firstChild.key).rest())

      // Update the parent.
      node = isGrandparent
        ? node.merge({ nodes })
        : node.updateDeep(parent.merge({ nodes }))
    }

    return node
  },

  wrapInlineAtRange(range, type, data = new Map()) {
    range = range.normalize(this)

    const Inline = require('./inline').default
    let node = this
    let blocks = node.getBlocksAtRange(range)

    // If collapsed or unset, there's nothing to wrap.
    if (range.isCollapsed || range.isUnset) return node

    // Split at the start of the range.
    const start = range.moveToStart()
    node = node.splitInlineAtRange(start)

    // Split at the end of the range.
    let { startKey, startOffset, endKey, endOffset } = range
    let firstNode = node.getDeep(startKey)
    let nextNode = node.getNextText(startKey)

    const end = Selection.create({
      anchorKey: nextNode.key,
      anchorOffset: firstNode.length - startOffset,
      focusKey: endKey,
      focusOffset: endOffset
    })

    node = node.splitInlineAtRange(end)

    // Update the range...
    startKey = range.startKey
    endKey = range.endKey
    startNode = node.getNextText(startKey)
    startOffset = 0
    let endNode = startKey == endKey ? startNode : node.getDeep(endKey)
    endOffset = endNode.length

    range = Selection.create({
      anchorKey: startKey,
      anchorOffset: startOffset,
      focusKey: endKey,
      focusOffset: endOffset
    })

    // Get the furthest inline nodes in the range.
    const texts = node.getTextNodesAtRange(range)
    const children = texts.map(text => node.getFurthestInline(text) || text)

    // Iterate each of the child nodes, wrapping them.
    children.forEach((child) => {
      let isDirectChild = node.nodes.has(child.key)
      let parent = isDirectChild ? node : node.getParent(child)

      // Create a new wrapper containing the child.
      let nodes = Inline.createMap([child])
      let wrapper = Inline.create({ nodes, type, data })

      // Replace the child in it's parent with the wrapper.
      nodes = parent.nodes.takeUntil(n => n == child)
        .set(wrapper.key, wrapper)
        .concat(parent.nodes.skipUntil(n => n == child).rest())

      // Update the parent.
      node = isDirectChild
        ? node.merge({ nodes })
        : node.updateDeep(parent.merge({ nodes }))
    })

    return node
  },

  /**
   * Unwrap all of the block nodes in a `range` from a parent node of `type.`
   *
   * @param {Selection} range
   * @param {String} type
   * @return {Node} node
   */

  unwrapInlineAtRange(range, type) {
    range = range.normalize(this)
    let node = this
    let blocks = node.getInlinesAtRange(range)

    // Iterate each of the block nodes, unwrapping them.
    blocks.forEach((block) => {
      let wrapper = node.getParent(block)
      while (wrapper && wrapper.type != type) {
        wrapper = node.getParent(wrapper)
      }

      // If no wrapper was found, do skip this block.
      if (!wrapper) return

      // Take the child nodes of the wrapper, and move them to the block.
      const isDirectChild = node.nodes.has(wrapper.key)
      let parent = isDirectChild ? node : node.getParent(wrapper)

      // Replace the wrapper in the parent's nodes with the block.
      const nodes = parent.nodes.takeUntil(node => node == wrapper)
        .set(block.key, block)
        .concat(parent.nodes.skipUntil(node => node == wrapper).rest())

      // Update the parent.
      if (isDirectChild) {
        node = node.merge({ nodes })
      } else {
        parent = parent.merge({ nodes })
        node = node.updateDeep(parent)
      }
    })

    return node.normalize()
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
