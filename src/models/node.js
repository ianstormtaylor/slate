
import Block from './block'
import Character from './character'
import Data from './data'
import Document from './document'
import Inline from './inline'
import Mark from './mark'
import Normalize from '../utils/normalize'
import Selection from './selection'
import Text from './text'
import direction from 'direction'
import isInRange from '../utils/is-in-range'
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

  assertChild(key) {
    const child = this.getChild(key)

    if (!child) {
      key = Normalize.key(key)
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

  assertDescendant(key) {
    const descendant = this.getDescendant(key)

    if (!descendant) {
      key = Normalize.key(key)
      throw new Error(`Could not find a descendant node with key "${key}".`)
    }

    return descendant
  },

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
  },

  /**
   * Concat children `nodes` on to the end of the node.
   *
   * @param {List} nodes
   * @return {Node} node
   */

  concatChildren(nodes) {
    nodes = this.nodes.concat(nodes)
    return this.merge({ nodes })
  },

  /**
   * Decorate all of the text nodes with a `decorator` function.
   *
   * @param {Function} decorator
   * @return {Node} node
   */

  decorateTexts(decorator) {
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
   * Recursively filter all ancestor nodes with `iterator`, depth-first.
   *
   * @param {Function} iterator
   * @return {List} nodes
   */

  filterDescendantsDeep(iterator) {
    return this.nodes.reduce((matches, child, i, nodes) => {
      if (child.kind != 'text') matches = matches.concat(child.filterDescendantsDeep(iterator))
      if (iterator(child, i, nodes)) matches = matches.push(child)
      return matches
    }, Block.createList())
  },

  /**
   * Get the closest block nodes for each text node in the node.
   *
   * @return {List} nodes
   */

  getBlocks() {
    return this
      .getTexts()
      .map(text => this.getClosestBlock(text))
      .toOrderedSet()
      .toList()
  },

  /**
   * Get the closest block nodes for each text node in a `range`.
   *
   * @param {Selection} range
   * @return {List} nodes
   */

  getBlocksAtRange(range) {
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

  getChildrenAfter(key) {
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

  getChildrenAfterIncluding(key) {
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

  getChildrenBefore(key) {
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

  getChildrenBeforeIncluding(key) {
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

  getChildrenBetween(start, end) {
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

  getChildrenBetweenIncluding(start, end) {
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

  getClosest(key, iterator) {
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
    key = Normalize.key(key)
    return this.nodes.find(node => node.key == key)
  },

  /**
   * Get the common ancestor of nodes `one` and `two` by keys.
   *
   * @param {String or Node} one
   * @param {String or Node} two
   * @return {Node}
   */

  getCommonAncestor(one, two) {
    this.assertDescendant(one)
    this.assertDescendant(two)
    let ancestors = new List()
    let oneParent = this.getParent(one)
    let twoParent = this.getParent(two)

    while (oneParent) {
      ancestors = ancestors.push(oneParent)
      oneParent = this.getParent(oneParent)
    }

    while (twoParent) {
      if (ancestors.includes(twoParent)) return twoParent
      twoParent = this.getParent(twoParent)
    }
  },

  /**
   * Get the component for the node from a `schema`.
   *
   * @param {Schema} schema
   * @return {Component || Void}
   */

  getComponent(schema) {
    return schema.__getComponent(this)
  },

  /**
   * Get the decorations for the node from a `schema`.
   *
   * @param {Schema} schema
   * @return {Array}
   */

  getDecorators(schema) {
    return schema.__getDecorators(this)
  },

  /**
   * Get the decorations for a descendant by `key` given a `schema`.
   *
   * @param {String} key
   * @param {Schema} schema
   * @return {Array}
   */

  getDescendantDecorators(key, schema) {
    const descendant = this.assertDescendant(key)
    let child = this.getHighestChild(key)
    let decorators = []

    while (child != descendant) {
      decorators = decorators.concat(child.getDecorators(schema))
      child = child.getHighestChild(key)
    }

    decorators = decorators.concat(descendant.getDecorators(schema))
    return decorators
  },

  /**
   * Get a descendant node by `key`.
   *
   * @param {String} key
   * @return {Node or Null} node
   */

  getDescendant(key) {
    key = Normalize.key(key)

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
   * Get a descendant by `path`.
   *
   * @param {Array} path
   * @return {Node || Void}
   */

  getDescendantAtPath(path) {
    let descendant = this

    for (const index of path) {
      if (!descendant) return
      if (!descendant.nodes) return
      descendant = descendant.nodes.get(index)
    }

    return descendant
  },

  /**
   * Get the depth of a child node by `key`, with optional `startAt`.
   *
   * @param {String or Node} key
   * @param {Number} startAt (optional)
   * @return {Number} depth
   */

  getDepth(key, startAt = 1) {
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

  getFragmentAtRange(range) {
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

  getFurthest(key, iterator) {
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

  getFurthestBlock(key) {
    return this.getFurthest(key, node => node.kind == 'block')
  },

  /**
   * Get the furthest inline parent of a node by `key`.
   *
   * @param {String or Node} key
   * @return {Node or Null} node
   */

  getFurthestInline(key) {
    return this.getFurthest(key, node => node.kind == 'inline')
  },

  /**
   * Get the highest child ancestor of a node by `key`.
   *
   * @param {String or Node} key
   * @return {Node or Null} node
   */

  getHighestChild(key) {
    key = Normalize.key(key)
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

  getHighestOnlyChildParent(key) {
    let child = this.assertDescendant(key)
    let match = null
    let parent

    while (parent = this.getParent(child)) {
      if (parent == null || parent.nodes.size > 1) return match
      match = parent
      child = parent
    }
  },

  /**
   * Get the furthest inline nodes for each text node in the node.
   *
   * @return {List} nodes
   */

  getInlines() {
    return this
      .getTexts()
      .map(text => this.getFurthestInline(text))
      .filter(exists => exists)
      .toOrderedSet()
      .toList()
  },

  /**
   * Get the closest inline nodes for each text node in a `range`.
   *
   * @param {Selection} range
   * @return {List} nodes
   */

  getInlinesAtRange(range) {
    return this
      .getTextsAtRange(range)
      .map(text => this.getClosestInline(text))
      .filter(exists => exists)
      .toOrderedSet()
      .toList()
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
      .reduce((memo, char) => {
        return memo.union(char.marks)
      }, new Set())
  },

  /**
   * Get the block node before a descendant text node by `key`.
   *
   * @param {String or Node} key
   * @return {Node or Null} node
   */

  getNextBlock(key) {
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

  getNextSibling(key) {
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

  getNextText(key) {
    key = Normalize.key(key)
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

  getOffset(key) {
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

  getOffsetAtRange(range) {
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

  getParent(key) {
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
   * Get the path of a descendant node by `key`.
   *
   * @param {String || Node} node
   * @return {Array}
   */

  getPath(key) {
    key = Normalize.key(key)

    if (key == this.key) return []

    let child = this.assertDescendant(key)
    let path = []
    let parent

    while (parent = this.getParent(child)) {
      const index = parent.nodes.indexOf(child)
      path.unshift(index)
      child = parent
    }

    return path
  },

  /**
   * Get the node before a descendant node by `key`.
   *
   * @param {String or Node} key
   * @return {Node or Null} node
   */

  getPreviousSibling(key) {
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

  getPreviousText(key) {
    key = Normalize.key(key)
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

  getPreviousBlock(key) {
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

  getTextAtOffset(offset) {
    let length = 0
    return this
      .getTexts()
      .find((text) => {
        length += text.length
        return length >= offset
      })
  },

  /**
   * Get the direction of the node's text.
   *
   * @return {String} direction
   */

  getTextDirection() {
    const text = this.text
    const dir = direction(text)
    return dir == 'neutral'
      ? undefined
      : dir
  },

  /**
   * Recursively get all of the child text nodes in order of appearance.
   *
   * @return {List} nodes
   */

  getTexts() {
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

  getTextsAtRange(range) {
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

  hasChild(key) {
    return !!this.getChild(key)
  },

  /**
   * Recursively check if a child node exists by `key`.
   *
   * @param {String or Node} key
   * @return {Boolean} exists
   */

  hasDescendant(key) {
    return !!this.getDescendant(key)
  },

  /**
   * Check if a node has a void parent by `key`.
   *
   * @param {String or Node} key
   * @return {Boolean}
   */

  hasVoidParent(key) {
    return !!this.getClosest(key, parent => parent.isVoid)
  },

  /**
   * Insert a `node` at `index`.
   *
   * @param {Number} index
   * @param {Node} node
   * @return {Node}
   */

  insertNode(index, node) {
    const nodes = this.nodes.splice(index, 0, node)
    return this.merge({ nodes })
  },

  /**
   * Check if the inline nodes are split at a `range`.
   *
   * @param {Selection} range
   * @return {Boolean} isSplit
   */

  isInlineSplitAtRange(range) {
    range = range.normalize(this)
    if (range.isExpanded) throw new Error()

    const { startKey } = range
    const start = this.getFurthestInline(startKey) || this.getDescendant(startKey)
    return range.isAtStartOf(start) || range.isAtEndOf(start)
  },

  /**
   * Join a node by `key` with another `withKey`.
   *
   * @param {String} key
   * @param {String} withKey
   * @return {Node}
   */

  joinNode(key, withKey) {
    let node = this
    let target = node.assertPath(key)
    let withTarget = node.assertPath(withKey)
    let parent = node.getParent(target)
    const isParent = node == parent
    const index = parent.nodes.indexOf(target)

    if (target.kind == 'text') {
      let { characters } = withTarget
      characters = characters.concat(target.characters)
      withTarget = withTarget.merge({ characters })
    }

    else {
      const size = withTarget.nodes.size
      target.nodes.forEach((child, i) => {
        withTarget = withTarget.insertNode(size + i, child)
      })
    }

    parent = parent.removeNode(index)
    node = isParent ? parent : node.updateDescendant(parent)
    node = node.updateDescendant(withTarget)
    return node
  },

  /**
   * Map all child nodes, updating them in their parents. This method is
   * optimized to not return a new node if no changes are made.
   *
   * @param {Function} iterator
   * @return {Node} node
   */

  mapChildren(iterator) {
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

  mapDescendants(iterator) {
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

  normalize() {
    let node = this
    let keys = new Set()
    let removals = new Set()

    // Map this node's descendants, ensuring...
    node = node.mapDescendants((desc) => {
      if (removals.has(desc.key)) return desc

      // ...that there are no duplicate keys.
      if (keys.has(desc.key)) desc = desc.set('key', uid())
      keys = keys.add(desc.key)

      // ...that void nodes contain a single space of content.
      if (desc.isVoid && desc.text != ' ') {
        desc = desc.merge({
          nodes: Text.createList([{
            characters: Character.createList([{ text: ' ' }])
          }])
        })
      }

      // ...that no block or inline has no text node inside it.
      if (desc.kind != 'text' && desc.nodes.size == 0) {
        const text = Text.create()
        const nodes = desc.nodes.push(text)
        desc = desc.merge({ nodes })
      }

      // ...that no inline node is empty.
      if (desc.kind == 'inline' && desc.text == '') {
        removals = removals.add(desc.key)
      }

      return desc
    })

    // Remove any nodes marked for removal.
    removals.forEach((key) => {
      node = node.removeDescendant(key)
    })

    removals = removals.clear()

    // And, ensuring...
    node = node.mapDescendants((desc) => {
      if (desc.kind == 'text') {
        let next = node.getNextSibling(desc)

        // ...that there are no adjacent text nodes.
        if (next && next.kind == 'text') {
          while (next && next.kind == 'text') {
            const characters = desc.characters.concat(next.characters)
            desc = desc.merge({ characters })
            removals = removals.add(next.key)
            next = node.getNextSibling(next)
          }
        }

        // ...that there are no extra empty text nodes.
        else if (desc.length == 0) {
          const parent = node.getParent(desc)
          if (!removals.has(parent.key) && parent.nodes.size > 1) {
            removals = removals.add(desc.key)
          }
        }
      }

      return desc
    })

    // Remove any nodes marked for removal.
    removals.forEach((key) => {
      node = node.removeDescendant(key)
    })

    // Ensure that void nodes are surrounded by text nodes
    node = node.mapDescendants((desc) => {
        if (desc.kind == 'text') {
            return desc
        }

        const nodes = desc.nodes.reduce((accu, child, i) => {
            // We wrap only inline void nodes
            if (!child.isVoid || child.kind === 'block') {
                return accu.push(child)
            }

            const prev = accu.last()
            const next = desc.nodes.get(i + 1)

            if (!prev || prev.kind !== 'text') {
                accu = accu.push(Text.create())
            }

            accu = accu.push(child)

            if (!next || next.kind !== 'text') {
                accu = accu.push(Text.create())
            }

            return accu
        }, List())

        return desc.merge({ nodes })
    })

    return node
  },

  /**
   * Remove a `node` from the children node map.
   *
   * @param {String or Node} key
   * @return {Node} node
   */

  removeDescendant(key) {
    let node = this
    const desc = node.assertDescendant(key)
    let parent = node.getParent(desc)
    const index = parent.nodes.indexOf(desc)
    const isParent = node == parent
    const nodes = parent.nodes.splice(index, 1)

    parent = parent.merge({ nodes })
    node = isParent
      ? parent
      : node.updateDescendant(parent)

    return node
  },

  /**
   * Remove a node at `index`.
   *
   * @param {Number} index
   * @return {Node}
   */

  removeNode(index) {
    const nodes = this.nodes.splice(index, 1)
    return this.merge({ nodes })
  },

  /**
   * Split a node by `path` at `offset`.
   *
   * @param {String} path
   * @param {Number} offset
   * @return {Node}
   */

  splitNode(path, offset) {
    let base = this
    let node = base.assertPath(path)
    let parent = base.getParent(node)
    const isParent = base == parent
    const index = parent.nodes.indexOf(node)

    let child = node
    let one
    let two

    if (node.kind != 'text') {
      child = node.getTextAtOffset(offset)
    }

    while (child && child != parent) {
      if (child.kind == 'text') {
        const i = node.kind == 'text' ? offset : offset - node.getOffset(child)
        const { characters } = child
        const oneChars = characters.take(i)
        const twoChars = characters.skip(i)
        one = child.merge({ characters: oneChars })
        two = child.merge({ characters: twoChars, key: uid() })
      }

      else {
        const { nodes } = child
        const oneNodes = nodes.takeUntil(n => n.key == one.key).push(one)
        const twoNodes = nodes.skipUntil(n => n.key == one.key).rest().unshift(two)
        one = child.merge({ nodes: oneNodes }).normalize()
        two = child.merge({ nodes: twoNodes, key: uid() }).normalize()
      }

      child = base.getParent(child)
    }

    parent = parent.removeNode(index)
    parent = parent.insertNode(index, two)
    parent = parent.insertNode(index, one)
    base = isParent ? parent : base.updateDescendant(parent)
    return base
  },

  /**
   * Split the block nodes at a `range`, to optional `height`.
   *
   * @param {Selection} range
   * @param {Number} height (optional)
   * @return {Node}
   */

  splitBlockAtRange(range, height = 1) {
    const { startKey, startOffset } = range
    let base = this
    let node = base.assertDescendant(startKey)
    let parent = base.getClosestBlock(node)
    let offset = startOffset
    let h = 0

    while (parent && parent.kind == 'block' && h < height) {
      offset += parent.getOffset(node)
      node = parent
      parent = base.getClosestBlock(parent)
      h++
    }

    const path = base.getPath(node.key)
    return this.splitNode(path, offset)
      .normalize()
  },

  /**
   * Set a new value for a child node by `key`.
   *
   * @param {Node} node
   * @return {Node} node
   */

  updateDescendant(node) {
    this.assertDescendant(node)
    return this.mapDescendants(d => d.key == node.key ? node : d)
  },

  /**
   * Validate the node against a `schema`.
   *
   * @param {Schema} schema
   * @return {Object || Void}
   */

  validate(schema) {
    return schema.__validate(this)
  }

}

/**
 * Memoize read methods.
 */

memoize(Node, [
  'assertChild',
  'assertDescendant',
  'filterDescendants',
  'filterDescendantsDeep',
  'findDescendant',
  'getBlocks',
  'getBlocksAtRange',
  'getCharactersAtRange',
  'getChild',
  'getChildrenAfter',
  'getChildrenAfterIncluding',
  'getChildrenBefore',
  'getChildrenBeforeIncluding',
  'getChildrenBetween',
  'getChildrenBetweenIncluding',
  'getClosest',
  'getClosestBlock',
  'getClosestInline',
  'getComponent',
  'getDecorators',
  'getDepth',
  'getDescendant',
  'getDescendantDecorators',
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
  'getPreviousBlock',
  'getPreviousSibling',
  'getPreviousText',
  'getTextAtOffset',
  'getTextDirection',
  'getTexts',
  'getTextsAtRange',
  'hasChild',
  'hasDescendant',
  'hasVoidParent',
  'isInlineSplitAtRange',
  'validate'
])

/**
 * Export.
 */

export default Node
