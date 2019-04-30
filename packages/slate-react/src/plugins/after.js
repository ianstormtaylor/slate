import Base64 from 'slate-base64-serializer'
import Debug from 'debug'
import Hotkeys from 'slate-hotkeys'
import Plain from 'slate-plain-serializer'
import getWindow from 'get-window'
import { IS_IOS, IS_IE, IS_EDGE } from 'slate-dev-environment'

import cloneFragment from '../utils/clone-fragment'
import findDOMNode from '../utils/find-dom-node'
import findNode from '../utils/find-node'
import findRange from '../utils/find-range'
import getEventRange from '../utils/get-event-range'
import getEventTransfer from '../utils/get-event-transfer'
import setEventTransfer from '../utils/set-event-transfer'
import setSelectionFromDom from '../utils/set-selection-from-dom'
import setTextFromDomNode from '../utils/set-text-from-dom-node'

/**
 * Debug.
 *
 * @type {Function}
 */

const debug = Debug('slate:after')

/**
 * A plugin that adds the "after" browser-specific logic to the editor.
 *
 * @param {Object} options
 * @return {Object}
 */

function AfterPlugin(options = {}) {
  let isDraggingInternally = null
  let isMouseDown = false

  /**
   * On before input.
   *
   * @param {Event} event
   * @param {Editor} editor
   * @param {Function} next
   */

  function onBeforeInput(event, editor, next) {
    const { value } = editor
    const isSynthetic = !!event.nativeEvent

    // If the event is synthetic, it's React's polyfill of `beforeinput` that
    // isn't a true `beforeinput` event with meaningful information. It only
    // gets triggered for character insertions, so we can just insert directly.
    if (isSynthetic) {
      event.preventDefault()
      editor.insertText(event.data)
      return next()
    }

    // Otherwise, we can use the information in the `beforeinput` event to
    // figure out the exact change that will occur, and prevent it.
    const [targetRange] = event.getTargetRanges()
    if (!targetRange) return next()

    debug('onBeforeInput', { event })

    event.preventDefault()

    const { document, selection } = value
    const range = findRange(targetRange, editor)

    switch (event.inputType) {
      case 'deleteByDrag':
      case 'deleteByCut':
      case 'deleteContent':
      case 'deleteContentBackward':
      case 'deleteContentForward': {
        editor.deleteAtRange(range)
        break
      }

      case 'deleteWordBackward': {
        editor.deleteWordBackwardAtRange(range)
        break
      }

      case 'deleteWordForward': {
        editor.deleteWordForwardAtRange(range)
        break
      }

      case 'deleteSoftLineBackward':
      case 'deleteHardLineBackward': {
        editor.deleteLineBackwardAtRange(range)
        break
      }

      case 'deleteSoftLineForward':
      case 'deleteHardLineForward': {
        editor.deleteLineForwardAtRange(range)
        break
      }

      case 'insertLineBreak':
      case 'insertParagraph': {
        const hasVoidParent = document.hasVoidParent(
          selection.start.path,
          editor
        )

        if (hasVoidParent) {
          editor.moveToStartOfNextText()
        } else {
          editor.splitBlockAtRange(range)
        }

        break
      }

      case 'insertFromYank':
      case 'insertFromComposition':
      case 'insertCompositionText':
      case 'insertReplacementText':
      case 'insertText': {
        // COMPAT: `data` should have the text for the `insertText` input type
        // and `dataTransfer` should have the text for the
        // `insertReplacementText` input type, but Safari uses `insertText` for
        // spell check replacements and sets `data` to `null`. (2018/08/09)
        const text =
          event.data == null
            ? event.dataTransfer.getData('text/plain')
            : event.data

        if (text == null) break

        editor.insertTextAtRange(range, text, selection.marks)

        // If the text was successfully inserted, and the selection had marks
        // on it, unset the selection's marks.
        if (selection.marks && value.document !== editor.value.document) {
          editor.select({ marks: null })
        }

        if (event.inputType === 'insertFromComposition') {
          editor.deleteBackward(1)
        }

        break
      }
    }

    next()
  }

  /**
   * On blur.
   *
   * @param {Event} event
   * @param {Editor} editor
   * @param {Function} next
   */

  function onBlur(event, editor, next) {
    debug('onBlur', { event })
    editor.blur()
    next()
  }

  /**
   * On click.
   *
   * @param {Event} event
   * @param {Editor} editor
   * @param {Function} next
   */

  function onClick(event, editor, next) {
    if (editor.readOnly) return next()

    const { value } = editor
    const { document } = value
    const node = findNode(event.target, editor)
    if (!node) return next()

    debug('onClick', { event })

    const ancestors = document.getAncestors(node.key)
    const isVoid =
      node && (editor.isVoid(node) || ancestors.some(a => editor.isVoid(a)))

    if (isVoid) {
      // COMPAT: In Chrome & Safari, selections that are at the zero offset of
      // an inline node will be automatically replaced to be at the last offset
      // of a previous inline node, which screws us up, so we always want to set
      // it to the end of the node. (2016/11/29)
      editor.focus().moveToEndOfNode(node)
    }

    next()
  }

  /**
   * On copy.
   *
   * @param {Event} event
   * @param {Editor} editor
   * @param {Function} next
   */

  function onCopy(event, editor, next) {
    debug('onCopy', { event })
    cloneFragment(event, editor)
    next()
  }

  /**
   * On cut.
   *
   * @param {Event} event
   * @param {Editor} editor
   * @param {Function} next
   */

  function onCut(event, editor, next) {
    debug('onCut', { event })

    // Once the fake cut content has successfully been added to the clipboard,
    // delete the content in the current selection.
    cloneFragment(event, editor, () => {
      // If user cuts a void block node or a void inline node,
      // manually removes it since selection is collapsed in this case.
      const { value } = editor
      const { endBlock, endInline, selection } = value
      const { isCollapsed } = selection
      const isVoidBlock = endBlock && editor.isVoid(endBlock) && isCollapsed
      const isVoidInline = endInline && editor.isVoid(endInline) && isCollapsed

      if (isVoidBlock) {
        editor.removeNodeByKey(endBlock.key)
      } else if (isVoidInline) {
        editor.removeNodeByKey(endInline.key)
      } else {
        editor.delete()
      }
    })

    next()
  }

  /**
   * On drag end.
   *
   * @param {Event} event
   * @param {Editor} editor
   * @param {Function} next
   */

  function onDragEnd(event, editor, next) {
    debug('onDragEnd', { event })
    isDraggingInternally = null
    next()
  }

  /**
   * On drag start.
   *
   * @param {Event} event
   * @param {Editor} editor
   * @param {Function} next
   */

  function onDragStart(event, editor, next) {
    debug('onDragStart', { event })

    isDraggingInternally = true

    const { value } = editor
    const { document } = value
    const node = findNode(event.target, editor)
    const ancestors = document.getAncestors(node.key)
    const isVoid =
      node && (editor.isVoid(node) || ancestors.some(a => editor.isVoid(a)))
    const selectionIncludesNode = value.blocks.some(
      block => block.key === node.key
    )

    // If a void block is dragged and is not selected, select it (necessary for local drags).
    if (isVoid && !selectionIncludesNode) {
      editor.moveToRangeOfNode(node)
    }

    const fragment = editor.value.fragment
    const encoded = Base64.serializeNode(fragment)
    setEventTransfer(event, 'fragment', encoded)
    next()
  }

  /**
   * On drop.
   *
   * @param {Event} event
   * @param {Editor} editor
   * @param {Function} next
   */

  function onDrop(event, editor, next) {
    const { value } = editor
    const { document, selection } = value
    const window = getWindow(event.target)
    let target = getEventRange(event, editor)
    if (!target) return next()

    debug('onDrop', { event })

    const transfer = getEventTransfer(event)
    const { type, fragment, text } = transfer

    editor.focus()

    // If the drag is internal and the target is after the selection, it
    // needs to account for the selection's content being deleted.
    if (
      isDraggingInternally &&
      selection.end.key === target.end.key &&
      selection.end.offset < target.end.offset
    ) {
      target = target.moveForward(
        selection.start.key === selection.end.key
          ? 0 - selection.end.offset + selection.start.offset
          : 0 - selection.end.offset
      )
    }

    if (isDraggingInternally) {
      editor.delete()
    }

    editor.select(target)

    if (type === 'text' || type === 'html') {
      const { anchor } = target
      let hasVoidParent = document.hasVoidParent(anchor.key, editor)

      if (hasVoidParent) {
        let n = document.getNode(anchor.key)

        while (hasVoidParent) {
          n = document.getNextText(n.key)
          if (!n) break
          hasVoidParent = document.hasVoidParent(n.key, editor)
        }

        if (n) editor.moveToStartOfNode(n)
      }

      if (text) {
        text.split('\n').forEach((line, i) => {
          if (i > 0) editor.splitBlock()
          editor.insertText(line)
        })
      }
    }

    if (type === 'fragment') {
      editor.insertFragment(fragment)
    }

    // COMPAT: React's onSelect event breaks after an onDrop event
    // has fired in a node: https://github.com/facebook/react/issues/11379.
    // Until this is fixed in React, we dispatch a mouseup event on that
    // DOM node, since that will make it go back to normal.
    const focusNode = document.getNode(target.focus.key)
    const el = findDOMNode(focusNode, window)

    if (el) {
      el.dispatchEvent(
        new MouseEvent('mouseup', {
          view: window,
          bubbles: true,
          cancelable: true,
        })
      )
    }

    next()
  }

  /**
   * On focus.
   *
   * @param {Event} event
   * @param {Editor} editor
   * @param {Function} next
   */

  function onFocus(event, editor, next) {
    debug('onFocus', { event })

    // COMPAT: If the focus event is a mouse-based one, it will be shortly
    // followed by a `selectionchange`, so we need to deselect here to prevent
    // the old selection from being set by the `updateSelection` of `<Content>`,
    // preventing the `selectionchange` from firing. (2018/11/07)
    if (isMouseDown && !IS_IE && !IS_EDGE) {
      editor.deselect().focus()
    } else {
      editor.focus()
    }

    next()
  }

  /**
   * On input.
   *
   * @param {Event} event
   * @param {Editor} editor
   * @param {Function} next
   */

  function onInput(event, editor, next) {
    debug('onInput')
    const window = getWindow(event.target)

    // Get the selection point.
    const selection = window.getSelection()
    const { anchorNode } = selection

    setTextFromDomNode(window, editor, anchorNode)
    setSelectionFromDom(window, editor, selection)
    next()
  }

  /**
   * On key down.
   *
   * @param {Event} event
   * @param {Editor} editor
   * @param {Function} next
   */

  function onKeyDown(event, editor, next) {
    debug('onKeyDown', { event })

    const { value } = editor
    const { document, selection } = value
    const hasVoidParent = document.hasVoidParent(selection.start.path, editor)

    // COMPAT: In iOS, some of these hotkeys are handled in the
    // `onNativeBeforeInput` handler of the `<Content>` component in order to
    // preserve native autocorrect behavior, so they shouldn't be handled here.
    if (Hotkeys.isSplitBlock(event) && !IS_IOS) {
      return hasVoidParent
        ? editor.moveToStartOfNextText()
        : editor.splitBlock()
    }

    if (Hotkeys.isDeleteBackward(event) && !IS_IOS) {
      return editor.deleteCharBackward()
    }

    if (Hotkeys.isDeleteForward(event) && !IS_IOS) {
      return editor.deleteCharForward()
    }

    if (Hotkeys.isDeleteLineBackward(event)) {
      return editor.deleteLineBackward()
    }

    if (Hotkeys.isDeleteLineForward(event)) {
      return editor.deleteLineForward()
    }

    if (Hotkeys.isDeleteWordBackward(event)) {
      return editor.deleteWordBackward()
    }

    if (Hotkeys.isDeleteWordForward(event)) {
      return editor.deleteWordForward()
    }

    if (Hotkeys.isRedo(event)) {
      return editor.redo()
    }

    if (Hotkeys.isUndo(event)) {
      return editor.undo()
    }

    // COMPAT: Certain browsers don't handle the selection updates properly. In
    // Chrome, the selection isn't properly extended. And in Firefox, the
    // selection isn't properly collapsed. (2017/10/17)
    if (Hotkeys.isMoveLineBackward(event)) {
      event.preventDefault()
      return editor.moveToStartOfBlock()
    }

    if (Hotkeys.isMoveLineForward(event)) {
      event.preventDefault()
      return editor.moveToEndOfBlock()
    }

    if (Hotkeys.isExtendLineBackward(event)) {
      event.preventDefault()
      return editor.moveFocusToStartOfBlock()
    }

    if (Hotkeys.isExtendLineForward(event)) {
      event.preventDefault()
      return editor.moveFocusToEndOfBlock()
    }

    // COMPAT: If a void node is selected, or a zero-width text node adjacent to
    // an inline is selected, we need to handle these hotkeys manually because
    // browsers won't know what to do.
    if (Hotkeys.isMoveBackward(event)) {
      event.preventDefault()

      if (!selection.isCollapsed) {
        return editor.moveToStart()
      }

      return editor.moveBackward()
    }

    if (Hotkeys.isMoveForward(event)) {
      event.preventDefault()

      if (!selection.isCollapsed) {
        return editor.moveToEnd()
      }

      return editor.moveForward()
    }

    if (Hotkeys.isMoveWordBackward(event)) {
      event.preventDefault()
      return editor.moveWordBackward()
    }

    if (Hotkeys.isMoveWordForward(event)) {
      event.preventDefault()
      return editor.moveWordForward()
    }

    if (Hotkeys.isExtendBackward(event)) {
      const { previousText, startText } = value
      const isPreviousInVoid =
        previousText && document.hasVoidParent(previousText.key, editor)

      if (hasVoidParent || isPreviousInVoid || startText.text === '') {
        event.preventDefault()
        return editor.moveFocusBackward()
      }
    }

    if (Hotkeys.isExtendForward(event)) {
      const { nextText, startText } = value
      const isNextInVoid =
        nextText && document.hasVoidParent(nextText.key, editor)

      if (hasVoidParent || isNextInVoid || startText.text === '') {
        event.preventDefault()
        return editor.moveFocusForward()
      }
    }

    next()
  }

  /**
   * On mouse down.
   *
   * @param {Event} event
   * @param {Editor} editor
   * @param {Function} next
   */

  function onMouseDown(event, editor, next) {
    debug('onMouseDown', { event })
    isMouseDown = true
    next()
  }

  /**
   * On mouse up.
   *
   * @param {Event} event
   * @param {Editor} editor
   * @param {Function} next
   */

  function onMouseUp(event, editor, next) {
    debug('onMouseUp', { event })
    isMouseDown = false
    next()
  }

  /**
   * On paste.
   *
   * @param {Event} event
   * @param {Editor} editor
   * @param {Function} next
   */

  function onPaste(event, editor, next) {
    debug('onPaste', { event })

    const { value } = editor
    const transfer = getEventTransfer(event)
    const { type, fragment, text } = transfer

    if (type === 'fragment') {
      editor.insertFragment(fragment)
    }

    if (type === 'text' || type === 'html') {
      if (!text) return next()
      const { document, selection, startBlock } = value
      if (editor.isVoid(startBlock)) return next()

      const defaultBlock = startBlock
      const defaultMarks = document.getInsertMarksAtRange(selection)
      const frag = Plain.deserialize(text, { defaultBlock, defaultMarks })
        .document
      editor.insertFragment(frag)
    }

    next()
  }

  /**
   * On select.
   *
   * @param {Event} event
   * @param {Editor} editor
   * @param {Function} next
   */

  function onSelect(event, editor, next) {
    debug('onSelect', { event })
    const window = getWindow(event.target)
    const selection = window.getSelection()
    setSelectionFromDom(window, editor, selection)

    // COMPAT: reset the `isMouseDown` state here in case a `mouseup` event
    // happens outside the editor. This is needed for `onFocus` handling.
    isMouseDown = false

    next()
  }

  /**
   * Return the plugin.
   *
   * @type {Object}
   */

  return {
    onBeforeInput,
    onBlur,
    onClick,
    onCopy,
    onCut,
    onDragEnd,
    onDragStart,
    onDrop,
    onFocus,
    onInput,
    onKeyDown,
    onMouseDown,
    onMouseUp,
    onPaste,
    onSelect,
  }
}

/**
 * Export.
 *
 * @type {Function}
 */

export default AfterPlugin
