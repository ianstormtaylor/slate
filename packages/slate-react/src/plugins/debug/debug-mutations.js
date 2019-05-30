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
 * Takes a DOM node and returns an easily readable version of it.
 *
 * @param {DOMNode} node
 */

function normalizeNode(node) {
  if (node.nodeType === window.Node.TEXT_NODE) {
    return node.textContent
  } else if (node.nodeType === window.Node.ELEMENT_NODE) {
    const { outerHTML, innerHTML } = node
    if (outerHTML == null) return JSON.stringify(node.textContent)
    return outerHTML.slice(0, outerHTML.indexOf(innerHTML))
  } else {
    return `Node(type=${node.nodeType}`
  }
}

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

function DebugMutationsPlugin() {
  const observer = new window.MutationObserver(mutations => {
    const array = Array.from(mutations).map(mutationRecord => {
      const object = {}

      // Only add properties that provide meaningful values to the object
      // to make the debug info easier to read
      MUTATION_PROPERTIES.forEach(key => {
        let value = mutationRecord[key]
        if (value == null) return

        // Make NodeList easier to read
        if (value instanceof window.NodeList) {
          if (value.length === 0) return

          object[key] = Array.from(value)
            .map(normalizeNode)
            .join(', ')
          return
        }

        // Make Node easier to read
        if (value instanceof window.Node) {
          value = normalizeNode(value)
        }

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

  function start(event, editor, next) {
    const rootEl = editor.findDOMNode([])

    if (rootEl === prevRootEl) return next()

    debug('start')

    observer.observe(rootEl, {
      childList: true,
      characterData: true,
      attributes: true,
      subtree: true,
      characterDataOldValue: true,
    })

    prevRootEl = rootEl

    next()
  }

  /**
   * Stop observing the DOM node for mutations
   */

  function stop(event, editor, next) {
    debug('stop')

    observer.disconnect()
    prevRootEl = null
    next()
  }

  return {
    onComponentDidMount: start,
    onComponentDidUpdate: start,
    onComponentWillUnmount: stop,
  }
}

export default DebugMutationsPlugin
