import { Element, Node, Point, Range, Value } from 'slate'

import { ReactEditor } from '.'
import {
  EDITOR_TO_ELEMENT,
  ELEMENT_TO_NODE,
  NODE_TO_ELEMENT,
} from '../utils/weak-maps'
import {
  DOMElement,
  DOMPoint,
  DOMRange,
  DOMStaticRange,
  DOMSelection,
  isDOMElement,
  DOMNode,
  normalizeDOMPoint,
} from '../utils/dom'

export default class ReactEditorDomHelpers {
  /**
   * Check if a DOM node is within the editor.
   */

  hasDomNode(
    this: ReactEditor,
    target: DOMNode,
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
      element = isDOMElement(target) ? target : target.parentElement
    } catch (err) {
      if (
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
   * Find the native DOM element from a Slate node.
   */

  toDomNode(this: ReactEditor, node: Node): HTMLElement {
    const domNode = Value.isValue(node)
      ? EDITOR_TO_ELEMENT.get(this)
      : NODE_TO_ELEMENT.get(node)

    if (!domNode) {
      throw new Error(
        `Cannot resolve a DOM node from Slate node: ${JSON.stringify(node)}`
      )
    }

    return domNode
  }

  /**
   * Find a native DOM selection point from a Slate point.
   */

  toDomPoint(this: ReactEditor, point: Point): DOMPoint {
    const [node] = this.getNode(point.path)
    const el = this.toDomNode(node)
    let domPoint: DOMPoint | undefined

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
        domPoint = [domNode, offset]
        break
      }

      start = end
    }

    if (!domPoint) {
      throw new Error(
        `Cannot resolve a DOM point from Slate point: ${JSON.stringify(point)}`
      )
    }

    return domPoint
  }

  /**
   * Find a native DOM range from a Slate `range`.
   */

  toDomRange(this: ReactEditor, range: Range): DOMRange {
    const { anchor, focus } = range
    const domAnchor = this.toDomPoint(anchor)
    const domFocus = Range.isCollapsed(range)
      ? domAnchor
      : this.toDomPoint(focus)

    const domRange = window.document.createRange()
    const start = Range.isBackward(range) ? domFocus : domAnchor
    const end = Range.isBackward(range) ? domAnchor : domFocus
    domRange.setStart(start[0], start[1])
    domRange.setEnd(end[0], end[1])
    return domRange
  }

  /**
   * Find a Slate node from a native DOM `element`.
   */

  toSlateNode(this: ReactEditor, domNode: DOMNode): Node {
    let domEl = isDOMElement(domNode) ? domNode : domNode.parentElement

    if (domEl && !domEl.hasAttribute('data-slate-node')) {
      domEl = domEl.closest(`[data-slate-node]`)
    }

    const node = domEl ? ELEMENT_TO_NODE.get(domEl as HTMLElement) : null

    if (!node) {
      throw new Error(`Cannot resolve a Slate node from DOM node: ${domEl}`)
    }

    return node
  }

  /**
   * Get the target range from a DOM `event`.
   */

  findEventRange(this: ReactEditor, event: any): Range | undefined {
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
    if (Element.isElement(node) && this.isVoid(node)) {
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
    } else {
      const position = document.caretPositionFromPoint(x, y)

      if (position) {
        domRange = document.createRange()
        domRange.setStart(position.offsetNode, position.offset)
        domRange.setEnd(position.offsetNode, position.offset)
      }
    }

    if (!domRange) {
      throw new Error(`Cannot resolve a Slate range from a DOM event: ${event}`)
    }

    // Resolve a Slate range from the DOM range.
    const range = this.toSlateRange(domRange)
    return range
  }

  /**
   * Find a Slate point from a DOM selection's `domNode` and `domOffset`.
   */

  toSlatePoint(this: ReactEditor, domPoint: DOMPoint): Point {
    const [nearestNode, nearestOffset] = normalizeDOMPoint(domPoint)
    const parentNode = nearestNode.parentNode as DOMElement
    let textNode: DOMElement | null = null
    let offset = 0

    if (parentNode) {
      const voidNode = parentNode.closest('[data-slate-void="true"]')
      let leafNode = parentNode.closest('[data-slate-leaf]')
      let domNode: DOMElement | null = null

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
      } else if (voidNode) {
        // For void nodes, the element with the offset key will be a cousin, not an
        // ancestor, so find it by going down from the nearest void parent.

        leafNode = voidNode.querySelector('[data-slate-leaf]')!
        textNode = leafNode.closest('[data-slate-node="text"]')!
        domNode = leafNode
        offset = domNode.textContent!.length
      }

      // COMPAT: If the parent node is a Slate zero-width space, this is
      // because the text node should have no characters. However, during IME
      // composition the ASCII characters will be prepended to the zero-width
      // space, so subtract 1 from the offset to account for the zero-width
      // space character.
      if (
        domNode &&
        offset === domNode.textContent!.length &&
        parentNode.hasAttribute('data-slate-zero-width')
      ) {
        offset--
      }
    }

    if (!textNode) {
      throw new Error(
        `Cannot resolve a Slate point from DOM point: ${domPoint}`
      )
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
    domRange: DOMRange | DOMStaticRange | DOMSelection
  ): Range {
    const el =
      domRange instanceof Selection
        ? domRange.anchorNode
        : domRange.startContainer
    let anchorNode
    let anchorOffset
    let focusNode
    let focusOffset
    let isCollapsed

    if (el) {
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
    }

    if (
      anchorNode == null ||
      focusNode == null ||
      anchorOffset == null ||
      focusOffset == null
    ) {
      throw new Error(
        `Cannot resolve a Slate range from DOM range: ${domRange}`
      )
    }

    const anchor = this.toSlatePoint([anchorNode, anchorOffset])
    const focus = isCollapsed
      ? anchor
      : this.toSlatePoint([focusNode, focusOffset])

    return { anchor, focus }
  }
}
