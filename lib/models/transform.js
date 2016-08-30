
import Operations from '../transforms/operations'
import Transforms from '../transforms'
import { List, Record } from 'immutable'

/**
 * Transform.
 *
 * @type {Transform}
 */

class Transform {

  /**
   * Constructor.
   *
   * @param {Object} properties
   */

  constructor(properties) {
    const { state } = properties
    this.initialState = state
    this.state = state
    this.operations = []
  }

  /**
   * Get the kind.
   *
   * @return {String} kind
   */

  get kind() {
    return 'transform'
  }

  /**
   * Add an `operation` to the transform that resulted in `state`.
   *
   * @param {Object} operation
   * @return {Transform}
   */

  operate(operation) {
    const { type } = operation
    const fn = Operations[type]

    if (!fn) {
      throw new Error(`Unknown operation type: "${type}".`)
    }

    this.state = fn(this.state, operation)
    this.operations.push(operation)
    return this
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
    let { initialState, state, operations } = this
    let { history, selection } = state
    let { marks } = selection
    let { undos, redos } = history

    // Determine whether we need to create a new snapshot.
    const shouldSnapshot = options.snapshot == null
      ? this.shouldSnapshot()
      : options.snapshot

    // If we should, save a snapshot into the history before transforming.
    if (shouldSnapshot) {
      const snapshot = this.snapshot()
      undos = undos.push(snapshot)
      if (undos.size > 100) undos = undos.take(100)
      redos = redos.clear()
      history = history.merge({ undos, redos })
      state = state.merge({ history })
    }

    // Check whether to remove the cursor marks.
    // if (options.snapshot !== false && initialState.selection.marks) {
    //   selection = selection.merge({ marks: null })
    //   state = state.merge({ selection })
    // }

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
    const { state, operations } = this
    const { history, selection } = state
    const { undos, redos } = history
    const previous = undos.peek()

    // If there isn't a previous state, snapshot.
    if (!previous) return true

    // If the only operations applied are selection operations, don't snapshot.
    const onlySelections = operations.every(op => op.type == 'set_selection')
    if (onlySelections) return false

    // If the current operations aren't one of the "combinable" types, snapshot.
    const onlyInsert = operations.every(op => op.type == 'insert_text')
    const onlyRemove = operations.every(op => op.type == 'remove_text')
    const onlyPrevInsert = previous.operations.every(op => op.type == 'insert_text')
    const onlyPrevRemove = previous.operations.every(op => op.type == 'remove_text')
    if (onlyInsert && onlyPrevInsert) return false
    if (onlyRemove && onlyPrevRemove) return false

    // Otherwise, snapshot.
    return true
  }

  /**
   * Create a history-ready snapshot of the current state.
   *
   * @return {Object}
   */

  snapshot() {
    let { initialState, operations } = this
    let { document, selection } = initialState
    return { document, selection, operations }
  }

  /**
   * Undo to the previous state in the history.
   *
   * @return {State} state
   */

  undo() {
    let { state } = this
    let { history } = state
    let { undos, redos } = history

    // If there's no previous snapshot, return the current state.
    let previous = undos.peek()
    if (!previous) return state

    // Remove the previous snapshot from the undo stack.
    undos = undos.pop()

    // Snapshot the current state, and move it into the redos stack.
    let snapshot = this.snapshot()
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
    let { state } = this
    let { history } = state
    let { undos, redos } = history

    // If there's no next snapshot, return the current state.
    let next = redos.peek()
    if (!next) return state

    // Remove the next history from the redo stack.
    redos = redos.pop()

    // Snapshot the current state, and move it into the undos stack.
    let snapshot = this.snapshot()
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
 * Add a transform method for each of the transforms.
 */

Object.keys(Transforms).forEach((type) => {
  Transform.prototype[type] = function (...args) {
    return Transforms[type](this, ...args)
  }
})

/**
 * Export.
 *
 * @type {Transform}
 */

export default Transform
