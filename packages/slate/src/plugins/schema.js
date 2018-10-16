import SlateError from '../utils/slate-error'
import Queries from './queries'

/**
 * Create a plugin from a `schema` definition.
 *
 * @param {Object} schema
 * @return {Object}
 */

function SchemaPlugin(schema) {
  const { rules, document, blocks, inlines, marks } = schema
  let schemaRules = []

  if (rules) {
    schemaRules = schemaRules.concat(rules)
  }

  if (document) {
    schemaRules.push({
      match: [{ object: 'document' }],
      ...document,
    })
  }

  if (blocks) {
    for (const key in blocks) {
      schemaRules.push({
        match: [{ object: 'block', type: key }],
        ...blocks[key],
      })
    }
  }

  if (inlines) {
    for (const key in inlines) {
      schemaRules.push({
        match: [{ object: 'inline', type: key }],
        ...inlines[key],
      })
    }
  }

  if (marks) {
    for (const key in marks) {
      schemaRules.push({
        match: [{ object: 'mark', type: key }],
        ...marks[key],
      })
    }
  }

  /**
   * Check if a `mark` is void based on the schema rules.
   *
   * @param {Editor} editor
   * @param {Mark} mark
   * @return {Boolean}
   */

  function isAtomic(editor, mark) {
    const rule = schemaRules.find(
      r => 'isAtomic' in r && testRules(mark, r.match)
    )

    return rule && rule.isAtomic
  }

  /**
   * Check if a `node` is void based on the schema rules.
   *
   * @param {Editor} editor
   * @param {Node} node
   * @return {Boolean}
   */

  function isVoid(editor, node) {
    const rule = schemaRules.find(
      r => 'isVoid' in r && testRules(node, r.match)
    )

    return rule && rule.isVoid
  }

  /**
   * Normalize a `node` with the schema rules, returning a function that will
   * fix the invalid node, or void if the node is valid.
   *
   * @param {Node} node
   * @param {Function} next
   * @return {Function|Void}
   */

  function normalizeNode(node, next) {
    const error = validateNode(node, () => {})
    if (!error) return next()

    return change => {
      const { rule } = error
      const { size } = change.operations

      // First run the user-provided `normalize` function if one exists...
      if (rule.normalize) {
        rule.normalize(change, error)
      }

      // If the `normalize` function did not add any operations to the change
      // object, it can't have normalized, so run the default one.
      if (change.operations.size === size) {
        defaultNormalize(change, error)
      }
    }
  }

  /**
   * Validate a `node` with the schema rules, returning a `SlateError` if it's
   * invalid.
   *
   * @param {Node} node
   * @param {Function} next
   * @return {Error|Void}
   */

  function validateNode(node, next) {
    const matches = schemaRules.filter(r => testRules(node, r.match))
    const failure = validateRules(node, matches, schemaRules, { every: true })
    if (!failure) return next()
    const error = new SlateError(failure.code, failure)
    return error
  }

  /**
   * On schema-related queries, respond if we can.
   *
   * @param {Object} query
   * @param {Function} next
   */

  const queries = Queries({ isAtomic, isVoid })

  /**
   * Return the plugins.
   *
   * @type {Object}
   */

  return [{ normalizeNode, validateNode }, queries]
}

/**
 * Normalize an invalid value with `error` with default remedies.
 *
 * @param {Change} change
 * @param {SlateError} error
 */

function defaultNormalize(change, error) {
  const { code, node, child, next, previous, key, mark } = error

  switch (code) {
    case 'child_object_invalid':
    case 'child_type_invalid':
    case 'child_unknown':
    case 'first_child_object_invalid':
    case 'first_child_type_invalid':
    case 'last_child_object_invalid':
    case 'last_child_type_invalid': {
      return child.object === 'text' &&
        node.object === 'block' &&
        node.nodes.size === 1
        ? change.removeNodeByKey(node.key)
        : change.removeNodeByKey(child.key)
    }

    case 'previous_sibling_object_invalid':
    case 'previous_sibling_type_invalid': {
      return previous.object === 'text' &&
        node.object === 'block' &&
        node.nodes.size === 1
        ? change.removeNodeByKey(node.key)
        : change.removeNodeByKey(previous.key)
    }

    case 'next_sibling_object_invalid':
    case 'next_sibling_type_invalid': {
      return next.object === 'text' &&
        node.object === 'block' &&
        node.nodes.size === 1
        ? change.removeNodeByKey(node.key)
        : change.removeNodeByKey(next.key)
    }

    case 'child_required':
    case 'node_text_invalid':
    case 'parent_object_invalid':
    case 'parent_type_invalid': {
      return node.object === 'document'
        ? node.nodes.forEach(n => change.removeNodeByKey(n.key))
        : change.removeNodeByKey(node.key)
    }

    case 'node_data_invalid': {
      return node.data.get(key) === undefined && node.object !== 'document'
        ? change.removeNodeByKey(node.key)
        : change.setNodeByKey(node.key, { data: node.data.delete(key) })
    }

    case 'node_mark_invalid': {
      return node
        .getTexts()
        .forEach(t => change.removeMarkByKey(t.key, 0, t.text.length, mark))
    }

    default: {
      return change.removeNodeByKey(node.key)
    }
  }
}

/**
 * Check that an `object` matches one of a set of `rules`.
 *
 * @param {Mixed} object
 * @param {Object|Array} rules
 * @return {Boolean}
 */

function testRules(object, rules) {
  const error = validateRules(object, rules)
  return !error
}

/**
 * Validate that a `object` matches a `rule` object or array.
 *
 * @param {Mixed} object
 * @param {Object|Array} rule
 * @param {Array|Void} rules
 * @return {Error|Void}
 */

function validateRules(object, rule, rules, options = {}) {
  const { every = false } = options

  if (Array.isArray(rule)) {
    const array = rule.length ? rule : [{}]
    let first

    for (const r of array) {
      const error = validateRules(object, r, rules)
      first = first || error
      if (every && error) return error
      if (!every && !error) return
    }

    return first
  }

  const error =
    validateObject(object, rule) ||
    validateType(object, rule) ||
    validateData(object, rule) ||
    validateMarks(object, rule) ||
    validateText(object, rule) ||
    validateFirst(object, rule) ||
    validateLast(object, rule) ||
    validateNodes(object, rule, rules)

  return error
}

function validateObject(node, rule) {
  if (rule.object == null) return
  if (rule.object === node.object) return
  if (typeof rule.object === 'function' && rule.object(node.object)) return
  return fail('node_object_invalid', { rule, node })
}

function validateType(node, rule) {
  if (rule.type == null) return
  if (rule.type === node.type) return
  if (typeof rule.type === 'function' && rule.type(node.type)) return
  return fail('node_type_invalid', { rule, node })
}

function validateData(node, rule) {
  if (rule.data == null) return
  if (node.data == null) return

  if (typeof rule.data === 'function') {
    if (rule.data(node.data)) return
    return fail('node_data_invalid', { rule, node })
  }

  for (const key in rule.data) {
    const fn = rule.data[key]
    const value = node.data && node.data.get(key)
    const valid = typeof fn === 'function' ? fn(value) : fn === value
    if (valid) continue
    return fail('node_data_invalid', { rule, node, key, value })
  }
}

function validateMarks(node, rule) {
  if (rule.marks == null) return
  const marks = node.getMarks().toArray()

  for (const mark of marks) {
    const valid = rule.marks.some(
      def =>
        typeof def.type === 'function'
          ? def.type(mark.type)
          : def.type === mark.type
    )
    if (valid) continue
    return fail('node_mark_invalid', { rule, node, mark })
  }
}

function validateText(node, rule) {
  if (rule.text == null) return
  const { text } = node
  const valid =
    typeof rule.text === 'function' ? rule.text(text) : rule.text.test(text)
  if (valid) return
  return fail('node_text_invalid', { rule, node, text })
}

function validateFirst(node, rule) {
  if (rule.first == null) return
  const first = node.nodes.first()
  if (!first) return
  const error = validateRules(first, rule.first)
  if (!error) return
  error.rule = rule
  error.node = node
  error.child = first
  error.code = error.code.replace('node_', 'first_child_')
  return error
}

function validateLast(node, rule) {
  if (rule.last == null) return
  const last = node.nodes.last()
  if (!last) return
  const error = validateRules(last, rule.last)
  if (!error) return
  error.rule = rule
  error.node = node
  error.child = last
  error.code = error.code.replace('node_', 'last_child_')
  return error
}

function validateNodes(node, rule, rules = []) {
  if (node.nodes == null) return

  const children = node.nodes.toArray()
  const defs = rule.nodes != null ? rule.nodes.slice() : []
  let offset
  let min
  let index
  let def
  let max
  let child
  let previous
  let next

  function nextDef() {
    offset = offset == null ? null : 0
    def = defs.shift()
    min = def && def.min
    max = def && def.max
    return !!def
  }

  function nextChild() {
    index = index == null ? 0 : index + 1
    offset = offset == null ? 0 : offset + 1
    previous = child
    child = children[index]
    next = children[index + 1]
    if (max != null && offset == max) nextDef()
    return !!child
  }

  function rewind() {
    offset -= 1
    index -= 1
  }

  if (rule.nodes != null) {
    nextDef()
  }

  while (nextChild()) {
    const err =
      validateParent(node, child, rules) ||
      validatePrevious(node, child, previous, index, rules) ||
      validateNext(node, child, next, index, rules)

    if (err) return err

    if (rule.nodes != null) {
      if (!def) {
        return fail('child_unknown', { rule, node, child, index })
      }

      if (def.match) {
        const error = validateRules(child, def.match)

        if (error && offset >= min && nextDef()) {
          rewind()
          continue
        }

        if (error) {
          error.rule = rule
          error.node = node
          error.child = child
          error.index = index
          error.code = error.code.replace('node_', 'child_')
          return error
        }
      }
    }
  }

  if (rule.nodes != null) {
    while (min != null) {
      if (offset < min) {
        return fail('child_required', { rule, node, index })
      }

      nextDef()
    }
  }
}

function validateParent(node, child, rules) {
  for (const rule of rules) {
    if (rule.parent == null) continue
    if (!testRules(child, rule.match)) continue

    const error = validateRules(node, rule.parent)
    if (!error) continue

    error.rule = rule
    error.parent = node
    error.node = child
    error.code = error.code.replace('node_', 'parent_')
    return error
  }
}

function validatePrevious(node, child, previous, index, rules) {
  if (!previous) return

  for (const rule of rules) {
    if (rule.previous == null) continue
    if (!testRules(child, rule.match)) continue

    const error = validateRules(previous, rule.previous)
    if (!error) continue

    error.rule = rule
    error.node = node
    error.child = child
    error.index = index
    error.previous = previous
    error.code = error.code.replace('node_', 'previous_sibling_')
    return error
  }
}

function validateNext(node, child, next, index, rules) {
  if (!next) return

  for (const rule of rules) {
    if (rule.next == null) continue
    if (!testRules(child, rule.match)) continue

    const error = validateRules(next, rule.next)
    if (!error) continue

    error.rule = rule
    error.node = node
    error.child = child
    error.index = index
    error.next = next
    error.code = error.code.replace('node_', 'next_sibling_')
    return error
  }
}

/**
 * Create an interim failure object with `code` and `attrs`.
 *
 * @param {String} code
 * @param {Object} attrs
 * @return {Object}
 */

function fail(code, attrs) {
  return { code, ...attrs }
}

/**
 * Export.
 *
 * @type {Object}
 */

export default SchemaPlugin
