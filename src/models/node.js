
import Block from './block'
import Document from './document'
import Inline from './inline'
import Normalize from '../utils/normalize'
import Text from './text'
import direction from 'direction'
import generateKey from '../utils/generate-key'
import isInRange from '../utils/is-in-range'
import logger from '../utils/logger'
import memoize from '../utils/memoize'
import { List, OrderedSet, Set } from 'immutable'

/**
 * Node.
 *
 * And interface that `Document`, `Block` and `Inline` all implement, to make
 * working with the recursive node tree easier.
 *
 * @type {Node}
 */

class Node {

  /**
   * Create a new `Node` with `attrs`.
   *
   * @param {Object|Node} attrs
   * @return {Node}
   */

  static create(attrs = {}) {
    if (Block.isBlock(attrs)) return attrs
    if (Document.isDocument(attrs)) return attrs
    if (Inline.isInline(attrs)) return attrs
    if (Text.isText(attrs)) return attrs

    switch (attrs.kind) {
      case 'block': return Block.create(attrs)
      case 'document': return Document.create(attrs)
      case 'inline': return Inline.create(attrs)
      case 'text': return Text.create(attrs)
      default: {
        throw new Error(`You must pass a \`kind\` attribute to create a \`Node\`.`)
      }
    }
  }

  /**
   * Create a list of `Nodes` from an array.
   *
   * @param {Array<Object|Node>} elements
   * @return {List<Node>}
   */

  static createList(elements = []) {
    if (List.isList(elements)) {
      return elements
    }

    if (Array.isArray(elements)) {
      const list = new List(elements.map(Node.create))
      return list
    }

    throw new Error(`Node.createList() must be passed an \`Array\` or a \`List\`. You passed: ${elements}`)
  }

  /**
   * Check if a `value` is a `Node`.
   *
   * @param {Any} value
   * @return {Boolean}
   */

  static isNode(value) {
    return (
      Block.isBlock(value) ||
      Document.isDocument(value) ||
      Inline.isInline(value) ||
      Text.isText(value)
    )
  }

  /**
   * True if the node has both descendants in that order, false otherwise. The
   * order is depth-first, post-order.
   *
   * @param {String} first
   * @param {String} second
   * @return {Boolean}
   */

  areDescendantsSorted(first, second) {
    first = Normalize.key(first)
    second = Normalize.key(second)

    let sorted

    this.forEachDescendant((n) => {
      if (n.key === first) {
        sorted = true
        return false
      } else if (n.key === second) {
        sorted = false
        return false
      }
    })

    return sorted
  }

  /**
   * Assert that a node has a child by `key` and return it.
   *
   * @param {String} key
   * @return {Node}
   */

  assertChild(key) {
    const child = this.getChild(key)

    if (!child) {
      key = Normalize.key(key)
      throw new Error(`Could not find a child node with key "${key}".`)
    }

    return child
  }

  /**
   * Assert that a node has a descendant by `key` and return it.
   *
   * @param {String} key
   * @return {Node}
   */

  assertDescendant(key) {
    const descendant = this.getDescendant(key)

    if (!descendant) {
      key = Normalize.key(key)
      throw new Error(`Could not find a descendant node with key "${key}".`)
    }

    return descendant
  }

  /**
   * Assert that a node's tree has a node by `key` and return it.
   *
   * @param {String} key
   * @return {Node}
   */

  assertNode(key) {
    const node = this.getNode(key)

    if (!node) {
      key = Normalize.key(key)
      throw new Error(`Could not find a node with key "${key}".`)
    }

    return node
  }

  /**
   * Assert that a node exists at `path` and return it.
   *
   * @param {Array} path
   * @return {Node}
   */

  assertPath(path) {
    const descendant = this.getDescendantAtPath(path)

    if (!descendant) {
      throw new Error(`Could not find a descendant at path "${path}".`)
    }

    return descendant
  }

  /**
   * Recursively filter all descendant nodes with `iterator`.
   *
   * @param {Function} iterator
   * @return {List<Node>}
   */

  filterDescendants(iterator) {
    const matches = []

    this.forEachDescendant((node, i, nodes) => {
      if (iterator(node, i, nodes)) matches.push(node)
    })

    return List(matches)
  }

  /**
   * Recursively find all descendant nodes by `iterator`.
   *
   * @param {Function} iterator
   * @return {Node|Null}
   */

  findDescendant(iterator) {
    let found = null

    this.forEachDescendant((node, i, nodes) => {
      if (iterator(node, i, nodes)) {
        found = node
        return false
      }
    })

    return found
  }

  /**
   * Recursively iterate over all descendant nodes with `iterator`. If the
   * iterator returns false it will break the loop.
   *
   * @param {Function} iterator
   */

  forEachDescendant(iterator) {
    let ret

    this.nodes.forEach((child, i, nodes) => {
      if (iterator(child, i, nodes) === false) {
        ret = false
        return false
      }

      if (child.kind != 'text') {
        ret = child.forEachDescendant(iterator)
        return ret
      }
    })

    return ret
  }

  /**
   * Get the path of ancestors of a descendant node by `key`.
   *
   * @param {String|Node} key
   * @return {List<Node>|Null}
   */

  getAncestors(key) {
    key = Normalize.key(key)

    if (key == this.key) return List()
    if (this.hasChild(key)) return List([this])

    let ancestors
    this.nodes.find((node) => {
      if (node.kind == 'text') return false
      ancestors = node.getAncestors(key)
      return ancestors
    })

    if (ancestors) {
      return ancestors.unshift(this)
    } else {
      return null
    }
  }

  /**
   * Get the leaf block descendants of the node.
   *
   * @return {List<Node>}
   */

  getBlocks() {
    const array = this.getBlocksAsArray()
    return new List(array)
  }

  /**
   * Get the leaf block descendants of the node.
   *
   * @return {List<Node>}
   */

  getBlocksAsArray() {
    return this.nodes.reduce((array, child) => {
      if (child.kind != 'block') return array
      if (!child.isLeafBlock()) return array.concat(child.getBlocksAsArray())
      array.push(child)
      return array
    }, [])
  }

  /**
   * Get the leaf block descendants in a `range`.
   *
   * @param {Selection} range
   * @return {List<Node>}
   */

  getBlocksAtRange(range) {
    const array = this.getBlocksAtRangeAsArray(range)
    // Eliminate duplicates by converting to an `OrderedSet` first.
    return new List(new OrderedSet(array))
  }

  /**
   * Get the leaf block descendants in a `range` as an array
   *
   * @param {Selection} range
   * @return {Array}
   */

  getBlocksAtRangeAsArray(range) {
    range = range.normalize(this)
    const { startKey, endKey } = range
    const startBlock = this.getClosestBlock(startKey)

    // PERF: the most common case is when the range is in a single block node,
    // where we can avoid a lot of iterating of the tree.
    if (startKey == endKey) return [startBlock]

    const endBlock = this.getClosestBlock(endKey)
    const blocks = this.getBlocksAsArray()
    const start = blocks.indexOf(startBlock)
    const end = blocks.indexOf(endBlock)
    return blocks.slice(start, end + 1)
  }

  /**
   * Get all of the leaf blocks that match a `type`.
   *
   * @param {String} type
   * @return {List<Node>}
   */

  getBlocksByType(type) {
    const array = this.getBlocksByTypeAsArray(type)
    return new List(array)
  }

  /**
   * Get all of the leaf blocks that match a `type` as an array
   *
   * @param {String} type
   * @return {Array}
   */

  getBlocksByTypeAsArray(type) {
    return this.nodes.reduce((array, node) => {
      if (node.kind != 'block') {
        return array
      } else if (node.isLeafBlock() && node.type == type) {
        array.push(node)
        return array
      } else {
        return array.concat(node.getBlocksByTypeAsArray(type))
      }
    }, [])
  }

  /**
   * Get all of the characters for every text node.
   *
   * @return {List<Character>}
   */

  getCharacters() {
    const array = this.getCharactersAsArray()
    return new List(array)
  }

  /**
   * Get all of the characters for every text node as an array
   *
   * @return {Array}
   */

  getCharactersAsArray() {
    return this.nodes.reduce((arr, node) => {
      return node.kind == 'text'
        ? arr.concat(node.characters.toArray())
        : arr.concat(node.getCharactersAsArray())
    }, [])
  }

  /**
   * Get a list of the characters in a `range`.
   *
   * @param {Selection} range
   * @return {List<Character>}
   */

  getCharactersAtRange(range) {
    const array = this.getCharactersAtRangeAsArray(range)
    return new List(array)
  }

  /**
   * Get a list of the characters in a `range` as an array.
   *
   * @param {Selection} range
   * @return {Array}
   */

  getCharactersAtRangeAsArray(range) {
    return this
      .getTextsAtRange(range)
      .reduce((arr, text) => {
        const chars = text.characters
          .filter((char, i) => isInRange(i, text, range))
          .toArray()

        return arr.concat(chars)
      }, [])
  }

  /**
   * Get a child node by `key`.
   *
   * @param {String} key
   * @return {Node|Null}
   */

  getChild(key) {
    key = Normalize.key(key)
    return this.nodes.find(node => node.key == key)
  }

  /**
   * Get closest parent of node by `key` that matches `iterator`.
   *
   * @param {String} key
   * @param {Function} iterator
   * @return {Node|Null}
   */

  getClosest(key, iterator) {
    key = Normalize.key(key)
    const ancestors = this.getAncestors(key)
    if (!ancestors) {
      throw new Error(`Could not find a descendant node with key "${key}".`)
    }

    // Exclude this node itself.
    return ancestors.rest().findLast(iterator)
  }

  /**
   * Get the closest block parent of a `node`.
   *
   * @param {String} key
   * @return {Node|Null}
   */

  getClosestBlock(key) {
    return this.getClosest(key, parent => parent.kind == 'block')
  }

  /**
   * Get the closest inline parent of a `node`.
   *
   * @param {String} key
   * @return {Node|Null}
   */

  getClosestInline(key) {
    return this.getClosest(key, parent => parent.kind == 'inline')
  }

  /**
   * Get the closest void parent of a `node`.
   *
   * @param {String} key
   * @return {Node|Null}
   */

  getClosestVoid(key) {
    return this.getClosest(key, parent => parent.isVoid)
  }

  /**
   * Get the common ancestor of nodes `one` and `two` by keys.
   *
   * @param {String} one
   * @param {String} two
   * @return {Node}
   */

  getCommonAncestor(one, two) {
    one = Normalize.key(one)
    two = Normalize.key(two)

    if (one == this.key) return this
    if (two == this.key) return this

    this.assertDescendant(one)
    this.assertDescendant(two)
    let ancestors = new List()
    let oneParent = this.getParent(one)
    let twoParent = this.getParent(two)

    while (oneParent) {
      ancestors = ancestors.push(oneParent)
      oneParent = this.getParent(oneParent.key)
    }

    while (twoParent) {
      if (ancestors.includes(twoParent)) return twoParent
      twoParent = this.getParent(twoParent.key)
    }
  }

  /**
   * Get the component for the node from a `schema`.
   *
   * @param {Schema} schema
   * @return {Component|Void}
   */

  getComponent(schema) {
    return schema.__getComponent(this)
  }

  /**
   * Get the decorations for the node from a `schema`.
   *
   * @param {Schema} schema
   * @return {Array}
   */

  getDecorators(schema) {
    return schema.__getDecorators(this)
  }

  /**
   * Get the depth of a child node by `key`, with optional `startAt`.
   *
   * @param {String} key
   * @param {Number} startAt (optional)
   * @return {Number} depth
   */

  getDepth(key, startAt = 1) {
    this.assertDescendant(key)
    if (this.hasChild(key)) return startAt
    return this
      .getFurthestAncestor(key)
      .getDepth(key, startAt + 1)
  }

  /**
   * Get a descendant node by `key`.
   *
   * @param {String} key
   * @return {Node|Null}
   */

  getDescendant(key) {
    key = Normalize.key(key)
    let descendantFound = null

    const found = this.nodes.find((node) => {
      if (node.key === key) {
        return node
      } else if (node.kind !== 'text') {
        descendantFound = node.getDescendant(key)
        return descendantFound
      } else {
        return false
      }
    })

    return descendantFound || found
  }

  /**
   * Get a descendant by `path`.
   *
   * @param {Array} path
   * @return {Node|Null}
   */

  getDescendantAtPath(path) {
    let descendant = this

    for (let i = 0; i < path.length; i++) {
      const index = path[i]
      if (!descendant) return
      if (!descendant.nodes) return
      descendant = descendant.nodes.get(index)
    }

    return descendant
  }

  /**
   * Get the decorators for a descendant by `key` given a `schema`.
   *
   * @param {String} key
   * @param {Schema} schema
   * @return {Array}
   */

  getDescendantDecorators(key, schema) {
    if (!schema.hasDecorators) {
      return []
    }

    const descendant = this.assertDescendant(key)
    let child = this.getFurthestAncestor(key)
    let decorators = []

    while (child != descendant) {
      decorators = decorators.concat(child.getDecorators(schema))
      child = child.getFurthestAncestor(key)
    }

    decorators = decorators.concat(descendant.getDecorators(schema))
    return decorators
  }

  /**
   * Get the first child text node.
   *
   * @return {Node|Null}
   */

  getFirstText() {
    let descendantFound = null

    const found = this.nodes.find((node) => {
      if (node.kind == 'text') return true
      descendantFound = node.getFirstText()
      return descendantFound
    })

    return descendantFound || found
  }

  /**
   * Get a fragment of the node at a `range`.
   *
   * @param {Selection} range
   * @return {List<Node>}
   */

  getFragmentAtRange(range) {
    let node = this

    // Make sure the children exist.
    const { startKey, startOffset, endKey, endOffset } = range
    const startText = node.assertDescendant(startKey)
    const endText = node.assertDescendant(endKey)

    // Split at the start and end.
    let child = startText
    let previous
    let parent

    while (parent = node.getParent(child.key)) {
      const index = parent.nodes.indexOf(child)
      const position = child.kind == 'text' ? startOffset : child.nodes.indexOf(previous)
      parent = parent.splitNode(index, position)
      node = node.updateNode(parent)
      previous = parent.nodes.get(index + 1)
      child = parent
    }

    child = endText

    while (parent = node.getParent(child.key)) {
      const index = parent.nodes.indexOf(child)
      const position = child.kind == 'text' ? endOffset : child.nodes.indexOf(previous)
      parent = parent.splitNode(index, position)
      node = node.updateNode(parent)
      previous = parent.nodes.get(index + 1)
      child = parent
    }

    // Get the start and end nodes.
    const next = node.getNextText(startKey)
    const startNode = node.getNextSibling(node.getFurthestAncestor(startKey).key)
    const endNode = startKey == endKey
      ? node.getFurthestAncestor(next.key)
      : node.getFurthestAncestor(endKey)

    // Get children range of nodes from start to end nodes
    const startIndex = node.nodes.indexOf(startNode)
    const endIndex = node.nodes.indexOf(endNode)
    const nodes = node.nodes.slice(startIndex, endIndex + 1)

    // Return a new document fragment.
    return Document.create({ nodes })
  }

  /**
   * Get the furthest parent of a node by `key` that matches an `iterator`.
   *
   * @param {String} key
   * @param {Function} iterator
   * @return {Node|Null}
   */

  getFurthest(key, iterator) {
    const ancestors = this.getAncestors(key)
    if (!ancestors) {
      key = Normalize.key(key)
      throw new Error(`Could not find a descendant node with key "${key}".`)
    }

    // Exclude this node itself
    return ancestors.rest().find(iterator)
  }

  /**
   * Get the furthest block parent of a node by `key`.
   *
   * @param {String} key
   * @return {Node|Null}
   */

  getFurthestBlock(key) {
    return this.getFurthest(key, node => node.kind == 'block')
  }

  /**
   * Get the furthest inline parent of a node by `key`.
   *
   * @param {String} key
   * @return {Node|Null}
   */

  getFurthestInline(key) {
    return this.getFurthest(key, node => node.kind == 'inline')
  }

  /**
   * Get the furthest ancestor of a node by `key`.
   *
   * @param {String} key
   * @return {Node|Null}
   */

  getFurthestAncestor(key) {
    key = Normalize.key(key)
    return this.nodes.find((node) => {
      if (node.key == key) return true
      if (node.kind == 'text') return false
      return node.hasDescendant(key)
    })
  }

  /**
   * Get the furthest ancestor of a node by `key` that has only one child.
   *
   * @param {String} key
   * @return {Node|Null}
   */

  getFurthestOnlyChildAncestor(key) {
    const ancestors = this.getAncestors(key)

    if (!ancestors) {
      key = Normalize.key(key)
      throw new Error(`Could not find a descendant node with key "${key}".`)
    }

    return ancestors
      // Skip this node...
      .skipLast()
      // Take parents until there are more than one child...
      .reverse().takeUntil(p => p.nodes.size > 1)
      // And pick the highest.
      .last()
  }

  /**
   * Get the closest inline nodes for each text node in the node.
   *
   * @return {List<Node>}
   */

  getInlines() {
    const array = this.getInlinesAsArray()
    return new List(array)
  }

  /**
   * Get the closest inline nodes for each text node in the node, as an array.
   *
   * @return {List<Node>}
   */

  getInlinesAsArray() {
    let array = []

    this.nodes.forEach((child) => {
      if (child.kind == 'text') return
      if (child.isLeafInline()) {
        array.push(child)
      } else {
        array = array.concat(child.getInlinesAsArray())
      }
    })

    return array
  }

  /**
   * Get the closest inline nodes for each text node in a `range`.
   *
   * @param {Selection} range
   * @return {List<Node>}
   */

  getInlinesAtRange(range) {
    const array = this.getInlinesAtRangeAsArray(range)
    // Remove duplicates by converting it to an `OrderedSet` first.
    return new List(new OrderedSet(array))
  }

  /**
   * Get the closest inline nodes for each text node in a `range` as an array.
   *
   * @param {Selection} range
   * @return {Array}
   */

  getInlinesAtRangeAsArray(range) {
    return this
      .getTextsAtRangeAsArray(range)
      .map(text => this.getClosestInline(text.key))
      .filter(exists => exists)
  }

  /**
   * Get all of the leaf inline nodes that match a `type`.
   *
   * @param {String} type
   * @return {List<Node>}
   */

  getInlinesByType(type) {
    const array = this.getInlinesByTypeAsArray(type)
    return new List(array)
  }

  /**
   * Get all of the leaf inline nodes that match a `type` as an array.
   *
   * @param {String} type
   * @return {Array}
   */

  getInlinesByTypeAsArray(type) {
    return this.nodes.reduce((inlines, node) => {
      if (node.kind == 'text') {
        return inlines
      } else if (node.isLeafInline() && node.type == type) {
        inlines.push(node)
        return inlines
      } else {
        return inlines.concat(node.getInlinesByTypeAsArray(type))
      }
    }, [])
  }

  /**
   * Return a set of all keys in the node.
   *
   * @return {Set<String>}
   */

  getKeys() {
    const keys = []

    this.forEachDescendant((desc) => {
      keys.push(desc.key)
    })

    return new Set(keys)
  }

  /**
   * Get the last child text node.
   *
   * @return {Node|Null}
   */

  getLastText() {
    let descendantFound = null

    const found = this.nodes.findLast((node) => {
      if (node.kind == 'text') return true
      descendantFound = node.getLastText()
      return descendantFound
    })

    return descendantFound || found
  }

  /**
   * Get all of the marks for all of the characters of every text node.
   *
   * @return {Set<Mark>}
   */

  getMarks() {
    const array = this.getMarksAsArray()
    return new Set(array)
  }

  /**
   * Get all of the marks for all of the characters of every text node.
   *
   * @return {OrderedSet<Mark>}
   */

  getOrderedMarks() {
    const array = this.getMarksAsArray()
    return new OrderedSet(array)
  }

  /**
   * Get all of the marks as an array.
   *
   * @return {Array}
   */

  getMarksAsArray() {
    return this.nodes.reduce((marks, node) => {
      return marks.concat(node.getMarksAsArray())
    }, [])
  }

  /**
   * Get a set of the marks in a `range`.
   *
   * @param {Selection} range
   * @return {Set<Mark>}
   */

  getMarksAtRange(range) {
    const array = this.getMarksAtRangeAsArray(range)
    return new Set(array)
  }

  /**
   * Get a set of the marks in a `range`.
   *
   * @param {Selection} range
   * @return {OrderedSet<Mark>}
   */

  getOrderedMarksAtRange(range) {
    const array = this.getMarksAtRangeAsArray(range)
    return new OrderedSet(array)
  }

  /**
   * Get a set of the active marks in a `range`.
   *
   * @param {Selection} range
   * @return {Set<Mark>}
   */

  getActiveMarksAtRange(range) {
    const array = this.getActiveMarksAtRangeAsArray(range)
    return new Set(array)
  }

  /**
   * Get a set of the marks in a `range`.
   *
   * @param {Selection} range
   * @return {Array}
   */

  getMarksAtRangeAsArray(range) {
    range = range.normalize(this)
    const { startKey, startOffset } = range

    // If the range is collapsed at the start of the node, check the previous.
    if (range.isCollapsed && startOffset == 0) {
      const previous = this.getPreviousText(startKey)
      if (!previous || previous.text.length == 0) return []
      const char = previous.characters.get(previous.text.length - 1)
      return char.marks.toArray()
    }

    // If the range is collapsed, check the character before the start.
    if (range.isCollapsed) {
      const text = this.getDescendant(startKey)
      const char = text.characters.get(range.startOffset - 1)
      return char.marks.toArray()
    }

    // Otherwise, get a set of the marks for each character in the range.
    return this
      .getCharactersAtRange(range)
      .reduce((memo, char) => {
        char.marks.toArray().forEach(c => memo.push(c))
        return memo
      }, [])
  }

  getActiveMarksAtRangeAsArray(range) {
    range = range.normalize(this)
    const { startKey, startOffset } = range

    // If the range is collapsed at the start of the node, check the previous.
    if (range.isCollapsed && startOffset == 0) {
      const previous = this.getPreviousText(startKey)
      if (!previous || !previous.length) return []
      const char = previous.characters.get(previous.length - 1)
      return char.marks.toArray()
    }

    // If the range is collapsed, check the character before the start.
    if (range.isCollapsed) {
      const text = this.getDescendant(startKey)
      const char = text.characters.get(range.startOffset - 1)
      return char.marks.toArray()
    }

    // Otherwise, get a set of the marks for each character in the range.
    const chars = this.getCharactersAtRange(range)
    const first = chars.first()
    let memo = first.marks
    chars.slice(1).forEach((char) => {
      memo = memo.intersect(char.marks)
      return memo.size != 0
    })
    return memo.toArray()
  }

  /**
   * Get all of the marks that match a `type`.
   *
   * @param {String} type
   * @return {Set<Mark>}
   */

  getMarksByType(type) {
    const array = this.getMarksByTypeAsArray(type)
    return new Set(array)
  }

  /**
   * Get all of the marks that match a `type`.
   *
   * @param {String} type
   * @return {OrderedSet<Mark>}
   */

  getOrderedMarksByType(type) {
    const array = this.getMarksByTypeAsArray(type)
    return new OrderedSet(array)
  }

  /**
   * Get all of the marks that match a `type` as an array.
   *
   * @param {String} type
   * @return {Array}
   */

  getMarksByTypeAsArray(type) {
    return this.nodes.reduce((array, node) => {
      return node.kind == 'text'
        ? array.concat(node.getMarksAsArray().filter(m => m.type == type))
        : array.concat(node.getMarksByTypeAsArray(type))
    }, [])
  }

  /**
   * Get the block node before a descendant text node by `key`.
   *
   * @param {String} key
   * @return {Node|Null}
   */

  getNextBlock(key) {
    const child = this.assertDescendant(key)
    let last

    if (child.kind == 'block') {
      last = child.getLastText()
    } else {
      const block = this.getClosestBlock(key)
      last = block.getLastText()
    }

    const next = this.getNextText(last.key)
    if (!next) return null

    return this.getClosestBlock(next.key)
  }

  /**
   * Get the node after a descendant by `key`.
   *
   * @param {String} key
   * @return {Node|Null}
   */

  getNextSibling(key) {
    key = Normalize.key(key)

    const parent = this.getParent(key)
    const after = parent.nodes
      .skipUntil(child => child.key == key)

    if (after.size == 0) {
      throw new Error(`Could not find a child node with key "${key}".`)
    }
    return after.get(1)
  }

  /**
   * Get the text node after a descendant text node by `key`.
   *
   * @param {String} key
   * @return {Node|Null}
   */

  getNextText(key) {
    key = Normalize.key(key)
    return this.getTexts()
      .skipUntil(text => text.key == key)
      .get(1)
  }

  /**
   * Get a node in the tree by `key`.
   *
   * @param {String} key
   * @return {Node|Null}
   */

  getNode(key) {
    key = Normalize.key(key)
    return this.key == key ? this : this.getDescendant(key)
  }

  /**
   * Get a node in the tree by `path`.
   *
   * @param {Array} path
   * @return {Node|Null}
   */

  getNodeAtPath(path) {
    return path.length ? this.getDescendantAtPath(path) : this
  }

  /**
   * Get the offset for a descendant text node by `key`.
   *
   * @param {String} key
   * @return {Number}
   */

  getOffset(key) {
    this.assertDescendant(key)

    // Calculate the offset of the nodes before the highest child.
    const child = this.getFurthestAncestor(key)
    const offset = this.nodes
      .takeUntil(n => n == child)
      .reduce((memo, n) => memo + n.text.length, 0)

    // Recurse if need be.
    return this.hasChild(key)
      ? offset
      : offset + child.getOffset(key)
  }

  /**
   * Get the offset from a `range`.
   *
   * @param {Selection} range
   * @return {Number}
   */

  getOffsetAtRange(range) {
    range = range.normalize(this)

    if (range.isExpanded) {
      throw new Error('The range must be collapsed to calculcate its offset.')
    }

    const { startKey, startOffset } = range
    return this.getOffset(startKey) + startOffset
  }

  /**
   * Get the parent of a child node by `key`.
   *
   * @param {String} key
   * @return {Node|Null}
   */

  getParent(key) {
    if (this.hasChild(key)) return this

    let node = null

    this.nodes.find((child) => {
      if (child.kind == 'text') {
        return false
      } else {
        node = child.getParent(key)
        return node
      }
    })

    return node
  }

  /**
   * Get the path of a descendant node by `key`.
   *
   * @param {String|Node} key
   * @return {Array}
   */

  getPath(key) {
    let child = this.assertNode(key)
    const ancestors = this.getAncestors(key)
    const path = []

    ancestors.reverse().forEach((ancestor) => {
      const index = ancestor.nodes.indexOf(child)
      path.unshift(index)
      child = ancestor
    })

    return path
  }

  /**
   * Get the block node before a descendant text node by `key`.
   *
   * @param {String} key
   * @return {Node|Null}
   */

  getPreviousBlock(key) {
    const child = this.assertDescendant(key)
    let first

    if (child.kind == 'block') {
      first = child.getFirstText()
    } else {
      const block = this.getClosestBlock(key)
      first = block.getFirstText()
    }

    const previous = this.getPreviousText(first.key)
    if (!previous) return null

    return this.getClosestBlock(previous.key)
  }

  /**
   * Get the node before a descendant node by `key`.
   *
   * @param {String} key
   * @return {Node|Null}
   */

  getPreviousSibling(key) {
    key = Normalize.key(key)
    const parent = this.getParent(key)
    const before = parent.nodes
      .takeUntil(child => child.key == key)

    if (before.size == parent.nodes.size) {
      throw new Error(`Could not find a child node with key "${key}".`)
    }

    return before.last()
  }

  /**
   * Get the text node before a descendant text node by `key`.
   *
   * @param {String} key
   * @return {Node|Null}
   */

  getPreviousText(key) {
    key = Normalize.key(key)
    return this.getTexts()
      .takeUntil(text => text.key == key)
      .last()
  }

  /**
   * Get the concatenated text string of all child nodes.
   *
   * @return {String}
   */

  getText() {
    return this.nodes.reduce((string, node) => {
      return string + node.text
    }, '')
  }

  /**
   * Get the descendent text node at an `offset`.
   *
   * @param {String} offset
   * @return {Node|Null}
   */

  getTextAtOffset(offset) {
    // PERF: Add a few shortcuts for the obvious cases.
    if (offset == 0) return this.getFirstText()
    if (offset == this.text.length) return this.getLastText()
    if (offset < 0 || offset > this.text.length) return null

    let length = 0

    return this
      .getTexts()
      .find((node, i, nodes) => {
        length += node.text.length
        return length > offset
      })
  }

  /**
   * Get the direction of the node's text.
   *
   * @return {String}
   */

  getTextDirection() {
    const dir = direction(this.text)
    return dir == 'neutral' ? undefined : dir
  }

  /**
   * Recursively get all of the child text nodes in order of appearance.
   *
   * @return {List<Node>}
   */

  getTexts() {
    const array = this.getTextsAsArray()
    return new List(array)
  }

  /**
   * Recursively get all the leaf text nodes in order of appearance, as array.
   *
   * @return {List<Node>}
   */

  getTextsAsArray() {
    let array = []

    this.nodes.forEach((node) => {
      if (node.kind == 'text') {
        array.push(node)
      } else {
        array = array.concat(node.getTextsAsArray())
      }
    })

    return array
  }

  /**
   * Get all of the text nodes in a `range`.
   *
   * @param {Selection} range
   * @return {List<Node>}
   */

  getTextsAtRange(range) {
    const array = this.getTextsAtRangeAsArray(range)
    return new List(array)
  }

  /**
   * Get all of the text nodes in a `range` as an array.
   *
   * @param {Selection} range
   * @return {Array}
   */

  getTextsAtRangeAsArray(range) {
    range = range.normalize(this)
    const { startKey, endKey } = range
    const startText = this.getDescendant(startKey)

    // PERF: the most common case is when the range is in a single text node,
    // where we can avoid a lot of iterating of the tree.
    if (startKey == endKey) return [startText]

    const endText = this.getDescendant(endKey)
    const texts = this.getTextsAsArray()
    const start = texts.indexOf(startText)
    const end = texts.indexOf(endText)
    return texts.slice(start, end + 1)
  }

  /**
   * Check if a child node exists by `key`.
   *
   * @param {String} key
   * @return {Boolean}
   */

  hasChild(key) {
    return !!this.getChild(key)
  }

  /**
   * Recursively check if a child node exists by `key`.
   *
   * @param {String} key
   * @return {Boolean}
   */

  hasDescendant(key) {
    return !!this.getDescendant(key)
  }

  /**
   * Recursively check if a node exists by `key`.
   *
   * @param {String} key
   * @return {Boolean}
   */

  hasNode(key) {
    return !!this.getNode(key)
  }

  /**
   * Check if a node has a void parent by `key`.
   *
   * @param {String} key
   * @return {Boolean}
   */

  hasVoidParent(key) {
    return !!this.getClosest(key, parent => parent.isVoid)
  }

  /**
   * Insert a `node` at `index`.
   *
   * @param {Number} index
   * @param {Node} node
   * @return {Node}
   */

  insertNode(index, node) {
    const keys = this.getKeys()

    if (keys.contains(node.key)) {
      node = node.regenerateKey()
    }

    if (node.kind != 'text') {
      node = node.mapDescendants((desc) => {
        return keys.contains(desc.key)
          ? desc.regenerateKey()
          : desc
      })
    }

    const nodes = this.nodes.insert(index, node)
    return this.set('nodes', nodes)
  }

  /**
   * Check whether the node is a leaf block.
   *
   * @return {Boolean}
   */

  isLeafBlock() {
    return (
      this.kind == 'block' &&
      this.nodes.every(n => n.kind != 'block')
    )
  }

  /**
   * Check whether the node is a leaf inline.
   *
   * @return {Boolean}
   */

  isLeafInline() {
    return (
      this.kind == 'inline' &&
      this.nodes.every(n => n.kind != 'inline')
    )
  }

  /**
   * Merge a children node `first` with another children node `second`.
   * `first` and `second` will be concatenated in that order.
   * `first` and `second` must be two Nodes or two Text.
   *
   * @param {Node} first
   * @param {Node} second
   * @return {Node}
   */

  mergeNode(withIndex, index) {
    let node = this
    let one = node.nodes.get(withIndex)
    const two = node.nodes.get(index)

    if (one.kind != two.kind) {
      throw new Error(`Tried to merge two nodes of different kinds: "${one.kind}" and "${two.kind}".`)
    }

    // If the nodes are text nodes, concatenate their characters together.
    if (one.kind == 'text') {
      const characters = one.characters.concat(two.characters)
      one = one.set('characters', characters)
    }

    // Otherwise, concatenate their child nodes together.
    else {
      const nodes = one.nodes.concat(two.nodes)
      one = one.set('nodes', nodes)
    }

    node = node.removeNode(index)
    node = node.removeNode(withIndex)
    node = node.insertNode(withIndex, one)
    return node
  }

  /**
   * Map all child nodes, updating them in their parents. This method is
   * optimized to not return a new node if no changes are made.
   *
   * @param {Function} iterator
   * @return {Node}
   */

  mapChildren(iterator) {
    let { nodes } = this

    nodes.forEach((node, i) => {
      const ret = iterator(node, i, this.nodes)
      if (ret != node) nodes = nodes.set(ret.key, ret)
    })

    return this.set('nodes', nodes)
  }

  /**
   * Map all descendant nodes, updating them in their parents. This method is
   * optimized to not return a new node if no changes are made.
   *
   * @param {Function} iterator
   * @return {Node}
   */

  mapDescendants(iterator) {
    let { nodes } = this

    nodes.forEach((node, i) => {
      let ret = node
      if (ret.kind != 'text') ret = ret.mapDescendants(iterator)
      ret = iterator(ret, i, this.nodes)
      if (ret == node) return

      const index = nodes.indexOf(node)
      nodes = nodes.set(index, ret)
    })

    return this.set('nodes', nodes)
  }

  /**
   * Regenerate the node's key.
   *
   * @return {Node}
   */

  regenerateKey() {
    const key = generateKey()
    return this.set('key', key)
  }

  /**
   * Remove a `node` from the children node map.
   *
   * @param {String} key
   * @return {Node}
   */

  removeDescendant(key) {
    key = Normalize.key(key)

    let node = this
    let parent = node.getParent(key)
    if (!parent) throw new Error(`Could not find a descendant node with key "${key}".`)

    const index = parent.nodes.findIndex(n => n.key === key)
    const nodes = parent.nodes.splice(index, 1)

    parent = parent.set('nodes', nodes)
    node = node.updateNode(parent)
    return node
  }

  /**
   * Remove a node at `index`.
   *
   * @param {Number} index
   * @return {Node}
   */

  removeNode(index) {
    const nodes = this.nodes.splice(index, 1)
    return this.set('nodes', nodes)
  }

  /**
   * Split a child node by `index` at `position`.
   *
   * @param {Number} index
   * @param {Number} position
   * @return {Node}
   */

  splitNode(index, position) {
    let node = this
    const child = node.nodes.get(index)
    let one
    let two

    // If the child is a text node, the `position` refers to the text offset at
    // which to split it.
    if (child.kind == 'text') {
      const befores = child.characters.take(position)
      const afters = child.characters.skip(position)
      one = child.set('characters', befores)
      two = child.set('characters', afters).regenerateKey()
    }

    // Otherwise, if the child is not a text node, the `position` refers to the
    // index at which to split its children.
    else {
      const befores = child.nodes.take(position)
      const afters = child.nodes.skip(position)
      one = child.set('nodes', befores)
      two = child.set('nodes', afters).regenerateKey()
    }

    // Remove the old node and insert the newly split children.
    node = node.removeNode(index)
    node = node.insertNode(index, two)
    node = node.insertNode(index, one)
    return node
  }

  /**
   * Set a new value for a child node by `key`.
   *
   * @param {Node} node
   * @return {Node}
   */

  updateNode(node) {
    if (node.key == this.key) {
      return node
    }

    let child = this.assertDescendant(node.key)
    const ancestors = this.getAncestors(node.key)

    ancestors.reverse().forEach((parent) => {
      let { nodes } = parent
      const index = nodes.indexOf(child)
      child = parent
      nodes = nodes.set(index, node)
      parent = parent.set('nodes', nodes)
      node = parent
    })

    return node
  }

  /**
   * Validate the node against a `schema`.
   *
   * @param {Schema} schema
   * @return {Object|Null}
   */

  validate(schema) {
    return schema.__validate(this)
  }

  /**
   * True if the node has both descendants in that order, false otherwise. The
   * order is depth-first, post-order.
   *
   * @param {String} first
   * @param {String} second
   * @return {Boolean}
   */

  areDescendantSorted(first, second) {
    logger.deprecate('0.19.0', 'The Node.areDescendantSorted(first, second) method is deprecated, please use `Node.areDescendantsSorted(first, second) instead.')
    return this.areDescendantsSorted(first, second)
  }

  /**
   * Concat children `nodes` on to the end of the node.
   *
   * @param {List<Node>} nodes
   * @return {Node}
   */

  concatChildren(nodes) {
    logger.deprecate('0.19.0', 'The `Node.concatChildren(nodes)` method is deprecated.')
    nodes = this.nodes.concat(nodes)
    return this.set('nodes', nodes)
  }

  /**
   * Decorate all of the text nodes with a `decorator` function.
   *
   * @param {Function} decorator
   * @return {Node}
   */

  decorateTexts(decorator) {
    logger.deprecate('0.19.0', 'The `Node.decorateTexts(decorator) method is deprecated.')
    return this.mapDescendants((child) => {
      return child.kind == 'text'
        ? child.decorateCharacters(decorator)
        : child
    })
  }

  /**
   * Recursively filter all descendant nodes with `iterator`, depth-first.
   * It is different from `filterDescendants` in regard of the order of results.
   *
   * @param {Function} iterator
   * @return {List<Node>}
   */

  filterDescendantsDeep(iterator) {
    logger.deprecate('0.19.0', 'The Node.filterDescendantsDeep(iterator) method is deprecated.')
    return this.nodes.reduce((matches, child, i, nodes) => {
      if (child.kind != 'text') matches = matches.concat(child.filterDescendantsDeep(iterator))
      if (iterator(child, i, nodes)) matches = matches.push(child)
      return matches
    }, new List())
  }

  /**
   * Recursively find all descendant nodes by `iterator`. Depth first.
   *
   * @param {Function} iterator
   * @return {Node|Null}
   */

  findDescendantDeep(iterator) {
    logger.deprecate('0.19.0', 'The Node.findDescendantDeep(iterator) method is deprecated.')
    let found

    this.forEachDescendant((node) => {
      if (iterator(node)) {
        found = node
        return false
      }
    })

    return found
  }

  /**
   * Get children between two child keys.
   *
   * @param {String} start
   * @param {String} end
   * @return {Node}
   */

  getChildrenBetween(start, end) {
    logger.deprecate('0.19.0', 'The `Node.getChildrenBetween(start, end)` method is deprecated.')
    start = this.assertChild(start)
    start = this.nodes.indexOf(start)
    end = this.assertChild(end)
    end = this.nodes.indexOf(end)
    return this.nodes.slice(start + 1, end)
  }

  /**
   * Get children between two child keys, including the two children.
   *
   * @param {String} start
   * @param {String} end
   * @return {Node}
   */

  getChildrenBetweenIncluding(start, end) {
    logger.deprecate('0.19.0', 'The `Node.getChildrenBetweenIncluding(start, end)` method is deprecated.')
    start = this.assertChild(start)
    start = this.nodes.indexOf(start)
    end = this.assertChild(end)
    end = this.nodes.indexOf(end)
    return this.nodes.slice(start, end + 1)
  }

  /**
   * Get the highest child ancestor of a node by `key`.
   *
   * @param {String} key
   * @return {Node|Null}
   */

  getHighestChild(key) {
    logger.deprecate('0.19.0', 'The `Node.getHighestChild(key) method is deprecated, please use `Node.getFurthestAncestor(key) instead.')
    return this.getFurthestAncestor(key)
  }

  /**
   * Get the highest parent of a node by `key` which has an only child.
   *
   * @param {String} key
   * @return {Node|Null}
   */

  getHighestOnlyChildParent(key) {
    logger.deprecate('0.19.0', 'The `Node.getHighestOnlyChildParent(key)` method is deprecated, please use `Node.getFurthestOnlyChildAncestor` instead.')
    return this.getFurthestOnlyChildAncestor(key)
  }

  /**
   * Check if the inline nodes are split at a `range`.
   *
   * @param {Selection} range
   * @return {Boolean}
   */

  isInlineSplitAtRange(range) {
    logger.deprecate('0.19.0', 'The `Node.isInlineSplitAtRange(range)` method is deprecated.')
    range = range.normalize(this)
    if (range.isExpanded) throw new Error()

    const { startKey } = range
    const start = this.getFurthestInline(startKey) || this.getDescendant(startKey)
    return range.isAtStartOf(start) || range.isAtEndOf(start)
  }

}

/**
 * Memoize read methods.
 */

memoize(Node.prototype, [
  'getBlocks',
  'getBlocksAsArray',
  'getCharacters',
  'getCharactersAsArray',
  'getFirstText',
  'getInlines',
  'getInlinesAsArray',
  'getKeys',
  'getLastText',
  'getMarks',
  'getOrderedMarks',
  'getMarksAsArray',
  'getText',
  'getTextDirection',
  'getTexts',
  'getTextsAsArray',
  'isLeafBlock',
  'isLeafInline',
], {
  takesArguments: false
})

memoize(Node.prototype, [
  'areDescendantsSorted',
  'getActiveMarksAtRange',
  'getActiveMarksAtRangeAsArray',
  'getAncestors',
  'getBlocksAtRange',
  'getBlocksAtRangeAsArray',
  'getBlocksByType',
  'getBlocksByTypeAsArray',
  'getCharactersAtRange',
  'getCharactersAtRangeAsArray',
  'getChild',
  'getChildrenBetween',
  'getChildrenBetweenIncluding',
  'getClosestBlock',
  'getClosestInline',
  'getClosestVoid',
  'getCommonAncestor',
  'getComponent',
  'getDecorators',
  'getDepth',
  'getDescendant',
  'getDescendantAtPath',
  'getDescendantDecorators',
  'getFragmentAtRange',
  'getFurthestBlock',
  'getFurthestInline',
  'getFurthestAncestor',
  'getFurthestOnlyChildAncestor',
  'getInlinesAtRange',
  'getInlinesAtRangeAsArray',
  'getInlinesByType',
  'getInlinesByTypeAsArray',
  'getMarksAtRange',
  'getOrderedMarksAtRange',
  'getMarksAtRangeAsArray',
  'getMarksByType',
  'getOrderedMarksByType',
  'getMarksByTypeAsArray',
  'getNextBlock',
  'getNextSibling',
  'getNextText',
  'getNode',
  'getNodeAtPath',
  'getOffset',
  'getOffsetAtRange',
  'getParent',
  'getPath',
  'getPreviousBlock',
  'getPreviousSibling',
  'getPreviousText',
  'getTextAtOffset',
  'getTextsAtRange',
  'getTextsAtRangeAsArray',
  'hasChild',
  'hasDescendant',
  'hasNode',
  'hasVoidParent',
  'isInlineSplitAtRange',
  'validate',
], {
  takesArguments: true
})

/**
 * Export.
 *
 * @type {Object}
 */

export default Node
