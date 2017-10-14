
import Base64 from 'slate-base64-serializer'
import Debug from 'debug'
import React from 'react'
import SlateTypes from 'slate-prop-types'
import Types from 'prop-types'
import getWindow from 'get-window'
import keycode from 'keycode'
import logger from 'slate-dev-logger'

import TRANSFER_TYPES from '../constants/transfer-types'
import Node from './node'
import findClosestNode from '../utils/find-closest-node'
import findDOMNode from '../utils/find-dom-node'
import findDOMRange from '../utils/find-dom-range'
import findPoint from '../utils/find-point'
import findRange from '../utils/find-range'
import getHtmlFromNativePaste from '../utils/get-html-from-native-paste'
import getTransferData from '../utils/get-transfer-data'
import scrollToSelection from '../utils/scroll-to-selection'
import setTransferData from '../utils/set-transfer-data'
import { IS_FIREFOX, IS_MAC, IS_IE } from '../constants/environment'

/**
 * Debug.
 *
 * @type {Function}
 */

const debug = Debug('slate:content')

/**
 * Content.
 *
 * @type {Component}
 */

class Content extends React.Component {

  /**
   * Property types.
   *
   * @type {Object}
   */

  static propTypes = {
    autoCorrect: Types.bool.isRequired,
    autoFocus: Types.bool.isRequired,
    children: Types.array.isRequired,
    className: Types.string,
    editor: Types.object.isRequired,
    onBeforeInput: Types.func.isRequired,
    onBlur: Types.func.isRequired,
    onCopy: Types.func.isRequired,
    onCut: Types.func.isRequired,
    onDrop: Types.func.isRequired,
    onFocus: Types.func.isRequired,
    onKeyDown: Types.func.isRequired,
    onKeyUp: Types.func.isRequired,
    onPaste: Types.func.isRequired,
    onSelect: Types.func.isRequired,
    readOnly: Types.bool.isRequired,
    role: Types.string,
    schema: SlateTypes.schema.isRequired,
    spellCheck: Types.bool.isRequired,
    state: SlateTypes.state.isRequired,
    style: Types.object,
    tabIndex: Types.number,
    tagName: Types.string,
  }

  /**
   * Default properties.
   *
   * @type {Object}
   */

  static defaultProps = {
    style: {},
    tagName: 'div',
  }

  /**
   * Constructor.
   *
   * @param {Object} props
   */

  constructor(props) {
    super(props)
    this.tmp = {}
    this.tmp.compositions = 0
    this.tmp.forces = 0
  }

  /**
   * When the editor first mounts in the DOM we need to:
   *
   *   - Update the selection, in case it starts focused.
   *   - Focus the editor if `autoFocus` is set.
   */

  componentDidMount = () => {
    this.updateSelection()

    if (this.props.autoFocus) {
      this.element.focus()
    }
  }

  /**
   * On update, update the selection.
   */

  componentDidUpdate = () => {
    this.updateSelection()
  }

  /**
   * Update the native DOM selection to reflect the internal model.
   */

  updateSelection = () => {
    const { state } = this.props
    const { selection } = state
    const window = getWindow(this.element)
    const native = window.getSelection()

    // If both selections are blurred, do nothing.
    if (!native.rangeCount && selection.isBlurred) return

    // If the selection has been blurred, but is still inside the editor in the
    // DOM, blur it manually.
    if (selection.isBlurred) {
      if (!this.isInEditor(native.anchorNode)) return
      native.removeAllRanges()
      this.element.blur()
      debug('updateSelection', { selection, native })
      return
    }

    // If the selection isn't set, do nothing.
    if (selection.isUnset) return

    // Otherwise, figure out which DOM nodes should be selected...
    const current = native.getRangeAt(0)
    const range = findDOMRange(selection)

    if (!range) {
      logger.error('Unable to find a native DOM range from the current selection.', { selection })
      return
    }

    // If the new range matches the current selection, do nothing.
    if (
      range.startContainer == current.startContainer &&
      range.startOffset == current.startOffset &&
      range.endContainer == current.endContainer &&
      range.endOffset == current.endOffset
    ) {
      return
    }

    // Otherwise, set the `isSelecting` flag and update the selection.
    this.tmp.isSelecting = true
    native.removeAllRanges()
    native.addRange(range)
    scrollToSelection(native)

    // Then unset the `isSelecting` flag after a delay.
    setTimeout(() => {
      // COMPAT: In Firefox, it's not enough to create a range, you also need to
      // focus the contenteditable element too. (2016/11/16)
      if (IS_FIREFOX) this.element.focus()
      this.tmp.isSelecting = false
    })

    debug('updateSelection', { selection, native })
  }

  /**
   * The React ref method to set the root content element locally.
   *
   * @param {Element} element
   */

  ref = (element) => {
    this.element = element
  }

  /**
   * Check if an event `target` is fired from within the contenteditable
   * element. This should be false for edits happening in non-contenteditable
   * children, such as void nodes and other nested Slate editors.
   *
   * @param {Element} target
   * @return {Boolean}
   */

  isInEditor = (target) => {
    const { element } = this
    // COMPAT: Text nodes don't have `isContentEditable` property. So, when
    // `target` is a text node use its parent node for check.
    const el = target.nodeType === 3 ? target.parentNode : target
    return (
      (el.isContentEditable) &&
      (el === element || findClosestNode(el, '[data-slate-editor]') === element)
    )
  }

  /**
   * On before input, bubble up.
   *
   * @param {Event} event
   */

  onBeforeInput = (event) => {
    if (this.props.readOnly) return
    if (!this.isInEditor(event.target)) return

    const data = {}

    debug('onBeforeInput', { event, data })
    this.props.onBeforeInput(event, data)
  }

  /**
   * On blur, update the selection to be not focused.
   *
   * @param {Event} event
   */

  onBlur = (event) => {
    if (this.props.readOnly) return
    if (this.tmp.isCopying) return
    if (!this.isInEditor(event.target)) return

    // If the active element is still the editor, the blur event is due to the
    // window itself being blurred (eg. when changing tabs) so we should ignore
    // the event, since we want to maintain focus when returning.
    const window = getWindow(this.element)
    if (window.document.activeElement == this.element) return

    const data = {}

    debug('onBlur', { event, data })
    this.props.onBlur(event, data)
  }

  /**
   * On focus, update the selection to be focused.
   *
   * @param {Event} event
   */

  onFocus = (event) => {
    if (this.props.readOnly) return
    if (this.tmp.isCopying) return
    if (!this.isInEditor(event.target)) return

    // COMPAT: If the editor has nested editable elements, the focus can go to
    // those elements. In Firefox, this must be prevented because it results in
    // issues with keyboard navigation. (2017/03/30)
    if (IS_FIREFOX && event.target != this.element) {
      this.element.focus()
      return
    }

    const data = {}

    debug('onFocus', { event, data })
    this.props.onFocus(event, data)
  }

  /**
   * On composition start, set the `isComposing` flag.
   *
   * @param {Event} event
   */

  onCompositionStart = (event) => {
    if (!this.isInEditor(event.target)) return

    this.tmp.isComposing = true
    this.tmp.compositions++

    debug('onCompositionStart', { event })
  }

  /**
   * On composition end, remove the `isComposing` flag on the next tick. Also
   * increment the `forces` key, which will force the contenteditable element
   * to completely re-render, since IME puts React in an unreconcilable state.
   *
   * @param {Event} event
   */

  onCompositionEnd = (event) => {
    if (!this.isInEditor(event.target)) return

    this.tmp.forces++
    const count = this.tmp.compositions

    // The `count` check here ensures that if another composition starts
    // before the timeout has closed out this one, we will abort unsetting the
    // `isComposing` flag, since a composition in still in affect.
    setTimeout(() => {
      if (this.tmp.compositions > count) return
      this.tmp.isComposing = false
    })

    debug('onCompositionEnd', { event })
  }

  /**
   * On copy, defer to `onCutCopy`, then bubble up.
   *
   * @param {Event} event
   */

  onCopy = (event) => {
    if (!this.isInEditor(event.target)) return
    const window = getWindow(event.target)

    this.tmp.isCopying = true
    window.requestAnimationFrame(() => {
      this.tmp.isCopying = false
    })

    const { state } = this.props
    const data = {}
    data.type = 'fragment'
    data.fragment = state.fragment

    debug('onCopy', { event, data })
    this.props.onCopy(event, data)
  }

  /**
   * On cut, defer to `onCutCopy`, then bubble up.
   *
   * @param {Event} event
   */

  onCut = (event) => {
    if (this.props.readOnly) return
    if (!this.isInEditor(event.target)) return
    const window = getWindow(event.target)

    this.tmp.isCopying = true
    window.requestAnimationFrame(() => {
      this.tmp.isCopying = false
    })

    const { state } = this.props
    const data = {}
    data.type = 'fragment'
    data.fragment = state.fragment

    debug('onCut', { event, data })
    this.props.onCut(event, data)
  }

  /**
   * On drag end, unset the `isDragging` flag.
   *
   * @param {Event} event
   */

  onDragEnd = (event) => {
    event.stopPropagation()

    this.tmp.isDragging = false
    this.tmp.isInternalDrag = null

    debug('onDragEnd', { event })
  }

  /**
   * On drag over, set the `isDragging` flag and the `isInternalDrag` flag.
   *
   * @param {Event} event
   */

  onDragOver = (event) => {
    event.stopPropagation()

    if (this.tmp.isDragging) return
    this.tmp.isDragging = true
    this.tmp.isInternalDrag = false

    debug('onDragOver', { event })
  }

  /**
   * On drag start, set the `isDragging` flag and the `isInternalDrag` flag.
   *
   * @param {Event} event
   */

  onDragStart = (event) => {
    if (!this.isInEditor(event.target)) return

    this.tmp.isDragging = true
    this.tmp.isInternalDrag = true
    const { dataTransfer } = event.nativeEvent
    const data = getTransferData(dataTransfer)

    // If it's a node being dragged, the data type is already set.
    if (data.type == 'node') return

    const { state } = this.props
    const { fragment } = state
    const encoded = Base64.serializeNode(fragment)

    setTransferData(dataTransfer, TRANSFER_TYPES.FRAGMENT, encoded)

    debug('onDragStart', { event })
  }

  /**
   * On drop.
   *
   * @param {Event} event
   */

  onDrop = (event) => {
    event.stopPropagation()
    event.preventDefault()

    if (this.props.readOnly) return

    const { state } = this.props
    const { nativeEvent } = event
    const { dataTransfer, x, y } = nativeEvent
    const data = getTransferData(dataTransfer)

    // Resolve a range from the caret position where the drop occured.
    const window = getWindow(event.target)
    let range

    // COMPAT: In Firefox, `caretRangeFromPoint` doesn't exist. (2016/07/25)
    if (window.document.caretRangeFromPoint) {
      range = window.document.caretRangeFromPoint(x, y)
    } else {
      const position = window.document.caretPositionFromPoint(x, y)
      range = window.document.createRange()
      range.setStart(position.offsetNode, position.offset)
      range.setEnd(position.offsetNode, position.offset)
    }

    // Resolve a Slate range from the DOM range.
    let selection = findRange(range, state)
    if (!selection) return

    const { document } = state
    const node = document.getNode(selection.anchorKey)
    const parent = document.getParent(node.key)
    const el = findDOMNode(parent)

    // If the drop target is inside a void node, move it into either the next or
    // previous node, depending on which side the `x` and `y` coordinates are
    // closest to.
    if (parent.isVoid) {
      const rect = el.getBoundingClientRect()
      const isPrevious = parent.kind == 'inline'
        ? x - rect.left < rect.left + rect.width - x
        : y - rect.top < rect.top + rect.height - y

      selection = isPrevious
        ? selection.moveToEndOf(document.getPreviousText(node.key))
        : selection.moveToStartOf(document.getNextText(node.key))
    }

    // Add drop-specific information to the data.
    data.target = selection

    // COMPAT: Edge throws "Permission denied" errors when
    // accessing `dropEffect` or `effectAllowed` (2017/7/12)
    try {
      data.effect = dataTransfer.dropEffect
    } catch (err) {
      data.effect = null
    }

    if (data.type == 'fragment' || data.type == 'node') {
      data.isInternal = this.tmp.isInternalDrag
    }

    debug('onDrop', { event, data })
    this.props.onDrop(event, data)
  }

  /**
   * On input, handle spellcheck and other similar edits that don't go trigger
   * the `onBeforeInput` and instead update the DOM directly.
   *
   * @param {Event} event
   */

  onInput = (event) => {
    if (this.tmp.isComposing) return
    if (this.props.state.isBlurred) return
    if (!this.isInEditor(event.target)) return
    debug('onInput', { event })

    const window = getWindow(event.target)
    const { state, editor } = this.props

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
    editor.change((change) => {
      change
        .select(entire)
        .delete()
        .insertText(textContent, leaf.marks)
        .select(corrected)
    })
  }

  /**
   * On key down, prevent the default behavior of certain commands that will
   * leave the editor in an out-of-sync state, then bubble up.
   *
   * @param {Event} event
   */

  onKeyDown = (event) => {
    if (this.props.readOnly) return
    if (!this.isInEditor(event.target)) return

    const { altKey, ctrlKey, metaKey, shiftKey, which } = event
    const key = keycode(which)
    const data = {}

    // Keep track of an `isShifting` flag, because it's often used to trigger
    // "Paste and Match Style" commands, but isn't available on the event in a
    // normal paste event.
    if (key == 'shift') {
      this.tmp.isShifting = true
    }

    // When composing, these characters commit the composition but also move the
    // selection before we're able to handle it, so prevent their default,
    // selection-moving behavior.
    if (
      this.tmp.isComposing &&
      (key == 'left' || key == 'right' || key == 'up' || key == 'down')
    ) {
      event.preventDefault()
      return
    }

    // Add helpful properties for handling hotkeys to the data object.
    data.code = which
    data.key = key
    data.isAlt = altKey
    data.isCmd = IS_MAC ? metaKey && !altKey : false
    data.isCtrl = ctrlKey && !altKey
    data.isLine = IS_MAC ? metaKey : false
    data.isMeta = metaKey
    data.isMod = IS_MAC ? metaKey && !altKey : ctrlKey && !altKey
    data.isModAlt = IS_MAC ? metaKey && altKey : ctrlKey && altKey
    data.isShift = shiftKey
    data.isWord = IS_MAC ? altKey : ctrlKey

    // These key commands have native behavior in contenteditable elements which
    // will cause our state to be out of sync, so prevent them.
    if (
      (key == 'enter') ||
      (key == 'backspace') ||
      (key == 'delete') ||
      (key == 'b' && data.isMod) ||
      (key == 'i' && data.isMod) ||
      (key == 'y' && data.isMod) ||
      (key == 'z' && data.isMod)
    ) {
      event.preventDefault()
    }

    debug('onKeyDown', { event, data })
    this.props.onKeyDown(event, data)
  }

  /**
   * On key up, unset the `isShifting` flag.
   *
   * @param {Event} event
   */

  onKeyUp = (event) => {
    const { altKey, ctrlKey, metaKey, shiftKey, which } = event
    const key = keycode(which)
    const data = {}

    if (key == 'shift') {
      this.tmp.isShifting = false
    }

    // Add helpful properties for handling hotkeys to the data object.
    data.code = which
    data.key = key
    data.isAlt = altKey
    data.isCmd = IS_MAC ? metaKey && !altKey : false
    data.isCtrl = ctrlKey && !altKey
    data.isLine = IS_MAC ? metaKey : false
    data.isMeta = metaKey
    data.isMod = IS_MAC ? metaKey && !altKey : ctrlKey && !altKey
    data.isModAlt = IS_MAC ? metaKey && altKey : ctrlKey && altKey
    data.isShift = shiftKey
    data.isWord = IS_MAC ? altKey : ctrlKey

    debug('onKeyUp', { event, data })
    this.props.onKeyUp(event, data)
  }

  /**
   * On paste, determine the type and bubble up.
   *
   * @param {Event} event
   */

  onPaste = (event) => {
    if (this.props.readOnly) return
    if (!this.isInEditor(event.target)) return

    const data = getTransferData(event.clipboardData)

    // Attach the `isShift` flag, so that people can use it to trigger "Paste
    // and Match Style" logic.
    data.isShift = !!this.tmp.isShifting
    debug('onPaste', { event, data })

    // COMPAT: In IE 11, only plain text can be retrieved from the event's
    // `clipboardData`. To get HTML, use the browser's native paste action which
    // can only be handled synchronously. (2017/06/23)
    if (IS_IE) {
      // Do not use `event.preventDefault()` as we need the native paste action.
      getHtmlFromNativePaste(event.target, (html) => {
        // If pasted HTML can be retreived, it is added to the `data` object,
        // setting the `type` to `html`.
        this.props.onPaste(event, html === undefined ? data : { ...data, html, type: 'html' })
      })
    } else {
      event.preventDefault()
      this.props.onPaste(event, data)
    }
  }

  /**
   * On select, update the current state's selection.
   *
   * @param {Event} event
   */

  onSelect = (event) => {
    if (this.props.readOnly) return
    if (this.tmp.isCopying) return
    if (this.tmp.isComposing) return
    if (this.tmp.isSelecting) return
    if (!this.isInEditor(event.target)) return

    const window = getWindow(event.target)
    const { state } = this.props
    const { document, selection } = state
    const native = window.getSelection()
    const data = {}

    // If there are no ranges, the editor was blurred natively.
    if (!native.rangeCount) {
      data.selection = selection.set('isFocused', false)
    }

    // Otherwise, determine the Slate selection from the native one.
    else {
      let range = findRange(native, state)
      if (!range) return

      // There are situations where a select event will fire with a new native
      // selection that resolves to the same internal position. In those cases
      // we don't need to trigger any changes, since our internal model is
      // already up to date, but we do want to update the native selection again
      // to make sure it is in sync.
      if (range.equals(selection)) {
        this.updateSelection()
        return
      }

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
      data.selection = range
    }

    debug('onSelect', { event, data })
    this.props.onSelect(event, data)
  }

  /**
   * Render the editor content.
   *
   * @return {Element}
   */

  render() {
    const { props } = this
    const { className, readOnly, state, tabIndex, role, tagName } = props
    const Container = tagName
    const { document, selection } = state
    const indexes = document.getSelectionIndexes(selection, selection.isFocused)
    const children = document.nodes.toArray().map((child, i) => {
      const isSelected = !!indexes && indexes.start <= i && i < indexes.end
      return this.renderNode(child, isSelected)
    })

    const style = {
      // Prevent the default outline styles.
      outline: 'none',
      // Preserve adjacent whitespace and new lines.
      whiteSpace: 'pre-wrap',
      // Allow words to break if they are too long.
      wordWrap: 'break-word',
      // COMPAT: In iOS, a formatting menu with bold, italic and underline
      // buttons is shown which causes our internal state to get out of sync in
      // weird ways. This hides that. (2016/06/21)
      ...(readOnly ? {} : { WebkitUserModify: 'read-write-plaintext-only' }),
      // Allow for passed-in styles to override anything.
      ...props.style,
    }

    // COMPAT: In Firefox, spellchecking can remove entire wrapping elements
    // including inline ones like `<a>`, which is jarring for the user but also
    // causes the DOM to get into an irreconcilable state. (2016/09/01)
    const spellCheck = IS_FIREFOX ? false : props.spellCheck

    debug('render', { props })

    return (
      <Container
        data-slate-editor
        key={this.tmp.forces}
        ref={this.ref}
        data-key={document.key}
        contentEditable={readOnly ? null : true}
        suppressContentEditableWarning
        className={className}
        onBeforeInput={this.onBeforeInput}
        onBlur={this.onBlur}
        onFocus={this.onFocus}
        onCompositionEnd={this.onCompositionEnd}
        onCompositionStart={this.onCompositionStart}
        onCopy={this.onCopy}
        onCut={this.onCut}
        onDragEnd={this.onDragEnd}
        onDragOver={this.onDragOver}
        onDragStart={this.onDragStart}
        onDrop={this.onDrop}
        onInput={this.onInput}
        onKeyDown={this.onKeyDown}
        onKeyUp={this.onKeyUp}
        onPaste={this.onPaste}
        onSelect={this.onSelect}
        autoCorrect={props.autoCorrect ? 'on' : 'off'}
        spellCheck={spellCheck}
        style={style}
        role={readOnly ? null : (role || 'textbox')}
        tabIndex={tabIndex}
        // COMPAT: The Grammarly Chrome extension works by changing the DOM out
        // from under `contenteditable` elements, which leads to weird behaviors
        // so we have to disable it like this. (2017/04/24)
        data-gramm={false}
      >
        {children}
        {this.props.children}
      </Container>
    )
  }

  /**
   * Render a `child` node of the document.
   *
   * @param {Node} child
   * @param {Boolean} isSelected
   * @return {Element}
   */

  renderNode = (child, isSelected) => {
    const { editor, readOnly, schema, state } = this.props
    const { document, decorations } = state
    let decs = document.getDecorations(schema)
    if (decorations) decs = decorations.concat(decs)
    return (
      <Node
        block={null}
        editor={editor}
        decorations={decs}
        isSelected={isSelected}
        key={child.key}
        node={child}
        parent={document}
        readOnly={readOnly}
        schema={schema}
        state={state}
      />
    )
  }

}

/**
 * Export.
 *
 * @type {Component}
 */

export default Content
