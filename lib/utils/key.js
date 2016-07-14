
import { IS_MAC, IS_WINDOWS } from './environment'

/**
 * Does an `e` have the alt modifier?
 *
 * @param {Event} e
 * @return {Boolean}
 */

function isAlt(e) {
  return e.altKey
}

/**
 * Does an `e` have the command modifier?
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
 * Does an `e` have the control modifier?
 *
 * @param {Event} e
 * @return {Boolean}
 */

function isCtrl(e) {
  return e.ctrlKey && !e.altKey
}

/**
 * Does an `e` have the line-level modifier?
 *
 * @param {Event} e
 * @return {Boolean}
 */

function isLine(e) {
  return IS_MAC
    ? e.metaKey
    : false
}

/**
 * Does an `e` have the Mac command modifier?
 *
 * @param {Event} e
 * @return {Boolean}
 */

function isMacCommand(e) {
  return IS_MAC && isCommand(e)
}

/**
 * Does an `e` have the option modifier?
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
 * Does an `e` have the Windows command modifier?
 *
 * @param {Event} e
 * @return {Boolean}
 */

function isWindowsCommand(e) {
  return IS_WINDOWS && isCommand(e)
}

/**
 * Does an `e` have the word-level modifier?
 *
 * @param {Event} e
 * @return {Boolean}
 */

function isWord(e) {
  return IS_MAC
    ? e.altKey
    : e.ctrlKey
}

/**
 * Export.
 */

export default {
  isAlt,
  isCommand,
  isCtrl,
  isLine,
  isMacCommand,
  isOption,
  isShift,
  isWindowsCommand,
  isWord
}
