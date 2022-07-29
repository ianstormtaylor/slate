import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Editor, Element, Node, Range, Transforms, Path, Text } from 'slate'
import throttle from 'lodash/throttle'
import debounce from 'lodash/debounce'
import scrollIntoView from 'scroll-into-view-if-needed'

import { DefaultPlaceholder, ReactEditor } from '../..'
import { ReadOnlyContext } from '../../hooks/use-read-only'
import { useSlate } from '../../hooks/use-slate'
import { useIsomorphicLayoutEffect } from '../../hooks/use-isomorphic-layout-effect'
import { DecorateContext } from '../../hooks/use-decorate'
import {
  DOMElement,
  isDOMElement,
  isDOMNode,
  getDefaultView,
  getClipboardData,
} from '../../utils/dom'
import {
  EDITOR_TO_ELEMENT,
  EDITOR_TO_WINDOW,
  ELEMENT_TO_NODE,
  IS_FOCUSED,
  IS_READ_ONLY,
  NODE_TO_ELEMENT,
  PLACEHOLDER_SYMBOL,
  IS_COMPOSING,
  IS_ON_COMPOSITION_END,
  EDITOR_ON_COMPOSITION_TEXT,
} from '../../utils/weak-maps'
import { normalizeTextInsertionRange } from './diff-text'

import { EditableProps, hasTarget } from '../editable'
import useChildren from '../../hooks/use-children'
import {
  defaultDecorate,
  hasEditableTarget,
  isEventHandled,
  isDOMEventHandled,
  isTargetInsideNonReadonlyVoid,
} from '../editable'

import { useAndroidInputManager } from './use-android-input-manager'
import { useContentKey } from '../../hooks/use-content-key'

/**
 * Editable.
 */

// https://github.com/facebook/draft-js/blob/main/src/component/handlers/composition/DraftEditorCompositionHandler.js#L41
// When using keyboard English association function, conpositionEnd triggered too fast, resulting in after `insertText` still maintain association state.
const RESOLVE_DELAY = 20

export const AndroidEditable = (props: EditableProps): JSX.Element => {
  const {
    autoFocus,
    decorate = defaultDecorate,
    onDOMBeforeInput: propsOnDOMBeforeInput,
    placeholder,
    readOnly = false,
    renderElement,
    renderLeaf,
    renderPlaceholder = props => <DefaultPlaceholder {...props} />,
    style = {},
    as: Component = 'div',
    ...attributes
  } = props
  const editor = useSlate()
  // Rerender editor when composition status changed
  const [isComposing, setIsComposing] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const inputManager = useAndroidInputManager(ref)

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

  const contentKey = useContentKey(editor)

  // Whenever the editor updates...
  useIsomorphicLayoutEffect(() => {
    // Update element-related weak maps with the DOM element ref.
    let window

    if (ref.current && (window = getDefaultView(ref.current))) {
      EDITOR_TO_WINDOW.set(editor, window)
      EDITOR_TO_ELEMENT.set(editor, ref.current)
      NODE_TO_ELEMENT.set(editor, ref.current)
      ELEMENT_TO_NODE.set(ref.current, editor)
    } else {
      NODE_TO_ELEMENT.delete(editor)
    }

    try {
      // Make sure the DOM selection state is in sync.
      const { selection } = editor
      const root = ReactEditor.findDocumentOrShadowRoot(editor)
      const domSelection = root.getSelection()

      if (
        state.isComposing ||
        !domSelection ||
        !ReactEditor.isFocused(editor)
      ) {
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
      if (hasDomSelection && hasDomSelectionInEditor && selection) {
        const slateRange = ReactEditor.toSlateRange(editor, domSelection, {
          exactMatch: true,
          suppressThrow: true,
        })
        if (slateRange && Range.equals(slateRange, selection)) {
          return
        }
      }

      // when <Editable/> is being controlled through external value
      // then its children might just change - DOM responds to it on its own
      // but Slate's value is not being updated through any operation
      // and thus it doesn't transform selection on its own
      if (selection && !ReactEditor.hasRange(editor, selection)) {
        editor.selection = ReactEditor.toSlateRange(editor, domSelection, {
          exactMatch: false,
          suppressThrow: false,
        })
        return
      }

      // Otherwise the DOM selection is out of sync, so update it.
      const el = ReactEditor.toDOMNode(editor, editor)
      state.isUpdatingSelection = true

      const newDomRange = selection && ReactEditor.toDOMRange(editor, selection)

      if (newDomRange) {
        if (Range.isBackward(selection!)) {
          domSelection.setBaseAndExtent(
            newDomRange.endContainer,
            newDomRange.endOffset,
            newDomRange.startContainer,
            newDomRange.startOffset
          )
        } else {
          domSelection.setBaseAndExtent(
            newDomRange.startContainer,
            newDomRange.startOffset,
            newDomRange.endContainer,
            newDomRange.endOffset
          )
        }
        const leafEl = newDomRange.startContainer.parentElement!
        leafEl.getBoundingClientRect = newDomRange.getBoundingClientRect.bind(
          newDomRange
        )
        scrollIntoView(leafEl, {
          scrollMode: 'if-needed',
          boundary: el,
        })
        // @ts-ignore
        delete leafEl.getBoundingClientRect
      } else {
        domSelection.removeAllRanges()
      }

      setTimeout(() => {
        state.isUpdatingSelection = false
      })
    } catch {
      // Failed to update selection, likely due to reconciliation error
      state.isUpdatingSelection = false
    }
  })

  // The autoFocus TextareaHTMLAttribute doesn't do anything on a div, so it
  // needs to be manually focused.
  useEffect(() => {
    if (ref.current && autoFocus) {
      ref.current.focus()
    }
  }, [autoFocus])

  // Listen on the native `selectionchange` event to be able to update any time
  // the selection changes. This is required because React's `onSelect` is leaky
  // and non-standard so it doesn't fire until after a selection has been
  // released. This causes issues in situations where another change happens
  // while a selection is being dragged.
  const onDOMSelectionChange = useCallback(
    throttle(() => {
      try {
        if (
          !state.isComposing &&
          !state.isUpdatingSelection &&
          !inputManager.isReconciling.current
        ) {
          const root = ReactEditor.findDocumentOrShadowRoot(editor)
          const { activeElement } = root
          const el = ReactEditor.toDOMNode(editor, editor)
          const domSelection = root.getSelection()

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
            isTargetInsideNonReadonlyVoid(editor, anchorNode)

          const focusNodeSelectable =
            hasEditableTarget(editor, focusNode) ||
            isTargetInsideNonReadonlyVoid(editor, focusNode)

          if (anchorNodeSelectable && focusNodeSelectable) {
            const range = ReactEditor.toSlateRange(editor, domSelection, {
              exactMatch: false,
              suppressThrow: false,
            })
            Transforms.select(editor, range)
          } else {
            Transforms.deselect(editor)
          }
        }
      } catch {
        // Failed to update selection, likely due to reconciliation error
      }
    }, 100),
    [readOnly]
  )

  const scheduleOnDOMSelectionChange = useMemo(
    () => debounce(onDOMSelectionChange, 0),
    [onDOMSelectionChange]
  )

  // Listen on the native `beforeinput` event to get real "Level 2" events. This
  // is required because React's `beforeinput` is fake and never really attaches
  // to the real event sadly. (2019/11/01)
  // https://github.com/facebook/react/issues/11211
  const onDOMBeforeInput = useCallback(
    (event: InputEvent) => {
      if (
        !readOnly &&
        hasEditableTarget(editor, event.target) &&
        !isDOMEventHandled(event, propsOnDOMBeforeInput)
      ) {
        // Some IMEs/Chrome extensions like e.g. Grammarly set the selection immediately before
        // triggering a `beforeinput` expecting the change to be applied to the immediately before
        // set selection.
        scheduleOnDOMSelectionChange.flush()

        inputManager.onUserInput()
      }
    },
    [readOnly, propsOnDOMBeforeInput]
  )

  // Attach a native DOM event handler for `beforeinput` events, because React's
  // built-in `onBeforeInput` is actually a leaky polyfill that doesn't expose
  // real `beforeinput` events sadly... (2019/11/04)
  useIsomorphicLayoutEffect(() => {
    const node = ref.current

    // @ts-ignore The `beforeinput` event isn't recognized.
    node?.addEventListener('beforeinput', onDOMBeforeInput)

    // @ts-ignore The `beforeinput` event isn't recognized.
    return () => node?.removeEventListener('beforeinput', onDOMBeforeInput)
  }, [contentKey, propsOnDOMBeforeInput])

  // Attach a native DOM event handler for `selectionchange`, because React's
  // built-in `onSelect` handler doesn't fire for all selection changes. It's a
  // leaky polyfill that only fires on keypresses or clicks. Instead, we want to
  // fire for any change to the selection inside the editor. (2019/11/04)
  // https://github.com/facebook/react/issues/5785
  useIsomorphicLayoutEffect(() => {
    const window = ReactEditor.getWindow(editor)
    window.document.addEventListener(
      'selectionchange',
      scheduleOnDOMSelectionChange
    )

    return () => {
      window.document.removeEventListener(
        'selectionchange',
        scheduleOnDOMSelectionChange
      )
    }
  }, [scheduleOnDOMSelectionChange])

  const decorations = decorate([editor, []])

  if (
    placeholder &&
    editor.children.length === 1 &&
    Array.from(Node.texts(editor)).length === 1 &&
    Node.string(editor) === '' &&
    !isComposing
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
      <DecorateContext.Provider value={decorate}>
        <Component
          key={contentKey}
          role={readOnly ? undefined : 'textbox'}
          {...attributes}
          spellCheck={attributes.spellCheck}
          autoCorrect={attributes.autoCorrect}
          autoCapitalize={attributes.autoCapitalize}
          data-slate-editor
          data-slate-node="value"
          contentEditable={readOnly ? undefined : true}
          suppressContentEditableWarning
          ref={ref}
          style={{
            // Allow positioning relative to the editable element.
            position: 'relative',
            // Prevent the default outline styles.
            outline: 'none',
            // Preserve adjacent whitespace and new lines.
            whiteSpace: 'pre-wrap',
            // Allow words to break if they are too long.
            wordWrap: 'break-word',
            // Allow for passed-in styles to override anything.
            ...style,
          }}
          onCopy={useCallback(
            (event: React.ClipboardEvent<HTMLDivElement>) => {
              if (
                hasEditableTarget(editor, event.target) &&
                !isEventHandled(event, attributes.onCopy)
              ) {
                event.preventDefault()
                ReactEditor.setFragmentData(editor, event.clipboardData, 'copy')
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
                ReactEditor.setFragmentData(editor, event.clipboardData, 'cut')
                const { selection } = editor

                if (selection) {
                  if (Range.isExpanded(selection)) {
                    Editor.deleteFragment(editor)
                  } else {
                    const node = Node.parent(editor, selection.anchor.path)
                    if (Editor.isVoid(editor, node)) {
                      Transforms.delete(editor)
                    }
                  }
                }
              }
            },
            [readOnly, attributes.onCut]
          )}
          onFocus={useCallback(
            (event: React.FocusEvent<HTMLDivElement>) => {
              if (
                !readOnly &&
                !state.isUpdatingSelection &&
                hasEditableTarget(editor, event.target) &&
                !isEventHandled(event, attributes.onFocus)
              ) {
                const root = ReactEditor.findDocumentOrShadowRoot(editor)
                state.latestElement = root.activeElement

                IS_FOCUSED.set(editor, true)
              }
            },
            [readOnly, attributes.onFocus]
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
              const root = ReactEditor.findDocumentOrShadowRoot(editor)
              if (state.latestElement === root.activeElement) {
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

                // At this time, the Slate document may be arbitrarily different,
                // because onClick handlers can change the document before we get here.
                // Therefore we must check that this path actually exists,
                // and that it still refers to the same node.
                if (Editor.hasPath(editor, path)) {
                  const lookupNode = Node.get(editor, path)
                  if (lookupNode === node) {
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
                scheduleOnDOMSelectionChange.flush()
                setTimeout(() => {
                  state.isComposing && setIsComposing(false)
                  state.isComposing = false

                  IS_COMPOSING.set(editor, false)
                  IS_ON_COMPOSITION_END.set(editor, true)

                  const insertedText =
                    EDITOR_ON_COMPOSITION_TEXT.get(editor) || []

                  // `insertedText` is set in `MutationObserver` constructor.
                  // If open phone keyboard association function, `CompositionEvent` will be triggered.
                  if (!insertedText.length) {
                    return
                  }

                  EDITOR_ON_COMPOSITION_TEXT.set(editor, [])

                  const { selection } = editor

                  insertedText.forEach(insertion => {
                    const text = insertion.text.insertText
                    const at = normalizeTextInsertionRange(
                      editor,
                      selection,
                      insertion
                    )
                    Transforms.setSelection(editor, at)
                    Editor.insertText(editor, text)
                  })
                }, RESOLVE_DELAY)
              }
            },
            [attributes.onCompositionEnd]
          )}
          onCompositionUpdate={useCallback(
            (event: React.CompositionEvent<HTMLDivElement>) => {
              if (
                hasEditableTarget(editor, event.target) &&
                !isEventHandled(event, attributes.onCompositionUpdate)
              ) {
                !state.isComposing && setIsComposing(true)
                state.isComposing = true
                IS_COMPOSING.set(editor, true)
              }
            },
            [attributes.onCompositionUpdate]
          )}
          onCompositionStart={useCallback(
            (event: React.CompositionEvent<HTMLDivElement>) => {
              if (
                hasEditableTarget(editor, event.target) &&
                !isEventHandled(event, attributes.onCompositionStart)
              ) {
                !state.isComposing && setIsComposing(true)
                state.isComposing = true
                IS_COMPOSING.set(editor, true)
              }
            },
            [attributes.onCompositionStart]
          )}
          onPaste={useCallback(
            (event: React.ClipboardEvent<HTMLDivElement>) => {
              // this will make application/x-slate-fragment exist when onPaste attributes is passed
              event.clipboardData = getClipboardData(event.clipboardData)
              // This unfortunately needs to be handled with paste events instead.
              if (
                hasEditableTarget(editor, event.target) &&
                !isEventHandled(event, attributes.onPaste) &&
                !readOnly
              ) {
                event.preventDefault()
                ReactEditor.insertData(editor, event.clipboardData)
              }
            },
            [readOnly, attributes.onPaste]
          )}
        >
          {useChildren({
            decorations,
            node: editor,
            renderElement,
            renderPlaceholder,
            renderLeaf,
            selection: editor.selection,
          })}
        </Component>
      </DecorateContext.Provider>
    </ReadOnlyContext.Provider>
  )
}
