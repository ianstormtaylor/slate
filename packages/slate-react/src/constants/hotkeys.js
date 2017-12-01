
import { isKeyHotkey } from 'is-hotkey'

import { IS_IOS, IS_MAC } from './environment'

/**
 * Is Apple?
 *
 * @type {Boolean}
 */

const IS_APPLE = IS_IOS || IS_MAC

/**
 * Hotkeys.
 *
 * @type {Function}
 */

const BOLD = isKeyHotkey('mod+b')
const ITALIC = isKeyHotkey('mod+i')

const ENTER = isKeyHotkey('enter')
const SHIFT_ENTER = isKeyHotkey('shift+enter')
const SPLIT_BLOCK = e => ENTER(e) || SHIFT_ENTER(e)

const BACKSPACE = isKeyHotkey('backspace')
const SHIFT_BACKSPACE = isKeyHotkey('shift+backspace')
const DELETE = isKeyHotkey('delete')
const SHIFT_DELETE = isKeyHotkey('shift+delete')
const DELETE_BACKWARD = e => BACKSPACE(e) || SHIFT_BACKSPACE(e)
const DELETE_FORWARD = e => DELETE(e) || SHIFT_DELETE(e)

const DELETE_CHAR_BACKWARD_MAC = isKeyHotkey('ctrl+h')
const DELETE_CHAR_FORWARD_MAC = isKeyHotkey('ctrl+d')
const DELETE_CHAR_BACKWARD = e => DELETE_BACKWARD(e) || (IS_APPLE && DELETE_CHAR_BACKWARD_MAC(e))
const DELETE_CHAR_FORWARD = e => DELETE_FORWARD(e) || (IS_APPLE && DELETE_CHAR_FORWARD_MAC(e))

const DELETE_LINE_BACKWARD_MAC = isKeyHotkey('cmd+backspace')
const DELETE_LINE_FORWARD_MAC = isKeyHotkey('ctrl+k')
const DELETE_LINE_BACKWARD = e => IS_APPLE && DELETE_LINE_BACKWARD_MAC(e)
const DELETE_LINE_FORWARD = e => IS_APPLE && DELETE_LINE_FORWARD_MAC(e)

const DELETE_WORD_BACKWARD_MAC = isKeyHotkey('option+backspace')
const DELETE_WORD_BACKWARD_PC = isKeyHotkey('ctrl+backspace')
const DELETE_WORD_FORWARD_MAC = isKeyHotkey('option+delete')
const DELETE_WORD_FORWARD_PC = isKeyHotkey('ctrl+delete')
const DELETE_WORD_BACKWARD = e => IS_APPLE ? DELETE_WORD_BACKWARD_MAC(e) : DELETE_WORD_BACKWARD_PC(e)
const DELETE_WORD_FORWARD = e => IS_APPLE ? DELETE_WORD_FORWARD_MAC(e) : DELETE_WORD_FORWARD_PC(e)

const COLLAPSE_CHAR_FORWARD = isKeyHotkey('right')
const COLLAPSE_CHAR_BACKWARD = isKeyHotkey('left')

const COLLAPSE_LINE_BACKWARD_MAC = isKeyHotkey('option+up')
const COLLAPSE_LINE_FORWARD_MAC = isKeyHotkey('option+down')
const COLLAPSE_LINE_BACKWARD = e => IS_APPLE && COLLAPSE_LINE_BACKWARD_MAC(e)
const COLLAPSE_LINE_FORWARD = e => IS_APPLE && COLLAPSE_LINE_FORWARD_MAC(e)

const EXTEND_CHAR_FORWARD = isKeyHotkey('shift+right')
const EXTEND_CHAR_BACKWARD = isKeyHotkey('shift+left')

const EXTEND_LINE_BACKWARD_MAC = isKeyHotkey('option+shift+up')
const EXTEND_LINE_FORWARD_MAC = isKeyHotkey('option+shift+down')
const EXTEND_LINE_BACKWARD = e => IS_APPLE && EXTEND_LINE_BACKWARD_MAC(e)
const EXTEND_LINE_FORWARD = e => IS_APPLE && EXTEND_LINE_FORWARD_MAC(e)

const UNDO = isKeyHotkey('mod+z')
const REDO_MAC = isKeyHotkey('mod+shift+z')
const REDO_PC = isKeyHotkey('mod+y')
const REDO = e => IS_APPLE ? REDO_MAC(e) : REDO_PC(e)

const TRANSPOSE_CHARACTER_MAC = isKeyHotkey('ctrl+t')
const TRANSPOSE_CHARACTER = e => IS_APPLE && TRANSPOSE_CHARACTER_MAC(e)

const CONTENTEDITABLE = e => (
  BOLD(e) ||
  DELETE_CHAR_BACKWARD(e) ||
  DELETE_CHAR_FORWARD(e) ||
  DELETE_LINE_BACKWARD(e) ||
  DELETE_LINE_FORWARD(e) ||
  DELETE_WORD_BACKWARD(e) ||
  DELETE_WORD_FORWARD(e) ||
  ITALIC(e) ||
  REDO(e) ||
  SPLIT_BLOCK(e) ||
  TRANSPOSE_CHARACTER(e) ||
  UNDO(e)
)

const COMPOSING = e => (
  e.key == 'ArrowDown' ||
  e.key == 'ArrowLeft' ||
  e.key == 'ArrowRight' ||
  e.key == 'ArrowUp' ||
  e.key == 'Backspace' ||
  e.key == 'Enter'
)

/**
 * Export.
 *
 * @type {Object}
 */

export default {
  BOLD,
  COLLAPSE_LINE_BACKWARD,
  COLLAPSE_LINE_FORWARD,
  COLLAPSE_CHAR_FORWARD,
  COLLAPSE_CHAR_BACKWARD,
  COMPOSING,
  CONTENTEDITABLE,
  DELETE_CHAR_BACKWARD,
  DELETE_CHAR_FORWARD,
  DELETE_LINE_BACKWARD,
  DELETE_LINE_FORWARD,
  DELETE_WORD_BACKWARD,
  DELETE_WORD_FORWARD,
  EXTEND_LINE_BACKWARD,
  EXTEND_LINE_FORWARD,
  EXTEND_CHAR_FORWARD,
  EXTEND_CHAR_BACKWARD,
  ITALIC,
  REDO,
  SPLIT_BLOCK,
  UNDO,
}
