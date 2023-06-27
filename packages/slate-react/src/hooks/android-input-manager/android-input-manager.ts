import { DebouncedFunc } from 'lodash'
import {
  Editor,
  Node,
  Path,
  Point,
  Range,
  Scrubber,
  Text,
  Transforms,
} from 'slate'
import { ReactEditor } from '../../plugin/react-editor'
import {
  applyStringDiff,
  mergeStringDiffs,
  normalizePoint,
  normalizeRange,
  normalizeStringDiff,
  StringDiff,
  targetRange,
  TextDiff,
  verifyDiffState,
} from '../../utils/diff-text'
import { isDOMSelection, isTrackedMutation } from '../../utils/dom'
import {
  EDITOR_TO_FORCE_RENDER,
  EDITOR_TO_PENDING_ACTION,
  EDITOR_TO_PENDING_DIFFS,
  EDITOR_TO_PENDING_INSERTION_MARKS,
  EDITOR_TO_PENDING_SELECTION,
  EDITOR_TO_PLACEHOLDER_ELEMENT,
  EDITOR_TO_USER_MARKS,
  IS_COMPOSING,
} from '../../utils/weak-maps'

export type Action = { at?: Point | Range; run: () => void }

// https://github.com/facebook/draft-js/blob/main/src/component/handlers/composition/DraftEditorCompositionHandler.js#L41
// When using keyboard English association function, conpositionEnd triggered too fast, resulting in after `insertText` still maintain association state.
const RESOLVE_DELAY = 25

// Time with no user interaction before the current user action is considered as done.
const FLUSH_DELAY = 200

// Replace with `const debug = console.log` to debug
const debug = (..._: unknown[]) => {}

// Type guard to check if a value is a DataTransfer
const isDataTransfer = (value: any): value is DataTransfer =>
  value?.constructor.name === 'DataTransfer'

export type CreateAndroidInputManagerOptions = {
  editor: ReactEditor

  scheduleOnDOMSelectionChange: DebouncedFunc<() => void>
  onDOMSelectionChange: DebouncedFunc<() => void>
}

export type AndroidInputManager = {
  flush: () => void
  scheduleFlush: () => void

  hasPendingDiffs: () => boolean
  hasPendingAction: () => boolean
  hasPendingChanges: () => boolean
  isFlushing: () => boolean | 'action'

  handleUserSelect: (range: Range | null) => void
  handleCompositionEnd: (event: React.CompositionEvent<HTMLDivElement>) => void
  handleCompositionStart: (
    event: React.CompositionEvent<HTMLDivElement>
  ) => void
  handleDOMBeforeInput: (event: InputEvent) => void
  handleKeyDown: (event: React.KeyboardEvent<HTMLDivElement>) => void

  handleDomMutations: (mutations: MutationRecord[]) => void
  handleInput: () => void
}

export function createAndroidInputManager({
  editor,
  scheduleOnDOMSelectionChange,
  onDOMSelectionChange,
}: CreateAndroidInputManagerOptions): AndroidInputManager {
  let flushing: 'action' | boolean = false
  let compositionEndTimeoutId: ReturnType<typeof setTimeout> | null = null
  let flushTimeoutId: ReturnType<typeof setTimeout> | null = null
  let actionTimeoutId: ReturnType<typeof setTimeout> | null = null

  let idCounter = 0
  let insertPositionHint: StringDiff | null | false = false

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

    if (action.at) {
      const target = Point.isPoint(action.at)
        ? normalizePoint(editor, action.at)
        : normalizeRange(editor, action.at)

      if (!target) {
        return
      }

      const targetRange = Editor.range(editor, target)
      if (!targetRange) {
        editor.onError({
          key: 'createAndroidInputManager.range',
          message: `Failed to create range for ${Scrubber.stringify(target)}`,
          data: { target },
        })
        return
      }

      if (!editor.selection || !Range.equals(editor.selection, targetRange)) {
        Transforms.select(editor, target)
      }
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

    if (!hasPendingDiffs() && !hasPendingAction()) {
      applyPendingSelection()
      return
    }

    if (!flushing) {
      flushing = true
      setTimeout(() => (flushing = false))
    }

    if (hasPendingAction()) {
      flushing = 'action'
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

    let scheduleSelectionChange = hasPendingDiffs()

    let diff: TextDiff | undefined
    while ((diff = EDITOR_TO_PENDING_DIFFS.get(editor)?.[0])) {
      const pendingMarks = EDITOR_TO_PENDING_INSERTION_MARKS.get(editor)

      if (pendingMarks !== undefined) {
        EDITOR_TO_PENDING_INSERTION_MARKS.delete(editor)
        editor.marks = pendingMarks
      }

      if (pendingMarks && insertPositionHint === false) {
        insertPositionHint = null
        debug('insert after mark placeholder')
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
        selectionRef?.unref()
      }
    }

    const selection = selectionRef?.unref()
    if (
      selection &&
      !EDITOR_TO_PENDING_SELECTION.get(editor) &&
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
      editor.onChange()
    }
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
  }

  const handleCompositionStart = (
    _event: React.CompositionEvent<HTMLDivElement>
  ) => {
    debug('composition start')

    IS_COMPOSING.set(editor, true)

    if (compositionEndTimeoutId) {
      clearTimeout(compositionEndTimeoutId)
      compositionEndTimeoutId = null
    }
  }

  const updatePlaceholderVisibility = (forceHide = false) => {
    const placeholderElement = EDITOR_TO_PLACEHOLDER_ELEMENT.get(editor)
    if (!placeholderElement) {
      return
    }

    if (hasPendingDiffs() || forceHide) {
      placeholderElement.style.display = 'none'
      return
    }

    placeholderElement.style.removeProperty('display')
  }

  const storeDiff = (path: Path, diff: StringDiff) => {
    debug('storeDiff', path, diff)

    const pendingDiffs = EDITOR_TO_PENDING_DIFFS.get(editor) ?? []
    EDITOR_TO_PENDING_DIFFS.set(editor, pendingDiffs)

    const target = Node.leaf(editor, path)
    if (!target) {
      editor.onError({
        key: 'createAndroidInputManager.storeDiff.leaf',
        message: `Failed to find leaf node at path: ${path}`,
        data: { path },
      })
      return
    }

    const idx = pendingDiffs.findIndex(change => Path.equals(change.path, path))
    if (idx < 0) {
      const normalized = normalizeStringDiff(target.text, diff)
      if (normalized) {
        pendingDiffs.push({ path, diff, id: idCounter++ })
      }

      updatePlaceholderVisibility()
      return
    }

    const merged = mergeStringDiffs(target.text, pendingDiffs[idx].diff, diff)
    if (!merged) {
      pendingDiffs.splice(idx, 1)
      updatePlaceholderVisibility()
      return
    }

    pendingDiffs[idx] = {
      ...pendingDiffs[idx],
      diff: merged,
    }
  }

  const scheduleAction = (
    run: () => void,
    { at }: { at?: Point | Range } = {}
  ): void => {
    insertPositionHint = false
    debug('scheduleAction', { at, run })

    EDITOR_TO_PENDING_SELECTION.delete(editor)
    scheduleOnDOMSelectionChange.cancel()
    onDOMSelectionChange.cancel()

    if (hasPendingAction()) {
      flush()
    }

    EDITOR_TO_PENDING_ACTION.set(editor, { at, run })

    // COMPAT: When deleting before a non-contenteditable element chrome only fires a beforeinput,
    // (no input) and doesn't perform any dom mutations. Without a flush timeout we would never flush
    // in this case and thus never actually perform the action.
    actionTimeoutId = setTimeout(flush)
  }

  const handleDOMBeforeInput = (event: InputEvent): void => {
    if (flushTimeoutId) {
      clearTimeout(flushTimeoutId)
      flushTimeoutId = null
    }

    const { inputType: type } = event
    let targetRange: Range | null = null
    const data: DataTransfer | string | undefined =
      (event as any).dataTransfer || event.data || undefined

    if (
      insertPositionHint !== false &&
      type !== 'insertText' &&
      type !== 'insertCompositionText'
    ) {
      insertPositionHint = false
    }

    let [nativeTargetRange] = (event as any).getTargetRanges()
    if (nativeTargetRange) {
      const range = ReactEditor.toSlateRange(editor, nativeTargetRange, {
        exactMatch: false,
        suppressThrow: true,
      })
      if (!range) {
        editor.onError({
          key:
            'createAndroidInputManager.handleDOMBeforeInput.toSlateRange.nativeTargetRange',
          message: `Failed to resolve Slate range from DOM range: ${nativeTargetRange}`,
          data: { nativeTargetRange },
        })
        return
      }

      targetRange = range
    }

    // COMPAT: SelectionChange event is fired after the action is performed, so we
    // have to manually get the selection here to ensure it's up-to-date.
    const window = ReactEditor.getWindow(editor)
    const domSelection = window.getSelection()
    if (!targetRange && domSelection) {
      nativeTargetRange = domSelection

      const range = ReactEditor.toSlateRange(editor, domSelection, {
        exactMatch: false,
        suppressThrow: true,
      })
      if (!range) {
        editor.onError({
          key:
            'createAndroidInputManager.handleDOMBeforeInput.toSlateRange.domSelection',
          message: `Failed to resolve Slate range from DOM range: ${domSelection}`,
          data: { domSelection },
        })
        return
      }

      targetRange = range
    }

    targetRange = targetRange ?? editor.selection
    if (!targetRange) {
      return
    }

    // By default, the input manager tries to store text diffs so that we can
    // defer flushing them at a later point in time. We don't want to flush
    // for every input event as this can be expensive. However, there are some
    // scenarios where we cannot safely store the text diff and must instead
    // schedule an action to let Slate normalize the editor state.
    let canStoreDiff = true

    if (type.startsWith('delete')) {
      if (Range.isExpanded(targetRange)) {
        const [start, end] = Range.edges(targetRange)
        const leaf = Node.leaf(editor, start.path)
        if (!leaf) {
          editor.onError({
            key: 'createAndroidInputManager.handleDOMBeforeInput.leaf',
            message: `Failed to find leaf node at path: ${start.path}`,
            data: { path: start.path },
          })
          return
        }

        if (leaf.text.length === start.offset && end.offset === 0) {
          const next = Editor.next(editor, {
            at: start.path,
            match: Text.isText,
          })
          if (next && Path.equals(next[1], end.path)) {
            targetRange = { anchor: end, focus: end }
          }
        }
      }

      const direction = type.endsWith('Backward') ? 'backward' : 'forward'
      const [start, end] = Range.edges(targetRange)
      const entry = Editor.leaf(editor, start.path)
      if (!entry) {
        editor.onError({
          key: 'createAndroidInputManager.handleDOMBeforeInput.leaf.2',
          message: `Failed to find leaf node at path: ${start.path}`,
          data: { path: start.path },
        })
        return
      }
      const [leaf, path] = entry

      const diff = {
        text: '',
        start: start.offset,
        end: end.offset,
      }
      const pendingDiffs = EDITOR_TO_PENDING_DIFFS.get(editor)
      const relevantPendingDiffs = pendingDiffs?.find(change =>
        Path.equals(change.path, path)
      )
      const diffs = relevantPendingDiffs
        ? [relevantPendingDiffs.diff, diff]
        : [diff]
      const text = applyStringDiff(leaf.text, ...diffs)

      if (text.length === 0) {
        // Text leaf will be removed, so we need to schedule an
        // action to remove it so that Slate can normalize instead
        // of storing as a diff
        canStoreDiff = false
      }

      if (Range.isExpanded(targetRange)) {
        if (
          canStoreDiff &&
          Path.equals(targetRange.anchor.path, targetRange.focus.path)
        ) {
          const point = { path: targetRange.anchor.path, offset: start.offset }
          const range = Editor.range(editor, point, point)
          if (!range) {
            editor.onError({
              key: 'createAndroidInputManager.handleDOMBeforeInput.range',
              message: `Failed to create range at point: ${point}`,
              data: { point },
            })
            return
          }

          handleUserSelect(range)

          return storeDiff(targetRange.anchor.path, {
            text: '',
            end: end.offset,
            start: start.offset,
          })
        }

        return scheduleAction(
          () => Editor.deleteFragment(editor, { direction }),
          { at: targetRange }
        )
      }
    }

    switch (type) {
      case 'deleteByComposition':
      case 'deleteByCut':
      case 'deleteByDrag': {
        return scheduleAction(() => Editor.deleteFragment(editor), {
          at: targetRange,
        })
      }

      case 'deleteContent':
      case 'deleteContentForward': {
        const { anchor } = targetRange
        if (canStoreDiff && Range.isCollapsed(targetRange)) {
          const targetNode = Node.leaf(editor, anchor.path)
          if (!targetNode) {
            return editor.onError({
              key:
                'createAndroidInputManager.handleDOMBeforeInput.deleteContent.leaf',
              message: `Failed to find leaf node at path: ${anchor.path}`,
              data: { path: anchor.path },
            })
          }

          if (anchor.offset < targetNode.text.length) {
            return storeDiff(anchor.path, {
              text: '',
              start: anchor.offset,
              end: anchor.offset + 1,
            })
          }
        }

        return scheduleAction(() => Editor.deleteForward(editor), {
          at: targetRange,
        })
      }

      case 'deleteContentBackward': {
        const { anchor } = targetRange

        // If we have a mismatch between the native and slate selection being collapsed
        // we are most likely deleting a zero-width placeholder and thus should perform it
        // as an action to ensure correct behavior (mostly happens with mark placeholders)
        const nativeCollapsed = isDOMSelection(nativeTargetRange)
          ? nativeTargetRange.isCollapsed
          : !!nativeTargetRange?.collapsed

        if (
          canStoreDiff &&
          nativeCollapsed &&
          Range.isCollapsed(targetRange) &&
          anchor.offset > 0
        ) {
          return storeDiff(anchor.path, {
            text: '',
            start: anchor.offset - 1,
            end: anchor.offset,
          })
        }

        return scheduleAction(() => Editor.deleteBackward(editor), {
          at: targetRange,
        })
      }

      case 'deleteEntireSoftLine': {
        return scheduleAction(
          () => {
            Editor.deleteBackward(editor, { unit: 'line' })
            Editor.deleteForward(editor, { unit: 'line' })
          },
          { at: targetRange }
        )
      }

      case 'deleteHardLineBackward': {
        return scheduleAction(
          () => Editor.deleteBackward(editor, { unit: 'block' }),
          { at: targetRange }
        )
      }

      case 'deleteSoftLineBackward': {
        return scheduleAction(
          () => Editor.deleteBackward(editor, { unit: 'line' }),
          { at: targetRange }
        )
      }

      case 'deleteHardLineForward': {
        return scheduleAction(
          () => Editor.deleteForward(editor, { unit: 'block' }),
          { at: targetRange }
        )
      }

      case 'deleteSoftLineForward': {
        return scheduleAction(
          () => Editor.deleteForward(editor, { unit: 'line' }),
          { at: targetRange }
        )
      }

      case 'deleteWordBackward': {
        return scheduleAction(
          () => Editor.deleteBackward(editor, { unit: 'word' }),
          { at: targetRange }
        )
      }

      case 'deleteWordForward': {
        return scheduleAction(
          () => Editor.deleteForward(editor, { unit: 'word' }),
          { at: targetRange }
        )
      }

      case 'insertLineBreak': {
        return scheduleAction(() => Editor.insertSoftBreak(editor), {
          at: targetRange,
        })
      }

      case 'insertParagraph': {
        return scheduleAction(() => Editor.insertBreak(editor), {
          at: targetRange,
        })
      }
      case 'insertCompositionText':
      case 'deleteCompositionText':
      case 'insertFromComposition':
      case 'insertFromDrop':
      case 'insertFromPaste':
      case 'insertFromYank':
      case 'insertReplacementText':
      case 'insertText': {
        if (isDataTransfer(data)) {
          return scheduleAction(() => ReactEditor.insertData(editor, data), {
            at: targetRange,
          })
        }

        let text = data ?? ''

        // COMPAT: If we are writing inside a placeholder, the ime inserts the text inside
        // the placeholder itself and thus includes the zero-width space inside edit events.
        if (EDITOR_TO_PENDING_INSERTION_MARKS.get(editor)) {
          text = text.replace('\uFEFF', '')
        }

        // Pastes from the Android clipboard will generate `insertText` events.
        // If the copied text contains any newlines, Android will append an
        // extra newline to the end of the copied text.
        if (type === 'insertText' && /.*\n.*\n$/.test(text)) {
          text = text.slice(0, -1)
        }

        // If the text includes a newline, split it at newlines and paste each component
        // string, with soft breaks in between each.
        if (text.includes('\n')) {
          return scheduleAction(
            () => {
              const parts = text.split('\n')
              parts.forEach((line, i) => {
                if (line) {
                  Editor.insertText(editor, line)
                }
                if (i !== parts.length - 1) {
                  Editor.insertSoftBreak(editor)
                }
              })
            },
            {
              at: targetRange,
            }
          )
        }

        if (Path.equals(targetRange.anchor.path, targetRange.focus.path)) {
          const [start, end] = Range.edges(targetRange)

          const diff = {
            start: start.offset,
            end: end.offset,
            text,
          }

          // COMPAT: Swiftkey has a weird bug where the target range of the 2nd word
          // inserted after a mark placeholder is inserted with an anchor offset off by 1.
          // So writing 'some text' will result in 'some ttext'. Luckily all 'normal' insert
          // text events are fired with the correct target ranges, only the final 'insertComposition'
          // isn't, so we can adjust the target range start offset if we are confident this is the
          // swiftkey insert causing the issue.
          if (text && insertPositionHint && type === 'insertCompositionText') {
            const hintPosition =
              insertPositionHint.start + insertPositionHint.text.search(/\S|$/)
            const diffPosition = diff.start + diff.text.search(/\S|$/)

            if (
              diffPosition === hintPosition + 1 &&
              diff.end ===
                insertPositionHint.start + insertPositionHint.text.length
            ) {
              debug('adjusting swiftKey insert position using hint')
              diff.start -= 1
              insertPositionHint = null
              scheduleFlush()
            } else {
              insertPositionHint = false
            }
          } else if (type === 'insertText') {
            if (insertPositionHint === null) {
              insertPositionHint = diff
            } else if (
              insertPositionHint &&
              Range.isCollapsed(targetRange) &&
              insertPositionHint.end + insertPositionHint.text.length ===
                start.offset
            ) {
              insertPositionHint = {
                ...insertPositionHint,
                text: insertPositionHint.text + text,
              }
            } else {
              insertPositionHint = false
            }
          } else {
            insertPositionHint = false
          }

          if (canStoreDiff) {
            storeDiff(start.path, diff)
            return
          }
        }

        return scheduleAction(() => Editor.insertText(editor, text), {
          at: targetRange,
        })
      }
    }
  }

  const hasPendingAction = () => {
    return !!EDITOR_TO_PENDING_ACTION.get(editor)
  }

  const hasPendingDiffs = () => {
    return !!EDITOR_TO_PENDING_DIFFS.get(editor)?.length
  }

  const hasPendingChanges = () => {
    return hasPendingAction() || hasPendingDiffs()
  }

  const isFlushing = () => {
    return flushing
  }

  const handleUserSelect = (range: Range | null) => {
    EDITOR_TO_PENDING_SELECTION.set(editor, range)

    if (flushTimeoutId) {
      clearTimeout(flushTimeoutId)
      flushTimeoutId = null
    }

    const { selection } = editor
    if (!range) {
      return
    }

    const pathChanged =
      !selection || !Path.equals(selection.anchor.path, range.anchor.path)
    const parentPathChanged =
      !selection ||
      !Path.equals(
        selection.anchor.path.slice(0, -1),
        range.anchor.path.slice(0, -1)
      )

    if ((pathChanged && insertPositionHint) || parentPathChanged) {
      insertPositionHint = false
    }

    if (pathChanged || hasPendingDiffs()) {
      flushTimeoutId = setTimeout(flush, FLUSH_DELAY)
    }
  }

  const handleInput = () => {
    if (hasPendingAction() || !hasPendingDiffs()) {
      debug('flush input')
      flush()
    }
  }

  const handleKeyDown = (_: React.KeyboardEvent) => {
    // COMPAT: Swiftkey closes the keyboard when typing inside a empty node
    // directly next to a non-contenteditable element (= the placeholder).
    // The only event fired soon enough for us to allow hiding the placeholder
    // without swiftkey picking it up is the keydown event, so we have to hide it
    // here. See https://github.com/ianstormtaylor/slate/pull/4988#issuecomment-1201050535
    if (!hasPendingDiffs()) {
      updatePlaceholderVisibility(true)
      setTimeout(updatePlaceholderVisibility)
    }
  }

  const scheduleFlush = () => {
    if (!hasPendingAction()) {
      actionTimeoutId = setTimeout(flush)
    }
  }

  const handleDomMutations = (mutations: MutationRecord[]) => {
    if (hasPendingDiffs() || hasPendingAction()) {
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

    hasPendingDiffs,
    hasPendingAction,
    hasPendingChanges,

    isFlushing,

    handleUserSelect,
    handleCompositionEnd,
    handleCompositionStart,
    handleDOMBeforeInput,
    handleKeyDown,

    handleDomMutations,
    handleInput,
  }
}
