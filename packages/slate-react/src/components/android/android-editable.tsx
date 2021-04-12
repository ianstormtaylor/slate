import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import {
  Descendant,
  Editor,
  Element,
  Node,
  NodeEntry,
  Range,
  Text,
  Transforms,
} from 'slate'
import throttle from 'lodash/throttle'
import scrollIntoView from 'scroll-into-view-if-needed'

import {
  IS_CHROME_LEGACY,
  IS_EDGE_LEGACY,
  IS_FIREFOX,
  IS_SAFARI,
} from '../../utils/environment'
import { ReactEditor } from '../..'
import { ReadOnlyContext } from '../../hooks/use-read-only'
import { useSlate } from '../../hooks/use-slate'
import { useIsomorphicLayoutEffect } from '../../hooks/use-isomorphic-layout-effect'
import {
  DOMElement,
  DOMNode,
  DOMRange,
  DOMStaticRange,
  getDefaultView,
  isDOMNode,
  isPlainTextOnlyPaste,
} from '../../utils/dom'
import {
  EDITOR_TO_ELEMENT,
  EDITOR_TO_RESTORE_DOM,
  EDITOR_TO_WINDOW,
  ELEMENT_TO_NODE,
  IS_FOCUSED,
  IS_READ_ONLY,
  NODE_TO_ELEMENT,
  PLACEHOLDER_SYMBOL,
} from '../../utils/weak-maps'
import { AndroidInputManager } from './android-input-manager'
import { EditableProps } from '../editable'
import { ErrorBoundary } from './ErrorBoundary'
import useChildren from '../../hooks/use-children'

// COMPAT: Firefox/Edge Legacy don't support the `beforeinput` event
// Chrome Legacy doesn't support `beforeinput` correctly
const HAS_BEFORE_INPUT_SUPPORT = !(
  IS_FIREFOX ||
  IS_EDGE_LEGACY ||
  IS_CHROME_LEGACY
)

export const AndroidEditableNoError = (props: EditableProps): JSX.Element => {
  return (
    <ErrorBoundary>
      <AndroidEditable {...props} />
    </ErrorBoundary>
  )
}

/**
 * Editable.
 */

export const AndroidEditable = (props: EditableProps): JSX.Element => {
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
  const inputManager = useMemo(() => new AndroidInputManager(editor), [editor])

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
    let window
    if (ref.current && (window = getDefaultView(ref.current))) {
      EDITOR_TO_WINDOW.set(editor, window)
      EDITOR_TO_ELEMENT.set(editor, ref.current)
      NODE_TO_ELEMENT.set(editor, ref.current)
      ELEMENT_TO_NODE.set(ref.current, editor)
    } else {
      NODE_TO_ELEMENT.delete(editor)
    }
  })

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

    try {
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
        scrollIntoView(leafEl, {
          scrollMode: 'if-needed',
          boundary: el,
        })
      } else {
        domSelection.removeAllRanges()
      }

      setTimeout(() => {
        // COMPAT: In Firefox, it's not enough to create a range, you also need
        // to focus the contenteditable element too. (2016/11/16)
        if (newDomRange && IS_FIREFOX) {
          el.focus()
        }

        state.isUpdatingSelection = false
      })
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err)
      state.isUpdatingSelection = false
    }
  })

  useLayoutEffect(() => {
    inputManager.onDidMount()
    return () => {
      inputManager.onWillUnmount()
    }
  }, [])

  const prevValue = useRef<Descendant[]>([])
  if (prevValue.current !== editor.children) {
    inputManager.onRender()
    prevValue.current = editor.children
  }

  useLayoutEffect(() => {
    inputManager.onDidUpdate()
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
      if (!readOnly && !state.isComposing && !state.isUpdatingSelection) {
        inputManager.onSelect()

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
          try {
            const range = ReactEditor.toSlateRange(editor, domSelection)
            Transforms.select(editor, range)
          } catch (e) {
            // expected if the value hasn't been updated yet
          }
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

  const [contentKey, setContentKey] = useState(0)

  const onRestoreDOM = useCallback(() => {
    setContentKey(prev => prev + 1)
  }, [contentKey])
  EDITOR_TO_RESTORE_DOM.set(editor, onRestoreDOM)
  useEffect(() => {
    return () => {
      EDITOR_TO_RESTORE_DOM.delete(editor)
    }
  }, [])

  return (
    <ReadOnlyContext.Provider value={readOnly}>
      <Component
        // COMPAT: The Grammarly Chrome extension works by changing the DOM
        // out from under `contenteditable` elements, which leads to weird
        // behaviors so we have to disable it like editor. (2017/04/24)
        data-gramm={false}
        key={contentKey}
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
              return
            }
          },
          [readOnly]
        )}
        onBlur={useCallback((event: React.FocusEvent<HTMLDivElement>) => {}, [
          readOnly,
          attributes.onBlur,
        ])}
        onClick={useCallback((event: React.MouseEvent<HTMLDivElement>) => {}, [
          readOnly,
          attributes.onClick,
        ])}
        onCompositionEnd={useCallback(
          (event: React.CompositionEvent<HTMLDivElement>) => {
            if (
              hasEditableTarget(editor, event.target) &&
              !isEventHandled(event, attributes.onCompositionEnd)
            ) {
              state.isComposing = false

              inputManager.onCompositionEnd()
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

              inputManager.onCompositionStart()
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
          (event: React.KeyboardEvent<HTMLDivElement>) => {},
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
        {useChildren({
          decorations,
          node: editor,
          renderElement,
          renderLeaf,
          selection: editor.selection,
        })}
      </Component>
    </ReadOnlyContext.Provider>
  )
}

/**
 * A default memoized decorate function.
 */

const defaultDecorate = () => []

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
