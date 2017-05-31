'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _applyOperation = require('./apply-operation');

var _call = require('./call');

var _call2 = _interopRequireDefault(_call);

var _operations = require('./operations');

var _atRange = require('./at-range');

var _atCurrentRange = require('./at-current-range');

var _byKey = require('./by-key');

var _onSelection = require('./on-selection');

var _onHistory = require('./on-history');

var _normalize = require('./normalize');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Export.
 *
 * @type {Object}
 */

/**
 * On history.
 */

/**
 * By key.
 */

/**
 * At range.
 */

/**
 * Call external transform.
 */

exports.default = {

  /**
   * Apply operation.
   */

  applyOperation: _applyOperation.applyOperation,

  /**
   * Call external transform.
   */

  call: _call2.default,

  /**
   * Operations.
   */

  addMarkOperation: _operations.addMarkOperation,
  insertNodeOperation: _operations.insertNodeOperation,
  insertTextOperation: _operations.insertTextOperation,
  joinNodeOperation: _operations.joinNodeOperation,
  moveNodeOperation: _operations.moveNodeOperation,
  removeMarkOperation: _operations.removeMarkOperation,
  removeNodeOperation: _operations.removeNodeOperation,
  removeTextOperation: _operations.removeTextOperation,
  setMarkOperation: _operations.setMarkOperation,
  setNodeOperation: _operations.setNodeOperation,
  setSelectionOperation: _operations.setSelectionOperation,
  splitNodeAtOffsetOperation: _operations.splitNodeAtOffsetOperation,
  splitNodeOperation: _operations.splitNodeOperation,

  /**
   * At range.
   */

  deleteAtRange: _atRange.deleteAtRange,
  deleteBackwardAtRange: _atRange.deleteBackwardAtRange,
  deleteCharBackwardAtRange: _atRange.deleteCharBackwardAtRange,
  deleteCharForwardAtRange: _atRange.deleteCharForwardAtRange,
  deleteForwardAtRange: _atRange.deleteForwardAtRange,
  deleteLineBackwardAtRange: _atRange.deleteLineBackwardAtRange,
  deleteLineForwardAtRange: _atRange.deleteLineForwardAtRange,
  deleteWordBackwardAtRange: _atRange.deleteWordBackwardAtRange,
  deleteWordForwardAtRange: _atRange.deleteWordForwardAtRange,
  insertBlockAtRange: _atRange.insertBlockAtRange,
  insertFragmentAtRange: _atRange.insertFragmentAtRange,
  insertInlineAtRange: _atRange.insertInlineAtRange,
  insertTextAtRange: _atRange.insertTextAtRange,
  addMarkAtRange: _atRange.addMarkAtRange,
  setBlockAtRange: _atRange.setBlockAtRange,
  setInlineAtRange: _atRange.setInlineAtRange,
  splitBlockAtRange: _atRange.splitBlockAtRange,
  splitInlineAtRange: _atRange.splitInlineAtRange,
  removeMarkAtRange: _atRange.removeMarkAtRange,
  toggleMarkAtRange: _atRange.toggleMarkAtRange,
  unwrapBlockAtRange: _atRange.unwrapBlockAtRange,
  unwrapInlineAtRange: _atRange.unwrapInlineAtRange,
  wrapBlockAtRange: _atRange.wrapBlockAtRange,
  wrapInlineAtRange: _atRange.wrapInlineAtRange,
  wrapTextAtRange: _atRange.wrapTextAtRange,

  /**
   * At current range.
   */

  delete: _atCurrentRange._delete,
  deleteBackward: _atCurrentRange.deleteBackward,
  deleteCharBackward: _atCurrentRange.deleteCharBackward,
  deleteCharForward: _atCurrentRange.deleteCharForward,
  deleteForward: _atCurrentRange.deleteForward,
  deleteLineBackward: _atCurrentRange.deleteLineBackward,
  deleteLineForward: _atCurrentRange.deleteLineForward,
  deleteWordBackward: _atCurrentRange.deleteWordBackward,
  deleteWordForward: _atCurrentRange.deleteWordForward,
  insertBlock: _atCurrentRange.insertBlock,
  insertFragment: _atCurrentRange.insertFragment,
  insertInline: _atCurrentRange.insertInline,
  insertText: _atCurrentRange.insertText,
  addMark: _atCurrentRange.addMark,
  setBlock: _atCurrentRange.setBlock,
  setInline: _atCurrentRange.setInline,
  splitBlock: _atCurrentRange.splitBlock,
  splitInline: _atCurrentRange.splitInline,
  removeMark: _atCurrentRange.removeMark,
  toggleMark: _atCurrentRange.toggleMark,
  unwrapBlock: _atCurrentRange.unwrapBlock,
  unwrapInline: _atCurrentRange.unwrapInline,
  wrapBlock: _atCurrentRange.wrapBlock,
  wrapInline: _atCurrentRange.wrapInline,
  wrapText: _atCurrentRange.wrapText,

  /**
   * By key.
   */

  addMarkByKey: _byKey.addMarkByKey,
  insertNodeByKey: _byKey.insertNodeByKey,
  insertTextByKey: _byKey.insertTextByKey,
  joinNodeByKey: _byKey.joinNodeByKey,
  moveNodeByKey: _byKey.moveNodeByKey,
  removeMarkByKey: _byKey.removeMarkByKey,
  removeNodeByKey: _byKey.removeNodeByKey,
  removeTextByKey: _byKey.removeTextByKey,
  setMarkByKey: _byKey.setMarkByKey,
  setNodeByKey: _byKey.setNodeByKey,
  splitNodeByKey: _byKey.splitNodeByKey,
  unwrapInlineByKey: _byKey.unwrapInlineByKey,
  unwrapBlockByKey: _byKey.unwrapBlockByKey,
  unwrapNodeByKey: _byKey.unwrapNodeByKey,
  wrapBlockByKey: _byKey.wrapBlockByKey,
  wrapInlineByKey: _byKey.wrapInlineByKey,

  /**
   * On selection.
   */

  blur: _onSelection.blur,
  collapseToAnchor: _onSelection.collapseToAnchor,
  collapseToEnd: _onSelection.collapseToEnd,
  collapseToEndOf: _onSelection.collapseToEndOf,
  collapseToEndOfNextBlock: _onSelection.collapseToEndOfNextBlock,
  collapseToEndOfNextText: _onSelection.collapseToEndOfNextText,
  collapseToEndOfPreviousBlock: _onSelection.collapseToEndOfPreviousBlock,
  collapseToEndOfPreviousText: _onSelection.collapseToEndOfPreviousText,
  collapseToFocus: _onSelection.collapseToFocus,
  collapseToStart: _onSelection.collapseToStart,
  collapseToStartOf: _onSelection.collapseToStartOf,
  collapseToStartOfNextBlock: _onSelection.collapseToStartOfNextBlock,
  collapseToStartOfNextText: _onSelection.collapseToStartOfNextText,
  collapseToStartOfPreviousBlock: _onSelection.collapseToStartOfPreviousBlock,
  collapseToStartOfPreviousText: _onSelection.collapseToStartOfPreviousText,
  extendBackward: _onSelection.extendBackward,
  extendForward: _onSelection.extendForward,
  extendToEndOf: _onSelection.extendToEndOf,
  extendToStartOf: _onSelection.extendToStartOf,
  focus: _onSelection.focus,
  flipSelection: _onSelection.flipSelection,
  moveBackward: _onSelection.moveBackward,
  moveForward: _onSelection.moveForward,
  moveEndOffset: _onSelection.moveEndOffset,
  moveStartOffset: _onSelection.moveStartOffset,
  moveTo: _onSelection.moveTo,
  moveToOffsets: _onSelection.moveToOffsets,
  moveToRangeOf: _onSelection.moveToRangeOf,
  unsetMarks: _onSelection.unsetMarks,
  unsetSelection: _onSelection.unsetSelection,
  snapshotSelection: _onSelection.snapshotSelection,

  /**
   * History.
   */

  redo: _onHistory.redo,
  save: _onHistory.save,
  undo: _onHistory.undo,

  /**
   * Normalize.
   */

  normalize: _normalize.normalize,
  normalizeDocument: _normalize.normalizeDocument,
  normalizeSelection: _normalize.normalizeSelection,
  normalizeNodeByKey: _normalize.normalizeNodeByKey
};

/**
 * Normalize.
 */

/**
 * On selection.
 */

/**
 * At current range.
 */

/**
 * Operations.
 */

/**
 * Apply operation.
 */