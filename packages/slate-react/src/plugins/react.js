import Base64 from 'slate-base64-serializer'
import Debug from 'debug'
import Hotkeys from 'slate-hotkeys'
import Plain from 'slate-plain-serializer'
import React from 'react'
import ReactDOM from 'react-dom'
import getWindow from 'get-window'
import { Text } from 'slate'
import {
  IS_FIREFOX,
  IS_IE,
  IS_IOS,
  HAS_INPUT_EVENTS_LEVEL_2,
} from 'slate-dev-environment'

import Content from 'slate-react/src/components/content'
import cloneFragment from 'slate-react/src/utils/clone-fragment'
import findDOMNode from 'slate-react/src/utils/find-dom-node'
import findNode from 'slate-react/src/utils/find-node'
import findPoint from 'slate-react/src/utils/find-point'
import findRange from 'slate-react/src/utils/find-range'
import getEventRange from 'slate-react/src/utils/get-event-range'
import getEventTransfer from 'slate-react/src/utils/get-event-transfer'
import setEventTransfer from 'slate-react/src/utils/set-event-transfer'

/**
 * Debug.
 *
 * @type {Function}
 */

const debug = Debug('slate:before')

/**
 * The core before plugin.
 *
 * @return {Object}
 */

function BeforePlugin() {
  let activeElement = null
  let compositionCount = 0
  let isComposing = false
  let isCopying = false
  let isDragging = false
  let isDraggingInternally = null

  /**
   * On before input.
   *
   * @param {Event} event
   * @param {Change} change
   * @param {Function} next
   * @return {Boolean}
   */

  function onBeforeInput(event, change, next) {
    const { editor, value } = change
    const isSynthetic = !!event.nativeEvent
    if (editor.props.readOnly) return true

    // COMPAT: If the browser supports Input Events Level 2, we will have
    // attached a custom handler for the real `beforeinput` events, instead of
    // allowing React's synthetic polyfill, so we need to ignore synthetics.
    if (isSynthetic && HAS_INPUT_EVENTS_LEVEL_2) return true

    debug('onBeforeInput', { event })

    // Delegate to the plugins stack.
    const ret = next()
    if (ret !== undefined) return ret

    // If the event is synthetic, it's React's polyfill of `beforeinput` that
    // isn't a true `beforeinput` event with meaningful information. It only
    // gets triggered for character insertions, so we can just insert directly.
    if (isSynthetic) {
      event.preventDefault()
      change.insertText(event.data)
      return
    }

    // Otherwise, we can use the information in the `beforeinput` event to
    // figure out the exact change that will occur, and prevent it.
    const [targetRange] = event.getTargetRanges()
    if (!targetRange) return

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
        return
      }

      case 'deleteWordBackward': {
        change.deleteWordBackwardAtRange(range)
        return
      }

      case 'deleteWordForward': {
        change.deleteWordForwardAtRange(range)
        return
      }

      case 'deleteSoftLineBackward':
      case 'deleteHardLineBackward': {
        change.deleteLineBackwardAtRange(range)
        return
      }

      case 'deleteSoftLineForward':
      case 'deleteHardLineForward': {
        change.deleteLineForwardAtRange(range)
        return
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

        return
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

        if (text == null) return

        change.insertTextAtRange(range, text, selection.marks)

        // If the text was successfully inserted, and the selection had marks
        // on it, unset the selection's marks.
        if (selection.marks && value.document != change.value.document) {
          change.select({ marks: null })
        }

        return
      }
    }
  }

  /**
   * On blur.
   *
   * @param {Event} event
   * @param {Change} change
   * @param {Function} next
   * @return {Boolean}
   */

  function onBlur(event, change, next) {
    const { editor, value } = change
    if (isCopying) return true
    if (editor.props.readOnly) return true

    const { relatedTarget, target } = event
    const window = getWindow(target)

    // COMPAT: If the current `activeElement` is still the previous one, this is
    // due to the window being blurred when the tab itself becomes unfocused, so
    // we want to abort early to allow to editor to stay focused when the tab
    // becomes focused again.
    if (activeElement == window.document.activeElement) return true

    // COMPAT: The `relatedTarget` can be null when the new focus target is not
    // a "focusable" element (eg. a `<div>` without `tabindex` set).
    if (relatedTarget) {
      const el = ReactDOM.findDOMNode(editor)

      // COMPAT: The event should be ignored if the focus is returning to the
      // editor from an embedded editable element (eg. an <input> element inside
      // a void node).
      if (relatedTarget == el) return true

      // COMPAT: The event should be ignored if the focus is moving from the
      // editor to inside a void node's spacer element.
      if (relatedTarget.hasAttribute('data-slate-spacer')) return true

      // COMPAT: The event should be ignored if the focus is moving to a non-
      // editable section of an element that isn't a void node (eg. a list item
      // of the check list example).
      const node = findNode(relatedTarget, value)
      if (el.contains(relatedTarget) && node && !change.isVoid(node))
        return true
    }

    debug('onBlur', { event })

    // Delegate to the plugins stack.
    const ret = next()
    if (ret !== undefined) return ret

    change.blur()
    return true
  }

  /**
   * On composition end.
   *
   * @param {Event} event
   * @param {Change} change
   * @param {Function} next
   * @return {Boolean}
   */

  function onCompositionEnd(event, change, next) {
    const { editor } = change
    const n = compositionCount

    // The `count` check here ensures that if another composition starts
    // before the timeout has closed out this one, we will abort unsetting the
    // `isComposing` flag, since a composition is still in affect.
    window.requestAnimationFrame(() => {
      if (compositionCount > n) return
      isComposing = false

      // HACK: we need to re-render the editor here so that it will update its
      // placeholder in case one is currently rendered. This should be handled
      // differently ideally, in a less invasive way?
      // (apply force re-render if isComposing changes)
      if (editor.state.isComposing) {
        editor.setState({ isComposing: false })
      }
    })

    debug('onCompositionEnd', { event })

    // Delegate to the plugins stack.
    return next()
  }

  /**
   * On click.
   *
   * @param {Event} event
   * @param {Change} change
   * @param {Function} next
   * @return {Boolean}
   */

  function onClick(event, change, next) {
    debug('onClick', { event })

    // Delegate to the plugins stack.
    const ret = next()
    if (ret !== undefined) return ret

    const { editor, value } = change
    if (editor.props.readOnly) return true

    const { document } = value
    const node = findNode(event.target, value)
    if (!node) return true

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

    return true
  }

  /**
   * On composition start.
   *
   * @param {Event} event
   * @param {Change} change
   * @param {Function} next
   * @return {Boolean}
   */

  function onCompositionStart(event, change, next) {
    isComposing = true
    compositionCount++
    const { editor } = change

    // HACK: we need to re-render the editor here so that it will update its
    // placeholder in case one is currently rendered. This should be handled
    // differently ideally, in a less invasive way?
    // (apply force re-render if isComposing changes)
    if (!editor.state.isComposing) {
      editor.setState({ isComposing: true })
    }

    debug('onCompositionStart', { event })

    // Delegate to the plugins stack.
    return next()
  }

  /**
   * On copy.
   *
   * @param {Event} event
   * @param {Change} change
   * @param {Function} next
   * @return {Boolean}
   */

  function onCopy(event, change, next) {
    const window = getWindow(event.target)
    isCopying = true
    window.requestAnimationFrame(() => (isCopying = false))

    debug('onCopy', { event })

    // Delegate to the plugins stack.
    const ret = next()
    if (ret !== undefined) return ret

    const { editor } = change
    cloneFragment(event, editor)
    return true
  }

  /**
   * On cut.
   *
   * @param {Event} event
   * @param {Change} change
   * @param {Function} next
   * @return {Boolean}
   */

  function onCut(event, change, next) {
    const { editor } = change
    if (editor.props.readOnly) return true

    const window = getWindow(event.target)
    isCopying = true
    window.requestAnimationFrame(() => (isCopying = false))

    debug('onCut', { event })

    // Delegate to the plugins stack.
    const ret = next()
    if (ret !== undefined) return ret

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
  }

  /**
   * On drag end.
   *
   * @param {Event} event
   * @param {Change} change
   * @param {Function} next
   * @return {Boolean}
   */

  function onDragEnd(event, change, next) {
    debug('onDragEnd', { event })
    isDragging = false
    isDraggingInternally = null
    return next()
  }

  /**
   * On drag enter.
   *
   * @param {Event} event
   * @param {Change} change
   * @param {Function} next
   * @return {Boolean}
   */

  function onDragEnter(event, change, next) {
    debug('onDragEnter', { event })
    return next()
  }

  /**
   * On drag exit.
   *
   * @param {Event} event
   * @param {Change} change
   * @param {Function} next
   * @return {Boolean}
   */

  function onDragExit(event, change, next) {
    debug('onDragExit', { event })
    return next()
  }

  /**
   * On drag leave.
   *
   * @param {Event} event
   * @param {Change} change
   * @param {Function} next
   * @return {Boolean}
   */

  function onDragLeave(event, change, next) {
    debug('onDragLeave', { event })
    return next()
  }

  /**
   * On drag over.
   *
   * @param {Event} event
   * @param {Change} change
   * @param {Function} next
   * @return {Boolean}
   */

  function onDragOver(event, change, next) {
    debug('onDragOver', { event })

    // If the target is inside a void node, and only in this case,
    // call `preventDefault` to signal that drops are allowed.
    // When the target is editable, dropping is already allowed by
    // default, and calling `preventDefault` hides the cursor.
    const { editor } = change
    const node = findNode(event.target, editor.value)
    if (change.isVoid(node)) event.preventDefault()

    // COMPAT: IE won't call onDrop on contentEditables unless the
    // default dragOver is prevented:
    // https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/913982/
    // (2018/07/11)
    if (IS_IE) event.preventDefault()

    // If a drag is already in progress, don't do this again.
    if (!isDragging) {
      isDragging = true

      // COMPAT: IE will raise an `unspecified error` if dropEffect is
      // set. (2018/07/11)
      if (!IS_IE) {
        event.nativeEvent.dataTransfer.dropEffect = 'move'
      }
    }

    return next()
  }

  /**
   * On drag start.
   *
   * @param {Event} event
   * @param {Change} change
   * @param {Function} next
   * @return {Boolean}
   */

  function onDragStart(event, change, next) {
    debug('onDragStart', { event })

    isDragging = true
    isDraggingInternally = true

    // Delegate to the plugins stack.
    const ret = next()
    if (ret !== undefined) return ret

    const { editor, value } = change
    const { document } = value
    const node = findNode(event.target, value)
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
  }

  /**
   * On drop.
   *
   * @param {Event} event
   * @param {Change} change
   * @param {Function} next
   * @return {Boolean}
   */

  function onDrop(event, change, next) {
    const { editor, value } = change
    if (editor.props.readOnly) return true

    debug('onDrop', { event })

    // Prevent default so the DOM's value isn't corrupted.
    event.preventDefault()

    // Delegate to the plugins stack.
    const ret = next()
    if (ret !== undefined) return ret

    const { document, selection } = value
    const window = getWindow(event.target)
    let target = getEventRange(event, editor)
    if (!target) return true

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
    if (!el) return true

    el.dispatchEvent(
      new MouseEvent('mouseup', {
        view: window,
        bubbles: true,
        cancelable: true,
      })
    )

    return true
  }

  /**
   * On focus.
   *
   * @param {Event} event
   * @param {Change} change
   * @param {Function} next
   * @return {Boolean}
   */

  function onFocus(event, change, next) {
    const { editor } = change
    if (isCopying) return true
    if (editor.props.readOnly) return true

    const el = ReactDOM.findDOMNode(editor)

    // Save the new `activeElement`.
    const window = getWindow(event.target)
    activeElement = window.document.activeElement

    // COMPAT: If the editor has nested editable elements, the focus can go to
    // those elements. In Firefox, this must be prevented because it results in
    // issues with keyboard navigation. (2017/03/30)
    if (IS_FIREFOX && event.target != el) {
      el.focus()
      return true
    }

    debug('onFocus', { event })
    return next()
  }

  /**
   * On input.
   *
   * @param {Event} event
   * @param {Change} change
   * @param {Function} next
   * @return {Boolean}
   */

  function onInput(event, change, next) {
    if (isComposing) return true
    if (change.value.selection.isBlurred) return true

    debug('onInput', { event })

    // Delegate to the plugins stack.
    const ret = next()
    if (ret !== undefined) return ret

    const window = getWindow(event.target)
    const { editor, value } = change

    // Get the selection point.
    const native = window.getSelection()
    const { anchorNode } = native
    const point = findPoint(anchorNode, 0, editor)
    if (!point) return

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
    if (textContent == text) return

    // Determine what the selection should be after changing the text.
    const delta = textContent.length - text.length
    const corrected = selection.moveToEnd().moveForward(delta)
    let entire = selection
      .moveAnchorTo(point.key, start)
      .moveFocusTo(point.key, end)

    entire = document.resolveRange(entire)

    // Change the current value to have the leaf's text replaced.
    change.insertTextAtRange(entire, textContent, leaf.marks).select(corrected)
  }

  /**
   * On key down.
   *
   * @param {Event} event
   * @param {Change} change
   * @param {Function} next
   * @return {Boolean}
   */

  function onKeyDown(event, change, next) {
    const { editor, value } = change
    if (editor.props.readOnly) return true

    // When composing, we need to prevent all hotkeys from executing while
    // typing. However, certain characters also move the selection before
    // we're able to handle it, so prevent their default behavior.
    if (isComposing) {
      if (Hotkeys.isCompose(event)) event.preventDefault()
      return true
    }

    debug('onKeyDown', { event })

    // Certain hotkeys have native editing behaviors in `contenteditable`
    // elements which will change the DOM and cause our value to be out of sync,
    // so they need to always be prevented.
    if (
      !IS_IOS &&
      (Hotkeys.isBold(event) ||
        Hotkeys.isDeleteBackward(event) ||
        Hotkeys.isDeleteForward(event) ||
        Hotkeys.isDeleteLineBackward(event) ||
        Hotkeys.isDeleteLineForward(event) ||
        Hotkeys.isDeleteWordBackward(event) ||
        Hotkeys.isDeleteWordForward(event) ||
        Hotkeys.isItalic(event) ||
        Hotkeys.isRedo(event) ||
        Hotkeys.isSplitBlock(event) ||
        Hotkeys.isTransposeCharacter(event) ||
        Hotkeys.isUndo(event))
    ) {
      event.preventDefault()
    }

    // Delegate to the plugins stack.
    const ret = next()
    if (ret !== undefined) return ret

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

    return true
  }

  /**
   * On paste.
   *
   * @param {Event} event
   * @param {Change} change
   * @param {Function} next
   * @return {Boolean}
   */

  function onPaste(event, change, next) {
    const { editor, value } = change
    if (editor.props.readOnly) return true

    debug('onPaste', { event })

    // Prevent defaults so the DOM state isn't corrupted.
    event.preventDefault()

    // Delegate to the plugins stack.
    const ret = next()
    if (ret !== undefined) return ret

    const transfer = getEventTransfer(event)
    const { type, fragment, text } = transfer

    if (type == 'fragment') {
      change.insertFragment(fragment)
    }

    if (type == 'text' || type == 'html') {
      if (!text) return true
      const { document, selection, startBlock } = value
      if (change.isVoid(startBlock)) return true

      const defaultBlock = startBlock
      const defaultMarks = document.getInsertMarksAtRange(selection)
      const frag = Plain.deserialize(text, { defaultBlock, defaultMarks })
        .document
      change.insertFragment(frag)
    }

    return true
  }

  /**
   * On select.
   *
   * @param {Event} event
   * @param {Change} change
   * @param {Function} next
   * @return {Boolean}
   */

  function onSelect(event, change, next) {
    if (isCopying) return true
    if (isComposing) return true

    const { editor, value } = change
    if (editor.props.readOnly) return true

    debug('onSelect', { event })

    // Save the new `activeElement`.
    const window = getWindow(event.target)
    activeElement = window.document.activeElement

    // Delegate to the plugins stack.
    const ret = next()
    if (ret !== undefined) return ret

    const { document } = value
    const native = window.getSelection()

    // If there are no ranges, the editor was blurred natively.
    if (!native.rangeCount) {
      change.blur()
      return true
    }

    // Otherwise, determine the Slate selection from the native one.
    let range = findRange(native, editor)
    if (!range) return true

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
    return true
  }

  /**
   * Render editor.
   *
   * @param {Object} props
   * @param {Editor} editor
   * @param {Function} next
   * @return {Object}
   */

  function renderEditor(props, editor, next) {
    const children = (
      <Content
        onEvent={editor.event}
        autoCorrect={props.autoCorrect}
        className={props.className}
        editor={editor}
        readOnly={props.readOnly}
        role={props.role}
        spellCheck={props.spellCheck}
        style={props.style}
        tabIndex={props.tabIndex}
        tagName={props.tagName}
      />
    )

    const ret = next({ ...props, children }, editor)
    return ret !== undefined ? ret : children
  }

  /**
   * Render node.
   *
   * @param {Object} props
   * @param {Editor} editor
   * @param {Function} next
   * @return {Element}
   */

  function renderNode(props, editor, next) {
    const ret = next()
    if (ret !== undefined) return ret

    const { attributes, children, node } = props
    if (node.object != 'block' && node.object != 'inline') return null
    const Tag = node.object == 'block' ? 'div' : 'span'
    const style = { position: 'relative' }
    return (
      <Tag {...attributes} style={style}>
        {children}
      </Tag>
    )
  }

  /**
   * Render placeholder.
   *
   * @param {Object} props
   * @param {Editor} editor
   * @param {Function} next
   * @return {Element}
   */

  function renderPlaceholder(props, editor, next) {
    const ret = next()
    if (ret !== undefined) return ret

    const { node } = props
    if (!editor.props.placeholder) return null
    if (editor.state.isComposing) return null
    if (node.object != 'block') return null
    if (!Text.isTextList(node.nodes)) return null
    if (node.text != '') return null
    if (editor.value.document.getBlocks().size > 1) return null

    const style = {
      pointerEvents: 'none',
      display: 'inline-block',
      width: '0',
      maxWidth: '100%',
      whiteSpace: 'nowrap',
      opacity: '0.333',
    }

    return (
      <span contentEditable={false} style={style}>
        {editor.props.placeholder}
      </span>
    )
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
    onCompositionEnd,
    onCompositionStart,
    onCopy,
    onCut,
    onDragEnd,
    onDragEnter,
    onDragExit,
    onDragLeave,
    onDragOver,
    onDragStart,
    onDrop,
    onFocus,
    onInput,
    onKeyDown,
    onPaste,
    onSelect,
    renderEditor,
    renderNode,
    renderPlaceholder,
  }
}

/**
 * Export.
 *
 * @type {Object}
 */

export default BeforePlugin
