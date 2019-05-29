import Debug from 'debug'

/**
 * Debug mutations function.
 *
 * @type {Function}
 */

const debug = Debug('slate:mutations')

/**
 * Properties on a MutationRecord
 *
 * @type {Object}
 */

const MUTATION_PROPERTIES = [
  'type',
  'oldValue',
  'target',
  'addedNodes',
  'removedNodes',
  'attributeName',
  'attributeNamespace',
  'nextSibling',
  'previousSibling',
]

/**
 * A plugin that sends short easy to digest debug info about each dom mutation
 * to browser.
 *
 * More information about mutations here:
 *
 * <https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver>
 * <https://developer.mozilla.org/en-US/docs/Web/API/MutationRecord>
 *
 * @param {Object} options
 */

function DebugMutationsPlugin({ editor }) {
  const observer = new window.MutationObserver(mutations => {
    const array = Array.from(mutations).map(mutationRecord => {
      const object = {}

      // Only add properties that provide meaningful values to the object
      // to make the debug info easier to read
      MUTATION_PROPERTIES.forEach(key => {
        const value = mutationRecord[key]
        if (value == null) return
        if (value instanceof window.NodeList && value.length === 0) return
        object[key] = value
      })

      return object
    })

    // The first argument must not be the array as `debug` renders the first
    // argument in a different way than the rest
    debug(`${array.length} Mutations`, ...array)
  })

  /**
   * The previously observed DOM node
   *
   * @type {DOMNode}
   */

  let prevRootEl = null

  /**
   * Start observing the DOM node for mutations if it isn't being observed
   */

  function start() {
    const rootEl = editor.findDOMNode([])

    if (rootEl === prevRootEl) return

    debug('start')

    observer.observe(rootEl, {
      childList: true,
      characterData: true,
      attributes: true,
      subtree: true,
      characterDataOldValue: true,
    })

    prevRootEl = rootEl
  }

  /**
   * Stop observing the DOM node for mutations
   */

  function stop() {
    debug('stop')

    observer.disconnect()
    prevRootEl = null
  }

  return {
    onComponentDidMount: start,
    onComponentDidUpdate: start,
    onComponentWillUnmount: stop,
  }
}

export default DebugMutationsPlugin
