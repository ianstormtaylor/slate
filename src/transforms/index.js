
/**
 * Apply operation.
 */

import {
  applyOperation,
} from './apply-operation'

/**
 * Call external transform.
 */

import call from './call'

/**
 * Operations.
 */

import {
  addMarkOperation,
  insertNodeOperation,
  insertTextOperation,
  joinNodeOperation,
  moveNodeOperation,
  removeMarkOperation,
  removeNodeOperation,
  removeTextOperation,
  setMarkOperation,
  setNodeOperation,
  setSelectionOperation,
  splitNodeAtOffsetOperation,
  splitNodeOperation,
} from './operations'

/**
 * At range.
 */

import {
  deleteAtRange,
  deleteBackwardAtRange,
  deleteCharBackwardAtRange,
  deleteCharForwardAtRange,
  deleteForwardAtRange,
  deleteLineBackwardAtRange,
  deleteLineForwardAtRange,
  deleteWordBackwardAtRange,
  deleteWordForwardAtRange,
  insertBlockAtRange,
  insertFragmentAtRange,
  insertInlineAtRange,
  insertTextAtRange,
  addMarkAtRange,
  setBlockAtRange,
  setInlineAtRange,
  splitBlockAtRange,
  splitInlineAtRange,
  removeMarkAtRange,
  toggleMarkAtRange,
  unwrapBlockAtRange,
  unwrapInlineAtRange,
  wrapBlockAtRange,
  wrapInlineAtRange,
  wrapTextAtRange,
} from './at-range'

/**
 * At current range.
 */

import {
  _delete,
  deleteBackward,
  deleteCharBackward,
  deleteCharForward,
  deleteForward,
  deleteLineBackward,
  deleteLineForward,
  deleteWordBackward,
  deleteWordForward,
  insertBlock,
  insertFragment,
  insertInline,
  insertText,
  addMark,
  setBlock,
  setInline,
  splitBlock,
  splitInline,
  removeMark,
  toggleMark,
  unwrapBlock,
  unwrapInline,
  wrapBlock,
  wrapInline,
  wrapText,
} from './at-current-range'

/**
 * By key.
 */

import {
  addMarkByKey,
  insertNodeByKey,
  insertTextByKey,
  joinNodeByKey,
  moveNodeByKey,
  removeMarkByKey,
  removeNodeByKey,
  removeTextByKey,
  setMarkByKey,
  setNodeByKey,
  splitNodeByKey,
  unwrapInlineByKey,
  unwrapBlockByKey,
  unwrapNodeByKey,
  wrapBlockByKey,
  wrapInlineByKey,
} from './by-key'

/**
 * On selection.
 */

import {
  blur,
  collapseToAnchor,
  collapseToEnd,
  collapseToEndOf,
  collapseToEndOfNextBlock,
  collapseToEndOfNextText,
  collapseToEndOfPreviousBlock,
  collapseToEndOfPreviousText,
  collapseToFocus,
  collapseToStart,
  collapseToStartOf,
  collapseToStartOfNextBlock,
  collapseToStartOfNextText,
  collapseToStartOfPreviousBlock,
  collapseToStartOfPreviousText,
  extendBackward,
  extendForward,
  extendToEndOf,
  extendToStartOf,
  flipSelection,
  focus,
  moveBackward,
  moveForward,
  moveEndOffset,
  moveStartOffset,
  moveTo,
  moveToOffsets,
  moveToRangeOf,
  unsetMarks,
  unsetSelection,
  snapshotSelection,
} from './on-selection'

/**
 * On history.
 */

import {
  redo,
  save,
  undo,
} from './on-history'

/**
 * Normalize.
 */

import {
  normalize,
  normalizeDocument,
  normalizeSelection,
  normalizeNodeByKey,
} from './normalize'

/**
 * Export.
 *
 * @type {Object}
 */

export default {

  /**
   * Apply operation.
   */

  applyOperation,

  /**
   * Call external transform.
   */

  call,

  /**
   * Operations.
   */

  addMarkOperation,
  insertNodeOperation,
  insertTextOperation,
  joinNodeOperation,
  moveNodeOperation,
  removeMarkOperation,
  removeNodeOperation,
  removeTextOperation,
  setMarkOperation,
  setNodeOperation,
  setSelectionOperation,
  splitNodeAtOffsetOperation,
  splitNodeOperation,

  /**
   * At range.
   */

  deleteAtRange,
  deleteBackwardAtRange,
  deleteCharBackwardAtRange,
  deleteCharForwardAtRange,
  deleteForwardAtRange,
  deleteLineBackwardAtRange,
  deleteLineForwardAtRange,
  deleteWordBackwardAtRange,
  deleteWordForwardAtRange,
  insertBlockAtRange,
  insertFragmentAtRange,
  insertInlineAtRange,
  insertTextAtRange,
  addMarkAtRange,
  setBlockAtRange,
  setInlineAtRange,
  splitBlockAtRange,
  splitInlineAtRange,
  removeMarkAtRange,
  toggleMarkAtRange,
  unwrapBlockAtRange,
  unwrapInlineAtRange,
  wrapBlockAtRange,
  wrapInlineAtRange,
  wrapTextAtRange,

  /**
   * At current range.
   */

  delete: _delete,
  deleteBackward,
  deleteCharBackward,
  deleteCharForward,
  deleteForward,
  deleteLineBackward,
  deleteLineForward,
  deleteWordBackward,
  deleteWordForward,
  insertBlock,
  insertFragment,
  insertInline,
  insertText,
  addMark,
  setBlock,
  setInline,
  splitBlock,
  splitInline,
  removeMark,
  toggleMark,
  unwrapBlock,
  unwrapInline,
  wrapBlock,
  wrapInline,
  wrapText,

  /**
   * By key.
   */

  addMarkByKey,
  insertNodeByKey,
  insertTextByKey,
  joinNodeByKey,
  moveNodeByKey,
  removeMarkByKey,
  removeNodeByKey,
  removeTextByKey,
  setMarkByKey,
  setNodeByKey,
  splitNodeByKey,
  unwrapInlineByKey,
  unwrapBlockByKey,
  unwrapNodeByKey,
  wrapBlockByKey,
  wrapInlineByKey,

  /**
   * On selection.
   */

  blur,
  collapseToAnchor,
  collapseToEnd,
  collapseToEndOf,
  collapseToEndOfNextBlock,
  collapseToEndOfNextText,
  collapseToEndOfPreviousBlock,
  collapseToEndOfPreviousText,
  collapseToFocus,
  collapseToStart,
  collapseToStartOf,
  collapseToStartOfNextBlock,
  collapseToStartOfNextText,
  collapseToStartOfPreviousBlock,
  collapseToStartOfPreviousText,
  extendBackward,
  extendForward,
  extendToEndOf,
  extendToStartOf,
  focus,
  flipSelection,
  moveBackward,
  moveForward,
  moveEndOffset,
  moveStartOffset,
  moveTo,
  moveToOffsets,
  moveToRangeOf,
  unsetMarks,
  unsetSelection,
  snapshotSelection,

  /**
   * History.
   */

  redo,
  save,
  undo,

  /**
   * Normalize.
   */

  normalize,
  normalizeDocument,
  normalizeSelection,
  normalizeNodeByKey,
}
