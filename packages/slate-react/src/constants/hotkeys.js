
import isHotkey from 'is-hotkey'

import { IS_MAC } from './environment'

/**
 * Hotkeys.
 *
 * @type {Function}
 */

const BOLD = isHotkey('mod+b')
const ITALIC = isHotkey('mod+i')

const UNDO = isHotkey('mod+z')
const REDO_MAC = isHotkey('mod+shift+z')
const REDO_OTHER = isHotkey('mod+y')
const REDO = e => IS_MAC ? REDO_MAC(e) : REDO_OTHER(e)

const DELETE_CHAR_BACKWARD_MAC = isHotkey('ctrl+h')
const DELETE_CHAR_FORWARD_MAC = isHotkey('ctrl+d')
const DELETE_LINE_FORWARD_MAC = isHotkey('ctrl+k')
const DELETE_CHAR_BACKWARD = e => IS_MAC ? DELETE_CHAR_BACKWARD_MAC(e) : false
const DELETE_CHAR_FORWARD = e => IS_MAC ? DELETE_CHAR_FORWARD_MAC(e) : false
const DELETE_LINE_FORWARD = e => IS_MAC ? DELETE_LINE_FORWARD_MAC(e) : false

const CONTENTEDITABLE = e => (
  e.key == 'Backspace' ||
  e.key == 'Delete' ||
  e.key == 'Enter' ||
  e.key == 'Insert' ||
  BOLD(e) ||
  DELETE_CHAR_BACKWARD(e) ||
  DELETE_CHAR_FORWARD(e) ||
  DELETE_LINE_FORWARD(e) ||
  ITALIC(e) ||
  REDO(e) ||
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
  COMPOSING,
  CONTENTEDITABLE,
  DELETE_CHAR_BACKWARD,
  DELETE_CHAR_FORWARD,
  DELETE_LINE_FORWARD,
  ITALIC,
  REDO,
  UNDO,
}
