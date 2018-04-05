import { isKeyHotkey } from 'is-hotkey'
import { IS_IOS, IS_MAC } from 'slate-dev-environment'

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

const bold = isKeyHotkey('mod+b')
const italic = isKeyHotkey('mod+i')

const enter = isKeyHotkey('enter')
const shiftEnter = isKeyHotkey('shift+enter')
const splitBlock = e => enter(e) || shiftEnter(e)

const backspace = isKeyHotkey('backspace')
const shiftBackspace = isKeyHotkey('shift+backspace')
const del = isKeyHotkey('delete')
const shiftDel = isKeyHotkey('shift+delete')
const deleteBackward = e => backspace(e) || shiftBackspace(e)
const deleteForward = e => del(e) || shiftDel(e)

const deleteCharBackwardMac = isKeyHotkey('ctrl+h')
const deleteCharForwardMac = isKeyHotkey('ctrl+d')
const deleteCharBackward = e =>
  deleteBackward(e) || (IS_APPLE && deleteCharBackwardMac(e))
const deleteCharForward = e =>
  deleteForward(e) || (IS_APPLE && deleteCharForwardMac(e))

const deleteLineBackwardMac = e =>
  isKeyHotkey('cmd+shift+backspace', e) || isKeyHotkey('cmd+backspace', e)
const deleteLineForwardMac = isKeyHotkey('ctrl+k')
const deleteLineBackward = e => IS_APPLE && deleteLineBackwardMac(e)
const deleteLineForward = e => IS_APPLE && deleteLineForwardMac(e)

const deleteWordBackwardMac = e =>
  isKeyHotkey('shift+option+backspace', e) || isKeyHotkey('option+backspace', e)
const deleteWordBackwardPC = isKeyHotkey('ctrl+backspace')
const deleteWordForwardMac = e =>
  isKeyHotkey('shift+option+delete', e) || isKeyHotkey('option+delete', e)
const deleteWordForwardPC = isKeyHotkey('ctrl+delete')
const deleteWordBackward = e =>
  IS_APPLE ? deleteWordBackwardMac(e) : deleteWordBackwardPC(e)
const deleteWordForward = e =>
  IS_APPLE ? deleteWordForwardMac(e) : deleteWordForwardPC(e)

const extendCharForward = isKeyHotkey('shift+right')
const extendCharBackward = isKeyHotkey('shift+left')

const rightArrow = isKeyHotkey('right')
const leftArrow = isKeyHotkey('left')
const collapseCharForward = e => rightArrow(e) && !extendCharForward(e)
const collapseCharBackward = e => leftArrow(e) && !extendCharBackward(e)

const collapseLineBackwardMac = isKeyHotkey('option+up')
const collapseLineForwardMac = isKeyHotkey('option+down')
const collapseLineBackward = e => IS_APPLE && collapseLineBackwardMac(e)
const collapseLineForward = e => IS_APPLE && collapseLineForwardMac(e)

const extendLineBackwardMac = isKeyHotkey('option+shift+up')
const extendLineForwardMac = isKeyHotkey('option+shift+down')
const extendLineBackward = e => IS_APPLE && extendLineBackwardMac(e)
const extendLineForward = e => IS_APPLE && extendLineForwardMac(e)

const undo = isKeyHotkey('mod+z')
const redoMac = isKeyHotkey('mod+shift+z')
const redoPC = isKeyHotkey('mod+y')
const redo = e => (IS_APPLE ? redoMac(e) : redoPC(e))

const transposeCharacterMac = isKeyHotkey('ctrl+t')
const transposeCharacter = e => IS_APPLE && transposeCharacterMac(e)

const contenteditable = e =>
  bold(e) ||
  deleteCharBackward(e) ||
  deleteCharForward(e) ||
  deleteLineBackward(e) ||
  deleteLineForward(e) ||
  deleteWordBackward(e) ||
  deleteWordForward(e) ||
  italic(e) ||
  redo(e) ||
  splitBlock(e) ||
  transposeCharacter(e) ||
  undo(e)

const composing = e =>
  e.key == 'ArrowDown' ||
  e.key == 'ArrowLeft' ||
  e.key == 'ArrowRight' ||
  e.key == 'ArrowUp' ||
  e.key == 'Backspace' ||
  e.key == 'Enter'

/**
 * Export.
 *
 * @type {Object}
 */

export default {
  bold,
  collapseCharBackward,
  collapseCharForward,
  collapseLineBackward,
  collapseLineForward,
  composing,
  contenteditable,
  deleteCharBackward,
  deleteCharForward,
  deleteLineBackward,
  deleteLineForward,
  deleteWordBackward,
  deleteWordForward,
  extendCharBackward,
  extendCharForward,
  extendLineBackward,
  extendLineForward,
  italic,
  redo,
  splitBlock,
  undo,
}
