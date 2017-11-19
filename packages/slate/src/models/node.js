
import direction from 'direction'
import isPlainObject from 'is-plain-object'
import { List, OrderedSet, Set } from 'immutable'

import Block from './block'
import Data from './data'
import Document from './document'
import Inline from './inline'
import Range from './range'
import Text from './text'
import generateKey from '../utils/generate-key'
import isIndexInRange from '../utils/is-index-in-range'
import memoize from '../utils/memoize'

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
    if (Node.isNode(attrs)) {
      return attrs
    }

    if (isPlainObject(attrs)) {
      switch (attrs.kind) {
        case 'block': return Block.create(attrs)
        case 'document': return Document.create(attrs)
        case 'inline': return Inline.create(attrs)
        case 'text': return Text.create(attrs)
        default: {
          throw new Error('`Node.create` requires a `kind` string.')
        }
      }
    }

    throw new Error(`\`Node.create\` only accepts objects or nodes but you passed it: ${attrs}`)
  }

  /**
   * Create a list of `Nodes` from an array.
   *
   * @param {Array<Object|Node>} elements
   * @return {List<Node>}
   */

  static createList(elements = []) {
    if (List.isList(elements) || Array.isArray(elements)) {
      const list = new List(elements.map(Node.create))
      return list
    }

    throw new Error(`\`Node.createList\` only accepts lists or arrays, but you passed it: ${elements}`)
  }

  /**
   * Create a dictionary of settable node properties from `attrs`.
   *
   * @param {Object|String|Node} attrs
   * @return {Object}
   */

  static createProperties(attrs = {}) {
    if (Block.isBlock(attrs) || Inline.isInline(attrs)) {
      return {
        data: attrs.data,
        isVoid: attrs.isVoid,
        type: attrs.type,
      }
    }

    if (typeof attrs == 'string') {
      return { type: attrs }
    }

    if (isPlainObject(attrs)) {
      const props = {}
      if ('type' in attrs) props.type = attrs.type
      if ('data' in attrs) props.data = Data.create(attrs.data)
      if ('isVoid' in attrs) props.isVoid = attrs.isVoid
      return props
    }

    throw new Error(`\`Node.createProperties\` only accepts objects, strings, blocks or inlines, but you passed it: ${attrs}`)
  }

  /**
   * Create a `Node` from a JSON `object`.
   *
   * @param {Object} object
   * @return {Node}
   */

  static fromJSON(object) {
    const { kind } = object

    switch (kind) {
      case 'block': return Block.fromJSON(object)
      case 'document': return Document.fromJSON(object)
      case 'inline': return Inline.fromJSON(object)
      case 'text': return Text.fromJSON(object)
      default: {
        throw new Error(`\`Node.fromJSON\` requires a \`kind\` of either 'block', 'document', 'inline' or 'text', but you passed: ${kind}`)
      }
    }
  }

  /**
   * Alias `fromJS`.
   */

  static fromJS = Node.fromJSON

  /**
   * Check if `any` is a `Node`.
   *
   * @param {Any} any
   * @return {Boolean}
   */

  static isNode(any) {
    return (
      Block.isBlock(any) ||
      Document.isDocument(any) ||
      Inline.isInline(any) ||
      Text.isText(any)
    )
  }

  /**
   * Check if `any` is a list of nodes.
   *
   * @param {Any} any
   * @return {Boolean}
   */

  static isNodeList(any) {
    return List.isList(any) && any.every(item => Node.isNode(item))
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
    first = assertKey(first)
    second = assertKey(second)

    const keys = this.getKeysAsArray()
    const firstIndex = keys.indexOf(first)
    const secondIndex = keys.indexOf(second)
    if (firstIndex == -1 || secondIndex == -1) return null

    return firstIndex < secondIndex
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
      key = assertKey(key)
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
      key = assertKey(key)
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
      key = assertKey(key)
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
    key = assertKey(key)

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
   * @param {Range} range
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
   * @param {Range} range
   * @return {Array}
   */

  getBlocksAtRangeAsArray(range) {
    range = range.normalize(this)
    if (range.isUnset) return []

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
   * @param {Range} range
   * @return {List<Character>}
   */

  getCharactersAtRange(range) {
    const array = this.getCharactersAtRangeAsArray(range)
    return new List(array)
  }

  /**
   * Get a list of the characters in a `range` as an array.
   *
   * @param {Range} range
   * @return {Array}
   */

  getCharactersAtRangeAsArray(range) {
    range = range.normalize(this)
    if (range.isUnset) return []

    return this
      .getTextsAtRange(range)
      .reduce((arr, text) => {
        const chars = text.characters
          .filter((char, i) => isIndexInRange(i, text, range))
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
    key = assertKey(key)
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
    key = assertKey(key)
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
    one = assertKey(one)
    two = assertKey(two)

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
   * Get the decorations for the node from a `stack`.
   *
   * @param {Stack} stack
   * @return {List}
   */

  getDecorations(stack) {
    const decorations = stack.find('decorateNode', this)
    const list = Range.createList(decorations || [])
    return list
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
    key = assertKey(key)
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

    for (const index of path) {
      if (!descendant) return
      if (!descendant.nodes) return
      descendant = descendant.nodes.get(index)
    }

    return descendant
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
   * @param {Range} range
   * @return {Document}
   */

  getFragmentAtRange(range) {
    range = range.normalize(this)
    if (range.isUnset) return Document.create()

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
      const position = child.kind == 'text'
        ? startOffset
        : child.nodes.indexOf(previous)

      parent = parent.splitNode(index, position)
      node = node.updateNode(parent)
      previous = parent.nodes.get(index + 1)
      child = parent
    }

    child = startKey == endKey ? node.getNextText(startKey) : endText

    while (parent = node.getParent(child.key)) {
      const index = parent.nodes.indexOf(child)
      const position = child.kind == 'text'
        ? startKey == endKey ? endOffset - startOffset : endOffset
        : child.nodes.indexOf(previous)

      parent = parent.splitNode(index, position)
      node = node.updateNode(parent)
      previous = parent.nodes.get(index + 1)
      child = parent
    }

    // Get the start and end nodes.
    const startNode = node.getNextSibling(node.getFurthestAncestor(startKey).key)
    const endNode = startKey == endKey
      ? node.getNextSibling(node.getNextSibling(node.getFurthestAncestor(endKey).key).key)
      : node.getNextSibling(node.getFurthestAncestor(endKey).key)

    // Get children range of nodes from start to end nodes
    const startIndex = node.nodes.indexOf(startNode)
    const endIndex = node.nodes.indexOf(endNode)
    const nodes = node.nodes.slice(startIndex, endIndex)

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
      key = assertKey(key)
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
    return this.getFurthest(key, node => true)
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
      key = assertKey(key)
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
   * @param {Range} range
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
   * @param {Range} range
   * @return {Array}
   */

  getInlinesAtRangeAsArray(range) {
    range = range.normalize(this)
    if (range.isUnset) return []

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
   * Return a set of all keys in the node as an array.
   *
   * @return {Array<String>}
   */

  getKeysAsArray() {
    const keys = []

    this.forEachDescendant((desc) => {
      keys.push(desc.key)
    })

    return keys
  }

  /**
   * Return a set of all keys in the node.
   *
   * @return {Set<String>}
   */

  getKeys() {
    const keys = this.getKeysAsArray()
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
   * @param {Range} range
   * @return {Set<Mark>}
   */

  getMarksAtRange(range) {
    const array = this.getMarksAtRangeAsArray(range)
    return new Set(array)
  }

  /**
   * Get a set of the marks in a `range`.
   *
   * @param {Range} range
   * @return {OrderedSet<Mark>}
   */

  getOrderedMarksAtRange(range) {
    const array = this.getMarksAtRangeAsArray(range)
    return new OrderedSet(array)
  }

  /**
   * Get a set of the active marks in a `range`.
   *
   * @param {Range} range
   * @return {Set<Mark>}
   */

  getActiveMarksAtRange(range) {
    const array = this.getActiveMarksAtRangeAsArray(range)
    return new Set(array)
  }

  /**
   * Get a set of the marks in a `range`, by unioning.
   *
   * @param {Range} range
   * @return {Array}
   */

  getMarksAtRangeAsArray(range) {
    range = range.normalize(this)
    if (range.isUnset) return []

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

  /**
   * Get a set of marks in a `range`, by intersecting.
   *
   * @param {Range} range
   * @return {Array}
   */

  getActiveMarksAtRangeAsArray(range) {
    range = range.normalize(this)
    if (range.isUnset) return []

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
    if (!first) return []

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
    key = assertKey(key)

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
    key = assertKey(key)
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
    key = assertKey(key)
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
   * @param {Range} range
   * @return {Number}
   */

  getOffsetAtRange(range) {
    range = range.normalize(this)

    if (range.isUnset) {
      throw new Error('The range cannot be unset to calculcate its offset.')
    }

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
   * Get the placeholder for the node from a `schema`.
   *
   * @param {Schema} schema
   * @return {Component|Void}
   */

  getPlaceholder(schema) {
    return schema.__getPlaceholder(this)
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
    key = assertKey(key)
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
    key = assertKey(key)
    return this.getTexts()
      .takeUntil(text => text.key == key)
      .last()
  }

  /**
   * Get the indexes of the selection for a `range`, given an extra flag for
   * whether the node `isSelected`, to determine whether not finding matches
   * means everything is selected or nothing is.
   *
   * @param {Range} range
   * @param {Boolean} isSelected
   * @return {Object|Null}
   */

  getSelectionIndexes(range, isSelected = false) {
    const { startKey, endKey } = range

    // PERF: if we're not selected, or the range is blurred, we can exit early.
    if (!isSelected || range.isBlurred) {
      return null
    }

    // PERF: if the start and end keys are the same, just check for the child
    // that contains that single key.
    if (startKey == endKey) {
      const child = this.getFurthestAncestor(startKey)
      const index = child ? this.nodes.indexOf(child) : null
      return { start: index, end: index + 1 }
    }

    // Otherwise, check all of the children...
    let start = null
    let end = null

    this.nodes.forEach((child, i) => {
      if (child.kind == 'text') {
        if (start == null && child.key == startKey) start = i
        if (end == null && child.key == endKey) end = i + 1
      } else {
        if (start == null && child.hasDescendant(startKey)) start = i
        if (end == null && child.hasDescendant(endKey)) end = i + 1
      }

      // PERF: exit early if both start and end have been found.
      return start == null || end == null
    })

    if (isSelected && start == null) start = 0
    if (isSelected && end == null) end = this.nodes.size
    return start == null ? null : { start, end }
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
   * @param {Range} range
   * @return {List<Node>}
   */

  getTextsAtRange(range) {
    const array = this.getTextsAtRangeAsArray(range)
    return new List(array)
  }

  /**
   * Get all of the text nodes in a `range` as an array.
   *
   * @param {Range} range
   * @return {Array}
   */

  getTextsAtRangeAsArray(range) {
    range = range.normalize(this)
    if (range.isUnset) return []

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
   * Check whether the node is in a `range`.
   *
   * @param {Range} range
   * @return {Boolean}
   */

  isInRange(range) {
    range = range.normalize(this)

    const node = this
    const { startKey, endKey, isCollapsed } = range

    // PERF: solve the most common cast where the start or end key are inside
    // the node, for collapsed selections.
    if (
      node.key == startKey ||
      node.key == endKey ||
      node.hasDescendant(startKey) ||
      node.hasDescendant(endKey)
    ) {
      return true
    }

    // PERF: if the selection is collapsed and the previous check didn't return
    // true, then it must be false.
    if (isCollapsed) {
      return false
    }

    // Otherwise, look through all of the leaf text nodes in the range, to see
    // if any of them are inside the node.
    const texts = node.getTextsAtRange(range)
    let memo = false

    texts.forEach((text) => {
      if (node.hasDescendant(text.key)) memo = true
      return memo
    })

    return memo
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
    key = assertKey(key)

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
   * @return {Function|Null}
   */

  validate(schema) {
    return schema.validateNode(this)
  }

}

/**
 * Assert a key `arg`.
 *
 * @param {String} arg
 * @return {String}
 */

function assertKey(arg) {
  if (typeof arg == 'string') return arg
  throw new Error(`Invalid \`key\` argument! It must be a key string, but you passed: ${arg}`)
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
  'getKeysAsArray',
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
  'getClosestBlock',
  'getClosestInline',
  'getClosestVoid',
  'getCommonAncestor',
  'getDecorations',
  'getDepth',
  'getDescendant',
  'getDescendantAtPath',
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
  'getPlaceholder',
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
