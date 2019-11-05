import React, { useEffect, useRef, useMemo, useCallback } from 'react'
import { Change, Value, Element, Range } from 'slate'
import debounce from 'lodash/debounce'

import Children from './children'
import Hotkeys from '../utils/hotkeys'
import { EditorContext } from '../hooks/use-editor'
import { ReactEditor } from '../plugin'
import { ReadOnlyContext } from '../hooks/use-read-only'
import { FocusedContext } from '../hooks/use-focused'
import {
  HAS_INPUT_EVENTS_LEVEL_2,
  IS_FIREFOX,
  IS_IE,
  IS_IOS,
} from '../utils/environment'
import {
  NativeElement,
  NativeNode,
  NativeRange,
  isNativeElement,
  isNativeNode,
} from '../utils/dom'
import {
  EDITOR_TO_ELEMENT,
  ELEMENT_TO_NODE,
  IS_READ_ONLY,
  NODE_TO_ELEMENT,
  IS_FOCUSED,
} from '../utils/weak-maps'
import { Utils } from '../utils/utils'

/**
 * Editor.
 */

const Editor = (props: {
  editor: ReactEditor
  onChange?: (change: Change) => void
  readOnly?: boolean
  role?: string
  style?: Record<string, any>
  value: Value
  [key: string]: any
}) => {
  const {
    editor,
    value,
    onChange = () => {},
    readOnly = false,
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
  IS_READ_ONLY.set(editor, readOnly)

  // Keep track of some state for the event handler logic.
  const state = useMemo(
    () => ({
      compositionCount: 0,
      isCopying: false,
      isComposing: false,
      isDragging: false,
      isUpdatingSelection: false,
      latestElement: null as NativeElement | null,
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
    window.document.addEventListener('selectionchange', onNativeSelectionChange)

    return () => {
      window.document.removeEventListener(
        'selectionchange',
        onNativeSelectionChange
      )
    }
  }, [])

  // Attach a native DOM event handler for `beforeinput` events, because React's
  // built-in `onBeforeInput` is actually a leaky polyfill that doesn't expose
  // real `beforeinput` events sadly... (2019/11/04)
  // https://github.com/facebook/react/issues/11211
  useEffect(() => {
    if (HAS_INPUT_EVENTS_LEVEL_2) {
      if (ref.current) {
        ref.current.addEventListener('beforeinput', onNativeBeforeInput)
      }

      return () => {
        if (ref.current) {
          ref.current.removeEventListener('beforeinput', onNativeBeforeInput)
        }
      }
    }
  }, [])

  // Whenever the editor updates, make sure the DOM selection state is in sync.
  useEffect(() => {
    const { selection } = value
    const domSelection = window.getSelection()

    if (!selection || !domSelection || !editor.isFocused()) {
      console.log('NO SELECTION / NO DOM SELECTION / NOT FOCUSED')
      return
    }

    const { rangeCount } = domSelection
    const domRange = rangeCount > 0 ? domSelection.getRangeAt(0) : null

    if (!domRange) {
      debugger
      console.log('NO DOM RANGE')
      return
    }

    const newDomRange = editor.toDomRange(selection)

    if (!isRangeEqual(newDomRange, domRange)) {
      setDomSelectionRange(newDomRange)
    }
  })

  const setDomSelectionRange = (domRange: NativeRange) => {
    const el = editor.toDomNode(value)
    const domSelection = window.getSelection()

    if (domSelection) {
      console.log('UPDATING SELECTION', domRange)
      state.isUpdatingSelection = true
      domSelection.removeAllRanges()
      domSelection.setBaseAndExtent(
        domRange.startContainer,
        domRange.startOffset,
        domRange.endContainer,
        domRange.endOffset
      )

      setTimeout(() => {
        // COMPAT: In Firefox, it's not enough to create a range, you also need
        // to focus the contenteditable element too. (2016/11/16)
        if (IS_FIREFOX) {
          el.focus()
        }

        state.isUpdatingSelection = false
      })
    }
  }

  // On blur handler.
  const onBlur = useCallback((event: React.FocusEvent) => {
    if (
      !readOnly &&
      !state.isCopying &&
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

        if (isNativeElement(relatedTarget)) {
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
  }, [])

  // On click handler.
  const onClick = useCallback((event: React.MouseEvent) => {
    if (
      !readOnly &&
      hasTarget(editor, event.target) &&
      isNativeNode(event.target)
    ) {
      const domSelection = window.getSelection()
      const node = editor.toSlateNode(event.target)
      const path = editor.findPath(node)
      const start = editor.getStart(path)
      const range = editor.getRange(start)
      const domRange = editor.toDomRange(range)

      if (domSelection && editor.getMatch(path, 'void')) {
        setDomSelectionRange(domRange)
      }
    }
  }, [])

  // On composition end.
  const onCompositionEnd = useCallback((event: React.CompositionEvent) => {
    if (hasEditableTarget(editor, event.target)) {
      const n = state.compositionCount

      // The `count` ensures that if another composition starts before the
      // timeout, we won't unset the flag, since a composition is still running.
      window.requestAnimationFrame(() => {
        if (state.compositionCount <= n) {
          state.isComposing = false
        }
      })
    }
  }, [])

  // On composition start.
  const onCompositionStart = useCallback((event: React.CompositionEvent) => {
    if (hasEditableTarget(editor, event.target)) {
      state.isComposing = true
      state.compositionCount++

      if (editor.isSelected() && editor.isExpanded()) {
        //  When a composition starts and the current selection is not
        //  collapsed, the second composition keydown would drop the text
        //  wrapping <span> which resulted on crash when updating the selection
        //  after composition ends (because it cannot find <span> nodes in DOM).
        //  This is a workaround that erases selection as soon as composition
        //  starts and preventing <span> to be dropped.
        //  https://github.com/ianstormtaylor/slate/issues/1879
        editor.delete()
      }
    }
  }, [])

  // On copy handler.
  const onCopy = useCallback((event: React.ClipboardEvent) => {
    if (hasEditableTarget(editor, event.target)) {
      event.preventDefault()
      state.isCopying = true
      window.requestAnimationFrame(() => (state.isCopying = false))
      Utils.setFragmentData(event.clipboardData, editor)
    }
  }, [])

  // On cut handler.
  const onCut = useCallback((event: React.ClipboardEvent) => {
    if (!readOnly && hasEditableTarget(editor, event.target)) {
      event.preventDefault()
      state.isCopying = true
      window.requestAnimationFrame(() => (state.isCopying = false))
      Utils.setFragmentData(event.clipboardData, editor)

      if (editor.isExpanded()) {
        editor.delete()
      }
    }
  }, [])

  // On drag end handler.
  const onDragEnd = useCallback((event: React.DragEvent) => {
    if (hasTarget(editor, event.target)) {
      state.isDragging = false
    }
  }, [])

  // On drag start handler.
  const onDragStart = useCallback((event: React.DragEvent) => {
    if (hasTarget(editor, event.target)) {
      state.isDragging = true

      if (isNativeNode(event.target)) {
        const node = editor.toSlateNode(event.target)
        const path = editor.findPath(node)
        const voidMatch = editor.getMatch(path, 'void')

        // If starting a drag on a void node, make sure it is selected so that
        // it shows up in the selection's fragment.
        if (voidMatch) {
          const range = editor.getRange(path)
          editor.select(range)
        }

        Utils.setFragmentData(event.dataTransfer, editor)
      }
    }
  }, [])

  // On drop handler.
  const onDrop = useCallback((event: React.DragEvent) => {
    if (!readOnly && hasEditableTarget(editor, event.target)) {
      event.preventDefault()
      const { dataTransfer } = event
      const range = editor.findEventRange(event)

      if (range) {
        if (state.isDragging) {
          editor.delete()
        }

        editor.select(range)
        editor.focus()
        editor.insertDataTransfer(dataTransfer)
      }
    }
  }, [])

  // On focus handler.
  const onFocus = useCallback((event: React.FocusEvent) => {
    if (
      !readOnly &&
      !state.isCopying &&
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
  }, [])

  // Listen on the native `beforeinput` event to get real "Level 2" events. This
  // is required because React's `beforeinput` is fake and never really attaches
  // to the real event sadly. (2019/11/01)
  // https://github.com/facebook/react/issues/11211
  const onNativeBeforeInput = (event: Event) => {
    if (readOnly) return
    if (!hasEditableTarget(editor, event.target)) return
    editor.onBeforeInput(event)
  }

  // On native `selectionchange` event, trigger the `onSelect` handler. This is
  // needed to account for React's `onSelect` being non-standard and not firing
  // until after a selection has been released. This causes issues in situations
  // where another change happens while a selection is being dragged.
  const onNativeSelectionChange = debounce(() => {
    if (readOnly) return
    if (state.isCopying) return
    if (state.isComposing) return
    if (state.isUpdatingSelection) return

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
  }, 100)

  // On paste handler.
  const onPaste = useCallback((event: React.ClipboardEvent) => {
    if (!readOnly && hasEditableTarget(editor, event.target)) {
      event.preventDefault()
      editor.insertDataTransfer(event.clipboardData)
    }
  }, [])

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
            // Mix in any extra attributes straight onto the DOM element.
            {...attributes}
            data-slate-editor
            data-slate-node="value"
            contentEditable={readOnly ? undefined : true}
            suppressContentEditableWarning
            ref={ref}
            // Default styles required for proper contenteditable behavior.
            style={{
              // Prevent the default outline styles.
              outline: 'none',
              // Preserve adjacent whitespace and new lines.
              whiteSpace: 'pre-wrap',
              // Allow words to break if they are too long.
              wordWrap: 'break-word',
              // COMPAT: In iOS, a formatting menu with bold, italic and underline
              // buttons is shown which causes our internal value to get out of
              // sync in weird ways. This hides that. (2016/06/21)
              ...(readOnly
                ? {}
                : { WebkitUserModify: 'read-write-plaintext-only' }),
              // Allow for passed-in styles to override anything.
              ...style,
            }}
            onBeforeInput={event => {
              if (
                // COMPAT: If the browser supports Input Events Level 2, we will
                // have attached a custom handler for the real `beforeinput` events,
                // instead of allowing React's synthetic polyfill, so we need to
                // ignore synthetics.
                !HAS_INPUT_EVENTS_LEVEL_2 &&
                !readOnly &&
                hasEditableTarget(editor, event.target)
              ) {
                editor.onBeforeInput(event)
              }
            }}
            onBlur={onBlur}
            onClick={onClick}
            onCompositionEnd={onCompositionEnd}
            onCompositionStart={onCompositionStart}
            onCopy={onCopy}
            onCut={onCut}
            onDragEnd={onDragEnd}
            onDragOver={event => {
              if (hasTarget(editor, event.target)) {
                // If the target is inside a void node, and only in this case,
                // call `preventDefault` to signal that drops are allowed. When
                // the target is editable, dropping is already allowed by default,
                // and calling `preventDefault` hides the cursor.
                const node = editor.toSlateNode(event.target)

                if (Element.isElement(node) && editor.isVoid(node)) {
                  event.preventDefault()
                }

                // COMPAT: IE won't call onDrop on contentEditables unless the
                // default dragOver is prevented. And it will raise an
                // `unspecified error` if dropEffect is set. (2018/07/11)
                // https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/913982/
                if (IS_IE) {
                  event.preventDefault()
                  event.nativeEvent!.dataTransfer!.dropEffect = 'move'
                }
              }
            }}
            onDragStart={onDragStart}
            onDrop={onDrop}
            onFocus={onFocus}
            onInput={event => {
              if (
                !state.isComposing &&
                editor.isFocused() &&
                hasEditableTarget(editor, event.target)
              ) {
                editor.onInput(event)
              }
            }}
            onKeyDown={event => {
              if (!readOnly && hasEditableTarget(editor, event.target)) {
                // When composing, we need to prevent all hotkeys from executing
                // while typing. However, certain characters also move the
                // selection before we're able to handle it, so prevent their
                // default behavior.
                if (state.isComposing) {
                  if (Hotkeys.isCompose(event)) {
                    event.preventDefault()
                  }

                  return
                }

                // Certain hotkeys have native editing behaviors in
                // `contenteditable` elements which will edit the DOM and cause
                // our value to be out of sync, so they need to always be
                // prevented.
                if (
                  !IS_IOS &&
                  (Hotkeys.isBold(event) ||
                    Hotkeys.isDeleteBackward(event) ||
                    Hotkeys.isDeleteForward(event) ||
                    Hotkeys.isDeleteLineBackward(event) ||
                    Hotkeys.isDeleteLineForward(event) ||
                    Hotkeys.isDeleteWordBackward(event) ||
                    Hotkeys.isDeleteWordForward(event) ||
                    Hotkeys.isItalic(event) ||
                    Hotkeys.isRedo(event) ||
                    Hotkeys.isSplitBlock(event) ||
                    Hotkeys.isTransposeCharacter(event) ||
                    Hotkeys.isUndo(event))
                ) {
                  event.preventDefault()
                }

                editor.onKeyDown(event)
              }
            }}
            onPaste={onPaste}
          >
            <Children
              annotations={Object.values(value.annotations)}
              block={null}
              decorations={[]}
              node={value}
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

const isRangeEqual = (a: NativeRange, b: NativeRange) => {
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
): target is NativeNode => {
  return isNativeNode(target) && editor.hasDomNode(target)
}

/**
 * Check if the target is editable and in the editor.
 */

const hasEditableTarget = (
  editor: ReactEditor,
  target: EventTarget | null
): target is NativeNode => {
  return isNativeNode(target) && editor.hasDomNode(target, { editable: true })
}

export default Editor
