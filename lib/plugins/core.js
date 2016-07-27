
import Character from '../models/character'
import Key from '../utils/key'
import Placeholder from '../components/placeholder'
import React from 'react'
import String from '../utils/string'
import keycode from 'keycode'
import { IS_WINDOWS, IS_MAC } from '../utils/environment'
import OffsetKey from '../utils/offset-key'

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
   * Define a default block renderer.
   *
   * @type {Component}
   */

  class DEFAULT_BLOCK extends React.Component {
    render = () => {
      const { attributes, children } = this.props
      return (
        <div {...attributes} style={{ position: 'relative' }}>
          {this.renderPlaceholder()}
          {children}
        </div>
      )
    }

    renderPlaceholder = () => {
      if (!placeholder) return null
      const { node, state } = this.props
      return (
        <Placeholder
          className={placeholderClassName}
          node={node}
          parent={state.document}
          state={state}
          style={placeholderStyle}
        >
          {placeholder}
        </Placeholder>
      )
    }
  }

  /**
   * Define a default inline renderer.
   *
   * @type {Component}
   */

  class DEFAULT_INLINE extends React.Component {
    render = () => {
      const { attributes, children } = this.props
      return <span {...attributes} style={{ position: 'relative' }}>{children}</span>
    }
  }

  /**
   * Return the plugin.
   */

  return {

    /**
     * The core `onBeforeInput` handler.
     *
     * @param {Event} e
     * @param {State} state
     * @param {Editor} editor
     * @return {State or Null}
     */

    onBeforeInput(e, state, editor) {
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
    },

    /**
     * The core `onDrop` handler.
     *
     * @param {Event} e
     * @param {Object} drop
     * @param {State} state
     * @param {Editor} editor
     * @return {State or Null}
     */

    onDrop(e, drop, state, editor) {
      switch (drop.type) {
        case 'fragment': {
          const { selection } = state
          let { fragment, target, isInternal } = drop

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

        case 'text':
        case 'html': {
          const { text, target } = drop
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
      }
    },

    /**
     * The core `onKeyDown` handler.
     *
     * @param {Event} e
     * @param {State} state
     * @param {Editor} editor
     * @return {State or Null}
     */

    onKeyDown(e, state, editor) {
      const key = keycode(e.which)
      let transform = state.transform()

      switch (key) {
        case 'enter': {
          const { startBlock } = state
          if (startBlock && !startBlock.isVoid) return transform.splitBlock().apply()

          const { document, startKey } = state
          const text = document.getNextText(startKey)
          if (!text) return

          return transform.collapseToStartOf(text).apply()
        }

        case 'backspace': {
          if (state.isExpanded) return transform.delete().apply()
          const { startOffset, startBlock } = state
          const text = startBlock.text
          let n

          if (Key.isWord(e)) {
            n = String.getWordOffsetBackward(text, startOffset)
          } else if (Key.isLine(e)) {
            n = startOffset
          } else {
            n = String.getCharOffsetBackward(text, startOffset)
          }

          return transform.deleteBackward(n).apply()
        }

        case 'delete': {
          if (state.isExpanded) return transform.delete().apply()
          const { startOffset, startBlock } = state
          const text = startBlock.text
          let n

          if (Key.isWord(e)) {
            n = String.getWordOffsetForward(text, startOffset)
          } else if (Key.isLine(e)) {
            n = text.length - startOffset
          } else {
            n = String.getCharOffsetForward(text, startOffset)
          }

          return transform.deleteForward(n).apply()
        }

        case 'up': {
          if (state.isExpanded) return
          const first = state.blocks.first()
          if (!first || !first.isVoid) return
          e.preventDefault()
          return transform.collapseToEndOfPreviousBlock().apply()
        }

        case 'down': {
          if (state.isExpanded) return
          const first = state.blocks.first()
          if (!first || !first.isVoid) return
          e.preventDefault()
          return transform.collapseToStartOfNextBlock().apply()
        }

        case 'left': {
          if (state.isExpanded) return
          const node = state.blocks.first() || state.inlines.first()
          if (!node || !node.isVoid) return
          e.preventDefault()
          return transform.collapseToEndOfPreviousText().apply()
        }

        case 'right': {
          if (state.isExpanded) return
          const node = state.blocks.first() || state.inlines.first()
          if (!node || !node.isVoid) return
          e.preventDefault()
          return transform.collapseToStartOfNextText().apply()
        }

        case 'y': {
          if (!Key.isWindowsCommand(e)) return
          return transform.redo()
        }

        case 'z': {
          if (!Key.isCommand(e)) return
          return IS_MAC && Key.isShift(e)
            ? transform.redo()
            : transform.undo()
        }
      }
    },

    /**
     * The core `onPaste` handler, which treats everything as plain text.
     *
     * @param {Event} e
     * @param {Object} paste
     * @param {State} state
     * @param {Editor} editor
     * @return {State or Null}
     */

    onPaste(e, paste, state, editor) {
      switch (paste.type) {
        case 'text':
        case 'html': {
          let transform = state.transform()

          paste.text
            .split('\n')
            .forEach((line, i) => {
              if (i > 0) transform = transform.splitBlock()
              transform = transform.insertText(line)
            })

          return transform.apply()
        }
      }
    },

    /**
     * The core `onSelect` handler.
     *
     * @param {Event} e
     * @param {Object} select
     * @param {State} state
     * @param {Editor} editor
     * @return {State or Null}
     */

    onSelect(e, select, state, editor) {
      const { selection, isNative } = select
      return state
        .transform()
        .moveTo(selection)
        .focus()
        .apply({ isNative })
    },

    /**
     * The core `node` renderer, which uses plain `<div>` or `<span>` depending on
     * what kind of node it is.
     *
     * @param {Node} node
     * @return {Component} component
     */

    renderNode(node) {
      return node.kind == 'block'
        ? DEFAULT_BLOCK
        : DEFAULT_INLINE
    }
  }
}

/**
 * Export.
 */

export default Plugin
