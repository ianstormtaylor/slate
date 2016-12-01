
import normalizeNodeAndOffset from './normalize-node-and-offset'

/**
 * Offset key parser regex.
 *
 * @type {RegExp}
 */

const PARSER = /^(\w+)(?:-(\d+))?$/

/**
 * Offset key attribute name.
 *
 * @type {String}
 */

const ATTRIBUTE = 'data-offset-key'

/**
 * Offset key attribute selector.
 *
 * @type {String}
 */

const SELECTOR = `[${ATTRIBUTE}]`

/**
 * Find the start and end bounds from an `offsetKey` and `ranges`.
 *
 * @param {Number} index
 * @param {List<Range>} ranges
 * @return {Object}
 */

function findBounds(index, ranges) {
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
 * From a DOM node, find the closest parent's offset key.
 *
 * @param {Element} rawNode
 * @param {Number} rawOffset
 * @return {Object}
 */

function findKey(rawNode, rawOffset) {
  let { node, offset } = normalizeNodeAndOffset(rawNode, rawOffset)

  // Find the closest parent with an offset key attribute.
  const closest = node.parentNode.closest(SELECTOR)
  let offsetKey

  // Get the key from the closest matching node if one exists.
  if (closest) {
    offsetKey = closest.getAttribute(ATTRIBUTE)
  }

  // Otherwise, for void node scenarios, a cousin node will be selected, and
  // we need to select the first text node cousin we can find.
  else {
    while (node = node.parentNode) {
      const cousin = node.querySelector(SELECTOR)
      if (!cousin) continue
      offsetKey = cousin.getAttribute(ATTRIBUTE)
      offset = cousin.textContent.length
      break
    }
  }

  // If we still didn't find an offset key, error. This is a bug.
  if (!offsetKey) {
    throw new Error(`Unable to find offset key for ${node} with offset "${offset}".`)
  }

  // Return the parsed the offset key.
  const parsed = parse(offsetKey)
  return {
    key: parsed.key,
    index: parsed.index,
    offset
  }
}

/**
 * Find the selection point from an `offsetKey` and `ranges`.
 *
 * @param {Object} offsetKey
 * @param {List<Range>} ranges
 * @return {Object}
 */

function findPoint(offsetKey, ranges) {
  let { key, index, offset } = offsetKey
  const { start, end } = findBounds(index, ranges)

  // Don't let the offset be outside of the start and end bounds.
  offset = start + offset
  offset = Math.max(offset, start)
  offset = Math.min(offset, end)

  return {
    key,
    index,
    start,
    end,
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
  const [ original, key, index ] = matches // eslint-disable-line no-unused-vars
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
 *
 * @type {Object}
 */

export default {
  findBounds,
  findKey,
  findPoint,
  parse,
  stringify
}
