
/**
 * Offset key parser regex.
 */

const PARSER = /^(\w+)(?::(\d+)-(\d+))?$/

/**
 * Offset key attribute name.
 */

const ATTRIBUTE = 'data-offset-key'
const SELECTOR = `[${ATTRIBUTE}]`

/**
 * From a `node`, find the closest parent's offset key.
 *
 * @param {Node} node
 * @return {String} key
 */

function findKey(node) {
  if (node.nodeType == 3) node = node.parentNode

  // If a parent with an offset key exists, use it.
  const parent = node.closest(SELECTOR)
  if (parent) return parent.getAttribute(ATTRIBUTE)

  // Otherwise, if a child with an offset key exists, use it.
  const child = node.querySelector(SELECTOR)
  if (child) return child.getAttribute(ATTRIBUTE)

  // Otherwise, move up the tree looking for cousin offset keys in parents.
  while (node = node.parentNode) {
    const cousin = node.querySelector(SELECTOR)
    if (cousin) return cousin.getAttribute(ATTRIBUTE)
  }

  // Shouldn't get here... else we have an edge case to handle.
  console.error('No offset key found for node:', node)
}

/**
 * From a `node` and `offset`, find the closest parent's point.
 *
 * @param {Node} node
 * @param {Offset} offset
 * @return {String} key
 */

function findPoint(node, offset) {
  const key = findKey(node)
  const parsed = parse(key)

  // Don't let the offset be outside the start and end bounds.
  offset = parsed.start + offset
  offset = Math.max(offset, parsed.start)
  offset = Math.min(offset, parsed.end)

  return {
    key: parsed.key,
    offset
  }
}

/**
 * Parse an offset key `string`.
 *
 * @param {String} string
 * @return {Object} parsed
 */

function parse(string) {
  const matches = PARSER.exec(string)
  if (!matches) throw new Error(`Invalid offset key string "${string}".`)

  let [ original, key, start, end ] = matches
  start = parseInt(start, 10)
  end = parseInt(end, 10)

  return {
    key,
    start,
    end
  }
}

/**
 * Stringify an offset key `object`.
 *
 * @param {Object} object
 *   @property {String} key
 *   @property {Number} start
 *   @property {Number} end
 * @return {String} key
 */

function stringify(object) {
  return `${object.key}:${object.start}-${object.end}`
}

/**
 * Export.
 */

export default {
  findKey,
  findPoint,
  parse,
  stringify
}
