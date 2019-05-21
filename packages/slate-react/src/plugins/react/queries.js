import getWindow from 'get-window'
import { PathUtils } from 'slate'

import DATA_ATTRS from '../../constants/data-attributes'
import SELECTORS from '../../constants/selectors'

/**
 * A set of queries for the React plugin.
 *
 * @return {Object}
 */

function QueriesPlugin() {
  /**
   * Find the native DOM element for a node at `path`.
   *
   * @param {Editor} editor
   * @param {Array|List} path
   * @return {DOMNode|Null}
   */

  function findDOMNode(editor, path) {
    path = PathUtils.create(path)
    const content = editor.tmp.contentRef.current

    if (!content) {
      return null
    }

    if (!path.size) {
      return content.ref.current || null
    }

    const search = (instance, p) => {
      if (!instance) {
        return null
      }

      if (!p.size) {
        if (instance.ref) {
          return instance.ref.current || null
        } else {
          return instance || null
        }
      }

      const index = p.first()
      const rest = p.rest()
      const ref = instance.tmp.nodeRefs[index]
      return search(ref, rest)
    }

    const document = content.tmp.nodeRef.current
    const el = search(document, path)
    return el
  }

  /**
   * Find a native DOM selection point from a Slate `point`.
   *
   * @param {Editor} editor
   * @param {Point} point
   * @return {Object|Null}
   */

  function findDOMPoint(editor, point) {
    const el = editor.findDOMNode(point.path)
    let start = 0

    if (!el) {
      return null
    }

    // For each leaf, we need to isolate its content, which means filtering to its
    // direct text and zero-width spans. (We have to filter out any other siblings
    // that may have been rendered alongside them.)
    const texts = Array.from(
      el.querySelectorAll(`${SELECTORS.STRING}, ${SELECTORS.ZERO_WIDTH}`)
    )

    for (const text of texts) {
      const node = text.childNodes[0]
      const domLength = node.textContent.length
      let slateLength = domLength

      if (text.hasAttribute(DATA_ATTRS.LENGTH)) {
        slateLength = parseInt(text.getAttribute(DATA_ATTRS.LENGTH), 10)
      }

      const end = start + slateLength

      if (point.offset <= end) {
        const offset = Math.min(domLength, Math.max(0, point.offset - start))
        return { node, offset }
      }

      start = end
    }

    return null
  }

  /**
   * Find a native DOM range from a Slate `range`.
   *
   * @param {Editor} editor
   * @param {Range} range
   * @return {DOMRange|Null}
   */

  function findDOMRange(editor, range) {
    const { anchor, focus, isBackward, isCollapsed } = range
    const domAnchor = editor.findDOMPoint(anchor)
    const domFocus = isCollapsed ? domAnchor : editor.findDOMPoint(focus)

    if (!domAnchor || !domFocus) {
      return null
    }

    const window = getWindow(domAnchor.node)
    const r = window.document.createRange()
    const start = isBackward ? domFocus : domAnchor
    const end = isBackward ? domAnchor : domFocus
    r.setStart(start.node, start.offset)
    r.setEnd(end.node, end.offset)
    return r
  }

  /**
   * Find a Slate node from a native DOM `element`.
   *
   * @param {Editor} editor
   * @param {Element} element
   * @return {List|Null}
   */

  function findNode(editor, element) {
    const path = editor.findPath(element)

    if (!path) {
      return null
    }

    const { value } = editor
    const { document } = value
    const node = document.getNode(path)
    return node
  }

  /**
   * Get the target range from a DOM `event`.
   *
   * @param {Event} event
   * @param {Editor} editor
   * @return {Range}
   */

  function findEventRange(editor, event) {
    if (event.nativeEvent) {
      event = event.nativeEvent
    }

    const { clientX: x, clientY: y, target } = event
    if (x == null || y == null) return null

    const { value } = editor
    const { document } = value
    const path = editor.findPath(event.target)
    if (!path) return null

    const node = document.getNode(path)

    // If the drop target is inside a void node, move it into either the next or
    // previous node, depending on which side the `x` and `y` coordinates are
    // closest to.
    if (editor.isVoid(node)) {
      const rect = target.getBoundingClientRect()
      const isPrevious =
        node.object === 'inline'
          ? x - rect.left < rect.left + rect.width - x
          : y - rect.top < rect.top + rect.height - y

      const range = document.createRange()
      const move = isPrevious ? 'moveToEndOfNode' : 'moveToStartOfNode'
      const entry = document[isPrevious ? 'getPreviousText' : 'getNextText'](
        path
      )

      if (entry) {
        return range[move](entry)
      }

      return null
    }

    // Else resolve a range from the caret position where the drop occured.
    const window = getWindow(target)
    let native

    // COMPAT: In Firefox, `caretRangeFromPoint` doesn't exist. (2016/07/25)
    if (window.document.caretRangeFromPoint) {
      native = window.document.caretRangeFromPoint(x, y)
    } else if (window.document.caretPositionFromPoint) {
      const position = window.document.caretPositionFromPoint(x, y)
      native = window.document.createRange()
      native.setStart(position.offsetNode, position.offset)
      native.setEnd(position.offsetNode, position.offset)
    } else if (window.document.body.createTextRange) {
      // COMPAT: In IE, `caretRangeFromPoint` and
      // `caretPositionFromPoint` don't exist. (2018/07/11)
      native = window.document.body.createTextRange()

      try {
        native.moveToPoint(x, y)
      } catch (error) {
        // IE11 will raise an `unspecified error` if `moveToPoint` is
        // called during a dropEvent.
        return null
      }
    }

    // Resolve a Slate range from the DOM range.
    const range = editor.findRange(native)
    return range
  }

  /**
   * Find the path of a native DOM `element` by searching React refs.
   *
   * @param {Editor} editor
   * @param {Element} element
   * @return {List|Null}
   */

  function findPath(editor, element) {
    const content = editor.tmp.contentRef.current
    let nodeElement = element

    // If element does not have a key, it is likely a string or
    // mark, return the closest parent Node that can be looked up.
    if (!nodeElement.hasAttribute(DATA_ATTRS.KEY)) {
      nodeElement = nodeElement.closest(SELECTORS.KEY)
    }

    if (!nodeElement || !nodeElement.getAttribute(DATA_ATTRS.KEY)) {
      return null
    }

    if (nodeElement === content.ref.current) {
      return PathUtils.create([])
    }

    const search = (instance, p) => {
      if (nodeElement === instance) {
        return p
      }

      if (!instance.ref) {
        return null
      }

      if (nodeElement === instance.ref.current) {
        return p
      }

      // If there's no `tmp` then we're at a leaf node without success.
      if (!instance.tmp) {
        return null
      }

      const { nodeRefs } = instance.tmp
      const keys = Object.keys(nodeRefs)

      for (const i of keys) {
        const ref = nodeRefs[i]
        const n = parseInt(i, 10)
        const path = search(ref, [...p, n])

        if (path) {
          return path
        }
      }

      return null
    }

    const document = content.tmp.nodeRef.current
    const path = search(document, [])

    if (!path) {
      return null
    }

    return PathUtils.create(path)
  }

  /**
   * Find a Slate point from a DOM selection's `nativeNode` and `nativeOffset`.
   *
   * @param {Editor} editor
   * @param {Element} nativeNode
   * @param {Number} nativeOffset
   * @return {Point}
   */

  function findPoint(editor, nativeNode, nativeOffset) {
    const { node: nearestNode, offset: nearestOffset } = normalizeNodeAndOffset(
      nativeNode,
      nativeOffset
    )

    const window = getWindow(nativeNode)
    const { parentNode } = nearestNode
    let leafNode = parentNode.closest(SELECTORS.LEAF)
    let textNode
    let offset
    let node

    // Calculate how far into the text node the `nearestNode` is, so that we can
    // determine what the offset relative to the text node is.
    if (leafNode) {
      textNode = leafNode.closest(SELECTORS.TEXT)
      const range = window.document.createRange()
      range.setStart(textNode, 0)
      range.setEnd(nearestNode, nearestOffset)
      const contents = range.cloneContents()
      const zeroWidths = contents.querySelectorAll(SELECTORS.ZERO_WIDTH)

      Array.from(zeroWidths).forEach(el => {
        el.parentNode.removeChild(el)
      })

      // COMPAT: Edge has a bug where Range.prototype.toString() will convert \n
      // into \r\n. The bug causes a loop when slate-react attempts to reposition
      // its cursor to match the native position. Use textContent.length instead.
      // https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/10291116/
      offset = contents.textContent.length
      node = textNode
    } else {
      // For void nodes, the element with the offset key will be a cousin, not an
      // ancestor, so find it by going down from the nearest void parent.
      const voidNode = parentNode.closest(SELECTORS.VOID)

      if (!voidNode) {
        return null
      }

      leafNode = voidNode.querySelector(SELECTORS.LEAF)

      if (!leafNode) {
        return null
      }

      textNode = leafNode.closest(SELECTORS.TEXT)
      node = leafNode
      offset = node.textContent.length
    }

    // COMPAT: If the parent node is a Slate zero-width space, this is because the
    // text node should have no characters. However, during IME composition the
    // ASCII characters will be prepended to the zero-width space, so subtract 1
    // from the offset to account for the zero-width space character.
    if (
      offset === node.textContent.length &&
      parentNode.hasAttribute(DATA_ATTRS.ZERO_WIDTH)
    ) {
      offset--
    }

    // COMPAT: If someone is clicking from one Slate editor into another, the
    // select event fires twice, once for the old editor's `element` first, and
    // then afterwards for the correct `element`. (2017/03/03)
    const path = editor.findPath(textNode)

    if (!path) {
      return null
    }

    const { value } = editor
    const { document } = value
    const point = document.createPoint({ path, offset })
    return point
  }

  /**
   * Find a Slate range from a DOM range or selection.
   *
   * @param {Editor} editor
   * @param {Selection} domRange
   * @return {Range}
   */

  function findRange(editor, domRange) {
    const el = domRange.anchorNode || domRange.startContainer

    if (!el) {
      return null
    }

    const window = getWindow(el)

    // If the `domRange` object is a DOM `Range` or `StaticRange` object, change it
    // into something that looks like a DOM `Selection` instead.
    if (
      domRange instanceof window.Range ||
      (window.StaticRange && domRange instanceof window.StaticRange)
    ) {
      domRange = {
        anchorNode: domRange.startContainer,
        anchorOffset: domRange.startOffset,
        focusNode: domRange.endContainer,
        focusOffset: domRange.endOffset,
      }
    }

    const {
      anchorNode,
      anchorOffset,
      focusNode,
      focusOffset,
      isCollapsed,
    } = domRange
    const { value } = editor
    const anchor = editor.findPoint(anchorNode, anchorOffset)
    const focus = isCollapsed
      ? anchor
      : editor.findPoint(focusNode, focusOffset)

    if (!anchor || !focus) {
      return null
    }

    const { document } = value
    const range = document.createRange({
      anchor,
      focus,
    })

    return range
  }

  /**
   * Find a Slate selection from a DOM selection.
   *
   * @param {Editor} editor
   * @param {Selection} domSelection
   * @return {Range}
   */

  function findSelection(editor, domSelection) {
    const { value } = editor
    const { document } = value

    // If there are no ranges, the editor was blurred natively.
    if (!domSelection.rangeCount) {
      return null
    }

    // Otherwise, determine the Slate selection from the native one.
    let range = editor.findRange(domSelection)

    if (!range) {
      return null
    }

    const { anchor, focus } = range
    const anchorText = document.getNode(anchor.path)
    const focusText = document.getNode(focus.path)
    const anchorInline = document.getClosestInline(anchor.path)
    const focusInline = document.getClosestInline(focus.path)
    const focusBlock = document.getClosestBlock(focus.path)
    const anchorBlock = document.getClosestBlock(anchor.path)

    // COMPAT: If the anchor point is at the start of a non-void, and the
    // focus point is inside a void node with an offset that isn't `0`, set
    // the focus offset to `0`. This is due to void nodes <span>'s being
    // positioned off screen, resulting in the offset always being greater
    // than `0`. Since we can't know what it really should be, and since an
    // offset of `0` is less destructive because it creates a hanging
    // selection, go with `0`. (2017/09/07)
    if (
      anchorBlock &&
      !editor.isVoid(anchorBlock) &&
      anchor.offset === 0 &&
      focusBlock &&
      editor.isVoid(focusBlock) &&
      focus.offset !== 0
    ) {
      range = range.setFocus(focus.setOffset(0))
    }

    // COMPAT: If the selection is at the end of a non-void inline node, and
    // there is a node after it, put it in the node after instead. This
    // standardizes the behavior, since it's indistinguishable to the user.
    if (
      anchorInline &&
      !editor.isVoid(anchorInline) &&
      anchor.offset === anchorText.text.length
    ) {
      const block = document.getClosestBlock(anchor.path)
      const depth = document.getDepth(block.key)
      const relativePath = PathUtils.drop(anchor.path, depth)
      const [next] = block.texts({ path: relativePath })

      if (next) {
        const [, nextPath] = next
        const absolutePath = anchor.path.slice(0, depth).concat(nextPath)
        range = range.moveAnchorTo(absolutePath, 0)
      }
    }

    if (
      focusInline &&
      !editor.isVoid(focusInline) &&
      focus.offset === focusText.text.length
    ) {
      const block = document.getClosestBlock(focus.path)
      const depth = document.getDepth(block.key)
      const relativePath = PathUtils.drop(focus.path, depth)
      const [next] = block.texts({ path: relativePath })

      if (next) {
        const [, nextPath] = next
        const absolutePath = focus.path.slice(0, depth).concat(nextPath)
        range = range.moveFocusTo(absolutePath, 0)
      }
    }

    let selection = document.createSelection(range)

    // COMPAT: Ensure that the `isFocused` argument is set.
    selection = selection.setIsFocused(true)

    // COMPAT: Preserve the marks, since we have no way of knowing what the DOM
    // selection's marks were. They will be cleared automatically by the
    // `select` command if the selection moves.
    selection = selection.set('marks', value.selection.marks)

    return selection
  }

  return {
    queries: {
      findDOMNode,
      findDOMPoint,
      findDOMRange,
      findEventRange,
      findNode,
      findPath,
      findPoint,
      findRange,
      findSelection,
    },
  }
}

/**
 * From a DOM selection's `node` and `offset`, normalize so that it always
 * refers to a text node.
 *
 * @param {Element} node
 * @param {Number} offset
 * @return {Object}
 */

function normalizeNodeAndOffset(node, offset) {
  // If it's an element node, its offset refers to the index of its children
  // including comment nodes, so try to find the right text child node.
  if (node.nodeType === 1 && node.childNodes.length) {
    const isLast = offset === node.childNodes.length
    const direction = isLast ? 'backward' : 'forward'
    const index = isLast ? offset - 1 : offset
    node = getEditableChild(node, index, direction)

    // If the node has children, traverse until we have a leaf node. Leaf nodes
    // can be either text nodes, or other void DOM nodes.
    while (node.nodeType === 1 && node.childNodes.length) {
      const i = isLast ? node.childNodes.length - 1 : 0
      node = getEditableChild(node, i, direction)
    }

    // Determine the new offset inside the text node.
    offset = isLast ? node.textContent.length : 0
  }

  // Return the node and offset.
  return { node, offset }
}

/**
 * Get the nearest editable child at `index` in a `parent`, preferring
 * `direction`.
 *
 * @param {Element} parent
 * @param {Number} index
 * @param {String} direction ('forward' or 'backward')
 * @return {Element|Null}
 */

function getEditableChild(parent, index, direction) {
  const { childNodes } = parent
  let child = childNodes[index]
  let i = index
  let triedForward = false
  let triedBackward = false

  // While the child is a comment node, or an element node with no children,
  // keep iterating to find a sibling non-void, non-comment node.
  while (
    child.nodeType === 8 ||
    (child.nodeType === 1 && child.childNodes.length === 0) ||
    (child.nodeType === 1 && child.getAttribute('contenteditable') === 'false')
  ) {
    if (triedForward && triedBackward) break

    if (i >= childNodes.length) {
      triedForward = true
      i = index - 1
      direction = 'backward'
      continue
    }

    if (i < 0) {
      triedBackward = true
      i = index + 1
      direction = 'forward'
      continue
    }

    child = childNodes[i]
    if (direction === 'forward') i++
    if (direction === 'backward') i--
  }

  return child || null
}

/**
 * Export.
 *
 * @type {Function}
 */

export default QueriesPlugin
