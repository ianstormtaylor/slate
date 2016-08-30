
import Transforms from '../transforms'

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
    const { state, operations = [] } = properties
    this.state = state
    this.operations = []

    operations.forEach(op => {
      this.applyOperation(op)
    })
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
   * Apply the transform and return the new state.
   *
   * @param {Object} options
   *   @property {Boolean} isNative
   *   @property {Boolean} snapshot
   * @return {State} state
   */

  apply(options = {}) {
    let { state, operations } = this
    let { history } = state
    let { undos, redos } = history

    // If there are no operations, abort early.
    if (!operations.length) return state

    // The `isNative` flag allows for natively-handled changes to skip
    // rerendering the editor for improved performance.
    const isNative = !!options.isNative

    // Determine whether we need to create a new snapshot.
    const shouldSnapshot = options.snapshot == null
      ? this.shouldSnapshot()
      : options.snapshot

    // Either create a new snapshot, or push the operations into the previous.
    if (shouldSnapshot) {
      const snapshot = { operations }
      undos = undos.push(snapshot)
    } else {
      const snapshot = undos.peek()
      snapshot.operations = snapshot.operations.concat(operations)
    }

    // Clear the redo stack and constrain the undos stack.
    if (undos.size > 100) undos = undos.take(100)
    redos = redos.clear()

    // Update the state.
    history = history.merge({ undos, redos })
    state = state.merge({ history, isNative })
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

    const types = operations.map(op => op.type)
    const prevTypes = previous.operations.map(op => op.type)
    const edits = types.filter(type => type != 'set_selection')
    const prevEdits = prevTypes.filter(type => type != 'set_selection')

    const onlySelections = types.every(type => type == 'set_selection')
    const onlyInsert = edits.every(type => type == 'insert_text')
    const onlyRemove = edits.every(type => type == 'remove_text')
    const prevOnlySelections = prevTypes.every(type => type == 'set_selection')
    const prevOnlyInsert = prevEdits.every(type => type == 'insert_text')
    const prevOnlyRemove = prevEdits.every(type => type == 'remove_text')

    // If the only operations applied are selection operations, or if the
    // current operations are all text editing, don't snapshot.
    if (
      (onlySelections) ||
      (!prevOnlySelections && onlyInsert && prevOnlyInsert) ||
      (!prevOnlySelections && onlyRemove && prevOnlyRemove)
    ) {
      return false
    }

    // Otherwise, snapshot.
    return true
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

    // Shift the next state into the undo stack.
    redos = redos.pop()
    undos = undos.push(next)

    // Replay the next operations.
    const { operations } = next
    operations.forEach(op => {
      this.applyOperation(op)
    })

    // Update the state's history and force `isNative` to false.
    history = history.merge({ undos, redos })
    state = this.state.merge({
      history,
      isNative: false,
    })

    return state
  }

  /**
   * Undo the previous operations in the history.
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

    // Shift the previous operations into the redo stack.
    undos = undos.pop()
    redos = redos.push(previous)

    // Replay the inverse of the previous operations.
    const operations = previous.operations.slice().reverse()
    operations.forEach(op => {
      op.inverse.forEach(inv => {
        this.applyOperation(inv)
      })
    })

    // Update the state's history and force `isNative` to false.
    history = history.merge({ undos, redos })
    state = this.state.merge({
      history,
      isNative: false,
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
