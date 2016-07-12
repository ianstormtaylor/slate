
import Key from '../utils/key'
import OffsetKey from '../utils/offset-key'
import Raw from '../serializers/raw'
import React from 'react'
import Text from './text'
import Void from './void'
import keycode from 'keycode'
import { IS_FIREFOX } from '../utils/environment'

/**
 * Noop.
 */

function noop() {}

/**
 * Content.
 */

class Content extends React.Component {

  /**
   * Property types.
   */

  static propTypes = {
    className: React.PropTypes.string,
    editor: React.PropTypes.object.isRequired,
    onBeforeInput: React.PropTypes.func,
    onChange: React.PropTypes.func,
    onKeyDown: React.PropTypes.func,
    onPaste: React.PropTypes.func,
    onSelect: React.PropTypes.func,
    renderMark: React.PropTypes.func.isRequired,
    renderNode: React.PropTypes.func.isRequired,
    state: React.PropTypes.object.isRequired,
    style: React.PropTypes.object
  };

  /**
   * Default properties.
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
  }

  /**
   * Should the component update?
   *
   * @param {Object} props
   * @param {Object} state
   * @return {Boolean} shouldUpdate
   */

  shouldComponentUpdate = (props, state) => {
    if (props.state.isNative) return false
    return (
      props.state.selection != this.props.state.selection ||
      props.state.document != this.props.state.document
    )
  }

  /**
   * While rendering set a flag, so that we can ignore any `select` events that
   * fire because of the leaf nodes updating their selection.
   *
   * @param {Object} props
   */

  componentWillUpdate = (props, state) => {
    this.tmp.isRendering = true
  }

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
    this.props.onBeforeInput(e)
  }

  /**
   * On blur, update the selection to be not focused.
   *
   * @param {Event} e
   */

  onBlur = (e) => {
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
    const raw = Raw.serializeNode(fragment)
    const string = JSON.stringify(raw)
    const encoded = window.btoa(string)

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
    native.selectAllChildren(div)

    // Revert to the previous selection right after copying.
    window.requestAnimationFrame(() => {
      body.removeChild(div)
      native.removeAllRanges()
      native.addRange(range)
      this.tmp.isCopying = false
    })
  }

  /**
   * On key down, prevent the default behavior of certain commands that will
   * leave the editor in an out-of-sync state, then bubble up.
   *
   * @param {Event} e
   */

  onKeyDown = (e) => {
    const key = keycode(e.which)

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
    e.preventDefault()
    const data = e.clipboardData
    const paste = {}

    // COMPAT: In Firefox, `types` is array-like.
    const types = Array.from(data.types)

    // Handle files.
    if (data.files.length != 0) {
      paste.type = 'files'
      paste.files = data.files
    }

    // Treat it as rich text if there is HTML content.
    else if (types.includes('text/html')) {
      paste.type = 'html'
      paste.text = data.getData('text/plain')
      paste.html = data.getData('text/html')
    }

    // Treat everything else as plain text.
    else {
      paste.type = 'text'
      paste.text = data.getData('text/plain')
    }

    // If html, and the html includes a `data-fragment` attribute, it's actually
    // a raw-serialized JSON fragment from a previous cut/copy, so deserialize
    // it and insert it normally.
    if (paste.type == 'html' && ~paste.html.indexOf('<span data-fragment="')) {
      const regexp = /data-fragment="([^\s]+)"/
      const matches = regexp.exec(paste.html)
      const [ full, encoded ] = matches
      const string = window.atob(encoded)
      const json = JSON.parse(string)
      const fragment = Raw.deserialize(json)
      let { state } = this.props

      state = state
        .transform()
        .insertFragment(fragment.document)
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
    if (this.tmp.isRendering) return
    if (this.tmp.isCopying) return

    let { state } = this.props
    let { document, selection } = state
    const native = window.getSelection()

    if (!native.rangeCount) {
      selection = selection.merge({ isFocused: false })
      state = state.merge({ selection })
      this.onChange(state)
      return
    }

    const { anchorNode, anchorOffset, focusNode, focusOffset } = native
    const anchor = OffsetKey.findPoint(anchorNode, anchorOffset)
    const focus = OffsetKey.findPoint(focusNode, focusOffset)

    state = state
      .transform()
      .focus()
      .moveTo({
        anchorKey: anchor.key,
        anchorOffset: anchor.offset,
        focusKey: focus.key,
        focusOffset: focus.offset
      })
      .apply({ isNative: true })

    this.onChange(state)
  }

  /**
   * Render the editor content.
   *
   * @return {Element} element
   */

  render = () => {
    const { className, state } = this.props
    const { document } = state
    const children = document.nodes
      .map(node => this.renderNode(node))
      .toArray()

    const style = {
      ...this.props.style,
      outline: 'none', // prevent the default outline styles
      whiteSpace: 'pre-wrap', // preserve adjacent whitespace and new lines
      wordWrap: 'break-word' // allow words to break if they are too long
    }

    return (
      <div
        className={className}
        contentEditable suppressContentEditableWarning
        style={style}
        onBeforeInput={this.onBeforeInput}
        onBlur={this.onBlur}
        onCopy={this.onCopy}
        onCut={this.onCut}
        onKeyDown={this.onKeyDown}
        onPaste={this.onPaste}
        onSelect={this.onSelect}
        onKeyUp={noop}
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
    switch (node.kind) {
      case 'block':
      case 'inline':
        return this.renderElement(node)
      case 'text':
        return this.renderText(node)
    }
  }

  /**
   * Render an element `node`.
   *
   * @param {Node} node
   * @return {Element} element
   */

  renderElement = (node) => {
    const { editor, renderNode, state } = this.props
    const Component = renderNode(node)
    const children = node.nodes
      .map(child => this.renderNode(child))
      .toArray()

    const attributes = {
      'data-key': node.key
    }

    const element = (
      <Component
        attributes={attributes}
        key={node.key}
        editor={editor}
        node={node}
        state={state}
      >
        {children}
      </Component>
    )

    return node.isVoid
      ? this.renderVoid(element, node)
      : element
  }

  /**
   * Render a void wrapper around an `element` for `node`.
   *
   * @param {Node} node
   * @param {Element} element
   * @return {Element} element
   */

  renderVoid = (element, node) => {
    const { editor, state } = this.props
    return (
      <Void
        key={node.key}
        editor={editor}
        node={node}
        state={state}
      >
        {element}
      </Void>
    )
  }

  /**
   * Render a text `node`.
   *
   * @param {Node} node
   * @return {Element} element
   */

  renderText = (node) => {
    const { editor, renderMark, state } = this.props
    return (
      <Text
        key={node.key}
        editor={editor}
        node={node}
        renderMark={renderMark}
        state={state}
      />
    )
  }

}

/**
 * Export.
 */

export default Content

