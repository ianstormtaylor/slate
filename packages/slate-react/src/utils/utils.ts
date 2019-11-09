import { Fragment, Range as SlateRange, Node as SlateNode } from 'slate'

import { ReactEditor } from '../plugin'
import { isDOMText, isDOMElement, DOMNode } from './dom'

namespace Utils {
  /**
   * Get the `Fragment` data from a `DataTransfer` object.
   */

  export const getFragmentData = (
    dataTransfer: DataTransfer
  ): Fragment | undefined => {
    const base64 = dataTransfer.getData('application/x-slate-fragment')

    if (base64) {
      const decoded = decodeURIComponent(window.atob(base64))
      const fragment = JSON.parse(decoded)
      return fragment
    }
  }

  /**
   * Set the currently selected fragment to the clipboard.
   */

  export const setFragmentData = (
    dataTransfer: DataTransfer,
    editor: ReactEditor
  ): void => {
    const { value } = editor
    const { selection } = value

    if (!selection) {
      return
    }

    const [start, end] = SlateRange.edges(selection)
    const startVoid = editor.getMatch(start.path, 'void')
    const endVoid = editor.getMatch(end.path, 'void')

    if (SlateRange.isCollapsed(selection) && !startVoid) {
      return
    }

    // Create a fake selection so that we can add a Base64-encoded copy of the
    // fragment to the HTML, to decode on future pastes.
    const domRange = editor.toDomRange(selection)
    let contents = domRange.cloneContents()
    let attach = contents.childNodes[0] as HTMLElement

    // Make sure attach is non-empty, since empty nodes will not get copied.
    contents.childNodes.forEach(node => {
      if (node.textContent && node.textContent.trim() !== '') {
        attach = node as HTMLElement
      }
    })

    // COMPAT: If the end node is a void node, we need to move the end of the
    // range from the void node's spacer span, to the end of the void node's
    // content, since the spacer is before void's content in the DOM.
    if (endVoid) {
      const [voidNode] = endVoid
      const r = domRange.cloneRange()
      const domNode = editor.toDomNode(voidNode)
      r.setEndAfter(domNode)
      contents = r.cloneContents()
    }

    // COMPAT: If the start node is a void node, we need to attach the encoded
    // fragment to the void node's content node instead of the spacer, because
    // attaching it to empty `<div>/<span>` nodes will end up having it erased by
    // most browsers. (2018/04/27)
    if (startVoid) {
      attach = contents.querySelector('[data-slate-spacer]')! as HTMLElement
    }

    // Remove any zero-width space spans from the cloned DOM so that they don't
    // show up elsewhere when pasted.
    Array.from(contents.querySelectorAll('[data-slate-zero-width]')).forEach(
      zw => {
        const isNewline = zw.getAttribute('data-slate-zero-width') === 'n'
        zw.textContent = isNewline ? '\n' : ''
      }
    )

    // Set a `data-slate-fragment` attribute on a non-empty node, so it shows up
    // in the HTML, and can be used for intra-Slate pasting. If it's a text
    // node, wrap it in a `<span>` so we have something to set an attribute on.
    if (isDOMText(attach)) {
      const span = document.createElement('span')
      // COMPAT: In Chrome and Safari, if we don't add the `white-space` style
      // then leading and trailing spaces will be ignored. (2017/09/21)
      span.style.whiteSpace = 'pre'
      span.appendChild(attach)
      contents.appendChild(span)
      attach = span
    }

    const fragment = SlateNode.fragment(value, selection)
    const string = JSON.stringify(fragment)
    const encoded = window.btoa(encodeURIComponent(string))
    attach.setAttribute('data-slate-fragment', encoded)
    dataTransfer.setData('application/x-slate-fragment', encoded)

    // Add the content to a <div> so that we can get its inner HTML.
    const div = document.createElement('div')
    div.appendChild(contents)
    dataTransfer.setData('text/html', div.innerHTML)
    dataTransfer.setData('text/plain', getPlainText(div))
  }
}

/**
 * Get a plaintext representation of the content of a node, accounting for block
 * elements which get a newline appended.
 */

const getPlainText = (domNode: DOMNode) => {
  let text = ''

  if (isDOMText(domNode) && domNode.nodeValue) {
    return domNode.nodeValue
  }

  if (isDOMElement(domNode)) {
    for (const childNode of Array.from(domNode.childNodes)) {
      text += getPlainText(childNode)
    }

    var display = getComputedStyle(domNode).getPropertyValue('display')

    if (display === 'block' || display === 'list' || domNode.tagName === 'BR') {
      text += '\n'
    }
  }

  return text
}

export { Utils }
