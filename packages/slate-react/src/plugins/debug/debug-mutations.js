import Debug from 'debug'

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

function DebugMutationsPlugin({ __editor__ }) {
  const observer = new window.MutationObserver(function(mutations) {
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
    debug(...array)
  })

  // `findDOMNode` does not exist until later so we use `setTimeout`
  setTimeout(() => {
    const rootEl = __editor__.findDOMNode([])
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
