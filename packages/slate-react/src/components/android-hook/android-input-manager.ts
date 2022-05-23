import { DebouncedFunc } from 'lodash'
import { RefObject } from 'react'
import { Editor, Node, Path, Range, Text, Transforms } from 'slate'
import { ReactEditor } from '../../plugin/react-editor'
import { EDITOR_TO_USER_SELECTION, IS_COMPOSING } from '../../utils/weak-maps'
import { Diff, mergeDiffs } from './diff-text'

type TextDiff = { path: Path; diff: Diff }

type ReplaceExpandedAction = {
  at: Range
  text: string
  type: 'replace_expanded'
}
type LineBreakAction = { at: Range; type: 'line_break' }
type DeleteAction = {
  at: Range
  type: 'delete'
  direction: 'forward' | 'backward'
}

type Action = ReplaceExpandedAction | LineBreakAction | DeleteAction

// https://github.com/facebook/draft-js/blob/main/src/component/handlers/composition/DraftEditorCompositionHandler.js#L41
// When using keyboard English association function, conpositionEnd triggered too fast, resulting in after `insertText` still maintain association state.
const RESOLVE_DELAY = 25

// Replace with `const debug = console.log` to debug
const debug = console.log

export type CreateAndroidInputManagerOptions = {
  editor: ReactEditor
  onUserInput: () => void

  scheduleOnDOMSelectionChange: DebouncedFunc<() => void>
  onDOMSelectionChange: DebouncedFunc<() => void>
  receivedUserInput: RefObject<boolean>
}

export function createAndroidInputManager({
  editor,
  onUserInput,

  scheduleOnDOMSelectionChange,
  onDOMSelectionChange,
}: CreateAndroidInputManagerOptions) {
  let compositionEndTimeoutId: ReturnType<typeof setTimeout> | null = null
  let flushTimeoutId: ReturnType<typeof setTimeout> | null = null

  let pendingDiffs: TextDiff[] = []
  let currentAction: Action | null = null

  /**
   * Handle MutationObserver flush
   *
   * @param mutations
   */

  const selectPendingSelection = () => {
    const pendingSelection = EDITOR_TO_USER_SELECTION.get(editor)?.unref()
    EDITOR_TO_USER_SELECTION.delete(editor)
    if (pendingSelection) {
      Transforms.select(editor, pendingSelection)
    }
  }

  const performAction = (action: Action) => {
    const range = Editor.range(editor, action.at)
    if (!editor.selection || !Range.equals(editor.selection, range)) {
      Transforms.select(editor, range)
    }

    switch (action.type) {
      case 'line_break': {
        Editor.insertBreak(editor)
        break
      }
      case 'replace_expanded': {
        Editor.insertText(editor, action.text)
        break
      }
      case 'delete': {
        if (editor.selection && Range.isExpanded(editor.selection)) {
          Editor.deleteFragment(editor, { direction: action.direction })
        } else if (action.direction === 'forward') {
          Editor.deleteForward(editor)
        } else {
          Editor.deleteBackward(editor)
        }
        break
      }
    }
  }

  const flush = () => {
    scheduleOnDOMSelectionChange.flush()
    onDOMSelectionChange.flush()

    selectPendingSelection()

    // TODO: Perform text diffs fist to ensure we can correctly normalize the selection
    Editor.withoutNormalizing(editor, () => {
      pendingDiffs.forEach(diff => {
        Transforms.select(editor, {
          anchor: { path: diff.path, offset: diff.diff.start },
          focus: { path: diff.path, offset: diff.diff.end },
        })
        Editor.insertText(editor, diff.diff.insertText)
      })
    })
    pendingDiffs = []

    if (currentAction) {
      performAction(currentAction)
      currentAction = null
    }
  }

  const handleCompositionEnd = (
    _event: React.CompositionEvent<HTMLDivElement>
  ) => {
    if (compositionEndTimeoutId) {
      clearTimeout(compositionEndTimeoutId)
    }

    const handleCompositionEnd = () => {
      IS_COMPOSING.set(editor, false)

      console.log('handleCompositionEnd')

      flush()
    }

    compositionEndTimeoutId = setTimeout(handleCompositionEnd, RESOLVE_DELAY)
    return true
  }

  const handleCompositionStart = (
    _event: React.CompositionEvent<HTMLDivElement>
  ) => {
    IS_COMPOSING.set(editor, true)

    if (compositionEndTimeoutId) {
      clearTimeout(compositionEndTimeoutId)
      compositionEndTimeoutId = null
    }

    return true
  }

  const pushAction = (action: Action | TextDiff) => {
    if (currentAction) {
      throw new Error('Pushed new action while current action is pending')
    }

    console.log('action', action)

    if (!('type' in action)) {
      const idx = pendingDiffs.findIndex(change =>
        Path.equals(change.path, action.path)
      )
      if (idx < 0) {
        pendingDiffs.push(action)
        return
      }

      const target = Node.get(editor, action.path) as Text
      pendingDiffs[idx] = {
        path: pendingDiffs[idx].path,
        diff: mergeDiffs(target.text, pendingDiffs[idx].diff, action.diff),
      }

      console.log('pendingDiffs', pendingDiffs)

      return
    }

    currentAction = action
  }

  const handleDOMBeforeInput = (event: InputEvent) => {
    onUserInput()

    // Ensure we don't flush while performing an action
    if (flushTimeoutId) {
      clearTimeout(flushTimeoutId)
      flushTimeoutId = null
    }

    // Ensure out current (pending) selection is up-to-date
    scheduleOnDOMSelectionChange()
    scheduleOnDOMSelectionChange.flush()
    onDOMSelectionChange.flush()

    const { inputType: type } = event
    let targetRange =
      EDITOR_TO_USER_SELECTION.get(editor)?.current ?? editor.selection
    const data = (event as any).dataTransfer || event.data || undefined

    // COMPAT: For the deleting forward/backward input types we don't want
    // to change the selection because it is the range that will be deleted,
    // and those commands determine that for themselves.
    const [nativeTargetRange] = (event as any).getTargetRanges()

    if (nativeTargetRange) {
      const range = ReactEditor.toSlateRange(editor, nativeTargetRange, {
        exactMatch: false,
        suppressThrow: false,
      })

      if (range) {
        targetRange = range
      }
    }

    if (!targetRange) {
      throw new Error('Before input without target range')
    }

    console.log({
      targetRange,
      selection: window
        .getSelection()
        ?.getRangeAt(0)
        .cloneRange(),
      target: (event as any).getTargetRanges(),
      data,
    })

    if (Range.isExpanded(targetRange) && type.startsWith('delete')) {
      targetRange = Editor.unhangRange(editor, targetRange)
    }

    if (
      targetRange &&
      Range.isExpanded(targetRange) &&
      type.startsWith('delete')
    ) {
      if (Path.equals(targetRange.anchor.path, targetRange.focus.path)) {
        const [start, end] = Range.edges(targetRange)
        pushAction({
          path: targetRange.anchor.path,
          diff: {
            insertText: '',
            end: end.offset,
            start: start.offset,
          },
        })

        return true
      }

      const direction = type.endsWith('Backward') ? 'backward' : 'forward'
      pushAction({ type: 'delete', at: targetRange, direction })
      return true
    }

    switch (type) {
      case 'deleteByComposition':
      case 'deleteByCut':
      case 'deleteByDrag':
      case 'deleteContent':
      case 'deleteContentForward': {
        pushAction({
          type: 'delete',
          at: targetRange,
          direction: 'forward',
        })
        break
      }

      case 'deleteContentBackward': {
        if (targetRange.anchor.offset > 0) {
          pushAction({
            path: targetRange.anchor.path,
            diff: {
              insertText: '',
              end: targetRange.anchor.offset,
              start: targetRange.anchor.offset - 1,
            },
          })
          break
        }

        pushAction({
          type: 'delete',
          at: targetRange,
          direction: 'backward',
        })
        break
      }

      case 'deleteEntireSoftLine': {
        throw new Error('Not implemented')
      }

      case 'deleteHardLineBackward': {
        throw new Error('Not implemented')
      }

      case 'deleteSoftLineBackward': {
        throw new Error('Not implemented')
      }

      case 'deleteHardLineForward': {
        throw new Error('Not implemented')
      }

      case 'deleteSoftLineForward': {
        throw new Error('Not implemented')
      }

      case 'deleteWordBackward': {
        throw new Error('Not implemented')
      }

      case 'deleteWordForward': {
        throw new Error('Not implemented')
      }

      case 'insertLineBreak':
        // TODO: Other editor action
        pushAction({ type: 'line_break', at: targetRange })
        break

      case 'insertParagraph': {
        pushAction({ type: 'line_break', at: targetRange })
        break
      }

      case 'insertCompositionText':
      case 'deleteCompositionText':
      case 'insertFromComposition':
      case 'insertFromDrop':
      case 'insertFromPaste':
      case 'insertFromYank':
      case 'insertReplacementText':
      case 'insertText': {
        // TODO: Non-string data action, line break

        const unhanged = Editor.unhangRange(editor, targetRange)
        if (!Path.equals(unhanged.anchor.path, unhanged.focus.path)) {
          pushAction({
            type: 'replace_expanded',
            at: targetRange,
            text: data ?? '',
          })
          break
        }

        // TODO: Handle
        const [start, end] = Range.edges(targetRange)
        pushAction({
          path: start.path,
          diff: {
            start: start.offset,
            end: end.offset,
            insertText: data ?? '',
          },
        })

        break
      }
    }

    debug('beforeInputSelection', editor.selection, type)

    return true
  }

  const hasPendingChanges = () => {
    return !!pendingDiffs.length
  }

  const handleUserSelect = (range: Range | null) => {
    const previousSelection =
      EDITOR_TO_USER_SELECTION.get(editor)?.unref() ?? editor.selection
    EDITOR_TO_USER_SELECTION.set(
      editor,
      range ? Editor.rangeRef(editor, range) : null
    )

    if (flushTimeoutId) {
      clearTimeout(flushTimeoutId)
      flushTimeoutId = null
    }

    if (
      range &&
      previousSelection &&
      !Path.equals(previousSelection.anchor.path, range.anchor.path) &&
      !hasPendingChanges()
    ) {
      if (!flushTimeoutId) {
        flushTimeoutId = setTimeout(flush)
      }
    }
  }

  const flushAction = () => {
    // Beforeinput events don't necessarily cause dom mutations (e.g. when deleting before a non-contenteditable element)
    if (currentAction) {
      flush()
    }
  }

  return {
    flush,
    hasPendingChanges,

    handleUserSelect,
    handleCompositionEnd,
    handleCompositionStart,
    handleDOMBeforeInput,

    handleInput: flushAction,
  }
}
