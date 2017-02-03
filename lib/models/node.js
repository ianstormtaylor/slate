'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _block = require('./block');

var _block2 = _interopRequireDefault(_block);

var _character = require('./character');

var _character2 = _interopRequireDefault(_character);

var _document = require('./document');

var _document2 = _interopRequireDefault(_document);

var _mark = require('./mark');

var _mark2 = _interopRequireDefault(_mark);

var _normalize = require('../utils/normalize');

var _normalize2 = _interopRequireDefault(_normalize);

var _direction = require('direction');

var _direction2 = _interopRequireDefault(_direction);

var _isInRange = require('../utils/is-in-range');

var _isInRange2 = _interopRequireDefault(_isInRange);

var _memoize = require('../utils/memoize');

var _memoize2 = _interopRequireDefault(_memoize);

var _generateKey = require('../utils/generate-key');

var _generateKey2 = _interopRequireDefault(_generateKey);

var _immutable = require('immutable');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Node.
 *
 * And interface that `Document`, `Block` and `Inline` all implement, to make
 * working with the recursive node tree easier.
 *
 * @type {Object}
 */

var Node = {

  /**
   * Return a set of all keys in the node.
   *
   * @return {Set<Node>}
   */

  getKeys: function getKeys() {
    var keys = [];

    this.forEachDescendant(function (desc) {
      keys.push(desc.key);
    });

    return (0, _immutable.Set)(keys);
  },


  /**
   * Get the concatenated text `string` of all child nodes.
   *
   * @return {String}
   */

  getText: function getText() {
    return this.nodes.reduce(function (result, node) {
      return result + node.text;
    }, '');
  },


  /**
   * Assert that a node has a child by `key` and return it.
   *
   * @param {String} key
   * @return {Node}
   */

  assertChild: function assertChild(key) {
    var child = this.getChild(key);

    if (!child) {
      key = _normalize2.default.key(key);
      throw new Error('Could not find a child node with key "' + key + '".');
    }

    return child;
  },


  /**
   * Assert that a node has a descendant by `key` and return it.
   *
   * @param {String} key
   * @return {Node}
   */

  assertDescendant: function assertDescendant(key) {
    var descendant = this.getDescendant(key);

    if (!descendant) {
      key = _normalize2.default.key(key);
      throw new Error('Could not find a descendant node with key "' + key + '".');
    }

    return descendant;
  },


  /**
   * Assert that a node's tree has a node by `key` and return it.
   *
   * @param {String} key
   * @return {Node}
   */

  assertNode: function assertNode(key) {
    var node = this.getNode(key);

    if (!node) {
      key = _normalize2.default.key(key);
      throw new Error('Could not find a node with key "' + key + '".');
    }

    return node;
  },


  /**
   * Assert that a node exists at `path` and return it.
   *
   * @param {Array} path
   * @return {Node}
   */

  assertPath: function assertPath(path) {
    var descendant = this.getDescendantAtPath(path);

    if (!descendant) {
      throw new Error('Could not find a descendant at path "' + path + '".');
    }

    return descendant;
  },


  /**
   * Concat children `nodes` on to the end of the node.
   *
   * @param {List<Node>} nodes
   * @return {Node}
   */

  concatChildren: function concatChildren(nodes) {
    nodes = this.nodes.concat(nodes);
    return this.merge({ nodes: nodes });
  },


  /**
   * Decorate all of the text nodes with a `decorator` function.
   *
   * @param {Function} decorator
   * @return {Node}
   */

  decorateTexts: function decorateTexts(decorator) {
    return this.mapDescendants(function (child) {
      return child.kind == 'text' ? child.decorateCharacters(decorator) : child;
    });
  },


  /**
   * Recursively find all descendant nodes by `iterator`. Breadth first.
   *
   * @param {Function} iterator
   * @return {Node|Null}
   */

  findDescendant: function findDescendant(iterator) {
    var childFound = this.nodes.find(iterator);
    if (childFound) return childFound;

    var descendantFound = null;

    this.nodes.find(function (node) {
      if (node.kind != 'text') {
        descendantFound = node.findDescendant(iterator);
        return descendantFound;
      } else {
        return false;
      }
    });

    return descendantFound;
  },


  /**
   * Recursively find all descendant nodes by `iterator`. Depth first.
   *
   * @param {Function} iterator
   * @return {Node|Null}
   */

  findDescendantDeep: function findDescendantDeep(iterator) {
    var found = void 0;

    this.forEachDescendant(function (node) {
      if (iterator(node)) {
        found = node;
        return false;
      }
    });

    return found;
  },


  /**
   * Recursively iterate over all descendant nodes with `iterator`.
   *
   * @param {Function} iterator
   */

  forEachDescendant: function forEachDescendant(iterator) {
    // If the iterator returns false it will break the loop.
    var ret = void 0;

    this.nodes.forEach(function (child, i, nodes) {
      if (iterator(child, i, nodes) === false) {
        ret = false;
        return false;
      }

      if (child.kind != 'text') {
        ret = child.forEachDescendant(iterator);
        return ret;
      }
    });

    return ret;
  },


  /**
   * Recursively filter all descendant nodes with `iterator`.
   *
   * @param {Function} iterator
   * @return {List<Node>}
   */

  filterDescendants: function filterDescendants(iterator) {
    var matches = [];

    this.forEachDescendant(function (child, i, nodes) {
      if (iterator(child, i, nodes)) matches.push(child);
    });

    return (0, _immutable.List)(matches);
  },


  /**
   * Recursively filter all descendant nodes with `iterator`, depth-first.
   * It is different from `filterDescendants` in regard of the order of results.
   *
   * @param {Function} iterator
   * @return {List<Node>}
   */

  filterDescendantsDeep: function filterDescendantsDeep(iterator) {
    return this.nodes.reduce(function (matches, child, i, nodes) {
      if (child.kind != 'text') matches = matches.concat(child.filterDescendantsDeep(iterator));
      if (iterator(child, i, nodes)) matches = matches.push(child);
      return matches;
    }, _block2.default.createList());
  },


  /**
   * Get the closest block nodes for each text node in the node.
   *
   * @return {List<Node>}
   */

  getBlocks: function getBlocks() {
    var _this = this;

    return this.getTexts().map(function (text) {
      return _this.getClosestBlock(text.key);
    }).toOrderedSet().toList();
  },


  /**
   * Get the closest block nodes for each text node in a `range`.
   *
   * @param {Selection} range
   * @return {List<Node>}
   */

  getBlocksAtRange: function getBlocksAtRange(range) {
    var _this2 = this;

    return this.getTextsAtRange(range).map(function (text) {
      return _this2.getClosestBlock(text.key);
    });
  },


  /**
   * Get a list of the characters in a `range`.
   *
   * @param {Selection} range
   * @return {List<Node>} characters
   */

  getCharactersAtRange: function getCharactersAtRange(range) {
    return this.getTextsAtRange(range).reduce(function (characters, text) {
      var chars = text.characters.filter(function (char, i) {
        return (0, _isInRange2.default)(i, text, range);
      });
      return characters.concat(chars);
    }, _character2.default.createList());
  },


  /**
   * Get children between two child keys.
   *
   * @param {String} start
   * @param {String} end
   * @return {Node}
   */

  getChildrenBetween: function getChildrenBetween(start, end) {
    start = this.assertChild(start);
    start = this.nodes.indexOf(start);
    end = this.assertChild(end);
    end = this.nodes.indexOf(end);
    return this.nodes.slice(start + 1, end);
  },


  /**
   * Get children between two child keys, including the two children.
   *
   * @param {String} start
   * @param {String} end
   * @return {Node}
   */

  getChildrenBetweenIncluding: function getChildrenBetweenIncluding(start, end) {
    start = this.assertChild(start);
    start = this.nodes.indexOf(start);
    end = this.assertChild(end);
    end = this.nodes.indexOf(end);
    return this.nodes.slice(start, end + 1);
  },


  /**
   * Get closest parent of node by `key` that matches `iterator`.
   *
   * @param {String} key
   * @param {Function} iterator
   * @return {Node|Null}
   */

  getClosest: function getClosest(key, iterator) {
    key = _normalize2.default.key(key);
    var ancestors = this.getAncestors(key);
    if (!ancestors) {
      throw new Error('Could not find a descendant node with key "' + key + '".');
    }

    // Exclude this node itself
    return ancestors.rest().findLast(iterator);
  },


  /**
   * Get the closest block parent of a `node`.
   *
   * @param {String} key
   * @return {Node|Null}
   */

  getClosestBlock: function getClosestBlock(key) {
    return this.getClosest(key, function (parent) {
      return parent.kind == 'block';
    });
  },


  /**
   * Get the closest inline parent of a `node`.
   *
   * @param {String} key
   * @return {Node|Null}
   */

  getClosestInline: function getClosestInline(key) {
    return this.getClosest(key, function (parent) {
      return parent.kind == 'inline';
    });
  },


  /**
   * Get a child node by `key`.
   *
   * @param {String} key
   * @return {Node|Null}
   */

  getChild: function getChild(key) {
    key = _normalize2.default.key(key);
    return this.nodes.find(function (node) {
      return node.key == key;
    });
  },


  /**
   * Get the common ancestor of nodes `one` and `two` by keys.
   *
   * @param {String} one
   * @param {String} two
   * @return {Node}
   */

  getCommonAncestor: function getCommonAncestor(one, two) {
    one = _normalize2.default.key(one);
    two = _normalize2.default.key(two);

    if (one == this.key) return this;
    if (two == this.key) return this;

    this.assertDescendant(one);
    this.assertDescendant(two);
    var ancestors = new _immutable.List();
    var oneParent = this.getParent(one);
    var twoParent = this.getParent(two);

    while (oneParent) {
      ancestors = ancestors.push(oneParent);
      oneParent = this.getParent(oneParent.key);
    }

    while (twoParent) {
      if (ancestors.includes(twoParent)) return twoParent;
      twoParent = this.getParent(twoParent.key);
    }
  },


  /**
   * Get the component for the node from a `schema`.
   *
   * @param {Schema} schema
   * @return {Component|Void}
   */

  getComponent: function getComponent(schema) {
    return schema.__getComponent(this);
  },


  /**
   * Get the decorations for the node from a `schema`.
   *
   * @param {Schema} schema
   * @return {Array}
   */

  getDecorators: function getDecorators(schema) {
    return schema.__getDecorators(this);
  },


  /**
   * Get the decorations for a descendant by `key` given a `schema`.
   *
   * @param {String} key
   * @param {Schema} schema
   * @return {Array}
   */

  getDescendantDecorators: function getDescendantDecorators(key, schema) {
    if (!schema.hasDecorators) {
      return [];
    }

    var descendant = this.assertDescendant(key);
    var child = this.getHighestChild(key);
    var decorators = [];

    while (child != descendant) {
      decorators = decorators.concat(child.getDecorators(schema));
      child = child.getHighestChild(key);
    }

    decorators = decorators.concat(descendant.getDecorators(schema));
    return decorators;
  },


  /**
   * Get a descendant node by `key`.
   *
   * @param {String} key
   * @return {Node|Null}
   */

  getDescendant: function getDescendant(key) {
    key = _normalize2.default.key(key);
    return this._getDescendant(key);
  },


  // This one is memoized
  _getDescendant: function _getDescendant(key) {
    var descendantFound = null;

    var found = this.nodes.find(function (node) {
      if (node.key === key) {
        return node;
      } else if (node.kind !== 'text') {
        descendantFound = node._getDescendant(key);
        return descendantFound;
      } else {
        return false;
      }
    });

    return descendantFound || found;
  },


  /**
   * Get a descendant by `path`.
   *
   * @param {Array} path
   * @return {Node|Null}
   */

  getDescendantAtPath: function getDescendantAtPath(path) {
    var descendant = this;

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = path[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var index = _step.value;

        if (!descendant) return;
        if (!descendant.nodes) return;
        descendant = descendant.nodes.get(index);
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    return descendant;
  },


  /**
   * True if the node has both descendants in that order, false
   * otherwise. The order is depth-first, post-order.
   *
   * @param {String} key1
   * @param {String} key2
   * @return {Boolean} True if nodes are found in this order
   */

  areDescendantSorted: function areDescendantSorted(key1, key2) {
    key1 = _normalize2.default.key(key1);
    key2 = _normalize2.default.key(key2);

    var sorted = void 0;

    this.forEachDescendant(function (n) {
      if (n.key === key1) {
        sorted = true;
        return false;
      } else if (n.key === key2) {
        sorted = false;
        return false;
      }
    });

    return sorted;
  },


  /**
   * Get the depth of a child node by `key`, with optional `startAt`.
   *
   * @param {String} key
   * @param {Number} startAt (optional)
   * @return {Number} depth
   */

  getDepth: function getDepth(key) {
    var startAt = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;

    this.assertDescendant(key);
    return this.hasChild(key) ? startAt : this.getHighestChild(key).getDepth(key, startAt + 1);
  },


  /**
   * Get a fragment of the node at a `range`.
   *
   * @param {Selection} range
   * @return {List<Node>}
   */

  getFragmentAtRange: function getFragmentAtRange(range) {
    var node = this;
    var nodes = _block2.default.createList();

    // If the range is collapsed, there's nothing to do.
    if (range.isCollapsed) return _document2.default.create({ nodes: nodes });

    // Make sure the children exist.
    var startKey = range.startKey,
        startOffset = range.startOffset,
        endKey = range.endKey,
        endOffset = range.endOffset;

    node.assertDescendant(startKey);
    node.assertDescendant(endKey);

    // Split at the start and end.
    var start = range.collapseToStart();
    node = node.splitBlockAtRange(start, Infinity);

    var next = node.getNextText(startKey);
    var end = startKey == endKey ? range.collapseToStartOf(next).moveForward(endOffset - startOffset) : range.collapseToEnd();
    node = node.splitBlockAtRange(end, Infinity);

    // Get the start and end nodes.
    var startNode = node.getNextSibling(node.getHighestChild(startKey).key);
    var endNode = startKey == endKey ? node.getHighestChild(next.key) : node.getHighestChild(endKey);

    nodes = node.getChildrenBetweenIncluding(startNode.key, endNode.key);

    // Return a new document fragment.
    return _document2.default.create({ nodes: nodes });
  },


  /**
   * Get the furthest parent of a node by `key` that matches an `iterator`.
   *
   * @param {String} key
   * @param {Function} iterator
   * @return {Node|Null}
   */

  getFurthest: function getFurthest(key, iterator) {
    var ancestors = this.getAncestors(key);
    if (!ancestors) {
      key = _normalize2.default.key(key);
      throw new Error('Could not find a descendant node with key "' + key + '".');
    }

    // Exclude this node itself
    return ancestors.rest().find(iterator);
  },


  /**
   * Get the furthest block parent of a node by `key`.
   *
   * @param {String} key
   * @return {Node|Null}
   */

  getFurthestBlock: function getFurthestBlock(key) {
    return this.getFurthest(key, function (node) {
      return node.kind == 'block';
    });
  },


  /**
   * Get the furthest inline parent of a node by `key`.
   *
   * @param {String} key
   * @return {Node|Null}
   */

  getFurthestInline: function getFurthestInline(key) {
    return this.getFurthest(key, function (node) {
      return node.kind == 'inline';
    });
  },


  /**
   * Get the highest child ancestor of a node by `key`.
   *
   * @param {String} key
   * @return {Node|Null}
   */

  getHighestChild: function getHighestChild(key) {
    key = _normalize2.default.key(key);
    return this.nodes.find(function (node) {
      if (node.key == key) return true;
      if (node.kind == 'text') return false;
      return node.hasDescendant(key);
    });
  },


  /**
   * Get the highest parent of a node by `key` which has an only child.
   *
   * @param {String} key
   * @return {Node|Null}
   */

  getHighestOnlyChildParent: function getHighestOnlyChildParent(key) {
    var child = this.assertDescendant(key);
    var match = null;
    var parent = void 0;

    while (parent = this.getParent(child)) {
      if (parent == null || parent.nodes.size > 1) return match;
      match = parent;
      child = parent;
    }
  },


  /**
   * Get the furthest inline nodes for each text node in the node.
   *
   * @return {List<Node>}
   */

  getInlines: function getInlines() {
    var _this3 = this;

    return this.getTexts().map(function (text) {
      return _this3.getFurthestInline(text.key);
    }).filter(function (exists) {
      return exists;
    }).toOrderedSet().toList();
  },


  /**
   * Get the closest inline nodes for each text node in a `range`.
   *
   * @param {Selection} range
   * @return {List<Node>}
   */

  getInlinesAtRange: function getInlinesAtRange(range) {
    var _this4 = this;

    return this.getTextsAtRange(range).map(function (text) {
      return _this4.getClosestInline(text.key);
    }).filter(function (exists) {
      return exists;
    }).toOrderedSet().toList();
  },


  /**
   * Get a set of the marks in a `range`.
   *
   * @param {Selection} range
   * @return {Set<Mark>}
   */

  getMarksAtRange: function getMarksAtRange(range) {
    range = range.normalize(this);
    var _range = range,
        startKey = _range.startKey,
        startOffset = _range.startOffset;

    var marks = _mark2.default.createSet();

    // If the range is collapsed at the start of the node, check the previous.
    if (range.isCollapsed && startOffset == 0) {
      var previous = this.getPreviousText(startKey);
      if (!previous || !previous.length) return marks;
      var char = previous.characters.get(previous.length - 1);
      return char.marks;
    }

    // If the range is collapsed, check the character before the start.
    if (range.isCollapsed) {
      var text = this.getDescendant(startKey);
      var _char = text.characters.get(range.startOffset - 1);
      return _char.marks;
    }

    // Otherwise, get a set of the marks for each character in the range.
    return this.getCharactersAtRange(range).reduce(function (memo, char) {
      return memo.union(char.marks);
    }, new _immutable.Set());
  },


  /**
   * Get the block node before a descendant text node by `key`.
   *
   * @param {String} key
   * @return {Node|Null}
   */

  getNextBlock: function getNextBlock(key) {
    var child = this.assertDescendant(key);
    var last = void 0;

    if (child.kind == 'block') {
      last = child.getLastText();
    } else {
      var block = this.getClosestBlock(key);
      last = block.getLastText();
    }

    var next = this.getNextText(last.key);
    if (!next) return null;

    return this.getClosestBlock(next.key);
  },


  /**
   * Get the node after a descendant by `key`.
   *
   * @param {String} key
   * @return {Node|Null}
   */

  getNextSibling: function getNextSibling(key) {
    key = _normalize2.default.key(key);

    var parent = this.getParent(key);
    var after = parent.nodes.skipUntil(function (child) {
      return child.key == key;
    });

    if (after.size == 0) {
      throw new Error('Could not find a child node with key "' + key + '".');
    }
    return after.get(1);
  },


  /**
   * Get the text node after a descendant text node by `key`.
   *
   * @param {String} key
   * @return {Node|Null}
   */

  getNextText: function getNextText(key) {
    key = _normalize2.default.key(key);
    return this.getTexts().skipUntil(function (text) {
      return text.key == key;
    }).get(1);
  },


  /**
   * Get a node in the tree by `key`.
   *
   * @param {String} key
   * @return {Node|Null}
   */

  getNode: function getNode(key) {
    key = _normalize2.default.key(key);
    return this.key == key ? this : this.getDescendant(key);
  },


  /**
   * Get the offset for a descendant text node by `key`.
   *
   * @param {String} key
   * @return {Number}
   */

  getOffset: function getOffset(key) {
    this.assertDescendant(key);

    // Calculate the offset of the nodes before the highest child.
    var child = this.getHighestChild(key);
    var offset = this.nodes.takeUntil(function (n) {
      return n == child;
    }).reduce(function (memo, n) {
      return memo + n.length;
    }, 0);

    // Recurse if need be.
    return this.hasChild(key) ? offset : offset + child.getOffset(key);
  },


  /**
   * Get the offset from a `range`.
   *
   * @param {Selection} range
   * @return {Number}
   */

  getOffsetAtRange: function getOffsetAtRange(range) {
    range = range.normalize(this);

    if (range.isExpanded) {
      throw new Error('The range must be collapsed to calculcate its offset.');
    }

    var _range2 = range,
        startKey = _range2.startKey,
        startOffset = _range2.startOffset;

    return this.getOffset(startKey) + startOffset;
  },


  /**
   * Get the parent of a child node by `key`.
   *
   * @param {String} key
   * @return {Node|Null}
   */

  getParent: function getParent(key) {
    if (this.hasChild(key)) return this;

    var node = null;

    this.nodes.find(function (child) {
      if (child.kind == 'text') {
        return false;
      } else {
        node = child.getParent(key);
        return node;
      }
    });

    return node;
  },


  /**
   * Get the path of a descendant node by `key`.
   *
   * @param {String|Node} key
   * @return {Array}
   */

  getPath: function getPath(key) {
    key = _normalize2.default.key(key);

    if (key == this.key) return [];

    var path = [];
    var childKey = key;
    var parent = void 0;

    // Efficient with getParent memoization
    while (parent = this.getParent(childKey)) {
      var index = parent.nodes.findIndex(function (n) {
        return n.key === childKey;
      });
      path.unshift(index);
      childKey = parent.key;
    }

    if (childKey === key) {
      // Did not loop once, meaning we could not find the child
      throw new Error('Could not find a descendant node with key "' + key + '".');
    } else {
      return path;
    }
  },


  /**
   * Get the path of ancestors of a descendant node by `key`.
   *
   * @param {String|Node} key
   * @return {List<Node>|Null}
   */

  getAncestors: function getAncestors(key) {
    key = _normalize2.default.key(key);

    if (key == this.key) return (0, _immutable.List)();
    if (this.hasChild(key)) return (0, _immutable.List)([this]);

    var ancestors = void 0;
    this.nodes.find(function (node) {
      if (node.kind == 'text') return false;
      ancestors = node.getAncestors(key);
      return ancestors;
    });

    if (ancestors) {
      return ancestors.unshift(this);
    } else {
      return null;
    }
  },


  /**
   * Get the node before a descendant node by `key`.
   *
   * @param {String} key
   * @return {Node|Null}
   */

  getPreviousSibling: function getPreviousSibling(key) {
    key = _normalize2.default.key(key);
    var parent = this.getParent(key);
    var before = parent.nodes.takeUntil(function (child) {
      return child.key == key;
    });

    if (before.size == parent.nodes.size) {
      throw new Error('Could not find a child node with key "' + key + '".');
    }

    return before.last();
  },


  /**
   * Get the text node before a descendant text node by `key`.
   *
   * @param {String} key
   * @return {Node|Null}
   */

  getPreviousText: function getPreviousText(key) {
    key = _normalize2.default.key(key);
    return this.getTexts().takeUntil(function (text) {
      return text.key == key;
    }).last();
  },


  /**
   * Get the block node before a descendant text node by `key`.
   *
   * @param {String} key
   * @return {Node|Null}
   */

  getPreviousBlock: function getPreviousBlock(key) {
    var child = this.assertDescendant(key);
    var first = void 0;

    if (child.kind == 'block') {
      first = child.getFirstText();
    } else {
      var block = this.getClosestBlock(key);
      first = block.getFirstText();
    }

    var previous = this.getPreviousText(first.key);
    if (!previous) return null;

    return this.getClosestBlock(previous.key);
  },


  /**
   * Get the descendent text node at an `offset`.
   *
   * @param {String} offset
   * @return {Node|Null}
   */

  getTextAtOffset: function getTextAtOffset(offset) {
    // PERF: Add a few shortcuts for the obvious cases.
    if (offset == 0) return this.getFirstText();
    if (offset == this.length) return this.getLastText();
    if (offset < 0 || offset > this.length) return null;

    var length = 0;

    return this.getTexts().find(function (text, i, texts) {
      length += text.length;
      return length > offset;
    });
  },


  /**
   * Get the direction of the node's text.
   *
   * @return {String}
   */

  getTextDirection: function getTextDirection() {
    var text = this.text;
    var dir = (0, _direction2.default)(text);
    return dir == 'neutral' ? undefined : dir;
  },


  /**
   * Recursively get all of the child text nodes in order of appearance.
   *
   * @return {List<Node>}
   */

  getTexts: function getTexts() {
    return (0, _immutable.List)(this._getTexts());
  },


  // This one is memoized for performance.
  _getTexts: function _getTexts() {
    return this.nodes.reduce(function (texts, node) {
      if (node.kind == 'text') {
        texts.push(node);
        return texts;
      } else {
        return texts.concat(node._getTexts());
      }
    }, []);
  },


  /**
   * Get the first child text node.
   *
   * @return {Node|Null}
   */

  getFirstText: function getFirstText() {
    var descendantFound = null;

    var found = this.nodes.find(function (node) {
      if (node.kind == 'text') return true;
      descendantFound = node.getFirstText();
      return descendantFound;
    });

    return descendantFound || found;
  },


  /**
   * Get the last child text node.
   *
   * @return {Node|Null}
   */

  getLastText: function getLastText() {
    var descendantFound = null;

    var found = this.nodes.findLast(function (node) {
      if (node.kind == 'text') return true;
      descendantFound = node.getLastText();
      return descendantFound;
    });

    return descendantFound || found;
  },


  /**
   * Get all of the text nodes in a `range`.
   *
   * @param {Selection} range
   * @return {List<Node>}
   */

  getTextsAtRange: function getTextsAtRange(range) {
    range = range.normalize(this);
    var _range3 = range,
        startKey = _range3.startKey,
        endKey = _range3.endKey;

    var texts = this.getTexts();
    var startText = this.getDescendant(startKey);
    var endText = this.getDescendant(endKey);
    var start = texts.indexOf(startText);
    var end = texts.indexOf(endText);
    return texts.slice(start, end + 1);
  },


  /**
   * Check if a child node exists by `key`.
   *
   * @param {String} key
   * @return {Boolean}
   */

  hasChild: function hasChild(key) {
    return !!this.getChild(key);
  },


  /**
   * Recursively check if a child node exists by `key`.
   *
   * @param {String} key
   * @return {Boolean}
   */

  hasDescendant: function hasDescendant(key) {
    return !!this.getDescendant(key);
  },


  /**
   * Recursively check if a node exists by `key`.
   *
   * @param {String} key
   * @return {Boolean}
   */

  hasNode: function hasNode(key) {
    return !!this.getNode(key);
  },


  /**
   * Check if a node has a void parent by `key`.
   *
   * @param {String} key
   * @return {Boolean}
   */

  hasVoidParent: function hasVoidParent(key) {
    return !!this.getClosest(key, function (parent) {
      return parent.isVoid;
    });
  },


  /**
   * Insert a `node` at `index`.
   *
   * @param {Number} index
   * @param {Node} node
   * @return {Node}
   */

  insertNode: function insertNode(index, node) {
    var keys = this.getKeys();

    if (keys.contains(node.key)) {
      node = node.regenerateKey();
    }

    if (node.kind != 'text') {
      node = node.mapDescendants(function (desc) {
        return keys.contains(desc.key) ? desc.regenerateKey() : desc;
      });
    }

    var nodes = this.nodes.insert(index, node);
    return this.merge({ nodes: nodes });
  },


  /**
   * Check if the inline nodes are split at a `range`.
   *
   * @param {Selection} range
   * @return {Boolean}
   */

  isInlineSplitAtRange: function isInlineSplitAtRange(range) {
    range = range.normalize(this);
    if (range.isExpanded) throw new Error();

    var _range4 = range,
        startKey = _range4.startKey;

    var start = this.getFurthestInline(startKey) || this.getDescendant(startKey);
    return range.isAtStartOf(start) || range.isAtEndOf(start);
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

  joinNode: function joinNode(first, second, options) {
    var _options$deep = options.deep,
        deep = _options$deep === undefined ? false : _options$deep;

    var node = this;
    var parent = node.getParent(second.key);
    var isParent = node == parent;
    var index = parent.nodes.indexOf(second);

    if (second.kind == 'text') {
      var _first = first,
          characters = _first.characters;

      characters = characters.concat(second.characters);
      first = first.merge({ characters: characters });
    } else {
      (function () {
        var size = first.nodes.size;
        second.nodes.forEach(function (child, i) {
          first = first.insertNode(size + i, child);
        });

        if (deep) {
          // Join recursively
          first = first.joinNode(first.nodes.get(size - 1), first.nodes.get(size), { deep: deep });
        }
      })();
    }

    parent = parent.removeNode(index);
    node = isParent ? parent : node.updateDescendant(parent);
    node = node.updateDescendant(first);
    return node;
  },


  /**
   * Map all child nodes, updating them in their parents. This method is
   * optimized to not return a new node if no changes are made.
   *
   * @param {Function} iterator
   * @return {Node}
   */

  mapChildren: function mapChildren(iterator) {
    var _this5 = this;

    var nodes = this.nodes;

    nodes.forEach(function (node, i) {
      var ret = iterator(node, i, _this5.nodes);
      if (ret != node) nodes = nodes.set(ret.key, ret);
    });

    return this.merge({ nodes: nodes });
  },


  /**
   * Map all descendant nodes, updating them in their parents. This method is
   * optimized to not return a new node if no changes are made.
   *
   * @param {Function} iterator
   * @return {Node}
   */

  mapDescendants: function mapDescendants(iterator) {
    var _this6 = this;

    var nodes = this.nodes;

    nodes.forEach(function (node, i) {
      var ret = node;
      if (ret.kind != 'text') ret = ret.mapDescendants(iterator);
      ret = iterator(ret, i, _this6.nodes);
      if (ret == node) return;

      var index = nodes.indexOf(node);
      nodes = nodes.set(index, ret);
    });

    return this.merge({ nodes: nodes });
  },


  /**
   * Regenerate the node's key.
   *
   * @return {Node}
   */

  regenerateKey: function regenerateKey() {
    return this.merge({ key: (0, _generateKey2.default)() });
  },


  /**
   * Remove a `node` from the children node map.
   *
   * @param {String} key
   * @return {Node}
   */

  removeDescendant: function removeDescendant(key) {
    key = _normalize2.default.key(key);

    var node = this;
    var parent = node.getParent(key);
    if (!parent) throw new Error('Could not find a descendant node with key "' + key + '".');

    var index = parent.nodes.findIndex(function (n) {
      return n.key === key;
    });
    var isParent = node == parent;
    var nodes = parent.nodes.splice(index, 1);

    parent = parent.merge({ nodes: nodes });
    node = isParent ? parent : node.updateDescendant(parent);

    return node;
  },


  /**
   * Remove a node at `index`.
   *
   * @param {Number} index
   * @return {Node}
   */

  removeNode: function removeNode(index) {
    var nodes = this.nodes.splice(index, 1);
    return this.merge({ nodes: nodes });
  },


  /**
   * Split a node by `path` at `offset`.
   *
   * @param {Array} path
   * @param {Number} offset
   * @return {Node}
   */

  splitNode: function splitNode(path, offset) {
    var base = this;
    var node = base.assertPath(path);
    var parent = base.getParent(node.key);
    var isParent = base == parent;
    var index = parent.nodes.indexOf(node);

    var child = node;
    var one = void 0;
    var two = void 0;

    if (node.kind != 'text') {
      child = node.getTextAtOffset(offset);
    }

    while (child && child != parent) {
      if (child.kind == 'text') {
        var i = node.kind == 'text' ? offset : offset - node.getOffset(child.key);
        var _child = child,
            characters = _child.characters;

        var oneChars = characters.take(i);
        var twoChars = characters.skip(i);
        one = child.merge({ characters: oneChars });
        two = child.merge({ characters: twoChars }).regenerateKey();
      } else {
        var _child2 = child,
            nodes = _child2.nodes;

        // Try to preserve the nodes list to preserve reference of one == node to avoid re-render
        // When spliting at the end of a text node, the first node is preserved

        var oneNodes = nodes.takeUntil(function (n) {
          return n.key == one.key;
        });
        oneNodes = oneNodes.size == nodes.size - 1 && one == nodes.last() ? nodes : oneNodes.push(one);

        var twoNodes = nodes.skipUntil(function (n) {
          return n.key == one.key;
        }).rest().unshift(two);
        one = child.merge({ nodes: oneNodes });
        two = child.merge({ nodes: twoNodes }).regenerateKey();
      }

      child = base.getParent(child.key);
    }

    parent = parent.removeNode(index);
    parent = parent.insertNode(index, two);
    parent = parent.insertNode(index, one);
    base = isParent ? parent : base.updateDescendant(parent);
    return base;
  },


  /**
   * Split a node by `path` after 'count' children.
   * Does not work on Text nodes. Use `Node.splitNode` to split text nodes as well.
   *
   * @param {Array} path
   * @param {Number} count
   * @return {Node}
   */

  splitNodeAfter: function splitNodeAfter(path, count) {
    var base = this;
    var node = base.assertPath(path);
    if (node.kind === 'text') throw new Error('Cannot split text node at index. Use Node.splitNode at offset instead');
    var nodes = node.nodes;


    var parent = base.getParent(node.key);
    var isParent = base == parent;

    var oneNodes = nodes.take(count);
    var twoNodes = nodes.skip(count);

    var one = node.merge({ nodes: oneNodes });
    var two = node.merge({ nodes: twoNodes }).regenerateKey();

    var nodeIndex = parent.nodes.indexOf(node);
    parent = parent.removeNode(nodeIndex);
    parent = parent.insertNode(nodeIndex, two);
    parent = parent.insertNode(nodeIndex, one);

    base = isParent ? parent : base.updateDescendant(parent);
    return base;
  },


  /**
   * Split the block nodes at a `range`, to optional `height`.
   *
   * @param {Selection} range
   * @param {Number} height (optional)
   * @return {Node}
   */

  splitBlockAtRange: function splitBlockAtRange(range) {
    var height = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
    var startKey = range.startKey,
        startOffset = range.startOffset;

    var base = this;
    var node = base.assertDescendant(startKey);
    var parent = base.getClosestBlock(node.key);
    var offset = startOffset;
    var h = 0;

    while (parent && parent.kind == 'block' && h < height) {
      offset += parent.getOffset(node.key);
      node = parent;
      parent = base.getClosestBlock(parent.key);
      h++;
    }

    var path = base.getPath(node.key);
    return this.splitNode(path, offset);
  },


  /**
   * Set a new value for a child node by `key`.
   *
   * @param {Node} node
   * @return {Node}
   */

  updateDescendant: function updateDescendant(node) {
    var found = false;

    var result = this.mapDescendants(function (d) {
      if (d.key == node.key) {
        found = true;
        return node;
      } else {
        return d;
      }
    });

    if (!found) {
      throw new Error('Could not update descendant node with key "' + node.key + '".');
    } else {
      return result;
    }
  },


  /**
   * Validate the node against a `schema`.
   *
   * @param {Schema} schema
   * @return {Object|Null}
   */

  validate: function validate(schema) {
    return schema.__validate(this);
  }
};

/**
 * Memoize read methods.
 */

(0, _memoize2.default)(Node, ['getText', 'getAncestors', 'getBlocks', 'getBlocksAtRange', 'getCharactersAtRange', 'getChild', 'getClosestBlock', 'getClosestInline', 'getComponent', 'getDecorators', 'getDepth', '_getDescendant', 'getDescendantAtPath', 'getDescendantDecorators', 'getFirstText', 'getFragmentAtRange', 'getFurthestBlock', 'getFurthestInline', 'getHighestChild', 'getHighestOnlyChildParent', 'getInlinesAtRange', 'getLastText', 'getMarksAtRange', 'getNextBlock', 'getNextSibling', 'getNextText', 'getNode', 'getOffset', 'getOffsetAtRange', 'getParent', 'getPreviousBlock', 'getPreviousSibling', 'getPreviousText', 'getTextAtOffset', 'getTextDirection', '_getTexts', 'getTextsAtRange', 'hasVoidParent', 'isInlineSplitAtRange', 'validate']);

/**
 * Export.
 *
 * @type {Object}
 */

exports.default = Node;