
import Block from './block'
import Character from './character'
import Document from './document'
import Mark from './mark'
import Normalize from '../utils/normalize'
import direction from 'direction'
import isInRange from '../utils/is-in-range'
import memoize from '../utils/memoize'
import generateKey from '../utils/generate-key'
import { List, Set } from 'immutable'

/**
 * Node.
 *
 * And interface that `Document`, `Block` and `Inline` all implement, to make
 * working with the recursive node tree easier.
 *
 * @type {Object}
 */

const Node = {

  /**
   * Return a set of all keys in the node.
   *
   * @return {Set<Node>}
   */

  getKeys() {
    const keys = []

    this.forEachDescendant(desc => {
      keys.push(desc.key)
    })

    return Set(keys)
  },

  /**
   * Get the concatenated text `string` of all child nodes.
   *
   * @return {String}
   */

  getText() {
    return this.nodes.reduce((result, node) => {
      return result + node.text
    }, '')
  },

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
  },

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
  },

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
   * @param {List<Node>} nodes
   * @return {Node}
   */

  concatChildren(nodes) {
    nodes = this.nodes.concat(nodes)
    return this.merge({ nodes })
  },

  /**
   * Decorate all of the text nodes with a `decorator` function.
   *
   * @param {Function} decorator
   * @return {Node}
   */

  decorateTexts(decorator) {
    return this.mapDescendants((child) => {
      return child.kind == 'text'
        ? child.decorateCharacters(decorator)
        : child
    })
  },

  /**
   * Recursively find all descendant nodes by `iterator`. Breadth first.
   *
   * @param {Function} iterator
   * @return {Node|Null}
   */

  findDescendant(iterator) {
    const childFound = this.nodes.find(iterator)
    if (childFound) return childFound

    let descendantFound = null

    this.nodes.find(node => {
      if (node.kind != 'text') {
        descendantFound = node.findDescendant(iterator)
        return descendantFound
      } else {
        return false
      }
    })

    return descendantFound
  },

  /**
   * Recursively find all descendant nodes by `iterator`. Depth first.
   *
   * @param {Function} iterator
   * @return {Node|Null}
   */

  findDescendantDeep(iterator) {
    let found

    this.forEachDescendant(node => {
      if (iterator(node)) {
        found = node
        return false
      }
    })

    return found
  },

  /**
   * Recursively iterate over all descendant nodes with `iterator`.
   *
   * @param {Function} iterator
   */

  forEachDescendant(iterator) {
    // If the iterator returns false it will break the loop.
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
  },

  /**
   * Recursively filter all descendant nodes with `iterator`.
   *
   * @param {Function} iterator
   * @return {List<Node>}
   */

  filterDescendants(iterator) {
    const matches = []

    this.forEachDescendant((child, i, nodes) => {
      if (iterator(child, i, nodes)) matches.push(child)
    })

    return List(matches)
  },

  /**
   * Recursively filter all descendant nodes with `iterator`, depth-first.
   * It is different from `filterDescendants` in regard of the order of results.
   *
   * @param {Function} iterator
   * @return {List<Node>}
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
   * @return {List<Node>}
   */

  getBlocks() {
    return this
      .getTexts()
      .map(text => this.getClosestBlock(text.key))
      .toOrderedSet()
      .toList()
  },

  /**
   * Get the closest block nodes for each text node in a `range`.
   *
   * @param {Selection} range
   * @return {List<Node>}
   */

  getBlocksAtRange(range) {
    return this
      .getTextsAtRange(range)
      .map(text => this.getClosestBlock(text.key))
  },

  /**
   * Get a list of the characters in a `range`.
   *
   * @param {Selection} range
   * @return {List<Node>} characters
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
   * Get children between two child keys.
   *
   * @param {String} start
   * @param {String} end
   * @return {Node}
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
   * @param {String} start
   * @param {String} end
   * @return {Node}
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
   * @param {String} key
   * @param {Function} iterator
   * @return {Node|Null}
   */

  getClosest(key, iterator) {
    key = Normalize.key(key)
    let ancestors = this.getAncestors(key)
    if (!ancestors) {
      throw new Error(`Could not find a descendant node with key "${key}".`)
    }

    // Exclude this node itself
    return ancestors.rest().findLast(iterator)
  },

  /**
   * Get the closest block parent of a `node`.
   *
   * @param {String} key
   * @return {Node|Null}
   */

  getClosestBlock(key) {
    return this.getClosest(key, parent => parent.kind == 'block')
  },

  /**
   * Get the closest inline parent of a `node`.
   *
   * @param {String} key
   * @return {Node|Null}
   */

  getClosestInline(key) {
    return this.getClosest(key, parent => parent.kind == 'inline')
  },

  /**
   * Get a child node by `key`.
   *
   * @param {String} key
   * @return {Node|Null}
   */

  getChild(key) {
    key = Normalize.key(key)
    return this.nodes.find(node => node.key == key)
  },

  /**
   * Get the common ancestor of nodes `one` and `two` by keys.
   *
   * @param {String} one
   * @param {String} two
   * @return {Node}
   */

  getCommonAncestor(one, two) {
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
  },

  /**
   * Get the component for the node from a `schema`.
   *
   * @param {Schema} schema
   * @return {Component|Void}
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
    if (!schema.hasDecorators) {
      return []
    }

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
   * @return {Node|Null}
   */

  getDescendant(key) {
    key = Normalize.key(key)
    return this._getDescendant(key)
  },

  // This one is memoized
  _getDescendant(key) {
    let descendantFound = null

    const found = this.nodes.find(node => {
      if (node.key === key) {
        return node
      } else if (node.kind !== 'text') {
        descendantFound = node._getDescendant(key)
        return descendantFound
      } else {
        return false
      }
    })

    return descendantFound || found
  },

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
  },

  /**
   * True if the node has both descendants in that order, false
   * otherwise. The order is depth-first, post-order.
   *
   * @param {String} key1
   * @param {String} key2
   * @return {Boolean} True if nodes are found in this order
   */

  areDescendantSorted(key1, key2) {
    let sorted

    this.forEachDescendant(n => {
      if (n.key === key1) {
        sorted = true
        return false
      } else if (n.key === key2) {
        sorted = false
        return false
      }
    })

    return sorted
  },

  /**
   * Get the depth of a child node by `key`, with optional `startAt`.
   *
   * @param {String} key
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
   * @return {List<Node>}
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
    const startNode = node.getNextSibling(node.getHighestChild(startKey).key)
    const endNode = startKey == endKey
      ? node.getHighestChild(next.key)
      : node.getHighestChild(endKey)

    nodes = node.getChildrenBetweenIncluding(startNode.key, endNode.key)

    // Return a new document fragment.
    return Document.create({ nodes })
  },

  /**
   * Get the furthest parent of a node by `key` that matches an `iterator`.
   *
   * @param {String} key
   * @param {Function} iterator
   * @return {Node|Null}
   */

  getFurthest(key, iterator) {
    let ancestors = this.getAncestors(key)
    if (!ancestors) {
      key = Normalize.key(key)
      throw new Error(`Could not find a descendant node with key "${key}".`)
    }

    // Exclude this node itself
    return ancestors.rest().find(iterator)
  },

  /**
   * Get the furthest block parent of a node by `key`.
   *
   * @param {String} key
   * @return {Node|Null}
   */

  getFurthestBlock(key) {
    return this.getFurthest(key, node => node.kind == 'block')
  },

  /**
   * Get the furthest inline parent of a node by `key`.
   *
   * @param {String} key
   * @return {Node|Null}
   */

  getFurthestInline(key) {
    return this.getFurthest(key, node => node.kind == 'inline')
  },

  /**
   * Get the highest child ancestor of a node by `key`.
   *
   * @param {String} key
   * @return {Node|Null}
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
   * @param {String} key
   * @return {Node|Null}
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
   * @return {List<Node>}
   */

  getInlines() {
    return this
      .getTexts()
      .map(text => this.getFurthestInline(text.key))
      .filter(exists => exists)
      .toOrderedSet()
      .toList()
  },

  /**
   * Get the closest inline nodes for each text node in a `range`.
   *
   * @param {Selection} range
   * @return {List<Node>}
   */

  getInlinesAtRange(range) {
    return this
      .getTextsAtRange(range)
      .map(text => this.getClosestInline(text.key))
      .filter(exists => exists)
      .toOrderedSet()
      .toList()
  },

  /**
   * Get a set of the marks in a `range`.
   *
   * @param {Selection} range
   * @return {Set<Mark>}
   */

  getMarksAtRange(range) {
    range = range.normalize(this)
    const { startKey, startOffset } = range
    const marks = Mark.createSet()

    // If the range is collapsed at the start of the node, check the previous.
    if (range.isCollapsed && startOffset == 0) {
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
  },

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
  },

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
  },

  /**
   * Get a node in the tree by `key`.
   *
   * @param {String} key
   * @return {Node|Null}
   */

  getNode(key) {
    key = Normalize.key(key)
    return this.key == key ? this : this.getDescendant(key)
  },

  /**
   * Get the offset for a descendant text node by `key`.
   *
   * @param {String} key
   * @return {Number}
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
   * @return {Number}
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
  },

  /**
   * Get the path of a descendant node by `key`.
   *
   * @param {String|Node} key
   * @return {Array}
   */

  getPath(key) {
    key = Normalize.key(key)

    if (key == this.key) return []

    let path = []
    let childKey = key
    let parent

    // Efficient with getParent memoization
    while (parent = this.getParent(childKey)) {
      const index = parent.nodes.findIndex(n => n.key === childKey)
      path.unshift(index)
      childKey = parent.key
    }

    if (childKey === key) {
      // Did not loop once, meaning we could not find the child
      throw new Error(`Could not find a descendant node with key "${key}".`)
    } else {
      return path
    }
  },

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
  },

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
  },

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
  },

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
  },

  /**
   * Get the descendent text node at an `offset`.
   *
   * @param {String} offset
   * @return {Node|Null}
   */

  getTextAtOffset(offset) {
    let length = 0
    return this
      .getTexts()
      .find((text, i, texts) => {
        const next = texts.get(i + 1)
        length += text.length

        // If the next text is an empty string, return false, because we want
        // the furthest text node at the offset, and it will also match.
        if (next && next.length == 0) return false

        return length >= offset
      })
  },

  /**
   * Get the direction of the node's text.
   *
   * @return {String}
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
   * @return {List<Node>}
   */

  getTexts() {
    return List(this._getTexts())
  },

  // This one is memoized for performance.
  _getTexts() {
    return this.nodes.reduce((texts, node) => {
      if (node.kind == 'text') {
        texts.push(node)
        return texts
      } else {
        return texts.concat(node._getTexts())
      }
    }, [])
  },

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
  },

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
  },

  /**
   * Get all of the text nodes in a `range`.
   *
   * @param {Selection} range
   * @return {List<Node>}
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
   * @param {String} key
   * @return {Boolean}
   */

  hasChild(key) {
    return !!this.getChild(key)
  },

  /**
   * Recursively check if a child node exists by `key`.
   *
   * @param {String} key
   * @return {Boolean}
   */

  hasDescendant(key) {
    return !!this.getDescendant(key)
  },

  /**
   * Recursively check if a node exists by `key`.
   *
   * @param {String} key
   * @return {Boolean}
   */

  hasNode(key) {
    return !!this.getNode(key)
  },

  /**
   * Check if a node has a void parent by `key`.
   *
   * @param {String} key
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
    let keys = this.getKeys()

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
    return this.merge({ nodes })
  },

  /**
   * Check if the inline nodes are split at a `range`.
   *
   * @param {Selection} range
   * @return {Boolean}
   */

  isInlineSplitAtRange(range) {
    range = range.normalize(this)
    if (range.isExpanded) throw new Error()

    const { startKey } = range
    const start = this.getFurthestInline(startKey) || this.getDescendant(startKey)
    return range.isAtStartOf(start) || range.isAtEndOf(start)
  },

  /**
   * Join a children node `first` with another children node `second`.
   * `first` and `second` will be concatenated in that order.
   * `first` and `second` must be two Nodes or two Text.
   *
   * @param {Node} first
   * @param {Node} second
   * @param {Boolean} options.deep (optional) Join recursively the
   * respective last node and first node of the nodes' children. Like a zipper :)
   * @return {Node}
   */

  joinNode(first, second, options) {
    const { deep = false } = options
    let node = this
    let parent = node.getParent(second.key)
    const isParent = node == parent
    const index = parent.nodes.indexOf(second)

    if (second.kind == 'text') {
      let { characters } = first
      characters = characters.concat(second.characters)
      first = first.merge({ characters })
    }

    else {
      const size = first.nodes.size
      second.nodes.forEach((child, i) => {
        first = first.insertNode(size + i, child)
      })

      if (deep) {
        // Join recursively
        first = first.joinNode(first.nodes.get(size - 1), first.nodes.get(size), { deep })
      }
    }

    parent = parent.removeNode(index)
    node = isParent ? parent : node.updateDescendant(parent)
    node = node.updateDescendant(first)
    return node
  },

  /**
   * Map all child nodes, updating them in their parents. This method is
   * optimized to not return a new node if no changes are made.
   *
   * @param {Function} iterator
   * @return {Node}
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
   * @return {Node}
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
   * Regenerate the node's key.
   *
   * @return {Node}
   */

  regenerateKey() {
    return this.merge({ key: generateKey() })
  },

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
   * @param {Array} path
   * @param {Number} offset
   * @return {Node}
   */

  splitNode(path, offset) {
    let base = this
    let node = base.assertPath(path)
    let parent = base.getParent(node.key)
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
        const i = node.kind == 'text' ? offset : offset - node.getOffset(child.key)
        const { characters } = child
        const oneChars = characters.take(i)
        const twoChars = characters.skip(i)
        one = child.merge({ characters: oneChars })
        two = child.merge({ characters: twoChars }).regenerateKey()
      }

      else {
        const { nodes } = child

        // Try to preserve the nodes list to preserve reference of one == node to avoid re-render
        // When spliting at the end of a text node, the first node is preserved
        let oneNodes = nodes.takeUntil(n => n.key == one.key)
        oneNodes = (oneNodes.size == (nodes.size - 1) && one == nodes.last()) ? nodes : oneNodes.push(one)

        const twoNodes = nodes.skipUntil(n => n.key == one.key).rest().unshift(two)
        one = child.merge({ nodes: oneNodes })
        two = child.merge({ nodes: twoNodes }).regenerateKey()
      }

      child = base.getParent(child.key)
    }

    parent = parent.removeNode(index)
    parent = parent.insertNode(index, two)
    parent = parent.insertNode(index, one)
    base = isParent ? parent : base.updateDescendant(parent)
    return base
  },

  /**
   * Split a node by `path` after 'count' children.
   * Does not work on Text nodes. Use `Node.splitNode` to split text nodes as well.
   *
   * @param {Array} path
   * @param {Number} count
   * @return {Node}
   */

  splitNodeAfter(path, count) {
    let base = this
    let node = base.assertPath(path)
    if (node.kind === 'text') throw new Error('Cannot split text node at index. Use Node.splitNode at offset instead')
    const { nodes } = node

    let parent = base.getParent(node.key)
    const isParent = base == parent

    const oneNodes = nodes.take(count)
    const twoNodes = nodes.skip(count)

    const one = node.merge({ nodes: oneNodes })
    const two = node.merge({ nodes: twoNodes }).regenerateKey()


    const nodeIndex = parent.nodes.indexOf(node)
    parent = parent.removeNode(nodeIndex)
    parent = parent.insertNode(nodeIndex, two)
    parent = parent.insertNode(nodeIndex, one)

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
    let parent = base.getClosestBlock(node.key)
    let offset = startOffset
    let h = 0

    while (parent && parent.kind == 'block' && h < height) {
      offset += parent.getOffset(node.key)
      node = parent
      parent = base.getClosestBlock(parent.key)
      h++
    }

    const path = base.getPath(node.key)
    return this.splitNode(path, offset)
  },

  /**
   * Set a new value for a child node by `key`.
   *
   * @param {Node} node
   * @return {Node}
   */

  updateDescendant(node) {
    let found = false

    const result = this.mapDescendants(d => {
      if (d.key == node.key) {
        found = true
        return node
      } else {
        return d
      }
    })

    if (!found) {
      throw new Error(`Could not update descendant node with key "${node.key}".`)
    } else {
      return result
    }
  },

  /**
   * Validate the node against a `schema`.
   *
   * @param {Schema} schema
   * @return {Object|Null}
   */

  validate(schema) {
    return schema.__validate(this)
  }

}

/**
 * Memoize read methods.
 */

memoize(Node, [
  'getText',
  'getAncestors',
  'getBlocks',
  'getBlocksAtRange',
  'getCharactersAtRange',
  'getChild',
  'getClosestBlock',
  'getClosestInline',
  'getComponent',
  'getDecorators',
  'getDepth',
  '_getDescendant',
  'getDescendantAtPath',
  'getDescendantDecorators',
  'getFirstText',
  'getFragmentAtRange',
  'getFurthestBlock',
  'getFurthestInline',
  'getHighestChild',
  'getHighestOnlyChildParent',
  'getInlinesAtRange',
  'getLastText',
  'getMarksAtRange',
  'getNextBlock',
  'getNextSibling',
  'getNextText',
  'getNode',
  'getOffset',
  'getOffsetAtRange',
  'getParent',
  'getPreviousBlock',
  'getPreviousSibling',
  'getPreviousText',
  'getTextAtOffset',
  'getTextDirection',
  '_getTexts',
  'getTextsAtRange',
  'hasVoidParent',
  'isInlineSplitAtRange',
  'validate'
])

/**
 * Export.
 *
 * @type {Object}
 */

export default Node
