// @flow

import Block from './block'
import Character from './character'
import Data from './data'
import Document from './document'
import Inline from './inline'
import Mark from './mark'
import Selection from './selection'
import Transforms from './transforms'
import Text from './text'
import includes from 'lodash/includes'
import memoize from '../utils/memoize'
import uid from '../utils/uid'
import { List, Map, OrderedSet, Set } from 'immutable'

/**
 * Node.
 *
 * And interface that `Document`, `Block` and `Inline` all implement, to make
 * working with the recursive node tree easier.
 */

const Node = {

  /**
   * Assert that a node has a child by `key` and return it.
   *
   * @param {String or Node} key
   * @return {Node}
   */

  assertChild(key:string | NodeType):NodeType {
    const child = this.getChild(key)

    if (!child) {
      key = normalizeKey(key)
      throw new Error(`Could not find a child node with key "${key}".`)
    }

    return child
  },

  /**
   * Assert that a node has a descendant by `key` and return it.
   *
   * @param {String or Node} key
   * @return {Node}
   */

  assertDescendant(key:string | NodeType):NodeType {
    const descendant = this.getDescendant(key)

    if (!descendant) {
      key = normalizeKey(key)
      throw new Error(`Could not find a descendant node with key "${key}".`)
    }

    return descendant
  },

  /**
   * Concat children `nodes` on to the end of the node.
   *
   * @param {List} nodes
   * @return {Node} node
   */

  concatChildren(nodes:List<NodeType>):NodeType {
    nodes = this.nodes.concat(nodes)
    return this.merge({ nodes })
  },

  /**
   * Decorate all of the text nodes with a `decorator` function.
   *
   * @param {Function} decorator
   * @return {Node} node
   */

  decorateTexts(decorator:Function):NodeType {
    return this.mapDescendants((child) => {
      return child.kind == 'text'
        ? child.decorateCharacters(decorator)
        : child
    })
  },

  /**
   * Recursively find all ancestor nodes by `iterator`.
   *
   * @param {Function} iterator
   * @return {Node} node
   */

  findDescendant(iterator:Function):NodeType {
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

  filterDescendants(iterator:Function):List<NodeType> {
    return this.nodes.reduce((matches, child, i, nodes) => {
      if (iterator(child, i, nodes)) matches = matches.push(child)
      if (child.kind != 'text') matches = matches.concat(child.filterDescendants(iterator))
      return matches
    }, Block.createList())
  },

  /**
   * Get the closest block nodes for each text node in the node.
   *
   * @return {List} nodes
   */

  getBlocks():List<NodeType> {
    return this
      .getTexts()
      .map(text => this.getClosestBlock(text))
      .toSet()
      .toList()
  },

  /**
   * Get the closest block nodes for each text node in a `range`.
   *
   * @param {Selection} range
   * @return {List} nodes
   */

  getBlocksAtRange(range:Selection):List<NodeType> {
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

  getCharactersAtRange(range:Selection):List<Character> {
    return this
      .getTextsAtRange(range)
      .reduce((characters, text) => {
        const chars = text.characters.filter((char, i) => isInRange(i, text, range))
        return characters.concat(chars)
      }, Character.createList())
  },

  /**
   * Get children after a child by `key`.
   *
   * @param {String or Node} key
   * @return {Node} node
   */

  getChildrenAfter(key:string):NodeType {
    const child = this.assertChild(key)
    const index = this.nodes.indexOf(child)
    return this.nodes.slice(index + 1)
  },

  /**
   * Get children after a child by `key`, including the child.
   *
   * @param {String or Node} key
   * @return {Node} node
   */

  getChildrenAfterIncluding(key:string | NodeType):NodeType {
    const child = this.assertChild(key)
    const index = this.nodes.indexOf(child)
    return this.nodes.slice(index)
  },

  /**
   * Get children before a child by `key`.
   *
   * @param {String or Node} key
   * @return {Node} node
   */

  getChildrenBefore(key:string | NodeType):NodeType {
    const child = this.assertChild(key)
    const index = this.nodes.indexOf(child)
    return this.nodes.slice(0, index)
  },

  /**
   * Get children before a child by `key`, including the child.
   *
   * @param {String or Node} key
   * @return {Node} node
   */

  getChildrenBeforeIncluding(key:string | NodeType):NodeType {
    const child = this.assertChild(key)
    const index = this.nodes.indexOf(child)
    return this.nodes.slice(0, index + 1)
  },

  /**
   * Get children between two child keys.
   *
   * @param {String or Node} start
   * @param {String or Node} end
   * @return {Node} node
   */

  getChildrenBetween(start:string | NodeType, end:string | NodeType):NodeType {
    start = this.assertChild(start)
    start = this.nodes.indexOf(start)
    end = this.assertChild(end)
    end = this.nodes.indexOf(end)
    return this.nodes.slice(start + 1, end)
  },

  /**
   * Get children between two child keys, including the two children.
   *
   * @param {String or Node} start
   * @param {String or Node} end
   * @return {Node} node
   */

  getChildrenBetweenIncluding(start:string | NodeType, end:string | NodeType):NodeType {
    start = this.assertChild(start)
    start = this.nodes.indexOf(start)
    end = this.assertChild(end)
    end = this.nodes.indexOf(end)
    return this.nodes.slice(start, end + 1)
  },

  /**
   * Get closest parent of node by `key` that matches `iterator`.
   *
   * @param {String or Node} key
   * @param {Function} iterator
   * @return {Node or Null} node
   */

  getClosest(key:string | NodeType, iterator:Function):?NodeType {
    let node = this.assertDescendant(key)

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

  getClosestBlock(key:string | NodeType):?NodeType {
    return this.getClosest(key, parent => parent.kind == 'block')
  },

  /**
   * Get the closest inline parent of a `node`.
   *
   * @param {String or Node} key
   * @return {Node or Null} node
   */

  getClosestInline(key:string | NodeType):?NodeType {
    return this.getClosest(key, parent => parent.kind == 'inline')
  },

  /**
   * Get a child node by `key`.
   *
   * @param {String or Node} key
   * @return {Node or Null} node
   */

  getChild(key:string | NodeType):?NodeType {
    key = normalizeKey(key)
    return this.nodes.find(node => node.key == key)
  },

  /**
   * Get a descendant node by `key`.
   *
   * @param {String} key
   * @return {Node or Null} node
   */

  getDescendant(key:string | NodeType):?NodeType {
    key = normalizeKey(key)

    let child = this.getChild(key)
    if (child) return child

    this.nodes.find((node) => {
      if (node.kind == 'text') return false
      child = node.getDescendant(key)
      return child
    })

    return child
  },

  /**
   * Get the depth of a child node by `key`, with optional `startAt`.
   *
   * @param {String or Node} key
   * @param {Number} startAt (optional)
   * @return {Number} depth
   */

  getDepth(key:string | NodeType, startAt:number = 1):number {
    this.assertDescendant(key)
    return this.hasChild(key)
      ? startAt
      : this
        .getHighestChild(key)
        .getDepth(key, startAt + 1)
  },

  /**
   * Get a fragment of the node at a `range`.
   *
   * @param {Selection} range
   * @return {List} nodes
   */

  getFragmentAtRange(range:Selection):List<NodeType> {
    let node = this
    let nodes = Block.createList()

    // If the range is collapsed, there's nothing to do.
    if (range.isCollapsed) return Document.create({ nodes })

    // Make sure the children exist.
    const { startKey, startOffset, endKey, endOffset } = range
    node.assertDescendant(startKey)
    node.assertDescendant(endKey)

    // Split at the start and end.
    const start = range.collapseToStart()
    node = node.splitBlockAtRange(start, Infinity)

    const next = node.getNextText(startKey)
    const end = startKey == endKey
      ? range.collapseToStartOf(next).moveForward(endOffset - startOffset)
      : range.collapseToEnd()
    node = node.splitBlockAtRange(end, Infinity)

    // Get the start and end nodes.
    const startNode = node.getNextSibling(node.getHighestChild(startKey))
    const endNode = startKey == endKey
      ? node.getHighestChild(next)
      : node.getHighestChild(endKey)

    nodes = node.getChildrenBetweenIncluding(startNode, endNode)

    // Return a new document fragment.
    return Document.create({ nodes })
  },

  /**
   * Get the furthest parent of a node by `key` that matches an `iterator`.
   *
   * @param {String or Node} key
   * @param {Function} iterator
   * @return {Node or Null}
   */

  getFurthest(key:string | NodeType, iterator:Function):?NodeType {
    let node = this.assertDescendant(key)
    let furthest = null

    while (node = this.getClosest(node, iterator)) {
      furthest = node
    }

    return furthest
  },

  /**
   * Get the furthest block parent of a node by `key`.
   *
   * @param {String or Node} key
   * @return {Node or Null} node
   */

  getFurthestBlock(key:string | NodeType):?NodeType {
    return this.getFurthest(key, node => node.kind == 'block')
  },

  /**
   * Get the furthest inline parent of a node by `key`.
   *
   * @param {String or Node} key
   * @return {Node or Null} node
   */

  getFurthestInline(key:string | NodeType):?NodeType {
    return this.getFurthest(key, node => node.kind == 'inline')
  },

  /**
   * Get the highest child ancestor of a node by `key`.
   *
   * @param {String or Node} key
   * @return {Node or Null} node
   */

  getHighestChild(key:string | NodeType):?NodeType {
    key = normalizeKey(key)
    return this.nodes.find(node => {
      if (node.key == key) return true
      if (node.kind == 'text') return false
      return node.hasDescendant(key)
    })
  },

  /**
   * Get the highest parent of a node by `key` which has an only child.
   *
   * @param {String or Node} key
   * @return {Node or Null}
   */

  getHighestOnlyChildParent(key:string | NodeType):?NodeType {
    let child = this.assertChild(key)
    let match = null
    let parent

    while (parent = this.getParent(child)) {
      if (parent == null || parent.nodes.size > 1) return match
      match = parent
      child = parent
    }
  },

  /**
   * Get the closest inline nodes for each text node in a `range`.
   *
   * @param {Selection} range
   * @return {List} nodes
   */

  getInlinesAtRange(range:Selection):List<NodeType> {
    return this
      .getTextsAtRange(range)
      .map(text => this.getClosestInline(text))
      .filter(exists => exists)
      .toSet()
      .toList()
  },

  /**
   * Get a set of the marks in a `range`.
   *
   * @param {Selection} range
   * @return {Set} marks
   */

  getMarksAtRange(range:Selection):Set<typeof Mark> {
    range = range.normalize(this)
    const { startKey, startOffset } = range
    const marks = Mark.createSet()

    // If the range is collapsed at the start of the node, check the previous.
    if (range.isCollapsed && startOffset == 0) {
      const text = this.getDescendant(startKey)
      const previous = this.getPreviousText(startKey)
      if (!previous || !previous.length) return marks
      const char = previous.characters.get(previous.length - 1)
      return char.marks
    }

    // If the range is collapsed, check the character before the start.
    if (range.isCollapsed) {
      const text = this.getDescendant(startKey)
      const char = text.characters.get(range.startOffset - 1)
      return char.marks
    }

    // Otherwise, get a set of the marks for each character in the range.
    return this
      .getCharactersAtRange(range)
      .map(char => char.marks)
      .toSet()
  },

  /**
   * Get the block node before a descendant text node by `key`.
   *
   * @param {String or Node} key
   * @return {Node or Null} node
   */

  getNextBlock(key:string | NodeType) {
    const child = this.assertDescendant(key)
    let last

    if (child.kind == 'block') {
      last = child.getTexts().last()
    } else {
      const block = this.getClosestBlock(key)
      last = block.getTexts().last()
    }

    const next = this.getNextText(last)
    if (!next) return null

    return this.getClosestBlock(next)
  },

  /**
   * Get the node after a descendant by `key`.
   *
   * @param {String or Node} key
   * @return {Node or Null} node
   */

  getNextSibling(key:string | NodeType) {
    const node = this.assertDescendant(key)
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

  getNextText(key:string | NodeType) {
    key = normalizeKey(key)
    return this.getTexts()
      .skipUntil(text => text.key == key)
      .get(1)
  },

  /**
   * Get the offset for a descendant text node by `key`.
   *
   * @param {String or Node} key
   * @return {Number} offset
   */

  getOffset(key:string | NodeType) {
    this.assertDescendant(key)

    // Calculate the offset of the nodes before the highest child.
    const child = this.getHighestChild(key)
    const offset = this.nodes
      .takeUntil(n => n == child)
      .reduce((memo, n) => memo + n.length, 0)

    // Recurse if need be.
    return this.hasChild(key)
      ? offset
      : offset + child.getOffset(key)
  },

  /**
   * Get the offset from a `range`.
   *
   * @param {Selection} range
   * @return {Number} offset
   */

  getOffsetAtRange(range:Selection):number {
    range = range.normalize(this)

    if (range.isExpanded) {
      throw new Error('The range must be collapsed to calculcate its offset.')
    }

    const { startKey, startOffset } = range
    return this.getOffset(startKey) + startOffset
  },

  /**
   * Get the parent of a child node by `key`.
   *
   * @param {String or Node} key
   * @return {Node or Null} node
   */

  getParent(key:string | NodeType) {
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

  getPreviousSibling(key:string | NodeType) {
    const node = this.assertDescendant(key)
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

  getPreviousText(key:string | NodeType) {
    key = normalizeKey(key)
    return this.getTexts()
      .takeUntil(text => text.key == key)
      .last()
  },

  /**
   * Get the block node before a descendant text node by `key`.
   *
   * @param {String or Node} key
   * @return {Node or Null} node
   */

  getPreviousBlock(key:string | NodeType) {
    const child = this.assertDescendant(key)
    let first

    if (child.kind == 'block') {
      first = child.getTexts().first()
    } else {
      const block = this.getClosestBlock(key)
      first = block.getTexts().first()
    }

    const previous = this.getPreviousText(first)
    if (!previous) return null

    return this.getClosestBlock(previous)
  },

  /**
   * Get the descendent text node at an `offset`.
   *
   * @param {String} offset
   * @return {Node or Null} node
   */

  getTextAtOffset(offset:string):?NodeType {
    let length = 0
    return this
      .getTexts()
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

  getTexts():List<NodeType> {
    return this.nodes.reduce((texts, node) => {
      return node.kind == 'text'
        ? texts.push(node)
        : texts.concat(node.getTexts())
    }, Block.createList())
  },

  /**
   * Get all of the text nodes in a `range`.
   *
   * @param {Selection} range
   * @return {List} nodes
   */

  getTextsAtRange(range:Selection):List<NodeType> {
    range = range.normalize(this)
    const { startKey, endKey } = range
    const texts = this.getTexts()
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

  hasChild(key:string | NodeType):boolean {
    return !!this.getChild(key)
  },

  /**
   * Recursively check if a child node exists by `key`.
   *
   * @param {String or Node} key
   * @return {Boolean} exists
   */

  hasDescendant(key:string | NodeType):boolean {
    return !!this.getDescendant(key)
  },

  /**
   * Check if a node has a void parent by `key`.
   *
   * @param {String or Node} key
   * @return {Boolean}
   */

  hasVoidParent(key:string | NodeType):boolean {
    return !!this.getClosest(key, parent => parent.isVoid)
  },

  /**
   * Insert child `nodes` after child by `key`.
   *
   * @param {String or Node} key
   * @param {List} nodes
   * @return {Node} node
   */

  insertChildrenAfter(key:string | NodeType, nodes:List<NodeType>):NodeType {
    const child = this.assertChild(key)
    const index = this.nodes.indexOf(child)

    nodes = this.nodes
      .slice(0, index + 1)
      .concat(nodes)
      .concat(this.nodes.slice(index + 1))

    return this.merge({ nodes })
  },

  /**
   * Insert child `nodes` before child by `key`.
   *
   * @param {String or Node} key
   * @param {List} nodes
   * @return {Node} node
   */

  insertChildrenBefore(key:string | NodeType, nodes:List<NodeType>):NodeType {
    const child = this.assertChild(key)
    const index = this.nodes.indexOf(child)

    nodes = this.nodes
      .slice(0, index)
      .concat(nodes)
      .concat(this.nodes.slice(index))

    return this.merge({ nodes })
  },

  /**
   * Check if the inline nodes are split at a `range`.
   *
   * @param {Selection} range
   * @return {Boolean} isSplit
   */

  isInlineSplitAtRange(range:Selection):boolean {
    range = range.normalize(this)
    if (range.isExpanded) throw new Error()

    const { startKey } = range
    const start = this.getFurthestInline(startKey) || this.getDescendant(startKey)
    return range.isAtStartOf(start) || range.isAtEndOf(start)
  },

  /**
   * Map all child nodes, updating them in their parents. This method is
   * optimized to not return a new node if no changes are made.
   *
   * @param {Function} iterator
   * @return {Node} node
   */

  mapChildren(iterator:Function):NodeType {
    let nodes = this.nodes

    nodes.forEach((node, i) => {
      let ret = iterator(node, i, this.nodes)
      if (ret != node) nodes = nodes.set(ret.key, ret)
    })

    return this.merge({ nodes })
  },

  /**
   * Map all descendant nodes, updating them in their parents. This method is
   * optimized to not return a new node if no changes are made.
   *
   * @param {Function} iterator
   * @return {Node} node
   */

  mapDescendants(iterator:Function):NodeType {
    let nodes = this.nodes

    nodes.forEach((node, i) => {
      let ret = node
      if (ret.kind != 'text') ret = ret.mapDescendants(iterator)
      ret = iterator(ret, i, this.nodes)
      if (ret == node) return

      const index = nodes.indexOf(node)
      nodes = nodes.set(index, ret)
    })

    return this.merge({ nodes })
  },

  /**
   * Normalize the node by joining any two adjacent text child nodes.
   *
   * @return {Node} node
   */

  normalize():NodeType {
    let node = this

    // Map this node's descendants, ensuring... ensuring there are no duplicate keys.
    const keys = []

    node = node.mapDescendants((desc) => {
      // That there are no duplicate keys.
      if (includes(keys, desc.key)) desc = desc.set('key', uid())
      keys.push(desc.key)

      // That void nodes contain no text.
      if (desc.isVoid && desc.length) {
        let text = desc.getTexts().first()
        let characters = text.characters.clear()
        text = text.merge({ characters })
        const nodes = desc.nodes.clear().push(text)
        desc = desc.merge({ nodes })
      }

      // That no block or inline node is empty.
      if (desc.kind != 'text' && desc.nodes.size == 0) {
        const text = Text.create()
        const nodes = desc.nodes.push(text)
        desc = desc.merge({ nodes })
      }

      return desc
    })

    // See if there are any adjacent text nodes.
    let first = node.findDescendant((child) => {
      if (child.kind != 'text') return
      const parent = node.getParent(child)
      const next = parent.getNextSibling(child)
      return next && next.kind == 'text'
    })

    // If no text nodes are adjacent, abort.
    if (!first) return node

    // Fix an adjacent text node if one exists.
    let parent = node.getParent(first)
    const isParent = node == parent
    const second = parent.getNextSibling(first)
    const characters = first.characters.concat(second.characters)
    first = first.merge({ characters })
    parent = parent.updateDescendant(first)

    // Then remove the second text node.
    parent = parent.removeDescendant(second)

    // And update the node.
    node = isParent
      ? parent
      : node.updateDescendant(parent)

    // Recurse by normalizing again.
    return node.normalize()
  },

  /**
   * Remove children after a child by `key`.
   *
   * @param {String or Node} key
   * @return {Node} node
   */

  removeChildrenAfter(key:string | NodeType) {
    const child = this.assertChild(key)
    const index = this.nodes.indexOf(child)
    const nodes = this.nodes.slice(0, index + 1)
    return this.merge({ nodes })
  },

  /**
   * Remove children after a child by `key`, including the child.
   *
   * @param {String or Node} key
   * @return {Node} node
   */

  removeChildrenAfterIncluding(key:string | NodeType) {
    const child = this.assertChild(key)
    const index = this.nodes.indexOf(child)
    const nodes = this.nodes.slice(0, index)
    return this.merge({ nodes })
  },

  /**
   * Remove a `node` from the children node map.
   *
   * @param {String or Node} key
   * @return {Node} node
   */

  removeDescendant(key:string | NodeType) {
    this.assertDescendant(key)

    const child = this.getChild(key)

    if (child) {
      const nodes = this.nodes.filterNot(node => node == child)
      return this.merge({ nodes })
    }

    const nodes = this.mapChildren(n => n.kind == 'text' ? n : n.removeDescendant(key))
    return this.merge({ nodes })
  },

  /**
   * Set a new value for a child node by `key`.
   *
   * @param {Node} node
   * @return {Node} node
   */

  updateDescendant(node:NodeType):NodeType {
    this.assertDescendant(node)
    return this.mapDescendants(d => d.key == node.key ? node : d)
  }

}

/**
 * Normalize a `key`, from a key string or a node.
 *
 * @param {String or Node} key
 * @return {String} key
 */

function normalizeKey(key:string | NodeType):string {
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
 * Transforms.
 */

for (const key in Transforms) {
  Node[key] = Transforms[key]
}

/**
 * Memoize read methods.
 */

memoize(Node, [
  'assertChild',
  'assertDescendant',
  'findDescendant',
  'filterDescendants',
  'getBlocks',
  'getBlocksAtRange',
  'getCharactersAtRange',
  'getChildrenAfter',
  'getChildrenAfterIncluding',
  'getChildrenBefore',
  'getChildrenBeforeIncluding',
  'getChildrenBetween',
  'getChildrenBetweenIncluding',
  'getClosest',
  'getClosestBlock',
  'getClosestInline',
  'getChild',
  'getDescendant',
  'getDepth',
  'getFragmentAtRange',
  'getFurthest',
  'getFurthestBlock',
  'getFurthestInline',
  'getHighestChild',
  'getHighestOnlyChildParent',
  'getInlinesAtRange',
  'getMarksAtRange',
  'getNextBlock',
  'getNextSibling',
  'getNextText',
  'getOffset',
  'getOffsetAtRange',
  'getParent',
  'getPreviousSibling',
  'getPreviousText',
  'getPreviousBlock',
  'getTextAtOffset',
  'getTexts',
  'getTextsAtRange',
  'hasChild',
  'hasDescendant',
  'hasVoidParent',
  'isInlineSplitAtRange'
])

/**
 * Export.
 */

export default Node
