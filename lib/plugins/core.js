
import Character from '../models/character'
import Key from '../utils/key'
import Placeholder from '../components/placeholder'
import React from 'react'
import String from '../utils/string'
import keycode from 'keycode'
import { IS_WINDOWS, IS_MAC } from '../utils/environment'

/**
 * The default plugin.
 *
 * @param {Object} options
 *   @property {Element} placeholder
 *   @property {String} placeholderClassName
 *   @property {Object} placeholderStyle
 * @return {Object}
 */

function Plugin(options = {}) {
  const {
    placeholder,
    placeholderClassName,
    placeholderStyle
  } = options

  /**
   * The default block renderer.
   *
   * @param {Object} props
   * @return {Element}
   */

  function DEFAULT_BLOCK(props) {
    return (
      <div {...props.attributes} style={{ position: 'relative' }}>
        {props.children}
        {placeholder
          ? <Placeholder
              className={placeholderClassName}
              node={props.node}
              parent={props.state.document}
              state={props.state}
              style={placeholderStyle}
            >
              {placeholder}
            </Placeholder>
          : null}
      </div>
    )
  }

  /**
   * The default inline renderer.
   *
   * @param {Object} props
   * @return {Element}
   */

  function DEFAULT_INLINE(props) {
    return (
      <span {...props.attributes} style={{ position: 'relative' }}>
        {props.children}
      </span>
    )
  }

  /**
   * On before input, see if we can let the browser continue with it's native
   * input behavior, to avoid a re-render for performance.
   *
   * @param {Event} e
   * @param {State} state
   * @param {Editor} editor
   * @return {State}
   */

  function onBeforeInput(e, state, editor) {
    const { renderDecorations } = editor
    const { startOffset, startText, startBlock } = state

    // Determine what the characters would be if natively inserted.
    const prev = startText.getDecoratedCharacters(startBlock, renderDecorations)
    const char = prev.get(startOffset)
    const chars = prev
      .slice(0, startOffset)
      .push(Character.create({ text: e.data, marks: char && char.marks }))
      .concat(prev.slice(startOffset))

    // Determine what the characters should be, if not natively inserted.
    let next = state
      .transform()
      .insertText(e.data)
      .apply()

    const nextText = next.startText
    const nextBlock = next.startBlock
    const nextChars = nextText.getDecoratedCharacters(nextBlock, renderDecorations)

    // We do not have to re-render if the current selection is collapsed, the
    // current node is not empty, there are no marks on the cursor, and the
    // natively inserted characters would be the same as the non-native.
    const isNative = (
      state.isCollapsed &&
      state.startText.text != '' &&
      state.cursorMarks == null &&
      chars.equals(nextChars)
    )

    // Add the `isNative` flag directly, so we don't have to re-transform.
    if (isNative) {
      next = next.merge({ isNative })
    }

    // If not native, prevent default so that the DOM remains untouched.
    if (!isNative) e.preventDefault()

    // Return the new state.
    return next
  }

  /**
   * On blur.
   *
   * @param {Event} e
   * @param {Object} data
   * @param {State} state
   * @return {State}
   */

  function onBlur(e, data, state) {
    return state
      .transform()
      .blur()
      .apply({ isNative: true })
  }

  /**
   * On drop.
   *
   * @param {Event} e
   * @param {Object} data
   * @param {State} state
   * @return {State}
   */

  function onDrop(e, data, state) {
    switch (data.type) {
      case 'text':
      case 'html':
        return onDropText(e, data, state)
      case 'fragment':
        return onDropFragment(e, data, state)
    }
  }

  /**
   * On drop fragment.
   *
   * @param {Event} e
   * @param {Object} data
   * @param {State} state
   * @return {State}
   */

  function onDropFragment(e, data, state) {
    const { selection } = state
    let { fragment, target, isInternal } = data

    // If the drag is internal and the target is after the selection, it
    // needs to account for the selection's content being deleted.
    if (
      isInternal &&
      selection.endKey == target.endKey &&
      selection.endOffset < target.endOffset
    ) {
      target = target.moveBackward(selection.startKey == selection.endKey
        ? selection.endOffset - selection.startOffset
        : selection.endOffset)
    }

    let transform = state.transform()

    if (isInternal) transform = transform.delete()

    return transform
      .moveTo(target)
      .insertFragment(fragment)
      .apply()
  }

  /**
   * On drop text, split the blocks at new lines.
   *
   * @param {Event} e
   * @param {Object} data
   * @param {State} state
   * @return {State}
   */

  function onDropText(e, data, state) {
    const { text, target } = data
    let transform = state
      .transform()
      .moveTo(target)

    text
      .split('\n')
      .forEach((line, i) => {
        if (i > 0) transform = transform.splitBlock()
        transform = transform.insertText(line)
      })

    return transform.apply()
  }

  /**
   * On key down.
   *
   * @param {Event} e
   * @param {State} state
   * @return {State}
   */

  function onKeyDown(e, state) {
    switch (keycode(e.which)) {
      case 'enter': return onKeyDownEnter(e, state)
      case 'backspace': return onKeyDownBackspace(e, state)
      case 'delete': return onKeyDownDelete(e, state)
      case 'y': return onKeyDownY(e, state)
      case 'z': return onKeyDownZ(e, state)
    }
  }

  /**
   * On `enter` key down, split the current block in half.
   *
   * @param {Event} e
   * @param {State} state
   * @return {State}
   */

  function onKeyDownEnter(e, state) {
    const { document, startKey, startBlock } = state

    // For void blocks, we don't want to split. Instead we just move to the
    // start of the next text node if one exists.
    if (startBlock && startBlock.isVoid) {
      const text = document.getNextText(startKey)
      if (!text) return
      return state
        .transform()
        .collapseToStartOf(text)
        .apply()
    }

    return state
      .transform()
      .splitBlock()
      .apply()
  }

  /**
   * On `backspace` key down, delete backwards.
   *
   * @param {Event} e
   * @param {State} state
   * @return {State}
   */

  function onKeyDownBackspace(e, state) {
    // If expanded, delete regularly.
    if (state.isExpanded) {
      return state
        .transform()
        .delete()
        .apply()
    }

    const { startOffset, startBlock } = state
    const text = startBlock.text
    let n

    // Determine how far backwards to delete.
    if (Key.isWord(e)) {
      n = String.getWordOffsetBackward(text, startOffset)
    } else if (Key.isLine(e)) {
      n = startOffset
    } else {
      n = String.getCharOffsetBackward(text, startOffset)
    }

    return state
      .transform()
      .deleteBackward(n)
      .apply()
  }

  /**
   * On `delete` key down, delete forwards.
   *
   * @param {Event} e
   * @param {State} state
   * @return {State}
   */

  function onKeyDownDelete(e, state) {
    // If expanded, delete regularly.
    if (state.isExpanded) {
      return state
        .transform()
        .delete()
        .apply()
    }

    const { startOffset, startBlock } = state
    const text = startBlock.text
    let n

    // Determine how far forwards to delete.
    if (Key.isWord(e)) {
      n = String.getWordOffsetForward(text, startOffset)
    } else if (Key.isLine(e)) {
      n = text.length - startOffset
    } else {
      n = String.getCharOffsetForward(text, startOffset)
    }

    return state
      .transform()
      .deleteForward(n)
      .apply()
  }

  /**
   * On `y` key down, redo.
   *
   * @param {Event} e
   * @param {State} state
   * @return {State}
   */

  function onKeyDownY(e, state) {
    if (!Key.isWindowsCommand(e)) return
    return state
      .transform()
      .redo()
  }

  /**
   * On `z` key down, undo or redo.
   *
   * @param {Event} e
   * @param {State} state
   * @return {State}
   */

  function onKeyDownZ(e, state) {
    if (!Key.isCommand(e)) return
    return state
      .transform()
      [IS_MAC && Key.isShift(e) ? 'redo' : 'undo']()
  }

  /**
   * On paste.
   *
   * @param {Event} e
   * @param {Object} data
   * @param {State} state
   * @return {State}
   */

  function onPaste(e, data, state) {
    switch (data.type) {
      case 'text':
      case 'html':
        return onPasteText(e, data, state)
    }
  }

  /**
   * On paste text, split blocks at new lines.
   *
   * @param {Event} e
   * @param {Object} data
   * @param {State} state
   * @return {State}
   */

  function onPasteText(e, data, state) {
    let transform = state.transform()

    data.text
      .split('\n')
      .forEach((line, i) => {
        if (i > 0) transform = transform.splitBlock()
        transform = transform.insertText(line)
      })

    return transform.apply()
  }

  /**
   * On select.
   *
   * @param {Event} e
   * @param {Object} data
   * @param {State} state
   * @return {State}
   */

  function onSelect(e, data, state) {
    const { selection, isNative } = data
    return state
      .transform()
      .moveTo(selection)
      .focus()
      .apply({ isNative })
  }

  /**
   * The core `node` renderer, which uses plain `<div>` or `<span>` depending on
   * what kind of node it is.
   *
   * @param {Node} node
   * @return {Component} component
   */

  function renderNode(node) {
    return node.kind == 'block'
      ? DEFAULT_BLOCK
      : DEFAULT_INLINE
  }

  /**
   * Return the core plugin.
   */

  return {
    onBeforeInput,
    onDrop,
    onKeyDown,
    onPaste,
    onSelect,
    renderNode
  }
}

/**
 * Export.
 */

export default Plugin
