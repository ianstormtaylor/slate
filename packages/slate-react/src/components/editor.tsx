import React, { useEffect, useRef, useMemo, useCallback } from 'react'
import { Change, Value, Element } from 'slate'
import debounce from 'lodash/debounce'

import Children from './children'
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
  editor: ReactEditor
  onChange?: (change: Change) => void
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
    editor,
    value,
    onChange = () => {},
    placeholder,
    readOnly = false,
    renderAnnotation,
    renderDecoration,
    renderElement,
    renderMark,
    role = 'textbox',
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
  useEffect(() => {
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
  useEffect(() => {
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
  useEffect(() => {
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
  useEffect(() => {
    const { selection } = value
    const domSelection = window.getSelection()

    if (!selection || !domSelection || !editor.isFocused()) {
      return
    }

    const el = editor.toDomNode(value)
    const domRange = editor.toDomRange(selection)
    const oldDomRange = domSelection.getRangeAt(0)

    if (!oldDomRange || !isRangeEqual(domRange, oldDomRange)) {
      state.isUpdatingSelection = true
      domSelection.removeAllRanges()
      domSelection.addRange(domRange)

      setTimeout(() => {
        // COMPAT: In Firefox, it's not enough to create a range, you also need
        // to focus the contenteditable element too. (2016/11/16)
        if (IS_FIREFOX) {
          el.focus()
        }

        state.isUpdatingSelection = false
      })
    }
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

        // These two types occur while a user is composing text and can't be
        // cancelled. Let them through and wait for the composition to end.
        if (
          inputType === 'insertCompositionText' ||
          inputType === 'deleteCompositionText'
        ) {
          return
        }

        const [targetRange] = event.getTargetRanges()

        if (targetRange && inputType !== 'deleteContent') {
          const range = editor.toSlateRange(targetRange)
          editor.select(range)
        }

        event.preventDefault()
        editor.onBeforeInput(event)
      }
    },
    []
  )

  // On native `selectionchange` event, trigger the `onSelect` handler. This is
  // needed to account for React's `onSelect` being non-standard and not firing
  // until after a selection has been released. This causes issues in situations
  // where another change happens while a selection is being dragged.
  const onDOMSelectionChange = useCallback(
    debounce(() => {
      if (!readOnly && !state.isComposing && !state.isUpdatingSelection) {
        const el = editor.toDomNode(value)
        const { activeElement } = window.document

        if (activeElement === el) {
          const domSelection = window.getSelection()
          state.latestElement = activeElement

          if (domSelection) {
            const range = editor.toSlateRange(domSelection)
            editor.select(range)
            IS_FOCUSED.set(editor, true)
          }
        } else {
          IS_FOCUSED.delete(editor)
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
            role={readOnly ? undefined : props.role || 'textbox'}
            {...attributes}
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
            onBlur={useCallback((event: React.FocusEvent) => {
              if (
                !readOnly &&
                !state.isUpdatingSelection &&
                hasEditableTarget(editor, event.target) &&
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
              if (hasEditableTarget(editor, event.target)) {
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
              if (hasEditableTarget(editor, event.target)) {
                state.isComposing = true
              }
            }, [])}
            onCopy={useCallback((event: React.ClipboardEvent) => {
              if (hasEditableTarget(editor, event.target)) {
                event.preventDefault()
                Utils.setFragmentData(event.clipboardData, editor)
              }
            }, [])}
            onCut={useCallback((event: React.ClipboardEvent) => {
              if (!readOnly && hasEditableTarget(editor, event.target)) {
                event.preventDefault()
                Utils.setFragmentData(event.clipboardData, editor)

                if (editor.isExpanded()) {
                  editor.delete()
                }
              }
            }, [])}
            onDragOver={useCallback((event: React.DragEvent) => {
              if (hasTarget(editor, event.target)) {
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
              if (hasTarget(editor, event.target)) {
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
                hasEditableTarget(editor, event.target)
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
              if (!readOnly && hasEditableTarget(editor, event.target)) {
                editor.onKeyDown(event.nativeEvent)
              }
            }}
          >
            <Children
              annotations={Object.values(value.annotations)}
              block={null}
              decorations={[]}
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

export default Editor
