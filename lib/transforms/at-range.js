'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addMarkAtRange = addMarkAtRange;
exports.deleteAtRange = deleteAtRange;
exports.deleteCharBackwardAtRange = deleteCharBackwardAtRange;
exports.deleteLineBackwardAtRange = deleteLineBackwardAtRange;
exports.deleteWordBackwardAtRange = deleteWordBackwardAtRange;
exports.deleteBackwardAtRange = deleteBackwardAtRange;
exports.deleteCharForwardAtRange = deleteCharForwardAtRange;
exports.deleteLineForwardAtRange = deleteLineForwardAtRange;
exports.deleteWordForwardAtRange = deleteWordForwardAtRange;
exports.deleteForwardAtRange = deleteForwardAtRange;
exports.insertBlockAtRange = insertBlockAtRange;
exports.insertFragmentAtRange = insertFragmentAtRange;
exports.insertInlineAtRange = insertInlineAtRange;
exports.insertTextAtRange = insertTextAtRange;
exports.removeMarkAtRange = removeMarkAtRange;
exports.setBlockAtRange = setBlockAtRange;
exports.setInlineAtRange = setInlineAtRange;
exports.splitBlockAtRange = splitBlockAtRange;
exports.splitInlineAtRange = splitInlineAtRange;
exports.toggleMarkAtRange = toggleMarkAtRange;
exports.unwrapBlockAtRange = unwrapBlockAtRange;
exports.unwrapInlineAtRange = unwrapInlineAtRange;
exports.wrapBlockAtRange = wrapBlockAtRange;
exports.wrapInlineAtRange = wrapInlineAtRange;
exports.wrapTextAtRange = wrapTextAtRange;

var _normalize = require('../utils/normalize');

var _normalize2 = _interopRequireDefault(_normalize);

var _string = require('../utils/string');

var _string2 = _interopRequireDefault(_string);

var _core = require('../schemas/core');

var _core2 = _interopRequireDefault(_core);

var _immutable = require('immutable');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * An options object with normalize set to `false`.
 *
 * @type {Object}
 */

/* eslint no-console: 0 */

var OPTS = {
  normalize: false
};

/**
 * Add a new `mark` to the characters at `range`.
 *
 * @param {Transform} transform
 * @param {Selection} range
 * @param {Mixed} mark
 * @param {Object} options
 *   @property {Boolean} normalize
 */

function addMarkAtRange(transform, range, mark) {
  var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

  if (range.isCollapsed) return;

  var _options$normalize = options.normalize,
      normalize = _options$normalize === undefined ? true : _options$normalize;
  var state = transform.state;
  var document = state.document;
  var startKey = range.startKey,
      startOffset = range.startOffset,
      endKey = range.endKey,
      endOffset = range.endOffset;

  var texts = document.getTextsAtRange(range);

  texts.forEach(function (text) {
    var key = text.key;

    var index = 0;
    var length = text.length;

    if (key == startKey) index = startOffset;
    if (key == endKey) length = endOffset;
    if (key == startKey && key == endKey) length = endOffset - startOffset;

    transform.addMarkByKey(key, index, length, mark, { normalize: normalize });
  });
}

/**
 * Delete everything in a `range`.
 *
 * @param {Transform} transform
 * @param {Selection} range
 * @param {Object} options
 *   @property {Boolean} normalize
 */

function deleteAtRange(transform, range) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  if (range.isCollapsed) return;

  var _options$normalize2 = options.normalize,
      normalize = _options$normalize2 === undefined ? true : _options$normalize2;
  var startKey = range.startKey,
      startOffset = range.startOffset,
      endKey = range.endKey,
      endOffset = range.endOffset;

  // If the start and end key are the same, we can just remove text.

  if (startKey == endKey) {
    var index = startOffset;
    var length = endOffset - startOffset;
    transform.removeTextByKey(startKey, index, length, { normalize: normalize });
    return;
  }

  // Split at the range edges within a common ancestor, without normalizing.
  var state = transform.state;
  var _state = state,
      document = _state.document;

  var ancestor = document.getCommonAncestor(startKey, endKey);
  var startChild = ancestor.getHighestChild(startKey);
  var endChild = ancestor.getHighestChild(endKey);
  var startOff = (startChild.kind == 'text' ? 0 : startChild.getOffset(startKey)) + startOffset;
  var endOff = (endChild.kind == 'text' ? 0 : endChild.getOffset(endKey)) + endOffset;

  transform.splitNodeByKey(startChild.key, startOff, OPTS);
  transform.splitNodeByKey(endChild.key, endOff, OPTS);

  // Refresh variables.
  state = transform.state;
  document = state.document;
  ancestor = document.getCommonAncestor(startKey, endKey);
  startChild = ancestor.getHighestChild(startKey);
  endChild = ancestor.getHighestChild(endKey);
  var startIndex = ancestor.nodes.indexOf(startChild);
  var endIndex = ancestor.nodes.indexOf(endChild);
  var middles = ancestor.nodes.slice(startIndex + 1, endIndex + 1);

  // Remove all of the middle nodes, between the splits.
  if (middles.size) {
    middles.forEach(function (child) {
      transform.removeNodeByKey(child.key, OPTS);
    });
  }

  // If the start and end block are different, move all of the nodes from the
  // end block into the start block.
  var startBlock = document.getClosestBlock(startKey);
  var endBlock = document.getClosestBlock(document.getNextText(endKey).key);

  if (startBlock.key !== endBlock.key) {
    endBlock.nodes.forEach(function (child, i) {
      var newKey = startBlock.key;
      var newIndex = startBlock.nodes.size + i;
      transform.moveNodeByKey(child.key, newKey, newIndex, OPTS);
    });

    var lonely = document.getFurthest(endBlock.key, function (p) {
      return p.nodes.size == 1;
    }) || endBlock;
    transform.removeNodeByKey(lonely.key, OPTS);
  }

  if (normalize) {
    transform.normalizeNodeByKey(ancestor.key, _core2.default);
  }
}

/**
 * Delete backward until the character boundary at a `range`.
 *
 * @param {Transform} transform
 * @param {Selection} range
 * @param {Object} options
 *   @property {Boolean} normalize
 */

function deleteCharBackwardAtRange(transform, range, options) {
  var state = transform.state;
  var startOffset = state.startOffset,
      startBlock = state.startBlock;
  var text = startBlock.text;

  var n = _string2.default.getCharOffsetBackward(text, startOffset);
  transform.deleteBackwardAtRange(range, n, options);
}

/**
 * Delete backward until the line boundary at a `range`.
 *
 * @param {Transform} transform
 * @param {Selection} range
 * @param {Object} options
 *   @property {Boolean} normalize
 */

function deleteLineBackwardAtRange(transform, range, options) {
  var state = transform.state;
  var startOffset = state.startOffset;

  transform.deleteBackwardAtRange(range, startOffset, options);
}

/**
 * Delete backward until the word boundary at a `range`.
 *
 * @param {Transform} transform
 * @param {Selection} range
 * @param {Object} options
 *   @property {Boolean} normalize
 */

function deleteWordBackwardAtRange(transform, range, options) {
  var state = transform.state;
  var startOffset = state.startOffset,
      startBlock = state.startBlock;
  var text = startBlock.text;

  var n = _string2.default.getWordOffsetBackward(text, startOffset);
  transform.deleteBackwardAtRange(range, n, options);
}

/**
 * Delete backward `n` characters at a `range`.
 *
 * @param {Transform} transform
 * @param {Selection} range
 * @param {Number} n (optional)
 * @param {Object} options
 *   @property {Boolean} normalize
 */

function deleteBackwardAtRange(transform, range) {
  var n = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
  var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  var _options$normalize3 = options.normalize,
      normalize = _options$normalize3 === undefined ? true : _options$normalize3;
  var state = transform.state;
  var document = state.document;
  var _range = range,
      startKey = _range.startKey,
      focusOffset = _range.focusOffset;

  // If the range is expanded, perform a regular delete instead.

  if (range.isExpanded) {
    transform.deleteAtRange(range, { normalize: normalize });
    return;
  }

  // If the closest block is void, delete it.
  var block = document.getClosestBlock(startKey);
  if (block && block.isVoid) {
    transform.removeNodeByKey(block.key, { normalize: normalize });
    return;
  }

  // If the closest inline is void, delete it.
  var inline = document.getClosestInline(startKey);
  if (inline && inline.isVoid) {
    transform.removeNodeByKey(inline.key, { normalize: normalize });
    return;
  }

  // If the range is at the start of the document, abort.
  if (range.isAtStartOf(document)) {
    return;
  }

  // If the range is at the start of the text node, we need to figure out what
  // is behind it to know how to delete...
  var text = document.getDescendant(startKey);
  if (range.isAtStartOf(text)) {
    var prev = document.getPreviousText(text.key);
    var prevBlock = document.getClosestBlock(prev.key);
    var prevInline = document.getClosestInline(prev.key);

    // If the previous block is void, remove it.
    if (prevBlock && prevBlock.isVoid) {
      transform.removeNodeByKey(prevBlock.key, { normalize: normalize });
      return;
    }

    // If the previous inline is void, remove it.
    if (prevInline && prevInline.isVoid) {
      transform.removeNodeByKey(prevInline.key, { normalize: normalize });
      return;
    }

    // If the previous text's block is inside the current block, then we need
    // to remove a character when deleteing. Otherwise, we just want to join
    // the two blocks together.
    range = range.merge({
      anchorKey: prev.key,
      anchorOffset: prevBlock == block ? prev.length - 1 : prev.length
    });

    transform.deleteAtRange(range, { normalize: normalize });
    return;
  }

  // Otherwise, just remove a character backwards.
  range = range.merge({
    focusOffset: focusOffset - n,
    isBackward: true
  });

  transform.deleteAtRange(range, { normalize: normalize });
}

/**
 * Delete forward until the character boundary at a `range`.
 *
 * @param {Transform} transform
 * @param {Selection} range
 * @param {Object} options
 *   @property {Boolean} normalize
 */

function deleteCharForwardAtRange(transform, range, options) {
  var state = transform.state;
  var startOffset = state.startOffset,
      startBlock = state.startBlock;
  var text = startBlock.text;

  var n = _string2.default.getCharOffsetForward(text, startOffset);
  transform.deleteForwardAtRange(range, n, options);
}

/**
 * Delete forward until the line boundary at a `range`.
 *
 * @param {Transform} transform
 * @param {Selection} range
 * @param {Object} options
 *   @property {Boolean} normalize
 */

function deleteLineForwardAtRange(transform, range, options) {
  var state = transform.state;
  var startOffset = state.startOffset,
      startBlock = state.startBlock;

  transform.deleteForwardAtRange(range, startBlock.length - startOffset, options);
}

/**
 * Delete forward until the word boundary at a `range`.
 *
 * @param {Transform} transform
 * @param {Selection} range
 * @param {Object} options
 *   @property {Boolean} normalize
 */

function deleteWordForwardAtRange(transform, range, options) {
  var state = transform.state;
  var startOffset = state.startOffset,
      startBlock = state.startBlock;
  var text = startBlock.text;

  var n = _string2.default.getWordOffsetForward(text, startOffset);
  transform.deleteForwardAtRange(range, n, options);
}

/**
 * Delete forward `n` characters at a `range`.
 *
 * @param {Transform} transform
 * @param {Selection} range
 * @param {Number} n (optional)
 * @param {Object} options
 *   @property {Boolean} normalize
 */

function deleteForwardAtRange(transform, range) {
  var n = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
  var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  var _options$normalize4 = options.normalize,
      normalize = _options$normalize4 === undefined ? true : _options$normalize4;
  var state = transform.state;
  var document = state.document;
  var _range2 = range,
      startKey = _range2.startKey,
      focusOffset = _range2.focusOffset;


  if (range.isExpanded) {
    transform.deleteAtRange(range, { normalize: normalize });
    return;
  }

  var block = document.getClosestBlock(startKey);
  if (block && block.isVoid) {
    transform.removeNodeByKey(block.key, { normalize: normalize });
    return;
  }

  var inline = document.getClosestInline(startKey);
  if (inline && inline.isVoid) {
    transform.removeNodeByKey(inline.key, { normalize: normalize });
    return;
  }

  if (range.isAtEndOf(document)) {
    return;
  }

  var text = document.getDescendant(startKey);
  if (range.isAtEndOf(text)) {
    var next = document.getNextText(text.key);
    var nextBlock = document.getClosestBlock(next.key);
    var nextInline = document.getClosestInline(next.key);

    if (nextBlock && nextBlock.isVoid) {
      transform.removeNodeByKey(nextBlock.key, { normalize: normalize });
      return;
    }

    if (nextInline && nextInline.isVoid) {
      transform.removeNodeByKey(nextInline.key, { normalize: normalize });
      return;
    }

    // If the next text's block is inside the current block, then we need
    // to remove a character when deleteing. Otherwise, we just want to join
    // the two blocks together.
    range = range.merge({
      focusKey: next.key,
      focusOffset: nextBlock == block ? 1 : 0
    });

    transform.deleteAtRange(range, { normalize: normalize });
    return;
  }

  range = range.merge({
    focusOffset: focusOffset + n
  });

  transform.deleteAtRange(range, { normalize: normalize });
}

/**
 * Insert a `block` node at `range`.
 *
 * @param {Transform} transform
 * @param {Selection} range
 * @param {Block|String|Object} block
 * @param {Object} options
 *   @property {Boolean} normalize
 */

function insertBlockAtRange(transform, range, block) {
  var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

  block = _normalize2.default.block(block);
  var _options$normalize5 = options.normalize,
      normalize = _options$normalize5 === undefined ? true : _options$normalize5;


  if (range.isExpanded) {
    transform.deleteAtRange(range);
    range = range.collapseToStart();
  }

  var state = transform.state;
  var document = state.document;
  var _range3 = range,
      startKey = _range3.startKey,
      startOffset = _range3.startOffset;

  var startText = document.assertDescendant(startKey);
  var startBlock = document.getClosestBlock(startKey);
  var parent = document.getParent(startBlock.key);
  var index = parent.nodes.indexOf(startBlock);

  if (startBlock.isVoid) {
    transform.insertNodeByKey(parent.key, index + 1, block, { normalize: normalize });
  } else if (startBlock.isEmpty) {
    transform.removeNodeByKey(startBlock.key);
    transform.insertNodeByKey(parent.key, index, block, { normalize: normalize });
  } else if (range.isAtStartOf(startBlock)) {
    transform.insertNodeByKey(parent.key, index, block, { normalize: normalize });
  } else if (range.isAtEndOf(startBlock)) {
    transform.insertNodeByKey(parent.key, index + 1, block, { normalize: normalize });
  } else {
    var offset = startBlock.getOffset(startText.key) + startOffset;
    transform.splitNodeByKey(startBlock.key, offset, { normalize: normalize });
    transform.insertNodeByKey(parent.key, index + 1, block, { normalize: normalize });
  }

  if (normalize) {
    transform.normalizeNodeByKey(parent.key, _core2.default);
  }
}

/**
 * Insert a `fragment` at a `range`.
 *
 * @param {Transform} transform
 * @param {Selection} range
 * @param {Document} fragment
 * @param {Object} options
 *   @property {Boolean} normalize
 */

function insertFragmentAtRange(transform, range, fragment) {
  var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  var _options$normalize6 = options.normalize,
      normalize = _options$normalize6 === undefined ? true : _options$normalize6;

  // If the range is expanded, delete it first.

  if (range.isExpanded) {
    transform.deleteAtRange(range, OPTS);
    range = range.collapseToStart();
  }

  // If the fragment is empty, there's nothing to do after deleting.
  if (!fragment.length) return;

  // Regenerate the keys for all of the fragments nodes, so that they're
  // guaranteed not to collide with the existing keys in the document. Otherwise
  // they will be rengerated automatically and we won't have an easy way to
  // reference them.
  fragment = fragment.mapDescendants(function (child) {
    return child.regenerateKey();
  });

  // Calculate a few things...
  var _range4 = range,
      startKey = _range4.startKey,
      startOffset = _range4.startOffset;
  var state = transform.state;
  var _state2 = state,
      document = _state2.document;

  var startText = document.getDescendant(startKey);
  var startBlock = document.getClosestBlock(startText.key);
  var startChild = startBlock.getHighestChild(startText.key);
  var isAtStart = range.isAtStartOf(startBlock);
  var parent = document.getParent(startBlock.key);
  var index = parent.nodes.indexOf(startBlock);
  var offset = startChild == startText ? startOffset : startChild.getOffset(startText.key) + startOffset;

  var blocks = fragment.getBlocks();
  var firstBlock = blocks.first();
  var lastBlock = blocks.last();

  // If the first and last block aren't the same, we need to insert all of the
  // nodes after the fragment's first block at the index.
  if (firstBlock != lastBlock) {
    (function () {
      var lonelyParent = fragment.getFurthest(firstBlock.key, function (p) {
        return p.nodes.size == 1;
      });
      var lonelyChild = lonelyParent || firstBlock;
      var startIndex = parent.nodes.indexOf(startBlock);
      fragment = fragment.removeDescendant(lonelyChild.key);

      fragment.nodes.forEach(function (node, i) {
        var newIndex = startIndex + i + 1;
        transform.insertNodeByKey(parent.key, newIndex, node, OPTS);
      });
    })();
  }

  // Check if we need to split the node.
  if (startOffset != 0) {
    transform.splitNodeByKey(startChild.key, offset, OPTS);
  }

  // Update our variables with the new state.
  state = transform.state;
  document = state.document;
  startText = document.getDescendant(startKey);
  startBlock = document.getClosestBlock(startKey);
  startChild = startBlock.getHighestChild(startText.key);

  // If the first and last block aren't the same, we need to move any of the
  // starting block's children after the split into the last block of the
  // fragment, which has already been inserted.
  if (firstBlock != lastBlock) {
    (function () {
      var nextChild = isAtStart ? startChild : startBlock.getNextSibling(startChild.key);
      var nextNodes = nextChild ? startBlock.nodes.skipUntil(function (n) {
        return n.key == nextChild.key;
      }) : (0, _immutable.List)();
      var lastIndex = lastBlock.nodes.size;

      nextNodes.forEach(function (node, i) {
        var newIndex = lastIndex + i;
        transform.moveNodeByKey(node.key, lastBlock.key, newIndex, OPTS);
      });
    })();
  }

  // If the starting block is empty, we replace it entirely with the first block
  // of the fragment, since this leads to a more expected behavior for the user.
  if (startBlock.isEmpty) {
    transform.removeNodeByKey(startBlock.key, OPTS);
    transform.insertNodeByKey(parent.key, index, firstBlock, OPTS);
  }

  // Otherwise, we maintain the starting block, and insert all of the first
  // block's inline nodes into it at the split point.
  else {
      (function () {
        var inlineChild = startBlock.getHighestChild(startText.key);
        var inlineIndex = startBlock.nodes.indexOf(inlineChild);

        firstBlock.nodes.forEach(function (inline, i) {
          var o = startOffset == 0 ? 0 : 1;
          var newIndex = inlineIndex + i + o;
          transform.insertNodeByKey(startBlock.key, newIndex, inline, OPTS);
        });
      })();
    }

  // Normalize if requested.
  if (normalize) {
    transform.normalizeNodeByKey(parent.key, _core2.default);
  }
}

/**
 * Insert an `inline` node at `range`.
 *
 * @param {Transform} transform
 * @param {Selection} range
 * @param {Inline|String|Object} inline
 * @param {Object} options
 *   @property {Boolean} normalize
 */

function insertInlineAtRange(transform, range, inline) {
  var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  var _options$normalize7 = options.normalize,
      normalize = _options$normalize7 === undefined ? true : _options$normalize7;

  inline = _normalize2.default.inline(inline);

  if (range.isExpanded) {
    transform.deleteAtRange(range, OPTS);
    range = range.collapseToStart();
  }

  var state = transform.state;
  var document = state.document;
  var _range5 = range,
      startKey = _range5.startKey,
      startOffset = _range5.startOffset;

  var parent = document.getParent(startKey);
  var startText = document.assertDescendant(startKey);
  var index = parent.nodes.indexOf(startText);

  if (parent.isVoid) return;

  transform.splitNodeByKey(startKey, startOffset, OPTS);
  transform.insertNodeByKey(parent.key, index + 1, inline, OPTS);

  if (normalize) {
    transform.normalizeNodeByKey(parent.key, _core2.default);
  }
}

/**
 * Insert `text` at a `range`, with optional `marks`.
 *
 * @param {Transform} transform
 * @param {Selection} range
 * @param {String} text
 * @param {Set<Mark>} marks (optional)
 * @param {Object} options
 *   @property {Boolean} normalize
 */

function insertTextAtRange(transform, range, text, marks) {
  var options = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};
  var normalize = options.normalize;
  var state = transform.state;
  var document = state.document;
  var startKey = range.startKey,
      startOffset = range.startOffset;

  var parent = document.getParent(startKey);

  if (parent.isVoid) return;

  if (range.isExpanded) {
    transform.deleteAtRange(range, OPTS);
  }

  // PERF: Unless specified, don't normalize if only inserting text.
  if (normalize !== undefined) {
    normalize = range.isExpanded;
  }

  transform.insertTextByKey(startKey, startOffset, text, marks, { normalize: normalize });
}

/**
 * Remove an existing `mark` to the characters at `range`.
 *
 * @param {Transform} transform
 * @param {Selection} range
 * @param {Mark|String} mark (optional)
 * @param {Object} options
 *   @property {Boolean} normalize
 */

function removeMarkAtRange(transform, range, mark) {
  var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

  if (range.isCollapsed) return;

  var _options$normalize8 = options.normalize,
      normalize = _options$normalize8 === undefined ? true : _options$normalize8;
  var state = transform.state;
  var document = state.document;

  var texts = document.getTextsAtRange(range);
  var startKey = range.startKey,
      startOffset = range.startOffset,
      endKey = range.endKey,
      endOffset = range.endOffset;


  texts.forEach(function (text) {
    var key = text.key;

    var index = 0;
    var length = text.length;

    if (key == startKey) index = startOffset;
    if (key == endKey) length = endOffset;
    if (key == startKey && key == endKey) length = endOffset - startOffset;

    transform.removeMarkByKey(key, index, length, mark, { normalize: normalize });
  });
}

/**
 * Set the `properties` of block nodes in a `range`.
 *
 * @param {Transform} transform
 * @param {Selection} range
 * @param {Object|String} properties
 * @param {Object} options
 *   @property {Boolean} normalize
 */

function setBlockAtRange(transform, range, properties) {
  var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  var _options$normalize9 = options.normalize,
      normalize = _options$normalize9 === undefined ? true : _options$normalize9;
  var state = transform.state;
  var document = state.document;

  var blocks = document.getBlocksAtRange(range);

  blocks.forEach(function (block) {
    transform.setNodeByKey(block.key, properties, { normalize: normalize });
  });
}

/**
 * Set the `properties` of inline nodes in a `range`.
 *
 * @param {Transform} transform
 * @param {Selection} range
 * @param {Object|String} properties
 * @param {Object} options
 *   @property {Boolean} normalize
 */

function setInlineAtRange(transform, range, properties) {
  var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  var _options$normalize10 = options.normalize,
      normalize = _options$normalize10 === undefined ? true : _options$normalize10;
  var state = transform.state;
  var document = state.document;

  var inlines = document.getInlinesAtRange(range);

  inlines.forEach(function (inline) {
    transform.setNodeByKey(inline.key, properties, { normalize: normalize });
  });
}

/**
 * Split the block nodes at a `range`, to optional `height`.
 *
 * @param {Transform} transform
 * @param {Selection} range
 * @param {Number} height (optional)
 * @param {Object} options
 *   @property {Boolean} normalize
 */

function splitBlockAtRange(transform, range) {
  var height = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
  var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  var _options$normalize11 = options.normalize,
      normalize = _options$normalize11 === undefined ? true : _options$normalize11;


  if (range.isExpanded) {
    transform.deleteAtRange(range, { normalize: normalize });
    range = range.collapseToStart();
  }

  var _range6 = range,
      startKey = _range6.startKey,
      startOffset = _range6.startOffset;
  var state = transform.state;
  var document = state.document;

  var node = document.assertDescendant(startKey);
  var parent = document.getClosestBlock(node.key);
  var offset = startOffset;
  var h = 0;

  while (parent && parent.kind == 'block' && h < height) {
    offset += parent.getOffset(node.key);
    node = parent;
    parent = document.getClosestBlock(parent.key);
    h++;
  }

  transform.splitNodeByKey(node.key, offset, { normalize: normalize });
}

/**
 * Split the inline nodes at a `range`, to optional `height`.
 *
 * @param {Transform} transform
 * @param {Selection} range
 * @param {Number} height (optional)
 * @param {Object} options
 *   @property {Boolean} normalize
 */

function splitInlineAtRange(transform, range) {
  var height = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : Infinity;
  var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  var _options$normalize12 = options.normalize,
      normalize = _options$normalize12 === undefined ? true : _options$normalize12;


  if (range.isExpanded) {
    transform.deleteAtRange(range, { normalize: normalize });
    range = range.collapseToStart();
  }

  var _range7 = range,
      startKey = _range7.startKey,
      startOffset = _range7.startOffset;
  var state = transform.state;
  var document = state.document;

  var node = document.assertDescendant(startKey);
  var parent = document.getClosestInline(node.key);
  var offset = startOffset;
  var h = 0;

  while (parent && parent.kind == 'inline' && h < height) {
    offset += parent.getOffset(node.key);
    node = parent;
    parent = document.getClosestInline(parent.key);
    h++;
  }

  transform.splitNodeByKey(node.key, offset, { normalize: normalize });
}

/**
 * Add or remove a `mark` from the characters at `range`, depending on whether
 * it's already there.
 *
 * @param {Transform} transform
 * @param {Selection} range
 * @param {Mixed} mark
 * @param {Object} options
 *   @property {Boolean} normalize
 */

function toggleMarkAtRange(transform, range, mark) {
  var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

  if (range.isCollapsed) return;

  mark = _normalize2.default.mark(mark);

  var _options$normalize13 = options.normalize,
      normalize = _options$normalize13 === undefined ? true : _options$normalize13;
  var state = transform.state;
  var document = state.document;

  var marks = document.getMarksAtRange(range);
  var exists = marks.some(function (m) {
    return m.equals(mark);
  });

  if (exists) {
    transform.removeMarkAtRange(range, mark, { normalize: normalize });
  } else {
    transform.addMarkAtRange(range, mark, { normalize: normalize });
  }
}

/**
 * Unwrap all of the block nodes in a `range` from a block with `properties`.
 *
 * @param {Transform} transform
 * @param {Selection} range
 * @param {String|Object} properties
 * @param {Object} options
 *   @property {Boolean} normalize
 */

function unwrapBlockAtRange(transform, range, properties) {
  var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

  properties = _normalize2.default.nodeProperties(properties);

  var _options$normalize14 = options.normalize,
      normalize = _options$normalize14 === undefined ? true : _options$normalize14;
  var state = transform.state;
  var _state3 = state,
      document = _state3.document;

  var blocks = document.getBlocksAtRange(range);
  var wrappers = blocks.map(function (block) {
    return document.getClosest(block.key, function (parent) {
      if (parent.kind != 'block') return false;
      if (properties.type != null && parent.type != properties.type) return false;
      if (properties.isVoid != null && parent.isVoid != properties.isVoid) return false;
      if (properties.data != null && !parent.data.isSuperset(properties.data)) return false;
      return true;
    });
  }).filter(function (exists) {
    return exists;
  }).toOrderedSet().toList();

  wrappers.forEach(function (block) {
    var first = block.nodes.first();
    var last = block.nodes.last();
    var parent = document.getParent(block.key);
    var index = parent.nodes.indexOf(block);

    var children = block.nodes.filter(function (child) {
      return blocks.some(function (b) {
        return child == b || child.hasDescendant(b.key);
      });
    });

    var firstMatch = children.first();
    var lastMatch = children.last();

    if (first == firstMatch && last == lastMatch) {
      block.nodes.forEach(function (child, i) {
        transform.moveNodeByKey(child.key, parent.key, index + i, OPTS);
      });

      transform.removeNodeByKey(block.key, OPTS);
    } else if (last == lastMatch) {
      block.nodes.skipUntil(function (n) {
        return n == firstMatch;
      }).forEach(function (child, i) {
        transform.moveNodeByKey(child.key, parent.key, index + 1 + i, OPTS);
      });
    } else if (first == firstMatch) {
      block.nodes.takeUntil(function (n) {
        return n == lastMatch;
      }).push(lastMatch).forEach(function (child, i) {
        transform.moveNodeByKey(child.key, parent.key, index + i, OPTS);
      });
    } else {
      var offset = block.getOffset(firstMatch.key);

      transform.splitNodeByKey(block.key, offset, OPTS);
      state = transform.state;
      document = state.document;

      children.forEach(function (child, i) {
        if (i == 0) {
          var extra = child;
          child = document.getNextBlock(child.key);
          transform.removeNodeByKey(extra.key, OPTS);
        }

        transform.moveNodeByKey(child.key, parent.key, index + 1 + i, OPTS);
      });
    }
  });

  // TODO: optmize to only normalize the right block
  if (normalize) {
    transform.normalizeDocument(_core2.default);
  }
}

/**
 * Unwrap the inline nodes in a `range` from an inline with `properties`.
 *
 * @param {Transform} transform
 * @param {Selection} range
 * @param {String|Object} properties
 * @param {Object} options
 *   @property {Boolean} normalize
 */

function unwrapInlineAtRange(transform, range, properties) {
  var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

  properties = _normalize2.default.nodeProperties(properties);

  var _options$normalize15 = options.normalize,
      normalize = _options$normalize15 === undefined ? true : _options$normalize15;
  var state = transform.state;
  var document = state.document;

  var texts = document.getTextsAtRange(range);
  var inlines = texts.map(function (text) {
    return document.getClosest(text.key, function (parent) {
      if (parent.kind != 'inline') return false;
      if (properties.type != null && parent.type != properties.type) return false;
      if (properties.isVoid != null && parent.isVoid != properties.isVoid) return false;
      if (properties.data != null && !parent.data.isSuperset(properties.data)) return false;
      return true;
    });
  }).filter(function (exists) {
    return exists;
  }).toOrderedSet().toList();

  inlines.forEach(function (inline) {
    var parent = document.getParent(inline.key);
    var index = parent.nodes.indexOf(inline);

    inline.nodes.forEach(function (child, i) {
      transform.moveNodeByKey(child.key, parent.key, index + i, OPTS);
    });
  });

  // TODO: optmize to only normalize the right block
  if (normalize) {
    transform.normalizeDocument(_core2.default);
  }
}

/**
 * Wrap all of the blocks in a `range` in a new `block`.
 *
 * @param {Transform} transform
 * @param {Selection} range
 * @param {Block|Object|String} block
 * @param {Object} options
 *   @property {Boolean} normalize
 */

function wrapBlockAtRange(transform, range, block) {
  var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

  block = _normalize2.default.block(block);
  block = block.merge({ nodes: block.nodes.clear() });

  var _options$normalize16 = options.normalize,
      normalize = _options$normalize16 === undefined ? true : _options$normalize16;
  var state = transform.state;
  var document = state.document;


  var blocks = document.getBlocksAtRange(range);
  var firstblock = blocks.first();
  var lastblock = blocks.last();
  var parent = void 0,
      siblings = void 0,
      index = void 0;

  // if there is only one block in the selection then we know the parent and siblings
  if (blocks.length === 1) {
    parent = document.getParent(firstblock.key);
    siblings = blocks;
  }

  // determine closest shared parent to all blocks in selection
  else {
      parent = document.getClosest(firstblock.key, function (p1) {
        return !!document.getClosest(lastblock.key, function (p2) {
          return p1 == p2;
        });
      });
    }

  // if no shared parent could be found then the parent is the document
  if (parent == null) parent = document;

  // create a list of direct children siblings of parent that fall in the selection
  if (siblings == null) {
    var indexes = parent.nodes.reduce(function (ind, node, i) {
      if (node == firstblock || node.hasDescendant(firstblock.key)) ind[0] = i;
      if (node == lastblock || node.hasDescendant(lastblock.key)) ind[1] = i;
      return ind;
    }, []);

    index = indexes[0];
    siblings = parent.nodes.slice(indexes[0], indexes[1] + 1);
  }

  // get the index to place the new wrapped node at
  if (index == null) {
    index = parent.nodes.indexOf(siblings.first());
  }

  // inject the new block node into the parent
  transform.insertNodeByKey(parent.key, index, block, OPTS);

  // move the sibling nodes into the new block node
  siblings.forEach(function (node, i) {
    transform.moveNodeByKey(node.key, block.key, i, OPTS);
  });

  if (normalize) {
    transform.normalizeNodeByKey(parent.key, _core2.default);
  }
}

/**
 * Wrap the text and inlines in a `range` in a new `inline`.
 *
 * @param {Transform} transform
 * @param {Selection} range
 * @param {Inline|Object|String} inline
 * @param {Object} options
 *   @property {Boolean} normalize
 */

function wrapInlineAtRange(transform, range, inline) {
  var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  var state = transform.state;
  var _state4 = state,
      document = _state4.document;
  var _options$normalize17 = options.normalize,
      normalize = _options$normalize17 === undefined ? true : _options$normalize17;
  var startKey = range.startKey,
      startOffset = range.startOffset,
      endKey = range.endKey,
      endOffset = range.endOffset;


  if (range.isCollapsed) {
    // Wrapping an inline void
    var inlineParent = document.getClosestInline(startKey);
    if (!inlineParent.isVoid) {
      return;
    }

    return transform.wrapInlineByKey(inlineParent.key, inline, options);
  }

  inline = _normalize2.default.inline(inline);
  inline = inline.merge({ nodes: inline.nodes.clear() });

  var blocks = document.getBlocksAtRange(range);
  var startBlock = document.getClosestBlock(startKey);
  var endBlock = document.getClosestBlock(endKey);
  var startChild = startBlock.getHighestChild(startKey);
  var endChild = endBlock.getHighestChild(endKey);
  var startIndex = startBlock.nodes.indexOf(startChild);
  var endIndex = endBlock.nodes.indexOf(endChild);

  var startOff = startChild.key == startKey ? startOffset : startChild.getOffset(startKey) + startOffset;

  var endOff = endChild.key == endKey ? endOffset : endChild.getOffset(endKey) + endOffset;

  if (startBlock == endBlock) {
    (function () {
      if (endOff != endChild.length) {
        transform.splitNodeByKey(endChild.key, endOff, OPTS);
      }

      if (startOff != 0) {
        transform.splitNodeByKey(startChild.key, startOff, OPTS);
      }

      state = transform.state;
      document = state.document;
      startBlock = document.getClosestBlock(startKey);
      startChild = startBlock.getHighestChild(startKey);

      var startInner = startOff == 0 ? startChild : document.getNextSibling(startChild.key);

      var startInnerIndex = startBlock.nodes.indexOf(startInner);

      var endInner = startKey == endKey ? startInner : startBlock.getHighestChild(endKey);
      var inlines = startBlock.nodes.skipUntil(function (n) {
        return n == startInner;
      }).takeUntil(function (n) {
        return n == endInner;
      }).push(endInner);

      var node = inline.regenerateKey();

      transform.insertNodeByKey(startBlock.key, startInnerIndex, node, OPTS);

      inlines.forEach(function (child, i) {
        transform.moveNodeByKey(child.key, node.key, i, OPTS);
      });

      if (normalize) {
        transform.normalizeNodeByKey(startBlock.key, _core2.default);
      }
    })();
  } else {
    (function () {
      transform.splitNodeByKey(startChild.key, startOff, OPTS);
      transform.splitNodeByKey(endChild.key, endOff, OPTS);

      state = transform.state;
      document = state.document;
      startBlock = document.getDescendant(startBlock.key);
      endBlock = document.getDescendant(endBlock.key);

      var startInlines = startBlock.nodes.slice(startIndex + 1);
      var endInlines = endBlock.nodes.slice(0, endIndex + 1);
      var startNode = inline.regenerateKey();
      var endNode = inline.regenerateKey();

      transform.insertNodeByKey(startBlock.key, startIndex - 1, startNode, OPTS);
      transform.insertNodeByKey(endBlock.key, endIndex, endNode, OPTS);

      startInlines.forEach(function (child, i) {
        transform.moveNodeByKey(child.key, startNode.key, i, OPTS);
      });

      endInlines.forEach(function (child, i) {
        transform.moveNodeByKey(child.key, endNode.key, i, OPTS);
      });

      if (normalize) {
        transform.normalizeNodeByKey(startBlock.key, _core2.default).normalizeNodeByKey(endBlock.key, _core2.default);
      }

      blocks.slice(1, -1).forEach(function (block) {
        var node = inline.regenerateKey();
        transform.insertNodeByKey(block.key, 0, node, OPTS);

        block.nodes.forEach(function (child, i) {
          transform.moveNodeByKey(child.key, node.key, i, OPTS);
        });

        if (normalize) {
          transform.normalizeNodeByKey(block.key, _core2.default);
        }
      });
    })();
  }
}

/**
 * Wrap the text in a `range` in a prefix/suffix.
 *
 * @param {Transform} transform
 * @param {Selection} range
 * @param {String} prefix
 * @param {String} suffix (optional)
 * @param {Object} options
 *   @property {Boolean} normalize
 */

function wrapTextAtRange(transform, range, prefix) {
  var suffix = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : prefix;
  var options = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};
  var _options$normalize18 = options.normalize,
      normalize = _options$normalize18 === undefined ? true : _options$normalize18;
  var startKey = range.startKey,
      endKey = range.endKey;

  var start = range.collapseToStart();
  var end = range.collapseToEnd();

  if (startKey == endKey) {
    end = end.moveForward(prefix.length);
  }

  transform.insertTextAtRange(start, prefix, [], { normalize: normalize });
  transform.insertTextAtRange(end, suffix, [], { normalize: normalize });
}