
import isHotkey from 'is-hotkey'

import { IS_MAC } from './environment'

/**
 * We need to use `byKey` for system-level shortcuts because they will change
 * based on the keyboard layout (eg. DVORAK).
 *
 * @type {Function}
 */

const byKey = hotkey => isHotkey(hotkey, { byKey: true })

/**
 * Hotkeys.
 *
 * @type {Function}
 */

const BOLD = byKey('mod+b')
const ITALIC = byKey('mod+i')

const ENTER = byKey('enter')
const SHIFT_ENTER = byKey('shift+enter')
const SPLIT_BLOCK = e => ENTER(e) || SHIFT_ENTER(e)

const BACKSPACE = byKey('backspace')
const SHIFT_BACKSPACE = byKey('shift+backspace')
const DELETE = byKey('delete')
const SHIFT_DELETE = byKey('shift+delete')
const DELETE_BACKWARD = e => BACKSPACE(e) || SHIFT_BACKSPACE(e)
const DELETE_FORWARD = e => DELETE(e) || SHIFT_DELETE(e)

const DELETE_CHAR_BACKWARD_MAC = byKey('ctrl+h')
const DELETE_CHAR_FORWARD_MAC = byKey('ctrl+d')
const DELETE_CHAR_BACKWARD = e => DELETE_BACKWARD(e) || (IS_MAC && DELETE_CHAR_BACKWARD_MAC(e))
const DELETE_CHAR_FORWARD = e => DELETE_FORWARD(e) || (IS_MAC && DELETE_CHAR_FORWARD_MAC(e))

const DELETE_LINE_BACKWARD_MAC = byKey('cmd+backspace')
const DELETE_LINE_FORWARD_MAC = byKey('ctrl+k')
const DELETE_LINE_BACKWARD = e => IS_MAC && DELETE_LINE_BACKWARD_MAC(e)
const DELETE_LINE_FORWARD = e => IS_MAC && DELETE_LINE_FORWARD_MAC(e)

const DELETE_WORD_BACKWARD_MAC = byKey('option+backspace')
const DELETE_WORD_BACKWARD_PC = byKey('ctrl+backspace')
const DELETE_WORD_FORWARD_MAC = byKey('option+delete')
const DELETE_WORD_FORWARD_PC = byKey('ctrl+delete')
const DELETE_WORD_BACKWARD = e => IS_MAC ? DELETE_WORD_BACKWARD_MAC(e) : DELETE_WORD_BACKWARD_PC(e)
const DELETE_WORD_FORWARD = e => IS_MAC ? DELETE_WORD_FORWARD_MAC(e) : DELETE_WORD_FORWARD_PC(e)

const COLLAPSE_CHAR_FORWARD = byKey('right')
const COLLAPSE_CHAR_BACKWARD = byKey('left')

const COLLAPSE_LINE_BACKWARD_MAC = byKey('option+up')
const COLLAPSE_LINE_FORWARD_MAC = byKey('option+down')
const COLLAPSE_LINE_BACKWARD = e => IS_MAC && COLLAPSE_LINE_BACKWARD_MAC(e)
const COLLAPSE_LINE_FORWARD = e => IS_MAC && COLLAPSE_LINE_FORWARD_MAC(e)

const EXTEND_CHAR_FORWARD = byKey('shift+right')
const EXTEND_CHAR_BACKWARD = byKey('shift+left')

const EXTEND_LINE_BACKWARD_MAC = byKey('option+shift+up')
const EXTEND_LINE_FORWARD_MAC = byKey('option+shift+down')
const EXTEND_LINE_BACKWARD = e => IS_MAC && EXTEND_LINE_BACKWARD_MAC(e)
const EXTEND_LINE_FORWARD = e => IS_MAC && EXTEND_LINE_FORWARD_MAC(e)

const UNDO = byKey('mod+z')
const REDO_MAC = byKey('mod+shift+z')
const REDO_PC = byKey('mod+y')
const REDO = e => IS_MAC ? REDO_MAC(e) : REDO_PC(e)

const TRANSPOSE_CHARACTER_MAC = byKey('ctrl+t')
const TRANSPOSE_CHARACTER = e => IS_MAC && TRANSPOSE_CHARACTER_MAC(e)

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
  e.key == 'ArrowUp'
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
