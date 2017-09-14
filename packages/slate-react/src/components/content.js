
import Debug from 'debug'
import React from 'react'
import SlateTypes from 'slate-prop-types'
import Types from 'prop-types'
import getWindow from 'get-window'

import Node from './node'
import extendSelection from '../utils/extend-selection'
import findClosestNode from '../utils/find-closest-node'
import getCaretPosition from '../utils/get-caret-position'
import getPoint from '../utils/get-point'
import { IS_FIREFOX } from '../constants/environment'

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
    onCompositionEnd: Types.func.isRequired,
    onCompositionStart: Types.func.isRequired,
    onCopy: Types.func.isRequired,
    onCut: Types.func.isRequired,
    onDragEnd: Types.func.isRequired,
    onDragOver: Types.func.isRequired,
    onDragStart: Types.func.isRequired,
    onDrop: Types.func.isRequired,
    onFocus: Types.func.isRequired,
    onInput: Types.func.isRequired,
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
    const { editor, state } = this.props
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
    const { anchorKey, anchorOffset, focusKey, focusOffset, isCollapsed } = selection
    const anchor = getCaretPosition(anchorKey, anchorOffset, state, editor, this.element)
    const focus = isCollapsed
      ? anchor
      : getCaretPosition(focusKey, focusOffset, state, editor, this.element)

    // If they are already selected, do nothing.
    if (
      anchor.node == native.anchorNode &&
      anchor.offset == native.anchorOffset &&
      focus.node == native.focusNode &&
      focus.offset == native.focusOffset
    ) {
      return
    }

    // Otherwise, set the `isUpdatingSelection` flag and update the selection.
    this.tmp.isUpdatingSelection = true
    native.removeAllRanges()
    const range = window.document.createRange()
    range.setStart(anchor.node, anchor.offset)
    native.addRange(range)
    if (!isCollapsed) extendSelection(native, focus.node, focus.offset)

    // Then unset the `isUpdatingSelection` flag after a delay.
    setTimeout(() => {
      // COMPAT: In Firefox, it's not enough to create a range, you also need to
      // focus the contenteditable element too. (2016/11/16)
      if (IS_FIREFOX) this.element.focus()
      this.tmp.isUpdatingSelection = false
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
   * Call a `handler` with an `event` and `data`.
   *
   * @param {String} handler
   * @param {Event} event
   * @param {Object} data
   */

  handle = (handler, event, data = {}) => {
    const fn = this.props[handler]
    debug(handler, { event })
    fn(event, data)
  }

  /**
   * On before input.
   *
   * @param {Event} event
   */

  onBeforeInput = (event) => {
    if (this.props.readOnly) return
    if (!this.isInEditor(event.target)) return
    this.handle('onBeforeInput', event)
  }

  /**
   * On blur.
   *
   * @param {Event} event
   */

  onBlur = (event) => {
    if (this.props.readOnly) return
    if (!this.isInEditor(event.target)) return

    // If the active element is still the editor, the blur event is due to the
    // window itself being blurred (eg. when changing tabs) so we should ignore
    // the event, since we want to maintain focus when returning.
    const window = getWindow(this.element)
    if (window.document.activeElement == this.element) return

    this.handle('onBlur', event)
  }

  /**
   * On composition start.
   *
   * @param {Event} event
   */

  onCompositionStart = (event) => {
    if (this.props.readOnly) return
    if (!this.isInEditor(event.target)) return
    this.handle('onCompositionStart', event)
  }

  /**
   * On composition end.
   *
   * @param {Event} event
   */

  onCompositionEnd = (event) => {
    if (this.props.readOnly) return
    if (!this.isInEditor(event.target)) return

    // Increment the `forces` key, which will force the contenteditable element
    // to completely re-render, since IME puts React in an unreconcilable state.
    this.tmp.forces++

    this.handle('onCompositionEnd', event)
  }

  /**
   * On copy.
   *
   * @param {Event} event
   */

  onCopy = (event) => {
    if (!this.isInEditor(event.target)) return
    this.handle('onCopy', event)
  }

  /**
   * On cut.
   *
   * @param {Event} event
   */

  onCut = (event) => {
    if (this.props.readOnly) return
    if (!this.isInEditor(event.target)) return
    this.handle('onCut', event)
  }

  /**
   * On drag end.
   *
   * @param {Event} event
   */

  onDragEnd = (event) => {
    if (!this.isInEditor(event.target)) return
    this.handle('onDragEnd', event)
  }

  /**
   * On drag over.
   *
   * @param {Event} event
   */

  onDragOver = (event) => {
    if (!this.isInEditor(event.target)) return
    this.handle('onDragOver', event)
  }

  /**
   * On drag start.
   *
   * @param {Event} event
   */

  onDragStart = (event) => {
    if (!this.isInEditor(event.target)) return
    this.handle('onDragStart', event)
  }

  /**
   * On drop.
   *
   * @param {Event} event
   */

  onDrop = (event) => {
    // TODO: why does this need to be here and not in the before plugin?
    event.preventDefault()
    if (this.props.readOnly) return
    if (!this.isInEditor(event.target)) return
    this.handle('onDrop', event)
  }

  /**
   * On focus.
   *
   * @param {Event} event
   */

  onFocus = (event) => {
    if (this.props.readOnly) return
    if (!this.isInEditor(event.target)) return

    // COMPAT: If the editor has nested editable elements, the focus can go to
    // those elements. In Firefox, this must be prevented because it results in
    // issues with keyboard navigation. (2017/03/30)
    if (IS_FIREFOX && event.target != this.element) {
      this.element.focus()
      return
    }

    this.handle('onFocus', event)
  }

  /**
   * On input.
   *
   * @param {Event} event
   */

  onInput = (event) => {
    if (this.props.readOnly) return
    if (!this.isInEditor(event.target)) return
    this.handle('onInput', event)
  }

  /**
   * On key down.
   *
   * @param {Event} event
   */

  onKeyDown = (event) => {
    if (this.props.readOnly) return
    if (!this.isInEditor(event.target)) return
    this.handle('onKeyDown', event)
  }

  /**
   * On key up.
   *
   * @param {Event} event
   */

  onKeyUp = (event) => {
    if (this.props.readOnly) return
    if (!this.isInEditor(event.target)) return
    this.handle('onKeyUp', event)
  }

  /**
   * On paste.
   *
   * @param {Event} event
   */

  onPaste = (event) => {
    if (this.props.readOnly) return
    if (!this.isInEditor(event.target)) return
    this.handle('onPaste', event)
  }

  /**
   * On select.
   *
   * @param {Event} event
   */

  onSelect = (event) => {
    if (this.props.readOnly) return
    if (this.tmp.isUpdatingSelection) return
    if (!this.isInEditor(event.target)) return

    const window = getWindow(event.target)
    const native = window.getSelection()
    const { state, editor } = this.props
    const { selection } = state

    // If there is a native selection range, check if we should abort...
    if (native.rangeCount) {
      const { anchorNode, anchorOffset, focusNode, focusOffset } = native
      const anchor = getPoint(anchorNode, anchorOffset, state, editor)
      const focus = getPoint(focusNode, focusOffset, state, editor)

      // If we're unable to resolve the anchor or focus, abort.
      if (!anchor || !focus) return

      // There are situations where a select event will fire with a new native
      // selection that resolves to the same internal position. In those cases
      // we don't need to trigger any changes, since our internal model is
      // already up to date, but we do want to update the native selection again
      // to make sure it is in sync.
      if (
        anchor &&
        focus &&
        anchor.key == selection.anchorKey &&
        anchor.offset == selection.anchorOffset &&
        focus.key == selection.focusKey &&
        focus.offset == selection.focusOffset &&
        selection.isFocused
      ) {
        this.updateSelection()
        return
      }
    }

    this.handle('onSelect', event)
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
        contentEditable={!readOnly}
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
        autoCorrect={props.autoCorrect}
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
    const { document } = state
    return (
      <Node
        block={null}
        editor={editor}
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
