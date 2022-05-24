import { DebouncedFunc } from 'lodash'
import { RefObject } from 'react'
import { Editor, Node, Path, Range, Text, Transforms, Point } from 'slate'
import { ReactEditor } from '../../plugin/react-editor'
import {
  EDITOR_TO_PENDING_SELECTION,
  IS_COMPOSING,
} from '../../utils/weak-maps'
import {
  StringDiff,
  mergeStringDiffs,
  normalizeRange,
  targetRange,
} from './diff-text'

type TextDiff = { path: Path; diff: StringDiff }

type ReplaceExpandedAction = {
  at: Range
  text: string
  type: 'replace_expanded'
}
type LineBreakAction = { at: Range | Point; type: 'line_break' }
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

  const applyPendingSelection = () => {
    const pendingSelection = EDITOR_TO_PENDING_SELECTION.get(editor)
    EDITOR_TO_PENDING_SELECTION.delete(editor)

    if (pendingSelection) {
      const { selection } = editor
      const normalized = normalizeRange(editor, pendingSelection)

      if (!selection || !Range.equals(normalized, selection)) {
        Transforms.select(editor, normalized)
      }
    }
  }

  const performAction = () => {
    const action = currentAction
    currentAction = null

    if (!action) {
      return
    }

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
    debug('flush', currentAction, pendingDiffs)

    const selectionRef =
      editor.selection && Editor.rangeRef(editor, editor.selection)

    const textDiffs = pendingDiffs
    pendingDiffs = []

    Editor.withoutNormalizing(editor, () => {
      textDiffs.forEach(textDiff => {
        const range = targetRange(editor, textDiff)
        console.log(
          'apply text diff targetRange',
          Editor.hasRange(editor, range),
          range
        )

        if (!editor.selection || !Range.equals(editor.selection, range)) {
          Transforms.select(editor, range)
        }

        if (textDiff.diff.insertText) {
          Editor.insertText(editor, textDiff.diff.insertText)
        } else {
          Editor.deleteFragment(editor)
        }
      })
    })

    const selection = selectionRef?.unref()
    if (
      selection &&
      (!editor.selection || !Range.equals(selection, editor.selection))
    ) {
      Transforms.select(editor, selection)
    }

    // COMPAT: The selectionChange event is fired after the action is performed,
    // so we have to manually schedule it to ensure we don't 'throw away' the selection
    // while rendering if we have pending changes.
    //
    // Also we can't use the `beforeInputSelection` if we have text diffs since it was
    // applied on a out-of-date dom state.
    if (textDiffs.length && !currentAction) {
      console.log('scheduleOnDOMSelectionChange')

      scheduleOnDOMSelectionChange()
    }

    if (currentAction) {
      EDITOR_TO_PENDING_SELECTION.delete(editor)
      scheduleOnDOMSelectionChange.cancel()
      onDOMSelectionChange.cancel()

      performAction()
      return
    }

    scheduleOnDOMSelectionChange.flush()
    onDOMSelectionChange.flush()
    applyPendingSelection()
  }

  const handleCompositionEnd = (
    _event: React.CompositionEvent<HTMLDivElement>
  ) => {
    if (compositionEndTimeoutId) {
      clearTimeout(compositionEndTimeoutId)
    }

    compositionEndTimeoutId = setTimeout(() => {
      IS_COMPOSING.set(editor, false)
      flush()
    }, RESOLVE_DELAY)
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
    console.log('pushAction', action)

    if (currentAction) {
      throw new Error('Pushed new action while current action is pending')
    }

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
        diff: mergeStringDiffs(
          target.text,
          pendingDiffs[idx].diff,
          action.diff
        ),
      }

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
      EDITOR_TO_PENDING_SELECTION.get(editor) ?? editor.selection
    const data = (event as any).dataTransfer || event.data || undefined

    // TODO:
    EDITOR_TO_PENDING_SELECTION.delete(editor)

    // COMPAT: For the deleting forward/backward input types we don't want
    // to change the selection because it is the range that will be deleted,
    // and those commands determine that for themselves.
    const [nativeTargetRange] = (event as any).getTargetRanges()

    if (nativeTargetRange && !hasPendingAction()) {
      const range = ReactEditor.toSlateRange(editor, nativeTargetRange, {
        exactMatch: false,
        suppressThrow: true,
      })

      if (range) {
        targetRange = range
      }
    }

    if (!targetRange) {
      throw new Error('Before input without target range')
    }

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
        if (data && typeof data !== 'string') {
          break
        }

        // TODO: Apply after text diff
        const insertLineBreak = data?.endsWith('\n')
        if (insertLineBreak) {
          pushAction({ type: 'line_break', at: Range.end(targetRange) })

          break
        }

        const unhanged = Editor.unhangRange(editor, targetRange)
        if (!Path.equals(unhanged.anchor.path, unhanged.focus.path)) {
          pushAction({
            type: 'replace_expanded',
            at: targetRange,
            text: data ?? '',
          })
        } else {
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
        }

        break
      }
    }

    debug('beforeInputSelection', targetRange, type)

    return true
  }

  const hasPendingChanges = () => {
    return !!pendingDiffs.length
  }

  const hasPendingAction = () => {
    return currentAction !== null
  }

  const handleDOMSelectionChange = () => {
    if (hasPendingAction()) {
      scheduleOnDOMSelectionChange()
      return true
    }
  }

  const handleUserSelect = (range: Range | null) => {
    const previousSelection =
      EDITOR_TO_PENDING_SELECTION.get(editor) ?? editor.selection

    console.log('handleUserSelect', range)
    EDITOR_TO_PENDING_SELECTION.set(editor, range)

    if (flushTimeoutId) {
      clearTimeout(flushTimeoutId)
      flushTimeoutId = null
    }

    if (
      range &&
      previousSelection &&
      !Path.equals(previousSelection.anchor.path, range.anchor.path) &&
      !hasPendingAction() &&
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
    hasPendingAction,

    handleDOMSelectionChange,
    handleUserSelect,
    handleCompositionEnd,
    handleCompositionStart,
    handleDOMBeforeInput,

    handleInput: flushAction,
  }
}
