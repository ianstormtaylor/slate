
import includes from 'lodash/includes'
import xor from 'lodash/xor'
import { List, Record } from 'immutable'

/**
 * Snapshot, with a state-like shape.
 */

const Snapshot = new Record({
  document: null,
  selection: null,
  steps: new List()
})

/**
 * Step.
 */

const Step = new Record({
  type: null,
  args: null
})

/**
 * Document transforms.
 */

const DOCUMENT_TRANSFORMS = [
  'deleteAtRange',
  'deleteBackwardAtRange',
  'deleteForwardAtRange',
  'insertFragmentAtRange',
  'insertTextAtRange',
  'addMarkAtRange',
  'setBlockAtRange',
  'setInlineAtRange',
  'splitBlockAtRange',
  'splitInlineAtRange',
  'removeMarkAtRange',
  'unwrapBlockAtRange',
  'unwrapInlineAtRange',
  'wrapBlockAtRange',
  'wrapInlineAtRange'
]

/**
 * Selection transforms.
 */

const SELECTION_TRANSFORMS = [
  'blur',
  'collapseToAnchor',
  'collapseToEnd',
  'collapseToEndOf',
  'collapseToFocus',
  'collapseToStart',
  'collapseToStartOf',
  'extendBackward',
  'extendForward',
  'extendToEndOf',
  'extendToStartOf',
  'focus',
  'moveBackward',
  'moveForward',
  'moveToOffsets',
  'moveToRangeOf'
]

/**
 * State transforms, that act on both the document and selection.
 */

const STATE_TRANSFORMS = [
  'collapseToEndOfNextBlock',
  'collapseToEndOfNextText',
  'collapseToEndOfPreviousBlock',
  'collapseToEndOfPreviousText',
  'collapseToStartOfNextBlock',
  'collapseToStartOfNextText',
  'collapseToStartOfPreviousBlock',
  'collapseToStartOfPreviousText',
  'delete',
  'deleteBackward',
  'deleteForward',
  'insertFragment',
  'insertText',
  'addMark',
  'moveTo',
  'setBlock',
  'setInline',
  'splitBlock',
  'splitInline',
  'removeMark',
  'unwrapBlock',
  'unwrapInline',
  'wrapBlock',
  'wrapInline'
]

/**
 * All transforms.
 */

const TRANSFORMS = []
  .concat(DOCUMENT_TRANSFORMS)
  .concat(SELECTION_TRANSFORMS)
  .concat(STATE_TRANSFORMS)

/**
 * Defaults.
 */

const DEFAULT_PROPERTIES = {
  state: null,
  steps: new List()
}

/**
 * Transform.
 */

class Transform extends new Record(DEFAULT_PROPERTIES) {

  /**
   * Create a history-ready snapshot of the current state.
   *
   * @return {Snapshot} snapshot
   */

  snapshot() {
    let { state, steps } = this
    let { document, selection } = state
    return new Snapshot({ document, selection, steps })
  }

  /**
   * Apply the transform and return the new state.
   *
   * @param {Object} options
   *   @property {Boolean} isNative
   * @return {State} state
   */

  apply(options = {}) {
    const transform = this
    let { state, steps } = transform
    let { cursorMarks, history, selection } = state
    let { undos, redos } = history

    // Determine whether we need to create a new snapshot.
    let shouldSnapshot = false
    const previous = undos.peek()

    // If there isn't a previous state, snapshot.
    if (!previous) shouldSnapshot = true

    // If there is a previous state but the steps are different, snapshot.
    if (!shouldSnapshot && previous) {
      const types = steps.map(step => step.type)
      const prevTypes = previous.steps.map(step => step.type)
      const diff = xor(types.toArray(), prevTypes.toArray())
      if (diff.length) shouldSnapshot = true
    }

    // If the current steps aren't one of the "combinale" types, snapshot.
    if (!shouldSnapshot) {
      const allCombinable = (
        steps.every(step => step.type == 'insertText') ||
        steps.every(step => step.type == 'deleteForward') ||
        steps.every(step => step.type == 'deleteBackward')
      )
      if (!allCombinable) shouldSnapshot = true
    }

    // If we should, save a snapshot into the history before transforming.
    if (shouldSnapshot) {
      const snapshot = transform.snapshot()
      undos = undos.push(snapshot)
      if (undos.size > 100) undos = undos.take(100)
      redos = redos.clear()
      history = history.merge({ undos, redos })
      state = state.merge({ history })
    }

    // Apply each of the steps in the transform, arriving at a new state.
    state = steps.reduce((memo, step) => this.applyStep(memo, step), state)

    // If the selection has changed, clear any existing cursor marks.
    if (state.selection != selection) {
      state = state.merge({
        cursorMarks: null
      })
    }

    // Apply the "isNative" flag, which is used to allow for natively-handled
    // content changes to skip rerendering the editor for performance.
    state = state.merge({
      isNative: !!options.isNative
    })

    return state
  }

  /**
   * Apply a single `step` to a `state`, differentiating between types.
   *
   * @param {State} state
   * @param {Step} step
   * @return {State} state
   */

  applyStep(state, step) {
    const { type, args } = step

    if (includes(DOCUMENT_TRANSFORMS, type)) {
      let { document, selection } = state
      let [ range, ...rest ] = args
      range = range.normalize(document)
      document = document[type](range, ...rest)
      selection = selection.normalize(document)
      state = state.merge({ document, selection })
      return state
    }

    else if (includes(SELECTION_TRANSFORMS, type)) {
      let { document, selection } = state
      selection = selection[type](...args)
      selection = selection.normalize(document)
      state = state.merge({ selection })
      return state
    }

    else if (includes(STATE_TRANSFORMS, type)) {
      state = state[type](...args)
      return state
    }
  }

  /**
   * Undo to the previous state in the history.
   *
   * @return {State} state
   */

  undo() {
    const transform = this
    let { state } = transform
    let { history } = state
    let { undos, redos } = history

    // If there's no previous snapshot, return the current state.
    let previous = undos.peek()
    if (!previous) return state

    // Remove the previous snapshot from the undo stack.
    undos = undos.pop()

    // Snapshot the current state, and move it into the redos stack.
    let snapshot = transform.snapshot()
    redos = redos.push(snapshot)

    // Return the previous state, with the updated history.
    let { document, selection } = previous
    history = history.merge({ undos, redos })
    state = state.merge({ document, selection, history })
    return state
  }

  /**
   * Redo to the next state in the history.
   *
   * @return {State} state
   */

  redo() {
    const transform = this
    let { state } = transform
    let { history } = state
    let { undos, redos } = history

    // If there's no next snapshot, return the current state.
    let next = redos.peek()
    if (!next) return state

    // Remove the next history from the redo stack.
    redos = redos.pop()

    // Snapshot the current state, and move it into the undos stack.
    let snapshot = transform.snapshot()
    undos = undos.push(snapshot)

    // Return the next state, with the updated history.
    let { document, selection } = next
    history = history.merge({ undos, redos })
    state = state.merge({ document, selection, history })
    return state
  }

}

/**
 * Add a step-creating method for each of the transforms.
 */

TRANSFORMS.forEach((type) => {
  Transform.prototype[type] = function (...args) {
    let transform = this
    let { steps } = transform
    steps = steps.push(new Step({ type, args }))
    transform = transform.merge({ steps })
    return transform
  }
})

/**
 * Export.
 */

export default Transform
