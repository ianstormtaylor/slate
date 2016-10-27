
/**
 * Apply operation.
 */

import {
  applyOperation,
} from './apply-operation'

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
  splitNodeOperation,
} from './operations'

/**
 * At range.
 */

import {
  deleteAtRange,
  deleteBackwardAtRange,
  deleteForwardAtRange,
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
  deleteForward,
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
  wrapBlockByKey,
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
  focus,
  moveBackward,
  moveForward,
  moveTo,
  moveToOffsets,
  moveToRangeOf,
  unsetSelection,
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
  normalizeWith,
  normalizeNodeWith,
  normalizeParentsWith,
  normalizeDocument,
  normalizeSelection,
  normalizeNodeByKey,
  normalizeParentsByKey,
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
  splitNodeOperation,

  /**
   * At range.
   */

  deleteAtRange,
  deleteBackwardAtRange,
  deleteForwardAtRange,
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
  deleteForward,
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
  wrapBlockByKey,

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
  moveBackward,
  moveForward,
  moveTo,
  moveToOffsets,
  moveToRangeOf,
  unsetSelection,

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
  normalizeWith,
  normalizeNodeWith,
  normalizeParentsWith,
  normalizeDocument,
  normalizeSelection,
  normalizeNodeByKey,
  normalizeParentsByKey,
}
