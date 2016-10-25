
import Base64 from '../serializers/base-64'
import Character from '../models/character'
import Debug from 'debug'
import Placeholder from '../components/placeholder'
import React from 'react'
import String from '../utils/string'
import getWindow from 'get-window'
import { IS_MAC } from '../constants/environment'

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
    if (state.isNative) return state
    const schema = editor.getSchema()

    return state.transform()
      .normalizeWith(schema)
      .apply({ save: false })
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
    const { document, startKey, startOffset, startInline, startText } = state

    // Determine what the characters would be if natively inserted.
    const schema = editor.getSchema()
    const decorators = document.getDescendantDecorators(startKey, schema)
    const prevChars = startText.getDecorations(decorators)
    const prevChar = prevChars.get(startOffset - 1)
    const char = Character.create({
      text: e.data,
      marks: prevChar && prevChar.marks
    })

    const chars = prevChars
      .slice(0, startOffset)
      .push(char)
      .concat(prevChars.slice(startOffset))

    // Determine what the characters should be, if not natively inserted.
    let next = state
      .transform()
      .insertText(e.data)
      .apply()

    const nextText = next.startText
    const nextChars = nextText.getDecorations(decorators)

    // We do not have to re-render if the current selection is collapsed, the
    // current node is not empty, there are no marks on the cursor, the cursor
    // is not at the edge of an inline node, and the natively inserted
    // characters would be the same as the non-native.
    const isNative = (
      (state.isCollapsed) &&
      (state.startText.text != '') &&
      (state.selection.marks == null) &&
      (!startInline || !state.selection.isAtStartOf(startInline)) &&
      (!startInline || !state.selection.isAtEndOf(startInline)) &&
      (chars.equals(nextChars))
    )

    // Add the `isNative` flag directly, so we don't have to re-transform.
    if (isNative) {
      next = next.merge({ isNative })
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
    const isNative = true

    debug('onBlur', { data, isNative })

    return state
      .transform()
      .blur()
      .apply({ isNative })
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
    if (!native.rangeCount) return

    const { fragment } = data
    const encoded = Base64.serializeNode(fragment)
    const range = native.getRangeAt(0)
    const contents = range.cloneContents()

    // Remove any zero-width space spans from the cloned DOM so that they don't
    // show up elsewhere when copied.
    const zws = [].slice.call(contents.querySelectorAll('.slate-zero-width-space'))
    zws.forEach(zw => zw.parentNode.removeChild(zw))

    // Wrap the first character of the selection in a span that has the encoded
    // fragment attached as an attribute, so it will show up in the copied HTML.
    const wrapper = window.document.createElement('span')
    const text = contents.childNodes[0]
    const char = text.textContent.slice(0, 1)
    const first = window.document.createTextNode(char)
    const rest = text.textContent.slice(1)
    text.textContent = rest
    wrapper.appendChild(first)
    wrapper.setAttribute('data-slate-fragment', encoded)
    contents.insertBefore(wrapper, text)

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
    debug('onDropText', { data })

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
      case 'y': return onKeyDownY(e, data, state)
      case 'z': return onKeyDownZ(e, data, state)
      case 'k': return onKeyDownK(e, data, state)
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
    debug('onKeyDownEnter', { data })

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
   * @param {Object} data
   * @param {State} state
   * @return {State}
   */

  function onKeyDownBackspace(e, data, state) {
    debug('onKeyDownBackspace', { data })

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
    if (data.isWord) {
      n = String.getWordOffsetBackward(text, startOffset)
    }

    else if (data.isLine) {
      n = startOffset
    }

    else {
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
   * @param {Object} data
   * @param {State} state
   * @return {State}
   */

  function onKeyDownDelete(e, data, state) {
    debug('onKeyDownDelete', { data })

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
    if (data.isWord) {
      n = String.getWordOffsetForward(text, startOffset)
    }

    else if (data.isLine) {
      n = text.length - startOffset
    }

    else {
      n = String.getCharOffsetForward(text, startOffset)
    }

    return state
      .transform()
      .deleteForward(n)
      .apply()
  }

  /**
   * On `left` key down, move backward.
   *
   * COMPAT: This is required to solve for the case where an inline void node is
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
    if (data.isOpt) return
    if (state.isExpanded) return

    const { document, startText } = state
    const hasVoidParent = document.hasVoidParent(startText)

    if (
      startText.text == '' ||
      hasVoidParent
    ) {
      const previousText = document.getPreviousText(startText)
      if (!previousText) return

      debug('onKeyDownLeft', { data })

      e.preventDefault()
      return state
        .transform()
        .collapseToEndOf(previousText)
        .apply()
    }
  }

  /**
   * On `right` key down, move forward.
   *
   * COMPAT: This is required to solve for the case where an inline void node is
   * surrounded by empty text nodes with zero-width spaces in them. Without this
   * the zero-width spaces will cause two arrow keys to jump to the next text.
   *
   * @param {Event} e
   * @param {Object} data
   * @param {State} state
   * @return {State}
   */

  function onKeyDownRight(e, data, state) {
    if (data.isCtrl) return
    if (data.isOpt) return
    if (state.isExpanded) return

    const { document, startText } = state
    const hasVoidParent = document.hasVoidParent(startText)

    if (
      startText.text == '' ||
      hasVoidParent
    ) {
      const nextText = document.getNextText(startText)
      if (!nextText) return state

      debug('onKeyDownRight', { data })

      e.preventDefault()
      return state
        .transform()
        .collapseToStartOf(nextText)
        .apply()
    }
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

    debug('onKeyDownY', { data })

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

    debug('onKeyDownZ', { data })

    return state
      .transform()
      [data.isShift ? 'redo' : 'undo']()
      .apply({ save: false })
  }

  /**
   * On `k` key down, delete untill the end of the line (mac only)
   *
   * @param {Event} e
   * @param {Object} data
   * @param {State} state
   * @return {State}
   */

  function onKeyDownK(e, data, state) {
    if (!IS_MAC || !data.isCtrl) return

    debug('onKeyDownK', { data })

    const { startOffset, startBlock } = state

    return state
      .transform()
      .deleteForward(startBlock.text.length - startOffset)
      .apply()
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
    const { selection } = data

    debug('onSelect', { data, selection: selection.toJS() })

    return state
      .transform()
      .moveTo(selection)
      // Since the document has not changed, We only normalize the selection
      .normalizeSelection()
      .apply({ normalize: false })
  }

  /**
   * Extend core schema with rendering
   */

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

  const schema = {
      rules: [
          BLOCK_RENDER_RULE,
          INLINE_RENDER_RULE
      ]
  }

  /**
   * Return the core plugin.
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
    schema,
  }
}

/**
 * Export.
 */

export default Plugin
