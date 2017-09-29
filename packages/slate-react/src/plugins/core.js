
import Base64 from 'slate-base64-serializer'
import Debug from 'debug'
import Plain from 'slate-plain-serializer'
import React from 'react'
import getWindow from 'get-window'
import { Block, Inline, coreSchema } from 'slate'

import Content from '../components/content'
import Placeholder from '../components/placeholder'
import getPoint from '../utils/get-point'
import findDOMNode from '../utils/find-dom-node'
import { IS_CHROME, IS_MAC, IS_SAFARI } from '../constants/environment'

/**
 * Debug.
 *
 * @type {Function}
 */

const debug = Debug('slate:core')

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
    placeholderStyle,
  } = options

  /**
   * On before change, enforce the editor's schema.
   *
   * @param {Change} change
   * @param {Editor} schema
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
   * @param {Event} e
   * @param {Object} data
   * @param {Change} change
   * @param {Editor} editor
   */

  function onBeforeInput(e, data, change, editor) {
    debug('onBeforeInput', { data })
    e.preventDefault()

    const { state } = change
    const { selection } = state
    const { anchorKey, anchorOffset, focusKey, focusOffset } = selection

    // COMPAT: In iOS, when using predictive text suggestions, the native
    // selection will be changed to span the existing word, so that the word is
    // replaced. But the `select` fires after the `beforeInput` event, even
    // though the native selection is updated. So we need to manually check if
    // the selection has gotten out of sync, and adjust it if so. (03/18/2017)
    const window = getWindow(e.target)
    const native = window.getSelection()
    const a = getPoint(native.anchorNode, native.anchorOffset, state, editor)
    const f = getPoint(native.focusNode, native.focusOffset, state, editor)
    const hasMismatch = a && f && (
      anchorKey != a.key ||
      anchorOffset != a.offset ||
      focusKey != f.key ||
      focusOffset != f.offset
    )

    if (hasMismatch) {
      change.select({
        anchorKey: a.key,
        anchorOffset: a.offset,
        focusKey: f.key,
        focusOffset: f.offset
      })
    }

    change.insertText(e.data)
  }

  /**
   * On blur.
   *
   * @param {Event} e
   * @param {Object} data
   * @param {Change} change
   */

  function onBlur(e, data, change) {
    debug('onBlur', { data })
    change.blur()
  }

  /**
   * On copy.
   *
   * @param {Event} e
   * @param {Object} data
   * @param {Change} change
   */

  function onCopy(e, data, change) {
    debug('onCopy', data)
    onCutOrCopy(e, data, change)
  }

  /**
   * On cut.
   *
   * @param {Event} e
   * @param {Object} data
   * @param {Change} change
   * @param {Editor} editor
   */

  function onCut(e, data, change, editor) {
    debug('onCut', data)
    onCutOrCopy(e, data, change)
    const window = getWindow(e.target)

    // Once the fake cut content has successfully been added to the clipboard,
    // delete the content in the current selection.
    window.requestAnimationFrame(() => {
      editor.change(t => t.delete())
    })
  }

  /**
   * On cut or copy, create a fake selection so that we can add a Base 64
   * encoded copy of the fragment to the HTML, to decode on future pastes.
   *
   * @param {Event} e
   * @param {Object} data
   * @param {Change} change
   */

  function onCutOrCopy(e, data, change) {
    const window = getWindow(e.target)
    const native = window.getSelection()
    const { state } = change
    const { endBlock, endInline } = state
    const isVoidBlock = endBlock && endBlock.isVoid
    const isVoidInline = endInline && endInline.isVoid
    const isVoid = isVoidBlock || isVoidInline

    // If the selection is collapsed, and it isn't inside a void node, abort.
    if (native.isCollapsed && !isVoid) return

    const { fragment } = data
    const encoded = Base64.serializeNode(fragment)
    const range = native.getRangeAt(0)
    let contents = range.cloneContents()
    let attach = contents.childNodes[0]

    // If the end node is a void node, we need to move the end of the range from
    // the void node's spacer span, to the end of the void node's content.
    if (isVoid) {
      const r = range.cloneRange()
      const node = findDOMNode(isVoidBlock ? endBlock : endInline)
      r.setEndAfter(node)
      contents = r.cloneContents()
      attach = contents.childNodes[contents.childNodes.length - 1].firstChild
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
   * On drop.
   *
   * @param {Event} e
   * @param {Object} data
   * @param {Change} change
   */

  function onDrop(e, data, change) {
    debug('onDrop', { data })

    switch (data.type) {
      case 'text':
      case 'html':
        return onDropText(e, data, change)
      case 'fragment':
        return onDropFragment(e, data, change)
      case 'node':
        return onDropNode(e, data, change)
    }
  }

  /**
   * On drop node, insert the node wherever it is dropped.
   *
   * @param {Event} e
   * @param {Object} data
   * @param {Change} change
   */

  function onDropNode(e, data, change) {
    debug('onDropNode', { data })

    const { state } = change
    const { selection } = state
    let { node, target, isInternal } = data

    // If the drag is internal and the target is after the selection, it
    // needs to account for the selection's content being deleted.
    if (
      isInternal &&
      selection.endKey == target.endKey &&
      selection.endOffset < target.endOffset
    ) {
      target = target.move(selection.startKey == selection.endKey
        ? 0 - selection.endOffset + selection.startOffset
        : 0 - selection.endOffset)
    }

    if (isInternal) {
      change.delete()
    }

    if (Block.isBlock(node)) {
      change
        .select(target)
        .insertBlock(node)
        .removeNodeByKey(node.key)
    }

    if (Inline.isInline(node)) {
      change
        .select(target)
        .insertInline(node)
        .removeNodeByKey(node.key)
    }
  }

  /**
   * On drop fragment.
   *
   * @param {Event} e
   * @param {Object} data
   * @param {Change} change
   */

  function onDropFragment(e, data, change) {
    debug('onDropFragment', { data })

    const { state } = change
    const { selection } = state
    let { fragment, target, isInternal } = data

    // If the drag is internal and the target is after the selection, it
    // needs to account for the selection's content being deleted.
    if (
      isInternal &&
      selection.endKey == target.endKey &&
      selection.endOffset < target.endOffset
    ) {
      target = target.move(selection.startKey == selection.endKey
        ? 0 - selection.endOffset + selection.startOffset
        : 0 - selection.endOffset)
    }

    if (isInternal) {
      change.delete()
    }

    change
      .select(target)
      .insertFragment(fragment)
  }

  /**
   * On drop text, split the blocks at new lines.
   *
   * @param {Event} e
   * @param {Object} data
   * @param {Change} change
   */

  function onDropText(e, data, change) {
    debug('onDropText', { data })

    const { state } = change
    const { document } = state
    const { text, target } = data
    const { anchorKey } = target

    change.select(target)

    let hasVoidParent = document.hasVoidParent(anchorKey)

    // Insert text into nearest text node
    if (hasVoidParent) {
      let node = document.getNode(anchorKey)

      while (hasVoidParent) {
        node = document.getNextText(node.key)
        if (!node) break
        hasVoidParent = document.hasVoidParent(node.key)
      }

      if (node) change.collapseToStartOf(node)
    }

    text
      .split('\n')
      .forEach((line, i) => {
        if (i > 0) change.splitBlock()
        change.insertText(line)
      })
  }

  /**
   * On key down.
   *
   * @param {Event} e
   * @param {Object} data
   * @param {Change} change
   */

  function onKeyDown(e, data, change) {
    debug('onKeyDown', { data })

    switch (data.key) {
      case 'enter': return onKeyDownEnter(e, data, change)
      case 'backspace': return onKeyDownBackspace(e, data, change)
      case 'delete': return onKeyDownDelete(e, data, change)
      case 'left': return onKeyDownLeft(e, data, change)
      case 'right': return onKeyDownRight(e, data, change)
      case 'up': return onKeyDownUp(e, data, change)
      case 'down': return onKeyDownDown(e, data, change)
      case 'd': return onKeyDownD(e, data, change)
      case 'h': return onKeyDownH(e, data, change)
      case 'k': return onKeyDownK(e, data, change)
      case 'y': return onKeyDownY(e, data, change)
      case 'z': return onKeyDownZ(e, data, change)
    }
  }

  /**
   * On `enter` key down, split the current block in half.
   *
   * @param {Event} e
   * @param {Object} data
   * @param {Change} change
   */

  function onKeyDownEnter(e, data, change) {
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
   * @param {Event} e
   * @param {Object} data
   * @param {Change} change
   */

  function onKeyDownBackspace(e, data, change) {
    let boundary = 'Char'
    if (data.isWord) boundary = 'Word'
    if (data.isLine) boundary = 'Line'
    change[`delete${boundary}Backward`]()
  }

  /**
   * On `delete` key down, delete forwards.
   *
   * @param {Event} e
   * @param {Object} data
   * @param {Change} change
   */

  function onKeyDownDelete(e, data, change) {
    let boundary = 'Char'
    if (data.isWord) boundary = 'Word'
    if (data.isLine) boundary = 'Line'
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
   * @param {Event} e
   * @param {Object} data
   * @param {Change} change
   */

  function onKeyDownLeft(e, data, change) {
    const { state } = change

    if (data.isCtrl) return
    if (data.isAlt) return
    if (state.isExpanded) return

    const { document, startKey, startText } = state
    const hasVoidParent = document.hasVoidParent(startKey)

    // If the current text node is empty, or we're inside a void parent, we're
    // going to need to handle the selection behavior.
    if (startText.text == '' || hasVoidParent) {
      e.preventDefault()
      const previous = document.getPreviousText(startKey)

      // If there's no previous text node in the document, abort.
      if (!previous) return

      // If the previous text is in the current block, and inside a non-void
      // inline node, move one character into the inline node.
      const { startBlock } = state
      const previousBlock = document.getClosestBlock(previous.key)
      const previousInline = document.getClosestInline(previous.key)

      if (previousBlock === startBlock && previousInline && !previousInline.isVoid) {
        const extendOrMove = data.isShift ? 'extend' : 'move'
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
   * @param {Event} e
   * @param {Object} data
   * @param {Change} change
   */

  function onKeyDownRight(e, data, change) {
    const { state } = change

    if (data.isCtrl) return
    if (data.isAlt) return
    if (state.isExpanded) return

    const { document, startKey, startText } = state
    const hasVoidParent = document.hasVoidParent(startKey)

    // If the current text node is empty, or we're inside a void parent, we're
    // going to need to handle the selection behavior.
    if (startText.text == '' || hasVoidParent) {
      e.preventDefault()
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
        const extendOrMove = data.isShift ? 'extend' : 'move'
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
   * @param {Event} e
   * @param {Object} data
   * @param {Change} change
   */

  function onKeyDownUp(e, data, change) {
    if (!IS_MAC || data.isCtrl || !data.isAlt) return

    const { state } = change
    const { selection, document, focusKey, focusBlock } = state
    const transform = data.isShift ? 'extendToStartOf' : 'collapseToStartOf'
    const block = selection.hasFocusAtStartOf(focusBlock)
      ? document.getPreviousBlock(focusKey)
      : focusBlock

    if (!block) return
    const text = block.getFirstText()

    e.preventDefault()
    change[transform](text)
  }

  /**
   * On `down` key down, for Macs, move the selection to end of the block.
   *
   * COMPAT: Certain browsers don't handle the selection updates properly. In
   * Chrome, option-shift-down doesn't properly extend the selection. And in
   * Firefox, option-down doesn't properly move the selection.
   *
   * @param {Event} e
   * @param {Object} data
   * @param {Change} change
   */

  function onKeyDownDown(e, data, change) {
    if (!IS_MAC || data.isCtrl || !data.isAlt) return

    const { state } = change
    const { selection, document, focusKey, focusBlock } = state
    const transform = data.isShift ? 'extendToEndOf' : 'collapseToEndOf'
    const block = selection.hasFocusAtEndOf(focusBlock)
      ? document.getNextBlock(focusKey)
      : focusBlock

    if (!block) return
    const text = block.getLastText()

    e.preventDefault()
    change[transform](text)
  }

  /**
   * On `d` key down, for Macs, delete one character forward.
   *
   * @param {Event} e
   * @param {Object} data
   * @param {Change} change
   */

  function onKeyDownD(e, data, change) {
    if (!IS_MAC || !data.isCtrl) return
    e.preventDefault()
    change.deleteCharForward()
  }

  /**
   * On `h` key down, for Macs, delete until the end of the line.
   *
   * @param {Event} e
   * @param {Object} data
   * @param {Change} change
   */

  function onKeyDownH(e, data, change) {
    if (!IS_MAC || !data.isCtrl) return
    e.preventDefault()
    change.deleteCharBackward()
  }

  /**
   * On `k` key down, for Macs, delete until the end of the line.
   *
   * @param {Event} e
   * @param {Object} data
   * @param {Change} change
   */

  function onKeyDownK(e, data, change) {
    if (!IS_MAC || !data.isCtrl) return
    e.preventDefault()
    change.deleteLineForward()
  }

  /**
   * On `y` key down, redo.
   *
   * @param {Event} e
   * @param {Object} data
   * @param {Change} change
   */

  function onKeyDownY(e, data, change) {
    if (!data.isMod) return
    change.redo()
  }

  /**
   * On `z` key down, undo or redo.
   *
   * @param {Event} e
   * @param {Object} data
   * @param {Change} change
   */

  function onKeyDownZ(e, data, change) {
    if (!data.isMod) return
    change[data.isShift ? 'redo' : 'undo']()
  }

  /**
   * On paste.
   *
   * @param {Event} e
   * @param {Object} data
   * @param {Change} change
   */

  function onPaste(e, data, change) {
    debug('onPaste', { data })

    switch (data.type) {
      case 'fragment':
        return onPasteFragment(e, data, change)
      case 'text':
      case 'html':
        return onPasteText(e, data, change)
    }
  }

  /**
   * On paste fragment.
   *
   * @param {Event} e
   * @param {Object} data
   * @param {Change} change
   */

  function onPasteFragment(e, data, change) {
    debug('onPasteFragment', { data })
    change.insertFragment(data.fragment)
  }

  /**
   * On paste text, split blocks at new lines.
   *
   * @param {Event} e
   * @param {Object} data
   * @param {Change} change
   */

  function onPasteText(e, data, change) {
    debug('onPasteText', { data })

    const { state } = change
    const { document, selection, startBlock } = state
    if (startBlock.isVoid) return

    const { text } = data
    const defaultBlock = startBlock
    const defaultMarks = document.getMarksAtRange(selection.collapseToStart())
    const fragment = Plain.deserialize(text, { defaultBlock, defaultMarks }).document
    change.insertFragment(fragment)
  }

  /**
   * On select.
   *
   * @param {Event} e
   * @param {Object} data
   * @param {Change} change
   */

  function onSelect(e, data, change) {
    debug('onSelect', { data })
    change.select(data.selection)
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
    return (
      <Content
        autoCorrect={props.autoCorrect}
        autoFocus={props.autoFocus}
        className={props.className}
        children={props.children}
        editor={editor}
        onBeforeInput={editor.onBeforeInput}
        onBlur={editor.onBlur}
        onFocus={editor.onFocus}
        onCopy={editor.onCopy}
        onCut={editor.onCut}
        onDrop={editor.onDrop}
        onKeyDown={editor.onKeyDown}
        onKeyUp={editor.onKeyUp}
        onPaste={editor.onPaste}
        onSelect={editor.onSelect}
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
   * Return the core plugin.
   *
   * @type {Object}
   */

  return {
    onBeforeChange,
    onBeforeInput,
    onBlur,
    onCopy,
    onCut,
    onDrop,
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

export default Plugin
