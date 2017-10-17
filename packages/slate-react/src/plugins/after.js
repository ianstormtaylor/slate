
import Base64 from 'slate-base64-serializer'
import Debug from 'debug'
import Plain from 'slate-plain-serializer'
import React from 'react'
import getWindow from 'get-window'
import { Block, Inline, coreSchema } from 'slate'

import EVENT_HANDLERS from '../constants/event-handlers'
import HOTKEYS from '../constants/hotkeys'
import Content from '../components/content'
import Placeholder from '../components/placeholder'
import findDOMNode from '../utils/find-dom-node'
import findPoint from '../utils/find-point'
import findRange from '../utils/find-range'
import getEventRange from '../utils/get-event-range'
import getEventTransfer from '../utils/get-event-transfer'
import { IS_CHROME, IS_MAC, IS_SAFARI } from '../constants/environment'

/**
 * Debug.
 *
 * @type {Function}
 */

const debug = Debug('slate:core:after')

/**
 * The after plugin.
 *
 * @param {Object} options
 *   @property {Element} placeholder
 *   @property {String} placeholderClassName
 *   @property {Object} placeholderStyle
 * @return {Object}
 */

function AfterPlugin(options = {}) {
  const {
    placeholder,
    placeholderClassName,
    placeholderStyle,
  } = options

  let isDraggingInternally = null

  /**
   * On before change, enforce the editor's schema.
   *
   * @param {Change} change
   * @param {Editor} editor
   */

  function onBeforeChange(change, editor) {
    const { state } = change
    const schema = editor.getSchema()
    const prevState = editor.getState()

    // PERF: Skip normalizing if the document hasn't changed, since schemas only
    // normalize changes to the document, not selection.
    if (prevState && state.document == prevState.document) return

    change.normalize(coreSchema)
    change.normalize(schema)
    debug('onBeforeChange')
  }

  /**
   * On before input, correct any browser inconsistencies.
   *
   * @param {Event} event
   * @param {Object} data
   * @param {Change} change
   */

  function onBeforeInput(event, data, change) {
    debug('onBeforeInput', { data })
    event.preventDefault()
    change.insertText(event.data)
  }

  /**
   * On blur.
   *
   * @param {Event} event
   * @param {Object} data
   * @param {Change} change
   */

  function onBlur(event, data, change) {
    debug('onBlur', { data })
    change.blur()
  }

  /**
   * On copy.
   *
   * @param {Event} event
   * @param {Object} data
   * @param {Change} change
   */

  function onCopy(event, data, change) {
    debug('onCopy', data)
    onCutOrCopy(event, data, change)
  }

  /**
   * On cut.
   *
   * @param {Event} event
   * @param {Object} data
   * @param {Change} change
   * @param {Editor} editor
   */

  function onCut(event, data, change, editor) {
    debug('onCut', data)
    onCutOrCopy(event, data, change)
    const window = getWindow(event.target)

    // Once the fake cut content has successfully been added to the clipboard,
    // delete the content in the current selection.
    window.requestAnimationFrame(() => {
      editor.change(c => c.delete())
    })
  }

  /**
   * On cut or copy.
   *
   * @param {Event} event
   * @param {Object} data
   * @param {Change} change
   */

  function onCutOrCopy(event, data, change) {
    const window = getWindow(event.target)
    const native = window.getSelection()
    const { state } = change
    const { startKey, endKey, startText, endBlock, endInline } = state
    const isVoidBlock = endBlock && endBlock.isVoid
    const isVoidInline = endInline && endInline.isVoid
    const isVoid = isVoidBlock || isVoidInline

    // If the selection is collapsed, and it isn't inside a void node, abort.
    if (native.isCollapsed && !isVoid) return

    // Create a fake selection so that we can add a Base64-encoded copy of the
    // fragment to the HTML, to decode on future pastes.
    const { fragment } = state
    const encoded = Base64.serializeNode(fragment)
    const range = native.getRangeAt(0)
    let contents = range.cloneContents()
    let attach = contents.childNodes[0]

    // If the end node is a void node, we need to move the end of the range from
    // the void node's spacer span, to the end of the void node's content.
    if (isVoid) {
      const r = range.cloneRange()
      const n = isVoidBlock ? endBlock : endInline
      const node = findDOMNode(n)
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
        .slice(state.selection.anchorOffset, state.selection.focusOffset)
        .filter(char => char.marks.size !== 0)
        .size !== 0
      if (hasMarks) {
        const r = range.cloneRange()
        const node = findDOMNode(startText)
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
   * @param {Object} data
   * @param {Change} change
   * @param {Editor} editor
   */

  function onDragEnd(event, data, change, editor) {
    debug('onDragEnd', { event })

    isDraggingInternally = null
  }

  /**
   * On drag over.
   *
   * @param {Event} event
   * @param {Object} data
   * @param {Change} change
   * @param {Editor} editor
   */

  function onDragOver(event, data, change, editor) {
    debug('onDragOver', { event })

    isDraggingInternally = false
  }

  /**
   * On drag start.
   *
   * @param {Event} event
   * @param {Object} data
   * @param {Change} change
   * @param {Editor} editor
   */

  function onDragStart(event, data, change, editor) {
    debug('onDragStart', { event })

    isDraggingInternally = true
  }

  /**
   * On drop.
   *
   * @param {Event} event
   * @param {Object} data
   * @param {Change} change
   */

  function onDrop(event, data, change, editor) {
    debug('onDrop', { event })

    const { state } = change
    const { selection } = state
    let target = getEventRange(event, state)
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
  }

  /**
   * On input.
   *
   * @param {Event} eventvent
   * @param {Object} data
   * @param {Change} change
   * @param {Editor} editor
   */

  function onInput(event, data, change, editor) {
    const window = getWindow(event.target)
    const { state } = change

    // Get the selection point.
    const native = window.getSelection()
    const { anchorNode, anchorOffset } = native
    const point = findPoint(anchorNode, anchorOffset, state)
    if (!point) return

    // Get the text node and leaf in question.
    const { document, selection } = state
    const node = document.getDescendant(point.key)
    const leaves = node.getLeaves()
    let start = 0
    let end = 0

    const leaf = leaves.find((r) => {
      end += r.text.length
      if (end >= point.offset) return true
      start = end
    })

    // Get the text information.
    const { text } = leaf
    let { textContent } = anchorNode
    const block = document.getClosestBlock(node.key)
    const lastText = block.getLastText()
    const lastLeaf = leaves.last()
    const lastChar = textContent.charAt(textContent.length - 1)
    const isLastText = node == lastText
    const isLastLeaf = leaf == lastLeaf

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

    // Change the current state to have the leaf's text replaced.
    change
      .select(entire)
      .delete()
      .insertText(textContent, leaf.marks)
      .select(corrected)
  }

  /**
   * On key down.
   *
   * @param {Event} event
   * @param {Object} data
   * @param {Change} change
   */

  function onKeyDown(event, data, change) {
    debug('onKeyDown', { data })

    switch (event.key) {
      case 'Enter': return onKeyDownEnter(event, data, change)
      case 'Backspace': return onKeyDownBackspace(event, data, change)
      case 'Delete': return onKeyDownDelete(event, data, change)
      case 'ArrowLeft': return onKeyDownLeft(event, data, change)
      case 'ArrowRight': return onKeyDownRight(event, data, change)
      case 'ArrowUp': return onKeyDownUp(event, data, change)
      case 'ArrowDown': return onKeyDownDown(event, data, change)
    }

    if (HOTKEYS.DELETE_CHAR_BACKWARD(event)) {
      change.deleteCharBackward()
    }

    if (HOTKEYS.DELETE_CHAR_FORWARD(event)) {
      change.deleteCharForward()
    }

    if (HOTKEYS.DELETE_LINE_FORWARD(event)) {
      change.deleteLineForward()
    }

    if (HOTKEYS.REDO(event)) {
      change.redo()
    }

    if (HOTKEYS.UNDO(event)) {
      change.undo()
    }
  }

  /**
   * On `enter` key down, split the current block in half.
   *
   * @param {Event} event
   * @param {Object} data
   * @param {Change} change
   */

  function onKeyDownEnter(event, data, change) {
    const { state } = change
    const { document, startKey } = state
    const hasVoidParent = document.hasVoidParent(startKey)

    // For void nodes, we don't want to split. Instead we just move to the start
    // of the next text node if one exists.
    if (hasVoidParent) {
      const text = document.getNextText(startKey)
      if (!text) return
      change.collapseToStartOf(text)
      return
    }

    change.splitBlock()
  }

  /**
   * On `backspace` key down, delete backwards.
   *
   * @param {Event} event
   * @param {Object} data
   * @param {Change} change
   */

  function onKeyDownBackspace(event, data, change) {
    const isWord = IS_MAC ? event.altKey : event.ctrlKey
    const isLine = IS_MAC ? event.metaKey : false

    let boundary = 'Char'
    if (isWord) boundary = 'Word'
    if (isLine) boundary = 'Line'

    change[`delete${boundary}Backward`]()
  }

  /**
   * On `delete` key down, delete forwards.
   *
   * @param {Event} event
   * @param {Object} data
   * @param {Change} change
   */

  function onKeyDownDelete(event, data, change) {
    const isWord = IS_MAC ? event.altKey : event.ctrlKey
    const isLine = IS_MAC ? event.metaKey : false

    let boundary = 'Char'
    if (isWord) boundary = 'Word'
    if (isLine) boundary = 'Line'

    change[`delete${boundary}Forward`]()
  }

  /**
   * On `left` key down, move backward.
   *
   * COMPAT: This is required to make navigating with the left arrow work when
   * a void node is selected.
   *
   * COMPAT: This is also required to solve for the case where an inline node is
   * surrounded by empty text nodes with zero-width spaces in them. Without this
   * the zero-width spaces will cause two arrow keys to jump to the next text.
   *
   * @param {Event} event
   * @param {Object} data
   * @param {Change} change
   */

  function onKeyDownLeft(event, data, change) {
    const { state } = change

    if (event.ctrlKey) return
    if (event.altKey) return
    if (state.isExpanded) return

    const { document, startKey, startText } = state
    const hasVoidParent = document.hasVoidParent(startKey)

    // If the current text node is empty, or we're inside a void parent, we're
    // going to need to handle the selection behavior.
    if (startText.text == '' || hasVoidParent) {
      event.preventDefault()
      const previous = document.getPreviousText(startKey)

      // If there's no previous text node in the document, abort.
      if (!previous) return

      // If the previous text is in the current block, and inside a non-void
      // inline node, move one character into the inline node.
      const { startBlock } = state
      const previousBlock = document.getClosestBlock(previous.key)
      const previousInline = document.getClosestInline(previous.key)

      if (previousBlock === startBlock && previousInline && !previousInline.isVoid) {
        const extendOrMove = event.shiftKey ? 'extend' : 'move'
        change.collapseToEndOf(previous)[extendOrMove](-1)
        return
      }

      // Otherwise, move to the end of the previous node.
      change.collapseToEndOf(previous)
    }
  }

  /**
   * On `right` key down, move forward.
   *
   * COMPAT: This is required to make navigating with the right arrow work when
   * a void node is selected.
   *
   * COMPAT: This is also required to solve for the case where an inline node is
   * surrounded by empty text nodes with zero-width spaces in them. Without this
   * the zero-width spaces will cause two arrow keys to jump to the next text.
   *
   * COMPAT: In Chrome & Safari, selections that are at the zero offset of
   * an inline node will be automatically replaced to be at the last offset
   * of a previous inline node, which screws us up, so we never want to set the
   * selection to the very start of an inline node here. (2016/11/29)
   *
   * @param {Event} event
   * @param {Object} data
   * @param {Change} change
   */

  function onKeyDownRight(event, data, change) {
    const { state } = change

    if (event.ctrlKey) return
    if (event.altKey) return
    if (state.isExpanded) return

    const { document, startKey, startText } = state
    const hasVoidParent = document.hasVoidParent(startKey)

    // If the current text node is empty, or we're inside a void parent, we're
    // going to need to handle the selection behavior.
    if (startText.text == '' || hasVoidParent) {
      event.preventDefault()
      const next = document.getNextText(startKey)

      // If there's no next text node in the document, abort.
      if (!next) return

      // If the next text is inside a void node, move to the end of it.
      if (document.hasVoidParent(next.key)) {
        change.collapseToEndOf(next)
        return
      }

      // If the next text is in the current block, and inside an inline node,
      // move one character into the inline node.
      const { startBlock } = state
      const nextBlock = document.getClosestBlock(next.key)
      const nextInline = document.getClosestInline(next.key)

      if (nextBlock == startBlock && nextInline) {
        const extendOrMove = event.shiftKey ? 'extend' : 'move'
        change.collapseToStartOf(next)[extendOrMove](1)
        return
      }

      // Otherwise, move to the start of the next text node.
      change.collapseToStartOf(next)
    }
  }

  /**
   * On `up` key down, for Macs, move the selection to start of the block.
   *
   * COMPAT: Certain browsers don't handle the selection updates properly. In
   * Chrome, option-shift-up doesn't properly extend the selection. And in
   * Firefox, option-up doesn't properly move the selection.
   *
   * @param {Event} event
   * @param {Object} data
   * @param {Change} change
   */

  function onKeyDownUp(event, data, change) {
    if (!IS_MAC || event.ctrlKey || !event.altKey) return

    const { state } = change
    const { selection, document, focusKey, focusBlock } = state
    const transform = event.shiftKey ? 'extendToStartOf' : 'collapseToStartOf'
    const block = selection.hasFocusAtStartOf(focusBlock)
      ? document.getPreviousBlock(focusKey)
      : focusBlock

    if (!block) return
    const text = block.getFirstText()

    event.preventDefault()
    change[transform](text)
  }

  /**
   * On `down` key down, for Macs, move the selection to end of the block.
   *
   * COMPAT: Certain browsers don't handle the selection updates properly. In
   * Chrome, option-shift-down doesn't properly extend the selection. And in
   * Firefox, option-down doesn't properly move the selection.
   *
   * @param {Event} event
   * @param {Object} data
   * @param {Change} change
   */

  function onKeyDownDown(event, data, change) {
    if (!IS_MAC || event.ctrlKey || !event.altKey) return

    const { state } = change
    const { selection, document, focusKey, focusBlock } = state
    const transform = event.shiftKey ? 'extendToEndOf' : 'collapseToEndOf'
    const block = selection.hasFocusAtEndOf(focusBlock)
      ? document.getNextBlock(focusKey)
      : focusBlock

    if (!block) return
    const text = block.getLastText()

    event.preventDefault()
    change[transform](text)
  }

  /**
   * On paste.
   *
   * @param {Event} event
   * @param {Object} data
   * @param {Change} change
   */

  function onPaste(event, data, change) {
    debug('onPaste', { data })

    const transfer = getEventTransfer(event)
    const { type, fragment, text } = transfer

    if (type == 'fragment') {
      change.insertFragment(fragment)
    }

    if (type == 'text' || type == 'html') {
      const { state } = change
      const { document, selection, startBlock } = state
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
   * @param {Object} data
   * @param {Change} change
   */

  function onSelect(event, data, change) {
    debug('onSelect', { data })

    const window = getWindow(event.target)
    const { state } = change
    const { document } = state
    const native = window.getSelection()

    // If there are no ranges, the editor was blurred natively.
    if (!native.rangeCount) {
      change.blur()
      return
    }

    // Otherwise, determine the Slate selection from the native one.
    let range = findRange(native, state)
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
   * Render.
   *
   * @param {Object} props
   * @param {State} state
   * @param {Editor} editor
   * @return {Object}
   */

  function render(props, state, editor) {
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
        schema={editor.getSchema()}
        spellCheck={props.spellCheck}
        state={state}
        style={props.style}
        tabIndex={props.tabIndex}
        tagName={props.tagName}
      />
    )
  }

  /**
   * A default schema rule to render block nodes.
   *
   * @type {Object}
   */

  const BLOCK_RENDER_RULE = {
    match: (node) => {
      return node.kind == 'block'
    },
    render: (props) => {
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
  }

  /**
   * A default schema rule to render inline nodes.
   *
   * @type {Object}
   */

  const INLINE_RENDER_RULE = {
    match: (node) => {
      return node.kind == 'inline'
    },
    render: (props) => {
      return (
        <span {...props.attributes} style={{ position: 'relative' }}>
          {props.children}
        </span>
      )
    }
  }

  /**
   * Add default rendering rules to the schema.
   *
   * @type {Object}
   */

  const schema = {
    rules: [
      BLOCK_RENDER_RULE,
      INLINE_RENDER_RULE
    ]
  }

  /**
   * Return the plugin.
   *
   * @type {Object}
   */

  return {
    onBeforeChange,
    onBeforeInput,
    onBlur,
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
    render,
    schema,
  }
}

/**
 * Export.
 *
 * @type {Object}
 */

export default AfterPlugin
