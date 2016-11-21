
import Base64 from '../serializers/base-64'
import Debug from 'debug'
import Node from './node'
import OffsetKey from '../utils/offset-key'
import React from 'react'
import ReactDOM from 'react-dom'
import Selection from '../models/selection'
import Transfer from '../utils/transfer'
import TYPES from '../constants/types'
import getWindow from 'get-window'
import keycode from 'keycode'
import noop from '../utils/noop'
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
    const { target } = event
    return target.isContentEditable && target === this.element
  }

  /**
   * On before input, bubble up.
   *
   * @param {Event} e
   */

  onBeforeInput = (e) => {
    if (this.props.readOnly) return
    if (!this.isInContentEditable(e)) return

    const data = {}

    debug('onBeforeInput', data)
    this.props.onBeforeInput(e, data)
  }

  /**
   * On blur, update the selection to be not focused.
   *
   * @param {Event} e
   */

  onBlur = (e) => {
    if (this.props.readOnly) return
    if (this.tmp.isCopying) return
    if (!this.isInContentEditable(e)) return

    const data = {}

    debug('onBlur', data)
    this.props.onBlur(e, data)
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
   * @param {Event} e
   */

  onCompositionStart = (e) => {
    if (!this.isInContentEditable(e)) return

    this.tmp.isComposing = true
    this.tmp.compositions++

    debug('onCompositionStart')
  }

  /**
   * On composition end, remove the `isComposing` flag on the next tick. Also
   * increment the `forces` key, which will force the contenteditable element
   * to completely re-render, since IME puts React in an unreconcilable state.
   *
   * @param {Event} e
   */

  onCompositionEnd = (e) => {
    if (!this.isInContentEditable(e)) return

    this.forces++
    const count = this.tmp.compositions

    // The `count` check here ensures that if another composition starts
    // before the timeout has closed out this one, we will abort unsetting the
    // `isComposing` flag, since a composition in still in affect.
    setTimeout(() => {
      if (this.tmp.compositions > count) return
      this.tmp.isComposing = false
    })

    debug('onCompositionEnd')
  }

  /**
   * On copy, defer to `onCutCopy`, then bubble up.
   *
   * @param {Event} e
   */

  onCopy = (e) => {
    if (!this.isInContentEditable(e)) return
    const window = getWindow(e.target)

    this.tmp.isCopying = true
    window.requestAnimationFrame(() => {
      this.tmp.isCopying = false
    })

    const { state } = this.props
    const data = {}
    data.type = 'fragment'
    data.fragment = state.fragment

    debug('onCopy', data)
    this.props.onCopy(e, data)
  }

  /**
   * On cut, defer to `onCutCopy`, then bubble up.
   *
   * @param {Event} e
   */

  onCut = (e) => {
    if (this.props.readOnly) return
    if (!this.isInContentEditable(e)) return
    const window = getWindow(e.target)

    this.tmp.isCopying = true
    window.requestAnimationFrame(() => {
      this.tmp.isCopying = false
    })

    const { state } = this.props
    const data = {}
    data.type = 'fragment'
    data.fragment = state.fragment

    debug('onCut', data)
    this.props.onCut(e, data)
  }

  /**
   * On drag end, unset the `isDragging` flag.
   *
   * @param {Event} e
   */

  onDragEnd = (e) => {
    if (!this.isInContentEditable(e)) return

    this.tmp.isDragging = false
    this.tmp.isInternalDrag = null

    debug('onDragEnd')
  }

  /**
   * On drag over, set the `isDragging` flag and the `isInternalDrag` flag.
   *
   * @param {Event} e
   */

  onDragOver = (e) => {
    if (!this.isInContentEditable(e)) return

    const { dataTransfer } = e.nativeEvent
    const transfer = new Transfer(dataTransfer)

    // Prevent default when nodes are dragged to allow dropping.
    if (transfer.getType() == 'node') {
      e.preventDefault()
    }

    if (this.tmp.isDragging) return
    this.tmp.isDragging = true
    this.tmp.isInternalDrag = false

    debug('onDragOver')
  }

  /**
   * On drag start, set the `isDragging` flag and the `isInternalDrag` flag.
   *
   * @param {Event} e
   */

  onDragStart = (e) => {
    if (!this.isInContentEditable(e)) return

    this.tmp.isDragging = true
    this.tmp.isInternalDrag = true
    const { dataTransfer } = e.nativeEvent
    const transfer = new Transfer(dataTransfer)

    // If it's a node being dragged, the data type is already set.
    if (transfer.getType() == 'node') return

    const { state } = this.props
    const { fragment } = state
    const encoded = Base64.serializeNode(fragment)
    dataTransfer.setData(TYPES.FRAGMENT, encoded)

    debug('onDragStart')
  }

  /**
   * On drop.
   *
   * @param {Event} e
   */

  onDrop = (e) => {
    if (this.props.readOnly) return
    if (!this.isInContentEditable(e)) return

    e.preventDefault()

    const window = getWindow(e.target)
    const { state } = this.props
    const { dataTransfer, x, y } = e.nativeEvent
    const transfer = new Transfer(dataTransfer)
    const data = transfer.getData()

    // Resolve the point where the drop occured.
    let range

    // COMPAT: In Firefox, `caretRangeFromPoint` doesn't exist. (2016/07/25)
    if (window.document.caretRangeFromPoint) {
      range = window.document.caretRangeFromPoint(x, y)
    } else {
      range = window.document.createRange()
      range.setStart(e.nativeEvent.rangeParent, e.nativeEvent.rangeOffset)
    }

    const startNode = range.startContainer
    const startOffset = range.startOffset
    const point = this.getPoint(startNode, startOffset)
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

    debug('onDrop', data)
    this.props.onDrop(e, data)
  }

  /**
   * On input, handle spellcheck and other similar edits that don't go trigger
   * the `onBeforeInput` and instead update the DOM directly.
   *
   * @param {Event} e
   */

  onInput = (e) => {
    if (this.tmp.isComposing) return
    if (this.props.state.isBlurred) return
    if (!this.isInContentEditable(e)) return
    debug('onInput')

    const window = getWindow(e.target)

    // Get the selection point.
    const native = window.getSelection()
    const { anchorNode, anchorOffset } = native
    const point = this.getPoint(anchorNode, anchorOffset)
    const { key, index, start, end } = point

    // Get the range in question.
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
   * @param {Event} e
   */

  onKeyDown = (e) => {
    if (this.props.readOnly) return
    if (!this.isInContentEditable(e)) return

    const key = keycode(e.which)
    const data = {}

    // When composing, these characters commit the composition but also move the
    // selection before we're able to handle it, so prevent their default,
    // selection-moving behavior.
    if (
      this.tmp.isComposing &&
      (key == 'left' || key == 'right' || key == 'up' || key == 'down')
    ) {
      e.preventDefault()
      return
    }

    // Add helpful properties for handling hotkeys to the data object.
    data.code = e.which
    data.key = key
    data.isAlt = e.altKey
    data.isCmd = IS_MAC ? e.metaKey && !e.altKey : false
    data.isCtrl = e.ctrlKey && !e.altKey
    data.isLine = IS_MAC ? e.metaKey : false
    data.isMeta = e.metaKey
    data.isMod = IS_MAC ? e.metaKey && !e.altKey : e.ctrlKey && !e.altKey
    data.isModAlt = IS_MAC ? e.metaKey && e.altKey : e.ctrlKey && e.altKey
    data.isShift = e.shiftKey
    data.isWord = IS_MAC ? e.altKey : e.ctrlKey

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
      e.preventDefault()
    }

    debug('onKeyDown', data)
    this.props.onKeyDown(e, data)
  }

  /**
   * On paste, determine the type and bubble up.
   *
   * @param {Event} e
   */

  onPaste = (e) => {
    if (this.props.readOnly) return
    if (!this.isInContentEditable(e)) return

    e.preventDefault()
    const transfer = new Transfer(e.clipboardData)
    const data = transfer.getData()

    debug('onPaste', data)
    this.props.onPaste(e, data)
  }

  /**
   * On select, update the current state's selection.
   *
   * @param {Event} e
   */

  onSelect = (e) => {
    if (this.props.readOnly) return
    if (this.tmp.isCopying) return
    if (this.tmp.isComposing) return
    if (!this.isInContentEditable(e)) return

    const window = getWindow(e.target)
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

      data.selection = selection
        .merge(properties)
        .normalize(document)
    }

    debug('onSelect', { data, selection: data.selection.toJS() })
    this.props.onSelect(e, data)
  }

  /**
   * Render the editor content.
   *
   * @return {Element}
   */

  render = () => {
    debug('render')

    const { className, readOnly, state } = this.props
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
      ...this.props.style,
    }

    // COMPAT: In Firefox, spellchecking can remove entire wrapping elements
    // including inline ones like `<a>`, which is jarring for the user but also
    // causes the DOM to get into an irreconcilable state. (2016/09/01)
    const spellCheck = IS_FIREFOX ? false : this.props.spellCheck

    return (
      <div
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
        onKeyUp={noop}
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
