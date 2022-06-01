import { DebouncedFunc } from 'lodash'
import { Editor, Node, Path, Point, Range, Transforms } from 'slate'
import { ReactEditor } from '../../plugin/react-editor'
import {
  EDITOR_TO_PENDING_DIFFS,
  EDITOR_TO_PENDING_SELECTION,
  IS_COMPOSING,
  EDITOR_TO_PENDING_ACTION,
  IS_APPLYING_DIFFS,
} from '../../utils/weak-maps'
import {
  mergeStringDiffs,
  normalizeRange,
  StringDiff,
  targetRange,
  verifyDiffState,
} from './diff-text'

export type Action = { at: Point | Range; run: () => void }

// https://github.com/facebook/draft-js/blob/main/src/component/handlers/composition/DraftEditorCompositionHandler.js#L41
// When using keyboard English association function, conpositionEnd triggered too fast, resulting in after `insertText` still maintain association state.
const RESOLVE_DELAY = 25

// Time with node user interaction before the current user action is considered as done.
const FLUSH_DELAY = 200

// Replace with `const debug = console.log` to debug
const debug = console.log

export type CreateAndroidInputManagerOptions = {
  editor: ReactEditor

  scheduleOnDOMSelectionChange: DebouncedFunc<() => void>
  onDOMSelectionChange: DebouncedFunc<() => void>
}

export function createAndroidInputManager({
  editor,
  scheduleOnDOMSelectionChange,
  onDOMSelectionChange,
}: CreateAndroidInputManagerOptions) {
  let compositionEndTimeoutId: ReturnType<typeof setTimeout> | null = null
  let flushTimeoutId: ReturnType<typeof setTimeout> | null = null
  let actionTimeoutId: ReturnType<typeof setTimeout> | null = null

  const applyPendingSelection = () => {
    const pendingSelection = EDITOR_TO_PENDING_SELECTION.get(editor)
    EDITOR_TO_PENDING_SELECTION.delete(editor)

    if (pendingSelection) {
      const { selection } = editor
      const normalized = normalizeRange(editor, pendingSelection)

      debug('apply pending selection', pendingSelection, normalized)

      if (normalized && (!selection || !Range.equals(normalized, selection))) {
        Transforms.select(editor, normalized)
      }
    }
  }

  const performAction = () => {
    const action = EDITOR_TO_PENDING_ACTION.get(editor)
    EDITOR_TO_PENDING_ACTION.set(editor, null)
    if (!action) {
      return
    }

    const range = normalizeRange(editor, Editor.range(editor, action.at))
    if (!range) {
      return
    }

    if (!editor.selection || !Range.equals(editor.selection, range)) {
      Transforms.select(editor, range)
    }

    action.run()
  }

  const flush = () => {
    if (flushTimeoutId) {
      clearTimeout(flushTimeoutId)
      flushTimeoutId = null
    }
    if (actionTimeoutId) {
      clearTimeout(actionTimeoutId)
      actionTimeoutId = null
    }

    const selectionRef =
      editor.selection &&
      Editor.rangeRef(editor, editor.selection, { affinity: 'forward' })

    const pendingChanges = EDITOR_TO_PENDING_DIFFS.get(editor) ?? []
    debug('flush', EDITOR_TO_PENDING_ACTION.get(editor), pendingChanges)

    const wasApplyingDiffs = !!IS_APPLYING_DIFFS.get(editor)
    IS_APPLYING_DIFFS.set(editor, true)
    pendingChanges.forEach(textDiff => {
      const range = targetRange(textDiff)
      if (!editor.selection || !Range.equals(editor.selection, range)) {
        Transforms.select(editor, range)
      }

      if (textDiff.diff.text) {
        Editor.insertText(editor, textDiff.diff.text)
      } else {
        Editor.deleteFragment(editor)
      }

      if (!verifyDiffState(editor, textDiff)) {
        EDITOR_TO_PENDING_ACTION.delete(editor)
        EDITOR_TO_PENDING_SELECTION.delete(editor)
      }
    })
    IS_APPLYING_DIFFS.set(editor, wasApplyingDiffs)

    const selection = selectionRef?.unref()
    if (
      selection &&
      (!editor.selection || !Range.equals(selection, editor.selection))
    ) {
      Transforms.select(editor, selection)
    }

    if (hasPendingAction()) {
      EDITOR_TO_PENDING_DIFFS.set(editor, [])
      performAction()
      return
    }

    // COMPAT: The selectionChange event is fired after the action is performed,
    // so we have to manually schedule it to ensure we don't 'throw away' the selection
    // while rendering if we have pending changes.
    if (pendingChanges.length) {
      debug('scheduleOnDOMSelectionChange pending changes')
      scheduleOnDOMSelectionChange()
    }

    scheduleOnDOMSelectionChange.flush()
    onDOMSelectionChange.flush()

    EDITOR_TO_PENDING_DIFFS.set(editor, [])

    applyPendingSelection()
  }

  const handleCompositionEnd = (
    _event: React.CompositionEvent<HTMLDivElement>
  ) => {
    if (compositionEndTimeoutId) {
      clearTimeout(compositionEndTimeoutId)
    }

    compositionEndTimeoutId = setTimeout(() => {
      debug('composition end')

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

  const storeDiff = (path: Path, diff: StringDiff) => {
    const pendingDiffs = EDITOR_TO_PENDING_DIFFS.get(editor) ?? []
    EDITOR_TO_PENDING_DIFFS.set(editor, pendingDiffs)

    const idx = pendingDiffs.findIndex(change => Path.equals(change.path, path))
    if (idx < 0) {
      pendingDiffs.push({ path, diff })
      return
    }

    const target = Node.leaf(editor, path)
    pendingDiffs[idx] = {
      path: pendingDiffs[idx].path,
      diff: mergeStringDiffs(target.text, pendingDiffs[idx].diff, diff),
    }
  }

  const scheduleAction = (at: Point | Range, run: () => void) => {
    debug('scheduleAction', { at, run })

    EDITOR_TO_PENDING_SELECTION.delete(editor)
    scheduleOnDOMSelectionChange.cancel()
    onDOMSelectionChange.cancel()

    if (hasPendingAction()) {
      throw new Error('Scheduled new action while current action is pending')
    }

    EDITOR_TO_PENDING_ACTION.set(editor, { at, run })

    // COMPAT: When deleting before a non-contenteditable element chrome only fires a beforeinput,
    // (no input) and doesn't perform any dom mutations. Without a flush timeout we would never flush
    // in this case.
    actionTimeoutId = setTimeout(flush)
  }

  const handleDOMBeforeInput = (event: InputEvent) => {
    // Ensure we don't flush while performing an action
    if (flushTimeoutId) {
      clearTimeout(flushTimeoutId)
      flushTimeoutId = null
    }

    const { inputType: type } = event
    let targetRange: Range | null = null
    const data = (event as any).dataTransfer || event.data || undefined

    // COMPAT: For the deleting forward/backward input types we don't want
    // to change the selection because it is the range that will be deleted,
    // and those commands determine that for themselves.
    const [nativeTargetRange] = (event as any).getTargetRanges()

    if (nativeTargetRange && !hasPendingAction()) {
      const range = ReactEditor.toSlateRange(editor, nativeTargetRange, {
        exactMatch: false,
        suppressThrow: true,
      })

      debug('before input target range', range)

      if (range) {
        targetRange = range
      }
    }

    // COMPAT: SelectionChange event is fired after the action is performed, so we
    // have to manually get the selection here to ensure it's up-to-date.
    const window = ReactEditor.getWindow(editor)
    const domSelection = window.getSelection()
    if (!targetRange && !hasPendingAction() && domSelection) {
      const range = ReactEditor.toSlateRange(editor, domSelection, {
        exactMatch: false,
        suppressThrow: true,
      })

      debug(
        'before input dom selection',
        range,
        domSelection.getRangeAt(0).cloneRange()
      )

      if (range) {
        targetRange = range
      }
    }

    if (!targetRange) {
      debug('before input fallback', editor.selection)
      targetRange = editor.selection
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
        storeDiff(targetRange.anchor.path, {
          text: '',
          end: end.offset,
          start: start.offset,
        })

        return true
      }

      const direction = type.endsWith('Backward') ? 'backward' : 'forward'
      scheduleAction(targetRange, () =>
        Editor.deleteFragment(editor, { direction })
      )
      return true
    }

    switch (type) {
      case 'deleteByComposition':
      case 'deleteByCut':
      case 'deleteByDrag': {
        scheduleAction(targetRange, () => Editor.deleteFragment(editor))
        break
      }

      case 'deleteContent':
      case 'deleteContentForward': {
        const { anchor } = targetRange
        if (Range.isCollapsed(targetRange)) {
          const targetNode = Node.leaf(editor, anchor.path)

          if (anchor.offset < targetNode.text.length) {
            storeDiff(anchor.path, {
              text: '',
              start: anchor.offset,
              end: anchor.offset + 1,
            })
            break
          }
        }

        scheduleAction(targetRange, () => Editor.deleteForward(editor))
        break
      }

      case 'deleteContentBackward': {
        const { anchor } = targetRange
        if (Range.isCollapsed(targetRange) && anchor.offset > 0) {
          storeDiff(anchor.path, {
            text: '',
            start: anchor.offset - 1,
            end: anchor.offset,
          })
          break
        }

        scheduleAction(targetRange, () => Editor.deleteBackward(editor))
        break
      }

      case 'deleteEntireSoftLine': {
        scheduleAction(targetRange, () => {
          Editor.deleteBackward(editor, { unit: 'line' })
          Editor.deleteForward(editor, { unit: 'line' })
        })
        break
      }

      case 'deleteHardLineBackward': {
        scheduleAction(targetRange, () =>
          Editor.deleteBackward(editor, { unit: 'block' })
        )
        break
      }

      case 'deleteSoftLineBackward': {
        scheduleAction(targetRange, () =>
          Editor.deleteBackward(editor, { unit: 'line' })
        )
        break
      }

      case 'deleteHardLineForward': {
        scheduleAction(targetRange, () =>
          Editor.deleteForward(editor, { unit: 'block' })
        )
        break
      }

      case 'deleteSoftLineForward': {
        scheduleAction(targetRange, () =>
          Editor.deleteForward(editor, { unit: 'line' })
        )
        break
      }

      case 'deleteWordBackward': {
        scheduleAction(targetRange, () =>
          Editor.deleteBackward(editor, { unit: 'word' })
        )
        break
      }

      case 'deleteWordForward': {
        scheduleAction(targetRange, () =>
          Editor.deleteForward(editor, { unit: 'word' })
        )
        break
      }

      case 'insertLineBreak': {
        scheduleAction(targetRange, () => Editor.insertSoftBreak(editor))
        break
      }

      case 'insertParagraph': {
        scheduleAction(targetRange, () => Editor.insertBreak(editor))
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
        if (data?.constructor.name === 'DataTransfer') {
          scheduleAction(targetRange, () =>
            ReactEditor.insertData(editor, data)
          )
          break
        }

        if (typeof data === 'string' && data.includes('\n')) {
          scheduleAction(Range.end(targetRange), () =>
            Editor.insertSoftBreak(editor)
          )
          break
        }

        const unhanged = Editor.unhangRange(editor, targetRange)
        if (Path.equals(unhanged.anchor.path, unhanged.focus.path)) {
          const [start, end] = Range.edges(targetRange)
          storeDiff(start.path, {
            start: start.offset,
            end: end.offset,
            text: data ?? '',
          })
          break
        }

        scheduleAction(targetRange, () => Editor.insertText(editor, data ?? ''))
        break
      }
    }

    return true
  }

  const hasPendingAction = () => {
    return !!EDITOR_TO_PENDING_ACTION.get(editor)
  }

  const hasPendingChanges = () => {
    return !!EDITOR_TO_PENDING_DIFFS.get(editor)?.length && !hasPendingAction()
  }

  const handleDOMSelectionChange = () => {
    if (hasPendingAction()) {
      scheduleOnDOMSelectionChange()
      return true
    }
  }

  const handleUserSelect = (range: Range | null) => {
    debug(
      'userSelect',
      range,
      window
        .getSelection()
        ?.getRangeAt(0)
        .cloneRange()
    )

    EDITOR_TO_PENDING_SELECTION.set(editor, range)

    if (flushTimeoutId) {
      clearTimeout(flushTimeoutId)
      flushTimeoutId = null
    }

    const pathChanged =
      range &&
      (!editor.selection ||
        !Path.equals(editor.selection.anchor.path, range?.anchor.path))

    if (pathChanged || !hasPendingChanges()) {
      flushTimeoutId = setTimeout(flush, FLUSH_DELAY) as any
    }
  }

  const flushAction = () => {
    if (hasPendingAction()) {
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
