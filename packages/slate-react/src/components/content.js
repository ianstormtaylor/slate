
import Debug from 'debug'
import React from 'react'
import Types from 'prop-types'
import getWindow from 'get-window'
import logger from 'slate-dev-logger'

import EVENT_HANDLERS from '../constants/event-handlers'
import Node from './node'
import findDOMRange from '../utils/find-dom-range'
import findRange from '../utils/find-range'
import scrollToSelection from '../utils/scroll-to-selection'
import {
  IS_FIREFOX,
  IS_IOS,
  IS_ANDROID,
  SUPPORTED_EVENTS
} from '../constants/environment'

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
    children: Types.any.isRequired,
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
   * Constructor.
   *
   * @param {Object} props
   */

  constructor(props) {
    super(props)
    this.tmp = {}
    this.tmp.key = 0
    this.tmp.isUpdatingSelection = false

    EVENT_HANDLERS.forEach((handler) => {
      this[handler] = (event) => {
        this.onEvent(handler, event)
      }
    })
  }

  /**
   * When the editor first mounts in the DOM we need to:
   *
   *   - Add native DOM event listeners.
   *   - Update the selection, in case it starts focused.
   *   - Focus the editor if `autoFocus` is set.
   */

  componentDidMount = () => {
    // Restrict scoped of `beforeinput` to mobile.
    if ((IS_IOS || IS_ANDROID) && SUPPORTED_EVENTS.beforeinput) {
      this.element.addEventListener('beforeinput', this.onNativeBeforeInput)
    }

    this.updateSelection()

    if (this.props.autoFocus) {
      this.element.focus()
    }
  }

  /**
   * When unmounting, remove DOM event listeners.
   */

  componentWillUnmount() {
    // Restrict scoped of `beforeinput` to mobile.
    if ((IS_IOS || IS_ANDROID) && SUPPORTED_EVENTS.beforeinput) {
      this.element.removeEventListener('beforeinput', this.onNativeBeforeInput)
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
    const { editor } = this.props
    const { value } = editor
    const { selection } = value
    const { isBackward } = selection
    const window = getWindow(this.element)
    const native = window.getSelection()
    const { rangeCount, anchorNode } = native

    // If both selections are blurred, do nothing.
    if (!rangeCount && selection.isBlurred) return

    // If the selection has been blurred, but is still inside the editor in the
    // DOM, blur it manually.
    if (selection.isBlurred) {
      if (!this.isInEditor(anchorNode)) return
      native.removeAllRanges()
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
      logger.error('Unable to find a native DOM range from the current selection.', { selection })
      return
    }

    const {
      startContainer,
      startOffset,
      endContainer,
      endOffset,
    } = range

    // If the new range matches the current selection, there is nothing to fix.
    // COMPAT: The native `Range` object always has it's "start" first and "end"
    // last in the DOM. It has no concept of "backwards/forwards", so we have
    // to check both orientations here. (2017/10/31)
    if (current) {
      if (
        (
          startContainer == current.startContainer &&
          startOffset == current.startOffset &&
          endContainer == current.endContainer &&
          endOffset == current.endOffset
        ) ||
        (
          startContainer == current.endContainer &&
          startOffset == current.endOffset &&
          endContainer == current.startContainer &&
          endOffset == current.startOffset
        )
      ) {
        return
      }
    }

    // Otherwise, set the `isUpdatingSelection` flag and update the selection.
    this.tmp.isUpdatingSelection = true
    native.removeAllRanges()

    // COMPAT: IE 11 does not support Selection.extend
    if (native.extend) {
      // COMPAT: Since the DOM range has no concept of backwards/forwards
      // we need to check and do the right thing here.
      if (isBackward) {
        native.collapse(range.endContainer, range.endOffset)
        native.extend(range.startContainer, range.startOffset)
      } else {
        native.collapse(range.startContainer, range.startOffset)
        native.extend(range.endContainer, range.endOffset)
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

    // COMPAT: Composition events can change the DOM out of under React, so we
    // increment this key to ensure that a full re-render happens. (2017/10/16)
    if (handler == 'onCompositionEnd') {
      this.tmp.key++
    }

    // Ignore `onBlur`, `onFocus` and `onSelect` events generated
    // programmatically while updating selection.
    if (
      this.tmp.isUpdatingSelection &&
      (
        handler == 'onSelect' ||
        handler == 'onBlur' ||
        handler == 'onFocus'
      )
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

      if (range && range.equals(selection)) {
        this.updateSelection()
        return
      }
    }

    // Don't handle drag events coming from embedded editors.
    if (
      handler == 'onDragEnd' ||
      handler == 'onDragEnter' ||
      handler == 'onDragExit' ||
      handler == 'onDragLeave' ||
      handler == 'onDragOver' ||
      handler == 'onDragStart'
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
   * On a native `beforeinput` event, use the additional range information
   * provided by the event to insert text exactly as the browser would.
   *
   * @param {InputEvent} event
   */

  onNativeBeforeInput = (event) => {
    if (this.props.readOnly) return
    if (!this.isInEditor(event.target)) return

    const { inputType } = event
    if (inputType !== 'insertText' && inputType !== 'insertReplacementText') return

    const [ targetRange ] = event.getTargetRanges()
    if (!targetRange) return

    // `data` should have the text for the `insertText` input type and
    // `dataTransfer` should have the text for the `insertReplacementText` input
    // type, but Safari uses `insertText` for spell check replacements and sets
    // `data` to `null`.
    const text = event.data == null
      ? event.dataTransfer.getData('text/plain')
      : event.data

    if (text == null) return

    event.preventDefault()

    const { editor } = this.props
    const { value } = editor
    const { selection } = value
    const range = findRange(targetRange, value)

    editor.change((change) => {
      change.insertTextAtRange(range, text, selection.marks)

      // If the text was successfully inserted, and the selection had marks on it,
      // unset the selection's marks.
      if (selection.marks && value.document != change.value.document) {
        change.select({ marks: null })
      }
    })
  }

  /**
   * Render the editor content.
   *
   * @return {Element}
   */

  render() {
    const { props } = this
    const { className, readOnly, editor, tabIndex, role, tagName } = props
    const { value } = editor
    const Container = tagName
    const { document, selection } = value
    const indexes = document.getSelectionIndexes(selection, selection.isFocused)
    const children = document.nodes.toArray().map((child, i) => {
      const isSelected = !!indexes && indexes.start <= i && i < indexes.end
      return this.renderNode(child, isSelected)
    })

    const handlers = EVENT_HANDLERS.reduce((obj, handler) => {
      obj[handler] = this[handler]
      return obj
    }, {})

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

    // COMPAT: In Firefox, spellchecking can remove entire wrapping elements
    // including inline ones like `<a>`, which is jarring for the user but also
    // causes the DOM to get into an irreconcilable value. (2016/09/01)
    const spellCheck = IS_FIREFOX ? false : props.spellCheck

    debug('render', { props })

    return (
      <Container
        {...handlers}
        data-slate-editor
        key={this.tmp.key}
        ref={this.ref}
        data-key={document.key}
        contentEditable={readOnly ? null : true}
        suppressContentEditableWarning
        className={className}
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
    const { editor, readOnly } = this.props
    const { value } = editor
    const { document, decorations } = value
    const { stack } = editor
    let decs = document.getDecorations(stack)
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
      />
    )
  }

}

/**
 * Mix in handler prop types.
 */

EVENT_HANDLERS.forEach((handler) => {
  Content.propTypes[handler] = Types.func.isRequired
})

/**
 * Export.
 *
 * @type {Component}
 */

export default Content
