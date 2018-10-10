import Base64 from 'slate-base64-serializer'
import Debug from 'debug'
import Hotkeys from 'slate-hotkeys'
import Plain from 'slate-plain-serializer'
import getWindow from 'get-window'
import { IS_IOS } from 'slate-dev-environment'

import cloneFragment from '../utils/clone-fragment'
import findDOMNode from '../utils/find-dom-node'
import findNode from '../utils/find-node'
import findPoint from '../utils/find-point'
import findRange from '../utils/find-range'
import getEventRange from '../utils/get-event-range'
import getEventTransfer from '../utils/get-event-transfer'
import setEventTransfer from '../utils/set-event-transfer'

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

  /**
   * On before input.
   *
   * @param {Event} event
   * @param {Change} change
   * @param {Function} next
   */

  function onBeforeInput(event, change, next) {
    const { editor, value } = change
    const isSynthetic = !!event.nativeEvent

    // If the event is synthetic, it's React's polyfill of `beforeinput` that
    // isn't a true `beforeinput` event with meaningful information. It only
    // gets triggered for character insertions, so we can just insert directly.
    if (isSynthetic) {
      event.preventDefault()
      change.insertText(event.data)
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
        change.deleteAtRange(range)
        break
      }

      case 'deleteWordBackward': {
        change.deleteWordBackwardAtRange(range)
        break
      }

      case 'deleteWordForward': {
        change.deleteWordForwardAtRange(range)
        break
      }

      case 'deleteSoftLineBackward':
      case 'deleteHardLineBackward': {
        change.deleteLineBackwardAtRange(range)
        break
      }

      case 'deleteSoftLineForward':
      case 'deleteHardLineForward': {
        change.deleteLineForwardAtRange(range)
        break
      }

      case 'insertLineBreak':
      case 'insertParagraph': {
        const hasVoidParent = document.hasVoidParent(
          selection.start.path,
          editor
        )

        if (hasVoidParent) {
          change.moveToStartOfNextText()
        } else {
          change.splitBlockAtRange(range)
        }

        break
      }

      case 'insertFromYank':
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

        change.insertTextAtRange(range, text, selection.marks)

        // If the text was successfully inserted, and the selection had marks
        // on it, unset the selection's marks.
        if (selection.marks && value.document != change.value.document) {
          change.select({ marks: null })
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
   * @param {Change} change
   * @param {Function} next
   */

  function onBlur(event, change, next) {
    debug('onBlur', { event })
    change.blur()
    next()
  }

  /**
   * On click.
   *
   * @param {Event} event
   * @param {Change} change
   * @param {Function} next
   */

  function onClick(event, change, next) {
    const { editor } = change
    if (editor.readOnly) return next()

    const { value } = editor
    const { document } = value
    const node = findNode(event.target, editor)
    if (!node) return next()

    debug('onClick', { event })

    const ancestors = document.getAncestors(node.key)
    const isVoid =
      node && (change.isVoid(node) || ancestors.some(a => change.isVoid(a)))

    if (isVoid) {
      // COMPAT: In Chrome & Safari, selections that are at the zero offset of
      // an inline node will be automatically replaced to be at the last offset
      // of a previous inline node, which screws us up, so we always want to set
      // it to the end of the node. (2016/11/29)
      change.focus().moveToEndOfNode(node)
    }

    next()
  }

  /**
   * On copy.
   *
   * @param {Event} event
   * @param {Change} change
   * @param {Function} next
   */

  function onCopy(event, change, next) {
    debug('onCopy', { event })
    const { editor } = change
    cloneFragment(event, editor)
    next()
  }

  /**
   * On cut.
   *
   * @param {Event} event
   * @param {Change} change
   * @param {Function} next
   */

  function onCut(event, change, next) {
    debug('onCut', { event })
    const { editor } = change

    // Once the fake cut content has successfully been added to the clipboard,
    // delete the content in the current selection.
    cloneFragment(event, editor, () => {
      // If user cuts a void block node or a void inline node,
      // manually removes it since selection is collapsed in this case.
      const { value } = change
      const { endBlock, endInline, selection } = value
      const { isCollapsed } = selection
      const isVoidBlock = endBlock && change.isVoid(endBlock) && isCollapsed
      const isVoidInline = endInline && change.isVoid(endInline) && isCollapsed

      if (isVoidBlock) {
        editor.change(c => c.removeNodeByKey(endBlock.key))
      } else if (isVoidInline) {
        editor.change(c => c.removeNodeByKey(endInline.key))
      } else {
        editor.change(c => c.delete())
      }
    })

    next()
  }

  /**
   * On drag end.
   *
   * @param {Event} event
   * @param {Change} change
   * @param {Function} next
   */

  function onDragEnd(event, change, next) {
    debug('onDragEnd', { event })
    isDraggingInternally = null
    next()
  }

  /**
   * On drag start.
   *
   * @param {Event} event
   * @param {Change} change
   * @param {Function} next
   */

  function onDragStart(event, change, next) {
    debug('onDragStart', { event })

    isDraggingInternally = true

    const { editor } = change
    const { value } = editor
    const { document } = value
    const node = findNode(event.target, editor)
    const ancestors = document.getAncestors(node.key)
    const isVoid =
      node && (change.isVoid(node) || ancestors.some(a => change.isVoid(a)))
    const selectionIncludesNode = value.blocks.some(
      block => block.key === node.key
    )

    // If a void block is dragged and is not selected, select it (necessary for local drags).
    if (isVoid && !selectionIncludesNode) {
      change.moveToRangeOfNode(node)
    }

    const fragment = change.value.fragment
    const encoded = Base64.serializeNode(fragment)
    setEventTransfer(event, 'fragment', encoded)
    next()
  }

  /**
   * On drop.
   *
   * @param {Event} event
   * @param {Change} change
   * @param {Function} next
   */

  function onDrop(event, change, next) {
    const { editor, value } = change
    const { document, selection } = value
    const window = getWindow(event.target)
    let target = getEventRange(event, editor)
    if (!target) return next()

    debug('onDrop', { event })

    const transfer = getEventTransfer(event)
    const { type, fragment, text } = transfer

    change.focus()

    // If the drag is internal and the target is after the selection, it
    // needs to account for the selection's content being deleted.
    if (
      isDraggingInternally &&
      selection.end.key == target.end.key &&
      selection.end.offset < target.end.offset
    ) {
      target = target.moveForward(
        selection.start.key == selection.end.key
          ? 0 - selection.end.offset + selection.start.offset
          : 0 - selection.end.offset
      )
    }

    if (isDraggingInternally) {
      change.delete()
    }

    change.select(target)

    if (type == 'text' || type == 'html') {
      const { anchor } = target
      let hasVoidParent = document.hasVoidParent(anchor.key, editor)

      if (hasVoidParent) {
        let n = document.getNode(anchor.key)

        while (hasVoidParent) {
          n = document.getNextText(n.key)
          if (!n) break
          hasVoidParent = document.hasVoidParent(n.key, editor)
        }

        if (n) change.moveToStartOfNode(n)
      }

      if (text) {
        text.split('\n').forEach((line, i) => {
          if (i > 0) change.splitBlock()
          change.insertText(line)
        })
      }
    }

    if (type == 'fragment') {
      change.insertFragment(fragment)
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
   * On input.
   *
   * @param {Event} event
   * @param {Change} change
   * @param {Function} next
   */

  function onInput(event, change, next) {
    const window = getWindow(event.target)
    const { editor, value } = change

    // Get the selection point.
    const native = window.getSelection()
    const { anchorNode } = native
    const point = findPoint(anchorNode, 0, editor)
    if (!point) return next()

    // Get the text node and leaf in question.
    const { document, selection } = value
    const node = document.getDescendant(point.key)
    const block = document.getClosestBlock(node.key)
    const leaves = node.getLeaves()
    const lastText = block.getLastText()
    const lastLeaf = leaves.last()
    let start = 0
    let end = 0

    const leaf =
      leaves.find(r => {
        start = end
        end += r.text.length
        if (end > point.offset) return true
      }) || lastLeaf

    // Get the text information.
    const { text } = leaf
    let { textContent } = anchorNode
    const isLastText = node == lastText
    const isLastLeaf = leaf == lastLeaf
    const lastChar = textContent.charAt(textContent.length - 1)

    // COMPAT: If this is the last leaf, and the DOM text ends in a new line,
    // we will have added another new line in <Leaf>'s render method to account
    // for browsers collapsing a single trailing new lines, so remove it.
    if (isLastText && isLastLeaf && lastChar == '\n') {
      textContent = textContent.slice(0, -1)
    }

    // If the text is no different, abort.
    if (textContent == text) return next()

    debug('onInput', { event })

    // Determine what the selection should be after changing the text.
    const delta = textContent.length - text.length
    const corrected = selection.moveToEnd().moveForward(delta)
    let entire = selection
      .moveAnchorTo(point.key, start)
      .moveFocusTo(point.key, end)

    entire = document.resolveRange(entire)

    // Change the current value to have the leaf's text replaced.
    change.insertTextAtRange(entire, textContent, leaf.marks).select(corrected)
    next()
  }

  /**
   * On key down.
   *
   * @param {Event} event
   * @param {Change} change
   * @param {Function} next
   */

  function onKeyDown(event, change, next) {
    debug('onKeyDown', { event })

    const { editor, value } = change
    const { document, selection } = value
    const hasVoidParent = document.hasVoidParent(selection.start.path, editor)

    // COMPAT: In iOS, some of these hotkeys are handled in the
    // `onNativeBeforeInput` handler of the `<Content>` component in order to
    // preserve native autocorrect behavior, so they shouldn't be handled here.
    if (Hotkeys.isSplitBlock(event) && !IS_IOS) {
      return hasVoidParent
        ? change.moveToStartOfNextText()
        : change.splitBlock()
    }

    if (Hotkeys.isDeleteBackward(event) && !IS_IOS) {
      return change.deleteCharBackward()
    }

    if (Hotkeys.isDeleteForward(event) && !IS_IOS) {
      return change.deleteCharForward()
    }

    if (Hotkeys.isDeleteLineBackward(event)) {
      return change.deleteLineBackward()
    }

    if (Hotkeys.isDeleteLineForward(event)) {
      return change.deleteLineForward()
    }

    if (Hotkeys.isDeleteWordBackward(event)) {
      return change.deleteWordBackward()
    }

    if (Hotkeys.isDeleteWordForward(event)) {
      return change.deleteWordForward()
    }

    if (Hotkeys.isRedo(event)) {
      return change.redo()
    }

    if (Hotkeys.isUndo(event)) {
      return change.undo()
    }

    // COMPAT: Certain browsers don't handle the selection updates properly. In
    // Chrome, the selection isn't properly extended. And in Firefox, the
    // selection isn't properly collapsed. (2017/10/17)
    if (Hotkeys.isMoveLineBackward(event)) {
      event.preventDefault()
      return change.moveToStartOfBlock()
    }

    if (Hotkeys.isMoveLineForward(event)) {
      event.preventDefault()
      return change.moveToEndOfBlock()
    }

    if (Hotkeys.isExtendLineBackward(event)) {
      event.preventDefault()
      return change.moveFocusToStartOfBlock()
    }

    if (Hotkeys.isExtendLineForward(event)) {
      event.preventDefault()
      return change.moveFocusToEndOfBlock()
    }

    // COMPAT: If a void node is selected, or a zero-width text node adjacent to
    // an inline is selected, we need to handle these hotkeys manually because
    // browsers won't know what to do.
    if (Hotkeys.isMoveBackward(event)) {
      const { previousText, startText } = value
      const isPreviousInVoid =
        previousText && document.hasVoidParent(previousText.key, editor)

      if (hasVoidParent || isPreviousInVoid || startText.text == '') {
        event.preventDefault()
        return change.moveBackward()
      }
    }

    if (Hotkeys.isMoveForward(event)) {
      const { nextText, startText } = value
      const isNextInVoid =
        nextText && document.hasVoidParent(nextText.key, editor)

      if (hasVoidParent || isNextInVoid || startText.text == '') {
        event.preventDefault()
        return change.moveForward()
      }
    }

    if (Hotkeys.isExtendBackward(event)) {
      const { previousText, startText } = value
      const isPreviousInVoid =
        previousText && document.hasVoidParent(previousText.key, editor)

      if (hasVoidParent || isPreviousInVoid || startText.text == '') {
        event.preventDefault()
        return change.moveFocusBackward()
      }
    }

    if (Hotkeys.isExtendForward(event)) {
      const { nextText, startText } = value
      const isNextInVoid =
        nextText && document.hasVoidParent(nextText.key, editor)

      if (hasVoidParent || isNextInVoid || startText.text == '') {
        event.preventDefault()
        return change.moveFocusForward()
      }
    }

    next()
  }

  /**
   * On paste.
   *
   * @param {Event} event
   * @param {Change} change
   * @param {Function} next
   */

  function onPaste(event, change, next) {
    debug('onPaste', { event })

    const { value } = change
    const transfer = getEventTransfer(event)
    const { type, fragment, text } = transfer

    if (type == 'fragment') {
      change.insertFragment(fragment)
    }

    if (type == 'text' || type == 'html') {
      if (!text) return next()
      const { document, selection, startBlock } = value
      if (change.isVoid(startBlock)) return next()

      const defaultBlock = startBlock
      const defaultMarks = document.getInsertMarksAtRange(selection)
      const frag = Plain.deserialize(text, { defaultBlock, defaultMarks })
        .document
      change.insertFragment(frag)
    }

    next()
  }

  /**
   * On select.
   *
   * @param {Event} event
   * @param {Change} change
   * @param {Function} next
   */

  function onSelect(event, change, next) {
    debug('onSelect', { event })

    const window = getWindow(event.target)
    const { editor, value } = change
    const { document } = value
    const native = window.getSelection()

    // If there are no ranges, the editor was blurred natively.
    if (!native.rangeCount) {
      change.blur()
      return
    }

    // Otherwise, determine the Slate selection from the native one.
    let range = findRange(native, editor)
    if (!range) return

    const { anchor, focus } = range
    const anchorText = document.getNode(anchor.key)
    const focusText = document.getNode(focus.key)
    const anchorInline = document.getClosestInline(anchor.key)
    const focusInline = document.getClosestInline(focus.key)
    const focusBlock = document.getClosestBlock(focus.key)
    const anchorBlock = document.getClosestBlock(anchor.key)

    // COMPAT: If the anchor point is at the start of a non-void, and the
    // focus point is inside a void node with an offset that isn't `0`, set
    // the focus offset to `0`. This is due to void nodes <span>'s being
    // positioned off screen, resulting in the offset always being greater
    // than `0`. Since we can't know what it really should be, and since an
    // offset of `0` is less destructive because it creates a hanging
    // selection, go with `0`. (2017/09/07)
    if (
      anchorBlock &&
      !change.isVoid(anchorBlock) &&
      anchor.offset == 0 &&
      focusBlock &&
      change.isVoid(focusBlock) &&
      focus.offset != 0
    ) {
      range = range.setFocus(focus.setOffset(0))
    }

    // COMPAT: If the selection is at the end of a non-void inline node, and
    // there is a node after it, put it in the node after instead. This
    // standardizes the behavior, since it's indistinguishable to the user.
    if (
      anchorInline &&
      !change.isVoid(anchorInline) &&
      anchor.offset == anchorText.text.length
    ) {
      const block = document.getClosestBlock(anchor.key)
      const nextText = block.getNextText(anchor.key)
      if (nextText) range = range.moveAnchorTo(nextText.key, 0)
    }

    if (
      focusInline &&
      !change.isVoid(focusInline) &&
      focus.offset == focusText.text.length
    ) {
      const block = document.getClosestBlock(focus.key)
      const nextText = block.getNextText(focus.key)
      if (nextText) range = range.moveFocusTo(nextText.key, 0)
    }

    let selection = document.createSelection(range)
    selection = selection.setIsFocused(true)

    // Preserve active marks from the current selection.
    // They will be cleared by `change.select` if the selection actually moved.
    selection = selection.set('marks', value.selection.marks)

    change.select(selection)
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
    onInput,
    onKeyDown,
    onPaste,
    onSelect,
  }
}

/**
 * Export.
 *
 * @type {Object}
 */

export default AfterPlugin
