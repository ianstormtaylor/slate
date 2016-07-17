
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
   * Get the closest block nodes for each text node in the node.
   *
   * @return {List} nodes
   */

  getBlocks() {
    return this
      .getTextNodes()
      .reduce((blocks, text) => {
        const block = this.getClosestBlock(text)
        return blocks.includes(block)
          ? blocks
          : blocks.push(block)
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
   * Get children after a child by `key`.
   *
   * @param {String or Node} key
   * @return {Node} node
   */

  getChildrenAfter(key) {
    const child = this.getChild(key)
    const index = this.nodes.indexOf(child)
    const nodes = this.nodes.slice(index + 1)
    return nodes
  },

  /**
   * Get children after a child by `key`, including the child.
   *
   * @param {String or Node} key
   * @return {Node} node
   */

  getChildrenAfterIncluding(key) {
    const child = this.getChild(key)
    const index = this.nodes.indexOf(child)
    const nodes = this.nodes.slice(index)
    return nodes
  },

  /**
   * Get children before a child by `key`.
   *
   * @param {String or Node} key
   * @return {Node} node
   */

  getChildrenBefore(key) {
    const child = this.getChild(key)
    const index = this.nodes.indexOf(child)
    const nodes = this.nodes.slice(0, index)
    return nodes
  },

  /**
   * Get children before a child by `key`, including the child.
   *
   * @param {String or Node} key
   * @return {Node} node
   */

  getChildrenBeforeIncluding(key) {
    const child = this.getChild(key)
    const index = this.nodes.indexOf(child)
    const nodes = this.nodes.slice(0, index + 1)
    return nodes
  },

  /**
   * Get children between two child keys.
   *
   * @param {String or Node} start
   * @param {String or Node} end
   * @return {Node} node
   */

  getChildrenBetween(start, end) {
    start = this.getChild(start)
    start = this.nodes.indexOf(start)
    end = this.getChild(end)
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
    start = this.getChild(start)
    start = this.nodes.indexOf(start)
    end = this.getChild(end)
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
   * Get all of the blocks closest to text nodes.
   *
   * @return {List} nodes
   */

  getDeepestBlocks() {
    const texts = this.getTextNodes()
    const set = texts.reduce((memo, text) => {
      return memo.add(this.getClosestBlock(text))
    }, new OrderedSet())

    return set.toList()
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
    node.assertHasDescendant(startKey)
    node.assertHasDescendant(endKey)

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
   * Get the highest parent of a node by `key` which has an only child.
   *
   * @param {String or Node} key
   * @return {Node or Null}
   */

  getHighestOnlyChildParent(key) {
    let child = this.getChild(key)
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
      .reduce((memo, char) => memo.union(char.marks), marks)
  },

  /**
   * Get the block node before a descendant text node by `key`.
   *
   * @param {String or Node} key
   * @return {Node or Null} node
   */

  getNextBlock(key) {
    key = normalizeKey(key)
    const child = this.getDescendant(key)
    let last

    if (child.kind == 'block') {
      last = child.getTextNodes().last()
    } else {
      const block = this.getClosestBlock(key)
      last = block.getTextNodes().last()
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
    if (range.isExpanded) {
      throw new Error('The range must be collapsed to calculcate its offset.')
    }

    const { startKey, startOffset } = range
    const startNode = this.getDescendant(startKey)

    if (!startNode) {
      throw new Error(`Could not find a node by startKey "${startKey}".`)
    }

    return this.getOffset(startKey) + startOffset
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
   * Get the block node before a descendant text node by `key`.
   *
   * @param {String or Node} key
   * @return {Node or Null} node
   */

  getPreviousBlock(key) {
    key = normalizeKey(key)
    const child = this.getDescendant(key)
    let first

    if (child.kind == 'block') {
      first = child.getTextNodes().first()
    } else {
      const block = this.getClosestBlock(key)
      first = block.getTextNodes().first()
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
    return !!this.nodes.find(node => node.key == key)
  },

  /**
   * Recursively check if a child node exists by `key`.
   *
   * @param {String or Node} key
   * @return {Boolean} exists
   */

  hasDescendant(key) {
    key = normalizeKey(key)
    return !!this.nodes.find((node) => {
      return node.kind == 'text'
        ? node.key == key
        : node.key == key || node.hasDescendant(key)
    })
  },

  /**
   * Check if a node has a void parent by `key`.
   *
   * @param {String or Node} key
   * @return {Boolean}
   */

  hasVoidParent(key) {
    return !!this.getClosest(key, n => n.isVoid)
  },

  /**
   * Insert child `nodes` after child by `key`.
   *
   * @param {String or Node} key
   * @param {List} nodes
   * @return {Node} node
   */

  insertChildrenAfter(key, nodes) {
    const child = this.getChild(key)
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

  insertChildrenBefore(key, nodes) {
    key = normalizeKey(key)
    const child = this.getChild(key)
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

  isInlineSplitAtRange(range) {
    range = range.normalize(this)
    if (range.isExpanded) throw new Error()

    const { startKey } = range
    const start = this.getFurthestInline(startKey) || this.getDescendant(startKey)
    return range.isAtStartOf(start) || range.isAtEndOf(start)
  },

  /**
   * Map all children nodes, updating them in their parents.
   *
   * @param {Function} iterator
   * @return {Node} node
   */

  mapDescendants(iterator) {
    const nodes = this.nodes.map((node, i, original) => {
      if (node.kind != 'text') node = node.mapDescendants(iterator)
      return iterator(node, i, original)
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

    // Map this node's descendants, ensuring... ensuring there are no duplicate keys.
    const keys = []

    node = node.mapDescendants((desc) => {
      // That there are no duplicate keys.
      if (includes(keys, desc.key)) desc = desc.set('key', uid())
      keys.push(desc.key)

      // That void nodes contain no text.
      if (desc.isVoid && desc.length) {
        let text = desc.getTextNodes().first()
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

  removeChildrenAfter(key) {
    const child = this.getChild(key)
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

  removeChildrenAfterIncluding(key) {
    const child = this.getChild(key)
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
   * Set a new value for a child node by `key`.
   *
   * @param {Node} node
   * @return {Node} node
   */

  updateDescendant(node) {
    this.assertHasDescendant(node)

    if (this.hasChild(node)) {
      const nodes = this.nodes.map(child => child.key == node.key ? node : child)
      return this.merge({ nodes })
    }

    const nodes = this.nodes.map((child) => {
      if (child.kind == 'text') return child
      if (!child.hasDescendant(node)) return child
      return child.updateDescendant(node)
    })

    return this.merge({ nodes })
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
 * Transforms.
 */

for (const key in Transforms) {
  Node[key] = Transforms[key]
}

/**
 * Export.
 */

export default Node
