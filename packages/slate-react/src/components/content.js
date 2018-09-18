import Debug from 'debug'
import React from 'react'
import Types from 'prop-types'
import getWindow from 'get-window'
import warning from 'slate-dev-warning'
import throttle from 'lodash/throttle'
import { IS_FIREFOX, HAS_INPUT_EVENTS_LEVEL_2 } from 'slate-dev-environment'

import EVENT_HANDLERS from '../constants/event-handlers'
import Node from './node'
import findDOMRange from '../utils/find-dom-range'
import findRange from '../utils/find-range'
import getChildrenDecorations from '../utils/get-children-decorations'
import scrollToSelection from '../utils/scroll-to-selection'
import removeAllRanges from '../utils/remove-all-ranges'

const FIREFOX_NODE_TYPE_ACCESS_ERROR = /Permission denied to access property "nodeType"/

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
    className: Types.string,
    editor: Types.object.isRequired,
    readOnly: Types.bool.isRequired,
    role: Types.string,
    spellCheck: Types.bool.isRequired,
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
   * Temporary values.
   *
   * @type {Object}
   */

  tmp = {
    isUpdatingSelection: false,
  }

  /**
   * Create a set of bound event handlers.
   *
   * @type {Object}
   */

  handlers = EVENT_HANDLERS.reduce((obj, handler) => {
    obj[handler] = event => this.onEvent(handler, event)
    return obj
  }, {})

  /**
   * When the editor first mounts in the DOM we need to:
   *
   *   - Add native DOM event listeners.
   *   - Update the selection, in case it starts focused.
   */

  componentDidMount() {
    const window = getWindow(this.element)

    window.document.addEventListener(
      'selectionchange',
      this.onNativeSelectionChange
    )

    // COMPAT: Restrict scope of `beforeinput` to clients that support the
    // Input Events Level 2 spec, since they are preventable events.
    if (HAS_INPUT_EVENTS_LEVEL_2) {
      this.element.addEventListener('beforeinput', this.handlers.onBeforeInput)
    }

    this.updateSelection()
  }

  /**
   * When unmounting, remove DOM event listeners.
   */

  componentWillUnmount() {
    const window = getWindow(this.element)

    if (window) {
      window.document.removeEventListener(
        'selectionchange',
        this.onNativeSelectionChange
      )
    }

    if (HAS_INPUT_EVENTS_LEVEL_2) {
      this.element.removeEventListener(
        'beforeinput',
        this.handlers.onBeforeInput
      )
    }
  }

  /**
   * On update, update the selection.
   */

  componentDidUpdate() {
    this.updateSelection()
  }

  /**
   * Update the native DOM selection to reflect the internal model.
   */

  updateSelection = () => {
    const { editor } = this.props
    const { value } = editor
    const { selection } = value
    const { isBackward } = selection
    const window = getWindow(this.element)
    const native = window.getSelection()

    // .getSelection() can return null in some cases
    // https://bugzilla.mozilla.org/show_bug.cgi?id=827585
    if (!native) return

    const { rangeCount, anchorNode } = native

    // If both selections are blurred, do nothing.
    if (!rangeCount && selection.isBlurred) return

    // If the selection has been blurred, but is still inside the editor in the
    // DOM, blur it manually.
    if (selection.isBlurred) {
      if (!this.isInEditor(anchorNode)) return
      removeAllRanges(native)
      this.element.blur()
      debug('updateSelection', { selection, native })
      return
    }

    // If the selection isn't set, do nothing.
    if (selection.isUnset) return

    // Otherwise, figure out which DOM nodes should be selected...
    const current = !!rangeCount && native.getRangeAt(0)
    const range = findDOMRange(selection, window)

    if (!range) {
      warning(
        false,
        'Unable to find a native DOM range from the current selection.'
      )

      return
    }

    const { startContainer, startOffset, endContainer, endOffset } = range

    // If the new range matches the current selection, there is nothing to fix.
    // COMPAT: The native `Range` object always has it's "start" first and "end"
    // last in the DOM. It has no concept of "backwards/forwards", so we have
    // to check both orientations here. (2017/10/31)
    if (current) {
      if (
        (startContainer == current.startContainer &&
          startOffset == current.startOffset &&
          endContainer == current.endContainer &&
          endOffset == current.endOffset) ||
        (startContainer == current.endContainer &&
          startOffset == current.endOffset &&
          endContainer == current.startContainer &&
          endOffset == current.startOffset)
      ) {
        return
      }
    }

    // Otherwise, set the `isUpdatingSelection` flag and update the selection.
    this.tmp.isUpdatingSelection = true
    removeAllRanges(native)

    // COMPAT: IE 11 does not support Selection.setBaseAndExtent
    if (native.setBaseAndExtent) {
      // COMPAT: Since the DOM range has no concept of backwards/forwards
      // we need to check and do the right thing here.
      if (isBackward) {
        native.setBaseAndExtent(
          range.endContainer,
          range.endOffset,
          range.startContainer,
          range.startOffset
        )
      } else {
        native.setBaseAndExtent(
          range.startContainer,
          range.startOffset,
          range.endContainer,
          range.endOffset
        )
      }
    } else {
      // COMPAT: IE 11 does not support Selection.extend, fallback to addRange
      native.addRange(range)
    }

    // Scroll to the selection, in case it's out of view.
    scrollToSelection(native)

    // Then unset the `isUpdatingSelection` flag after a delay.
    setTimeout(() => {
      // COMPAT: In Firefox, it's not enough to create a range, you also need to
      // focus the contenteditable element too. (2016/11/16)
      if (IS_FIREFOX && this.element) this.element.focus()
      this.tmp.isUpdatingSelection = false
    })

    debug('updateSelection', { selection, native })
  }

  /**
   * The React ref method to set the root content element locally.
   *
   * @param {Element} element
   */

  ref = element => {
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

  isInEditor = target => {
    const { element } = this

    let el

    try {
      // COMPAT: Text nodes don't have `isContentEditable` property. So, when
      // `target` is a text node use its parent node for check.
      el = target.nodeType === 3 ? target.parentNode : target
    } catch (err) {
      // COMPAT: In Firefox, `target.nodeType` will throw an error if target is
      // originating from an internal "restricted" element (e.g. a stepper
      // arrow on a number input)
      // see github.com/ianstormtaylor/slate/issues/1819
      if (IS_FIREFOX && FIREFOX_NODE_TYPE_ACCESS_ERROR.test(err.message)) {
        return false
      }

      throw err
    }
    return (
      el.isContentEditable &&
      (el === element || el.closest('[data-slate-editor]') === element)
    )
  }

  /**
   * On `event` with `handler`.
   *
   * @param {String} handler
   * @param {Event} event
   */

  onEvent(handler, event) {
    debug('onEvent', handler)

    // Ignore `onBlur`, `onFocus` and `onSelect` events generated
    // programmatically while updating selection.
    if (
      this.tmp.isUpdatingSelection &&
      (handler == 'onSelect' || handler == 'onBlur' || handler == 'onFocus')
    ) {
      return
    }

    // COMPAT: There are situations where a select event will fire with a new
    // native selection that resolves to the same internal position. In those
    // cases we don't need to trigger any changes, since our internal model is
    // already up to date, but we do want to update the native selection again
    // to make sure it is in sync. (2017/10/16)
    if (handler == 'onSelect') {
      const { editor } = this.props
      const { value } = editor
      const { selection } = value
      const window = getWindow(event.target)
      const native = window.getSelection()
      const range = findRange(native, value)

      if (range && range.equals(selection.toRange())) {
        this.updateSelection()
        return
      }
    }

    // Don't handle drag and drop events coming from embedded editors.
    if (
      handler == 'onDragEnd' ||
      handler == 'onDragEnter' ||
      handler == 'onDragExit' ||
      handler == 'onDragLeave' ||
      handler == 'onDragOver' ||
      handler == 'onDragStart' ||
      handler == 'onDrop'
    ) {
      const { target } = event
      const targetEditorNode = target.closest('[data-slate-editor]')
      if (targetEditorNode !== this.element) return
    }

    // Some events require being in editable in the editor, so if the event
    // target isn't, ignore them.
    if (
      handler == 'onBeforeInput' ||
      handler == 'onBlur' ||
      handler == 'onCompositionEnd' ||
      handler == 'onCompositionStart' ||
      handler == 'onCopy' ||
      handler == 'onCut' ||
      handler == 'onFocus' ||
      handler == 'onInput' ||
      handler == 'onKeyDown' ||
      handler == 'onKeyUp' ||
      handler == 'onPaste' ||
      handler == 'onSelect'
    ) {
      if (!this.isInEditor(event.target)) return
    }

    this.props[handler](event)
  }

  /**
   * On native `selectionchange` event, trigger the `onSelect` handler. This is
   * needed to account for React's `onSelect` being non-standard and not firing
   * until after a selection has been released. This causes issues in situations
   * where another change happens while a selection is being made.
   *
   * @param {Event} event
   */

  onNativeSelectionChange = throttle(event => {
    if (this.props.readOnly) return

    const window = getWindow(event.target)
    const { activeElement } = window.document
    if (activeElement !== this.element) return

    this.props.onSelect(event)
  }, 100)

  /**
   * Render the editor content.
   *
   * @return {Element}
   */

  render() {
    const { props, handlers } = this
    const {
      className,
      readOnly,
      editor,
      tabIndex,
      role,
      tagName,
      spellCheck,
    } = props
    const { value, stack } = editor
    const Container = tagName
    const { document, selection, decorations } = value
    const indexes = document.getSelectionIndexes(selection)
    const decs = document.getDecorations(stack).concat(decorations)
    const childrenDecorations = getChildrenDecorations(document, decs)

    const children = document.nodes.toArray().map((child, i) => {
      const isSelected = !!indexes && indexes.start <= i && i < indexes.end

      return this.renderNode(child, isSelected, childrenDecorations[i])
    })

    const style = {
      // Prevent the default outline styles.
      outline: 'none',
      // Preserve adjacent whitespace and new lines.
      whiteSpace: 'pre-wrap',
      // Allow words to break if they are too long.
      wordWrap: 'break-word',
      // COMPAT: In iOS, a formatting menu with bold, italic and underline
      // buttons is shown which causes our internal value to get out of sync in
      // weird ways. This hides that. (2016/06/21)
      ...(readOnly ? {} : { WebkitUserModify: 'read-write-plaintext-only' }),
      // Allow for passed-in styles to override anything.
      ...props.style,
    }

    debug('render', { props })

    return (
      <Container
        {...handlers}
        data-slate-editor
        ref={this.ref}
        data-key={document.key}
        contentEditable={readOnly ? null : true}
        suppressContentEditableWarning
        className={className}
        autoCorrect={props.autoCorrect ? 'on' : 'off'}
        spellCheck={spellCheck}
        style={style}
        role={readOnly ? null : role || 'textbox'}
        tabIndex={tabIndex}
        // COMPAT: The Grammarly Chrome extension works by changing the DOM out
        // from under `contenteditable` elements, which leads to weird behaviors
        // so we have to disable it like this. (2017/04/24)
        data-gramm={false}
      >
        {children}
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

  renderNode = (child, isSelected, decorations) => {
    const { editor, readOnly } = this.props
    const { value } = editor
    const { document, selection } = value
    const { isFocused } = selection

    return (
      <Node
        block={null}
        editor={editor}
        decorations={decorations}
        isSelected={isSelected}
        isFocused={isFocused && isSelected}
        key={child.key}
        node={child}
        parent={document}
        readOnly={readOnly}
      />
    )
  }
}

/**
 * Mix in handler prop types.
 */

EVENT_HANDLERS.forEach(handler => {
  Content.propTypes[handler] = Types.func.isRequired
})

/**
 * Export.
 *
 * @type {Component}
 */

export default Content
