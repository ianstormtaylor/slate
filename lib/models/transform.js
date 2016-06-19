
import { List, Record } from 'immutable'

/**
 * Snapshot, with a state-like shape.
 */

const Snapshot = Record({
  document: null,
  selection: null
})

/**
 * Step.
 */

const Step = Record({
  type: null,
  args: null
})

/**
 * Defaults.
 */

const DEFAULT_PROPERTIES = {
  state: null,
  steps: new List()
}

/**
 * Transform types.
 */

const TRANSFORM_TYPES = [
  'delete',
  'deleteAtRange',
  'deleteBackward',
  'deleteBackwardAtRange',
  'deleteForward',
  'deleteForwardAtRange',
  'insert',
  'insertAtRange',
  'split',
  'splitAtRange'
]

/**
 * Transform.
 */

class Transform extends Record(DEFAULT_PROPERTIES) {

  /**
   * Create a history-ready snapshot of the current state.
   *
   * @return {Snapshot} snapshot
   */

  snapshot() {
    let { state } = this
    let { document, selection } = state
    return new Snapshot({ document, selection })
  }

  /**
   * Apply the transform and return the new state.
   *
   * @return {State} state
   */

  apply() {
    let transform = this
    let { state, steps } = transform
    let { history } = state
    let { undos, redos } = history

    // Save the current state into the history before transforming.
    let snapshot = transform.snapshot()
    undos = undos.unshift(snapshot)
    redos = redos.clear()
    history = history.merge({ undos, redos })
    state = state.merge({ history })

    // Apply each of the steps in the transform, arriving at a new state.
    state = steps.reduce((state, step) => {
      const { type, args } = step
      return state[type](...args)
    }, state)

    return state
  }


  /**
   * Undo to the previous state in the history.
   *
   * @return {State} state
   */

  undo() {
    let transform = this
    let { state } = transform
    let { history } = state
    let { undos, redos } = history

    // If there's no previous snapshot, return the current state.
    let previous = undos.peek()
    if (!previous) return state

    // Remove the previous snapshot from the undo stack.
    undos = undos.shift()

    // Snapshot the current state, and move it into the redos stack.
    let snapshot = transform.snapshot()
    redos = redos.unshift(snapshot)

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
    let transform = this
    let { state } = transform
    let { history } = state
    let { undos, redos } = history

    // If there's no next snapshot, return the current state.
    let next = redos.peek()
    if (!next) return state

    // Remove the next history from the redo stack.
    redos = redos.shift()

    // Snapshot the current state, and move it into the undos stack.
    let snapshot = transform.snapshot()
    undos = undos.unshift(snapshot)

    // Return the next state, with the updated history.
    let { document, selection } = next
    history = history.merge({ undos, redos })
    state = state.merge({ document, selection, history })
    return state
  }

}

/**
 * Add a step-creating method for each transform type.
 */

TRANSFORM_TYPES.forEach((type) => {
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
