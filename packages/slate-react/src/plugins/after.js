
import Base64 from 'slate-base64-serializer'
import Debug from 'debug'
import Plain from 'slate-plain-serializer'
import React from 'react'
import getWindow from 'get-window'
import { Block, Inline, Text } from 'slate'

import EVENT_HANDLERS from '../constants/event-handlers'
import HOTKEYS from '../constants/hotkeys'
import Content from '../components/content'
import findDOMNode from '../utils/find-dom-node'
import findNode from '../utils/find-node'
import findPoint from '../utils/find-point'
import findRange from '../utils/find-range'
import getEventRange from '../utils/get-event-range'
import getEventTransfer from '../utils/get-event-transfer'
import setEventTransfer from '../utils/set-event-transfer'
import { IS_CHROME, IS_SAFARI } from '../constants/environment'

/**
 * Debug.
 *
 * @type {Function}
 */

const debug = Debug('slate:after')

/**
 * The after plugin.
 *
 * @return {Object}
 */

function AfterPlugin() {
  let isDraggingInternally = null

  /**
   * On before input, correct any browser inconsistencies.
   *
   * @param {Event} event
   * @param {Change} change
   * @param {Editor} editor
   */

  function onBeforeInput(event, change, editor) {
    debug('onBeforeInput', { event })

    event.preventDefault()
    change.insertText(event.data)
  }

  /**
   * On blur.
   *
   * @param {Event} event
   * @param {Change} change
   * @param {Editor} editor
   */

  function onBlur(event, change, editor) {
    debug('onBlur', { event })

    change.blur()
  }

  /**
   * On click.
   *
   * @param {Event} event
   * @param {Change} change
   * @param {Editor} editor
   */

  function onClick(event, change, editor) {
    if (editor.props.readOnly) return true

    const { value } = change
    const { document } = value
    const node = findNode(event.target, value)
    const isVoid = node && (node.isVoid || document.hasVoidParent(node.key))

    if (isVoid) {
      // COMPAT: In Chrome & Safari, selections that are at the zero offset of
      // an inline node will be automatically replaced to be at the last offset
      // of a previous inline node, which screws us up, so we always want to set
      // it to the end of the node. (2016/11/29)
      change.focus().collapseToEndOf(node)
    }

    debug('onClick', { event })
  }

  /**
   * On copy.
   *
   * @param {Event} event
   * @param {Change} change
   * @param {Editor} editor
   */

  function onCopy(event, change, editor) {
    debug('onCopy', { event })

    onCutOrCopy(event, change)
  }

  /**
   * On cut.
   *
   * @param {Event} event
   * @param {Change} change
   * @param {Editor} editor
   */

  function onCut(event, change, editor) {
    debug('onCut', { event })

    onCutOrCopy(event, change)
    const window = getWindow(event.target)

    // Once the fake cut content has successfully been added to the clipboard,
    // delete the content in the current selection.
    window.requestAnimationFrame(() => {
      // If user cuts a void block node or a void inline node,
      // manually removes it since selection is collapsed in this case.
      const { value } = change
      const { endBlock, endInline, isCollapsed } = value
      const isVoidBlock = endBlock && endBlock.isVoid && isCollapsed
      const isVoidInline = endInline && endInline.isVoid && isCollapsed

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
   * On cut or copy.
   *
   * @param {Event} event
   * @param {Change} change
   * @param {Editor} editor
   */

  function onCutOrCopy(event, change, editor) {
    const window = getWindow(event.target)
    const native = window.getSelection()
    const { value } = change
    const { startKey, endKey, startText, endBlock, endInline } = value
    const isVoidBlock = endBlock && endBlock.isVoid
    const isVoidInline = endInline && endInline.isVoid
    const isVoid = isVoidBlock || isVoidInline

    // If the selection is collapsed, and it isn't inside a void node, abort.
    if (native.isCollapsed && !isVoid) return

    // Create a fake selection so that we can add a Base64-encoded copy of the
    // fragment to the HTML, to decode on future pastes.
    const { fragment } = value
    const encoded = Base64.serializeNode(fragment)
    const range = native.getRangeAt(0)
    let contents = range.cloneContents()
    let attach = contents.childNodes[0]

    // If the end node is a void node, we need to move the end of the range from
    // the void node's spacer span, to the end of the void node's content.
    if (isVoid) {
      const r = range.cloneRange()
      const n = isVoidBlock ? endBlock : endInline
      const node = findDOMNode(n, window)
      r.setEndAfter(node)
      contents = r.cloneContents()
      attach = contents.childNodes[contents.childNodes.length - 1].firstChild
    }

    // COMPAT: in Safari and Chrome when selecting a single marked word,
    // marks are not preserved when copying.
    // If the attatched is not void, and the startKey and endKey is the same,
    // check if there is marks involved. If so, set the range start just before the
    // startText node
    if ((IS_CHROME || IS_SAFARI) && !isVoid && startKey === endKey) {
      const hasMarks = startText.characters
        .slice(value.selection.anchorOffset, value.selection.focusOffset)
        .filter(char => char.marks.size !== 0)
        .size !== 0
      if (hasMarks) {
        const r = range.cloneRange()
        const node = findDOMNode(startText, window)
        r.setStartBefore(node)
        contents = r.cloneContents()
        attach = contents.childNodes[contents.childNodes.length - 1].firstChild
      }
    }

    // Remove any zero-width space spans from the cloned DOM so that they don't
    // show up elsewhere when pasted.
    const zws = [].slice.call(contents.querySelectorAll('[data-slate-zero-width]'))
    zws.forEach(zw => zw.parentNode.removeChild(zw))

    // COMPAT: In Chrome and Safari, if the last element in the selection to
    // copy has `contenteditable="false"` the copy will fail, and nothing will
    // be put in the clipboard. So we remove them all. (2017/05/04)
    if (IS_CHROME || IS_SAFARI) {
      const els = [].slice.call(contents.querySelectorAll('[contenteditable="false"]'))
      els.forEach(el => el.removeAttribute('contenteditable'))
    }

    // Set a `data-slate-fragment` attribute on a non-empty node, so it shows up
    // in the HTML, and can be used for intra-Slate pasting. If it's a text
    // node, wrap it in a `<span>` so we have something to set an attribute on.
    if (attach.nodeType == 3) {
      const span = window.document.createElement('span')

      // COMPAT: In Chrome and Safari, if we don't add the `white-space` style
      // then leading and trailing spaces will be ignored. (2017/09/21)
      span.style.whiteSpace = 'pre'

      span.appendChild(attach)
      contents.appendChild(span)
      attach = span
    }

    attach.setAttribute('data-slate-fragment', encoded)

    // Add the phony content to the DOM, and select it, so it will be copied.
    const body = window.document.querySelector('body')
    const div = window.document.createElement('div')
    div.setAttribute('contenteditable', true)
    div.style.position = 'absolute'
    div.style.left = '-9999px'

    // COMPAT: In Firefox, the viewport jumps to find the phony div, so it
    // should be created at the current scroll offset with `style.top`.
    // The box model attributes which can interact with 'top' are also reset.
    div.style.border = '0px'
    div.style.padding = '0px'
    div.style.margin = '0px'
    div.style.top = `${window.pageYOffset || window.document.documentElement.scrollTop}px`

    div.appendChild(contents)
    body.appendChild(div)

    // COMPAT: In Firefox, trying to use the terser `native.selectAllChildren`
    // throws an error, so we use the older `range` equivalent. (2016/06/21)
    const r = window.document.createRange()
    r.selectNodeContents(div)
    native.removeAllRanges()
    native.addRange(r)

    // Revert to the previous selection right after copying.
    window.requestAnimationFrame(() => {
      body.removeChild(div)
      native.removeAllRanges()
      native.addRange(range)
    })
  }

  /**
   * On drag end.
   *
   * @param {Event} event
   * @param {Change} change
   * @param {Editor} editor
   */

  function onDragEnd(event, change, editor) {
    debug('onDragEnd', { event })

    isDraggingInternally = null
  }

  /**
   * On drag over.
   *
   * @param {Event} event
   * @param {Change} change
   * @param {Editor} editor
   */

  function onDragOver(event, change, editor) {
    debug('onDragOver', { event })

    isDraggingInternally = false
  }

  /**
   * On drag start.
   *
   * @param {Event} event
   * @param {Change} change
   * @param {Editor} editor
   */

  function onDragStart(event, change, editor) {
    debug('onDragStart', { event })

    isDraggingInternally = true

    const { value } = change
    const { document } = value
    const node = findNode(event.target, value)
    const isVoid = node && (node.isVoid || document.hasVoidParent(node.key))

    if (isVoid) {
      const encoded = Base64.serializeNode(node, { preserveKeys: true })
      setEventTransfer(event, 'node', encoded)
    } else {
      const { fragment } = value
      const encoded = Base64.serializeNode(fragment)
      setEventTransfer(event, 'fragment', encoded)
    }
  }

  /**
   * On drop.
   *
   * @param {Event} event
   * @param {Change} change
   * @param {Editor} editor
   */

  function onDrop(event, change, editor) {
    debug('onDrop', { event })

    const { value } = change
    const { document, selection } = value
    const window = getWindow(event.target)
    let target = getEventRange(event, value)
    if (!target) return

    const transfer = getEventTransfer(event)
    const { type, fragment, node, text } = transfer

    change.focus()

    // If the drag is internal and the target is after the selection, it
    // needs to account for the selection's content being deleted.
    if (
      isDraggingInternally &&
      selection.endKey == target.endKey &&
      selection.endOffset < target.endOffset
    ) {
      target = target.move(selection.startKey == selection.endKey
        ? 0 - selection.endOffset + selection.startOffset
        : 0 - selection.endOffset)
    }

    if (isDraggingInternally) {
      change.delete()
    }

    change.select(target)

    if (type == 'text' || type == 'html') {
      const { anchorKey } = target
      let hasVoidParent = document.hasVoidParent(anchorKey)

      if (hasVoidParent) {
        let n = document.getNode(anchorKey)

        while (hasVoidParent) {
          n = document.getNextText(n.key)
          if (!n) break
          hasVoidParent = document.hasVoidParent(n.key)
        }

        if (n) change.collapseToStartOf(n)
      }

      text
        .split('\n')
        .forEach((line, i) => {
          if (i > 0) change.splitBlock()
          change.insertText(line)
        })
    }

    if (type == 'fragment') {
      change.insertFragment(fragment)
    }

    if (type == 'node' && Block.isBlock(node)) {
      change.insertBlock(node).removeNodeByKey(node.key)
    }

    if (type == 'node' && Inline.isInline(node)) {
      change.insertInline(node).removeNodeByKey(node.key)
    }

    // COMPAT: React's onSelect event breaks after an onDrop event
    // has fired in a node: https://github.com/facebook/react/issues/11379.
    // Until this is fixed in React, we dispatch a mouseup event on that
    // DOM node, since that will make it go back to normal.
    const focusNode = document.getNode(target.focusKey)
    const el = findDOMNode(focusNode, window)
    if (!el) return

    el.dispatchEvent(new MouseEvent('mouseup', {
      view: window,
      bubbles: true,
      cancelable: true
    }))
  }

  /**
   * On input.
   *
   * @param {Event} eventvent
   * @param {Change} change
   */

  function onInput(event, change, editor) {
    debug('onInput', { event })

    const window = getWindow(event.target)
    const { value } = change

    // Get the selection point.
    const native = window.getSelection()
    const { anchorNode, anchorOffset } = native
    const point = findPoint(anchorNode, anchorOffset, value)
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

    const leaf = leaves.find((r) => {
      start = end
      end += r.text.length
      if (end >= point.offset) return true
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
    const corrected = selection.collapseToEnd().move(delta)
    const entire = selection.moveAnchorTo(point.key, start).moveFocusTo(point.key, end)

    // Change the current value to have the leaf's text replaced.
    change
      .insertTextAtRange(entire, textContent, leaf.marks)
      .select(corrected)
  }

  /**
   * On key down.
   *
   * @param {Event} event
   * @param {Change} change
   * @param {Editor} editor
   */

  function onKeyDown(event, change, editor) {
    debug('onKeyDown', { event })

    const { value } = change

    if (HOTKEYS.SPLIT_BLOCK(event)) {
      return value.isInVoid
        ? change.collapseToStartOfNextText()
        : change.splitBlock()
    }

    if (HOTKEYS.DELETE_CHAR_BACKWARD(event)) {
      return change.deleteCharBackward()
    }

    if (HOTKEYS.DELETE_CHAR_FORWARD(event)) {
      return change.deleteCharForward()
    }

    if (HOTKEYS.DELETE_LINE_BACKWARD(event)) {
      return change.deleteLineBackward()
    }

    if (HOTKEYS.DELETE_LINE_FORWARD(event)) {
      return change.deleteLineForward()
    }

    if (HOTKEYS.DELETE_WORD_BACKWARD(event)) {
      return change.deleteWordBackward()
    }

    if (HOTKEYS.DELETE_WORD_FORWARD(event)) {
      return change.deleteWordForward()
    }

    if (HOTKEYS.REDO(event)) {
      return change.redo()
    }

    if (HOTKEYS.UNDO(event)) {
      return change.undo()
    }

    // COMPAT: Certain browsers don't handle the selection updates properly. In
    // Chrome, the selection isn't properly extended. And in Firefox, the
    // selection isn't properly collapsed. (2017/10/17)
    if (HOTKEYS.COLLAPSE_LINE_BACKWARD(event)) {
      event.preventDefault()
      return change.collapseLineBackward()
    }

    if (HOTKEYS.COLLAPSE_LINE_FORWARD(event)) {
      event.preventDefault()
      return change.collapseLineForward()
    }

    if (HOTKEYS.EXTEND_LINE_BACKWARD(event)) {
      event.preventDefault()
      return change.extendLineBackward()
    }

    if (HOTKEYS.EXTEND_LINE_FORWARD(event)) {
      event.preventDefault()
      return change.extendLineForward()
    }

    // COMPAT: If a void node is selected, or a zero-width text node adjacent to
    // an inline is selected, we need to handle these hotkeys manually because
    // browsers won't know what to do.
    if (HOTKEYS.COLLAPSE_CHAR_BACKWARD(event)) {
      const { document, isInVoid, previousText, startText } = value
      const isPreviousInVoid = previousText && document.hasVoidParent(previousText.key)
      if (isInVoid || isPreviousInVoid || startText.text == '') {
        event.preventDefault()
        return change.collapseCharBackward()
      }
    }

    if (HOTKEYS.COLLAPSE_CHAR_FORWARD(event)) {
      const { document, isInVoid, nextText, startText } = value
      const isNextInVoid = nextText && document.hasVoidParent(nextText.key)
      if (isInVoid || isNextInVoid || startText.text == '') {
        event.preventDefault()
        return change.collapseCharForward()
      }
    }

    if (HOTKEYS.EXTEND_CHAR_BACKWARD(event)) {
      const { document, isInVoid, previousText, startText } = value
      const isPreviousInVoid = previousText && document.hasVoidParent(previousText.key)
      if (isInVoid || isPreviousInVoid || startText.text == '') {
        event.preventDefault()
        return change.extendCharBackward()
      }
    }

    if (HOTKEYS.EXTEND_CHAR_FORWARD(event)) {
      const { document, isInVoid, nextText, startText } = value
      const isNextInVoid = nextText && document.hasVoidParent(nextText.key)
      if (isInVoid || isNextInVoid || startText.text == '') {
        event.preventDefault()
        return change.extendCharForward()
      }
    }
  }

  /**
   * On paste.
   *
   * @param {Event} event
   * @param {Change} change
   * @param {Editor} editor
   */

  function onPaste(event, change, editor) {
    debug('onPaste', { event })

    const transfer = getEventTransfer(event)
    const { type, fragment, text } = transfer

    if (type == 'fragment') {
      change.insertFragment(fragment)
    }

    if (type == 'text' || type == 'html') {
      if (!text) return
      const { value } = change
      const { document, selection, startBlock } = value
      if (startBlock.isVoid) return

      const defaultBlock = startBlock
      const defaultMarks = document.getMarksAtRange(selection.collapseToStart())
      const frag = Plain.deserialize(text, { defaultBlock, defaultMarks }).document
      change.insertFragment(frag)
    }
  }

  /**
   * On select.
   *
   * @param {Event} event
   * @param {Change} change
   * @param {Editor} editor
   */

  function onSelect(event, change, editor) {
    debug('onSelect', { event })

    const window = getWindow(event.target)
    const { value } = change
    const { document } = value
    const native = window.getSelection()

    // If there are no ranges, the editor was blurred natively.
    if (!native.rangeCount) {
      change.blur()
      return
    }

    // Otherwise, determine the Slate selection from the native one.
    let range = findRange(native, value)
    if (!range) return

    const { anchorKey, anchorOffset, focusKey, focusOffset } = range
    const anchorText = document.getNode(anchorKey)
    const focusText = document.getNode(focusKey)
    const anchorInline = document.getClosestInline(anchorKey)
    const focusInline = document.getClosestInline(focusKey)
    const focusBlock = document.getClosestBlock(focusKey)
    const anchorBlock = document.getClosestBlock(anchorKey)

    // COMPAT: If the anchor point is at the start of a non-void, and the
    // focus point is inside a void node with an offset that isn't `0`, set
    // the focus offset to `0`. This is due to void nodes <span>'s being
    // positioned off screen, resulting in the offset always being greater
    // than `0`. Since we can't know what it really should be, and since an
    // offset of `0` is less destructive because it creates a hanging
    // selection, go with `0`. (2017/09/07)
    if (
      anchorBlock &&
      !anchorBlock.isVoid &&
      anchorOffset == 0 &&
      focusBlock &&
      focusBlock.isVoid &&
      focusOffset != 0
    ) {
      range = range.set('focusOffset', 0)
    }

    // COMPAT: If the selection is at the end of a non-void inline node, and
    // there is a node after it, put it in the node after instead. This
    // standardizes the behavior, since it's indistinguishable to the user.
    if (
      anchorInline &&
      !anchorInline.isVoid &&
      anchorOffset == anchorText.text.length
    ) {
      const block = document.getClosestBlock(anchorKey)
      const next = block.getNextText(anchorKey)
      if (next) range = range.moveAnchorTo(next.key, 0)
    }

    if (
      focusInline &&
      !focusInline.isVoid &&
      focusOffset == focusText.text.length
    ) {
      const block = document.getClosestBlock(focusKey)
      const next = block.getNextText(focusKey)
      if (next) range = range.moveFocusTo(next.key, 0)
    }

    range = range.normalize(document)
    change.select(range)
  }

  /**
   * Render editor.
   *
   * @param {Object} props
   * @param {Editor} editor
   * @return {Object}
   */

  function renderEditor(props, editor) {
    const handlers = EVENT_HANDLERS.reduce((obj, handler) => {
      obj[handler] = editor[handler]
      return obj
    }, {})

    return (
      <Content
        {...handlers}
        autoCorrect={props.autoCorrect}
        autoFocus={props.autoFocus}
        className={props.className}
        children={props.children}
        editor={editor}
        readOnly={props.readOnly}
        role={props.role}
        spellCheck={props.spellCheck}
        style={props.style}
        tabIndex={props.tabIndex}
        tagName={props.tagName}
      />
    )
  }

  /**
   * Render node.
   *
   * @param {Object} props
   * @return {Element}
   */

  function renderNode(props) {
    const { attributes, children, node } = props
    if (node.kind != 'block' && node.kind != 'inline') return
    const Tag = node.kind == 'block' ? 'div' : 'span'
    const style = { position: 'relative' }
    return <Tag {...attributes} style={style}>{children}</Tag>
  }

  /**
   * Render placeholder.
   *
   * @param {Object} props
   * @return {Element}
   */

  function renderPlaceholder(props) {
    const { editor, node } = props
    if (!editor.props.placeholder) return
    if (editor.state.isComposing) return
    if (node.kind != 'block') return
    if (!Text.isTextList(node.nodes)) return
    if (node.text != '') return
    if (editor.value.document.getBlocks().size > 1) return

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
    onCopy,
    onCut,
    onDragEnd,
    onDragOver,
    onDragStart,
    onDrop,
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

export default AfterPlugin
