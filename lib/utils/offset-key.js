
/**
 * Offset key parser regex.
 */

const PARSER = /^(\w+)(?:-(\d+))?$/

/**
 * Offset key attribute name.
 */

const ATTRIBUTE = 'data-offset-key'
const SELECTOR = `[${ATTRIBUTE}]`

/**
 * Find the start and end bounds from a node's `key` and `index`.
 *
 * @param {String} key
 * @param {Number} index
 * @param {State} state
 * @return {Object}
 */

function findBounds(key, index, state) {
  const text = state.document.assertDescendant(key)
  const ranges = text.getDecoratedRanges()
  const range = ranges.get(index)
  const start = ranges
    .slice(0, index)
    .reduce((memo, r) => {
      return memo += r.text.length
    }, 0)

  return {
    start,
    end: start + range.text.length
  }
}

/**
 * From a `element`, find the closest parent's offset key.
 *
 * @param {Element} element
 * @return {String} key
 */

function findKey(element) {
  if (element.nodeType == 3) element = element.parentNode

  // If a parent with an offset key exists, use it.
  const parent = element.closest(SELECTOR)
  if (parent) return parent.getAttribute(ATTRIBUTE)

  // Otherwise, if a child with an offset key exists, use it.
  const child = element.querySelector(SELECTOR)
  if (child) return child.getAttribute(ATTRIBUTE)

  // Otherwise, move up the tree looking for cousin offset keys in parents.
  while (element = element.parentNode) {
    const cousin = element.querySelector(SELECTOR)
    if (cousin) return cousin.getAttribute(ATTRIBUTE)
  }

  // Shouldn't get here... else we have an edge case to handle.
  throw new Error('No offset key found for node.')
}

/**
 * Find the selection point from an `element`, `offset`, and list of `ranges`.
 *
 * @param {Element} element
 * @param {Offset} offset
 * @param {State} state
 * @return {String} key
 */

function findPoint(element, offset, state) {
  const offsetKey = findKey(element)
  const { key, index } = parse(offsetKey)
  const { start, end } = findBounds(key, index, state)

  // Don't let the offset be outside of the start and end bounds.
  offset = start + offset
  offset = Math.max(offset, start)
  offset = Math.min(offset, end)

  return {
    key,
    offset
  }
}

/**
 * Parse an offset key `string`.
 *
 * @param {String} string
 * @return {Object}
 */

function parse(string) {
  const matches = PARSER.exec(string)
  if (!matches) throw new Error(`Invalid offset key string "${string}".`)
  const [ original, key, index ] = matches
  return {
    key,
    index
  }
}

/**
 * Stringify an offset key `object`.
 *
 * @param {Object} object
 *   @property {String} key
 *   @property {Number} index
 * @return {String} key
 */

function stringify(object) {
  return `${object.key}-${object.index}`
}

/**
 * Export.
 */

export default {
  findBounds,
  findKey,
  findPoint,
  parse,
  stringify
}
