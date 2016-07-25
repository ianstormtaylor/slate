
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
    onBeforeInput: React.PropTypes.func,
    onChange: React.PropTypes.func,
    onKeyDown: React.PropTypes.func,
    onPaste: React.PropTypes.func,
    onSelect: React.PropTypes.func,
    readOnly: React.PropTypes.bool,
    renderMark: React.PropTypes.func.isRequired,
    renderNode: React.PropTypes.func.isRequired,
    spellCheck: React.PropTypes.bool,
    state: React.PropTypes.object.isRequired,
    style: React.PropTypes.object
  };

  /**
   * Default properties.
   *
   * @type {Object}
   */

  static defaultProps = {
    readOnly: false,
    spellCheck: true,
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
    return props.state.isNative
      ? false
      : true
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
   * On before input, bubble up.
   *
   * @param {Event} e
   */

  onBeforeInput = (e) => {
    if (this.props.readOnly) return
    this.props.onBeforeInput(e)
  }

  /**
   * On blur, update the selection to be not focused.
   *
   * @param {Event} e
   */

  onBlur = (e) => {
    if (this.props.readOnly) return
    if (this.tmp.isCopying) return
    let { state } = this.props

    state = state
      .transform()
      .blur()
      .apply({ isNative: true })

    this.onChange(state)
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
    this.onCutCopy(e)
  }

  /**
   * On cut, defer to `onCutCopy`, then bubble up.
   *
   * @param {Event} e
   */

  onCut = (e) => {
    if (this.props.readOnly) return
    this.onCutCopy(e)

    // Once the cut has successfully executed, delete the current selection.
    window.requestAnimationFrame(() => {
      const state = this.props.state.transform().delete().apply()
      this.onChange(state)
    })
  }

  /**
   * On cut and copy, add the currently selected fragment to the currently
   * selected DOM, so that it will show up when pasted.
   *
   * @param {Event} e
   */

  onCutCopy = (e) => {
    const native = window.getSelection()
    if (!native.rangeCount) return

    const { state } = this.props
    const { fragment } = state
    const encoded = Base64.serializeNode(fragment)

    // Wrap the first character of the selection in a span that has the encoded
    // fragment attached as an attribute, so it will show up in the copied HTML.
    const range = native.getRangeAt(0)
    const contents = range.cloneContents()
    const wrapper = window.document.createElement('span')
    const text = contents.childNodes[0]
    const char = text.textContent.slice(0, 1)
    const first = window.document.createTextNode(char)
    const rest = text.textContent.slice(1)
    text.textContent = rest
    wrapper.appendChild(first)
    wrapper.setAttribute('data-fragment', encoded)
    contents.insertBefore(wrapper, text)

    // Add the phony content to the DOM, and select it, so it will be copied.
    const body = window.document.querySelector('body')
    const div = window.document.createElement('div')
    div.setAttribute('contenteditable', true)
    div.style.position = 'absolute'
    div.style.left = '-9999px'
    div.appendChild(contents)
    body.appendChild(div)

    // Set the `isCopying` flag, so our `onSelect` logic doesn't fire.
    this.tmp.isCopying = true
    const r = window.document.createRange()
    // COMPAT: In Firefox, trying to use the terser `native.selectAllChildren`
    // throws an error, so we use the older `range` equivalent. (2016/06/21)
    r.selectNodeContents(div)
    native.removeAllRanges()
    native.addRange(r)

    // Revert to the previous selection right after copying.
    window.requestAnimationFrame(() => {
      body.removeChild(div)
      native.removeAllRanges()
      native.addRange(range)
      this.tmp.isCopying = false
    })
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

    const { state } = this.props
    const { selection } = state
    const data = e.nativeEvent.dataTransfer
    const drop = {}

    // COMPAT: In Firefox, `types` is array-like. (2016/06/21)
    const types = Array.from(data.types)

    // Resolve the point where the drop occured.
    const { x, y } = e.nativeEvent
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
    const point = OffsetKey.findPoint(startNode, startOffset, state)
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
      const encoded = data.getData(TYPES.FRAGMENT)
      const fragment = Base64.deserializeNode(encoded)
      drop.type = 'fragment'
      drop.fragment = fragment
      drop.isInternal = this.tmp.isInternalDrag
    }

    // Handle Slate nodes.
    else if (includes(types, TYPES.NODE)) {
      const encoded = data.getData(TYPES.NODE)
      const node = Base64.deserializeNode(encoded)
      drop.type = 'node'
      drop.node = node
      drop.isInternal = this.tmp.isInternalDrag
    }

    // Handle files.
    else if (data.files.length) {
      drop.type = 'files'
      drop.files = data.files
    }

    // Handle HTML.
    else if (includes(types, TYPES.HTML)) {
      drop.type = 'html'
      drop.text = data.getData(TYPES.TEXT)
      drop.html = data.getData(TYPES.HTML)
    }

    // Handle plain text.
    else {
      drop.type = 'text'
      drop.text = data.getData(TYPES.TEXT)
    }

    drop.data = data
    drop.target = target
    drop.effect = data.dropEffect
    this.props.onDrop(e, drop)
  }

  /**
   * On input, handle spellcheck and other similar edits that don't go trigger
   * the `onBeforeInput` and instead update the DOM directly.
   *
   * @param {Event} e
   */

  onInput = (e) => {
    let { state } = this.props
    const { selection } = state
    const native = window.getSelection()
    const { anchorNode, anchorOffset, focusOffset } = native
    const { textContent } = anchorNode
    const offsetKey = OffsetKey.findKey(anchorNode)
    const { key, index } = OffsetKey.parse(offsetKey)
    const { start, end } = OffsetKey.findBounds(key, index, state)
    const range = OffsetKey.findRange(anchorNode, state)
    const { text, marks } = range

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

    let { state } = this.props
    let { document, selection } = state
    const native = window.getSelection()

    if (!native.rangeCount) {
      selection = selection.merge({ isFocused: false })
      state = state.merge({ selection })
      this.onChange(state)
      return
    }

    // Calculate the Slate-specific selection based on the native one.
    const { anchorNode, anchorOffset, focusNode, focusOffset } = native
    const anchor = OffsetKey.findPoint(anchorNode, anchorOffset, state)
    const focus = OffsetKey.findPoint(focusNode, focusOffset, state)

    // If the native selection is inside text nodes, we can trust the native
    // state and not need to re-render.
    const isNative = (
      anchorNode.nodeType == 3 &&
      focusNode.nodeType == 3
    )

    state = state
      .transform()
      .focus()
      .moveTo({
        anchorKey: anchor.key,
        anchorOffset: anchor.offset,
        focusKey: focus.key,
        focusOffset: focus.offset
      })
      .apply({ isNative })

    this.onChange(state)
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
    const { editor, renderMark, renderNode, state } = this.props
    return (
      <Node
        key={node.key}
        node={node}
        state={state}
        editor={editor}
        renderNode={renderNode}
        renderMark={renderMark}
      />
    )
  }

}

/**
 * Export.
 */

export default Content

