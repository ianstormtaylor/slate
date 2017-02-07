'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.collapseToEndOfNextBlock = collapseToEndOfNextBlock;
exports.collapseToEndOfNextText = collapseToEndOfNextText;
exports.collapseToEndOfPreviousBlock = collapseToEndOfPreviousBlock;
exports.collapseToEndOfPreviousText = collapseToEndOfPreviousText;
exports.collapseToStartOfNextBlock = collapseToStartOfNextBlock;
exports.collapseToStartOfNextText = collapseToStartOfNextText;
exports.collapseToStartOfPreviousBlock = collapseToStartOfPreviousBlock;
exports.collapseToStartOfPreviousText = collapseToStartOfPreviousText;
exports.moveTo = moveTo;
exports.unsetMarks = unsetMarks;
exports.snapshotSelection = snapshotSelection;
exports.unsetSelection = unsetSelection;

/**
 * Auto-generate many transforms based on the `Selection` methods.
 */

var blur = exports.blur = generate('blur');
var collapseToAnchor = exports.collapseToAnchor = generate('collapseToAnchor');
var collapseToEnd = exports.collapseToEnd = generate('collapseToEnd');
var collapseToFocus = exports.collapseToFocus = generate('collapseToFocus');
var collapseToStart = exports.collapseToStart = generate('collapseToStart');
var collapseToEndOf = exports.collapseToEndOf = generate('collapseToEndOf');
var collapseToStartOf = exports.collapseToStartOf = generate('collapseToStartOf');
var extendBackward = exports.extendBackward = generate('extendBackward');
var extendForward = exports.extendForward = generate('extendForward');
var extendToEndOf = exports.extendToEndOf = generate('extendToEndOf');
var extendToStartOf = exports.extendToStartOf = generate('extendToStartOf');
var focus = exports.focus = generate('focus');
var moveBackward = exports.moveBackward = generate('moveBackward');
var moveForward = exports.moveForward = generate('moveForward');
var moveToOffsets = exports.moveToOffsets = generate('moveToOffsets');
var moveToRangeOf = exports.moveToRangeOf = generate('moveToRangeOf');
var moveStartOffset = exports.moveStartOffset = generate('moveStartOffset');
var moveEndOffset = exports.moveEndOffset = generate('moveEndOffset');

var flipSelection = exports.flipSelection = generate('flip');

/**
 * Move the selection to the end of the next block.
 *
 * @param {Transform} tansform
 */

function collapseToEndOfNextBlock(transform) {
  var state = transform.state;
  var document = state.document,
      selection = state.selection;

  var blocks = document.getBlocksAtRange(selection);
  var last = blocks.last();
  var next = document.getNextBlock(last);
  if (!next) return;

  var sel = selection.collapseToEndOf(next);
  transform.setSelectionOperation(sel);
}

/**
 * Move the selection to the end of the next text.
 *
 * @param {Transform} tansform
 */

function collapseToEndOfNextText(transform) {
  var state = transform.state;
  var document = state.document,
      selection = state.selection;

  var texts = document.getTextsAtRange(selection);
  var last = texts.last();
  var next = document.getNextText(last);
  if (!next) return;

  var sel = selection.collapseToEndOf(next);
  transform.setSelectionOperation(sel);
}

/**
 * Move the selection to the end of the previous block.
 *
 * @param {Transform} tansform
 */

function collapseToEndOfPreviousBlock(transform) {
  var state = transform.state;
  var document = state.document,
      selection = state.selection;

  var blocks = document.getBlocksAtRange(selection);
  var first = blocks.first();
  var previous = document.getPreviousBlock(first);
  if (!previous) return;

  var sel = selection.collapseToEndOf(previous);
  transform.setSelectionOperation(sel);
}

/**
 * Move the selection to the end of the previous text.
 *
 * @param {Transform} tansform
 */

function collapseToEndOfPreviousText(transform) {
  var state = transform.state;
  var document = state.document,
      selection = state.selection;

  var texts = document.getTextsAtRange(selection);
  var first = texts.first();
  var previous = document.getPreviousText(first);
  if (!previous) return;

  var sel = selection.collapseToEndOf(previous);
  transform.setSelectionOperation(sel);
}

/**
 * Move the selection to the start of the next block.
 *
 * @param {Transform} tansform
 */

function collapseToStartOfNextBlock(transform) {
  var state = transform.state;
  var document = state.document,
      selection = state.selection;

  var blocks = document.getBlocksAtRange(selection);
  var last = blocks.last();
  var next = document.getNextBlock(last);
  if (!next) return;

  var sel = selection.collapseToStartOf(next);
  transform.setSelectionOperation(sel);
}

/**
 * Move the selection to the start of the next text.
 *
 * @param {Transform} tansform
 */

function collapseToStartOfNextText(transform) {
  var state = transform.state;
  var document = state.document,
      selection = state.selection;

  var texts = document.getTextsAtRange(selection);
  var last = texts.last();
  var next = document.getNextText(last);
  if (!next) return;

  var sel = selection.collapseToStartOf(next);
  transform.setSelectionOperation(sel);
}

/**
 * Move the selection to the start of the previous block.
 *
 * @param {Transform} tansform
 */

function collapseToStartOfPreviousBlock(transform) {
  var state = transform.state;
  var document = state.document,
      selection = state.selection;

  var blocks = document.getBlocksAtRange(selection);
  var first = blocks.first();
  var previous = document.getPreviousBlock(first);
  if (!previous) return;

  var sel = selection.collapseToStartOf(previous);
  transform.setSelectionOperation(sel);
}

/**
 * Move the selection to the start of the previous text.
 *
 * @param {Transform} tansform
 */

function collapseToStartOfPreviousText(transform) {
  var state = transform.state;
  var document = state.document,
      selection = state.selection;

  var texts = document.getTextsAtRange(selection);
  var first = texts.first();
  var previous = document.getPreviousText(first);
  if (!previous) return;

  var sel = selection.collapseToStartOf(previous);
  transform.setSelectionOperation(sel);
}

/**
 * Move the selection to a specific anchor and focus point.
 *
 * @param {Transform} transform
 * @param {Object} properties
 */

function moveTo(transform, properties) {
  transform.setSelectionOperation(properties);
}

/**
 * Unset the selection's marks.
 *
 * @param {Transform} transform
 */

function unsetMarks(transform) {
  transform.setSelectionOperation({ marks: null });
}

/**
 * Snapshot the current selection.
 *
 * @param {Transform} transform
 */

function snapshotSelection(transform) {
  var state = transform.state;
  var selection = state.selection;

  transform.setSelectionOperation(selection, { snapshot: true });
}

/**
 * Unset the selection, removing an association to a node.
 *
 * @param {Transform} transform
 */

function unsetSelection(transform) {
  transform.setSelectionOperation({
    anchorKey: null,
    anchorOffset: 0,
    focusKey: null,
    focusOffset: 0,
    isFocused: false,
    isBackward: false
  });
}

/**
 * Generate a selection transform for `method`.
 *
 * @param {String} method
 * @return {Function}
 */

function generate(method) {
  return function (transform) {
    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    var state = transform.state;
    var document = state.document,
        selection = state.selection;

    var sel = selection[method].apply(selection, args).normalize(document);
    transform.setSelectionOperation(sel);
  };
}