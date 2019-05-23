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

function normalizeNode(node) {
  const { outerHTML, innerHTML } = node
  if (outerHTML == null) return JSON.stringify(node.textContent)
  return outerHTML.slice(0, outerHTML.indexOf(innerHTML))
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

function DebugMutationsPlugin({ editor }) {
  const observer = new window.MutationObserver(mutations => {
    const array = Array.from(mutations).map(mutationRecord => {
      const object = {}

      // Only add properties that provide meaningful values to the object
      // to make the debug info easier to read
      MUTATION_PROPERTIES.forEach(key => {
        const value = mutationRecord[key]
        if (value == null) return
        if (value instanceof window.NodeList) {
          if (value.length === 0) return
          object[key] = Array.from(value)
            .map(normalizeNode)
            .join(', ')
          return
        }
        // if (value instanceof window.Node) {
        //   object[key] = normalizeNode(value)
        //   return
        // }
        object[key] = value
      })

      return object
    })

    // The first argument must not be the array as `debug` renders the first
    // argument in a different way than the rest
    debug(`${array.length} Mutations`, ...array)
  })

  // `findDOMNode` does not exist until later so we use `setTimeout`
  setTimeout(() => {
    const rootEl = editor.findDOMNode([])

    observer.observe(rootEl, {
      childList: true,
      characterData: true,
      attributes: true,
      subtree: true,
      characterDataOldValue: true,
    })
  })
}

export default DebugMutationsPlugin
