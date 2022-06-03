import { DebouncedFunc } from 'lodash'
import { Editor, Node, Path, Point, Range, Transforms, Text } from 'slate'
import { ReactEditor } from '../../plugin/react-editor'
import {
  EDITOR_TO_PENDING_ACTION,
  EDITOR_TO_PENDING_DIFFS,
  EDITOR_TO_PENDING_SELECTION,
  IS_COMPOSING,
  EDITOR_TO_MARK_PLACEHOLDER_MARKS,
  EDITOR_TO_USER_MARKS,
  EDITOR_TO_FORCE_RENDER,
} from '../../utils/weak-maps'
import {
  mergeStringDiffs,
  normalizeRange,
  StringDiff,
  targetRange,
  TextDiff,
  verifyDiffState,
  normalizePoint,
} from './diff-text'
import { isTrackedMutation } from './use-mutation-observer'

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
  let flushing: 'action' | boolean = false

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
    EDITOR_TO_PENDING_ACTION.delete(editor)
    if (!action) {
      return
    }

    const target = Point.isPoint(action.at)
      ? normalizePoint(editor, action.at)
      : normalizeRange(editor, action.at)

    if (!target) {
      return
    }

    const targetRange = Editor.range(editor, target)
    if (!editor.selection || !Range.equals(editor.selection, targetRange)) {
      Transforms.select(editor, target)
    }

    action.run()
  }

  const flush = () => {
    if (!flushing) {
      flushing = true
      setTimeout(() => (flushing = false))
    }
    if (hasPendingAction()) {
      flushing = 'action'
    }

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
    EDITOR_TO_USER_MARKS.set(editor, editor.marks)

    debug(
      'flush',
      EDITOR_TO_PENDING_ACTION.get(editor),
      EDITOR_TO_PENDING_DIFFS.get(editor)
    )

    let scheduleSelectionChange = !!EDITOR_TO_PENDING_DIFFS.get(editor)?.length

    let diff: TextDiff | undefined
    while ((diff = EDITOR_TO_PENDING_DIFFS.get(editor)?.[0])) {
      const placeholderMarks = EDITOR_TO_MARK_PLACEHOLDER_MARKS.get(editor)
      if (placeholderMarks !== undefined) {
        EDITOR_TO_MARK_PLACEHOLDER_MARKS.delete(editor)
        editor.marks = placeholderMarks
      }

      const range = targetRange(diff)
      if (!editor.selection || !Range.equals(editor.selection, range)) {
        Transforms.select(editor, range)
      }

      if (diff.diff.text) {
        Editor.insertText(editor, diff.diff.text)
      } else {
        Editor.deleteFragment(editor)
      }

      // Remove diff only after we have applied it to account for it when transforming
      // pending ranges.
      EDITOR_TO_PENDING_DIFFS.set(
        editor,
        EDITOR_TO_PENDING_DIFFS.get(editor)?.filter(
          ({ id }) => id !== diff!.id
        )!
      )

      if (!verifyDiffState(editor, diff)) {
        debug('invalid diff state')
        scheduleSelectionChange = false
        EDITOR_TO_PENDING_ACTION.delete(editor)
        EDITOR_TO_USER_MARKS.delete(editor)
        flushing = 'action'

        // Ensure we don't restore the pending user (dom) selection
        // since the document and dom state do not match.
        EDITOR_TO_PENDING_SELECTION.delete(editor)
        scheduleOnDOMSelectionChange.cancel()
        onDOMSelectionChange.cancel()
      }
    }

    const selection = selectionRef?.unref()
    if (
      selection &&
      (!editor.selection || !Range.equals(selection, editor.selection))
    ) {
      Transforms.select(editor, selection)
    }

    if (hasPendingAction()) {
      performAction()
      return
    }

    // COMPAT: The selectionChange event is fired after the action is performed,
    // so we have to manually schedule it to ensure we don't 'throw away' the selection
    // while rendering if we have pending changes.
    if (scheduleSelectionChange) {
      debug('scheduleOnDOMSelectionChange pending changes')
      scheduleOnDOMSelectionChange()
    }

    scheduleOnDOMSelectionChange.flush()
    onDOMSelectionChange.flush()

    applyPendingSelection()

    const userMarks = EDITOR_TO_USER_MARKS.get(editor)
    EDITOR_TO_USER_MARKS.delete(editor)
    if (userMarks !== undefined) {
      editor.marks = userMarks
    }
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
      pendingDiffs.push({ path, diff, id: Date.now() })
      return
    }

    const target = Node.leaf(editor, path)
    const merged = mergeStringDiffs(target.text, pendingDiffs[idx].diff, diff)
    if (!merged) {
      pendingDiffs.splice(idx, 1)
      return
    }

    pendingDiffs[idx] = {
      ...pendingDiffs[idx],
      diff: merged,
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
    // in this case and thus never actually perform the action.
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
      targetRange = ReactEditor.toSlateRange(editor, nativeTargetRange, {
        exactMatch: false,
        suppressThrow: true,
      })
    }

    // COMPAT: SelectionChange event is fired after the action is performed, so we
    // have to manually get the selection here to ensure it's up-to-date.
    const window = ReactEditor.getWindow(editor)
    const domSelection = window.getSelection()
    if (!targetRange && !hasPendingAction() && domSelection) {
      targetRange = ReactEditor.toSlateRange(editor, domSelection, {
        exactMatch: false,
        suppressThrow: true,
      })
    }

    targetRange = targetRange ?? editor.selection
    if (!targetRange) {
      return
    }

    if (Range.isExpanded(targetRange) && type.startsWith('delete')) {
      const [start, end] = Range.edges(targetRange)
      const leaf = Node.leaf(editor, start.path)

      if (leaf.text.length === start.offset && end.offset === 0) {
        const next = Editor.next(editor, { at: start.path, match: Text.isText })
        if (next && Path.equals(next[1], end.path)) {
          targetRange = { anchor: end, focus: end }
        }
      }
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
    return !!EDITOR_TO_PENDING_ACTION.get(editor) || !!actionTimeoutId
  }

  const hasPendingChanges = () => {
    return !!EDITOR_TO_PENDING_DIFFS.get(editor)?.length
  }

  const isFlushing = () => {
    return flushing
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
      flushTimeoutId = setTimeout(flush, FLUSH_DELAY)
    }
  }

  const flushAction = () => {
    if (hasPendingAction() || !hasPendingChanges()) {
      flush()
    }
  }

  const scheduleFlush = () => {
    if (!hasPendingAction()) {
      actionTimeoutId = setTimeout(flush)
    }
  }

  const handleDomMutations = (mutations: MutationRecord[]) => {
    if (hasPendingChanges()) {
      return
    }

    if (
      mutations.some(mutation => isTrackedMutation(editor, mutation, mutations))
    ) {
      // Cause a re-render to restore the dom state if we encounter tracked mutations without
      // a corresponding pending action.
      EDITOR_TO_FORCE_RENDER.get(editor)?.()
    }
  }

  return {
    flush,
    scheduleFlush,

    hasPendingChanges,
    hasPendingAction,

    handleDOMSelectionChange,
    handleUserSelect,
    handleCompositionEnd,
    handleCompositionStart,
    handleDOMBeforeInput,

    handleDomMutations,
    handleInput: flushAction,
    isFlushing,
  }
}
