
import Base64 from '../serializers/base-64'
import Content from '../components/content'
import Character from '../models/character'
import Debug from 'debug'
import getPoint from '../utils/get-point'
import Placeholder from '../components/placeholder'
import React from 'react'
import getWindow from 'get-window'
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
   * @param {State} state
   * @param {Editor} schema
   * @return {State}
   */

  function onBeforeChange(state, editor) {
    // Don't normalize with plugins schema when typing text in native mode
    if (state.isNative) return state

    const schema = editor.getSchema()
    const prevState = editor.getState()

    // Since schema can only normalize the document, we avoid creating
    // a transform and normalize the selection if the document is the same
    if (prevState && state.document == prevState.document) return state

    const newState = state.transform()
      .normalize(schema)
      .apply({ merge: true })

    debug('onBeforeChange')
    return newState
  }

  /**
   * On before input, see if we can let the browser continue with it's native
   * input behavior, to avoid a re-render for performance.
   *
   * @param {Event} e
   * @param {Object} data
   * @param {State} state
   * @param {Editor} editor
   * @return {State}
   */

  function onBeforeInput(e, data, state, editor) {
    const { document, startKey, startBlock, startOffset, startInline, startText } = state
    const pText = startBlock.getPreviousText(startKey)
    const pInline = pText && startBlock.getClosestInline(pText.key)
    const nText = startBlock.getNextText(startKey)
    const nInline = nText && startBlock.getClosestInline(nText.key)

    // Determine what the characters would be if natively inserted.
    const schema = editor.getSchema()
    const decorators = document.getDescendantDecorators(startKey, schema)
    const initialChars = startText.getDecorations(decorators)
    const prevChar = startOffset === 0 ? null : initialChars.get(startOffset - 1)
    const nextChar = startOffset === initialChars.size ? null : initialChars.get(startOffset)
    const char = Character.create({
      text: e.data,
      // When cursor is at start of a range of marks, without preceding text,
      // the native behavior is to insert inside the range of marks.
      marks: (
        (prevChar && prevChar.marks) ||
        (nextChar && nextChar.marks) ||
        []
      )
    })

    const chars = initialChars.insert(startOffset, char)

    let transform = state.transform()

    // COMPAT: In iOS, when choosing from the predictive text suggestions, the
    // native selection will be changed to span the existing word, so that the word
    // is replaced. But the `select` event for this change doesn't fire until after
    // the `beforeInput` event, even though the native selection is updated. So we
    // need to manually adjust the selection to be in sync. (03/18/2017)
    const window = getWindow(e.target)
    const native = window.getSelection()
    const { anchorNode, anchorOffset, focusNode, focusOffset } = native
    const anchorPoint = getPoint(anchorNode, anchorOffset, state, editor)
    const focusPoint = getPoint(focusNode, focusOffset, state, editor)
    if (anchorPoint && focusPoint) {
      const { selection } = state
      if (
        selection.anchorKey !== anchorPoint.key ||
        selection.anchorOffset !== anchorPoint.offset ||
        selection.focusKey !== focusPoint.key ||
        selection.focusOffset !== focusPoint.offset
      ) {
        transform = transform
          .select({
            anchorKey: anchorPoint.key,
            anchorOffset: anchorPoint.offset,
            focusKey: focusPoint.key,
            focusOffset: focusPoint.offset
          })
      }
    }

    // Determine what the characters should be, if not natively inserted.
    let next = transform
      .insertText(e.data)
      .apply()

    const nextText = next.startText
    const nextChars = nextText.getDecorations(decorators)

    // We do not have to re-render if the current selection is collapsed, the
    // current node is not empty, there are no marks on the cursor, the cursor
    // is not at the edge of an inline node, the cursor isn't at the starting
    // edge of a text node after an inline node, and the natively inserted
    // characters would be the same as the non-native.
    const isNative = (
      // If the selection is expanded, we don't know what the edit will look
      // like so we can't let it happen natively.
      (state.isCollapsed) &&
      // If the selection has marks, then we need to render it non-natively
      // because we need to create the new marks as well.
      (state.selection.marks == null) &&
      // If the text node in question has no content, browsers might do weird
      // things so we need to insert it normally instead.
      (state.startText.text != '') &&
      // COMPAT: Browsers do weird things when typing at the edges of inline
      // nodes, so we can't let them render natively. (?)
      (!startInline || !state.selection.isAtStartOf(startInline)) &&
      (!startInline || !state.selection.isAtEndOf(startInline)) &&
      // COMPAT: In Chrome & Safari, it isn't possible to have a selection at
      // the starting edge of a text node after another inline node. It will
      // have been automatically changed. So we can't render natively because
      // the cursor isn't technique in the right spot. (2016/12/01)
      (!(pInline && !pInline.isVoid && startOffset == 0)) &&
      (!(nInline && !nInline.isVoid && startOffset == startText.length)) &&
      // COMPAT: When inserting a Space character, Chrome will sometimes
      // split the text node into two adjacent text nodes. See:
      // https://github.com/ianstormtaylor/slate/issues/938
      (!(e.data === ' ' && IS_CHROME)) &&
      // If the
      (chars.equals(nextChars))
    )

    // Add the `isNative` flag directly, so we don't have to re-transform.
    if (isNative) {
      next = next.set('isNative', isNative)
    }

    // If not native, prevent default so that the DOM remains untouched.
    if (!isNative) e.preventDefault()

    debug('onBeforeInput', { data, isNative })
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
    debug('onBlur', { data })
    return state
      .transform()
      .blur()
      .apply()
  }

  /**
   * On copy.
   *
   * @param {Event} e
   * @param {Object} data
   * @param {State} state
   * @return {State}
   */

  function onCopy(e, data, state) {
    debug('onCopy', data)
    onCutOrCopy(e, data, state)
  }

  /**
   * On cut.
   *
   * @param {Event} e
   * @param {Object} data
   * @param {State} state
   * @param {Editor} editor
   * @return {State}
   */

  function onCut(e, data, state, editor) {
    debug('onCut', data)
    onCutOrCopy(e, data, state)
    const window = getWindow(e.target)

    // Once the fake cut content has successfully been added to the clipboard,
    // delete the content in the current selection.
    window.requestAnimationFrame(() => {
      const next = editor
        .getState()
        .transform()
        .delete()
        .apply()

      editor.onChange(next)
    })
  }

  /**
   * On cut or copy, create a fake selection so that we can add a Base 64
   * encoded copy of the fragment to the HTML, to decode on future pastes.
   *
   * @param {Event} e
   * @param {Object} data
   * @param {State} state
   * @return {State}
   */

  function onCutOrCopy(e, data, state) {
    const window = getWindow(e.target)
    const native = window.getSelection()
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
   * @param {State} state
   * @return {State}
   */

  function onDrop(e, data, state) {
    debug('onDrop', { data })

    switch (data.type) {
      case 'text':
      case 'html':
        return onDropText(e, data, state)
      case 'fragment':
        return onDropFragment(e, data, state)
      case 'node':
        return onDropNode(e, data, state)
    }
  }

  /**
   * On drop node, insert the node wherever it is dropped.
   *
   * @param {Event} e
   * @param {Object} data
   * @param {State} state
   * @return {State}
   */

  function onDropNode(e, data, state) {
    debug('onDropNode', { data })

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
        ? 0 - selection.endOffset - selection.startOffset
        : 0 - selection.endOffset)
    }

    const transform = state.transform()

    if (isInternal) transform.delete()

    return transform
      .select(target)
      .insertBlock(node)
      .removeNodeByKey(node.key)
      .apply()
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
    debug('onDropFragment', { data })

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
        ? 0 - selection.endOffset - selection.startOffset
        : 0 - selection.endOffset)
    }

    const transform = state.transform()

    if (isInternal) transform.delete()

    return transform
      .select(target)
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
    debug('onDropText', { data })

    const { text, target } = data
    const { document } = state
    const transform = state
      .transform()
      .select(target)

    let hasVoidParent = document.hasVoidParent(target.anchorKey)

    // Insert text into nearest text node
    if (hasVoidParent) {
      let node = document.getNode(target.anchorKey)

      while (hasVoidParent) {
        node = document.getNextText(node.key)
        if (!node) break
        hasVoidParent = document.hasVoidParent(node.key)
      }

      if (node) transform.collapseToStartOf(node)
    }

    text
      .split('\n')
      .forEach((line, i) => {
        if (i > 0) transform.splitBlock()
        transform.insertText(line)
      })

    return transform.apply()
  }

  /**
   * On key down.
   *
   * @param {Event} e
   * @param {Object} data
   * @param {State} state
   * @return {State}
   */

  function onKeyDown(e, data, state) {
    debug('onKeyDown', { data })

    switch (data.key) {
      case 'enter': return onKeyDownEnter(e, data, state)
      case 'backspace': return onKeyDownBackspace(e, data, state)
      case 'delete': return onKeyDownDelete(e, data, state)
      case 'left': return onKeyDownLeft(e, data, state)
      case 'right': return onKeyDownRight(e, data, state)
      case 'up': return onKeyDownUp(e, data, state)
      case 'down': return onKeyDownDown(e, data, state)
      case 'd': return onKeyDownD(e, data, state)
      case 'h': return onKeyDownH(e, data, state)
      case 'k': return onKeyDownK(e, data, state)
      case 'y': return onKeyDownY(e, data, state)
      case 'z': return onKeyDownZ(e, data, state)
    }
  }

  /**
   * On `enter` key down, split the current block in half.
   *
   * @param {Event} e
   * @param {Object} data
   * @param {State} state
   * @return {State}
   */

  function onKeyDownEnter(e, data, state) {
    const { document, startKey } = state
    const hasVoidParent = document.hasVoidParent(startKey)

    // For void nodes, we don't want to split. Instead we just move to the start
    // of the next text node if one exists.
    if (hasVoidParent) {
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
   * @param {Object} data
   * @param {State} state
   * @return {State}
   */

  function onKeyDownBackspace(e, data, state) {
    let boundary = 'Char'
    if (data.isWord) boundary = 'Word'
    if (data.isLine) boundary = 'Line'

    return state
      .transform()
      [`delete${boundary}Backward`]()
      .apply()
  }

  /**
   * On `delete` key down, delete forwards.
   *
   * @param {Event} e
   * @param {Object} data
   * @param {State} state
   * @return {State}
   */

  function onKeyDownDelete(e, data, state) {
    let boundary = 'Char'
    if (data.isWord) boundary = 'Word'
    if (data.isLine) boundary = 'Line'

    return state
      .transform()
      [`delete${boundary}Forward`]()
      .apply()
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
   * @param {State} state
   * @return {State}
   */

  function onKeyDownLeft(e, data, state) {
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
        return state
          .transform()
          .collapseToEndOf(previous)
          [extendOrMove](-1)
          .apply()
      }

      // Otherwise, move to the end of the previous node.
      return state
        .transform()
        .collapseToEndOf(previous)
        .apply()
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
   * @param {State} state
   * @return {State}
   */

  function onKeyDownRight(e, data, state) {
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
      if (!next) return state

      // If the next text is inside a void node, move to the end of it.
      const isInVoid = document.hasVoidParent(next.key)

      if (isInVoid) {
        return state
          .transform()
          .collapseToEndOf(next)
          .apply()
      }

      // If the next text is in the current block, and inside an inline node,
      // move one character into the inline node.
      const { startBlock } = state
      const nextBlock = document.getClosestBlock(next.key)
      const nextInline = document.getClosestInline(next.key)

      if (nextBlock == startBlock && nextInline) {
        const extendOrMove = data.isShift ? 'extend' : 'move'
        return state
          .transform()
          .collapseToStartOf(next)
          [extendOrMove](1)
          .apply()
      }

      // Otherwise, move to the start of the next text node.
      return state
        .transform()
        .collapseToStartOf(next)
        .apply()
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
   * @param {State} state
   * @return {State}
   */

  function onKeyDownUp(e, data, state) {
    if (!IS_MAC || data.isCtrl || !data.isAlt) return

    const transform = data.isShift ? 'extendToStartOf' : 'collapseToStartOf'
    const { selection, document, focusKey, focusBlock } = state
    const block = selection.hasFocusAtStartOf(focusBlock)
      ? document.getPreviousBlock(focusKey)
      : focusBlock

    if (!block) return
    const text = block.getFirstText()

    e.preventDefault()
    return state
      .transform()
      [transform](text)
      .apply()
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
   * @param {State} state
   * @return {State}
   */

  function onKeyDownDown(e, data, state) {
    if (!IS_MAC || data.isCtrl || !data.isAlt) return

    const transform = data.isShift ? 'extendToEndOf' : 'collapseToEndOf'
    const { selection, document, focusKey, focusBlock } = state
    const block = selection.hasFocusAtEndOf(focusBlock)
      ? document.getNextBlock(focusKey)
      : focusBlock

    if (!block) return
    const text = block.getLastText()

    e.preventDefault()
    return state
      .transform()
      [transform](text)
      .apply()
  }

  /**
   * On `d` key down, for Macs, delete one character forward.
   *
   * @param {Event} e
   * @param {Object} data
   * @param {State} state
   * @return {State}
   */

  function onKeyDownD(e, data, state) {
    if (!IS_MAC || !data.isCtrl) return
    e.preventDefault()
    return state
      .transform()
      .deleteCharForward()
      .apply()
  }

  /**
   * On `h` key down, for Macs, delete until the end of the line.
   *
   * @param {Event} e
   * @param {Object} data
   * @param {State} state
   * @return {State}
   */

  function onKeyDownH(e, data, state) {
    if (!IS_MAC || !data.isCtrl) return
    e.preventDefault()
    return state
      .transform()
      .deleteCharBackward()
      .apply()
  }

  /**
   * On `k` key down, for Macs, delete until the end of the line.
   *
   * @param {Event} e
   * @param {Object} data
   * @param {State} state
   * @return {State}
   */

  function onKeyDownK(e, data, state) {
    if (!IS_MAC || !data.isCtrl) return
    e.preventDefault()
    return state
      .transform()
      .deleteLineForward()
      .apply()
  }

  /**
   * On `y` key down, redo.
   *
   * @param {Event} e
   * @param {Object} data
   * @param {State} state
   * @return {State}
   */

  function onKeyDownY(e, data, state) {
    if (!data.isMod) return

    return state
      .transform()
      .redo()
      .apply({ save: false })
  }

  /**
   * On `z` key down, undo or redo.
   *
   * @param {Event} e
   * @param {Object} data
   * @param {State} state
   * @return {State}
   */

  function onKeyDownZ(e, data, state) {
    if (!data.isMod) return

    return state
      .transform()
      [data.isShift ? 'redo' : 'undo']()
      .apply({ save: false })
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
    debug('onPaste', { data })

    switch (data.type) {
      case 'fragment':
        return onPasteFragment(e, data, state)
      case 'text':
      case 'html':
        return onPasteText(e, data, state)
    }
  }

  /**
   * On paste fragment.
   *
   * @param {Event} e
   * @param {Object} data
   * @param {State} state
   * @return {State}
   */

  function onPasteFragment(e, data, state) {
    debug('onPasteFragment', { data })

    return state
      .transform()
      .insertFragment(data.fragment)
      .apply()
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
    debug('onPasteText', { data })

    const transform = state.transform()

    data.text
      .split('\n')
      .forEach((line, i) => {
        if (i > 0) transform.splitBlock()
        transform.insertText(line)
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
    debug('onSelect', { data })

    return state
      .transform()
      .select(data.selection)
      .apply()
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
        onChange={editor.onChange}
        onCopy={editor.onCopy}
        onCut={editor.onCut}
        onDrop={editor.onDrop}
        onKeyDown={editor.onKeyDown}
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
