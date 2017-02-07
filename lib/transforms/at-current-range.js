'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addMark = addMark;
exports._delete = _delete;
exports.deleteBackward = deleteBackward;
exports.deleteCharBackward = deleteCharBackward;
exports.deleteLineBackward = deleteLineBackward;
exports.deleteWordBackward = deleteWordBackward;
exports.deleteForward = deleteForward;
exports.deleteCharForward = deleteCharForward;
exports.deleteLineForward = deleteLineForward;
exports.deleteWordForward = deleteWordForward;
exports.insertBlock = insertBlock;
exports.insertFragment = insertFragment;
exports.insertInline = insertInline;
exports.insertText = insertText;
exports.setBlock = setBlock;
exports.setInline = setInline;
exports.splitBlock = splitBlock;
exports.splitInline = splitInline;
exports.removeMark = removeMark;
exports.toggleMark = toggleMark;
exports.unwrapBlock = unwrapBlock;
exports.unwrapInline = unwrapInline;
exports.wrapBlock = wrapBlock;
exports.wrapInline = wrapInline;
exports.wrapText = wrapText;

var _normalize = require('../utils/normalize');

var _normalize2 = _interopRequireDefault(_normalize);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Add a `mark` to the characters in the current selection.
 *
 * @param {Transform} transform
 * @param {Mark} mark
 */

function addMark(transform, mark) {
  mark = _normalize2.default.mark(mark);
  var state = transform.state;
  var document = state.document,
      selection = state.selection;


  if (selection.isExpanded) {
    transform.addMarkAtRange(selection, mark);
    return;
  }

  if (selection.marks) {
    var _marks = selection.marks.add(mark);
    var _sel = selection.merge({ marks: _marks });
    transform.moveTo(_sel);
    return;
  }

  var marks = document.getMarksAtRange(selection).add(mark);
  var sel = selection.merge({ marks: marks });
  transform.moveTo(sel);
}

/**
 * Delete at the current selection.
 *
 * @param {Transform} transform
 */

function _delete(transform) {
  var state = transform.state;
  var selection = state.selection;

  if (selection.isCollapsed) return;

  transform.snapshotSelection().deleteAtRange(selection)
  // Ensure that the selection is collapsed to the start, because in certain
  // cases when deleting across inline nodes this isn't guaranteed.
  .collapseToStart().snapshotSelection();
}

/**
 * Delete backward `n` characters at the current selection.
 *
 * @param {Transform} transform
 * @param {Number} n (optional)
 */

function deleteBackward(transform) {
  var n = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
  var state = transform.state;
  var selection = state.selection;

  transform.deleteBackwardAtRange(selection, n);
}

/**
 * Delete backward until the character boundary at the current selection.
 *
 * @param {Transform} transform
 */

function deleteCharBackward(transform) {
  var state = transform.state;
  var selection = state.selection;

  transform.deleteCharBackwardAtRange(selection);
}

/**
 * Delete backward until the line boundary at the current selection.
 *
 * @param {Transform} transform
 */

function deleteLineBackward(transform) {
  var state = transform.state;
  var selection = state.selection;

  transform.deleteLineBackwardAtRange(selection);
}

/**
 * Delete backward until the word boundary at the current selection.
 *
 * @param {Transform} transform
 */

function deleteWordBackward(transform) {
  var state = transform.state;
  var selection = state.selection;

  transform.deleteWordBackwardAtRange(selection);
}

/**
 * Delete forward `n` characters at the current selection.
 *
 * @param {Transform} transform
 * @param {Number} n (optional)
 */

function deleteForward(transform) {
  var n = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
  var state = transform.state;
  var selection = state.selection;

  transform.deleteForwardAtRange(selection, n);
}

/**
 * Delete forward until the character boundary at the current selection.
 *
 * @param {Transform} transform
 */

function deleteCharForward(transform) {
  var state = transform.state;
  var selection = state.selection;

  transform.deleteCharForwardAtRange(selection);
}

/**
 * Delete forward until the line boundary at the current selection.
 *
 * @param {Transform} transform
 */

function deleteLineForward(transform) {
  var state = transform.state;
  var selection = state.selection;

  transform.deleteLineForwardAtRange(selection);
}

/**
 * Delete forward until the word boundary at the current selection.
 *
 * @param {Transform} transform
 */

function deleteWordForward(transform) {
  var state = transform.state;
  var selection = state.selection;

  transform.deleteWordForwardAtRange(selection);
}

/**
 * Insert a `block` at the current selection.
 *
 * @param {Transform} transform
 * @param {String|Object|Block} block
 */

function insertBlock(transform, block) {
  block = _normalize2.default.block(block);
  var state = transform.state;
  var selection = state.selection;

  transform.insertBlockAtRange(selection, block);

  // If the node was successfully inserted, update the selection.
  var node = transform.state.document.getNode(block.key);
  if (node) transform.collapseToEndOf(node);
}

/**
 * Insert a `fragment` at the current selection.
 *
 * @param {Transform} transform
 * @param {Document} fragment
 */

function insertFragment(transform, fragment) {
  var state = transform.state;
  var _state = state,
      document = _state.document,
      selection = _state.selection;


  if (!fragment.length) return;

  var _state2 = state,
      startText = _state2.startText,
      endText = _state2.endText;

  var lastText = fragment.getLastText();
  var lastInline = fragment.getClosestInline(lastText.key);
  var keys = document.getTexts().map(function (text) {
    return text.key;
  });
  var isAppending = selection.hasEdgeAtEndOf(endText) || selection.hasEdgeAtStartOf(startText);

  transform.unsetSelection();
  transform.insertFragmentAtRange(selection, fragment);
  state = transform.state;
  document = state.document;

  var newTexts = document.getTexts().filter(function (n) {
    return !keys.includes(n.key);
  });
  var newText = isAppending ? newTexts.last() : newTexts.takeLast(2).first();
  var after = void 0;

  if (newText && lastInline) {
    after = selection.collapseToEndOf(newText);
  } else if (newText) {
    after = selection.collapseToStartOf(newText).moveForward(lastText.length);
  } else {
    after = selection.collapseToStart().moveForward(lastText.length);
  }

  transform.moveTo(after);
}

/**
 * Insert a `inline` at the current selection.
 *
 * @param {Transform} transform
 * @param {String|Object|Block} inline
 */

function insertInline(transform, inline) {
  inline = _normalize2.default.inline(inline);
  var state = transform.state;
  var selection = state.selection;

  transform.insertInlineAtRange(selection, inline);

  // If the node was successfully inserted, update the selection.
  var node = transform.state.document.getNode(inline.key);
  if (node) transform.collapseToEndOf(node);
}

/**
 * Insert a `text` string at the current selection.
 *
 * @param {Transform} transform
 * @param {String} text
 * @param {Set<Mark>} marks (optional)
 */

function insertText(transform, text, marks) {
  var state = transform.state;
  var document = state.document,
      selection = state.selection;

  marks = marks || selection.marks;
  transform.insertTextAtRange(selection, text, marks);

  // If the text was successfully inserted, and the selection had marks on it,
  // unset the selection's marks.
  if (selection.marks && document != transform.state.document) {
    transform.unsetMarks();
  }
}

/**
 * Set `properties` of the block nodes in the current selection.
 *
 * @param {Transform} transform
 * @param {Object} properties
 */

function setBlock(transform, properties) {
  var state = transform.state;
  var selection = state.selection;

  transform.setBlockAtRange(selection, properties);
}

/**
 * Set `properties` of the inline nodes in the current selection.
 *
 * @param {Transform} transform
 * @param {Object} properties
 */

function setInline(transform, properties) {
  var state = transform.state;
  var selection = state.selection;

  transform.setInlineAtRange(selection, properties);
}

/**
 * Split the block node at the current selection, to optional `depth`.
 *
 * @param {Transform} transform
 * @param {Number} depth (optional)
 */

function splitBlock(transform) {
  var depth = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
  var state = transform.state;
  var selection = state.selection;

  transform.snapshotSelection().splitBlockAtRange(selection, depth).collapseToEnd().snapshotSelection();
}

/**
 * Split the inline nodes at the current selection, to optional `depth`.
 *
 * @param {Transform} transform
 * @param {Number} depth (optional)
 */

function splitInline(transform) {
  var depth = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : Infinity;
  var state = transform.state;
  var selection = state.selection;

  transform.snapshotSelection().splitInlineAtRange(selection, depth).snapshotSelection();
}

/**
 * Remove a `mark` from the characters in the current selection.
 *
 * @param {Transform} transform
 * @param {Mark} mark
 */

function removeMark(transform, mark) {
  mark = _normalize2.default.mark(mark);
  var state = transform.state;
  var document = state.document,
      selection = state.selection;


  if (selection.isExpanded) {
    transform.removeMarkAtRange(selection, mark);
    return;
  }

  if (selection.marks) {
    var _marks2 = selection.marks.remove(mark);
    var _sel2 = selection.merge({ marks: _marks2 });
    transform.moveTo(_sel2);
    return;
  }

  var marks = document.getMarksAtRange(selection).remove(mark);
  var sel = selection.merge({ marks: marks });
  transform.moveTo(sel);
}

/**
 * Add or remove a `mark` from the characters in the current selection,
 * depending on whether it's already there.
 *
 * @param {Transform} transform
 * @param {Mark} mark
 */

function toggleMark(transform, mark) {
  mark = _normalize2.default.mark(mark);
  var state = transform.state;

  var exists = state.marks.some(function (m) {
    return m.equals(mark);
  });

  if (exists) {
    transform.removeMark(mark);
  } else {
    transform.addMark(mark);
  }
}

/**
 * Unwrap the current selection from a block parent with `properties`.
 *
 * @param {Transform} transform
 * @param {Object|String} properties
 */

function unwrapBlock(transform, properties) {
  var state = transform.state;
  var selection = state.selection;

  transform.unwrapBlockAtRange(selection, properties);
}

/**
 * Unwrap the current selection from an inline parent with `properties`.
 *
 * @param {Transform} transform
 * @param {Object|String} properties
 */

function unwrapInline(transform, properties) {
  var state = transform.state;
  var selection = state.selection;

  transform.unwrapInlineAtRange(selection, properties);
}

/**
 * Wrap the block nodes in the current selection with a new block node with
 * `properties`.
 *
 * @param {Transform} transform
 * @param {Object|String} properties
 */

function wrapBlock(transform, properties) {
  var state = transform.state;
  var selection = state.selection;

  transform.wrapBlockAtRange(selection, properties);
}

/**
 * Wrap the current selection in new inline nodes with `properties`.
 *
 * @param {Transform} transform
 * @param {Object|String} properties
 */

function wrapInline(transform, properties) {
  var state = transform.state;
  var _state3 = state,
      document = _state3.document,
      selection = _state3.selection;

  var after = void 0;

  var startKey = selection.startKey;

  var previous = document.getPreviousText(startKey);

  transform.unsetSelection();
  transform.wrapInlineAtRange(selection, properties);
  state = transform.state;
  document = state.document;

  // Determine what the selection should be after wrapping.
  if (selection.isCollapsed) {
    after = selection;
  } else if (selection.startOffset == 0) {
    var text = previous ? document.getNextText(previous.key) : document.getFirstText();
    after = selection.moveToRangeOf(text);
  } else if (selection.startKey == selection.endKey) {
    var _text = document.getNextText(selection.startKey);
    after = selection.moveToRangeOf(_text);
  } else {
    var anchor = document.getNextText(selection.anchorKey);
    var focus = document.getDescendant(selection.focusKey);
    after = selection.merge({
      anchorKey: anchor.key,
      anchorOffset: 0,
      focusKey: focus.key,
      focusOffset: selection.focusOffset
    });
  }

  after = after.normalize(document);
  transform.moveTo(after);
}

/**
 * Wrap the current selection with prefix/suffix.
 *
 * @param {Transform} transform
 * @param {String} prefix
 * @param {String} suffix
 */

function wrapText(transform, prefix) {
  var suffix = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : prefix;
  var state = transform.state;
  var selection = state.selection;

  transform.wrapTextAtRange(selection, prefix, suffix);

  // If the selection was collapsed, it will have moved the start offset too.
  if (selection.isCollapsed) {
    transform.moveStartOffset(0 - prefix.length);
  }

  // Adding the suffix will have pushed the end of the selection further on, so
  // we need to move it back to account for this.
  transform.moveEndOffset(0 - suffix.length);

  // There's a chance that the selection points moved "through" each other,
  // resulting in a now-incorrect selection direction.
  if (selection.isForward != transform.state.selection.isForward) {
    transform.flipSelection();
  }
}