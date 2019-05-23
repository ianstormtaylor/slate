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
