
/**
 * Event handlers that can be simulated.
 *
 * @type {Array}
 */

const EVENT_HANDLERS = [
  'onBeforeInput',
  'onBlur',
  'onFocus',
  'onCopy',
  'onCut',
  'onDrop',
  'onKeyDown',
  'onPaste',
  'onSelect',
]

/**
 * Change handlers that can be simulated.
 *
 * @type {Array}
 */

const CHANGE_HANDLERS = [
  'onBeforeChange',
  'onChange'
]

/**
 * Simulator.
 *
 * @type {Simulator}
 */

class Simulator {

  /**
   * Create a new `Simulator` for a `stack`.
   *
   * @param {Object} attrs
   */

  constructor({ stack, state }) {
    this.stack = stack
    this.state = state
  }

}

/**
 * Generate the event simulators.
 */

EVENT_HANDLERS.forEach((handler) => {
  const method = getMethodName(handler)

  Simulator.prototype[method] = function (e, data) {
    const { stack, state } = this
    const editor = createEditor(stack, state)
    const event = createEvent(e || {})
    const change = state.change()

    stack[handler](change, editor, event, data)
    stack.onBeforeChange(change, editor)
    stack.onChange(change, editor)

    this.state = change.state
  }
})

/**
 * Generate the change simulators.
 */

CHANGE_HANDLERS.forEach((handler) => {
  const method = getMethodName(handler)

  Simulator.prototype[method] = function () {
    throw new Error('Unimplemented!')
    // const editor = createEditor(stack, state)
    // const next = stack[handler](state, editor)
    // return next
  }
})

/**
 * Get the method name from a `handler` name.
 *
 * @param {String} handler
 * @return {String}
 */

function getMethodName(handler) {
  return handler.charAt(2).toLowerCase() + handler.slice(3)
}

/**
 * Create a fake editor from a `stack` and `state`.
 *
 * @param {Stack} stack
 * @param {State} state
 */

function createEditor(stack, state) {
  return {
    getSchema: () => stack.schema,
    getState: () => state,
  }
}

/**
 * Create a fake event with `attributes`.
 *
 * @param {Object} attributes
 * @return {Object}
 */

function createEvent(attributes) {
  const event = {
    preventDefault: () => event.isDefaultPrevented = true,
    stopPropagation: () => event.isPropagationStopped = true,
    isDefaultPrevented: false,
    isPropagationStopped: false,
    ...attributes,
  }

  return event
}

/**
 * Export.
 *
 * @type {Object}
 */

export default Simulator
