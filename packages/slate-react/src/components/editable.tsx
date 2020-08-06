import React, { useEffect, useRef, useMemo, useCallback } from 'react'
import {
  Editor,
  Element,
  NodeEntry,
  Node,
  Range,
  Text,
  Transforms,
  Path,
} from 'slate'
import throttle from 'lodash/throttle'
import scrollIntoView from 'scroll-into-view-if-needed'

import Children from './children'
import Hotkeys from '../utils/hotkeys'
import {
  IS_FIREFOX,
  IS_SAFARI,
  IS_EDGE_LEGACY,
  IS_CHROME_LEGACY,
} from '../utils/environment'
import { ReactEditor } from '..'
import { ReadOnlyContext } from '../hooks/use-read-only'
import { useSlate } from '../hooks/use-slate'
import { useIsomorphicLayoutEffect } from '../hooks/use-isomorphic-layout-effect'
import {
  DOMElement,
  DOMNode,
  DOMRange,
  isDOMElement,
  isDOMNode,
  isDOMText,
  DOMStaticRange,
  isPlainTextOnlyPaste,
} from '../utils/dom'
import {
  EDITOR_TO_ELEMENT,
  ELEMENT_TO_NODE,
  IS_READ_ONLY,
  NODE_TO_ELEMENT,
  IS_FOCUSED,
  PLACEHOLDER_SYMBOL,
} from '../utils/weak-maps'

// COMPAT: Firefox/Edge Legacy don't support the `beforeinput` event
// Chrome Legacy doesn't support `beforeinput` correctly
const HAS_BEFORE_INPUT_SUPPORT = !(
  IS_FIREFOX ||
  IS_EDGE_LEGACY ||
  IS_CHROME_LEGACY
)

/**
 * `RenderElementProps` are passed to the `renderElement` handler.
 */

export interface RenderElementProps {
  children: any
  element: Element
  attributes: {
    'data-slate-node': 'element'
    'data-slate-inline'?: true
    'data-slate-void'?: true
    dir?: 'rtl'
    ref: any
  }
}

/**
 * `RenderLeafProps` are passed to the `renderLeaf` handler.
 */

export interface RenderLeafProps {
  children: any
  leaf: Text
  text: Text
  attributes: {
    'data-slate-leaf': true
  }
}

/**
 * `EditableProps` are passed to the `<Editable>` component.
 */

export type EditableProps = {
  decorate?: (entry: NodeEntry) => Range[]
  onDOMBeforeInput?: (event: Event) => void
  placeholder?: string
  readOnly?: boolean
  role?: string
  style?: React.CSSProperties
  renderElement?: (props: RenderElementProps) => JSX.Element
  renderLeaf?: (props: RenderLeafProps) => JSX.Element
  as?: React.ElementType
} & React.TextareaHTMLAttributes<HTMLDivElement>

/**
 * Editable.
 */

export const Editable = (props: EditableProps) => {
  const {
    autoFocus,
    decorate = defaultDecorate,
    onDOMBeforeInput: propsOnDOMBeforeInput,
    placeholder,
    readOnly = false,
    renderElement,
    renderLeaf,
    style = {},
    as: Component = 'div',
    ...attributes
  } = props
  const editor = useSlate()
  const ref = useRef<HTMLDivElement>(null)

  // Update internal state on each render.
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
  useIsomorphicLayoutEffect(() => {
    if (ref.current) {
      EDITOR_TO_ELEMENT.set(editor, ref.current)
      NODE_TO_ELEMENT.set(editor, ref.current)
      ELEMENT_TO_NODE.set(ref.current, editor)
    } else {
      NODE_TO_ELEMENT.delete(editor)
    }
  })

  // Whenever the editor updates, make sure the DOM selection state is in sync.
  useIsomorphicLayoutEffect(() => {
    const { selection } = editor
    const domSelection = window.getSelection()

    if (state.isComposing || !domSelection || !ReactEditor.isFocused(editor)) {
      return
    }

    const hasDomSelection = domSelection.type !== 'None'

    // If the DOM selection is properly unset, we're done.
    if (!selection && !hasDomSelection) {
      return
    }

    // verify that the dom selection is in the editor
    const editorElement = EDITOR_TO_ELEMENT.get(editor)!
    let hasDomSelectionInEditor = false
    if (
      editorElement.contains(domSelection.anchorNode) &&
      editorElement.contains(domSelection.focusNode)
    ) {
      hasDomSelectionInEditor = true
    }

    // If the DOM selection is in the editor and the editor selection is already correct, we're done.
    if (
      hasDomSelection &&
      hasDomSelectionInEditor &&
      selection &&
      Range.equals(ReactEditor.toSlateRange(editor, domSelection), selection)
    ) {
      return
    }

    // Otherwise the DOM selection is out of sync, so update it.
    const el = ReactEditor.toDOMNode(editor, editor)
    state.isUpdatingSelection = true
    domSelection.removeAllRanges()

    const newDomRange = selection && ReactEditor.toDOMRange(editor, selection)

    if (newDomRange) {
      domSelection.addRange(newDomRange!)
      const leafEl = newDomRange.startContainer.parentElement!
      scrollIntoView(leafEl, {
        scrollMode: 'if-needed',
        boundary: el,
      })
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

  // The autoFocus TextareaHTMLAttribute doesn't do anything on a div, so it
  // needs to be manually focused.
  useEffect(() => {
    if (ref.current && autoFocus) {
      ref.current.focus()
    }
  }, [autoFocus])

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
      if (
        !readOnly &&
        hasEditableTarget(editor, event.target) &&
        !isDOMEventHandled(event, propsOnDOMBeforeInput)
      ) {
        const { selection } = editor
        const { inputType: type } = event
        const data = event.dataTransfer || event.data || undefined

        // These two types occur while a user is composing text and can't be
        // cancelled. Let them through and wait for the composition to end.
        if (
          type === 'insertCompositionText' ||
          type === 'deleteCompositionText'
        ) {
          return
        }

        event.preventDefault()

        // COMPAT: For the deleting forward/backward input types we don't want
        // to change the selection because it is the range that will be deleted,
        // and those commands determine that for themselves.
        if (!type.startsWith('delete') || type.startsWith('deleteBy')) {
          const [targetRange] = event.getTargetRanges()

          if (targetRange) {
            const range = ReactEditor.toSlateRange(editor, targetRange)

            if (!selection || !Range.equals(selection, range)) {
              Transforms.select(editor, range)
            }
          }
        }

        // COMPAT: If the selection is expanded, even if the command seems like
        // a delete forward/backward command it should delete the selection.
        if (
          selection &&
          Range.isExpanded(selection) &&
          type.startsWith('delete')
        ) {
          Editor.deleteFragment(editor)
          return
        }

        switch (type) {
          case 'deleteByComposition':
          case 'deleteByCut':
          case 'deleteByDrag': {
            Editor.deleteFragment(editor)
            break
          }

          case 'deleteContent':
          case 'deleteContentForward': {
            Editor.deleteForward(editor)
            break
          }

          case 'deleteContentBackward': {
            Editor.deleteBackward(editor)
            break
          }

          case 'deleteEntireSoftLine': {
            Editor.deleteBackward(editor, { unit: 'line' })
            Editor.deleteForward(editor, { unit: 'line' })
            break
          }

          case 'deleteHardLineBackward': {
            Editor.deleteBackward(editor, { unit: 'block' })
            break
          }

          case 'deleteSoftLineBackward': {
            Editor.deleteBackward(editor, { unit: 'line' })
            break
          }

          case 'deleteHardLineForward': {
            Editor.deleteForward(editor, { unit: 'block' })
            break
          }

          case 'deleteSoftLineForward': {
            Editor.deleteForward(editor, { unit: 'line' })
            break
          }

          case 'deleteWordBackward': {
            Editor.deleteBackward(editor, { unit: 'word' })
            break
          }

          case 'deleteWordForward': {
            Editor.deleteForward(editor, { unit: 'word' })
            break
          }

          case 'insertLineBreak':
          case 'insertParagraph': {
            Editor.insertBreak(editor)
            break
          }

          case 'insertFromComposition':
          case 'insertFromDrop':
          case 'insertFromPaste':
          case 'insertFromYank':
          case 'insertReplacementText':
          case 'insertText': {
            if (data instanceof DataTransfer) {
              ReactEditor.insertData(editor, data)
            } else if (typeof data === 'string') {
              Editor.insertText(editor, data)
            }

            break
          }
        }
      }
    },
    [readOnly]
  )

  // Attach a native DOM event handler for `beforeinput` events, because React's
  // built-in `onBeforeInput` is actually a leaky polyfill that doesn't expose
  // real `beforeinput` events sadly... (2019/11/04)
  // https://github.com/facebook/react/issues/11211
  useIsomorphicLayoutEffect(() => {
    if (ref.current && HAS_BEFORE_INPUT_SUPPORT) {
      // @ts-ignore The `beforeinput` event isn't recognized.
      ref.current.addEventListener('beforeinput', onDOMBeforeInput)
    }

    return () => {
      if (ref.current && HAS_BEFORE_INPUT_SUPPORT) {
        // @ts-ignore The `beforeinput` event isn't recognized.
        ref.current.removeEventListener('beforeinput', onDOMBeforeInput)
      }
    }
  }, [onDOMBeforeInput])

  // Listen on the native `selectionchange` event to be able to update any time
  // the selection changes. This is required because React's `onSelect` is leaky
  // and non-standard so it doesn't fire until after a selection has been
  // released. This causes issues in situations where another change happens
  // while a selection is being dragged.
  const onDOMSelectionChange = useCallback(
    throttle(() => {
      if (!readOnly && !state.isComposing && !state.isUpdatingSelection) {
        const { activeElement } = window.document
        const el = ReactEditor.toDOMNode(editor, editor)
        const domSelection = window.getSelection()

        if (activeElement === el) {
          state.latestElement = activeElement
          IS_FOCUSED.set(editor, true)
        } else {
          IS_FOCUSED.delete(editor)
        }

        if (!domSelection) {
          return Transforms.deselect(editor)
        }

        const { anchorNode, focusNode } = domSelection

        const anchorNodeSelectable =
          hasEditableTarget(editor, anchorNode) ||
          isTargetInsideVoid(editor, anchorNode)

        const focusNodeSelectable =
          hasEditableTarget(editor, focusNode) ||
          isTargetInsideVoid(editor, focusNode)

        if (anchorNodeSelectable && focusNodeSelectable) {
          const range = ReactEditor.toSlateRange(editor, domSelection)
          Transforms.select(editor, range)
        } else {
          Transforms.deselect(editor)
        }
      }
    }, 100),
    [readOnly]
  )

  // Attach a native DOM event handler for `selectionchange`, because React's
  // built-in `onSelect` handler doesn't fire for all selection changes. It's a
  // leaky polyfill that only fires on keypresses or clicks. Instead, we want to
  // fire for any change to the selection inside the editor. (2019/11/04)
  // https://github.com/facebook/react/issues/5785
  useIsomorphicLayoutEffect(() => {
    window.document.addEventListener('selectionchange', onDOMSelectionChange)

    return () => {
      window.document.removeEventListener(
        'selectionchange',
        onDOMSelectionChange
      )
    }
  }, [onDOMSelectionChange])

  const decorations = decorate([editor, []])

  if (
    placeholder &&
    editor.children.length === 1 &&
    Array.from(Node.texts(editor)).length === 1 &&
    Node.string(editor) === ''
  ) {
    const start = Editor.start(editor, [])
    decorations.push({
      [PLACEHOLDER_SYMBOL]: true,
      placeholder,
      anchor: start,
      focus: start,
    })
  }

  return (
    <ReadOnlyContext.Provider value={readOnly}>
      <Component
        // COMPAT: The Grammarly Chrome extension works by changing the DOM
        // out from under `contenteditable` elements, which leads to weird
        // behaviors so we have to disable it like editor. (2017/04/24)
        data-gramm={false}
        role={readOnly ? undefined : 'textbox'}
        {...attributes}
        // COMPAT: Certain browsers don't support the `beforeinput` event, so we'd
        // have to use hacks to make these replacement-based features work.
        spellCheck={
          !HAS_BEFORE_INPUT_SUPPORT ? undefined : attributes.spellCheck
        }
        autoCorrect={
          !HAS_BEFORE_INPUT_SUPPORT ? undefined : attributes.autoCorrect
        }
        autoCapitalize={
          !HAS_BEFORE_INPUT_SUPPORT ? undefined : attributes.autoCapitalize
        }
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
        onBeforeInput={useCallback(
          (event: React.FormEvent<HTMLDivElement>) => {
            // COMPAT: Certain browsers don't support the `beforeinput` event, so we
            // fall back to React's leaky polyfill instead just for it. It
            // only works for the `insertText` input type.
            if (
              !HAS_BEFORE_INPUT_SUPPORT &&
              !readOnly &&
              !isEventHandled(event, attributes.onBeforeInput) &&
              hasEditableTarget(editor, event.target)
            ) {
              event.preventDefault()
              const text = (event as any).data as string
              Editor.insertText(editor, text)
            }
          },
          [readOnly]
        )}
        onBlur={useCallback(
          (event: React.FocusEvent<HTMLDivElement>) => {
            if (
              readOnly ||
              state.isUpdatingSelection ||
              !hasEditableTarget(editor, event.target) ||
              isEventHandled(event, attributes.onBlur)
            ) {
              return
            }

            // COMPAT: If the current `activeElement` is still the previous
            // one, this is due to the window being blurred when the tab
            // itself becomes unfocused, so we want to abort early to allow to
            // editor to stay focused when the tab becomes focused again.
            if (state.latestElement === window.document.activeElement) {
              return
            }

            const { relatedTarget } = event
            const el = ReactEditor.toDOMNode(editor, editor)

            // COMPAT: The event should be ignored if the focus is returning
            // to the editor from an embedded editable element (eg. an <input>
            // element inside a void node).
            if (relatedTarget === el) {
              return
            }

            // COMPAT: The event should be ignored if the focus is moving from
            // the editor to inside a void node's spacer element.
            if (
              isDOMElement(relatedTarget) &&
              relatedTarget.hasAttribute('data-slate-spacer')
            ) {
              return
            }

            // COMPAT: The event should be ignored if the focus is moving to a
            // non- editable section of an element that isn't a void node (eg.
            // a list item of the check list example).
            if (
              relatedTarget != null &&
              isDOMNode(relatedTarget) &&
              ReactEditor.hasDOMNode(editor, relatedTarget)
            ) {
              const node = ReactEditor.toSlateNode(editor, relatedTarget)

              if (Element.isElement(node) && !editor.isVoid(node)) {
                return
              }
            }

            IS_FOCUSED.delete(editor)
          },
          [readOnly, attributes.onBlur]
        )}
        onClick={useCallback(
          (event: React.MouseEvent<HTMLDivElement>) => {
            if (
              !readOnly &&
              hasTarget(editor, event.target) &&
              !isEventHandled(event, attributes.onClick) &&
              isDOMNode(event.target)
            ) {
              const node = ReactEditor.toSlateNode(editor, event.target)
              const path = ReactEditor.findPath(editor, node)
              const start = Editor.start(editor, path)
              const end = Editor.end(editor, path)

              const startVoid = Editor.void(editor, { at: start })
              const endVoid = Editor.void(editor, { at: end })

              if (
                startVoid &&
                endVoid &&
                Path.equals(startVoid[1], endVoid[1])
              ) {
                const range = Editor.range(editor, start)
                Transforms.select(editor, range)
              }
            }
          },
          [readOnly, attributes.onClick]
        )}
        onCompositionEnd={useCallback(
          (event: React.CompositionEvent<HTMLDivElement>) => {
            if (
              hasEditableTarget(editor, event.target) &&
              !isEventHandled(event, attributes.onCompositionEnd)
            ) {
              state.isComposing = false

              // COMPAT: In Chrome, `beforeinput` events for compositions
              // aren't correct and never fire the "insertFromComposition"
              // type that we need. So instead, insert whenever a composition
              // ends since it will already have been committed to the DOM.
              if (!IS_SAFARI && !IS_FIREFOX && event.data) {
                Editor.insertText(editor, event.data)
              }
            }
          },
          [attributes.onCompositionEnd]
        )}
        onCompositionStart={useCallback(
          (event: React.CompositionEvent<HTMLDivElement>) => {
            if (
              hasEditableTarget(editor, event.target) &&
              !isEventHandled(event, attributes.onCompositionStart)
            ) {
              state.isComposing = true
            }
          },
          [attributes.onCompositionStart]
        )}
        onCopy={useCallback(
          (event: React.ClipboardEvent<HTMLDivElement>) => {
            if (
              hasEditableTarget(editor, event.target) &&
              !isEventHandled(event, attributes.onCopy)
            ) {
              event.preventDefault()
              ReactEditor.setFragmentData(editor, event.clipboardData)
            }
          },
          [attributes.onCopy]
        )}
        onCut={useCallback(
          (event: React.ClipboardEvent<HTMLDivElement>) => {
            if (
              !readOnly &&
              hasEditableTarget(editor, event.target) &&
              !isEventHandled(event, attributes.onCut)
            ) {
              event.preventDefault()
              ReactEditor.setFragmentData(editor, event.clipboardData)
              const { selection } = editor

              if (selection && Range.isExpanded(selection)) {
                Editor.deleteFragment(editor)
              }
            }
          },
          [readOnly, attributes.onCut]
        )}
        onDragOver={useCallback(
          (event: React.DragEvent<HTMLDivElement>) => {
            if (
              hasTarget(editor, event.target) &&
              !isEventHandled(event, attributes.onDragOver)
            ) {
              // Only when the target is void, call `preventDefault` to signal
              // that drops are allowed. Editable content is droppable by
              // default, and calling `preventDefault` hides the cursor.
              const node = ReactEditor.toSlateNode(editor, event.target)

              if (Editor.isVoid(editor, node)) {
                event.preventDefault()
              }
            }
          },
          [attributes.onDragOver]
        )}
        onDragStart={useCallback(
          (event: React.DragEvent<HTMLDivElement>) => {
            if (
              hasTarget(editor, event.target) &&
              !isEventHandled(event, attributes.onDragStart)
            ) {
              const node = ReactEditor.toSlateNode(editor, event.target)
              const path = ReactEditor.findPath(editor, node)
              const voidMatch = Editor.void(editor, { at: path })

              // If starting a drag on a void node, make sure it is selected
              // so that it shows up in the selection's fragment.
              if (voidMatch) {
                const range = Editor.range(editor, path)
                Transforms.select(editor, range)
              }

              ReactEditor.setFragmentData(editor, event.dataTransfer)
            }
          },
          [attributes.onDragStart]
        )}
        onDrop={useCallback(
          (event: React.DragEvent<HTMLDivElement>) => {
            if (
              hasTarget(editor, event.target) &&
              !readOnly &&
              !isEventHandled(event, attributes.onDrop)
            ) {
              // COMPAT: Certain browsers don't fire `beforeinput` events at all, and
              // Chromium browsers don't properly fire them for files being
              // dropped into a `contenteditable`. (2019/11/26)
              // https://bugs.chromium.org/p/chromium/issues/detail?id=1028668
              if (
                !HAS_BEFORE_INPUT_SUPPORT ||
                (!IS_SAFARI && event.dataTransfer.files.length > 0)
              ) {
                event.preventDefault()
                const range = ReactEditor.findEventRange(editor, event)
                const data = event.dataTransfer
                Transforms.select(editor, range)
                ReactEditor.insertData(editor, data)
              }
            }
          },
          [readOnly, attributes.onDrop]
        )}
        onFocus={useCallback(
          (event: React.FocusEvent<HTMLDivElement>) => {
            if (
              !readOnly &&
              !state.isUpdatingSelection &&
              hasEditableTarget(editor, event.target) &&
              !isEventHandled(event, attributes.onFocus)
            ) {
              const el = ReactEditor.toDOMNode(editor, editor)
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
          },
          [readOnly, attributes.onFocus]
        )}
        onKeyDown={useCallback(
          (event: React.KeyboardEvent<HTMLDivElement>) => {
            if (
              !readOnly &&
              hasEditableTarget(editor, event.target) &&
              !isEventHandled(event, attributes.onKeyDown)
            ) {
              const { nativeEvent } = event
              const { selection } = editor

              // COMPAT: Since we prevent the default behavior on
              // `beforeinput` events, the browser doesn't think there's ever
              // any history stack to undo or redo, so we have to manage these
              // hotkeys ourselves. (2019/11/06)
              if (Hotkeys.isRedo(nativeEvent)) {
                event.preventDefault()

                if (typeof editor.redo === 'function') {
                  editor.redo()
                }

                return
              }

              if (Hotkeys.isUndo(nativeEvent)) {
                event.preventDefault()

                if (typeof editor.undo === 'function') {
                  editor.undo()
                }

                return
              }

              // COMPAT: Certain browsers don't handle the selection updates
              // properly. In Chrome, the selection isn't properly extended.
              // And in Firefox, the selection isn't properly collapsed.
              // (2017/10/17)
              if (Hotkeys.isMoveLineBackward(nativeEvent)) {
                event.preventDefault()
                Transforms.move(editor, { unit: 'line', reverse: true })
                return
              }

              if (Hotkeys.isMoveLineForward(nativeEvent)) {
                event.preventDefault()
                Transforms.move(editor, { unit: 'line' })
                return
              }

              if (Hotkeys.isExtendLineBackward(nativeEvent)) {
                event.preventDefault()
                Transforms.move(editor, {
                  unit: 'line',
                  edge: 'focus',
                  reverse: true,
                })
                return
              }

              if (Hotkeys.isExtendLineForward(nativeEvent)) {
                event.preventDefault()
                Transforms.move(editor, { unit: 'line', edge: 'focus' })
                return
              }

              // COMPAT: If a void node is selected, or a zero-width text node
              // adjacent to an inline is selected, we need to handle these
              // hotkeys manually because browsers won't be able to skip over
              // the void node with the zero-width space not being an empty
              // string.
              if (Hotkeys.isMoveBackward(nativeEvent)) {
                event.preventDefault()

                if (selection && Range.isCollapsed(selection)) {
                  Transforms.move(editor, { reverse: true })
                } else {
                  Transforms.collapse(editor, { edge: 'start' })
                }

                return
              }

              if (Hotkeys.isMoveForward(nativeEvent)) {
                event.preventDefault()

                if (selection && Range.isCollapsed(selection)) {
                  Transforms.move(editor)
                } else {
                  Transforms.collapse(editor, { edge: 'end' })
                }

                return
              }

              if (Hotkeys.isMoveWordBackward(nativeEvent)) {
                event.preventDefault()
                Transforms.move(editor, { unit: 'word', reverse: true })
                return
              }

              if (Hotkeys.isMoveWordForward(nativeEvent)) {
                event.preventDefault()
                Transforms.move(editor, { unit: 'word' })
                return
              }

              // COMPAT: Certain browsers don't support the `beforeinput` event, so we
              // fall back to guessing at the input intention for hotkeys.
              // COMPAT: In iOS, some of these hotkeys are handled in the
              if (!HAS_BEFORE_INPUT_SUPPORT) {
                // We don't have a core behavior for these, but they change the
                // DOM if we don't prevent them, so we have to.
                if (
                  Hotkeys.isBold(nativeEvent) ||
                  Hotkeys.isItalic(nativeEvent) ||
                  Hotkeys.isTransposeCharacter(nativeEvent)
                ) {
                  event.preventDefault()
                  return
                }

                if (Hotkeys.isSplitBlock(nativeEvent)) {
                  event.preventDefault()
                  Editor.insertBreak(editor)
                  return
                }

                if (Hotkeys.isDeleteBackward(nativeEvent)) {
                  event.preventDefault()

                  if (selection && Range.isExpanded(selection)) {
                    Editor.deleteFragment(editor)
                  } else {
                    Editor.deleteBackward(editor)
                  }

                  return
                }

                if (Hotkeys.isDeleteForward(nativeEvent)) {
                  event.preventDefault()

                  if (selection && Range.isExpanded(selection)) {
                    Editor.deleteFragment(editor)
                  } else {
                    Editor.deleteForward(editor)
                  }

                  return
                }

                if (Hotkeys.isDeleteLineBackward(nativeEvent)) {
                  event.preventDefault()

                  if (selection && Range.isExpanded(selection)) {
                    Editor.deleteFragment(editor)
                  } else {
                    Editor.deleteBackward(editor, { unit: 'line' })
                  }

                  return
                }

                if (Hotkeys.isDeleteLineForward(nativeEvent)) {
                  event.preventDefault()

                  if (selection && Range.isExpanded(selection)) {
                    Editor.deleteFragment(editor)
                  } else {
                    Editor.deleteForward(editor, { unit: 'line' })
                  }

                  return
                }

                if (Hotkeys.isDeleteWordBackward(nativeEvent)) {
                  event.preventDefault()

                  if (selection && Range.isExpanded(selection)) {
                    Editor.deleteFragment(editor)
                  } else {
                    Editor.deleteBackward(editor, { unit: 'word' })
                  }

                  return
                }

                if (Hotkeys.isDeleteWordForward(nativeEvent)) {
                  event.preventDefault()

                  if (selection && Range.isExpanded(selection)) {
                    Editor.deleteFragment(editor)
                  } else {
                    Editor.deleteForward(editor, { unit: 'word' })
                  }

                  return
                }
              }
            }
          },
          [readOnly, attributes.onKeyDown]
        )}
        onPaste={useCallback(
          (event: React.ClipboardEvent<HTMLDivElement>) => {
            // COMPAT: Certain browsers don't support the `beforeinput` event, so we
            // fall back to React's `onPaste` here instead.
            // COMPAT: Firefox, Chrome and Safari are not emitting `beforeinput` events
            // when "paste without formatting" option is used.
            // This unfortunately needs to be handled with paste events instead.
            if (
              hasEditableTarget(editor, event.target) &&
              !isEventHandled(event, attributes.onPaste) &&
              (!HAS_BEFORE_INPUT_SUPPORT ||
                isPlainTextOnlyPaste(event.nativeEvent)) &&
              !readOnly
            ) {
              event.preventDefault()
              ReactEditor.insertData(editor, event.clipboardData)
            }
          },
          [readOnly, attributes.onPaste]
        )}
      >
        <Children
          decorate={decorate}
          decorations={decorations}
          node={editor}
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          selection={editor.selection}
        />
      </Component>
    </ReadOnlyContext.Provider>
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
  return isDOMNode(target) && ReactEditor.hasDOMNode(editor, target)
}

/**
 * Check if the target is editable and in the editor.
 */

const hasEditableTarget = (
  editor: ReactEditor,
  target: EventTarget | null
): target is DOMNode => {
  return (
    isDOMNode(target) &&
    ReactEditor.hasDOMNode(editor, target, { editable: true })
  )
}

/**
 * Check if the target is inside void and in the editor.
 */

const isTargetInsideVoid = (
  editor: ReactEditor,
  target: EventTarget | null
): boolean => {
  const slateNode =
    hasTarget(editor, target) && ReactEditor.toSlateNode(editor, target)
  return Editor.isVoid(editor, slateNode)
}

/**
 * Check if an event is overrided by a handler.
 */

const isEventHandled = <
  EventType extends React.SyntheticEvent<unknown, unknown>
>(
  event: EventType,
  handler?: (event: EventType) => void
) => {
  if (!handler) {
    return false
  }

  handler(event)
  return event.isDefaultPrevented() || event.isPropagationStopped()
}

/**
 * Check if a DOM event is overrided by a handler.
 */

const isDOMEventHandled = (event: Event, handler?: (event: Event) => void) => {
  if (!handler) {
    return false
  }

  handler(event)
  return event.defaultPrevented
}
