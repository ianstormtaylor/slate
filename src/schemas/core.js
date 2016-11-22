
import Schema from '../models/schema'
import Text from '../models/text'
import { List } from 'immutable'

/**
 * Options object with normalize set to `false`.
 *
 * @type {Object}
 */

const OPTS = { normalize: false }

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
    return invalids.reduce((t, n) => t.removeNodeByKey(n.key, OPTS), transform)
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
    return invalids.reduce((t, n) => t.removeNodeByKey(n.key, OPTS), transform)
  }
}

/**
 * Ensure that block and inline nodes have at least one text child.
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
    const text = Text.create()
    return transform.insertNodeByKey(node.key, 0, text, OPTS)
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
    return invalids.reduce((t, n) => t.removeNodeByKey(n.key, OPTS), transform)
  }
}

/**
 * Ensure that inline nodes are never empty.
 *
 * This rule is applied to all blocks, because when they contain an empty
 * inline, we need to remove the inline from that parent block. If `validate`
 * was to be memoized, it should be against the parent node, not the inline
 * themselves.
 *
 * @type {Object}
 */

const INLINE_NO_EMPTY = {
  match: (object) => {
    return object.kind == 'block'
  },
  validate: (block) => {
    return block.nodes.some((child) => {
      return child.kind == 'inline' && child.text == ''
    })
  },
  normalize: (transform, block) => {
    return block.nodes.reduce((tr, child, index) => {
      if (child.kind == 'inline' && child.text == '') {
        return transform
          .removeNodeByKey(child.key, OPTS)
          .insertNodeByKey(block.key, index, Text.createFromString(''), OPTS)
      } else {
        return tr
      }
    }, transform)
  }
}

/**
 * Ensure that void nodes contain a text node with a single space of text.
 *
 * @type {Object}
 */

const VOID_TEXT_RULE = {
  match: (object) => {
    return (
      (object.kind == 'inline' || object.kind == 'block') &&
      (object.isVoid)
    )
  },
  validate: (node) => {
    return (
      node.text !== ' ' ||
      node.nodes.size !== 1
    )
  },
  normalize: (transform, node, result) => {
    const text = Text.createFromString(' ')
    const index = node.nodes.size

    transform.insertNodeByKey(node.key, index, text, OPTS)

    node.nodes.forEach((child) => {
      transform.removeNodeByKey(child.key, OPTS)
    })

    return transform
  }
}

/**
 * Ensure that inline void nodes are surrounded with text nodes.
 *
 * @type {Object}
 */

const INLINE_VOID_TEXTS_AROUND_RULE = {
  match: (object) => {
    return object.kind == 'block' || object.kind == 'inline'
  },
  validate: (block) => {
    const invalids = block.nodes.reduce((accu, child, index) => {
      if (child.kind === 'block' || !child.isVoid) {
        return accu
      }

      const prevNode = index > 0 ? block.nodes.get(index - 1) : null
      const nextNode = block.nodes.get(index + 1)

      const prev = !prevNode
      const next = (!nextNode || isInlineVoid(nextNode))

      if (next || prev) {
        return accu.push({ next, prev, index })
      } else {
        return accu
      }
    }, new List())

    return !invalids.isEmpty() ? invalids : null
  },
  normalize: (transform, block, invalids) => {
    // Shift for every text node inserted previously
    let shift = 0

    return invalids.reduce((t, { index, next, prev }) => {
      if (prev) {
        t = t.insertNodeByKey(block.key, shift + index, Text.create(), OPTS)
        shift = shift + 1
      }
      if (next) {
        t = t.insertNodeByKey(block.key, shift + index + 1, Text.create(), OPTS)
        shift = shift + 1
      }

      return t
    }, transform)
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
      .map((child, i) => {
        const next = nodes.get(i + 1)
        if (child.kind !== 'text' || !next || next.kind !== 'text') {
          return
        }

        return [child, next]
      })
      .filter(Boolean)

    return invalids.size ? invalids : null
  },
  normalize: (transform, node, pairs) => {
    return pairs
      // We reverse the list since we want to handle 3 consecutive text nodes.
      .reverse()
      .reduce((t, pair) => {
        const [ first, second ] = pair
        return t.joinNodeByKey(second.key, first.key, OPTS)
      }, transform)
  }
}

/**
 * Prevent extra empty text nodes.
 *
 * @type {Object}
 */

const NO_EMPTY_TEXT_RULE = {
  match: (object) => {
    return object.kind == 'block' || object.kind == 'inline'
  },
  validate: (node) => {
    const { nodes } = node

    if (nodes.size <= 1) {
      return
    }

    const invalids = nodes.filter((desc, i) => {
      if (desc.kind != 'text' || desc.length > 0) {
        return
      }

      // Empty text nodes are only allowed near inline void node.
      const next = nodes.get(i + 1)
      const prev = i > 0 ? nodes.get(i - 1) : null

      // If last one and previous is an inline void, we need to preserve it.
      if (!next && isInlineVoid(prev)) {
        return
      }

      // If first one and next one is an inline, we preserve it.
      if (!prev && isInlineVoid(next)) {
        return
      }

      // If surrounded by inline void, we preserve it.
      if (next && prev && isInlineVoid(next) && isInlineVoid(prev)) {
        return
      }

      // Otherwise we remove it.
      return true
    })

    return invalids.size ? invalids : null
  },
  normalize: (transform, node, invalids) => {
    return invalids.reduce((t, text) => {
      return t.removeNodeByKey(text.key, OPTS)
    }, transform)
  }
}

/**
 * Test if a `node` is an inline void node.
 *
 * @param {Node} node
 * @return {Boolean}
 */

function isInlineVoid(node) {
  return (node.kind == 'inline' && node.isVoid)
}

/**
 * The core schema.
 *
 * @type {Schema}
 */

const SCHEMA = Schema.create({
  rules: [
    DOCUMENT_CHILDREN_RULE,
    BLOCK_CHILDREN_RULE,
    INLINE_CHILDREN_RULE,
    VOID_TEXT_RULE,
    MIN_TEXT_RULE,
    INLINE_NO_EMPTY,
    INLINE_VOID_TEXTS_AROUND_RULE,
    NO_ADJACENT_TEXT_RULE,
    NO_EMPTY_TEXT_RULE
  ]
})

/**
 * Export.
 *
 * @type {Schema}
 */

export default SCHEMA
