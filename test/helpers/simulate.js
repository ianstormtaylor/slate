
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
 * Simulate utility.
 *
 * @type {Object}
 */

const Simulate = {}

/**
 * Generate the event simulators.
 */

EVENT_HANDLERS.forEach((handler) => {
  const method = getMethodName(handler)

  Simulate[method] = function (stack, state, e, data) {
    const editor = createEditor(stack, state)
    const event = createEvent(e || {})

    let next = stack[handler](state, editor, event, data)
    if (next == state) return state

    next = stack.onChange(next, editor)
    return next
  }
})

/**
 * Generate the change simulators.
 */

CHANGE_HANDLERS.forEach((handler) => {
  const method = getMethodName(handler)

  Simulate[method] = function (stack, state) {
    const editor = createEditor(stack, state)
    const next = stack[handler](state, editor)
    return next
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
  let event = {
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

export default Simulate
