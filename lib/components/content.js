
import Base64 from '../serializers/base-64'
import Key from '../utils/key'
import Node from './node'
import OffsetKey from '../utils/offset-key'
import Raw from '../serializers/raw'
import React from 'react'
import Selection from '../models/selection'
import TYPES from '../utils/types'
import includes from 'lodash/includes'
import keycode from 'keycode'
import { IS_FIREFOX } from '../utils/environment'

/**
 * Noop.
 *
 * @type {Function}
 */

function noop() {}

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
    onKeyDown: React.PropTypes.func.isRequired,
    onPaste: React.PropTypes.func.isRequired,
    onSelect: React.PropTypes.func.isRequired,
    readOnly: React.PropTypes.bool.isRequired,
    renderDecorations: React.PropTypes.func.isRequired,
    renderMark: React.PropTypes.func.isRequired,
    renderNode: React.PropTypes.func.isRequired,
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
   * @return {Boolean} shouldUpdate
   */

  shouldComponentUpdate = (props, state) => {
    return (
      props.className != this.props.className ||
      props.readOnly != this.props.readOnly ||
      props.spellCheck != this.props.spellCheck ||
      props.style != this.props.style ||
      props.state.isNative !== true
    )
  }

  /**
   * While rendering, set the `isRendering` flag.
   *
   * @param {Object} props
   * @param {Object} state]
   */

  componentWillUpdate = (props, state) => {
    this.tmp.isRendering = true
  }

  /**
   * When finished rendering, move the `isRendering` flag on next tick.
   *
   * @param {Object} props
   * @param {Object} state]
   */

  componentDidUpdate = (props, state) => {
    setTimeout(() => {
      this.tmp.isRendering = false
    })
  }

  /**
   * Get a point from a native selection's DOM `element` and `offset`.
   *
   * @param {Element} element
   * @param {Number} offset
   * @return {Object}
   */

  getPoint(element, offset) {
    const offsetKey = OffsetKey.findKey(element, offset)
    const ranges = this.getRanges(offsetKey.key)
    const point = OffsetKey.findPoint(offsetKey, ranges)
    return point
  }

  /**
   * Get the ranges for a text node by `key`.
   *
   * @param {String} key
   * @return {List}
   */

  getRanges(key) {
    const { state, renderDecorations } = this.props
    const node = state.document.getDescendant(key)
    const block = state.document.getClosestBlock(node)
    const ranges = node.getDecoratedRanges(block, renderDecorations)
    return ranges
  }

  /**
   * On before input, bubble up.
   *
   * @param {Event} e
   */

  onBeforeInput = (e) => {
    if (this.props.readOnly) return

    const data = {}
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

    const data = {}
    this.props.onBlur(e, data)
  }

  /**
   * On change, bubble up.
   *
   * @param {State} state
   */

  onChange = (state) => {
    this.props.onChange(state)
  }

  /**
   * On composition start, set the `isComposing` flag.
   *
   * @param {Event} e
   */

  onCompositionStart = (e) => {
    this.tmp.isComposing = true
    this.tmp.compositions++
  }

  /**
   * On composition end, remove the `isComposing` flag on the next tick. Also
   * increment the `forces` key, which will force the contenteditable element
   * to completely re-render, since IME puts React in an unreconcilable state.
   *
   * @param {Event} e
   */

  onCompositionEnd = (e) => {
    this.forces++
    const count = this.tmp.compositions

    // The `count` check here ensures that if another composition starts
    // before the timeout has closed out this one, we will abort unsetting the
    // `isComposing` flag, since a composition in still in affect.
    setTimeout(() => {
      if (this.tmp.compositions > count) return
      this.tmp.isComposing = false
    })
  }

  /**
   * On copy, defer to `onCutCopy`, then bubble up.
   *
   * @param {Event} e
   */

  onCopy = (e) => {
    this.tmp.isCopying = true
    window.requestAnimationFrame(() => {
      this.tmp.isCopying = false
    })

    const { state } = this.props
    const data = {}
    data.type = 'fragment'
    data.fragment = state.fragment
    this.props.onCopy(e, data)
  }

  /**
   * On cut, defer to `onCutCopy`, then bubble up.
   *
   * @param {Event} e
   */

  onCut = (e) => {
    if (this.props.readOnly) return

    this.tmp.isCopying = true
    window.requestAnimationFrame(() => {
      this.tmp.isCopying = false
    })

    const { state } = this.props
    const data = {}
    data.type = 'fragment'
    data.fragment = state.fragment
    this.props.onCut(e, data)
  }

  /**
   * On drag end, unset the `isDragging` flag.
   *
   * @param {Event} e
   */

  onDragEnd = (e) => {
    this.tmp.isDragging = false
    this.tmp.isInternalDrag = null
  }

  /**
   * On drag over, set the `isDragging` flag and the `isInternalDrag` flag.
   *
   * @param {Event} e
   */

  onDragOver = (e) => {
    const data = e.nativeEvent.dataTransfer
    // COMPAT: In Firefox, `types` is array-like. (2016/06/21)
    const types = Array.from(data.types)

    // Prevent default when nodes are dragged to allow dropping.
    if (includes(types, TYPES.NODE)) {
      e.preventDefault()
    }

    if (this.tmp.isDragging) return
    this.tmp.isDragging = true
    this.tmp.isInternalDrag = false
  }

  /**
   * On drag start, set the `isDragging` flag and the `isInternalDrag` flag.
   *
   * @param {Event} e
   */

  onDragStart = (e) => {
    this.tmp.isDragging = true
    this.tmp.isInternalDrag = true
    const data = e.nativeEvent.dataTransfer
    // COMPAT: In Firefox, `types` is array-like. (2016/06/21)
    const types = Array.from(data.types)

    // If it's a node being dragged, the data type is already set.
    if (includes(types, TYPES.NODE)) return

    const { state } = this.props
    const { fragment } = state
    const encoded = Base64.serializeNode(fragment)
    data.setData(TYPES.FRAGMENT, encoded)
  }

  /**
   * On drop.
   *
   * @param {Event} e
   */

  onDrop = (e) => {
    if (this.props.readOnly) return
    e.preventDefault()

    const { state, renderDecorations } = this.props
    const { selection } = state
    const { dataTransfer, x, y } = e.nativeEvent
    const data = {}

    // COMPAT: In Firefox, `types` is array-like. (2016/06/21)
    const types = Array.from(dataTransfer.types)

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

    // Handle Slate fragments.
    if (includes(types, TYPES.FRAGMENT)) {
      const encoded = dataTransfer.getData(TYPES.FRAGMENT)
      const fragment = Base64.deserializeNode(encoded)
      data.type = 'fragment'
      data.fragment = fragment
      data.isInternal = this.tmp.isInternalDrag
    }

    // Handle Slate nodes.
    else if (includes(types, TYPES.NODE)) {
      const encoded = dataTransfer.getData(TYPES.NODE)
      const node = Base64.deserializeNode(encoded)
      data.type = 'node'
      data.node = node
      data.isInternal = this.tmp.isInternalDrag
    }

    // Handle files.
    else if (dataTransfer.files.length) {
      data.type = 'files'
      data.files = dataTransfer.files
    }

    // Handle HTML.
    else if (includes(types, TYPES.HTML)) {
      data.type = 'html'
      data.text = dataTransfer.getData(TYPES.TEXT)
      data.html = dataTransfer.getData(TYPES.HTML)
    }

    // Handle plain text.
    else {
      data.type = 'text'
      data.text = dataTransfer.getData(TYPES.TEXT)
    }

    data.target = target
    data.effect = dataTransfer.dropEffect
    this.props.onDrop(e, data)
  }

  /**
   * On input, handle spellcheck and other similar edits that don't go trigger
   * the `onBeforeInput` and instead update the DOM directly.
   *
   * @param {Event} e
   */

  onInput = (e) => {
    let { state, renderDecorations } = this.props
    const { selection } = state
    const native = window.getSelection()
    const { anchorNode, anchorOffset, focusOffset } = native
    const point = this.getPoint(anchorNode, anchorOffset)
    const { key, index, start, end } = point
    const ranges = this.getRanges(key)
    const range = ranges.get(index)
    const { text, marks } = range
    let { textContent } = anchorNode

    // COMPAT: If the DOM text ends in a new line, we will have added one to
    // account for browsers collapsing a single one, so remove it.
    if (textContent.charAt(textContent.length - 1) == '\n') {
      textContent = textContent.slice(0, -1)
    }

    // If the text is no different, abort.
    if (textContent == text) return

    // Determine what the selection should be after changing the text.
    const delta = textContent.length - text.length
    const after = selection.collapseToEnd().moveForward(delta)

    // Create an updated state with the text replaced.
    state = state
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
    this.onChange(state)
  }

  /**
   * On key down, prevent the default behavior of certain commands that will
   * leave the editor in an out-of-sync state, then bubble up.
   *
   * @param {Event} e
   */

  onKeyDown = (e) => {
    if (this.props.readOnly) return
    const key = keycode(e.which)

    if (
      this.tmp.isComposing &&
      (key == 'left' || key == 'right' || key == 'up' || key == 'down')
    ) {
      e.preventDefault()
      return
    }

    if (
      (key == 'enter') ||
      (key == 'backspace') ||
      (key == 'delete') ||
      (key == 'b' && Key.isCommand(e)) ||
      (key == 'i' && Key.isCommand(e)) ||
      (key == 'y' && Key.isWindowsCommand(e)) ||
      (key == 'z' && Key.isCommand(e))
    ) {
      e.preventDefault()
    }

    this.props.onKeyDown(e)
  }

  /**
   * On paste, determine the type and bubble up.
   *
   * @param {Event} e
   */

  onPaste = (e) => {
    if (this.props.readOnly) return
    e.preventDefault()

    const data = e.clipboardData
    const paste = {}

    // COMPAT: In Firefox, `types` is array-like. (2016/06/21)
    const types = Array.from(data.types)

    // Handle files.
    if (data.files.length) {
      paste.type = 'files'
      paste.files = data.files
    }

    // Treat it as rich text if there is HTML content.
    else if (includes(types, TYPES.HTML)) {
      paste.type = 'html'
      paste.text = data.getData(TYPES.TEXT)
      paste.html = data.getData(TYPES.HTML)
    }

    // Treat everything else as plain text.
    else {
      paste.type = 'text'
      paste.text = data.getData(TYPES.TEXT)
    }

    // If html, and the html includes a `data-fragment` attribute, it's actually
    // a raw-serialized JSON fragment from a previous cut/copy, so deserialize
    // it and insert it normally.
    if (paste.type == 'html' && ~paste.html.indexOf('<span data-fragment="')) {
      const regexp = /data-fragment="([^\s]+)"/
      const matches = regexp.exec(paste.html)
      const [ full, encoded ] = matches
      const fragment = Base64.deserializeNode(encoded)
      let { state } = this.props

      state = state
        .transform()
        .insertFragment(fragment)
        .apply()

      this.onChange(state)
      return
    }

    paste.data = data
    this.props.onPaste(e, paste)
  }

  /**
   * On select, update the current state's selection.
   *
   * @param {Event} e
   */

  onSelect = (e) => {
    if (this.props.readOnly) return
    if (this.tmp.isRendering) return
    if (this.tmp.isCopying) return
    if (this.tmp.isComposing) return

    const { state, renderDecorations } = this.props
    let { document, selection } = state
    const native = window.getSelection()
    const select = {}

    // If there are no ranges, the editor was blurred natively.
    if (!native.rangeCount) {
      select.selection = selection.merge({ isFocused: false })
      select.isNative = true
    }

    // Otherwise, determine the Slate selection from the native one.
    else {
      const { anchorNode, anchorOffset, focusNode, focusOffset } = native
      const anchor = this.getPoint(anchorNode, anchorOffset)
      const focus = this.getPoint(focusNode, focusOffset)

      // COMPAT: In Firefox, and potentially other browsers, sometimes a select
      // event will fire that resolves to the same location as the current
      // selection, so we can ignore it.
      if (
        anchor.key == selection.anchorKey &&
        anchor.offset == selection.anchorOffset &&
        focus.key == selection.focusKey &&
        focus.offset == selection.focusOffset
      ) {
        return
      }

      // If the native selection is inside text nodes, we can trust the native
      // state and not need to re-render.
      select.isNative = (
        anchorNode.nodeType == 3 &&
        focusNode.nodeType == 3
      )

      select.selection = selection.merge({
        anchorKey: anchor.key,
        anchorOffset: anchor.offset,
        focusKey: focus.key,
        focusOffset: focus.offset,
        isFocused: true
      })
    }

    this.props.onSelect(e, select)
  }

  /**
   * Render the editor content.
   *
   * @return {Element} element
   */

  render = () => {
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
    // causes the DOM to get into an irreconilable state.
    const spellCheck = IS_FIREFOX ? false : this.props.spellCheck

    return (
      <div
        key={`slate-content-${this.forces}`}
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
   * @return {Element} element
   */

  renderNode = (node) => {
    const { editor, renderDecorations, renderMark, renderNode, state } = this.props
    return (
      <Node
        key={node.key}
        node={node}
        state={state}
        editor={editor}
        renderDecorations={renderDecorations}
        renderMark={renderMark}
        renderNode={renderNode}
      />
    )
  }

}

/**
 * Export.
 */

export default Content
