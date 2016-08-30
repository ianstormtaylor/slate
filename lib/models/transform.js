
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
    const { state } = properties
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
   * Apply the transform and return the new state.
   *
   * @param {Object} options
   *   @property {Boolean} isNative
   *   @property {Boolean} merge
   *   @property {Boolean} save
   * @return {State} state
   */

  apply(options = {}) {
    let { merge, isNative = false, save = true } = options
    let { state, operations } = this
    let { history } = state
    let { undos, redos } = history
    const previous = undos.peek()

    // If there are no operations, abort early.
    if (!operations.length) return state

    // If there's a previous save point, determine if the new operations should
    // be merged into the previous ones.
    if (previous && merge == null) {
      const types = operations.map(op => op.type)
      const prevTypes = previous.map(op => op.type)
      const edits = types.filter(type => type != 'set_selection')
      const prevEdits = prevTypes.filter(type => type != 'set_selection')
      const onlySelections = types.every(type => type == 'set_selection')
      const onlyInserts = edits.length && edits.every(type => type == 'insert_text')
      const onlyRemoves = edits.length && edits.every(type => type == 'remove_text')
      const prevOnlyInserts = prevEdits.length && prevEdits.every(type => type == 'insert_text')
      const prevOnlyRemoves = prevEdits.length && prevEdits.every(type => type == 'remove_text')

      merge = (
        (onlySelections) ||
        (onlyInserts && prevOnlyInserts) ||
        (onlyRemoves && prevOnlyRemoves)
      )
    }

    // Save the new operations.
    if (save || !previous) {
      this.save({ merge })
    }

    // Return the new state with the `isNative` flag set.
    return this.state.merge({ isNative: !!isNative })
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
