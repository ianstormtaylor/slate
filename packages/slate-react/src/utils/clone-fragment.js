import Base64 from 'slate-base64-serializer'
import Plain from 'slate-plain-serializer'
import { Value } from 'slate'
import TRANSFER_TYPES from '../constants/transfer-types'
import getWindow from 'get-window'
import findDOMNode from './find-dom-node'
import removeAllRanges from './remove-all-ranges'
import { IS_IE } from 'slate-dev-environment'
import { ZERO_WIDTH_SELECTOR, ZERO_WIDTH_ATTRIBUTE } from './find-point'

const { FRAGMENT, HTML, TEXT } = TRANSFER_TYPES

/**
 * Prepares a Slate document fragment to be copied to the clipboard.
 *
 * @param {Event} event
 * @param {Value} value
 * @param {Document} [fragment]
 */

function cloneFragment(
  event,
  value,
  fragment = value.fragment,
  callback = () => undefined
) {
  const window = getWindow(event.target)
  const native = window.getSelection()
  const { schema } = value
  const { start, end } = value.selection
  const startVoid = value.document.getClosestVoid(start.key, schema)
  const endVoid = value.document.getClosestVoid(end.key, schema)

  // If the selection is collapsed, and it isn't inside a void node, abort.
  if (native.isCollapsed && !startVoid) return

  // Create a fake selection so that we can add a Base64-encoded copy of the
  // fragment to the HTML, to decode on future pastes.
  const encoded = Base64.serializeNode(fragment)
  const range = native.getRangeAt(0)
  let contents = range.cloneContents()
  let attach = contents.childNodes[0]

  // Make sure attach is a non-empty node, since empty nodes will not get copied
  contents.childNodes.forEach(node => {
    if (node.textContent && node.textContent.trim() !== '') {
      attach = node
    }
  })

  // COMPAT: If the end node is a void node, we need to move the end of the
  // range from the void node's spacer span, to the end of the void node's
  // content, since the spacer is before void's content in the DOM.
  if (endVoid) {
    const r = range.cloneRange()
    const node = findDOMNode(endVoid, window)
    r.setEndAfter(node)
    contents = r.cloneContents()
  }

  // COMPAT: If the start node is a void node, we need to attach the encoded
  // fragment to the void node's content node instead of the spacer, because
  // attaching it to empty `<div>/<span>` nodes will end up having it erased by
  // most browsers. (2018/04/27)
  if (startVoid) {
    attach = contents.childNodes[0].childNodes[1].firstChild
  }

  // Remove any zero-width space spans from the cloned DOM so that they don't
  // show up elsewhere when pasted.
  ;[].slice.call(contents.querySelectorAll(ZERO_WIDTH_SELECTOR)).forEach(zw => {
    const isNewline = zw.getAttribute(ZERO_WIDTH_ATTRIBUTE) === 'n'
    zw.textContent = isNewline ? '\n' : ''
  })

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

  //  Creates value from only the selected blocks
  //  Then gets plaintext for clipboard with proper linebreaks for BLOCK elements
  //  Via Plain serializer
  const valFromSelection = Value.create({ document: fragment })
  const plainText = Plain.serialize(valFromSelection)

  // Add the phony content to a div element. This is needed to copy the
  // contents into the html clipboard register.
  const div = window.document.createElement('div')
  div.appendChild(contents)

  // For browsers supporting it, we set the clipboard registers manually,
  // since the result is more predictable.
  // COMPAT: IE supports the setData method, but only in restricted sense.
  // IE doesn't support arbitrary MIME types or common ones like 'text/plain';
  // it only accepts "Text" (which gets mapped to 'text/plain') and "Url"
  // (mapped to 'text/url-list'); so, we should only enter block if !IS_IE
  if (event.clipboardData && event.clipboardData.setData && !IS_IE) {
    event.preventDefault()
    event.clipboardData.setData(TEXT, plainText)
    event.clipboardData.setData(FRAGMENT, encoded)
    event.clipboardData.setData(HTML, div.innerHTML)
    callback()
  }

  // COMPAT: For browser that don't support the Clipboard API's setData method,
  // we must rely on the browser to natively copy what's selected.
  // So we add the div (containing our content) to the DOM, and select it.
  const editor = event.target.closest('[data-slate-editor]')
  div.setAttribute('contenteditable', true)
  div.style.position = 'absolute'
  div.style.left = '-9999px'
  editor.appendChild(div)
  native.selectAllChildren(div)

  // Revert to the previous selection right after copying.
  window.requestAnimationFrame(() => {
    editor.removeChild(div)
    removeAllRanges(native)
    native.addRange(range)
    callback()
  })
}

export default cloneFragment
