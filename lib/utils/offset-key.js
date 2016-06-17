
/**
 * Offset key parser regex.
 */

const PARSER = /^(\w+)(?::(\d+)-(\d+))?$/

/**
 * Offset key attribute name.
 */

const ATTRIBUTE = 'data-offset-key'

/**
 * From a `node`, find the closest parent's offset key.
 *
 * @param {Node} node
 * @return {String} key
 */

function findKey(node) {
  if (node.nodeType == 3) node = node.parentNode
  const parent = node.closest(`[${ATTRIBUTE}]`)
  if (!parent) return null
  return parent.getAttribute(ATTRIBUTE)
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
  return {
    key: parsed.key,
    offset: parsed.start + offset
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
