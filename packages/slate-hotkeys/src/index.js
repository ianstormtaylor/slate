import { isKeyHotkey } from 'is-hotkey'
import { IS_IOS, IS_MAC } from '@gitbook/slate-dev-environment'

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

const isBold = isKeyHotkey('mod+b')
const isItalic = isKeyHotkey('mod+i')

const isEnter = isKeyHotkey('enter')
const isShiftEnter = isKeyHotkey('shift+enter')
const isSplitBlock = e => isEnter(e) || isShiftEnter(e)

const isBackspace = isKeyHotkey('backspace')
const isShiftBackspace = isKeyHotkey('shift+backspace')
const isDelete = isKeyHotkey('delete')
const isShiftDelete = isKeyHotkey('shift+delete')
const isDeleteBackward = e => isBackspace(e) || isShiftBackspace(e)
const isDeleteForward = e => isDelete(e) || isShiftDelete(e)

const isDeleteCharBackwardMac = isKeyHotkey('ctrl+h')
const isDeleteCharForwardMac = isKeyHotkey('ctrl+d')
const isDeleteCharBackward = e =>
  isDeleteBackward(e) || (IS_APPLE && isDeleteCharBackwardMac(e))
const isDeleteCharForward = e =>
  isDeleteForward(e) || (IS_APPLE && isDeleteCharForwardMac(e))

const isDeleteLineBackwardMac = e =>
  isKeyHotkey('cmd+shift+backspace', e) || isKeyHotkey('cmd+backspace', e)
const isDeleteLineForwardMac = isKeyHotkey('ctrl+k')
const isDeleteLineBackward = e => IS_APPLE && isDeleteLineBackwardMac(e)
const isDeleteLineForward = e => IS_APPLE && isDeleteLineForwardMac(e)

const isDeleteWordBackwardMac = e =>
  isKeyHotkey('shift+option+backspace', e) || isKeyHotkey('option+backspace', e)
const isDeleteWordBackwardPC = isKeyHotkey('ctrl+backspace')
const isDeleteWordForwardMac = e =>
  isKeyHotkey('shift+option+delete', e) || isKeyHotkey('option+delete', e)
const isDeleteWordForwardPC = isKeyHotkey('ctrl+delete')
const isDeleteWordBackward = e =>
  IS_APPLE ? isDeleteWordBackwardMac(e) : isDeleteWordBackwardPC(e)
const isDeleteWordForward = e =>
  IS_APPLE ? isDeleteWordForwardMac(e) : isDeleteWordForwardPC(e)

const isExtendCharForward = isKeyHotkey('shift+right')
const isExtendCharBackward = isKeyHotkey('shift+left')

const isRightArrow = isKeyHotkey('right')
const isLeftArrow = isKeyHotkey('left')
const isCollapseCharForward = e => isRightArrow(e) && !isExtendCharForward(e)
const isCollapseCharBackward = e => isLeftArrow(e) && !isExtendCharBackward(e)

const isCollapseLineBackwardMac = isKeyHotkey('option+up')
const isCollapseLineForwardMac = isKeyHotkey('option+down')
const isCollapseLineBackward = e => IS_APPLE && isCollapseLineBackwardMac(e)
const isCollapseLineForward = e => IS_APPLE && isCollapseLineForwardMac(e)

const isExtendLineBackwardMac = isKeyHotkey('option+shift+up')
const isExtendLineForwardMac = isKeyHotkey('option+shift+down')
const isExtendLineBackward = e => IS_APPLE && isExtendLineBackwardMac(e)
const isExtendLineForward = e => IS_APPLE && isExtendLineForwardMac(e)

const isUndo = isKeyHotkey('mod+z')
const isRedoMac = isKeyHotkey('mod+shift+z')
const isRedoPC = isKeyHotkey('mod+y')
const isRedo = e => (IS_APPLE ? isRedoMac(e) : isRedoPC(e))

const isTransposeCharacterMac = isKeyHotkey('ctrl+t')
const isTransposeCharacter = e => IS_APPLE && isTransposeCharacterMac(e)

const isContentEditable = e =>
  isBold(e) ||
  isDeleteCharBackward(e) ||
  isDeleteCharForward(e) ||
  isDeleteLineBackward(e) ||
  isDeleteLineForward(e) ||
  isDeleteWordBackward(e) ||
  isDeleteWordForward(e) ||
  isItalic(e) ||
  isRedo(e) ||
  isSplitBlock(e) ||
  isTransposeCharacter(e) ||
  isUndo(e)

const isComposing = e =>
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
  isBold,
  isCollapseCharBackward,
  isCollapseCharForward,
  isCollapseLineBackward,
  isCollapseLineForward,
  isComposing,
  isContentEditable,
  isDeleteCharBackward,
  isDeleteCharForward,
  isDeleteLineBackward,
  isDeleteLineForward,
  isDeleteWordBackward,
  isDeleteWordForward,
  isExtendCharBackward,
  isExtendCharForward,
  isExtendLineBackward,
  isExtendLineForward,
  isItalic,
  isRedo,
  isSplitBlock,
  isUndo,
}
