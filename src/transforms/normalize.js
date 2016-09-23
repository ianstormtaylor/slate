
/**
 * Only allow block nodes in documents.
 *
 * @type {Object}
 */

const DOCUMENT_CHILDREN_RULE = {
  match: (node) => {
    return node.kind == 'document'
  },
  validate: (document) => {
    const { nodes } = document
    const invalids = nodes.filter(n => n.kind != 'block')
    return invalids.size ? invalids : null
  },
  normalize: (transform, document, invalids) => {
    return invalids.reduce((t, n) => t.removeNodeByKey(n.key), transform)
  }
}

/**
 * Only allow block, inline and text nodes in blocks.
 *
 * @type {Object}
 */

const BLOCK_CHILDREN_RULE = {
  match: (node) => {
    return node.kind == 'block'
  },
  validate: (block) => {
    const { nodes } = block
    const invalids = nodes.filter(n => n.kind != 'block' && n.kind != 'inline' && n.kind != 'text')
    return invalids.size ? invalids : null
  },
  normalize: (transform, block, invalids) => {
    return invalids.reduce((t, n) => t.removeNodeByKey(n.key), transform)
  }
}

/**
 * Only allow inline and text nodes in inlines.
 *
 * @type {Object}
 */

const INLINE_CHILDREN_RULE = {
  match: (object) => {
    return object.kind == 'inline'
  },
  validate: (inline) => {
    const { nodes } = inline
    const invalids = nodes.filter(n => n.kind != 'inline' && n.kind != 'text')
    return invalids.size ? invalids : null
  },
  normalize: (transform, inline, invalids) => {
    return invalids.reduce((t, n) => t.removeNodeByKey(n.key), transform)
  }
}

/**
 * The default schema.
 *
 * @type {Object}
 */

const SCHEMA = {
  rules: [
    DOCUMENT_CHILDREN_RULE,
    BLOCK_CHILDREN_RULE,
    INLINE_CHILDREN_RULE,
  ]
}

/**
 * Normalize the state.
 *
 * @param {Transform} transform
 * @return {Transform}
 */

export function normalize(transform) {
  let { state } = transform
  let { document, selection } = state
  let failure

  // Normalize all of the document's nodes.
  document.filterDescendantsDeep((node) => {
    if (failure = node.validate(SCHEMA)) {
      const { value, rule } = failure
      rule.normalize(transform, node, value)
    }
  })

  // Normalize the document itself.
  if (failure = document.validate(SCHEMA)) {
    const { value, rule } = failure
    rule.normalize(transform, document, value)
  }

  // Normalize the selection.
  // TODO: turn this into schema rules.
  state = transform.state
  document = state.document
  let nextSelection = selection.normalize(document)
  if (!selection.equals(nextSelection)) transform.setSelection(selection)
  return transform
}

/**
 * Normalize the document.
 *
 * @param {Transform} transform
 * @return {Transform}
 */

export function normalizeDocument(transform) {
  let { state } = transform
  let { document } = state
  document = document.normalize()
  state = state.merge({ document })
  transform.state = state
  return transform
}

/**
 * Normalize the selection.
 *
 * @param {Transform} transform
 * @return {Transform}
 */

export function normalizeSelection(transform) {
  let { state } = transform
  let { document, selection } = state
  selection = selection.normalize(document)
  state = state.merge({ selection })
  transform.state = state
  return transform
}
