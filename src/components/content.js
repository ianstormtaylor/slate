
import Base64 from '../serializers/base-64'
import Debug from 'debug'
import Node from './node'
import OffsetKey from '../utils/offset-key'
import React from 'react'
import ReactDOM from 'react-dom'
import Selection from '../models/selection'
import getTransferData from '../utils/get-transfer-data'
import TYPES from '../constants/types'
import getWindow from 'get-window'
import keycode from 'keycode'
import { IS_FIREFOX, IS_MAC } from '../constants/environment'

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
    className: React.PropTypes.string,
    editor: React.PropTypes.object.isRequired,
    onBeforeInput: React.PropTypes.func.isRequired,
    onBlur: React.PropTypes.func.isRequired,
    onChange: React.PropTypes.func.isRequired,
    onCopy: React.PropTypes.func.isRequired,
    onCut: React.PropTypes.func.isRequired,
    onDrop: React.PropTypes.func.isRequired,
    onKeyDown: React.PropTypes.func.isRequired,
    onPaste: React.PropTypes.func.isRequired,
    onSelect: React.PropTypes.func.isRequired,
    readOnly: React.PropTypes.bool.isRequired,
    schema: React.PropTypes.object,
    spellCheck: React.PropTypes.bool.isRequired,
    state: React.PropTypes.object.isRequired,
    style: React.PropTypes.object
  };

  /**
   * Default properties.
   *
   * @type {Object}
   */

  static defaultProps = {
    style: {}
  };

  /**
   * Constructor.
   *
   * @param {Object} props
   */

  constructor(props) {
    super(props)
    this.tmp = {}
    this.tmp.compositions = 0
    this.forces = 0
  }

  /**
   * Should the component update?
   *
   * @param {Object} props
   * @param {Object} state
   * @return {Boolean}
   */

  shouldComponentUpdate = (props, state) => {
    // If the readOnly state has changed, we need to re-render so that
    // the cursor will be added or removed again.
    if (props.readOnly != this.props.readOnly) return true

    // If the state has been transformed natively, never re-render, or else we
    // will end up duplicating content.
    if (props.state.isNative) return false

    return (
      props.className != this.props.className ||
      props.schema != this.props.schema ||
      props.spellCheck != this.props.spellCheck ||
      props.state != this.props.state ||
      props.style != this.props.style
    )
  }

  /**
   * On update, if the state is blurred now, but was focused before, and the
   * DOM still has a node inside the editor selected, we need to blur it.
   *
   * @param {Object} prevProps
   * @param {Object} prevState
   */

  componentDidUpdate = (prevProps, prevState) => {
    if (this.props.state.isBlurred && prevProps.state.isFocused) {
      const el = ReactDOM.findDOMNode(this)
      const window = getWindow(el)
      const native = window.getSelection()
      if (!el.contains(native.anchorNode)) return
      native.removeAllRanges()
      el.blur()
    }
  }

  /**
   * Get a point from a native selection's DOM `element` and `offset`.
   *
   * @param {Element} element
   * @param {Number} offset
   * @return {Object}
   */

  getPoint(element, offset) {
    const { state, editor } = this.props
    const { document } = state
    const schema = editor.getSchema()
    const offsetKey = OffsetKey.findKey(element, offset)
    if (!offsetKey) return null

    const { key } = offsetKey
    const node = document.getDescendant(key)
    const decorators = document.getDescendantDecorators(key, schema)
    const ranges = node.getRanges(decorators)
    const point = OffsetKey.findPoint(offsetKey, ranges)
    return point
  }

  /**
   * The React ref method to set the root content element locally.
   *
   * @param {Element} n
   */

  ref = (element) => {
    this.element = element
  }

  /**
   * Check if an `event` is being fired from within the contenteditable element.
   * This will return false for edits happening in non-contenteditable children,
   * such as void nodes and other nested Slate editors.
   *
   * @param {Event} event
   * @return {Boolean}
   */

  isInContentEditable = (event) => {
    const { element } = this
    const { target } = event
    return (
      (target.isContentEditable) &&
      (target === element || target.closest('[data-slate-editor]') === element)
    )
  }

  /**
   * On before input, bubble up.
   *
   * @param {Event} event
   */

  onBeforeInput = (event) => {
    if (this.props.readOnly) return
    if (!this.isInContentEditable(event)) return

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
    if (!this.isInContentEditable(event)) return

    const data = {}

    debug('onBlur', { event, data })
    this.props.onBlur(event, data)
  }

  /**
   * On change, bubble up.
   *
   * @param {State} state
   */

  onChange = (state) => {
    debug('onChange', state)
    this.props.onChange(state)
  }

  /**
   * On composition start, set the `isComposing` flag.
   *
   * @param {Event} event
   */

  onCompositionStart = (event) => {
    if (!this.isInContentEditable(event)) return

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
    if (!this.isInContentEditable(event)) return

    this.forces++
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
    if (!this.isInContentEditable(event)) return
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
    if (!this.isInContentEditable(event)) return
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
    if (!this.isInContentEditable(event)) return

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
    if (!this.isInContentEditable(event)) return

    const { dataTransfer } = event.nativeEvent
    const data = getTransferData(dataTransfer)

    // Prevent default when nodes are dragged to allow dropping.
    if (data.type == 'node') {
      event.preventDefault()
    }

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
    if (!this.isInContentEditable(event)) return

    this.tmp.isDragging = true
    this.tmp.isInternalDrag = true
    const { dataTransfer } = event.nativeEvent
    const data = getTransferData(dataTransfer)

    // If it's a node being dragged, the data type is already set.
    if (data.type == 'node') return

    const { state } = this.props
    const { fragment } = state
    const encoded = Base64.serializeNode(fragment)
    dataTransfer.setData(TYPES.FRAGMENT, encoded)

    debug('onDragStart', { event })
  }

  /**
   * On drop.
   *
   * @param {Event} event
   */

  onDrop = (event) => {
    if (this.props.readOnly) return
    if (!this.isInContentEditable(event)) return

    event.preventDefault()

    const window = getWindow(event.target)
    const { state } = this.props
    const { nativeEvent } = event
    const { dataTransfer, x, y } = nativeEvent
    const data = getTransferData(dataTransfer)

    // Resolve the point where the drop occured.
    let range

    // COMPAT: In Firefox, `caretRangeFromPoint` doesn't exist. (2016/07/25)
    if (window.document.caretRangeFromPoint) {
      range = window.document.caretRangeFromPoint(x, y)
    } else {
      range = window.document.createRange()
      range.setStart(nativeEvent.rangeParent, nativeEvent.rangeOffset)
    }

    const startNode = range.startContainer
    const startOffset = range.startOffset
    const point = this.getPoint(startNode, startOffset)
    if (!point) return

    const target = Selection.create({
      anchorKey: point.key,
      anchorOffset: point.offset,
      focusKey: point.key,
      focusOffset: point.offset,
      isFocused: true
    })

    // If the target is inside a void node, abort.
    if (state.document.hasVoidParent(point.key)) return

    // Add drop-specific information to the data.
    data.target = target
    data.effect = dataTransfer.dropEffect

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
    if (!this.isInContentEditable(event)) return
    debug('onInput', { event })

    const window = getWindow(event.target)

    // Get the selection point.
    const native = window.getSelection()
    const { anchorNode, anchorOffset } = native
    const point = this.getPoint(anchorNode, anchorOffset)
    if (!point) return

    // Get the range in question.
    const { key, index, start, end } = point
    const { state, editor } = this.props
    const { document, selection } = state
    const schema = editor.getSchema()
    const decorators = document.getDescendantDecorators(key, schema)
    const node = document.getDescendant(key)
    const block = document.getClosestBlock(node.key)
    const ranges = node.getRanges(decorators)
    const lastText = block.getLastText()

    // Get the text information.
    let { textContent } = anchorNode
    const lastChar = textContent.charAt(textContent.length - 1)
    const isLastText = node == lastText
    const isLastRange = index == ranges.size - 1

    // If we're dealing with the last leaf, and the DOM text ends in a new line,
    // we will have added another new line in <Leaf>'s render method to account
    // for browsers collapsing a single trailing new lines, so remove it.
    if (isLastText && isLastRange && lastChar == '\n') {
      textContent = textContent.slice(0, -1)
    }

    // If the text is no different, abort.
    const range = ranges.get(index)
    const { text, marks } = range
    if (textContent == text) return

    // Determine what the selection should be after changing the text.
    const delta = textContent.length - text.length
    const after = selection.collapseToEnd().moveForward(delta)

    // Create an updated state with the text replaced.
    const next = state
      .transform()
      .moveTo({
        anchorKey: key,
        anchorOffset: start,
        focusKey: key,
        focusOffset: end
      })
      .delete()
      .insertText(textContent, marks)
      .moveTo(after)
      .apply()

    // Change the current state.
    this.onChange(next)
  }

  /**
   * On key down, prevent the default behavior of certain commands that will
   * leave the editor in an out-of-sync state, then bubble up.
   *
   * @param {Event} event
   */

  onKeyDown = (event) => {
    if (this.props.readOnly) return
    if (!this.isInContentEditable(event)) return

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
    const { which } = event
    const key = keycode(which)

    if (key == 'shift') {
      this.tmp.isShifting = false
    }
  }

  /**
   * On paste, determine the type and bubble up.
   *
   * @param {Event} event
   */

  onPaste = (event) => {
    if (this.props.readOnly) return
    if (!this.isInContentEditable(event)) return

    event.preventDefault()
    const data = getTransferData(event.clipboardData)

    // Attach the `isShift` flag, so that people can use it to trigger "Paste
    // and Match Style" logic.
    data.isShift = !!this.tmp.isShifting

    debug('onPaste', { event, data })
    this.props.onPaste(event, data)
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
    if (!this.isInContentEditable(event)) return

    const window = getWindow(event.target)
    const { state } = this.props
    let { document, selection } = state
    const native = window.getSelection()
    const data = {}

    // If there are no ranges, the editor was blurred natively.
    if (!native.rangeCount) {
      data.selection = selection.merge({ isFocused: false })
      data.isNative = true
    }

    // Otherwise, determine the Slate selection from the native one.
    else {
      const { anchorNode, anchorOffset, focusNode, focusOffset } = native
      const anchor = this.getPoint(anchorNode, anchorOffset)
      const focus = this.getPoint(focusNode, focusOffset)
      if (!anchor || !focus) return

      // There are valid situations where a select event will fire when we're
      // already at that position (for example when entering a character), since
      // our `insertText` transform already updates the selection. In those
      // cases we can safely ignore the event.
      if (
        anchor.key == selection.anchorKey &&
        anchor.offset == selection.anchorOffset &&
        focus.key == selection.focusKey &&
        focus.offset == selection.focusOffset &&
        selection.isFocused
      ) {
        return
      }

      const properties = {
        anchorKey: anchor.key,
        anchorOffset: anchor.offset,
        focusKey: focus.key,
        focusOffset: focus.offset,
        isFocused: true,
        isBackward: null
      }

      // If the selection is at the end of a non-void inline node, and there is
      // a node after it, put it in the node after instead.
      const anchorText = document.getNode(anchor.key)
      const focusText = document.getNode(focus.key)
      const anchorInline = document.getClosestInline(anchor.key)
      const focusInline = document.getClosestInline(focus.key)

      if (anchorInline && !anchorInline.isVoid && anchor.offset == anchorText.length) {
        const block = document.getClosestBlock(anchor.key)
        const next = block.getNextText(anchor.key)
        if (next) {
          properties.anchorKey = next.key
          properties.anchorOffset = 0
        }
      }

      if (focusInline && !focusInline.isVoid && focus.offset == focusText.length) {
        const block = document.getClosestBlock(focus.key)
        const next = block.getNextText(focus.key)
        if (next) {
          properties.focusKey = next.key
          properties.focusOffset = 0
        }
      }

      data.selection = selection
        .merge(properties)
        .normalize(document)
    }

    debug('onSelect', { event, data })
    this.props.onSelect(event, data)
  }

  /**
   * Render the editor content.
   *
   * @return {Element}
   */

  render = () => {
    const { props } = this
    const { className, readOnly, state } = props
    const { document } = state
    const children = document.nodes
      .map(node => this.renderNode(node))
      .toArray()

    let style = {
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
      <div
        data-slate-editor
        key={this.forces}
        ref={this.ref}
        contentEditable={!readOnly}
        suppressContentEditableWarning
        className={className}
        onBeforeInput={this.onBeforeInput}
        onBlur={this.onBlur}
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
        spellCheck={spellCheck}
        style={style}
      >
        {children}
      </div>
    )
  }

  /**
   * Render a `node`.
   *
   * @param {Node} node
   * @return {Element}
   */

  renderNode = (node) => {
    const { editor, schema, state } = this.props

    return (
      <Node
        key={node.key}
        node={node}
        parent={state.document}
        schema={schema}
        state={state}
        editor={editor}
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
