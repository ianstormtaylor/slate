
import React from 'react'
import keycode from 'keycode'
import { isCommand, isCtrl, isWindowsCommand, isWord } from '../utils/event'
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
   * The core `onCopy` handler.
   *
   * @param {Event} e
   * @param {State} state
   * @param {Editor} editor
   * @return {State or Null}
   */

  onCopy(e, state, editor) {
    editor.fragment = state.fragment
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
        return state
          .transform()
          .splitBlock()
          .apply()
      }

      case 'backspace': {
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

      case 'y': {
        if (!isWindowsCommand(e)) return
        return state
          .transform()
          .redo()
      }

      case 'z': {
        if (!isCommand(e)) return
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
    if (paste.type == 'files') return

    // If pasting html and the text matches the current fragment, use that.
    if (paste.type == 'html') {
      const { fragment } = editor
      const text = fragment
        .getBlocks()
        .map(block => block.text)
        .join('\n')

      if (paste.text == text) {
        return state
          .transform()
          .insertFragment(fragment)
          .apply()
      }
    }

    // Otherwise, just insert the plain text splitting at new lines.
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

