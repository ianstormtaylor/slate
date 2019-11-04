import {
  Element as SlateElement,
  Node as SlateNode,
  Point as SlatePoint,
  Range as SlateRange,
  Fragment as SlateFragment,
  Value as SlateValue,
} from 'slate'

import { TYPES } from '../utils/constants'
import {
  EDITOR_TO_ELEMENT,
  ELEMENT_TO_NODE,
  NODE_TO_ELEMENT,
} from '../utils/weak-maps'
import { IS_FIREFOX } from '../utils/environment'
import { ReactEditor } from '.'
import { SyntheticEvent } from 'react'
import { decode } from '../utils/base-64'
import { isSyntheticEvent } from '../utils/react'
import {
  NativeElement,
  NativePoint,
  NativeRange,
  NativeStaticRange,
  NativeSelection,
  isNativeElement,
  NativeNode,
  normalizeNodeAndOffset,
} from '../utils/dom'

export default class ReactEditorDomHelpers {
  /**
   * Check if a DOM node is within the editor.
   */

  hasDomNode(
    this: ReactEditor,
    target: NativeNode,
    options: { editable?: boolean } = {}
  ): boolean {
    const { editable = false } = options
    const el = this.toDomNode(this.value)
    let element

    // COMPAT: In Firefox, reading `target.nodeType` will throw an error if
    // target is originating from an internal "restricted" element (e.g. a
    // stepper arrow on a number input). (2018/05/04)
    // https://github.com/ianstormtaylor/slate/issues/1819
    try {
      element = isNativeElement(target) ? target : target.parentElement
    } catch (err) {
      if (
        !IS_FIREFOX ||
        !err.message.includes('Permission denied to access property "nodeType"')
      ) {
        throw err
      }
    }

    if (!element) {
      return false
    }

    return (
      element.closest(`[data-slate-editor]`) === el &&
      (!editable || el.isContentEditable)
    )
  }

  /**
   * Get the transfer data from an DOM event.
   */

  getEventTransfer(event: Event | SyntheticEvent) {
    const transfer = getDataTransfer(event)
    const data: {
      type: 'unknown' | 'text' | 'node' | 'fragment' | 'html' | 'files'
      files: DataTransferItem[] | File[] | null
      fragment: SlateFragment | null
      html: string | null
      node: SlateNode | null
      rich: string | null
      text: string | null
    } = {
      type: 'unknown',
      files: null,
      fragment: null,
      html: null,
      node: null,
      rich: null,
      text: null,
    }

    if (!transfer) {
      return data
    }

    let fragment = getType(transfer, TYPES.FRAGMENT)
    let node = getType(transfer, TYPES.NODE)
    const html = getType(transfer, TYPES.HTML)
    const rich = getType(transfer, TYPES.RICH)
    let text = getType(transfer, TYPES.TEXT)

    // If there isn't a fragment, but there is HTML, check to see if the HTML is
    // actually an encoded fragment.
    if (!fragment && html && ~html.indexOf(` data-slate-fragment="`)) {
      const matches = / data-slate-fragment="([^\s"]+)"/.exec(html)

      if (matches) {
        const [, encoded] = matches

        if (encoded) {
          fragment = encoded
        }
      }
    }

    // COMPAT: Edge doesn't handle custom data types, and it instead embeds them
    // inside `text/plain`. (2017/7/12)
    if (text) {
      const prefix = 'SLATE-DATA-EMBED::'
      let types

      if (text.substring(0, prefix.length) !== prefix) {
        data.text = text
        return data
      }

      // Attempt to parse, if fails then just standard text/plain
      // Otherwise, already had data embedded
      try {
        types = JSON.parse(text.substring(prefix.length))
      } catch (err) {
        throw new Error('Unable to parse custom Slate drag event data.')
      }

      if (types[TYPES.FRAGMENT]) {
        fragment = types[TYPES.FRAGMENT]
      }

      if (types[TYPES.NODE]) {
        node = types[TYPES.NODE]
      }

      if (types[TYPES.TEXT]) {
        text = types[TYPES.TEXT]
      }
    }

    data.html = html
    data.text = text
    data.rich = rich

    if (fragment) {
      data.fragment = decode(fragment) as SlateFragment
    }

    if (node) {
      data.node = decode(node) as SlateNode
    }

    if (transfer.files && transfer.files.length) {
      data.files = Array.from(transfer.files)
    }

    // COMPAT: Edge sometimes throws 'NotSupportedError' when accessing
    // `transfer.items`. (2017/7/12)
    try {
      if (transfer.items && transfer.items.length) {
        const array = []

        for (const item of Array.from(transfer.items)) {
          if (item.kind === 'file') {
            const file = item.getAsFile()

            if (file) {
              array.push(file)
            }
          }
        }

        data.files = array
      }
    } catch (err) {}

    if (data.fragment) {
      data.type = 'fragment'
    } else if (data.node) {
      data.type = 'node'
    } else if (data.rich && data.html) {
      // COMPAT: Microsoft Word adds an image of the selected text to the data.
      // Since files are preferred over HTML or text, this would cause the type to
      // be considered `files`. But it also adds rich text data so we can check
      // for that and properly set the type to `html` or `text`. (2016/11/21)
      data.type = 'html'
    } else if (data.rich && data.text) {
      data.type = 'text'
    } else if (data.files && data.files.length) {
      data.type = 'files'
    } else if (data.html) {
      data.type = 'html'
    } else if (data.text) {
      data.type = 'text'
    }

    return data
  }

  /**
   * Set data with `type` and `content` on an `event`.
   */

  setEventTransfer(
    event: Event | SyntheticEvent,
    type: string,
    content: string
  ): void {
    const mime = TYPES[type.toUpperCase()]

    if (!mime) {
      throw new Error(`Cannot set unknown transfer type "${mime}".`)
    }

    if (isSyntheticEvent(event)) {
      event = event.nativeEvent
    }

    let transfer

    if (event instanceof DragEvent) {
      transfer = event.dataTransfer
    } else if (event instanceof ClipboardEvent) {
      transfer = event.clipboardData
    }

    if (!transfer) {
      return
    }

    // COMPAT: In Edge, custom types throw errors, so embed all non-standard types
    // in text/plain compound object. (2017/7/12)
    try {
      transfer.setData(mime, content)
      // COMPAT: Safari needs to have the 'text' (and not 'text/plain') value in
      // dataTransfer to display the cursor while dragging internally.
      transfer.setData('text', transfer.getData('text'))
    } catch (err) {
      const prefix = 'SLATE-DATA-EMBED::'
      const text = transfer.getData(TYPES.TEXT)
      let obj = {}

      // If the existing plain text data is prefixed, it's Slate JSON data.
      if (text.substring(0, prefix.length) === prefix) {
        try {
          obj = JSON.parse(text.substring(prefix.length))
        } catch (e) {
          throw new Error(
            'Failed to parse Slate data from `DataTransfer` object.'
          )
        }
      } else {
        // Otherwise, it's just set it as is.
        obj[TYPES.TEXT] = text
      }

      obj[mime] = content
      const string = `${prefix}${JSON.stringify(obj)}`
      transfer.setData(TYPES.TEXT, string)
    }
  }

  /**
   * Find the native DOM element from a Slate node.
   */

  toDomNode(this: ReactEditor, node: SlateNode): HTMLElement {
    const domNode = SlateValue.isValue(node)
      ? EDITOR_TO_ELEMENT.get(this)
      : NODE_TO_ELEMENT.get(node)

    if (!domNode) {
      debugger
      throw new Error(
        `Unable to find a DOM node for the Slate node: ${JSON.stringify(node)}`
      )
    }

    return domNode
  }

  /**
   * Find a native DOM selection point from a Slate point.
   */

  toDomPoint(this: ReactEditor, point: SlatePoint): NativePoint {
    const [node] = this.getNode(point.path)
    const el = this.toDomNode(node)
    let domPoint: NativePoint | undefined

    // For each leaf, we need to isolate its content, which means filtering
    // to its direct text and zero-width spans. (We have to filter out any
    // other siblings that may have been rendered alongside them.)
    const selector = `[data-slate-string], [data-slate-zero-width]`
    const texts = Array.from(el.querySelectorAll(selector))
    let start = 0

    for (const text of texts) {
      const domNode = text.childNodes[0] as HTMLElement

      if (domNode == null || domNode.textContent == null) {
        continue
      }

      const { length } = domNode.textContent
      const attr = text.getAttribute('data-slate-length')
      const trueLength = attr == null ? length : parseInt(attr, 10)
      const end = start + trueLength

      if (point.offset <= end) {
        const offset = Math.min(length, Math.max(0, point.offset - start))
        domPoint = { node: domNode, offset }
        break
      }

      start = end
    }

    if (!domPoint) {
      debugger
      throw new Error(
        `Unable to find a DOM point for the Slate point: ${JSON.stringify(
          point
        )}`
      )
    }

    return domPoint
  }

  /**
   * Find a native DOM range from a Slate `range`.
   */

  toDomRange(this: ReactEditor, range: SlateRange): NativeRange {
    const { anchor, focus } = range
    const domAnchor = this.toDomPoint(anchor)
    const domFocus = SlateRange.isCollapsed(range)
      ? domAnchor
      : this.toDomPoint(focus)

    const domRange = window.document.createRange()
    const start = SlateRange.isBackward(range) ? domFocus : domAnchor
    const end = SlateRange.isBackward(range) ? domAnchor : domFocus
    domRange.setStart(start.node, start.offset)
    domRange.setEnd(end.node, end.offset)
    return domRange
  }

  /**
   * Find a Slate node from a native DOM `element`.
   */

  toSlateNode(this: ReactEditor, domNode: NativeNode): SlateNode {
    let domEl = isNativeElement(domNode) ? domNode : domNode.parentElement

    if (domEl && !domEl.hasAttribute('data-slate-node')) {
      domEl = domEl.closest(`[data-slate-node]`)
    }

    const node = domEl ? ELEMENT_TO_NODE.get(domEl as HTMLElement) : null

    if (!node) {
      debugger
      throw new Error(`Unable to find a Slate node from the DOM node: ${domEl}`)
    }

    return node
  }

  /**
   * Get the target range from a DOM `event`.
   */

  findEventRange(this: ReactEditor, event: any): SlateRange | undefined {
    if ('nativeEvent' in event) {
      event = event.nativeEvent
    }

    const { clientX: x, clientY: y, target } = event

    if (x == null || y == null) {
      return
    }

    const node = this.toSlateNode(event.target)
    const path = this.findPath(node)

    // If the drop target is inside a void node, move it into either the
    // next or previous node, depending on which side the `x` and `y`
    // coordinates are closest to.
    if (SlateElement.isElement(node) && this.isVoid(node)) {
      const rect = target.getBoundingClientRect()
      const isPrev = this.isInline(node)
        ? x - rect.left < rect.left + rect.width - x
        : y - rect.top < rect.top + rect.height - y

      const edge = this.getPoint(path, { edge: isPrev ? 'start' : 'end' })
      const point = isPrev ? this.getBefore(edge) : this.getAfter(edge)

      if (point) {
        const range = this.getRange(point)
        return range
      }
    }

    // Else resolve a range from the caret position where the drop occured.
    let domRange
    const { document } = window

    // COMPAT: In Firefox, `caretRangeFromPoint` doesn't exist. (2016/07/25)
    if (document.caretRangeFromPoint) {
      domRange = document.caretRangeFromPoint(x, y)
    } else if (document.caretPositionFromPoint) {
      const position = document.caretPositionFromPoint(x, y)

      if (position) {
        domRange = document.createRange()
        domRange.setStart(position.offsetNode, position.offset)
        domRange.setEnd(position.offsetNode, position.offset)
      }
    } else if ('createTextRange' in document.body) {
      // COMPAT: In IE, `caretRangeFromPoint` and
      // `caretPositionFromPoint` don't exist. (2018/07/11)
      domRange = (document.body as any).createTextRange()

      try {
        domRange.moveToPoint(x, y)
      } catch (error) {
        // IE11 will raise an `unspecified error` if `moveToPoint` is
        // called during a dropEvent.
        return
      }
    }

    // Resolve a Slate range from the DOM range.
    const range = this.toSlateRange(domRange)
    return range
  }

  /**
   * Find a Slate point from a DOM selection's `domNode` and `domOffset`.
   */

  toSlatePoint(
    this: ReactEditor,
    domPoint: NativePoint
  ): SlatePoint | undefined {
    const { node: nearestNode, offset: nearestOffset } = normalizeNodeAndOffset(
      domPoint
    )
    const { parentNode } = nearestNode

    if (!parentNode || !isNativeElement(parentNode)) {
      return
    }

    let leafNode = parentNode.closest('[data-slate-leaf]')
    let domNode
    let textNode
    let offset

    // Calculate how far into the text node the `nearestNode` is, so that we
    // can determine what the offset relative to the text node is.
    if (leafNode) {
      textNode = leafNode.closest('[data-slate-node="text"]')!
      const range = window.document.createRange()
      range.setStart(textNode, 0)
      range.setEnd(nearestNode, nearestOffset)
      const contents = range.cloneContents()
      const zeroWidths = contents.querySelectorAll('[data-slate-zero-width]')

      Array.from(zeroWidths).forEach(el => {
        el!.parentNode!.removeChild(el)
      })

      // COMPAT: Edge has a bug where Range.prototype.toString() will
      // convert \n into \r\n. The bug causes a loop when slate-react
      // attempts to reposition its cursor to match the native position. Use
      // textContent.length instead.
      // https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/10291116/
      offset = contents.textContent!.length
      domNode = textNode
    } else {
      // For void nodes, the element with the offset key will be a cousin, not an
      // ancestor, so find it by going down from the nearest void parent.
      const voidNode = parentNode.closest('[data-slate-void="true"]')

      if (!voidNode) {
        return
      }

      leafNode = voidNode.querySelector('[data-slate-leaf]')

      if (!leafNode) {
        return
      }

      textNode = leafNode.closest('[data-slate-node="text"]')
      domNode = leafNode
      offset = domNode.textContent!.length
    }

    // COMPAT: If the parent node is a Slate zero-width space, this is
    // because the text node should have no characters. However, during IME
    // composition the ASCII characters will be prepended to the zero-width
    // space, so subtract 1 from the offset to account for the zero-width
    // space character.
    if (
      offset === domNode.textContent!.length &&
      parentNode.hasAttribute('data-slate-zero-width')
    ) {
      offset--
    }

    // COMPAT: If someone is clicking from one Slate editor into another,
    // the select event fires twice, once for the old editor's `element`
    // first, and then afterwards for the correct `element`. (2017/03/03)
    const slateNode = this.toSlateNode(textNode!)
    const path = this.findPath(slateNode)
    return { path, offset }
  }

  /**
   * Find a Slate range from a DOM range or selection.
   */

  toSlateRange(
    this: ReactEditor,
    domRange: NativeRange | NativeStaticRange | NativeSelection
  ): SlateRange | undefined {
    const el =
      domRange instanceof Selection
        ? domRange.anchorNode
        : domRange.startContainer

    if (!el) {
      return
    }

    let anchorNode
    let anchorOffset
    let focusNode
    let focusOffset
    let isCollapsed

    if (domRange instanceof Selection) {
      anchorNode = domRange.anchorNode
      anchorOffset = domRange.anchorOffset
      focusNode = domRange.focusNode
      focusOffset = domRange.focusOffset
      isCollapsed = domRange.isCollapsed
    } else {
      anchorNode = domRange.startContainer
      anchorOffset = domRange.startOffset
      focusNode = domRange.endContainer
      focusOffset = domRange.endOffset
      isCollapsed = domRange.collapsed
    }

    if (!anchorNode || !focusNode) {
      return
    }

    const anchor = this.toSlatePoint({
      node: anchorNode,
      offset: anchorOffset,
    })

    const focus = isCollapsed
      ? anchor
      : this.toSlatePoint({
          node: focusNode,
          offset: focusOffset,
        })

    if (anchor && focus) {
      return { anchor, focus }
    }
  }
}

/**
 * Get a value from a `DataTransfer` keyed by type.
 */

const getType = (transfer: DataTransfer, type: string): string | null => {
  // COMPAT: In IE 11, there is no `types` field but `getData('Text')`
  // is supported`. (2017/06/23)
  if (!transfer.types || !transfer.types.length) {
    return type === TYPES.TEXT ? transfer.getData('Text') || null : null
  }

  // COMPAT: In Edge, transfer.types doesn't respond to `indexOf`. (2017/10/25)
  const types = Array.from(transfer.types)
  return types.indexOf(type) !== -1 ? transfer.getData(type) || null : null
}

/**
 * Get the `DataTransfer` object from an event.
 */

export const getDataTransfer = (
  event: Event | SyntheticEvent
): DataTransfer | null => {
  if (isSyntheticEvent(event)) {
    event = event.nativeEvent
  }

  if (event instanceof DragEvent) {
    return event.dataTransfer
  } else if (event instanceof ClipboardEvent) {
    return event.clipboardData
  }

  return null
}
