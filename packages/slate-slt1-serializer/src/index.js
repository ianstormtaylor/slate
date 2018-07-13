import { Value } from 'slate'

const isArray = Array.isArray
const isString = o => typeof o === 'string'
const isObj = o => typeof o === 'object' && !isArray(o)

const assert = (b, msg) => {
  if (!b) throw new Error('assertion failed')
  return true
}

/**
 * Deserialize a slt value to a Slate value.
 *
 * @param {String} string
 * @param {Object} options
 *   @property {Boolean} toJSON
 *   @property {String|Object|Block} defaultBlock
 *   @property {Array|Set} defaultMarks
 * @return {Value}
 */

function deserialize(slt, options = {}) {
  const { toJSON } = options

  if (!slt) return new Value()

  // Allow passing raw JSON, to assist in DB upgrades
  if (isObj(slt) && slt.object === 'value') return Value.fromJSON(slt)

  if (slt[0] !== 'slt1') throw new Error('Not an slt1 value')

  const json = {
    object: 'value',
    document: deserializeDocument(slt.slice(1)),
  }

  const ret = toJSON ? json : Value.fromJSON(json)
  return ret
}

function deserializeData(obj) {
  if (obj && isObj(obj)) return obj
}

function deserializeDocument(arr) {
  let i = 1

  const data = deserializeData(arr[i])
  if (data) i++

  const nodes = arr.slice(i).map(deserializeBlock)

  return { object: 'document', data: data || {}, nodes }
}

function deserializeNode(obj) {
  // Single-leaf text without marks
  if (isString(obj)) return deserializeText([obj])

  const t = obj[0]
  // Texts are array of string or array
  if (isString(t) || isArray(t)) return deserializeText(obj)
  if (t === 2 || t === 3) return deserializeBlock(obj)

  throw new Error(`cannot handle ${JSON.stringify(obj)}`)
}

function deserializeBlock(arr) {
  const object =
    arr[0] === 2
      ? 'block'
      : arr[0] === 3
        ? 'inline'
        : assert(0, `unknown block type ${arr[0]}`)
  const type = arr[1]

  let i = 2
  const data = deserializeData(arr[i])
  if (data) i++

  let isVoid, nodes

  if (arr[i] === 5) {
    isVoid = true
    nodes = []
  } else {
    isVoid = false
    nodes = arr.slice(i).map(deserializeNode)
  }

  return {
    object,
    type,
    data: data || {},
    isVoid,
    nodes,
  }
}

function deserializeText(obj) {
  return { object: 'text', leaves: obj.map(deserializeLeaf) }
}

function deserializeLeaf(obj) {
  const str = isString(obj)
  const marks = str ? [] : obj.slice(0, -1).map(deserializeMark)

  return { object: 'leaf', marks, text: str ? obj : obj[obj.length - 1] }
}

function deserializeMark(obj) {
  const str = isString(obj)
  const type = str ? obj : obj[0]
  const data = str ? {} : obj[1]
  return { object: 'mark', data, type }
}

/**
 * Serialize a Slate `value` to a plain object string.
 *
 * @param {Value} value
 * @return {String}
 */

function serialize(value) {
  return ['slt1', ...serializeNode(value.document)]
}

/**
 * Serialize a `node` to plain text.
 *
 * @param {Node} node
 * @return {String}
 */

function serializeNode(node) {
  switch (node.object) {
    case 'document':
      return serializeDocument(node)
    case 'block':
      return serializeBlock(node)
    case 'text':
      return serializeText(node)
    case 'inline':
      return serializeBlock(node)
  }
  return []
}

function serializeData(data) {
  if (data.size) return data.toJS()
}

function serializeDocument(node) {
  const out = [1]

  const data = serializeData(node.data)
  if (data) out.push(data)

  const children = [...node.nodes].map(serializeNode)
  out.push(...children)

  return out
}

function serializeBlock(node) {
  const out = [node.object === 'block' ? 2 : 3, node.type]

  const data = serializeData(node.data)
  if (data) out.push(data)

  if (node.isVoid) {
    out.push(5)
    return out
  }

  const children = [...node.nodes].map(serializeNode)
  // remove empty text nodes, Slate will auto-add them back
  if (children[0] === '') children.splice(0, 1)

  const l = children.length
  if (l && children[l - 1] === '') children.splice(l - 1, 1)
  out.push(...children)

  return out
}

function serializeText(node) {
  const leaves = [...node.leaves].map(serializeLeaf)
  if (leaves.length === 1 && typeof leaves[0] === 'string') return leaves[0]
  return leaves
}

function serializeLeaf(node) {
  if (!node.marks.size) return node.text
  return [...[...node.marks].map(serializeMark), node.text]
}

function serializeMark(node) {
  const data = serializeData(node.data)
  if (data) return [node.type, data]
  return node.type
}

/**
 * Export.
 *
 * @type {Object}
 */

export default {
  deserialize,
  serialize,
}
