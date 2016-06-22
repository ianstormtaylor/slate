
import Block from './block'
import Character from './character'
import Mark from './mark'
import Selection from './selection'
import Text from './text'
import { List, OrderedMap, OrderedSet, Set } from 'immutable'

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

  assertHasNode(key) {
    if (!this.hasNode(key)) throw new Error('Could not find that child node.')
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
    node.assertHasNode(startKey)
    node.assertHasNode(endKey)

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
    range = range.normalize(node)

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
    range = range.normalize(node)

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
      .map(node => node.kind == 'text' ? null : node.findNode(iterator))
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
      .map(node => node.kind == 'text' ? null : node.filterNodes(iterator))
      .filter(node => node)
      .reduce((all, map) => {
        return all.concat(map)
      }, shallow)

    return deep
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
   * Get the first text child node.
   *
   * @return {Text or Null} text
   */

  getFirstTextNode() {
    return this.findNode(node => node.kind == 'text') || null
  },

  /**
   * Get the last text child node.
   *
   * @return {Text or Null} text
   */

  getLastTextNode() {
    const texts = this.filterNodes(node => node.kind == 'text')
    return texts.last() || null
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
      const previous = this.getPreviousTextNode(startKey)
      if (!previous) return new Set()
      const char = text.characters.get(previous.length - 1)
      return char.marks
    }

    // If the range is collapsed, check the character before the start.
    if (range.isCollapsed) {
      const text = this.getNode(startKey)
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
   * Get a child node by `key`.
   *
   * @param {String} key
   * @return {Node or Null}
   */

  getNode(key) {
    key = normalizeKey(key)
    return this.findNode(node => node.key == key) || null
  },

  /**
   * Get the child text node at an `offset`.
   *
   * @param {String or Node} key
   * @return {Number} offset
   */

  getNodeOffset(key) {
    this.assertHasNode(key)
    const match = this.getNode(key)

    // Get all of the nodes that come before the matching child.
    const child = this.nodes.find((node) => {
      if (node == match) return true
      return node.kind == 'text'
        ? false
        : node.hasNode(match)
    })

    const befores = this.nodes.takeUntil(node => node.key == child.key)

    // Calculate the offset of the nodes before the matching child.
    const offset = befores.reduce((offset, child) => {
      return offset + child.length
    }, 0)

    // If the child's parent is this node, return the offset of all of the nodes
    // before it, otherwise recurse.
    return this.nodes.has(match.key)
      ? offset
      : offset + child.getNodeOffset(key)
  },

  /**
   * Get the child node after the one by `key`.
   *
   * @param {String or Node} key
   * @return {Node or Null}
   */

  getNextNode(key) {
    key = normalizeKey(key)

    const shallow = this.nodes
      .skipUntil(node => node.key == key)
      .rest()
      .first()

    if (shallow != null) return shallow

    return this.nodes
      .map(node => node.kind == 'text' ? null : node.getNextNode(key))
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
    key = normalizeKey(key)

    const matches = this.nodes.get(key)

    if (matches) {
      return this.nodes
        .takeUntil(node => node.key == key)
        .last()
    }

    return this.nodes
      .map(node => node.kind == 'text' ? null : node.getPreviousNode(key))
      .filter(node => node)
      .first()
  },

  /**
   * Get the previous text node by `key`.
   *
   * @param {String or Node} key
   * @return {Node or Null}
   */

  getPreviousTextNode(key) {
    key = normalizeKey(key)

    // Create a new selection starting at the first text node.
    const first = this.findNode(node => node.kind == 'text')
    const range = Selection.create({
      anchorKey: first.key,
      anchorOffset: 0,
      focusKey: key,
      focusOffset: 0
    })

    const texts = this.getTextNodesAtRange(range)
    const previous = texts.get(texts.size - 2)
    return previous
  },

  /**
   * Get the parent of a child node by `key`.
   *
   * @param {String or Node} key
   * @return {Node or Null}
   */

  getParentNode(key) {
    key = normalizeKey(key)

    if (this.nodes.get(key)) return this
    let node = null

    this.nodes.forEach((child) => {
      if (child.kind == 'text') return
      const match = child.getParentNode(key)
      if (match) node = match
    })

    return node
  },

  /**
   * Get the child text node at an `offset`.
   *
   * @param {String} offset
   * @return {Node or Null}
   */

  getTextNodeAtOffset(offset) {
    let length = 0
    let texts = this.filterNodes(node => node.kind == 'text')
    let match = texts.find((node) => {
      length += node.length
      return length >= offset
    })

    return match
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

    // If the selection isn't formed, return an empty map.
    if (startKey == null || endKey == null) return new OrderedMap()

    // Assert that the nodes exist before searching.
    this.assertHasNode(startKey)
    this.assertHasNode(endKey)

    // Return the text nodes after the start offset and before the end offset.
    const endNode = this.getNode(endKey)
    const texts = this.filterNodes(node => node.kind == 'text')
    const afterStart = texts.skipUntil(node => node.key == startKey)
    const upToEnd = afterStart.takeUntil(node => node.key == endKey)
    let matches = upToEnd.set(endNode.key, endNode)
    return matches
  },

  /**
   * Get the closets block nodes for each text node in a `range`.
   *
   * @param {Selection} range
   * @return {OrderedMap} nodes
   */

  getBlockNodesAtRange(range) {
    const node = this
    range = range.normalize(node)
    const texts = node.getTextNodesAtRange(range)
    const blocks = texts.map(text => node.getClosestBlockNode(text))
    return blocks
  },

  /**
   * Get the node's closest block parent node.
   *
   * @param {Node} node
   * @return {Node} node
   */

  getClosestBlockNode(node) {
    let parent = this.getParentNode(node)

    while (parent && parent.kind != 'block') {
      parent = this.getParentNode(parent)
    }

    return parent
  },

  /**
   * Get the node's closest inline parent node.
   *
   * @return {Node} node
   */

  getClosestInlineNode() {
    let parent = this.getParentNode(node)

    while (parent && parent.kind != 'inline') {
      parent = this.getParentNode(parent)
    }

    return parent
  },

  /**
   * Recursively check if a child node exists by `key`.
   *
   * @param {String or Node} key
   * @return {Boolean} true
   */

  hasNode(key) {
    key = normalizeKey(key)
    return !! this.nodes.find((node) => {
      return node.kind == 'text'
        ? node.key == key
        : node.key == key || node.hasNode(key)
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
    let startNode = node.getNode(startKey)
    let { characters } = startNode

    // Create a list of the new characters, with the marks from the previous
    // character if one exists.
    const prevOffset = startOffset - 1
    const marks = characters.has(prevOffset)
      ? characters.get(prevOffset).marks
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
      node = node.updateNode(text)
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
    let firstAdjacent = node.findNode((child) => {
      if (child.kind != 'text') return
      const parent = node.getParentNode(child)
      const next = parent.getNextNode(child)
      return next && next.kind == 'text'
    })

    // If no text nodes are adjacent, abort.
    if (!firstAdjacent) return node

    // Fix an adjacent text node if one exists.
    let parent = node.getParentNode(firstAdjacent)
    const second = parent.getNextNode(firstAdjacent)
    const characters = firstAdjacent.characters.concat(second.characters)
    firstAdjacent = firstAdjacent.merge({ characters })
    parent = parent.updateNode(firstAdjacent)

    // Then remove the second node.
    parent = parent.removeNode(second)

    // If the parent isn't this node, it needs to be updated.
    if (parent != node) {
      node = node.updateNode(parent)
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

  removeNode(key) {
    key = normalizeKey(key)

    let nodes = this.nodes.remove(key)
    return this.merge({ nodes })
  },

  /**
   * Set the direct parent of text nodes in a range to `type`.
   *
   * @param {Selection} range
   * @return {Node} node
   */

  setTypeAtRange(range, type) {
    let node = this
    range = range.normalize(node)

    const texts = node.getTextNodesAtRange(range)
    let parents = new OrderedSet()

    // Find the direct parent of each text node.
    texts.forEach((text) => {
      const parent = node.has(text.key) ? node : node.getParentNode(text)
      parents = parents.add(parent)
    })

    // Set the new type for each parent.
    parents = parents.forEach((parent) => {
      if (parent == node) {
        node = node.merge({ type })
      } else {
        parent = parent.merge({ type })
        node = node.updateNode(parent)
      }
    })

    return node
  },

  /**
   * Split the nodes at a `range`.
   *
   * @param {Selection} range
   * @return {Node} node
   */

  splitAtRange(range) {
    let node = this
    range = range.normalize(node)

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
    let secondElement = Block.create({
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
      node = node.updateNode(text)
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

  updateNode(key, node) {
    if (arguments.length == 1) {
      node = key
      key = normalizeKey(key)
    }

    if (this.nodes.get(key)) {
      const nodes = this.nodes.set(key, node)
      return this.set('nodes', nodes)
    }

    const nodes = this.nodes.map((child) => {
      return child.kind == 'text' ? child : child.updateNode(key, node)
    })

    return this.merge({ nodes })
  },

  /**
   * Wrap all of the nodes in a `range` in a new parent node of `type`.
   *
   * @param {Selection} range
   * @param {String} type
   * @return {Node} node
   */

  wrapAtRange(range, type) {
    range = range.normalize(this)
    let node = this
    let blocks = node.getBlockNodesAtRange(range)

    // Iterate each of the block nodes, wrapping them.
    blocks.forEach((block) => {
      let isDirectChild = node.nodes.has(block.key)
      let parent = isDirectChild ? node : node.getParentNode(block)

      // Create a new wrapper containing the block.
      let nodes = Block.createMap([ block ])
      let wrapper = Block.create({ type, nodes })

      // Replace the block in it's parent with the wrapper.
      nodes = parent.nodes.takeUntil(node => node == block)
        .set(wrapper.key, wrapper)
        .concat(parent.nodes.skipUntil(node => node == block).rest())

      // Update the parent.
      if (isDirectChild) {
        node = node.merge({ nodes })
      } else {
        parent = parent.merge({ nodes })
        node = node.updateNode(parent)
      }
    })

    return node.normalize()
  },

  /**
   * Unwrap all of the block nodes in a `range` from a parent node of `type.`
   *
   * @param {Selection} range
   * @param {String} type
   * @return {Node} node
   */

  unwrapAtRange(range, type) {
    range = range.normalize(this)
    let node = this
    let blocks = node.getBlockNodesAtRange(range)

    // Iterate each of the block nodes, unwrapping them.
    blocks.forEach((block) => {
      let wrapper = node.getParentNode(block)
      while (wrapper && wrapper.type != type) {
        wrapper = node.getParentNode(wrapper)
      }

      // If no wrapper was found, do skip this block.
      if (!wrapper) return

      // Take the child nodes of the wrapper, and move them to the block.
      const isDirectChild = node.nodes.has(wrapper.key)
      let parent = isDirectChild ? node : node.getParentNode(wrapper)

      // Replace the wrapper in the parent's nodes with the block.
      const nodes = parent.nodes.takeUntil(node => node == wrapper)
        .set(block.key, block)
        .concat(parent.nodes.skipUntil(node => node == wrapper).rest())

      // Update the parent.
      if (isDirectChild) {
        node = node.merge({ nodes })
      } else {
        parent = parent.merge({ nodes })
        node = node.updateNode(parent)
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
