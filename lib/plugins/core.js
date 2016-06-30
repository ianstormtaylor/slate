
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
   * If the current selection is collapsed, we can insert the text natively and
   * avoid a re-render, improving performance.
   *
   * @param {Event} e
   * @param {State} state
   * @param {Editor} editor
   * @return {State or Null} newState
   */

  onBeforeInput(e, state, editor) {
    const isNative = state.isCollapsed

    if (!isNative) e.preventDefault()

    return state
      .transform()
      .insertText(e.data)
      .apply({ isNative })
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
    const transform = state.transform()

    switch (key) {
      case 'enter': {
        return transform.splitBlock().apply()
      }

      case 'backspace': {
        return isWord(e)
          ? transform.backspaceWord().apply()
          : transform.deleteBackward().apply()
      }

      case 'delete': {
        return isWord(e)
          ? transform.deleteWord().apply()
          : transform.deleteForward().apply()
      }

      case 'up': {
        if (state.isExpanded) return
        const first = state.blocks.first()
        if (!first || !first.isVoid) return
        e.preventDefault()
        return transform.moveToEndOfPreviousBlock().apply()
      }

      case 'down': {
        if (state.isExpanded) return
        const first = state.blocks.first()
        if (!first || !first.isVoid) return
        e.preventDefault()
        return transform.moveToStartOfNextBlock().apply()
      }

      case 'left': {
        if (state.isExpanded) return
        const node = state.blocks.first() || state.inlines.first()
        if (!node || !node.isVoid) return
        e.preventDefault()
        return transform.moveToEndOfPreviousText().apply()
      }

      case 'right': {
        if (state.isExpanded) return
        const node = state.blocks.first() || state.inlines.first()
        if (!node || !node.isVoid) return
        e.preventDefault()
        return transform.moveToStartOfNextText().apply()
      }

      case 'y': {
        if (!isWindowsCommand(e)) return
        return transform.redo()
      }

      case 'z': {
        if (!isCommand(e)) return
        return IS_MAC && e.shiftKey
          ? transform.redo()
          : transform.undo()
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
    return node.kind == 'block'
      ? (props) => <div>{props.children}</div>
      : (props) => <span>{props.children}</span>
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

