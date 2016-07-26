
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
 * @return {String or Null}
 */

function findKey(element) {
  if (element.nodeType == 3) element = element.parentNode
  const parent = element.closest(SELECTOR)
  if (!parent) return null
  return parent.getAttribute(ATTRIBUTE)
}

/**
 * Find the selection point from an `element`, `offset`, and `state`.
 *
 * @param {Element} element
 * @param {Offset} offset
 * @param {State} state
 * @return {Object}
 */

function findPoint(element, offset, state) {
  let offsetKey = findKey(element)

  // COMPAT: In Firefox, and potentially other browsers, when performing a
  // "select all" action, a parent element is selected instead of the text. In
  // this case, we need to select the proper inner text nodes. (2016/07/26)
  if (!offsetKey) {
    const children = element.querySelectorAll(SELECTOR)
    let child = children[0]

    if (offset != 0) {
      child = children[children.length - 1]
      offset = child.textContent.length
    }

    offsetKey = child.getAttribute(ATTRIBUTE)
  }

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
 * Find the range from an `element`.
 *
 * @param {Element} element
 * @param {State} state
 * @return {Range}
 */

function findRange(element, state) {
  const offsetKey = findKey(element)
  const { key, index } = parse(offsetKey)
  const text = state.document.getDescendant(key)
  const ranges = text.getDecoratedRanges()
  const range = ranges.get(index)
  return range
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
    index: parseInt(index, 10)
  }
}

/**
 * Stringify an offset key `object`.
 *
 * @param {Object} object
 *   @property {String} key
 *   @property {Number} index
 * @return {String}
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
  findRange,
  parse,
  stringify
}
