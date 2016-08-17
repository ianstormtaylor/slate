
import Transforms from '../transforms'
import includes from 'lodash/includes'
import xor from 'lodash/xor'
import { List, Record } from 'immutable'

/**
 * Snapshot, with a state-like shape.
 */

const Snapshot = new Record({
  document: null,
  selection: null,
  operations: new List()
})

/**
 * Operation.
 */

const Operation = new Record({
  type: null,
  args: null
})

/**
 * Defaults.
 */

const DEFAULT_PROPERTIES = {
  state: null,
  operations: new List()
}

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
  'moveToRangeOf',
  'collapseToEndOfNextBlock',
  'collapseToEndOfNextText',
  'collapseToEndOfPreviousBlock',
  'collapseToEndOfPreviousText',
  'collapseToStartOfNextBlock',
  'collapseToStartOfNextText',
  'collapseToStartOfPreviousBlock',
  'collapseToStartOfPreviousText',
  'moveTo',
]

/**
 * Transform.
 */

class Transform extends new Record(DEFAULT_PROPERTIES) {

  /**
   * Get the kind.
   *
   * @return {String} kind
   */

  get kind() {
    return 'transform'
  }

  /**
   * Apply the transform and return the new state.
   *
   * @param {Object} options
   *   @property {Boolean} isNative
   *   @property {Boolean} snapshot
   * @return {State} state
   */

  apply(options = {}) {
    const transform = this
    let { state, operations } = transform
    let { cursorMarks, history, selection } = state
    let { undos, redos } = history

    // Determine whether we need to create a new snapshot.
    const shouldSnapshot = options.snapshot == null
      ? this.shouldSnapshot()
      : options.snapshot

    // If we should, save a snapshot into the history before transforming.
    if (shouldSnapshot) {
      const snapshot = transform.snapshot()
      undos = undos.push(snapshot)
      if (undos.size > 100) undos = undos.take(100)
      redos = redos.clear()
      history = history.merge({ undos, redos })
      state = state.merge({ history })
    }

    // If there are cursor marks and they haven't changed, remove them.
    if (state.cursorMarks && state.cursorMarks == cursorMarks) {
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
   * Check whether the current transform operations should create a snapshot.
   *
   * @return {Boolean}
   */

  shouldSnapshot() {
    const transform = this
    const { state, operations } = transform
    const { cursorMarks, history, selection } = state
    const { undos, redos } = history
    const previous = undos.peek()

    // If the only operations applied are selection transforms, don't snapshot.
    const onlySelections = operations.every(operation => includes(SELECTION_TRANSFORMS, operation.type))
    if (onlySelections) return false

    // If there isn't a previous state, snapshot.
    if (!previous) return true

    // If there is a previous state but the operations are different, snapshot.
    const types = operations.map(operation => operation.type)
    const prevTypes = previous.operations.map(operation => operation.type)
    const diff = xor(types.toArray(), prevTypes.toArray())
    if (diff.length) return true

    // If the current operations aren't one of the "combinable" types, snapshot.
    const allCombinable = (
      operations.every(operation => operation.type == 'insertText') ||
      operations.every(operation => operation.type == 'deleteForward') ||
      operations.every(operation => operation.type == 'deleteBackward')
    )

    if (!allCombinable) return true

    // Otherwise, don't snapshot.
    return false
  }

  /**
   * Create a history-ready snapshot of the current state.
   *
   * @return {Snapshot} snapshot
   */

  snapshot() {
    let { state, operations } = this
    let { document, selection } = state
    return new Snapshot({ document, selection, operations })
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
    state = state.merge({
      document,
      selection,
      history,
      isNative: false
    })

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
    state = state.merge({
      document,
      selection,
      history,
      isNative: false
    })

    return state
  }

}

/**
 * Add a operation-creating method for each of the transforms.
 */

Object.keys(Transforms).forEach((type) => {
  Transform.prototype[type] = function (...args) {
    let transform = this
    let { operations, state } = transform
    operations = operations.push(new Operation({ type, args }))
    state = Transforms[type](state, ...args)
    transform = transform.merge({ operations, state })
    return transform
  }
})

/**
 * Export.
 */

export default Transform
