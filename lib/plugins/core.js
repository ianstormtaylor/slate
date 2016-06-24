
import React from 'react'
import keycode from 'keycode'
import { IS_WINDOWS, IS_MAC } from '../utils/environment'

/**
 * Export.
 */

export default {

  /**
   * The core `onBeforeInput` handler.
   *
   * @param {Event} e
   * @param {State} state
   * @param {Editor} editor
   * @return {State or Null} newState
   */

  onBeforeInput(e, state, editor) {
    const { data }  = e

    // When does this happen...
    if (!data) {
      debugger
      return
    }

    // If the selection is still expanded, delete anything inside it first.
    if (state.isExpanded) {
      e.preventDefault()
      return state
        .transform()
        .delete()
        .insertText(data)
        .apply()
    }

    // Otherwise, insert text natively, without re-rendering.
    return state
      .transform()
      .insertText(data)
      .apply({ isNative: true })
  },

  /**
   * The core `onKeyDown` handler.
   *
   * @param {Event} e
   * @param {State} state
   * @param {Editor} editor
   * @return {State or Null} newState
   */

  onKeyDown(e, state, editor) {
    const key = keycode(e.which)

    switch (key) {
      case 'enter': {
        e.preventDefault()
        return state
          .transform()
          .splitBlock()
          .apply()
      }

      case 'backspace': {
        // COMPAT: Windows has a special "cut" behavior for the shift key.
        if (IS_WINDOWS && e.shiftKey) return
        e.preventDefault()
        return isWord(e)
          ? state
              .transform()
              .backspaceWord()
              .apply()
          : state
              .transform()
              .deleteBackward()
              .apply()
      }

      case 'delete': {
        // COMPAT: Windows has a special "cut" behavior for the shift key.
        if (IS_WINDOWS && e.shiftKey) return
        e.preventDefault()
        return isWord(e)
          ? state
              .transform()
              .deleteWord()
              .apply()
          : state
              .transform()
              .deleteForward()
              .apply()
      }

      case 'b':
      case 'i': {
        if (!isCommand(e)) return
        // COMPAT: Prevent the built-in contenteditable bold and italic
        // shortcuts. They should be re-added at a higher level that is
        // state-aware if you want to allow for them.
        e.preventDefault()
        return
      }

      case 'y': {
        if (!isCtrl(e) || !IS_WINDOWS) return
        e.preventDefault()
        return state
          .transform()
          .redo()
      }

      case 'z': {
        if (!isCommand(e)) return
        e.preventDefault()
        return IS_MAC && e.shiftKey
          ? state
              .transform()
              .redo()
          : state
              .transform()
              .undo()
      }
    }
  },

  /**
   * The core `onPaste` handler.
   *
   * @param {Event} e
   * @param {Object} paste
   * @param {State} state
   * @param {Editor} editor
   * @return {State or Null} newState
   */

  onPaste(e, paste, state, editor) {
    // Don't handle files in core.
    if (paste.type == 'files') return

    // If the paste type is html...
    if (paste.type == 'html') {
      // First, check for a match in the clipboard.
      // Otherwise, check if we have a paste deserializer.
    }

    // Otherwise, just insert the plain text splitting at characters.
    let transform = state.transform()

    paste.text
      .split('\n')
      .forEach((block, i) => {
        if (i > 0) transform = transform.splitBlock()
        transform = transform.insertText(block)
      })

    return transform.apply()
  },

  /**
   * Default `node` renderer.
   *
   * @param {Node} node
   * @return {Component} component
   */

  renderNode(node) {
    return (props) => <div>{props.children}</div>
  },

  /**
   * Default `mark` renderer.
   *
   * @param {Mark} mark
   * @return {Object} style
   */

  renderMark(mark) {
    return {}
  }

}

/**
 * Does an `e` have the word-level modifier?
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
 * Does an `e` have the control modifier?
 *
 * @param {Event} e
 * @return {Boolean}
 */

function isCtrl(e) {
  return e.ctrlKey && !e.altKey
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
