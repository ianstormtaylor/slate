import React, { useLayoutEffect, useRef, useMemo, useCallback } from 'react'
import {
  Value,
  Element,
  NodeEntry,
  Range as SlateRange,
  Operation,
} from 'slate'
import debounce from 'debounce'
import scrollIntoView from 'scroll-into-view-if-needed'

import Children from './children'
import Hotkeys from '../utils/hotkeys'
import { EditorContext } from '../hooks/use-editor'
import { FocusedContext } from '../hooks/use-focused'
import { IS_FIREFOX, IS_SAFARI } from '../utils/environment'
import { ReactEditor } from '../plugin'
import { ReadOnlyContext } from '../hooks/use-read-only'
import {
  DOMElement,
  DOMNode,
  DOMRange,
  isDOMElement,
  isDOMNode,
  DOMStaticRange,
} from '../utils/dom'
import {
  EDITOR_TO_ELEMENT,
  ELEMENT_TO_NODE,
  IS_READ_ONLY,
  NODE_TO_ELEMENT,
  IS_FOCUSED,
  PLACEHOLDER,
} from '../utils/weak-maps'
import { Utils } from '../utils/utils'
import {
  CustomAnnotationProps,
  CustomDecorationProps,
  CustomElementProps,
  CustomMarkProps,
} from './custom'

/**
 * Editor.
 */

const Editor = (props: {
  decorate?: (entry: NodeEntry) => SlateRange[]
  editor: ReactEditor
  onChange: (value: Value, operations: Operation[]) => void
  placeholder?: string
  readOnly?: boolean
  role?: string
  style?: Record<string, any>
  renderAnnotation?: (props: CustomAnnotationProps) => JSX.Element
  renderDecoration?: (props: CustomDecorationProps) => JSX.Element
  renderElement?: (props: CustomElementProps) => JSX.Element
  renderMark?: (props: CustomMarkProps) => JSX.Element
  value: Value
  [key: string]: any
}) => {
  const {
    decorate = defaultDecorate,
    editor,
    value,
    onChange,
    placeholder,
    readOnly = false,
    renderAnnotation,
    renderDecoration,
    renderElement,
    renderMark,
    style = {},
    ...attributes
  } = props

  if (!Value.isValue(value)) {
    throw new Error(
      `The \`value=\` prop you passed to <Editor> was not a valid Slate value: ${JSON.stringify(
        value
      )}`
    )
  }

  const ref = useRef<HTMLDivElement>(null)

  // Update internal state on each render.
  editor.onChange = onChange
  editor.value = value
  PLACEHOLDER.set(editor, placeholder)
  IS_READ_ONLY.set(editor, readOnly)

  // Keep track of some state for the event handler logic.
  const state = useMemo(
    () => ({
      isComposing: false,
      isUpdatingSelection: false,
      latestElement: null as DOMElement | null,
    }),
    []
  )

  // Update element-related weak maps with the DOM element ref.
  useLayoutEffect(() => {
    if (ref.current) {
      EDITOR_TO_ELEMENT.set(editor, ref.current)
      NODE_TO_ELEMENT.set(value, ref.current)
      ELEMENT_TO_NODE.set(ref.current, value)
    } else {
      NODE_TO_ELEMENT.delete(value)
    }
  })

  // Attach a native DOM event handler for `selectionchange`, because React's
  // built-in `onSelect` handler doesn't fire for all selection changes. It's a
  // leaky polyfill that only fires on keypresses or clicks. Instead, we want to
  // fire for any change to the selection inside the editor. (2019/11/04)
  // https://github.com/facebook/react/issues/5785
  useLayoutEffect(() => {
    window.document.addEventListener('selectionchange', onDOMSelectionChange)

    return () => {
      window.document.removeEventListener(
        'selectionchange',
        onDOMSelectionChange
      )
    }
  }, [])

  // Attach a native DOM event handler for `beforeinput` events, because React's
  // built-in `onBeforeInput` is actually a leaky polyfill that doesn't expose
  // real `beforeinput` events sadly... (2019/11/04)
  // https://github.com/facebook/react/issues/11211
  useLayoutEffect(() => {
    if (ref.current) {
      // @ts-ignore The `beforeinput` event isn't recognized.
      ref.current.addEventListener('beforeinput', onDOMBeforeInput)
    }

    return () => {
      if (ref.current) {
        // @ts-ignore The `beforeinput` event isn't recognized.
        ref.current.removeEventListener('beforeinput', onDOMBeforeInput)
      }
    }
  }, [])

  // Whenever the editor updates, make sure the DOM selection state is in sync.
  useLayoutEffect(() => {
    const { selection } = value
    const domSelection = window.getSelection()

    if (state.isComposing || !domSelection || !editor.isFocused()) {
      return
    }

    const el = editor.toDomNode(value)
    const domRange = domSelection.getRangeAt(0)
    const newDomRange = selection && editor.toDomRange(selection)

    if (
      (!selection && !domRange) ||
      (domRange && newDomRange && isRangeEqual(domRange, newDomRange))
    ) {
      return
    }

    state.isUpdatingSelection = true
    domSelection.removeAllRanges()

    if (newDomRange) {
      domSelection.addRange(newDomRange!)
      const leafEl = newDomRange.startContainer.parentElement!
      scrollIntoView(leafEl, { scrollMode: 'if-needed' })
    }

    setTimeout(() => {
      // COMPAT: In Firefox, it's not enough to create a range, you also need
      // to focus the contenteditable element too. (2016/11/16)
      if (newDomRange && IS_FIREFOX) {
        el.focus()
      }

      state.isUpdatingSelection = false
    })
  })

  // Listen on the native `beforeinput` event to get real "Level 2" events. This
  // is required because React's `beforeinput` is fake and never really attaches
  // to the real event sadly. (2019/11/01)
  // https://github.com/facebook/react/issues/11211
  const onDOMBeforeInput = useCallback(
    (
      event: Event & {
        data: string | null
        dataTransfer: DataTransfer | null
        getTargetRanges(): DOMStaticRange[]
        inputType: string
        isComposing: boolean
      }
    ) => {
      if (!readOnly && hasEditableTarget(editor, event.target)) {
        const { inputType } = event
        const data = event.dataTransfer || event.data || undefined

        // These two types occur while a user is composing text and can't be
        // cancelled. Let them through and wait for the composition to end.
        if (
          inputType === 'insertCompositionText' ||
          inputType === 'deleteCompositionText'
        ) {
          return
        }

        const [targetRange] = event.getTargetRanges()
        let range

        if (targetRange) {
          range = editor.toSlateRange(targetRange)
        }

        event.preventDefault()
        editor.handleInput(inputType, data, range)
      }
    },
    []
  )

  // Listen on the native `selectionchange` event to be able to update any time
  // the selection changes. This is required because React's `onSelect` is leaky
  // and non-standard so it doesn't fire until after a selection has been
  // released. This causes issues in situations where another change happens
  // while a selection is being dragged.
  const onDOMSelectionChange = useCallback(
    debounce(() => {
      if (!readOnly && !state.isComposing && !state.isUpdatingSelection) {
        const { activeElement } = window.document
        const el = editor.toDomNode(value)
        const domSelection = window.getSelection()
        const domRange =
          domSelection &&
          domSelection.rangeCount > 0 &&
          domSelection.getRangeAt(0)

        if (activeElement === el) {
          state.latestElement = activeElement
          IS_FOCUSED.set(editor, true)
        } else {
          IS_FOCUSED.delete(editor)
        }

        if (
          domRange &&
          hasEditableTarget(editor, domRange.startContainer) &&
          hasEditableTarget(editor, domRange.endContainer)
        ) {
          const range = editor.toSlateRange(domRange)
          editor.select(range)
        } else {
          editor.deselect()
        }
      }
    }, 100),
    []
  )

  return (
    <EditorContext.Provider value={editor}>
      <ReadOnlyContext.Provider value={readOnly}>
        <FocusedContext.Provider value={editor.isFocused()}>
          <div
            // COMPAT: The Grammarly Chrome extension works by changing the DOM
            // out from under `contenteditable` elements, which leads to weird
            // behaviors so we have to disable it like editor. (2017/04/24)
            data-gramm={false}
            role={readOnly ? undefined : 'textbox'}
            {...attributes}
            // COMPAT: Firefox doesn't support the `beforeinput` event, so we'd
            // have to use hacks to make these replacement-based features work.
            spellCheck={IS_FIREFOX ? undefined : attributes.spellCheck}
            autoCorrect={IS_FIREFOX ? undefined : attributes.autoCorrect}
            autoCapitalize={IS_FIREFOX ? undefined : attributes.autoCapitalize}
            data-slate-editor
            data-slate-node="value"
            contentEditable={readOnly ? undefined : true}
            suppressContentEditableWarning
            ref={ref}
            style={{
              // Prevent the default outline styles.
              outline: 'none',
              // Preserve adjacent whitespace and new lines.
              whiteSpace: 'pre-wrap',
              // Allow words to break if they are too long.
              wordWrap: 'break-word',
              // Allow for passed-in styles to override anything.
              ...style,
            }}
            onBeforeInput={useCallback((event: React.SyntheticEvent) => {
              // COMPAT: Firefox doesn't support the `beforeinput` event, so we
              // fall back to React's leaky polyfill instead just for it. It
              // only works for the `insertText` input type.
              if (IS_FIREFOX && !readOnly) {
                event.preventDefault()
                const text = (event as any).data as string
                editor.handleInput('insertText', text)
              }
            }, [])}
            onBlur={useCallback((event: React.FocusEvent) => {
              if (
                !readOnly &&
                !state.isUpdatingSelection &&
                hasEditableTarget(editor, event.target) &&
                !isEventHandled(event, attributes.onBlur) &&
                // COMPAT: If the current `activeElement` is still the previous
                // one, this is due to the window being blurred when the tab
                // itself becomes unfocused, so we want to abort early to allow to
                // editor to stay focused when the tab becomes focused again.
                state.latestElement !== window.document.activeElement
              ) {
                const { relatedTarget } = event

                // COMPAT: The `relatedTarget` can be null when the new focus target
                // is not a "focusable" element (eg. a `<div>` without `tabindex`
                // set).
                if (relatedTarget) {
                  const el = editor.toDomNode(value)

                  // COMPAT: The event should be ignored if the focus is returning
                  // to the editor from an embedded editable element (eg. an <input>
                  // element inside a void node).
                  if (relatedTarget === el) return

                  if (isDOMElement(relatedTarget)) {
                    // COMPAT: The event should be ignored if the focus is moving from
                    // the editor to inside a void node's spacer element.
                    if (relatedTarget.hasAttribute('data-slate-spacer')) return

                    // COMPAT: The event should be ignored if the focus is moving to a
                    // non- editable section of an element that isn't a void node (eg.
                    // a list item of the check list example).
                    const node = editor.toSlateNode(relatedTarget)

                    if (
                      editor.hasDomNode(relatedTarget) &&
                      (!Element.isElement(node) || !editor.isVoid(node))
                    ) {
                      return
                    }
                  }
                }
              }

              IS_FOCUSED.delete(editor)
            }, [])}
            onClick={useCallback((event: React.MouseEvent) => {
              if (
                !readOnly &&
                hasTarget(editor, event.target) &&
                !isEventHandled(event, attributes.onClick) &&
                isDOMNode(event.target)
              ) {
                const node = editor.toSlateNode(event.target)
                const path = editor.findPath(node)
                const start = editor.getStart(path)

                if (editor.getMatch(start, 'void')) {
                  editor.select(start)
                }
              }
            }, [])}
            onCompositionEnd={useCallback((event: React.CompositionEvent) => {
              if (
                hasEditableTarget(editor, event.target) &&
                !isEventHandled(event, attributes.onCompositionEnd)
              ) {
                state.isComposing = false

                // COMPAT: In Chrome, `beforeinput` events for compositions
                // aren't correct and never fire the "insertFromComposition"
                // type that we need. So instead, insert whenever a composition
                // ends since it will already have been committed to the DOM.
                if (!IS_SAFARI && event.data) {
                  editor.insertText(event.data)
                }
              }
            }, [])}
            onCompositionStart={useCallback((event: React.CompositionEvent) => {
              if (
                hasEditableTarget(editor, event.target) &&
                !isEventHandled(event, attributes.onCompositionStart)
              ) {
                state.isComposing = true
              }
            }, [])}
            onCopy={useCallback((event: React.ClipboardEvent) => {
              if (
                hasEditableTarget(editor, event.target) &&
                !isEventHandled(event, attributes.onCopy)
              ) {
                event.preventDefault()
                Utils.setFragmentData(event.clipboardData, editor)
              }
            }, [])}
            onCut={useCallback((event: React.ClipboardEvent) => {
              if (
                !readOnly &&
                hasEditableTarget(editor, event.target) &&
                !isEventHandled(event, attributes.onCut)
              ) {
                event.preventDefault()
                Utils.setFragmentData(event.clipboardData, editor)
                const { selection } = value

                if (selection && SlateRange.isExpanded(selection)) {
                  editor.delete()
                }
              }
            }, [])}
            onDragOver={useCallback((event: React.DragEvent) => {
              if (
                hasTarget(editor, event.target) &&
                !isEventHandled(event, attributes.onDragOver)
              ) {
                // Only when the target is void, call `preventDefault` to signal
                // that drops are allowed. Editable content is droppable by
                // default, and calling `preventDefault` hides the cursor.
                const node = editor.toSlateNode(event.target)

                if (Element.isElement(node) && editor.isVoid(node)) {
                  event.preventDefault()
                }
              }
            }, [])}
            onDragStart={useCallback((event: React.DragEvent) => {
              if (
                hasTarget(editor, event.target) &&
                !isEventHandled(event, attributes.onDragStart)
              ) {
                const node = editor.toSlateNode(event.target)
                const path = editor.findPath(node)
                const voidMatch = editor.getMatch(path, 'void')

                // If starting a drag on a void node, make sure it is selected
                // so that it shows up in the selection's fragment.
                if (voidMatch) {
                  const range = editor.getRange(path)
                  editor.select(range)
                }

                Utils.setFragmentData(event.dataTransfer, editor)
              }
            }, [])}
            onFocus={useCallback((event: React.FocusEvent) => {
              if (
                !readOnly &&
                !state.isUpdatingSelection &&
                hasEditableTarget(editor, event.target) &&
                !isEventHandled(event, attributes.onFocus)
              ) {
                const el = editor.toDomNode(value)
                state.latestElement = window.document.activeElement

                // COMPAT: If the editor has nested editable elements, the focus
                // can go to them. In Firefox, this must be prevented because it
                // results in issues with keyboard navigation. (2017/03/30)
                if (IS_FIREFOX && event.target !== el) {
                  el.focus()
                  return
                }

                IS_FOCUSED.set(editor, true)
              }
            }, [])}
            onKeyDown={event => {
              if (
                !readOnly &&
                hasEditableTarget(editor, event.target) &&
                !isEventHandled(event, attributes.onKeyDown)
              ) {
                const { nativeEvent } = event

                // COMPAT: Since we prevent the default behavior on `beforeinput` events,
                // the browser doesn't think there's ever any history stack to undo or redo,
                // so we have to manage these hotkeys ourselves. (2019/11/06)
                if (Hotkeys.isRedo(nativeEvent)) {
                  editor.redo()
                  return
                }

                if (Hotkeys.isUndo(nativeEvent)) {
                  editor.undo()
                  return
                }

                // COMPAT: Certain browsers don't handle the selection updates
                // properly. In Chrome, the selection isn't properly extended.
                // And in Firefox, the selection isn't properly collapsed.
                // (2017/10/17)
                if (Hotkeys.isMoveLineBackward(nativeEvent)) {
                  event.preventDefault()
                  editor.move({ unit: 'line', reverse: true })
                  return
                }

                if (Hotkeys.isMoveLineForward(nativeEvent)) {
                  event.preventDefault()
                  editor.move({ unit: 'line' })
                  return
                }

                if (Hotkeys.isExtendLineBackward(nativeEvent)) {
                  event.preventDefault()
                  editor.move({ unit: 'line', edge: 'focus', reverse: true })
                  return
                }

                if (Hotkeys.isExtendLineForward(nativeEvent)) {
                  event.preventDefault()
                  editor.move({ unit: 'line', edge: 'focus' })
                  return
                }

                // COMPAT: If a void node is selected, or a zero-width text node
                // adjacent to an inline is selected, we need to handle these
                // hotkeys manually because browsers won't be able to skip over
                // the void node with the zero-width space not being an empty
                // string.
                if (Hotkeys.isMoveBackward(nativeEvent)) {
                  const { selection } = editor.value
                  event.preventDefault()

                  if (selection && SlateRange.isCollapsed(selection)) {
                    editor.move({ reverse: true })
                  } else {
                    editor.collapse({ edge: 'start' })
                  }

                  return
                }

                if (Hotkeys.isMoveForward(nativeEvent)) {
                  const { selection } = editor.value
                  event.preventDefault()

                  if (selection && SlateRange.isCollapsed(selection)) {
                    editor.move()
                  } else {
                    editor.collapse({ edge: 'end' })
                  }

                  return
                }

                if (Hotkeys.isMoveWordBackward(nativeEvent)) {
                  event.preventDefault()
                  editor.move({ unit: 'word', reverse: true })
                  return
                }

                if (Hotkeys.isMoveWordForward(nativeEvent)) {
                  event.preventDefault()
                  editor.move({ unit: 'word' })
                  return
                }
              }
            }}
            onPaste={useCallback((event: React.ClipboardEvent) => {
              // COMPAT: Firefox doesn't support the `beforeinput` event, so we
              // fall back to React's `onPaste` here instead.
              if (
                IS_FIREFOX &&
                !readOnly &&
                hasEditableTarget(editor, event.target) &&
                !isEventHandled(event, attributes.onPaste)
              ) {
                event.preventDefault()
                editor.handleInput('insertFromPaste', event.clipboardData)
              }
            }, [])}
          >
            <Children
              annotations={value.annotations}
              decorate={decorate}
              decorations={decorate([value, []])}
              node={value}
              renderAnnotation={renderAnnotation}
              renderDecoration={renderDecoration}
              renderElement={renderElement}
              renderMark={renderMark}
              selection={value.selection}
            />
          </div>
        </FocusedContext.Provider>
      </ReadOnlyContext.Provider>
    </EditorContext.Provider>
  )
}

/**
 * A default memoized decorate function.
 */

const defaultDecorate = () => []

/**
 * Check if two DOM range objects are equal.
 */

const isRangeEqual = (a: DOMRange, b: DOMRange) => {
  return (
    (a.startContainer === b.startContainer &&
      a.startOffset === b.startOffset &&
      a.endContainer === b.endContainer &&
      a.endOffset === b.endOffset) ||
    (a.startContainer === b.endContainer &&
      a.startOffset === b.endOffset &&
      a.endContainer === b.startContainer &&
      a.endOffset === b.startOffset)
  )
}

/**
 * Check if the target is in the editor.
 */

const hasTarget = (
  editor: ReactEditor,
  target: EventTarget | null
): target is DOMNode => {
  return isDOMNode(target) && editor.hasDomNode(target)
}

/**
 * Check if the target is editable and in the editor.
 */

const hasEditableTarget = (
  editor: ReactEditor,
  target: EventTarget | null
): target is DOMNode => {
  return isDOMNode(target) && editor.hasDomNode(target, { editable: true })
}

/**
 * Check if an event is overrided by a handler.
 */

const isEventHandled = (
  event: React.SyntheticEvent,
  handler?: (event: React.SyntheticEvent) => void
) => {
  if (!handler) {
    return false
  }

  handler(event)
  return event.isDefaultPrevented() || event.isPropagationStopped()
}

export default Editor
