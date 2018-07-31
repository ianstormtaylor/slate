import direction from 'direction'
import isPlainObject from 'is-plain-object'
import logger from 'slate-dev-logger'
import { List, OrderedSet, Set } from 'immutable'

import Block from './block'
import Data from './data'
import Document from './document'
import Inline from './inline'
import KeyUtils from '../utils/key-utils'
import memoize from '../utils/memoize'
import PathUtils from '../utils/path-utils'
import Range from './range'
import Text from './text'
import { isType } from '../constants/model-types'

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
      let { object } = attrs

      if (!object && attrs.kind) {
        logger.deprecate(
          'slate@0.32.0',
          'The `kind` property of Slate objects has been renamed to `object`.'
        )

        object = attrs.kind
      }

      switch (object) {
        case 'block':
          return Block.create(attrs)
        case 'document':
          return Document.create(attrs)
        case 'inline':
          return Inline.create(attrs)
        case 'text':
          return Text.create(attrs)

        default: {
          throw new Error('`Node.create` requires a `object` string.')
        }
      }
    }

    throw new Error(
      `\`Node.create\` only accepts objects or nodes but you passed it: ${attrs}`
    )
  }

  /**
   * Create a list of `Nodes` from an array.
   *
   * @param {Array<Object|Node>} elements
   * @return {List<Node>}
   */

  static createList(elements = []) {
    if (List.isList(elements) || Array.isArray(elements)) {
      const list = List(elements.map(Node.create))
      return list
    }

    throw new Error(
      `\`Node.createList\` only accepts lists or arrays, but you passed it: ${elements}`
    )
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

    throw new Error(
      `\`Node.createProperties\` only accepts objects, strings, blocks or inlines, but you passed it: ${attrs}`
    )
  }

  /**
   * Create a `Node` from a JSON `value`.
   *
   * @param {Object} value
   * @return {Node}
   */

  static fromJSON(value) {
    let { object } = value

    if (!object && value.kind) {
      logger.deprecate(
        'slate@0.32.0',
        'The `kind` property of Slate objects has been renamed to `object`.'
      )

      object = value.kind
    }

    switch (object) {
      case 'block':
        return Block.fromJSON(value)
      case 'document':
        return Document.fromJSON(value)
      case 'inline':
        return Inline.fromJSON(value)
      case 'text':
        return Text.fromJSON(value)

      default: {
        throw new Error(
          `\`Node.fromJSON\` requires an \`object\` of either 'block', 'document', 'inline' or 'text', but you passed: ${value}`
        )
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
    return !!['BLOCK', 'DOCUMENT', 'INLINE', 'TEXT'].find(type =>
      isType(type, any)
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
   * Add mark to text at `offset` and `length` in node by `path`.
   *
   * @param {List|String} path
   * @param {Number} offset
   * @param {Number} length
   * @param {Mark} mark
   * @return {Node}
   */

  addMark(path, offset, length, mark) {
    let node = this.assertDescendant(path)
    path = this.resolvePath(path)
    node = node.addMark(offset, length, mark)
    const ret = this.replaceNode(path, node)
    return ret
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

      if (child.object != 'text') {
        ret = child.forEachDescendant(iterator)
        return ret
      }
    })

    return ret
  }

  /**
   * Get a set of the active marks in a `range`.
   *
   * @param {Range} range
   * @return {Set<Mark>}
   */

  getActiveMarksAtRange(range) {
    range = range.normalize(this)
    if (range.isUnset) return Set()

    if (range.isCollapsed) {
      const { startKey, startOffset } = range
      return this.getMarksAtPosition(startKey, startOffset).toSet()
    }

    let { startKey, endKey, startOffset, endOffset } = range
    let startText = this.getDescendant(startKey)

    if (startKey !== endKey) {
      while (startKey !== endKey && endOffset === 0) {
        const endText = this.getPreviousText(endKey)
        endKey = endText.key
        endOffset = endText.text.length
      }

      while (startKey !== endKey && startOffset === startText.text.length) {
        startText = this.getNextText(startKey)
        startKey = startText.key
        startOffset = 0
      }
    }

    if (startKey === endKey) {
      return startText.getActiveMarksBetweenOffsets(startOffset, endOffset)
    }

    const startMarks = startText.getActiveMarksBetweenOffsets(
      startOffset,
      startText.text.length
    )
    if (startMarks.size === 0) return Set()
    const endText = this.getDescendant(endKey)
    const endMarks = endText.getActiveMarksBetweenOffsets(0, endOffset)
    let marks = startMarks.intersect(endMarks)
    // If marks is already empty, the active marks is empty
    if (marks.size === 0) return marks

    let text = this.getNextText(startKey)

    while (text.key !== endKey) {
      if (text.text.length !== 0) {
        marks = marks.intersect(text.getActiveMarks())
        if (marks.size === 0) return Set()
      }

      text = this.getNextText(text.key)
    }
    return marks
  }

  /**
   * Get a list of the ancestors of a descendant.
   *
   * @param {List|String} path
   * @return {List<Node>|Null}
   */

  getAncestors(path) {
    path = this.resolvePath(path)
    if (!path) return null

    const ancestors = []

    path.forEach((p, i) => {
      const current = path.slice(0, i)
      const parent = this.getNode(current)
      ancestors.push(parent)
    })

    return List(ancestors)
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
      if (child.object != 'block') return array
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
    if (startKey === endKey) return [startBlock]

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
      if (node.object != 'block') {
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
    const characters = this.getTexts().flatMap(t => t.characters)
    return characters
  }

  /**
   * Get a list of the characters in a `range`.
   *
   * @param {Range} range
   * @return {List<Character>}
   */

  getCharactersAtRange(range) {
    range = range.normalize(this)
    if (range.isUnset) return List()
    const { startKey, endKey, startOffset, endOffset } = range

    if (startKey === endKey) {
      const endText = this.getDescendant(endKey)
      return endText.characters.slice(startOffset, endOffset)
    }

    return this.getTextsAtRange(range).flatMap(t => {
      if (t.key === startKey) {
        return t.characters.slice(startOffset)
      }

      if (t.key === endKey) {
        return t.characters.slice(0, endOffset)
      }
      return t.characters
    })
  }

  /**
   * Get a child node.
   *
   * @param {List|String} path
   * @return {Node|Null}
   */

  getChild(path) {
    path = this.resolvePath(path)
    if (!path) return null
    const child = path.size === 1 ? this.nodes.get(path.first()) : null
    return child
  }

  /**
   * Get closest parent of node that matches an `iterator`.
   *
   * @param {List|String} path
   * @param {Function} iterator
   * @return {Node|Null}
   */

  getClosest(path, iterator) {
    const ancestors = this.getAncestors(path)
    if (!ancestors) return null

    const closest = ancestors.findLast((node, ...args) => {
      // We never want to include the top-level node.
      if (node === this) return false
      return iterator(node, ...args)
    })

    return closest || null
  }

  /**
   * Get the closest block parent of a node.
   *
   * @param {List|String} path
   * @return {Node|Null}
   */

  getClosestBlock(path) {
    const closest = this.getClosest(path, n => n.object === 'block')
    return closest
  }

  /**
   * Get the closest inline parent of a node by `path`.
   *
   * @param {List|String} path
   * @return {Node|Null}
   */

  getClosestInline(path) {
    const closest = this.getClosest(path, n => n.object === 'inline')
    return closest
  }

  /**
   * Get the closest void parent of a node by `path`.
   *
   * @param {List|String} path
   * @return {Node|Null}
   */

  getClosestVoid(path) {
    const closest = this.getClosest(path, p => p.isVoid)
    return closest
  }

  /**
   * Get the common ancestor of nodes `a` and `b`.
   *
   * @param {List} a
   * @param {List} b
   * @return {Node}
   */

  getCommonAncestor(a, b) {
    a = this.resolvePath(a)
    b = this.resolvePath(b)
    if (!a || !b) return null

    const path = PathUtils.relate(a, b)
    const node = this.getNode(path)
    return node
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
   * Get the depth of a descendant, with optional `startAt`.
   *
   * @param {List|String} path
   * @param {Number} startAt
   * @return {Number|Null}
   */

  getDepth(path, startAt = 1) {
    path = this.resolvePath(path)
    if (!path) return null

    const node = this.getNode(path)
    const depth = node ? path.size - 1 + startAt : null
    return depth
  }

  /**
   * Get a descendant node.
   *
   * @param {List|String} path
   * @return {Node|Null}
   */

  getDescendant(path) {
    path = this.resolvePath(path)
    if (!path) return null

    const array = path.toArray()
    let descendant = this

    for (const index of array) {
      if (!descendant) return null
      if (!descendant.nodes) return null
      descendant = descendant.nodes.get(index)
    }

    return descendant
  }

  /**
   * Get the first invalid descendant
   *
   * @param {Schema} schema
   * @return {Node|Text|Null}
   */

  getFirstInvalidDescendant(schema) {
    let result = null

    this.nodes.find(n => {
      result = n.validate(schema) ? n : n.getFirstInvalidDescendant(schema)
      return result
    })

    return result
  }

  /**
   * Get the first child text node.
   *
   * @return {Node|Null}
   */

  getFirstText() {
    let descendant = null

    const found = this.nodes.find(node => {
      if (node.object === 'text') return true
      descendant = node.getFirstText()
      return !!descendant
    })

    return descendant || found
  }

  /**
   * Get a fragment of the node at a `range`.
   *
   * @param {Range} range
   * @return {Document}
   */

  getFragmentAtRange(range) {
    range = range.normalize(this)

    if (range.isUnset) {
      return Document.create()
    }

    const { startPath, startOffset, endPath, endOffset } = range
    let node = this
    let targetPath = endPath
    let targetPosition = endOffset
    let mode = 'end'

    while (targetPath.size) {
      const index = targetPath.last()
      node = node.splitNode(targetPath, targetPosition)
      targetPosition = index + 1
      targetPath = PathUtils.lift(targetPath)

      if (!targetPath.size && mode === 'end') {
        targetPath = startPath
        targetPosition = startOffset
        mode = 'start'
      }
    }

    const startIndex = startPath.first() + 1
    const endIndex = endPath.first() + 2
    const nodes = node.nodes.slice(startIndex, endIndex)
    const fragment = Document.create({ nodes })
    return fragment
  }

  /**
   * Get the furthest parent of a node that matches an `iterator`.
   *
   * @param {Path} path
   * @param {Function} iterator
   * @return {Node|Null}
   */

  getFurthest(path, iterator) {
    const ancestors = this.getAncestors(path)
    if (!ancestors) return null

    const furthest = ancestors.find((node, ...args) => {
      // We never want to include the top-level node.
      if (node === this) return false
      return iterator(node, ...args)
    })

    return furthest || null
  }

  /**
   * Get the furthest ancestor of a node.
   *
   * @param {Path} path
   * @return {Node|Null}
   */

  getFurthestAncestor(path) {
    path = this.resolvePath(path)
    if (!path) return null
    const furthest = path.size ? this.nodes.get(path.first()) : null
    return furthest
  }

  /**
   * Get the furthest block parent of a node.
   *
   * @param {Path} path
   * @return {Node|Null}
   */

  getFurthestBlock(path) {
    const furthest = this.getFurthest(path, n => n.object === 'block')
    return furthest
  }

  /**
   * Get the furthest inline parent of a node.
   *
   * @param {Path} path
   * @return {Node|Null}
   */

  getFurthestInline(path) {
    const furthest = this.getFurthest(path, n => n.object === 'inline')
    return furthest
  }

  /**
   * Get the furthest ancestor of a node that has only one child.
   *
   * @param {Path} path
   * @return {Node|Null}
   */

  getFurthestOnlyChildAncestor(path) {
    const ancestors = this.getAncestors(path)
    if (!ancestors) return null

    const furthest = ancestors
      .rest()
      .reverse()
      .takeUntil(p => p.nodes.size > 1)
      .last()

    return furthest || null
  }

  /**
   * Get the closest inline nodes for each text node in the node.
   *
   * @return {List<Node>}
   */

  getInlines() {
    const array = this.getInlinesAsArray()
    const list = new List(array)
    return list
  }

  /**
   * Get the closest inline nodes for each text node in the node, as an array.
   *
   * @return {List<Node>}
   */

  getInlinesAsArray() {
    let array = []

    this.nodes.forEach(child => {
      if (child.object == 'text') return

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
    const list = new List(new OrderedSet(array))
    return list
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

    const array = this.getTextsAtRangeAsArray(range)
      .map(text => this.getClosestInline(text.key))
      .filter(exists => exists)

    return array
  }

  /**
   * Get all of the leaf inline nodes that match a `type`.
   *
   * @param {String} type
   * @return {List<Node>}
   */

  getInlinesByType(type) {
    const array = this.getInlinesByTypeAsArray(type)
    const list = new List(array)
    return list
  }

  /**
   * Get all of the leaf inline nodes that match a `type` as an array.
   *
   * @param {String} type
   * @return {Array}
   */

  getInlinesByTypeAsArray(type) {
    const array = this.nodes.reduce((inlines, node) => {
      if (node.object == 'text') {
        return inlines
      } else if (node.isLeafInline() && node.type == type) {
        inlines.push(node)
        return inlines
      } else {
        return inlines.concat(node.getInlinesByTypeAsArray(type))
      }
    }, [])

    return array
  }

  /**
   * Get a set of the marks in a `range`.
   *
   * @param {Range} range
   * @return {Set<Mark>}
   */

  getInsertMarksAtRange(range) {
    range = range.normalize(this)
    if (range.isUnset) return Set()

    if (range.isCollapsed) {
      // PERF: range is not cachable, use key and offset as proxies for cache
      return this.getMarksAtPosition(range.startKey, range.startOffset)
    }

    const { startKey, startOffset } = range
    const text = this.getDescendant(startKey)
    const marks = text.getMarksAtIndex(startOffset + 1)
    return marks
  }

  /**
   * Get an object mapping all the keys in the node to their paths.
   *
   * @return {Object}
   */

  getKeysToPathsTable() {
    const ret = {
      [this.key]: [],
    }

    this.nodes.forEach((node, i) => {
      ret[node.key] = [i]

      if (node.object !== 'text') {
        const nested = node.getKeysToPathsTable()

        for (const key in nested) {
          const path = nested[key]
          ret[key] = [i, ...path]
        }
      }
    })

    return ret
  }

  /**
   * Get the last child text node.
   *
   * @return {Node|Null}
   */

  getLastText() {
    let descendant = null

    const found = this.nodes.findLast(node => {
      if (node.object == 'text') return true
      descendant = node.getLastText()
      return descendant
    })

    return descendant || found
  }

  /**
   * Get all of the marks for all of the characters of every text node.
   *
   * @return {Set<Mark>}
   */

  getMarks() {
    const array = this.getMarksAsArray()
    const set = new Set(array)
    return set
  }

  /**
   * Get all of the marks as an array.
   *
   * @return {Array}
   */

  getMarksAsArray() {
    const result = []

    this.nodes.forEach(node => {
      result.push(node.getMarksAsArray())
    })

    // PERF: use only one concat rather than multiple for speed.
    const array = [].concat(...result)
    return array
  }

  /**
   * Get a set of marks in a `position`, the equivalent of a collapsed range
   *
   * @param {string} key
   * @param {number} offset
   * @return {Set}
   */

  getMarksAtPosition(key, offset) {
    const text = this.getDescendant(key)
    const currentMarks = text.getMarksAtIndex(offset)
    if (offset !== 0) return currentMarks
    const closestBlock = this.getClosestBlock(key)

    if (closestBlock.text === '') {
      // insert mark for empty block; the empty block are often created by split node or add marks in a range including empty blocks
      return currentMarks
    }

    const previous = this.getPreviousText(key)
    if (!previous) return Set()

    if (closestBlock.hasDescendant(previous.key)) {
      return previous.getMarksAtIndex(previous.text.length)
    }

    return currentMarks
  }

  /**
   * Get a set of the marks in a `range`.
   *
   * @param {Range} range
   * @return {Set<Mark>}
   */

  getMarksAtRange(range) {
    const marks = new Set(this.getOrderedMarksAtRange(range))
    return marks
  }

  /**
   * Get all of the marks that match a `type`.
   *
   * @param {String} type
   * @return {Set<Mark>}
   */

  getMarksByType(type) {
    const array = this.getMarksByTypeAsArray(type)
    const set = new Set(array)
    return set
  }

  /**
   * Get all of the marks that match a `type` as an array.
   *
   * @param {String} type
   * @return {Array}
   */

  getMarksByTypeAsArray(type) {
    const array = this.nodes.reduce((memo, node) => {
      return node.object == 'text'
        ? memo.concat(node.getMarksAsArray().filter(m => m.type == type))
        : memo.concat(node.getMarksByTypeAsArray(type))
    }, [])

    return array
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

    if (child.object == 'block') {
      last = child.getLastText()
    } else {
      const block = this.getClosestBlock(key)
      last = block.getLastText()
    }

    const next = this.getNextText(last.key)
    if (!next) return null

    const closest = this.getClosestBlock(next.key)
    return closest
  }

  /**
   * Get the next node in the tree from a node.
   *
   * This will not only check for siblings but instead move up the tree
   * returning the next ancestor if no sibling is found.
   *
   * @param {List|String} path
   * @return {Node|Null}
   */

  getNextNode(path) {
    path = this.resolvePath(path)
    if (!path) return null
    if (!path.size) return null

    for (let i = path.size; i > 0; i--) {
      const p = path.slice(0, i)
      const target = PathUtils.increment(p)
      const node = this.getNode(target)
      if (node) return node
    }

    return null
  }

  /**
   * Get the next sibling of a node.
   *
   * @param {List|String} path
   * @return {Node|Null}
   */

  getNextSibling(path) {
    path = this.resolvePath(path)
    if (!path) return null
    if (!path.size) return null
    const p = PathUtils.increment(path)
    const sibling = this.getNode(p)
    return sibling
  }

  /**
   * Get the text node after a descendant text node.
   *
   * @param {List|String} path
   * @return {Node|Null}
   */

  getNextText(path) {
    path = this.resolvePath(path)
    if (!path) return null
    if (!path.size) return null
    const next = this.getNextNode(path)
    if (!next) return null
    const text = next.getFirstText()
    return text
  }

  /**
   * Get a node in the tree.
   *
   * @param {List|String} path
   * @return {Node|Null}
   */

  getNode(path) {
    path = this.resolvePath(path)
    if (!path) return null
    const node = path.size ? this.getDescendant(path) : this
    return node
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
    const ret = this.hasChild(key) ? offset : offset + child.getOffset(key)
    return ret
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
    const offset = this.getOffset(startKey) + startOffset
    return offset
  }

  /**
   * Get all of the marks for all of the characters of every text node.
   *
   * @return {OrderedSet<Mark>}
   */

  getOrderedMarks() {
    const array = this.getMarksAsArray()
    const set = new OrderedSet(array)
    return set
  }

  /**
   * Get a set of the marks in a `range`.
   *
   * @param {Range} range
   * @return {OrderedSet<Mark>}
   */

  getOrderedMarksAtRange(range) {
    range = range.normalize(this)
    if (range.isUnset) return OrderedSet()

    if (range.isCollapsed) {
      // PERF: range is not cachable, use key and offset as proxies for cache
      return this.getMarksAtPosition(range.startKey, range.startOffset)
    }

    const { startKey, startOffset, endKey, endOffset } = range
    const marks = this.getOrderedMarksBetweenPositions(
      startKey,
      startOffset,
      endKey,
      endOffset
    )

    return marks
  }

  /**
   * Get a set of the marks in a `range`.
   * PERF: arguments use key and offset for utilizing cache
   *
   * @param {string} startKey
   * @param {number} startOffset
   * @param {string} endKey
   * @param {number} endOffset
   * @returns {OrderedSet<Mark>}
   */

  getOrderedMarksBetweenPositions(startKey, startOffset, endKey, endOffset) {
    if (startKey === endKey) {
      const startText = this.getDescendant(startKey)
      return startText.getMarksBetweenOffsets(startOffset, endOffset)
    }

    const texts = this.getTextsBetweenPositionsAsArray(startKey, endKey)

    return OrderedSet().withMutations(result => {
      texts.forEach(text => {
        if (text.key === startKey) {
          result.union(
            text.getMarksBetweenOffsets(startOffset, text.text.length)
          )
        } else if (text.key === endKey) {
          result.union(text.getMarksBetweenOffsets(0, endOffset))
        } else {
          result.union(text.getMarks())
        }
      })
    })
  }

  /**
   * Get all of the marks that match a `type`.
   *
   * @param {String} type
   * @return {OrderedSet<Mark>}
   */

  getOrderedMarksByType(type) {
    const array = this.getMarksByTypeAsArray(type)
    const set = new OrderedSet(array)
    return set
  }

  /**
   * Get the parent of a descendant node.
   *
   * @param {List|String} path
   * @return {Node|Null}
   */

  getParent(path) {
    path = this.resolvePath(path)
    if (!path) return null
    if (!path.size) return null
    const parentPath = PathUtils.lift(path)
    const parent = this.getNode(parentPath)
    return parent
  }

  /**
   * Find the path to a node.
   *
   * @param {String|List} key
   * @return {List}
   */

  getPath(key) {
    // Handle the case of passing in a path directly, to match other methods.
    if (List.isList(key)) return key

    const dict = this.getKeysToPathsTable()
    const path = dict[key]
    return path ? List(path) : null
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

    if (child.object == 'block') {
      first = child.getFirstText()
    } else {
      const block = this.getClosestBlock(key)
      first = block.getFirstText()
    }

    const previous = this.getPreviousText(first.key)
    if (!previous) return null

    const closest = this.getClosestBlock(previous.key)
    return closest
  }

  /**
   * Get the previous node from a node in the tree.
   *
   * This will not only check for siblings but instead move up the tree
   * returning the previous ancestor if no sibling is found.
   *
   * @param {List|String} path
   * @return {Node|Null}
   */

  getPreviousNode(path) {
    path = this.resolvePath(path)
    if (!path) return null
    if (!path.size) return null

    for (let i = path.size; i > 0; i--) {
      const p = path.slice(0, i)
      if (p.last() === 0) continue

      const target = PathUtils.decrement(p)
      const node = this.getNode(target)
      if (node) return node
    }

    return null
  }

  /**
   * Get the previous sibling of a node.
   *
   * @param {List|String} path
   * @return {Node|Null}
   */

  getPreviousSibling(path) {
    path = this.resolvePath(path)
    if (!path) return null
    if (!path.size) return null
    if (path.last() === 0) return null
    const p = PathUtils.decrement(path)
    const sibling = this.getNode(p)
    return sibling
  }

  /**
   * Get the text node after a descendant text node.
   *
   * @param {List|String} path
   * @return {Node|Null}
   */

  getPreviousText(path) {
    path = this.resolvePath(path)
    if (!path) return null
    if (!path.size) return null
    const previous = this.getPreviousNode(path)
    if (!previous) return null
    const text = previous.getLastText()
    return text
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

  getSelectionIndexes(range, isSelected = true) {
    const { startKey, endKey } = range

    // PERF: if we're not selected, we can exit early.
    if (!isSelected) {
      return null
    }

    // if we've been given an invalid selection we can exit early.
    if (range.isUnset) {
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
      if (child.object == 'text') {
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
    const text = this.nodes.reduce((string, node) => {
      return string + node.text
    }, '')

    return text
  }

  /**
   * Get the descendent text node at an `offset`.
   *
   * @param {String} offset
   * @return {Node|Null}
   */

  getTextAtOffset(offset) {
    // PERF: Add a few shortcuts for the obvious cases.
    if (offset === 0) return this.getFirstText()
    if (offset === this.text.length) return this.getLastText()
    if (offset < 0 || offset > this.text.length) return null

    let length = 0
    const text = this.getTexts().find((node, i, nodes) => {
      length += node.text.length
      return length > offset
    })

    return text
  }

  /**
   * Get the direction of the node's text.
   *
   * @return {String}
   */

  getTextDirection() {
    const dir = direction(this.text)
    return dir === 'neutral' ? null : dir
  }

  /**
   * Recursively get all of the child text nodes in order of appearance.
   *
   * @return {List<Node>}
   */

  getTexts() {
    const array = this.getTextsAsArray()
    const list = new List(array)
    return list
  }

  /**
   * Recursively get all the leaf text nodes in order of appearance, as array.
   *
   * @return {List<Node>}
   */

  getTextsAsArray() {
    let array = []

    this.nodes.forEach(node => {
      if (node.object == 'text') {
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
    range = range.normalize(this)
    if (range.isUnset) return List()
    const { startKey, endKey } = range
    const list = new List(
      this.getTextsBetweenPositionsAsArray(startKey, endKey)
    )

    return list
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
    const texts = this.getTextsBetweenPositionsAsArray(startKey, endKey)
    return texts
  }

  /**
   * Get all of the text nodes in a `range` as an array.
   * PERF: use key in arguments for cache
   *
   * @param {string} startKey
   * @param {string} endKey
   * @returns {Array}
   */

  getTextsBetweenPositionsAsArray(startKey, endKey) {
    const startText = this.getDescendant(startKey)

    // PERF: the most common case is when the range is in a single text node,
    // where we can avoid a lot of iterating of the tree.
    if (startKey == endKey) return [startText]

    const endText = this.getDescendant(endKey)
    const texts = this.getTextsAsArray()
    const start = texts.indexOf(startText)
    const end = texts.indexOf(endText, start)
    const ret = texts.slice(start, end + 1)
    return ret
  }

  /**
   * Check if the node has block children.
   *
   * @return {Boolean}
   */

  hasBlockChildren() {
    return !!(this.nodes && this.nodes.find(n => n.object === 'block'))
  }

  /**
   * Check if a child node exists.
   *
   * @param {List|String} path
   * @return {Boolean}
   */

  hasChild(path) {
    const child = this.getChild(path)
    return !!child
  }

  /**
   * Check if a node has inline children.
   *
   * @return {Boolean}
   */

  hasInlineChildren() {
    return !!(
      this.nodes &&
      this.nodes.find(n => n.object === 'inline' || n.object === 'text')
    )
  }

  /**
   * Recursively check if a child node exists.
   *
   * @param {List|String} path
   * @return {Boolean}
   */

  hasDescendant(path) {
    const descendant = this.getDescendant(path)
    return !!descendant
  }

  /**
   * Recursively check if a node exists.
   *
   * @param {List|String} path
   * @return {Boolean}
   */

  hasNode(path) {
    const node = this.getNode(path)
    return !!node
  }

  /**
   * Check if a node has a void parent.
   *
   * @param {List|String} path
   * @return {Boolean}
   */

  hasVoidParent(path) {
    const closest = this.getClosestVoid(path)
    return !!closest
  }

  /**
   * Insert a `node`.
   *
   * @param {List|String} path
   * @param {Node} node
   * @return {Node}
   */

  insertNode(path, node) {
    path = this.resolvePath(path)
    const index = path.last()
    const parentPath = PathUtils.lift(path)
    let parent = this.assertNode(parentPath)
    const nodes = parent.nodes.splice(index, 0, node)
    parent = parent.set('nodes', nodes)
    const ret = this.replaceNode(parentPath, parent)
    return ret
  }

  /**
   * Insert `text` at `offset` in node by `path`.
   *
   * @param {List|String} path
   * @param {Number} offset
   * @param {String} text
   * @param {Set} marks
   * @return {Node}
   */

  insertText(path, offset, text, marks) {
    let node = this.assertDescendant(path)
    path = this.resolvePath(path)
    node = node.insertText(offset, text, marks)
    const ret = this.replaceNode(path, node)
    return ret
  }

  /**
   * Check whether the node is a leaf block.
   *
   * @return {Boolean}
   */

  isLeafBlock() {
    return (
      this.object === 'block' && this.nodes.every(n => n.object !== 'block')
    )
  }

  /**
   * Check whether the node is a leaf inline.
   *
   * @return {Boolean}
   */

  isLeafInline() {
    return (
      this.object === 'inline' && this.nodes.every(n => n.object !== 'inline')
    )
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
      if (ret !== node) nodes = nodes.set(ret.key, ret)
    })

    const ret = this.set('nodes', nodes)
    return ret
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

    nodes.forEach((node, index) => {
      let ret = node
      if (ret.object !== 'text') ret = ret.mapDescendants(iterator)
      ret = iterator(ret, index, this.nodes)
      if (ret === node) return

      nodes = nodes.set(index, ret)
    })

    const ret = this.set('nodes', nodes)
    return ret
  }

  /**
   * Merge a node backwards its previous sibling.
   *
   * @param {List|Key} path
   * @return {Node}
   */

  mergeNode(path) {
    const b = this.assertNode(path)
    path = this.resolvePath(path)

    if (path.last() === 0) {
      throw new Error(
        `Unable to merge node because it has no previous sibling: ${b}`
      )
    }

    const withPath = PathUtils.decrement(path)
    const a = this.assertNode(withPath)

    if (a.object !== b.object) {
      throw new Error(
        `Unable to merge two different kinds of nodes: ${a} and ${b}`
      )
    }

    const newNode =
      a.object === 'text'
        ? a.mergeText(b)
        : a.set('nodes', a.nodes.concat(b.nodes))

    let ret = this
    ret = ret.removeNode(path)
    ret = ret.removeNode(withPath)
    ret = ret.insertNode(withPath, newNode)
    return ret
  }

  /**
   * Move a node by `path` to `newPath`.
   *
   * A `newIndex` can be provided when move nodes by `key`, to account for not
   * being able to have a key for a location in the tree that doesn't exist yet.
   *
   * @param {List|Key} path
   * @param {List|Key} newPath
   * @param {Number} newIndex
   * @return {Node}
   */

  moveNode(path, newPath, newIndex = 0) {
    const node = this.assertNode(path)
    path = this.resolvePath(path)
    newPath = this.resolvePath(newPath, newIndex)

    const newParentPath = PathUtils.lift(newPath)
    this.assertNode(newParentPath)

    const [p, np] = PathUtils.crop(path, newPath)
    const position = PathUtils.compare(p, np)

    // If the old path ends above and before a node in the new path, then
    // removing it will alter the target, so we need to adjust the new path.
    if (path.size < newPath.size && position === -1) {
      newPath = PathUtils.decrement(newPath, 1, p.size - 1)
    }

    let ret = this
    ret = ret.removeNode(path)
    ret = ret.insertNode(newPath, node)
    return ret
  }

  /**
   * Attempt to "refind" a node by a previous `path`, falling back to looking
   * it up by `key` again.
   *
   * @param {List|String} path
   * @param {String} key
   * @return {Node|Null}
   */

  refindNode(path, key) {
    const node = this.getDescendant(path)
    const found = node && node.key === key ? node : this.getDescendant(key)
    return found
  }

  /**
   * Attempt to "refind" the path to a node by a previous `path`, falling back
   * to looking it up by `key`.
   *
   * @param {List|String} path
   * @param {String} key
   * @return {List|Null}
   */

  refindPath(path, key) {
    const node = this.getDescendant(path)
    const found = node && node.key === key ? path : this.getPath(key)
    return found
  }

  /**
   * Regenerate the node's key.
   *
   * @return {Node}
   */

  regenerateKey() {
    const key = KeyUtils.create()
    const node = this.set('key', key)
    return node
  }

  /**
   * Remove mark from text at `offset` and `length` in node.
   *
   * @param {List} path
   * @param {Number} offset
   * @param {Number} length
   * @param {Mark} mark
   * @return {Node}
   */

  removeMark(path, offset, length, mark) {
    let node = this.assertDescendant(path)
    path = this.resolvePath(path)
    node = node.removeMark(offset, length, mark)
    const ret = this.replaceNode(path, node)
    return ret
  }

  /**
   * Remove a node.
   *
   * @param {List|String} path
   * @return {Node}
   */

  removeNode(path) {
    this.assertDescendant(path)
    path = this.resolvePath(path)
    const deep = path.flatMap(x => List(['nodes', x]))
    const ret = this.deleteIn(deep)
    return ret
  }

  /**
   * Remove `text` at `offset` in node.
   *
   * @param {List|Key} path
   * @param {Number} offset
   * @param {String} text
   * @return {Node}
   */

  removeText(path, offset, text) {
    let node = this.assertDescendant(path)
    node = node.removeText(offset, text.length)
    const ret = this.replaceNode(path, node)
    return ret
  }

  /**
   * Replace a `node` in the tree.
   *
   * @param {List|Key} path
   * @param {Node} node
   * @return {Node}
   */

  replaceNode(path, node) {
    path = this.resolvePath(path)

    if (!path) {
      throw new Error(
        `Unable to replace a node because it could not be found in the first place: ${path}`
      )
    }

    if (!path.size) return node
    this.assertNode(path)
    const deep = path.flatMap(x => List(['nodes', x]))
    const ret = this.setIn(deep, node)
    return ret
  }

  /**
   * Resolve a path from a path list or key string.
   *
   * An `index` can be provided, in which case paths created from a key string
   * will have the index pushed onto them. This is helpful in cases where you
   * want to accept either a `path` or a `key, index` combination for targeting
   * a location in the tree that doesn't exist yet, like when inserting.
   *
   * @param {List|String} value
   * @param {Number} index
   * @return {List}
   */

  resolvePath(path, index) {
    if (typeof path === 'string') {
      path = this.getPath(path)

      if (index != null) {
        path = path.concat(index)
      }
    } else {
      path = PathUtils.create(path)
    }

    return path
  }

  /**
   * Set `properties` on a node.
   *
   * @param {List|String} path
   * @param {Object} properties
   * @return {Node}
   */

  setNode(path, properties) {
    let node = this.assertNode(path)
    node = node.merge(properties)
    const ret = this.replaceNode(path, node)
    return ret
  }

  /**
   * Set `properties` on `mark` on text at `offset` and `length` in node.
   *
   * @param {List|String} path
   * @param {Number} offset
   * @param {Number} length
   * @param {Mark} mark
   * @param {Object} properties
   * @return {Node}
   */

  setMark(path, offset, length, mark, properties) {
    let node = this.assertNode(path)
    node = node.updateMark(offset, length, mark, properties)
    const ret = this.replaceNode(path, node)
    return ret
  }

  /**
   * Split a node by `path` at `position` with optional `properties` to apply
   * to the newly split node.
   *
   * @param {List|String} path
   * @param {Number} position
   * @param {Object} properties
   * @return {Node}
   */

  splitNode(path, position, properties) {
    const child = this.assertNode(path)
    path = this.resolvePath(path)
    let a
    let b

    if (child.object === 'text') {
      ;[a, b] = child.splitText(position)
    } else {
      const befores = child.nodes.take(position)
      const afters = child.nodes.skip(position)
      a = child.set('nodes', befores)
      b = child.set('nodes', afters).regenerateKey()
    }

    if (properties && child.object !== 'text') {
      b = b.merge(properties)
    }

    let ret = this
    ret = ret.removeNode(path)
    ret = ret.insertNode(path, b)
    ret = ret.insertNode(path, a)
    return ret
  }

  /**
   * Normalize the node with a `schema`.
   *
   * @param {Schema} schema
   * @return {Function|Void}
   */

  normalize(schema) {
    return schema.normalizeNode(this)
  }

  /**
   * Validate the node against a `schema`.
   *
   * @param {Schema} schema
   * @return {Error|Void}
   */

  validate(schema) {
    return schema.validateNode(this)
  }

  /**
   * Deprecated.
   */

  getNodeAtPath(path) {
    logger.deprecate(
      `0.35.0`,
      'The `Node.getNodeAtPath` method has been combined into `Node.getNode`.'
    )

    return this.getNode(path)
  }

  getDescendantAtPath(path) {
    logger.deprecate(
      `0.35.0`,
      'The `Node.getDescendantAtPath` has been combined into `Node.getDescendant`.'
    )

    return this.getDescendant(path)
  }

  getKeys() {
    logger.deprecate(`0.35.0`, 'The `Node.getKeys` method is deprecated.')

    const keys = this.getKeysAsArray()
    return new Set(keys)
  }

  getKeysAsArray() {
    logger.deprecate(
      `0.35.0`,
      'The `Node.getKeysAsArray` method is deprecated.'
    )

    const dict = this.getKeysToPathsTable()
    const keys = []

    for (const key in dict) {
      if (this.key !== key) {
        keys.push(key)
      }
    }

    return keys
  }

  areDescendantsSorted(first, second) {
    logger.deprecate(
      `0.35.0`,
      'The `Node.areDescendantsSorted` method is deprecated. Use the new `PathUtils.compare` helper instead.'
    )

    first = KeyUtils.create(first)
    second = KeyUtils.create(second)

    const keys = this.getKeysAsArray().filter(k => k !== this.key)
    const firstIndex = keys.indexOf(first)
    const secondIndex = keys.indexOf(second)
    if (firstIndex == -1 || secondIndex == -1) return null

    return firstIndex < secondIndex
  }

  isInRange(range) {
    logger.deprecate(
      `0.35.0`,
      'The `Node.isInRange` method is deprecated. Use the new `PathUtils.compare` helper instead.'
    )

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

    texts.forEach(text => {
      if (node.hasDescendant(text.key)) memo = true
      return memo
    })

    return memo
  }
}

/**
 * Mix in assertion variants.
 */

const ASSERTS = ['Child', 'Depth', 'Descendant', 'Node', 'Parent', 'Path']

for (const method of ASSERTS) {
  Node.prototype[`assert${method}`] = function(path, ...args) {
    const ret = this[`get${method}`](path, ...args)

    if (ret == null) {
      throw new Error(
        `\`Node.assert${method}\` could not find node with path or key: ${path}`
      )
    }

    return ret
  }
}

/**
 * Memoize read methods.
 */

memoize(Node.prototype, [
  'getBlocksAsArray',
  'getBlocksAtRangeAsArray',
  'getBlocksByTypeAsArray',
  'getDecorations',
  'getFirstInvalidDescendant',
  'getFirstText',
  'getFragmentAtRange',
  'getInlinesAsArray',
  'getInlinesAtRangeAsArray',
  'getInlinesByTypeAsArray',
  'getMarksAsArray',
  'getMarksAtPosition',
  'getOrderedMarksBetweenPositions',
  'getInsertMarksAtRange',
  'getKeysToPathsTable',
  'getLastText',
  'getMarksByTypeAsArray',
  'getNextBlock',
  'getOffset',
  'getOffsetAtRange',
  'getPreviousBlock',
  'getText',
  'getTextAtOffset',
  'getTextDirection',
  'getTextsAsArray',
  'getTextsBetweenPositionsAsArray',
  'isLeafBlock',
  'isLeafInline',
  'normalize',
  'validate',
])

/**
 * Mix in `Node` methods.
 */

Object.getOwnPropertyNames(Node.prototype).forEach(method => {
  if (method === 'constructor') return
  Block.prototype[method] = Node.prototype[method]
  Inline.prototype[method] = Node.prototype[method]
  Document.prototype[method] = Node.prototype[method]
})

Block.createChildren = Node.createList
Inline.createChildren = Node.createList
Document.createChildren = Node.createList

/**
 * Export.
 *
 * @type {Object}
 */

export default Node
