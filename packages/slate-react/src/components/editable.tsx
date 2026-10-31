import getDirection from 'direction'
import debounce from 'lodash/debounce'
import throttle from 'lodash/throttle'
import React, {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
  forwardRef,
  ForwardedRef,
  ReactNode,
} from 'react'
import scrollIntoView from 'scroll-into-view-if-needed'
import {
  Editor,
  Element,
  Node,
  NodeEntry,
  Path,
  Point,
  Range,
  Text,
  Transforms,
  DecoratedRange,
  LeafPosition,
} from 'slate'
import { useAndroidInputManager } from '../hooks/android-input-manager/use-android-input-manager'
import useChildren from '../hooks/use-children'
import { DecorateContext, useDecorateContext } from '../hooks/use-decorations'
import { useIsomorphicLayoutEffect } from '../hooks/use-isomorphic-layout-effect'
import { ReadOnlyContext } from '../hooks/use-read-only'
import { useSlate } from '../hooks/use-slate'
import { useTrackUserInput } from '../hooks/use-track-user-input'
import { useCompositionDOM } from '../hooks/use-composition-dom'
import { useNativeFormatDOM } from '../hooks/use-native-format-dom'
import { getPointAboveTrailingNewline } from '../utils/trailing-newline'
import { getCharacterMoveUnit } from '../utils/character-move'
import { removeStrayComposition } from '../utils/misplaced-composition'
import { ReactEditor } from '../plugin/react-editor'
import { deleteMovedRange, getMovableRange } from '../utils/move-range'
import { TRIPLE_CLICK } from 'slate-dom'
import {
  containsShadowAware,
  DOMElement,
  DOMRange,
  DOMText,
  getActiveElement,
  getDefaultView,
  getSelection,
  isDOMElement,
  isDOMNode,
  isPlainTextOnlyPaste,
} from 'slate-dom'
import {
  CAN_USE_DOM,
  HAS_BEFORE_INPUT_SUPPORT,
  IS_ANDROID,
  IS_CHROME,
  IS_FIREFOX,
  IS_FIREFOX_LEGACY,
  IS_IOS,
  IS_WEBKIT,
  IS_UC_MOBILE,
  IS_WECHATBROWSER,
} from 'slate-dom'
import { Hotkeys } from 'slate-dom'
import {
  IS_NODE_MAP_DIRTY,
  EDITOR_TO_ELEMENT,
  EDITOR_TO_FORCE_RENDER,
  EDITOR_TO_PENDING_INSERTION_MARKS,
  EDITOR_TO_USER_MARKS,
  EDITOR_TO_USER_SELECTION,
  EDITOR_TO_WINDOW,
  ELEMENT_TO_NODE,
  IS_COMPOSING,
  IS_FOCUSED,
  IS_READ_ONLY,
  MARK_PLACEHOLDER_SYMBOL,
  NODE_TO_ELEMENT,
  PLACEHOLDER_SYMBOL,
} from 'slate-dom'
import { RestoreDOM } from './restore-dom/restore-dom'
import { AndroidInputManager } from '../hooks/android-input-manager/android-input-manager'
import { ComposingContext, EDITOR_TO_COMPOSING } from '../hooks/use-composing'
import { useFlushDeferredSelectorsOnRender } from '../hooks/use-slate-selector'
import { Slate } from './slate'

type DeferredOperation = () => void

const isTextDOMNode = (node: unknown): node is DOMText =>
  isDOMNode(node) && node.nodeType === 3

const isSameCaretPosition = (editor: Editor, a: Range, b: Range) => {
  if (!Range.isCollapsed(a) || !Range.isCollapsed(b)) {
    return false
  }

  const [first, second] = Path.isBefore(a.anchor.path, b.anchor.path)
    ? [a.anchor, b.anchor]
    : [b.anchor, a.anchor]

  if (second.offset !== 0 || !Path.equals(Path.next(first.path), second.path)) {
    return false
  }

  const node = Node.get(editor, first.path)
  return Node.isText(node) && first.offset === node.text.length
}

const Children = (props: Parameters<typeof useChildren>[0]) => (
  <React.Fragment>{useChildren(props)}</React.Fragment>
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
 * `RenderChunkProps` are passed to the `renderChunk` handler
 */
export interface RenderChunkProps {
  highest: boolean
  lowest: boolean
  children: any
  attributes: {
    'data-slate-chunk': true
  }
}

/**
 * `RenderLeafProps` are passed to the `renderLeaf` handler.
 */
export interface RenderLeafProps {
  children: any
  /**
   * The leaf node with any applied decorations.
   * If no decorations are applied, it will be identical to the `text` property.
   */
  leaf: Text
  text: Text
  attributes: {
    'data-slate-leaf': true
  }
  /**
   * The position of the leaf within the Text node, only present when the text node is split by decorations.
   */
  leafPosition?: LeafPosition
}

/**
 * `RenderTextProps` are passed to the `renderText` handler.
 */
export interface RenderTextProps {
  text: Text
  children: any
  attributes: {
    'data-slate-node': 'text'
    ref: any
  }
}

/**
 * `EditableProps` are passed to the `<Editable>` component.
 * @inline
 */
export interface EditableProps extends React.HTMLAttributes<HTMLDivElement> {
  decorate?: ((entry: NodeEntry) => DecoratedRange[]) | undefined
  onDOMBeforeInput?: ((event: InputEvent) => void) | undefined

  /**
   * The text to display as a placeholder when the Editor is empty. A typical value for `placeholder` would be "Enter text here..." or "Start typing...". The placeholder text will not be treated as an actual value and will disappear when the user starts typing in the Editor.
   *
   * While it is shown, the editor root gets an `aria-placeholder` with the same text.
   */
  placeholder?: string | undefined

  /**
   * When set to true, renders the editor in a "read-only" state. In this state, user input and interactions will not modify the editor's content.
   *
   * Caller-provided event handlers still run in read-only mode; Slate skips its own editing behavior. Add `tabIndex={0}` to make a read-only editor keyboard-focusable. Read-only editors do not receive a tab index by default.
   *
   * If this prop is omitted or set to false, the editor remains in the default "editable" state, allowing users to interact with and modify the content.
   *
   * This prop is particularly useful when you want to display text or rich media content without allowing users to edit it, such as when displaying published content or a preview of the user's input.
   */
  readOnly?: boolean | undefined
  role?: string | undefined
  style?: React.CSSProperties | undefined

  /**
   * The `renderElement` prop is a function used to render a custom component for a specific type of Element node in the Slate.js document model.
   *
   * The `attributes` must be added to the props of the top level HTML element returned from the function and the `children` must be rendered somewhere inside the returned JSX.
   *
   * @example
   * Here is a typical usage of `renderElement` with two types of elements.
   *
   * ```ts
   * // We use `useCallback` here to memoize the function for subsequent renders.
   * props.renderElement = useCallback(props => {
   *   switch (props.element.type) {
   *     case 'code':
   *       return (
   *         <pre {...props.attributes}>
   *           <code>{props.children}</code>
   *         </pre>
   *       )
   *     default:
   *       return <p {...props.attributes}>{props.children}</p>
   *   }
   * }, [])
   * ```
   */
  renderElement?: ((props: RenderElementProps) => React.JSX.Element) | undefined
  renderChunk?: ((props: RenderChunkProps) => React.JSX.Element) | undefined

  /**
   * The `renderLeaf` prop allows you to customize the rendering of leaf nodes in the document tree of your Slate editor. A "leaf" in Slate is the smallest chunk of text and its associated formatting attributes.
   *
   * @example
   * ```jsx
   * <Editor
   *   renderLeaf={({ attributes, children, leaf }) => {
   *     return (
   *       <span
   *         {...attributes}
   *         style={{ fontWeight: leaf.bold ? 'bold' : 'normal' }}
   *       >
   *         {children}
   *       </span>
   *     )
   *   }}
   * />
   * ```
   */
  renderLeaf?: ((props: RenderLeafProps) => React.JSX.Element) | undefined

  /**
   * The `renderText` prop allows you to customize the rendering of the container element for a Text node in the Slate editor. This is useful when you need to wrap the entire text node content or add elements associated with the text node as a whole, regardless of how decorations might split the text into multiple leaves.
   *
   * @example
   * ```jsx
   * <Editable
   *   renderText={({ attributes, children, text }) => {
   *     return (
   *       <span {...attributes} className="custom-text">
   *         {children}
   *         {text.tooltipContent && <Tooltip content={text.tooltipContent} />}
   *       </span>
   *     )
   *   }}
   * />
   */
  renderText?: ((props: RenderTextProps) => React.JSX.Element) | undefined

  /**
   * The `renderPlaceholder` prop allows you to customize how the placeholder of the Slate.js `Editable` component is rendered when the editor is empty. The placeholder will only be shown when the editor's content is empty.
   *
   * Note that the `attributes` prop that comes in will contain a `style` object already. This object contains important styling properties which will make the placeholder behave like a placeholder. As such, it is advisable to extend styles and to focus on things like changing colors, opacity etc. Changing positioning, for example, could cause undesirable behavior.
   * @example
   * ```jsx
   * <Editable
   *   placeholder="Enter text here..."
   *   renderPlaceholder={({ attributes, children }) => {
   *     const styledAttributes = {
   *       ...attributes,
   *       style: {
   *         ...attributes.style,
   *         color: 'gray',
   *       },
   *     }
   *     return <div {...styledAttributes}>{children}</div>
   *   }}
   * />
   * ```
   */
  renderPlaceholder?:
    | ((props: RenderPlaceholderProps) => React.JSX.Element)
    | undefined

  /**
   * Slate has its own default method to scroll a DOM selection into view that works for most cases; however, if the default behavior isn't working for you, possible due to some complex styling, you may need to override the default behavior by providing a different function here.
   */
  scrollSelectionIntoView?:
    | ((editor: ReactEditor, domRange: DOMRange) => void)
    | undefined

  /**
   * The as prop specifies the type of element that will be used to render the Editable component in your React application.
   * @defaultValue 'div'
   */
  as?: React.ElementType | undefined

  /**
   * The `disableDefaultStyles` prop determines whether the default styles of the Slate.js `Editable` component are applied or not.
   *
   * Please note that with this prop set to `true`, you will need to ensure that your styles cater to all the functionalities of the editor that rely on specific styles to work properly.
   *
   * Here are the default styles:
   *
   * ```typescript
   * const defaultStyles = {
   *   // Allow positioning relative to the editable element.
   *   position: 'relative',
   *   // Preserve adjacent whitespace and new lines.
   *   whiteSpace: 'pre-wrap',
   *   // Allow words to break if they are too long.
   *   wordWrap: 'break-word',
   *   // Make the minimum height that of the placeholder.
   *   ...(placeholderHeight ? { minHeight: placeholderHeight } : {}),
   * }
   * ```
   */
  disableDefaultStyles?: boolean | undefined
}

/**
 * The `Editable` component is the main editing component. Note that it must be inside a {@link Slate} component.
 * Keyboard focus (Tab or Shift+Tab) restores the editor's existing selection. If there is no selection, the browser chooses the initial caret position. Clicking the editor places the caret at the clicked position.
 * @param props The props for the Editable component.
 *
 * It also inherits all React props for {@link React.TextareaHTMLAttributes | a contentEditable div}.
 *
 *
 * @group Components
 */
export const Editable: (props: EditableProps) => ReactNode = forwardRef(
  (props: EditableProps, forwardedRef: ForwardedRef<HTMLDivElement>) => {
    const defaultRenderPlaceholder = useCallback(
      (props: RenderPlaceholderProps) => <DefaultPlaceholder {...props} />,
      []
    )
    const {
      autoFocus,
      decorate = defaultDecorate,
      onDOMBeforeInput: propsOnDOMBeforeInput,
      placeholder,
      readOnly = false,
      renderElement,
      renderChunk,
      renderLeaf,
      renderText,
      renderPlaceholder = defaultRenderPlaceholder,
      scrollSelectionIntoView = defaultScrollSelectionIntoView,
      style: userStyle = {},
      as: Component = 'div',
      disableDefaultStyles = false,
      ...attributes
    } = props
    const editor = useSlate()
    // Rerender editor when composition status changed
    const [isComposing, setIsComposing] = useState(false)
    useIsomorphicLayoutEffect(() => {
      EDITOR_TO_COMPOSING.set(editor, isComposing)
      return () => {
        EDITOR_TO_COMPOSING.delete(editor)
      }
    }, [editor, isComposing])
    const ref = useRef<HTMLDivElement | null>(null)
    const previousChildren = useRef(editor.children)
    const previousSelection = useRef(editor.selection)
    const pendingInputScroll = useRef(false)
    const pendingNavigationScroll = useRef(false)
    const deferredOperations = useRef<DeferredOperation[]>([])
    const lastNativeInsertion = useRef<{
      point: Point
      text: string
      domNode: DOMText
      domOffset: number
      domText: string
      char: string
    } | null>(null)
    const [placeholderHeight, setPlaceholderHeight] = useState<
      number | undefined
    >()
    const processing = useRef(false)
    const compositionDOM = useCompositionDOM(editor)
    const nativeFormatDOM = useNativeFormatDOM(editor)
    const deleteOnCompositionEndRef = useRef(false)

    const { onUserInput, receivedUserInput } = useTrackUserInput()

    const [, forceRender] = useReducer(s => s + 1, 0)
    EDITOR_TO_FORCE_RENDER.set(editor, forceRender)

    // Update internal state on each render.
    IS_READ_ONLY.set(editor, readOnly)

    // Keep track of some state for the event handler logic.
    const state = useMemo(
      () => ({
        isBlurring: false,
        isDraggingInternally: false,
        isTabbing: false,
        pendingSelection: null as {
          range: Range
          basedOn: Range | null
        } | null,
        isUpdatingSelection: false,
        latestElement: null as DOMElement | null,
        hasMarkPlaceholder: false,
      }),
      []
    )

    // The autoFocus TextareaHTMLAttribute doesn't do anything on a div, so it
    // needs to be manually focused.
    //
    // If this stops working in Firefox, make sure nothing is causing this
    // component to re-render during the initial mount. If the DOM selection is
    // set by `useIsomorphicLayoutEffect` before `onDOMSelectionChange` updates
    // `editor.selection`, the DOM selection can be removed accidentally.
    useEffect(() => {
      if (!ref.current || !autoFocus) {
        return
      }

      if (editor.children.length > 0) {
        ReactEditor.focus(editor)
      } else {
        ref.current.focus()
      }
    }, [autoFocus, editor])

    /**
     * The AndroidInputManager object has a cyclical dependency on onDOMSelectionChange
     *
     * It is defined as a reference to simplify hook dependencies and clarify that
     * it needs to be initialized.
     */
    const androidInputManagerRef = useRef<
      AndroidInputManager | null | undefined
    >(undefined)

    // Listen on the native `selectionchange` event to be able to update any time
    // the selection changes. This is required because React's `onSelect` is leaky
    // and non-standard so it doesn't fire until after a selection has been
    // released. This causes issues in situations where another change happens
    // while a selection is being dragged.
    const onDOMSelectionChange = useMemo(
      () =>
        throttle(() => {
          if (IS_NODE_MAP_DIRTY.get(editor)) {
            onDOMSelectionChange()
            return
          }

          state.pendingSelection = null

          const el = ReactEditor.toDOMNode(editor, editor)
          const root = el.getRootNode()

          if (!processing.current && IS_WEBKIT && root instanceof ShadowRoot) {
            processing.current = true

            const active = getActiveElement()

            if (active) {
              document.execCommand('indent')
            } else {
              Transforms.deselect(editor)
            }

            processing.current = false
            return
          }

          const androidInputManager = androidInputManagerRef.current
          if (
            (IS_ANDROID || !ReactEditor.isComposing(editor)) &&
            (!state.isUpdatingSelection || androidInputManager?.isFlushing()) &&
            !state.isDraggingInternally
          ) {
            const root = ReactEditor.findDocumentOrShadowRoot(editor)
            const { activeElement } = root
            const el = ReactEditor.toDOMNode(editor, editor)
            const domSelection = getSelection(root)

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
              ReactEditor.hasEditableTarget(editor, anchorNode) ||
              ReactEditor.isTargetInsideNonReadonlyVoid(editor, anchorNode)

            const focusNodeInEditor = ReactEditor.hasTarget(editor, focusNode)
            const isFocusInEditor =
              isDOMNode(activeElement) && el.contains(activeElement)

            if (
              anchorNodeSelectable &&
              focusNodeInEditor &&
              (readOnly || isFocusInEditor || state.isBlurring)
            ) {
              const range = ReactEditor.toSlateRange(editor, domSelection, {
                exactMatch: false,
                suppressThrow: true,
              })

              if (range) {
                if (
                  !ReactEditor.isComposing(editor) &&
                  !androidInputManager?.hasPendingChanges() &&
                  !androidInputManager?.isFlushing()
                ) {
                  const isCaretOutsideText =
                    domSelection.isCollapsed && !isInSlateText(anchorNode)

                  if (
                    isCaretOutsideText &&
                    editor.selection &&
                    Range.equals(range, editor.selection)
                  ) {
                    restoreDomSelection(editor, domSelection, state)
                  } else {
                    Transforms.select(editor, range)
                  }
                } else {
                  androidInputManager?.handleUserSelect(range)
                }
              }
            }

            // Deselect the editor if the dom selection is not selectable in readonly mode
            if (readOnly && (!anchorNodeSelectable || !focusNodeInEditor)) {
              Transforms.deselect(editor)
            }
          }
        }, 100),
      [editor, readOnly, state]
    )

    const scheduleOnDOMSelectionChange = useMemo(
      () => debounce(onDOMSelectionChange, 0),
      [onDOMSelectionChange]
    )

    const flushDOMSelectionChange = useCallback(() => {
      const root = ReactEditor.toDOMNode(editor, editor).getRootNode()
      scheduleOnDOMSelectionChange.flush()
      if (!(IS_WEBKIT && root instanceof ShadowRoot)) {
        onDOMSelectionChange()
      }
      onDOMSelectionChange.flush()
    }, [editor, onDOMSelectionChange, scheduleOnDOMSelectionChange])

    androidInputManagerRef.current = useAndroidInputManager({
      node: ref,
      onDOMSelectionChange,
      scheduleOnDOMSelectionChange,
    })

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

      // Make sure the DOM selection state is in sync.
      const { selection } = editor
      const scrollForInput = pendingInputScroll.current
      pendingInputScroll.current = false
      const scrollForNavigation = pendingNavigationScroll.current
      pendingNavigationScroll.current = false
      const selectionChangedByInput =
        ((scrollForInput && previousChildren.current !== editor.children) ||
          scrollForNavigation) &&
        !!selection &&
        (!previousSelection.current ||
          !Range.equals(previousSelection.current, selection))
      previousChildren.current = editor.children
      previousSelection.current = selection
      const root = ReactEditor.findDocumentOrShadowRoot(editor)
      const domSelection = getSelection(root)

      if (
        !domSelection ||
        !ReactEditor.isFocused(editor) ||
        androidInputManagerRef.current?.hasPendingAction()
      ) {
        return
      }

      const setDomSelection = (forceChange?: boolean) => {
        const hasDomSelection = domSelection.type !== 'None'

        // If the DOM selection is properly unset, we're done.
        if (!selection && !hasDomSelection) {
          return
        }

        // Get anchorNode and focusNode
        const focusNode = domSelection.focusNode
        let anchorNode

        // COMPAT: In firefox the normal selection way does not work
        // (https://github.com/ianstormtaylor/slate/pull/5486#issue-1820720223)
        if (IS_FIREFOX && domSelection.rangeCount > 1) {
          const firstRange = domSelection.getRangeAt(0)
          const lastRange = domSelection.getRangeAt(domSelection.rangeCount - 1)

          // Right to left
          if (firstRange.startContainer === focusNode) {
            anchorNode = lastRange.endContainer
          } else {
            // Left to right
            anchorNode = firstRange.startContainer
          }
        } else {
          anchorNode = domSelection.anchorNode
        }

        // verify that the dom selection is in the editor
        const editorElement = EDITOR_TO_ELEMENT.get(editor)!
        let hasDomSelectionInEditor = false
        if (
          containsShadowAware(editorElement, anchorNode) &&
          containsShadowAware(editorElement, focusNode)
        ) {
          hasDomSelectionInEditor = true
        }

        // If the DOM selection is in the editor and the editor selection is already correct, we're done.
        if (
          hasDomSelection &&
          hasDomSelectionInEditor &&
          selection &&
          !forceChange
        ) {
          const slateRange = ReactEditor.toSlateRange(editor, domSelection, {
            exactMatch: true,

            // domSelection is not necessarily a valid Slate range
            // (e.g. when clicking on contentEditable:false element)
            suppressThrow: true,
          })

          if (
            slateRange &&
            Range.equals(slateRange, selection) &&
            (!state.hasMarkPlaceholder ||
              anchorNode?.parentElement?.hasAttribute(
                'data-slate-mark-placeholder'
              ))
          ) {
            if (selectionChangedByInput) {
              scrollSelectionIntoView(editor, domSelection.getRangeAt(0))
            }
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
            suppressThrow: true,
          })
          return
        }

        const pending = state.pendingSelection
        state.pendingSelection = null

        if (
          pending &&
          !forceChange &&
          pending.basedOn === selection &&
          !(selection && Range.equals(pending.range, selection))
        ) {
          Transforms.select(editor, pending.range)
          return
        }

        // Otherwise the DOM selection is out of sync, so update it.
        state.isUpdatingSelection = true

        const newDomRange =
          selection && ReactEditor.resolveDOMRange(editor, selection)

        if (newDomRange) {
          if (ReactEditor.isComposing(editor) && !IS_ANDROID) {
            if (domSelection.rangeCount > 0) {
              domSelection.collapseToEnd()
            }
          } else if (Range.isBackward(selection!)) {
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
          scrollSelectionIntoView(editor, newDomRange)
        } else {
          domSelection.removeAllRanges()
        }

        return newDomRange
      }

      // In firefox if there is more then 1 range and we call setDomSelection we remove the ability to select more cells in a table
      if (domSelection.rangeCount <= 1) {
        setDomSelection()
      }

      const ensureSelection =
        androidInputManagerRef.current?.isFlushing() === 'action'

      if (!IS_ANDROID || !ensureSelection) {
        setTimeout(() => {
          state.isUpdatingSelection = false
        })
        return
      }

      let timeoutId: ReturnType<typeof setTimeout> | null = null
      const animationFrameId = requestAnimationFrame(() => {
        if (ensureSelection) {
          const ensureDomSelection = (forceChange?: boolean) => {
            const el = EDITOR_TO_ELEMENT.get(editor)

            if (!el) {
              return
            }

            el.focus()
            setDomSelection(forceChange)
          }

          // Compat: Android IMEs try to force their selection by manually re-applying it even after we set it.
          // This essentially would make setting the slate selection during an update meaningless, so we force it
          // again here. We can't only do it in the setTimeout after the animation frame since that would cause a
          // visible flicker.
          ensureDomSelection()

          timeoutId = setTimeout(() => {
            // COMPAT: While setting the selection in an animation frame visually correctly sets the selection,
            // it doesn't update GBoards spellchecker state. We have to manually trigger a selection change after
            // the animation frame to ensure it displays the correct state.
            ensureDomSelection(true)
            state.isUpdatingSelection = false
          })
        }
      })

      return () => {
        cancelAnimationFrame(animationFrameId)
        if (timeoutId) {
          clearTimeout(timeoutId)
        }
      }
    })

    // Listen on the native `beforeinput` event to get real "Level 2" events. This
    // is required because React's `beforeinput` is fake and never really attaches
    // to the real event sadly. (2019/11/01)
    // https://github.com/facebook/react/issues/11211
    const onDOMBeforeInput = useCallback(
      (event: InputEvent) => {
        if (readOnly) {
          isDOMEventHandled(event, propsOnDOMBeforeInput)
          return
        }

        if (!ReactEditor.hasEditableTarget(editor, event.target)) {
          return
        }

        handleNativeHistoryEvents(editor, event)
        const el = ReactEditor.toDOMNode(editor, editor)
        const root = el.getRootNode()

        if (processing?.current && IS_WEBKIT && root instanceof ShadowRoot) {
          const ranges = event.getTargetRanges()
          const range = ranges[0]

          const newRange = new window.Range()

          newRange.setStart(range.startContainer, range.startOffset)
          newRange.setEnd(range.endContainer, range.endOffset)

          // Unresolvable ranges would throw out of the handler (#3556); suppress and skip the move.
          const slateRange = ReactEditor.toSlateRange(editor, newRange, {
            exactMatch: false,
            suppressThrow: true,
          })

          if (slateRange) {
            Transforms.select(editor, slateRange)
          }

          event.preventDefault()
          event.stopImmediatePropagation()
          return
        }
        onUserInput()
        pendingInputScroll.current = true

        if (!isDOMEventHandled(event, propsOnDOMBeforeInput)) {
          // COMPAT: BeforeInput events aren't cancelable on android, so we have to handle them differently using the android input manager.
          if (androidInputManagerRef.current) {
            return androidInputManagerRef.current.handleDOMBeforeInput(event)
          }

          // Some IMEs/Chrome extensions like e.g. Grammarly set the selection immediately before
          // triggering a `beforeinput` expecting the change to be applied to the immediately before
          // set selection.
          flushDOMSelectionChange()

          const { selection } = editor
          const { inputType: type } = event
          const data = (event as any).dataTransfer || event.data || undefined

          const isCompositionChange =
            type === 'insertCompositionText' || type === 'deleteCompositionText'

          // COMPAT: use composition change events as a hint to where we should insert
          // composition text if we aren't composing to work around https://github.com/ianstormtaylor/slate/issues/5038
          if (isCompositionChange && ReactEditor.isComposing(editor)) {
            if (IS_CHROME || deleteOnCompositionEndRef.current) {
              compositionDOM.track(event.data)
            }
            return
          }

          let native = false
          let nativePoint: [DOMText, number] | null = null
          if (
            type === 'insertText' &&
            selection &&
            Range.isCollapsed(selection) &&
            // Only use native character insertion for single characters a-z or space for now.
            // Long-press events (hold a + press 4 = ä) to choose a special character otherwise
            // causes duplicate inserts.
            event.data &&
            event.data.length === 1 &&
            /[a-z ]/i.test(event.data) &&
            // Chrome has issues correctly editing the start of nodes: https://bugs.chromium.org/p/chromium/issues/detail?id=1249405
            // When there is an inline element, e.g. a link, and you select
            // right after it (the start of the next node).
            selection.anchor.offset !== 0
          ) {
            native = true

            // Skip native if there are marks, as
            // `insertText` will insert a node, not just text.
            if (
              editor.marks ||
              (typeof Editor.insertionPoint === 'function' &&
                !Point.equals(
                  Editor.insertionPoint(editor, selection.anchor),
                  selection.anchor
                ))
            ) {
              native = false
            }

            const domSelection = getSelection(
              ReactEditor.findDocumentOrShadowRoot(editor)
            )
            const domAnchor = domSelection?.anchorNode

            if (!isInSlateText(domAnchor)) {
              native = false
            }

            // If the NODE_MAP is dirty, we can't trust the selection anchor (eg ReactEditor.toDOMPoint)
            if (!IS_NODE_MAP_DIRTY.get(editor)) {
              // Chrome also has issues correctly editing the end of anchor elements: https://bugs.chromium.org/p/chromium/issues/detail?id=1259100
              // Therefore we don't allow native events to insert text at the end of anchor nodes.
              const { anchor } = selection

              const domPoint = ReactEditor.resolveDOMPoint(editor, anchor)

              if (!domPoint) {
                native = false
              } else {
                const [node, offset] = domPoint
                const anchorNode = node.parentElement?.closest('a')

                const window = ReactEditor.getWindow(editor)

                if (
                  native &&
                  anchorNode &&
                  ReactEditor.hasDOMNode(editor, anchorNode)
                ) {
                  // Find the last text node inside the anchor.
                  const lastText = window?.document
                    .createTreeWalker(anchorNode, NodeFilter.SHOW_TEXT)
                    .lastChild() as DOMText | null

                  if (
                    lastText === node &&
                    lastText.textContent?.length === offset
                  ) {
                    native = false
                  }
                }

                // Chrome has issues with the presence of tab characters inside elements with whiteSpace = 'pre'
                // causing abnormal insert behavior: https://bugs.chromium.org/p/chromium/issues/detail?id=1219139
                if (
                  native &&
                  node.parentElement &&
                  window?.getComputedStyle(node.parentElement)?.whiteSpace ===
                    'pre'
                ) {
                  const block = Editor.above(editor, {
                    at: anchor.path,
                    match: n => Node.isElement(n) && Editor.isBlock(editor, n),
                  })

                  if (block && Node.string(block[0]).includes('\t')) {
                    native = false
                  }
                }

                if (native && isTextDOMNode(node)) {
                  nativePoint =
                    domSelection?.isCollapsed && isTextDOMNode(domAnchor)
                      ? [domAnchor, domSelection.anchorOffset]
                      : [node, offset]
                }
              }
            }
          }
          // COMPAT: For the deleting forward/backward input types we don't want
          // to change the selection because it is the range that will be deleted,
          // and those commands determine that for themselves.
          // If the NODE_MAP is dirty, we can't trust the selection anchor (eg ReactEditor.toDOMPoint via ReactEditor.toSlateRange)
          if (
            (!type.startsWith('delete') || type.startsWith('deleteBy')) &&
            !IS_NODE_MAP_DIRTY.get(editor)
          ) {
            const [targetRange] = event.getTargetRanges()

            if (targetRange) {
              // Unresolvable ranges would throw out of the handler (#3556); suppress and fall back to synthetic handling.
              const range = ReactEditor.toSlateRange(editor, targetRange, {
                exactMatch: false,
                suppressThrow: true,
              })

              if (!range) {
                native = false
              } else if (!selection || !Range.equals(selection, range)) {
                native = false

                const selectionRef =
                  !isCompositionChange &&
                  editor.selection &&
                  !isSameCaretPosition(editor, editor.selection, range) &&
                  Editor.rangeRef(editor, editor.selection)

                Transforms.select(editor, range)

                if (selectionRef) {
                  EDITOR_TO_USER_SELECTION.set(editor, selectionRef)
                }
              }

              if (native && isTextDOMNode(targetRange.startContainer)) {
                nativePoint = [
                  targetRange.startContainer,
                  targetRange.startOffset,
                ]
              }
            }
          }

          // Composition change types occur while a user is composing text and can't be
          // cancelled. Let them through and wait for the composition to end.
          if (isCompositionChange) {
            return
          }

          if (!native) {
            lastNativeInsertion.current = null
            event.preventDefault()
          }

          // COMPAT: If the selection is expanded, even if the command seems like
          // a delete forward/backward command it should delete the selection.
          if (
            selection &&
            Range.isExpanded(selection) &&
            type.startsWith('delete')
          ) {
            const direction = type.endsWith('Backward') ? 'backward' : 'forward'
            Editor.deleteFragment(editor, { direction })
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
              Editor.insertSoftBreak(editor)
              break

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
              if (type === 'insertFromComposition') {
                // COMPAT: in Safari, `compositionend` is dispatched after the
                // `beforeinput` for "insertFromComposition". But if we wait for it
                // then we will abort because we're still composing and the selection
                // won't be updated properly.
                // https://www.w3.org/TR/input-events-2/
                if (ReactEditor.isComposing(editor)) {
                  setIsComposing(false)
                  IS_COMPOSING.set(editor, false)
                }
              }

              // use a weak comparison instead of 'instanceof' to allow
              // programmatic access of paste events coming from external windows
              // like cypress where cy.window does not work realibly
              if (data?.constructor.name === 'DataTransfer') {
                ReactEditor.insertData(editor, data)
              } else if (typeof data === 'string') {
                // Only insertText operations use the native functionality, for now.
                // Potentially expand to single character deletes, as well.
                if (native) {
                  lastNativeInsertion.current = null
                  if (nativePoint && selection) {
                    const [node] = Editor.leaf(editor, selection.anchor)
                    const [domNode, domOffset] = nativePoint
                    lastNativeInsertion.current = {
                      point: selection.anchor,
                      text: node.text,
                      domNode,
                      domOffset,
                      domText: domNode.data,
                      char: data,
                    }
                  }
                  deferredOperations.current.push(() =>
                    Editor.insertText(editor, data)
                  )
                } else {
                  Editor.insertText(editor, data)
                }
              }

              break
            }
          }

          // Restore the actual user section if nothing manually set it.
          const toRestore = EDITOR_TO_USER_SELECTION.get(editor)?.unref()
          EDITOR_TO_USER_SELECTION.delete(editor)

          if (
            toRestore &&
            (!editor.selection || !Range.equals(editor.selection, toRestore))
          ) {
            Transforms.select(editor, toRestore)
          }
        }
      },
      [
        editor,
        onUserInput,
        propsOnDOMBeforeInput,
        compositionDOM,
        flushDOMSelectionChange,
        readOnly,
      ]
    )

    const callbackRef = useCallback(
      (node: HTMLDivElement | null) => {
        if (node == null) {
          onDOMSelectionChange.cancel()
          scheduleOnDOMSelectionChange.cancel()

          EDITOR_TO_ELEMENT.delete(editor)
          NODE_TO_ELEMENT.delete(editor)

          if (ref.current && HAS_BEFORE_INPUT_SUPPORT) {
            // @ts-ignore The `beforeinput` event isn't recognized.
            ref.current.removeEventListener('beforeinput', onDOMBeforeInput)
          }
        } else {
          // Attach a native DOM event handler for `beforeinput` events, because React's
          // built-in `onBeforeInput` is actually a leaky polyfill that doesn't expose
          // real `beforeinput` events sadly... (2019/11/04)
          // https://github.com/facebook/react/issues/11211
          if (HAS_BEFORE_INPUT_SUPPORT) {
            // @ts-ignore The `beforeinput` event isn't recognized.
            node.addEventListener('beforeinput', onDOMBeforeInput)
          }
        }

        ref.current = node
        if (typeof forwardedRef === 'function') {
          forwardedRef(node)
        } else if (forwardedRef) {
          forwardedRef.current = node
        }
      },
      [
        onDOMSelectionChange,
        scheduleOnDOMSelectionChange,
        editor,
        onDOMBeforeInput,
        forwardedRef,
      ]
    )

    useIsomorphicLayoutEffect(() => {
      const window = ReactEditor.getWindow(editor)

      // COMPAT: In Chrome, `selectionchange` events can fire when <input> and
      // <textarea> elements are appended to the DOM, causing
      // `editor.selection` to be overwritten in some circumstances.
      // (2025/01/16) https://issues.chromium.org/issues/389368412
      const readUnsyncedSelection = () => {
        const androidInputManager = androidInputManagerRef.current

        if (
          state.isUpdatingSelection ||
          state.isDraggingInternally ||
          ReactEditor.isComposing(editor) ||
          androidInputManager?.hasPendingChanges() ||
          androidInputManager?.isFlushing() ||
          IS_NODE_MAP_DIRTY.get(editor)
        ) {
          return null
        }

        const domSelection = getSelection(
          ReactEditor.findDocumentOrShadowRoot(editor)
        )

        if (
          !domSelection ||
          !(
            ReactEditor.hasEditableTarget(editor, domSelection.anchorNode) ||
            ReactEditor.isTargetInsideNonReadonlyVoid(
              editor,
              domSelection.anchorNode
            )
          ) ||
          !ReactEditor.hasTarget(editor, domSelection.focusNode)
        ) {
          return null
        }

        const range = ReactEditor.toSlateRange(editor, domSelection, {
          exactMatch: false,
          suppressThrow: true,
        })

        return range ? { range, basedOn: editor.selection } : null
      }

      const onSelectionChange = ({ target }: Event) => {
        const targetElement = target instanceof HTMLElement ? target : null
        const targetTagName = targetElement?.tagName
        if (targetTagName === 'INPUT' || targetTagName === 'TEXTAREA') {
          return
        }
        state.pendingSelection = readUnsyncedSelection()
        scheduleOnDOMSelectionChange()
      }

      // Attach a native DOM event handler for `selectionchange`, because React's
      // built-in `onSelect` handler doesn't fire for all selection changes. It's
      // a leaky polyfill that only fires on keypresses or clicks. Instead, we
      // want to fire for any change to the selection inside the editor.
      // (2019/11/04) https://github.com/facebook/react/issues/5785
      window.document.addEventListener('selectionchange', onSelectionChange)

      const onKeyDown = (event: KeyboardEvent) => {
        state.isTabbing = event.key === 'Tab'
      }
      const clearTabbing = () => {
        state.isTabbing = false
      }
      window.document.addEventListener('keydown', onKeyDown, true)
      window.document.addEventListener('keyup', clearTabbing, true)
      window.document.addEventListener('pointerdown', clearTabbing, true)

      // Listen for dragend and drop globally. In Firefox, if a drop handler
      // initiates an operation that causes the originally dragged element to
      // unmount, that element will not emit a dragend event. (2024/06/21)
      const stoppedDragging = () => {
        state.isDraggingInternally = false
      }
      window.document.addEventListener('dragend', stoppedDragging)
      window.document.addEventListener('drop', stoppedDragging)

      return () => {
        window.document.removeEventListener(
          'selectionchange',
          onSelectionChange
        )
        window.document.removeEventListener('keydown', onKeyDown, true)
        window.document.removeEventListener('keyup', clearTabbing, true)
        window.document.removeEventListener('pointerdown', clearTabbing, true)
        window.document.removeEventListener('dragend', stoppedDragging)
        window.document.removeEventListener('drop', stoppedDragging)
      }
    }, [editor, scheduleOnDOMSelectionChange, state])

    const decorations = decorate([editor, []])
    const decorateContext = useDecorateContext(decorate)

    const showPlaceholder =
      placeholder &&
      editor.children.length === 1 &&
      Array.from(Node.texts(editor)).length === 1 &&
      Node.string(editor) === '' &&
      !isComposing

    const placeHolderResizeHandler = useCallback(
      (placeholderEl: HTMLElement | null) => {
        if (placeholderEl && showPlaceholder) {
          setPlaceholderHeight(placeholderEl.getBoundingClientRect()?.height)
        } else {
          setPlaceholderHeight(undefined)
        }
      },
      [showPlaceholder]
    )

    if (showPlaceholder) {
      const start = Editor.start(editor, [])
      decorations.push({
        [PLACEHOLDER_SYMBOL]: true,
        placeholder,
        onPlaceholderResize: placeHolderResizeHandler,
        anchor: start,
        focus: start,
      })
    }

    const { marks } = editor
    state.hasMarkPlaceholder = false

    if (editor.selection && Range.isCollapsed(editor.selection) && marks) {
      const { anchor } = editor.selection
      const leaf = Node.leaf(editor, anchor.path)
      const { text, ...rest } = leaf

      // While marks isn't a 'complete' text, we can still use loose Text.equals
      // here which only compares marks anyway.
      if (!Text.equals(leaf, marks as Text, { loose: true })) {
        state.hasMarkPlaceholder = true

        const unset = Object.fromEntries(
          Object.keys(rest).map(mark => [mark, null])
        )

        decorations.push({
          [MARK_PLACEHOLDER_SYMBOL]: true,
          ...unset,
          ...marks,

          anchor,
          focus: anchor,
        })
      }
    }

    // Update EDITOR_TO_MARK_PLACEHOLDER_MARKS in setTimeout useEffect to ensure we don't set it
    // before we receive the composition end event.
    useEffect(() => {
      setTimeout(() => {
        const { selection } = editor
        if (selection) {
          const { anchor } = selection
          const text = Node.leaf(editor, anchor.path)

          // While marks isn't a 'complete' text, we can still use loose Text.equals
          // here which only compares marks anyway.
          if (marks && !Text.equals(text, marks as Text, { loose: true })) {
            EDITOR_TO_PENDING_INSERTION_MARKS.set(editor, marks)
            return
          }
        }

        EDITOR_TO_PENDING_INSERTION_MARKS.delete(editor)
      })
    })

    useFlushDeferredSelectorsOnRender()

    return (
      <ReadOnlyContext.Provider value={readOnly}>
        <ComposingContext.Provider value={isComposing}>
          <DecorateContext.Provider value={decorateContext}>
            <RestoreDOM node={ref} receivedUserInput={receivedUserInput}>
              <Component
                role={readOnly ? undefined : 'textbox'}
                aria-multiline={readOnly ? undefined : true}
                aria-placeholder={showPlaceholder ? placeholder : undefined}
                translate="no"
                {...attributes}
                // COMPAT: Certain browsers don't support the `beforeinput` event, so we'd
                // have to use hacks to make these replacement-based features work.
                // For SSR situations HAS_BEFORE_INPUT_SUPPORT is false and results in prop
                // mismatch warning app moves to browser. Pass-through consumer props when
                // not CAN_USE_DOM (SSR) and default to falsy value
                spellCheck={
                  HAS_BEFORE_INPUT_SUPPORT || !CAN_USE_DOM
                    ? attributes.spellCheck
                    : false
                }
                autoCorrect={
                  HAS_BEFORE_INPUT_SUPPORT || !CAN_USE_DOM
                    ? attributes.autoCorrect
                    : 'false'
                }
                autoCapitalize={
                  HAS_BEFORE_INPUT_SUPPORT || !CAN_USE_DOM
                    ? attributes.autoCapitalize
                    : 'false'
                }
                data-slate-editor
                data-slate-node="value"
                // explicitly set this
                contentEditable={!readOnly}
                // in some cases, a decoration needs access to the range / selection to decorate a text node,
                // then you will select the whole text node when you select part the of text
                // this magic zIndex="-1" will fix it
                zindex={-1}
                suppressContentEditableWarning
                ref={callbackRef}
                style={{
                  ...(disableDefaultStyles
                    ? {}
                    : {
                        // Allow positioning relative to the editable element.
                        position: 'relative',
                        // Preserve adjacent whitespace and new lines.
                        whiteSpace: 'pre-wrap',
                        // Allow words to break if they are too long.
                        wordWrap: 'break-word',
                        // Make the minimum height that of the placeholder.
                        ...(placeholderHeight
                          ? { minHeight: placeholderHeight }
                          : {}),
                      }),
                  // Allow for passed-in styles to override anything.
                  ...userStyle,
                }}
                onBeforeInput={useCallback(
                  (event: React.InputEvent<HTMLDivElement>) => {
                    if (readOnly) {
                      isEventHandled(event, attributes.onBeforeInput)
                      return
                    }

                    // COMPAT: Certain browsers don't support the `beforeinput` event, so we
                    // fall back to React's leaky polyfill instead just for it. It
                    // only works for the `insertText` input type.
                    if (
                      !HAS_BEFORE_INPUT_SUPPORT &&
                      !isEventHandled(event, attributes.onBeforeInput) &&
                      ReactEditor.hasSelectableTarget(editor, event.target)
                    ) {
                      event.preventDefault()
                      if (!ReactEditor.isComposing(editor)) {
                        const text = (event as any).data as string
                        Editor.insertText(editor, text)
                      }
                    }
                  },
                  [attributes.onBeforeInput, editor, readOnly]
                )}
                onInput={useCallback(
                  (event: React.InputEvent<HTMLDivElement>) => {
                    if (readOnly) {
                      isEventHandled(event, attributes.onInput)
                      return
                    }

                    if (!ReactEditor.hasEditableTarget(editor, event.target)) {
                      return
                    }

                    compositionDOM.pause()
                    if (isEventHandled(event, attributes.onInput)) {
                      return
                    }

                    if (androidInputManagerRef.current) {
                      androidInputManagerRef.current.handleInput()
                      return
                    }

                    if (
                      (event.nativeEvent as InputEvent).inputType?.startsWith(
                        'format'
                      )
                    ) {
                      const domSelection = getSelection(
                        ReactEditor.findDocumentOrShadowRoot(editor)
                      )
                      const range =
                        domSelection &&
                        ReactEditor.resolveSlateRange(editor, domSelection)
                      nativeFormatDOM.revert()
                      if (domSelection && range) {
                        Transforms.select(editor, range)
                        restoreDomSelection(editor, domSelection, state)
                      }
                      return
                    }

                    // Flush native operations, as native events will have propogated
                    // and we can correctly compare DOM text values in components
                    // to stop rendering, so that browser functions like autocorrect
                    // and spellcheck work as expected.
                    for (const op of deferredOperations.current) {
                      op()
                    }
                    deferredOperations.current = []

                    const nativeInsertion = lastNativeInsertion.current
                    lastNativeInsertion.current = null

                    if (nativeInsertion) {
                      const { point, text, domNode, domOffset, domText, char } =
                        nativeInsertion
                      const node = Node.getIf(editor, point.path)
                      if (
                        Text.isText(node) &&
                        node.text === text &&
                        domNode.isConnected &&
                        domNode.data ===
                          domText.slice(0, domOffset) +
                            char +
                            domText.slice(domOffset)
                      ) {
                        domNode.deleteData(domOffset, char.length)
                        if (
                          editor.selection &&
                          Range.isCollapsed(editor.selection) &&
                          Point.equals(editor.selection.anchor, point)
                        ) {
                          getSelection(
                            ReactEditor.findDocumentOrShadowRoot(editor)
                          )?.collapse(domNode, domOffset)
                        }
                      }
                    }

                    // COMPAT: Since `beforeinput` doesn't fully `preventDefault`,
                    // there's a chance that content might be placed in the browser's undo stack.
                    // This means undo can be triggered even when the div is not focused,
                    // and it only triggers the input event for the node. (2024/10/09)
                    if (!ReactEditor.isFocused(editor)) {
                      handleNativeHistoryEvents(
                        editor,
                        event.nativeEvent as InputEvent
                      )
                    }
                  },
                  [
                    readOnly,
                    attributes.onInput,
                    editor,
                    compositionDOM,
                    nativeFormatDOM,
                  ]
                )}
                onBlur={useCallback(
                  (event: React.FocusEvent<HTMLDivElement>) => {
                    if (readOnly) {
                      isEventHandled(event, attributes.onBlur)
                      return
                    }

                    if (
                      state.isUpdatingSelection ||
                      !ReactEditor.hasSelectableTarget(editor, event.target) ||
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
                      const node = ReactEditor.toSlateNode(
                        editor,
                        relatedTarget
                      )

                      if (Node.isElement(node) && !editor.isVoid(node)) {
                        return
                      }
                    }

                    state.isBlurring = true
                    try {
                      flushDOMSelectionChange()
                    } finally {
                      state.isBlurring = false
                    }

                    // COMPAT: Safari doesn't always remove the selection even if the content-
                    // editable element no longer has focus. Refer to:
                    // https://stackoverflow.com/questions/12353247/force-contenteditable-div-to-stop-accepting-input-after-it-loses-focus-under-web
                    if (IS_WEBKIT) {
                      const domSelection = getSelection(root)
                      domSelection?.removeAllRanges()
                    }

                    IS_FOCUSED.delete(editor)
                  },
                  [
                    readOnly,
                    state,
                    editor,
                    attributes.onBlur,
                    flushDOMSelectionChange,
                  ]
                )}
                onClick={useCallback(
                  (event: React.MouseEvent<HTMLDivElement>) => {
                    if (ReactEditor.hasTarget(editor, event.target)) {
                      flushDOMSelectionChange()
                    }

                    if (
                      ReactEditor.hasTarget(editor, event.target) &&
                      !isEventHandled(event, attributes.onClick) &&
                      isDOMNode(event.target)
                    ) {
                      const node = ReactEditor.toSlateNode(editor, event.target)
                      let path: Path

                      try {
                        path = ReactEditor.findPath(editor, node)
                      } catch {
                        return
                      }

                      // At this time, the Slate document may be arbitrarily different,
                      // because onClick handlers can change the document before we get here.
                      // Therefore we must check that this path actually exists,
                      // and that it still refers to the same node.
                      if (
                        !Editor.hasPath(editor, path) ||
                        Node.get(editor, path) !== node
                      ) {
                        return
                      }

                      if (event.detail === TRIPLE_CLICK && path.length >= 1) {
                        let blockPath = path
                        if (
                          !(
                            Node.isElement(node) && Editor.isBlock(editor, node)
                          )
                        ) {
                          const block = Editor.above(editor, {
                            match: n =>
                              Node.isElement(n) && Editor.isBlock(editor, n),
                            at: path,
                          })

                          blockPath = block?.[1] ?? path.slice(0, 1)
                        }

                        const isIsolated = Editor.above(editor, {
                          at: Editor.start(editor, blockPath),
                          match: n =>
                            Node.isElement(n) && !!editor.isIsolated?.(n),
                        })

                        if (blockPath.length > 1 || isIsolated) {
                          const range = Editor.range(editor, blockPath)
                          Transforms.select(editor, range)
                          return
                        }
                      }

                      if (readOnly) {
                        return
                      }

                      const start = Editor.start(editor, path)
                      const end = Editor.end(editor, path)
                      const startVoid = Editor.void(editor, { at: start })
                      const endVoid = Editor.void(editor, { at: end })
                      const selectedVoid =
                        editor.selection &&
                        Range.isCollapsed(editor.selection) &&
                        Editor.void(editor, { at: editor.selection.anchor })

                      if (
                        event.shiftKey &&
                        selectedVoid &&
                        !Path.isAncestor(selectedVoid[1], path) &&
                        !(
                          startVoid &&
                          Path.equals(startVoid[1], selectedVoid[1])
                        )
                      ) {
                        const clicked = ReactEditor.resolveEventRange(
                          editor,
                          event
                        )

                        if (!clicked) {
                          return
                        }

                        const voidStart = Editor.start(editor, selectedVoid[1])
                        const voidEnd = Editor.end(editor, selectedVoid[1])
                        const anchor = Point.isBefore(clicked.anchor, voidStart)
                          ? voidEnd
                          : voidStart
                        Transforms.select(editor, {
                          anchor,
                          focus: clicked.anchor,
                        })
                        return
                      }

                      if (
                        startVoid &&
                        endVoid &&
                        Path.equals(startVoid[1], endVoid[1])
                      ) {
                        if (event.shiftKey && editor.selection) {
                          const { anchor } = editor.selection
                          const focus = Point.isBefore(anchor, start)
                            ? end
                            : start
                          Transforms.select(editor, { anchor, focus })
                          return
                        }

                        const range = Editor.range(editor, start)
                        Transforms.select(editor, range)
                      }
                    }
                  },
                  [
                    editor,
                    attributes.onClick,
                    readOnly,
                    flushDOMSelectionChange,
                  ]
                )}
                onCompositionEnd={useCallback(
                  (event: React.CompositionEvent<HTMLDivElement>) => {
                    if (readOnly) {
                      isEventHandled(event, attributes.onCompositionEnd)
                      return
                    }

                    if (isDOMEventTargetInput(event)) {
                      return
                    }
                    if (ReactEditor.hasSelectableTarget(editor, event.target)) {
                      Promise.resolve().then(() => {
                        setIsComposing(false)
                        IS_COMPOSING.set(editor, false)
                      })

                      androidInputManagerRef.current?.handleCompositionEnd(
                        event
                      )

                      const deleteOnCompositionEnd =
                        deleteOnCompositionEndRef.current
                      deleteOnCompositionEndRef.current = false

                      if (
                        isEventHandled(event, attributes.onCompositionEnd) ||
                        IS_ANDROID
                      ) {
                        compositionDOM.clear()
                        return
                      }

                      if (deleteOnCompositionEnd && !event.data) {
                        compositionDOM.restore()
                        Editor.deleteFragment(editor)
                      }

                      // COMPAT: In Chrome, `beforeinput` events for compositions
                      // aren't correct and never fire the "insertFromComposition"
                      // type that we need. So instead, insert whenever a composition
                      // ends since it will already have been committed to the DOM.
                      if (
                        !IS_WEBKIT &&
                        !IS_FIREFOX_LEGACY &&
                        !IS_IOS &&
                        !IS_WECHATBROWSER &&
                        !IS_UC_MOBILE &&
                        event.data
                      ) {
                        const placeholderMarks =
                          EDITOR_TO_PENDING_INSERTION_MARKS.get(editor)
                        EDITOR_TO_PENDING_INSERTION_MARKS.delete(editor)

                        // Ensure we insert text with the marks the user was actually seeing
                        if (placeholderMarks !== undefined) {
                          EDITOR_TO_USER_MARKS.set(editor, editor.marks)
                          editor.marks = placeholderMarks
                        }

                        compositionDOM.restore()
                        removeStrayComposition(editor, event.data)
                        Editor.insertText(editor, event.data)

                        const userMarks = EDITOR_TO_USER_MARKS.get(editor)
                        EDITOR_TO_USER_MARKS.delete(editor)
                        if (userMarks !== undefined) {
                          editor.marks = userMarks
                        }
                      }
                      compositionDOM.clear()
                    }
                  },
                  [
                    readOnly,
                    attributes.onCompositionEnd,
                    editor,
                    compositionDOM,
                  ]
                )}
                onCompositionUpdate={useCallback(
                  (event: React.CompositionEvent<HTMLDivElement>) => {
                    if (readOnly) {
                      isEventHandled(event, attributes.onCompositionUpdate)
                      return
                    }

                    if (
                      ReactEditor.hasSelectableTarget(editor, event.target) &&
                      !isEventHandled(event, attributes.onCompositionUpdate) &&
                      !isDOMEventTargetInput(event)
                    ) {
                      if (!ReactEditor.isComposing(editor)) {
                        setIsComposing(true)
                        IS_COMPOSING.set(editor, true)
                      }
                    }
                  },
                  [readOnly, attributes.onCompositionUpdate, editor]
                )}
                onCompositionStart={useCallback(
                  (event: React.CompositionEvent<HTMLDivElement>) => {
                    if (readOnly) {
                      isEventHandled(event, attributes.onCompositionStart)
                      return
                    }

                    if (isDOMEventTargetInput(event)) {
                      return
                    }
                    if (ReactEditor.hasSelectableTarget(editor, event.target)) {
                      androidInputManagerRef.current?.handleCompositionStart(
                        event
                      )

                      if (
                        isEventHandled(event, attributes.onCompositionStart) ||
                        IS_ANDROID
                      ) {
                        return
                      }

                      compositionDOM.clear()
                      setIsComposing(true)

                      flushDOMSelectionChange()

                      const { selection } = editor
                      if (selection && Range.isExpanded(selection)) {
                        if (IS_FIREFOX && !IS_FIREFOX_LEGACY) {
                          compositionDOM.observe()
                          deleteOnCompositionEndRef.current = true
                          return
                        }

                        Editor.deleteFragment(editor)
                        return
                      }
                    }
                  },
                  [
                    readOnly,
                    attributes.onCompositionStart,
                    editor,
                    compositionDOM,
                    flushDOMSelectionChange,
                  ]
                )}
                onCopy={useCallback(
                  (event: React.ClipboardEvent<HTMLDivElement>) => {
                    if (
                      ReactEditor.hasSelectableTarget(editor, event.target) &&
                      !isEventHandled(event, attributes.onCopy) &&
                      !isDOMEventTargetInput(event)
                    ) {
                      event.preventDefault()
                      ReactEditor.setFragmentData(
                        editor,
                        event.clipboardData,
                        'copy'
                      )
                    }
                  },
                  [attributes.onCopy, editor]
                )}
                onCut={useCallback(
                  (event: React.ClipboardEvent<HTMLDivElement>) => {
                    if (readOnly) {
                      isEventHandled(event, attributes.onCut)
                      return
                    }

                    if (
                      ReactEditor.hasSelectableTarget(editor, event.target) &&
                      !isEventHandled(event, attributes.onCut) &&
                      !isDOMEventTargetInput(event)
                    ) {
                      event.preventDefault()
                      selectMovableRange(editor)
                      ReactEditor.setFragmentData(
                        editor,
                        event.clipboardData,
                        'cut'
                      )
                      const { selection } = editor

                      if (selection) {
                        if (Range.isExpanded(selection)) {
                          deleteMovedRange(editor, selection)
                        } else {
                          const node = Node.parent(
                            editor,
                            selection.anchor.path
                          )
                          if (Editor.isVoid(editor, node)) {
                            Transforms.delete(editor)
                          }
                        }
                      }
                    }
                  },
                  [readOnly, editor, attributes.onCut]
                )}
                onDragOver={useCallback(
                  (event: React.DragEvent<HTMLDivElement>) => {
                    if (readOnly) {
                      isEventHandled(event, attributes.onDragOver)
                      return
                    }

                    if (
                      ReactEditor.hasTarget(editor, event.target) &&
                      !isEventHandled(event, attributes.onDragOver)
                    ) {
                      // Only when the target is void, call `preventDefault` to signal
                      // that drops are allowed. Editable content is droppable by
                      // default, and calling `preventDefault` hides the cursor.
                      const node = ReactEditor.toSlateNode(editor, event.target)

                      if (Node.isElement(node) && Editor.isVoid(editor, node)) {
                        event.preventDefault()
                      }
                    }
                  },
                  [readOnly, attributes.onDragOver, editor]
                )}
                onDragStart={useCallback(
                  (event: React.DragEvent<HTMLDivElement>) => {
                    if (readOnly) {
                      isEventHandled(event, attributes.onDragStart)
                      return
                    }

                    if (
                      ReactEditor.hasTarget(editor, event.target) &&
                      !isEventHandled(event, attributes.onDragStart)
                    ) {
                      const node = ReactEditor.toSlateNode(editor, event.target)
                      const path = ReactEditor.findPath(editor, node)
                      const voidMatch =
                        (Node.isElement(node) && Editor.isVoid(editor, node)) ||
                        Editor.void(editor, { at: path, voids: true })

                      // If starting a drag on a void node, make sure it is selected
                      // so that it shows up in the selection's fragment.
                      if (voidMatch) {
                        const range = Editor.range(editor, path)
                        Transforms.select(editor, range)
                      }

                      selectMovableRange(editor)
                      state.isDraggingInternally = true

                      ReactEditor.setFragmentData(
                        editor,
                        event.dataTransfer,
                        'drag'
                      )
                    }
                  },
                  [readOnly, editor, attributes.onDragStart, state]
                )}
                onDrop={useCallback(
                  (event: React.DragEvent<HTMLDivElement>) => {
                    if (readOnly) {
                      isEventHandled(event, attributes.onDrop)
                      return
                    }

                    if (
                      ReactEditor.hasTarget(editor, event.target) &&
                      !isEventHandled(event, attributes.onDrop)
                    ) {
                      event.preventDefault()

                      // Keep a reference to the dragged range before updating selection
                      const draggedRange = editor.selection

                      // Find the range where the drop happened. It is resolved from
                      // the drop coordinates, which can point outside of the editor
                      // even though the event's target is inside it (e.g. when the
                      // page scrolled during the drag), leaving no range to drop at.
                      const range = ReactEditor.findEventRange(editor, event, {
                        suppressThrow: true,
                      })
                      const data = event.dataTransfer

                      if (!range && state.isDraggingInternally) {
                        // The dragged content already sits in the editor, so without
                        // a target it stays where it is.
                        return
                      }

                      if (range) {
                        Transforms.select(editor, range)

                        if (state.isDraggingInternally && draggedRange) {
                          if (Range.includes(draggedRange, range.anchor)) {
                            return
                          }

                          if (
                            !Editor.void(editor, { at: range, voids: true })
                          ) {
                            const dropRef = Editor.rangeRef(editor, range)
                            deleteMovedRange(editor, draggedRange)
                            const dropRange = dropRef.unref()

                            if (dropRange) {
                              Transforms.select(editor, dropRange)
                            }
                          }
                        }
                      } else if (
                        !editor.selection &&
                        editor.children.length > 0
                      ) {
                        // Without a drop position the data goes to the current
                        // selection, or to the end of the document if there is none.
                        Transforms.select(editor, Editor.end(editor, []))
                      }

                      ReactEditor.insertData(editor, data)

                      // When dragging from another source into the editor, it's possible
                      // that the current editor does not have focus.
                      if (!ReactEditor.isFocused(editor)) {
                        ReactEditor.focus(editor)
                      }
                    }
                  },
                  [readOnly, editor, attributes.onDrop, state]
                )}
                onDragEnd={useCallback(
                  (event: React.DragEvent<HTMLDivElement>) => {
                    if (readOnly) {
                      isEventHandled(event, attributes.onDragEnd)
                      return
                    }

                    if (
                      state.isDraggingInternally &&
                      attributes.onDragEnd &&
                      ReactEditor.hasTarget(editor, event.target)
                    ) {
                      attributes.onDragEnd(event)
                    }
                  },
                  [readOnly, state, attributes, editor]
                )}
                onFocus={useCallback(
                  (event: React.FocusEvent<HTMLDivElement>) => {
                    if (readOnly) {
                      isEventHandled(event, attributes.onFocus)
                      return
                    }

                    if (
                      !state.isUpdatingSelection &&
                      ReactEditor.hasEditableTarget(editor, event.target) &&
                      !isEventHandled(event, attributes.onFocus)
                    ) {
                      const el = ReactEditor.toDOMNode(editor, editor)
                      const root = ReactEditor.findDocumentOrShadowRoot(editor)
                      state.latestElement = root.activeElement

                      // COMPAT: If the editor has nested editable elements, the focus
                      // can go to them. In Firefox, this must be prevented because it
                      // results in issues with keyboard navigation. (2017/03/30)
                      if (IS_FIREFOX && event.target !== el) {
                        el.focus()
                        return
                      }

                      IS_FOCUSED.set(editor, true)

                      if (state.isTabbing && event.target === el) {
                        const domSelection = getSelection(root)
                        if (domSelection && editor.selection) {
                          state.pendingSelection = null
                          restoreDomSelection(editor, domSelection, state)
                        }
                        state.isTabbing = false
                      }
                    }
                  },
                  [readOnly, state, editor, attributes.onFocus]
                )}
                onKeyDown={useCallback(
                  (event: React.KeyboardEvent<HTMLDivElement>) => {
                    if (readOnly) {
                      isEventHandled(event, attributes.onKeyDown)
                      return
                    }

                    if (ReactEditor.hasEditableTarget(editor, event.target)) {
                      androidInputManagerRef.current?.handleKeyDown(event)

                      const { nativeEvent } = event

                      // COMPAT: The composition end event isn't fired reliably in all browsers,
                      // so we sometimes might end up stuck in a composition state even though we
                      // aren't composing any more.
                      if (
                        ReactEditor.isComposing(editor) &&
                        (nativeEvent.isComposing === false ||
                          isDeletingInVoid(editor, nativeEvent))
                      ) {
                        IS_COMPOSING.set(editor, false)
                        setIsComposing(false)
                      }

                      if (
                        isEventHandled(event, attributes.onKeyDown) ||
                        ReactEditor.isComposing(editor)
                      ) {
                        return
                      }

                      pendingNavigationScroll.current = [
                        'ArrowUp',
                        'ArrowDown',
                        'ArrowLeft',
                        'ArrowRight',
                        'Home',
                        'End',
                        'PageUp',
                        'PageDown',
                      ].includes(nativeEvent.key)

                      const { selection } = editor
                      const element =
                        editor.children[
                          selection !== null ? selection.focus.path[0] : 0
                        ]
                      const isRTL = getDirection(Node.string(element)) === 'rtl'

                      // COMPAT: Since we prevent the default behavior on
                      // `beforeinput` events, the browser doesn't think there's ever
                      // any history stack to undo or redo, so we have to manage these
                      // hotkeys ourselves. (2019/11/06)
                      if (Hotkeys.isRedo(nativeEvent)) {
                        event.preventDefault()
                        const maybeHistoryEditor: any = editor

                        if (typeof maybeHistoryEditor.redo === 'function') {
                          maybeHistoryEditor.redo()
                        }

                        return
                      }

                      if (Hotkeys.isUndo(nativeEvent)) {
                        event.preventDefault()
                        const maybeHistoryEditor: any = editor

                        if (typeof maybeHistoryEditor.undo === 'function') {
                          maybeHistoryEditor.undo()
                        }

                        return
                      }

                      if (
                        (IS_CHROME || IS_WEBKIT) &&
                        nativeEvent.key === 'ArrowUp' &&
                        !nativeEvent.altKey &&
                        !nativeEvent.ctrlKey &&
                        !nativeEvent.metaKey &&
                        selection &&
                        (nativeEvent.shiftKey || Range.isCollapsed(selection))
                      ) {
                        const above = getPointAboveTrailingNewline(
                          editor,
                          selection.focus
                        )

                        if (above) {
                          event.preventDefault()
                          Transforms.select(
                            editor,
                            nativeEvent.shiftKey
                              ? { anchor: selection.anchor, focus: above }
                              : above
                          )
                          return
                        }
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
                          Transforms.move(editor, {
                            reverse: !isRTL,
                            unit: getCharacterMoveUnit(
                              editor,
                              selection.focus,
                              !isRTL
                            ),
                          })
                        } else {
                          Transforms.collapse(editor, {
                            edge: isRTL ? 'end' : 'start',
                          })
                        }

                        return
                      }

                      if (Hotkeys.isMoveForward(nativeEvent)) {
                        event.preventDefault()

                        if (selection && Range.isCollapsed(selection)) {
                          Transforms.move(editor, {
                            reverse: isRTL,
                            unit: getCharacterMoveUnit(
                              editor,
                              selection.focus,
                              isRTL
                            ),
                          })
                        } else {
                          Transforms.collapse(editor, {
                            edge: isRTL ? 'start' : 'end',
                          })
                        }

                        return
                      }

                      const wordBackward =
                        Hotkeys.isMoveWordBackward(nativeEvent)
                      if (
                        wordBackward ||
                        Hotkeys.isMoveWordForward(nativeEvent)
                      ) {
                        event.preventDefault()
                        const root =
                          ReactEditor.findDocumentOrShadowRoot(editor)
                        const domSelection = getSelection(root)
                        if (domSelection?.modify) {
                          domSelection.modify(
                            'move',
                            wordBackward ? 'left' : 'right',
                            'word'
                          )
                          const range = ReactEditor.toSlateRange(
                            editor,
                            domSelection,
                            {
                              exactMatch: false,
                              suppressThrow: true,
                            }
                          )
                          if (range) {
                            Transforms.select(editor, range)
                            return
                          }
                        }
                        if (selection && Range.isExpanded(selection)) {
                          Transforms.collapse(editor, { edge: 'focus' })
                        }
                        Transforms.move(editor, {
                          unit: 'word',
                          reverse: wordBackward ? !isRTL : isRTL,
                        })
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

                        if (Hotkeys.isSoftBreak(nativeEvent)) {
                          event.preventDefault()
                          Editor.insertSoftBreak(editor)
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
                            Editor.deleteFragment(editor, {
                              direction: 'backward',
                            })
                          } else {
                            Editor.deleteBackward(editor)
                          }

                          return
                        }

                        if (Hotkeys.isDeleteForward(nativeEvent)) {
                          event.preventDefault()

                          if (selection && Range.isExpanded(selection)) {
                            Editor.deleteFragment(editor, {
                              direction: 'forward',
                            })
                          } else {
                            Editor.deleteForward(editor)
                          }

                          return
                        }

                        if (Hotkeys.isDeleteLineBackward(nativeEvent)) {
                          event.preventDefault()

                          if (selection && Range.isExpanded(selection)) {
                            Editor.deleteFragment(editor, {
                              direction: 'backward',
                            })
                          } else {
                            Editor.deleteBackward(editor, { unit: 'line' })
                          }

                          return
                        }

                        if (Hotkeys.isDeleteLineForward(nativeEvent)) {
                          event.preventDefault()

                          if (selection && Range.isExpanded(selection)) {
                            Editor.deleteFragment(editor, {
                              direction: 'forward',
                            })
                          } else {
                            Editor.deleteForward(editor, { unit: 'line' })
                          }

                          return
                        }

                        if (Hotkeys.isDeleteWordBackward(nativeEvent)) {
                          event.preventDefault()

                          if (selection && Range.isExpanded(selection)) {
                            Editor.deleteFragment(editor, {
                              direction: 'backward',
                            })
                          } else {
                            Editor.deleteBackward(editor, { unit: 'word' })
                          }

                          return
                        }

                        if (Hotkeys.isDeleteWordForward(nativeEvent)) {
                          event.preventDefault()

                          if (selection && Range.isExpanded(selection)) {
                            Editor.deleteFragment(editor, {
                              direction: 'forward',
                            })
                          } else {
                            Editor.deleteForward(editor, { unit: 'word' })
                          }

                          return
                        }
                      } else {
                        if (IS_CHROME || IS_WEBKIT) {
                          // COMPAT: Chrome and Safari support `beforeinput` event but do not fire
                          // an event when deleting backwards in a selected void inline node
                          if (
                            selection &&
                            (Hotkeys.isDeleteBackward(nativeEvent) ||
                              Hotkeys.isDeleteForward(nativeEvent)) &&
                            Range.isCollapsed(selection)
                          ) {
                            const currentNode = Node.parent(
                              editor,
                              selection.anchor.path
                            )

                            if (
                              Node.isElement(currentNode) &&
                              Editor.isVoid(editor, currentNode) &&
                              (Editor.isInline(editor, currentNode) ||
                                Editor.isBlock(editor, currentNode))
                            ) {
                              event.preventDefault()

                              if (Hotkeys.isDeleteForward(nativeEvent)) {
                                Editor.deleteForward(editor, { unit: 'block' })
                              } else {
                                Editor.deleteBackward(editor, { unit: 'block' })
                              }

                              return
                            }
                          }
                        }

                        if (
                          IS_WEBKIT &&
                          selection &&
                          Range.isCollapsed(selection)
                        ) {
                          if (
                            Hotkeys.isDeleteBackward(nativeEvent) &&
                            Editor.isStart(editor, selection.anchor, [])
                          ) {
                            event.preventDefault()
                            Editor.deleteBackward(editor)
                            return
                          }

                          if (
                            Hotkeys.isDeleteForward(nativeEvent) &&
                            Editor.isEnd(editor, selection.anchor, [])
                          ) {
                            event.preventDefault()
                            Editor.deleteForward(editor)
                            return
                          }
                        }
                      }
                    }
                  },
                  [readOnly, editor, attributes.onKeyDown]
                )}
                onPaste={useCallback(
                  (event: React.ClipboardEvent<HTMLDivElement>) => {
                    if (readOnly) {
                      isEventHandled(event, attributes.onPaste)
                      return
                    }

                    if (
                      ReactEditor.hasEditableTarget(editor, event.target) &&
                      !isEventHandled(event, attributes.onPaste)
                    ) {
                      // COMPAT: Certain browsers don't support the `beforeinput` event, so we
                      // fall back to React's `onPaste` here instead.
                      // COMPAT: Firefox, Chrome and Safari don't emit `beforeinput` events
                      // when "paste without formatting" is used, so fallback. (2020/02/20)
                      // COMPAT: Safari InputEvents generated by pasting won't include
                      // application/x-slate-fragment items, so use the
                      // ClipboardEvent here. (2023/03/15)
                      if (
                        !HAS_BEFORE_INPUT_SUPPORT ||
                        isPlainTextOnlyPaste(event.nativeEvent) ||
                        IS_WEBKIT
                      ) {
                        event.preventDefault()
                        ReactEditor.insertData(editor, event.clipboardData)
                      }
                    }
                  },
                  [readOnly, editor, attributes.onPaste]
                )}
              >
                <Children
                  decorations={decorations}
                  node={editor}
                  renderElement={renderElement}
                  renderChunk={renderChunk}
                  renderPlaceholder={renderPlaceholder}
                  renderLeaf={renderLeaf}
                  renderText={renderText}
                />
              </Component>
            </RestoreDOM>
          </DecorateContext.Provider>
        </ComposingContext.Provider>
      </ReadOnlyContext.Provider>
    )
  }
)

/**
 * The props that get passed to renderPlaceholder
 */
export interface RenderPlaceholderProps {
  children: any
  attributes: {
    'data-slate-placeholder': boolean
    'aria-hidden': boolean
    dir?: 'rtl'
    contentEditable: boolean
    ref: React.RefCallback<any>
    style: React.CSSProperties
  }
}

const isDeletingInVoid = (editor: Editor, event: KeyboardEvent) => {
  const { selection } = editor

  return (
    !!selection &&
    Range.isCollapsed(selection) &&
    (Hotkeys.isDeleteBackward(event) || Hotkeys.isDeleteForward(event)) &&
    !!Editor.void(editor, { at: selection })
  )
}

const isInSlateText = (node: unknown) =>
  isDOMNode(node) &&
  node.nodeType === node.TEXT_NODE &&
  !!node.parentElement?.closest('[data-slate-string], [data-slate-zero-width]')

const restoreDomSelection = (
  editor: ReactEditor,
  domSelection: Selection,
  state: { isUpdatingSelection: boolean }
) => {
  if (!editor.selection) {
    return
  }

  const domRange = ReactEditor.resolveDOMRange(editor, editor.selection)

  if (!domRange) {
    return
  }

  const backward = Range.isBackward(editor.selection)
  state.isUpdatingSelection = true
  domSelection.setBaseAndExtent(
    backward ? domRange.endContainer : domRange.startContainer,
    backward ? domRange.endOffset : domRange.startOffset,
    backward ? domRange.startContainer : domRange.endContainer,
    backward ? domRange.startOffset : domRange.endOffset
  )
  setTimeout(() => {
    state.isUpdatingSelection = false
  })
}

const selectMovableRange = (editor: ReactEditor) => {
  const { selection } = editor

  if (selection && Range.isExpanded(selection)) {
    const movableRange = getMovableRange(editor, selection)

    if (!Range.equals(movableRange, selection)) {
      Transforms.select(editor, movableRange)
    }
  }
}

/**
 * The default placeholder element
 * @group Components
 */
export const DefaultPlaceholder = ({
  attributes,
  children,
}: RenderPlaceholderProps) => (
  // COMPAT: Artificially add a line-break to the end on the placeholder element
  // to prevent Android IMEs to pick up its content in autocorrect and to auto-capitalize the first letter
  <span {...attributes}>
    {children}
    {IS_ANDROID && <br />}
  </span>
)

/**
 * A default memoized decorate function.
 */

export const defaultDecorate: (entry: NodeEntry) => DecoratedRange[] = () => []

/**
 * A default implement to scroll dom range into view.
 */

export const defaultScrollSelectionIntoView = (
  editor: ReactEditor,
  domRange: DOMRange
) => {
  // Scroll to the focus point of the selection, in case the selection is expanded
  const { selection } = editor
  const isBackward = !!selection && Range.isBackward(selection)
  const unhung =
    selection && !isBackward && Range.isExpanded(selection)
      ? Editor.unhangRange(editor, selection)
      : selection
  const domFocusPoint =
    unhung && selection && !Range.equals(unhung, selection)
      ? ReactEditor.resolveDOMRange(editor, unhung) ?? domRange.cloneRange()
      : domRange.cloneRange()
  domFocusPoint.collapse(isBackward)

  if (domFocusPoint.getBoundingClientRect) {
    const leafEl = domFocusPoint.startContainer.parentElement!

    // COMPAT: In Chrome, domFocusPoint.getBoundingClientRect() can return zero dimensions for valid ranges (e.g. line breaks).
    // When this happens, do not scroll like most editors do.
    const domRect = domFocusPoint.getBoundingClientRect()
    const isZeroDimensionRect =
      domRect.width === 0 &&
      domRect.height === 0 &&
      domRect.x === 0 &&
      domRect.y === 0

    if (isZeroDimensionRect) {
      const leafRect = leafEl.getBoundingClientRect()
      const leafHasDimensions = leafRect.width > 0 || leafRect.height > 0

      if (leafHasDimensions) {
        return
      }
    }

    // Default behavior: use domFocusPoint's getBoundingClientRect
    leafEl.getBoundingClientRect =
      domFocusPoint.getBoundingClientRect.bind(domFocusPoint)
    scrollIntoView(leafEl, {
      scrollMode: 'if-needed',
      block: 'nearest',
      inline: 'nearest',
    })

    // @ts-expect-error an unorthodox delete D:
    delete leafEl.getBoundingClientRect
  }
}

/**
 * Check if an event is overrided by a handler.
 */

export const isEventHandled = <
  EventType extends React.SyntheticEvent<unknown, unknown>,
>(
  event: EventType,
  handler?: (event: EventType) => void | boolean
) => {
  if (!handler) {
    return false
  }
  // The custom event handler may return a boolean to specify whether the event
  // shall be treated as being handled or not.
  const shouldTreatEventAsHandled = handler(event)

  if (shouldTreatEventAsHandled != null) {
    return shouldTreatEventAsHandled
  }

  return event.isDefaultPrevented() || event.isPropagationStopped()
}

/**
 * Check if the event's target is an input element
 */
export const isDOMEventTargetInput = <
  EventType extends React.SyntheticEvent<unknown, unknown>,
>(
  event: EventType
) => {
  return (
    isDOMNode(event.target) &&
    (event.target instanceof HTMLInputElement ||
      event.target instanceof HTMLTextAreaElement)
  )
}

/**
 * Check if a DOM event is overrided by a handler.
 */

export const isDOMEventHandled = <E extends Event>(
  event: E,
  handler?: (event: E) => void | boolean
) => {
  if (!handler) {
    return false
  }

  // The custom event handler may return a boolean to specify whether the event
  // shall be treated as being handled or not.
  const shouldTreatEventAsHandled = handler(event)

  if (shouldTreatEventAsHandled != null) {
    return shouldTreatEventAsHandled
  }

  return event.defaultPrevented
}

const handleNativeHistoryEvents = (editor: Editor, event: InputEvent) => {
  const maybeHistoryEditor: any = editor
  if (
    event.inputType === 'historyUndo' &&
    typeof maybeHistoryEditor.undo === 'function'
  ) {
    maybeHistoryEditor.undo()
    return
  }
  if (
    event.inputType === 'historyRedo' &&
    typeof maybeHistoryEditor.redo === 'function'
  ) {
    maybeHistoryEditor.redo()
    return
  }
}
