
import keycode from 'keycode'
import { IS_WINDOWS, IS_MAC } from '../utils/environment'

/**
 * The core plugin.
 */

const CORE_PLUGIN = {

  /**
   * The core `onKeyDown` handler.
   *
   * @param {Event} e
   * @param {Editor} editor
   * @return {State or Null} newState
   */

  onKeyDown(e, editor) {
    const state = editor.getState()
    const key = keycode(e.which)

    switch (key) {
      case 'enter': {
        return state.split()
      }

      case 'backspace': {
        // COMPAT: Windows has a special "cut" behavior for the shift key.
        if (IS_WINDOWS && e.shiftKey) return
        return isWord(e)
          ? state.backspaceWord()
          : state.backspace()
      }

      case 'delete': {
        // COMPAT: Windows has a special "cut" behavior for the shift key.
        if (IS_WINDOWS && e.shiftKey) return
        return isWord(e)
          ? state.deleteWord()
          : state.delete()
      }

      case 'y': {
        if (!isCtrl(e) || !IS_WINDOWS) return
        return state.redo()
      }

      case 'z': {
        if (!isCommand(e)) return
        return IS_MAC && e.shiftKey
          ? state.redo()
          : state.undo()
      }

      default: {
        console.log('Unhandled key down.')
      }
    }
  }

}

/**
 * Does an `e` have the the word-level modifier?
 *
 * @param {Event} e
 * @return {Boolean}
 */

function isWord(e) {
  if (IS_MAC && e.altKey) return true
  if (e.ctrlKey) return true
  return false
}

/**
 * Does an `e` have the the control modifier?
 *
 * @param {Event} e
 * @return {Boolean}
 */

function isCtrl(e) {
  return e.ctrlKey && !e.altKey
}

/**
 * Does an `e` have the the option modifier?
 *
 * @param {Event} e
 * @return {Boolean}
 */

function isOption(e) {
  return IS_MAC && e.altKey
}

/**
 * Does an `e` have the shift modifier?
 *
 * @param {Event} e
 * @return {Boolean}
 */

function isShift(e) {
  return e.shiftKey
}

/**
 * Does an `e` have the the command modifier?
 *
 * @param {Event} e
 * @return {Boolean}
 */

function isCommand(e) {
  return IS_MAC
    ? e.metaKey && !e.altKey
    : e.ctrlKey && !e.altKey
}

/**
 * Export.
 */

export default CORE_PLUGIN
