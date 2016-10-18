import Schema from '../models/schema'

/*
    This module contains the default schema to normalize documents
 */


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
 * A default schema rule to have at least one text node in blocks
 *
 * @type {Object}
 */

const MIN_TEXT_RULE = {
    match: (object) => {
      return object.kind == 'block' || object.kind == 'inline'
    },
    validate: (node) => {
      const { nodes } = node
      return nodes.size === 0 ? true : null
    },
    normalize: (transform, node) => {
      return transform.insertTextByKey(node.key, 0, '')
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
 * Join adjacent text nodes.
 *
 * @type {Object}
 */

const NO_ADJACENT_TEXT_RULE = {
  match: (object) => {
    return object.kind == 'block' || object.kind == 'inline'
  },
  validate: (node) => {
    const { nodes } = node
    const invalids = nodes
      .filter((n, i) => {
        const next = nodes.get(i + 1)
        return n.kind == 'text' && next && next.kind == 'text'
      })
      .map((n, i) => {
        const next = nodes.get(i + 1)
        return [n, next]
      })

    return invalids.size ? invalids : null
  },
  normalize: (transform, node, pairs) => {
    return pairs.reduce((t, pair) => {
      const [ first, second ] = pair
      return t.joinNodeByKey(first.key, second.key)
    })
  }
}

/**
 * The default schema.
 *
 * @type {Object}
 */

const schema = Schema.create({
  rules: [
    DOCUMENT_CHILDREN_RULE,
    BLOCK_CHILDREN_RULE,
    MIN_TEXT_RULE,
    INLINE_CHILDREN_RULE,
    NO_ADJACENT_TEXT_RULE
  ]
})

export default schema
