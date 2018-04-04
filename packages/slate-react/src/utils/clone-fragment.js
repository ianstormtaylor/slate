import Base64 from 'slate-base64-serializer'

import getWindow from 'get-window'
import findDOMNode from './find-dom-node'
import { ZERO_WIDTH_SELECTOR, ZERO_WIDTH_ATTRIBUTE } from './find-point'
import { IS_CHROME, IS_SAFARI } from '../constants/environment'

/**
 * Prepares a Slate document fragment to be copied to the clipboard.
 *
 * @param {Event} event
 * @param {Value} value
 * @param {Document} [fragment]
 */

function cloneFragment(event, value, fragment = value.fragment) {
  const window = getWindow(event.target)
  const native = window.getSelection()
  const { startKey, endKey, startText, endBlock, endInline } = value
  const isVoidBlock = endBlock && endBlock.isVoid
  const isVoidInline = endInline && endInline.isVoid
  const isVoid = isVoidBlock || isVoidInline

  // If the selection is collapsed, and it isn't inside a void node, abort.
  if (native.isCollapsed && !isVoid) return

  // Create a fake selection so that we can add a Base64-encoded copy of the
  // fragment to the HTML, to decode on future pastes.
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
    const hasMarks =
      startText.characters
        .slice(value.selection.anchorOffset, value.selection.focusOffset)
        .filter(char => char.marks.size !== 0).size !== 0
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
  ;[].slice.call(contents.querySelectorAll(ZERO_WIDTH_SELECTOR)).forEach(zw => {
    const isNewline = zw.getAttribute(ZERO_WIDTH_ATTRIBUTE) === 'n'
    zw.textContent = isNewline ? '\n' : ''
  })

  // COMPAT: In Chrome and Safari, if the last element in the selection to
  // copy has `contenteditable="false"` the copy will fail, and nothing will
  // be put in the clipboard. So we remove them all. (2017/05/04)
  if (IS_CHROME || IS_SAFARI) {
    const els = [].slice.call(
      contents.querySelectorAll('[contenteditable="false"]')
    )
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
  const editor = event.target.closest('[data-slate-editor]')
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
  div.style.top = `${window.pageYOffset ||
    window.document.documentElement.scrollTop}px`

  div.appendChild(contents)
  editor.appendChild(div)

  // COMPAT: In Firefox, trying to use the terser `native.selectAllChildren`
  // throws an error, so we use the older `range` equivalent. (2016/06/21)
  const r = window.document.createRange()
  r.selectNodeContents(div)
  native.removeAllRanges()
  native.addRange(r)

  // Revert to the previous selection right after copying.
  window.requestAnimationFrame(() => {
    editor.removeChild(div)
    native.removeAllRanges()
    native.addRange(range)
  })
}

export default cloneFragment
