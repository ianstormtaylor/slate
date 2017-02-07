'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addMarkByKey = addMarkByKey;
exports.insertNodeByKey = insertNodeByKey;
exports.insertTextByKey = insertTextByKey;
exports.joinNodeByKey = joinNodeByKey;
exports.moveNodeByKey = moveNodeByKey;
exports.removeMarkByKey = removeMarkByKey;
exports.removeNodeByKey = removeNodeByKey;
exports.removeTextByKey = removeTextByKey;
exports.setMarkByKey = setMarkByKey;
exports.setNodeByKey = setNodeByKey;
exports.splitNodeByKey = splitNodeByKey;
exports.unwrapInlineByKey = unwrapInlineByKey;
exports.unwrapBlockByKey = unwrapBlockByKey;
exports.unwrapNodeByKey = unwrapNodeByKey;
exports.wrapInlineByKey = wrapInlineByKey;
exports.wrapBlockByKey = wrapBlockByKey;

var _normalize = require('../utils/normalize');

var _normalize2 = _interopRequireDefault(_normalize);

var _core = require('../schemas/core');

var _core2 = _interopRequireDefault(_core);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Add mark to text at `offset` and `length` in node by `key`.
 *
 * @param {Transform} transform
 * @param {String} key
 * @param {Number} offset
 * @param {Number} length
 * @param {Mixed} mark
 * @param {Object} options
 *   @property {Boolean} normalize
 */

function addMarkByKey(transform, key, offset, length, mark) {
  var options = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {};

  mark = _normalize2.default.mark(mark);
  var _options$normalize = options.normalize,
      normalize = _options$normalize === undefined ? true : _options$normalize;
  var state = transform.state;
  var document = state.document;

  var path = document.getPath(key);

  transform.addMarkOperation(path, offset, length, mark);

  if (normalize) {
    var parent = document.getParent(key);
    transform.normalizeNodeByKey(parent.key, _core2.default);
  }
}

/**
 * Insert a `node` at `index` in a node by `key`.
 *
 * @param {Transform} transform
 * @param {String} key
 * @param {Number} index
 * @param {Node} node
 * @param {Object} options
 *   @property {Boolean} normalize
 */

function insertNodeByKey(transform, key, index, node) {
  var options = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};
  var _options$normalize2 = options.normalize,
      normalize = _options$normalize2 === undefined ? true : _options$normalize2;
  var state = transform.state;
  var document = state.document;

  var path = document.getPath(key);

  transform.insertNodeOperation(path, index, node);

  if (normalize) {
    transform.normalizeNodeByKey(key, _core2.default);
  }
}

/**
 * Insert `text` at `offset` in node by `key`.
 *
 * @param {Transform} transform
 * @param {String} key
 * @param {Number} offset
 * @param {String} text
 * @param {Set<Mark>} marks (optional)
 * @param {Object} options
 *   @property {Boolean} normalize
 */

function insertTextByKey(transform, key, offset, text, marks) {
  var options = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {};
  var _options$normalize3 = options.normalize,
      normalize = _options$normalize3 === undefined ? true : _options$normalize3;
  var state = transform.state;
  var document = state.document;

  var path = document.getPath(key);

  transform.insertTextOperation(path, offset, text, marks);

  if (normalize) {
    var parent = document.getParent(key);
    transform.normalizeNodeByKey(parent.key, _core2.default);
  }
}

/**
 * Join a node by `key` with a node `withKey`.
 *
 * @param {Transform} transform
 * @param {String} key
 * @param {String} withKey
 * @param {Object} options
 *   @property {Boolean} normalize
 */

function joinNodeByKey(transform, key, withKey) {
  var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  var _options$normalize4 = options.normalize,
      normalize = _options$normalize4 === undefined ? true : _options$normalize4;
  var state = transform.state;
  var document = state.document;

  var path = document.getPath(key);
  var withPath = document.getPath(withKey);

  transform.joinNodeOperation(path, withPath);

  if (normalize) {
    var parent = document.getCommonAncestor(key, withKey);
    transform.normalizeNodeByKey(parent.key, _core2.default);
  }
}

/**
 * Move a node by `key` to a new parent by `newKey` and `index`.
 * `newKey` is the key of the container (it can be the document itself)
 *
 * @param {Transform} transform
 * @param {String} key
 * @param {String} newKey
 * @param {Number} index
 * @param {Object} options
 *   @property {Boolean} normalize
 */

function moveNodeByKey(transform, key, newKey, newIndex) {
  var options = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};
  var _options$normalize5 = options.normalize,
      normalize = _options$normalize5 === undefined ? true : _options$normalize5;
  var state = transform.state;
  var document = state.document;

  var path = document.getPath(key);
  var newPath = document.getPath(newKey);

  transform.moveNodeOperation(path, newPath, newIndex);

  if (normalize) {
    var parent = document.getCommonAncestor(key, newKey);
    transform.normalizeNodeByKey(parent.key, _core2.default);
  }
}

/**
 * Remove mark from text at `offset` and `length` in node by `key`.
 *
 * @param {Transform} transform
 * @param {String} key
 * @param {Number} offset
 * @param {Number} length
 * @param {Mark} mark
 * @param {Object} options
 *   @property {Boolean} normalize
 */

function removeMarkByKey(transform, key, offset, length, mark) {
  var options = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {};

  mark = _normalize2.default.mark(mark);
  var _options$normalize6 = options.normalize,
      normalize = _options$normalize6 === undefined ? true : _options$normalize6;
  var state = transform.state;
  var document = state.document;

  var path = document.getPath(key);

  transform.removeMarkOperation(path, offset, length, mark);

  if (normalize) {
    var parent = document.getParent(key);
    transform.normalizeNodeByKey(parent.key, _core2.default);
  }
}

/**
 * Remove a node by `key`.
 *
 * @param {Transform} transform
 * @param {String} key
 * @param {Object} options
 *   @property {Boolean} normalize
 */

function removeNodeByKey(transform, key) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var _options$normalize7 = options.normalize,
      normalize = _options$normalize7 === undefined ? true : _options$normalize7;
  var state = transform.state;
  var document = state.document;

  var path = document.getPath(key);

  transform.removeNodeOperation(path);

  if (normalize) {
    var parent = document.getParent(key);
    transform.normalizeNodeByKey(parent.key, _core2.default);
  }
}

/**
 * Remove text at `offset` and `length` in node by `key`.
 *
 * @param {Transform} transform
 * @param {String} key
 * @param {Number} offset
 * @param {Number} length
 * @param {Object} options
 *   @property {Boolean} normalize
 */

function removeTextByKey(transform, key, offset, length) {
  var options = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};
  var _options$normalize8 = options.normalize,
      normalize = _options$normalize8 === undefined ? true : _options$normalize8;
  var state = transform.state;
  var document = state.document;

  var path = document.getPath(key);

  transform.removeTextOperation(path, offset, length);

  if (normalize) {
    var block = document.getClosestBlock(key);
    transform.normalizeNodeByKey(block.key, _core2.default);
  }
}

/**
 * Set `properties` on mark on text at `offset` and `length` in node by `key`.
 *
 * @param {Transform} transform
 * @param {String} key
 * @param {Number} offset
 * @param {Number} length
 * @param {Mark} mark
 * @param {Object} options
 *   @property {Boolean} normalize
 */

function setMarkByKey(transform, key, offset, length, mark, properties) {
  var options = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : {};

  mark = _normalize2.default.mark(mark);
  properties = _normalize2.default.markProperties(properties);
  var _options$normalize9 = options.normalize,
      normalize = _options$normalize9 === undefined ? true : _options$normalize9;

  var newMark = mark.merge(properties);
  var state = transform.state;
  var document = state.document;

  var path = document.getPath(key);

  transform.setMarkOperation(path, offset, length, mark, newMark);

  if (normalize) {
    var parent = document.getParent(key);
    transform.normalizeNodeByKey(parent.key, _core2.default);
  }
}

/**
 * Set `properties` on a node by `key`.
 *
 * @param {Transform} transform
 * @param {String} key
 * @param {Object|String} properties
 * @param {Object} options
 *   @property {Boolean} normalize
 */

function setNodeByKey(transform, key, properties) {
  var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

  properties = _normalize2.default.nodeProperties(properties);
  var _options$normalize10 = options.normalize,
      normalize = _options$normalize10 === undefined ? true : _options$normalize10;
  var state = transform.state;
  var document = state.document;

  var path = document.getPath(key);

  transform.setNodeOperation(path, properties);

  if (normalize) {
    var parent = document.getParent(key);
    transform.normalizeNodeByKey(parent.key, _core2.default);
  }
}

/**
 * Split a node by `key` at `offset`.
 *
 * @param {Transform} transform
 * @param {String} key
 * @param {Number} offset
 * @param {Object} options
 *   @property {Boolean} normalize
 */

function splitNodeByKey(transform, key, offset) {
  var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  var _options$normalize11 = options.normalize,
      normalize = _options$normalize11 === undefined ? true : _options$normalize11;
  var state = transform.state;
  var document = state.document;

  var path = document.getPath(key);

  transform.splitNodeAtOffsetOperation(path, offset);

  if (normalize) {
    var parent = document.getParent(key);
    transform.normalizeNodeByKey(parent.key, _core2.default);
  }
}

/**
 * Unwrap content from an inline parent with `properties`.
 *
 * @param {Transform} transform
 * @param {String} key
 * @param {Object|String} properties
 * @param {Object} options
 *   @property {Boolean} normalize
 */

function unwrapInlineByKey(transform, key, properties, options) {
  var state = transform.state;
  var document = state.document,
      selection = state.selection;

  var node = document.assertDescendant(key);
  var first = node.getFirstText();
  var last = node.getLastText();
  var range = selection.moveToRangeOf(first, last);
  transform.unwrapInlineAtRange(range, properties, options);
}

/**
 * Unwrap content from a block parent with `properties`.
 *
 * @param {Transform} transform
 * @param {String} key
 * @param {Object|String} properties
 * @param {Object} options
 *   @property {Boolean} normalize
 */

function unwrapBlockByKey(transform, key, properties, options) {
  var state = transform.state;
  var document = state.document,
      selection = state.selection;

  var node = document.assertDescendant(key);
  var first = node.getFirstText();
  var last = node.getLastText();
  var range = selection.moveToRangeOf(first, last);
  transform.unwrapBlockAtRange(range, properties, options);
}

/**
 * Unwrap a single node from its parent.
 *
 * If the node is surrounded with siblings, its parent will be
 * split. If the node is the only child, the parent is removed, and
 * simply replaced by the node itself.  Cannot unwrap a root node.
 *
 * @param {Transform} transform
 * @param {String} key
 * @param {Object} options
 *   @property {Boolean} normalize
 */

function unwrapNodeByKey(transform, key) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var _options$normalize12 = options.normalize,
      normalize = _options$normalize12 === undefined ? true : _options$normalize12;
  var state = transform.state;
  var document = state.document;

  var parent = document.getParent(key);
  var node = parent.getChild(key);

  var index = parent.nodes.indexOf(node);
  var isFirst = index === 0;
  var isLast = index === parent.nodes.size - 1;

  var parentParent = document.getParent(parent.key);
  var parentIndex = parentParent.nodes.indexOf(parent);

  if (parent.nodes.size === 1) {
    // Remove the parent
    transform.removeNodeByKey(parent.key, { normalize: false });
    // and replace it by the node itself
    transform.insertNodeByKey(parentParent.key, parentIndex, node, options);
  } else if (isFirst) {
    // Just move the node before its parent
    transform.moveNodeByKey(key, parentParent.key, parentIndex, options);
  } else if (isLast) {
    // Just move the node after its parent
    transform.moveNodeByKey(key, parentParent.key, parentIndex + 1, options);
  } else {
    var parentPath = document.getPath(parent.key);
    // Split the parent
    transform.splitNodeOperation(parentPath, index);
    // Extract the node in between the splitted parent
    transform.moveNodeByKey(key, parentParent.key, parentIndex + 1, { normalize: false });

    if (normalize) {
      transform.normalizeNodeByKey(parentParent.key, _core2.default);
    }
  }
}

/**
 * Wrap a node in an inline with `properties`.
 *
 * @param {Transform} transform
 * @param {String} key The node to wrap
 * @param {Block|Object|String} inline The wrapping inline (its children are discarded)
 * @param {Object} options
 *   @property {Boolean} normalize
 */

function wrapInlineByKey(transform, key, inline, options) {
  inline = _normalize2.default.inline(inline);
  inline = inline.merge({ nodes: inline.nodes.clear() });

  var document = transform.state.document;

  var node = document.assertDescendant(key);
  var parent = document.getParent(node.key);
  var index = parent.nodes.indexOf(node);

  transform.insertNodeByKey(parent.key, index, inline, { normalize: false });
  transform.moveNodeByKey(node.key, inline.key, 0, options);
}

/**
 * Wrap a node in a block with `properties`.
 *
 * @param {Transform} transform
 * @param {String} key The node to wrap
 * @param {Block|Object|String} block The wrapping block (its children are discarded)
 * @param {Object} options
 *   @property {Boolean} normalize
 */

function wrapBlockByKey(transform, key, block, options) {
  block = _normalize2.default.block(block);
  block = block.merge({ nodes: block.nodes.clear() });

  var document = transform.state.document;

  var node = document.assertDescendant(key);
  var parent = document.getParent(node.key);
  var index = parent.nodes.indexOf(node);

  transform.insertNodeByKey(parent.key, index, block, { normalize: false });
  transform.moveNodeByKey(node.key, block.key, 0, options);
}