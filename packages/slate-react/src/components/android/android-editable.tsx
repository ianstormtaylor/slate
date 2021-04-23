import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { Descendant, Editor, Node, Range, Transforms } from 'slate'
import throttle from 'lodash/throttle'
import scrollIntoView from 'scroll-into-view-if-needed'

import { ReactEditor } from '../..'
import { ReadOnlyContext } from '../../hooks/use-read-only'
import { useSlate } from '../../hooks/use-slate'
import { useIsomorphicLayoutEffect } from '../../hooks/use-isomorphic-layout-effect'
import {
  DOMElement,
  getDefaultView,
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
import {
  defaultDecorate,
  hasEditableTarget,
  isEventHandled,
  isTargetInsideVoid,
} from '../default-editable'

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
          // Prevent the default outline styles.
          outline: 'none',
          // Preserve adjacent whitespace and new lines.
          whiteSpace: 'pre-wrap',
          // Allow words to break if they are too long.
          wordWrap: 'break-word',
          // Allow for passed-in styles to override anything.
          ...style,
        }}
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
            // This unfortunately needs to be handled with paste events instead.
            if (
              hasEditableTarget(editor, event.target) &&
              !isEventHandled(event, attributes.onPaste) &&
              isPlainTextOnlyPaste(event.nativeEvent) &&
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
