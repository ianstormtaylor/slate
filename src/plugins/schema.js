
/**
 * A default schema rule to only allow block nodes in documents.
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
 * A default schema rule to only allow block, inline and text nodes in blocks.
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
 * A default schema rule to only allow inline and text nodes in inlines.
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

const schema = {
  rules: [
    DOCUMENT_CHILDREN_RULE,
    BLOCK_CHILDREN_RULE,
    INLINE_CHILDREN_RULE,
  ]
}

export default schema
