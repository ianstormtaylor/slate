
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
    const invalids = document.nodes.filter(n => n.kind != 'block')
    return invalids.size ? invalids : null
  },
  normalize: (transform, document, invalids) => {
    invalids.forEach((node) => {
      transform.removeNodeByKey(node.key, OPTS)
    })
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
    const invalids = block.nodes.filter((n) => {
      return n.kind != 'block' && n.kind != 'inline' && n.kind != 'text'
    })

    return invalids.size ? invalids : null
  },
  normalize: (transform, block, invalids) => {
    invalids.forEach((node) => {
      transform.removeNodeByKey(node.key, OPTS)
    })
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
    return node.nodes.size == 0
  },
  normalize: (transform, node) => {
    const text = Text.create()
    transform.insertNodeByKey(node.key, 0, text, OPTS)
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
    const invalids = inline.nodes.filter(n => n.kind != 'inline' && n.kind != 'text')
    return invalids.size ? invalids : null
  },
  normalize: (transform, inline, invalids) => {
    invalids.forEach((node) => {
      transform.removeNodeByKey(node.key, OPTS)
    })
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
    const invalids = block.nodes.filter(n => n.kind == 'inline' && n.text == '')
    return invalids.size ? invalids : null
  },
  normalize: (transform, block, invalids) => {
    // If all of the block's nodes are invalid, insert an empty text node so
    // that the selection will be preserved when they are all removed.
    if (block.nodes.size == invalids.size) {
      const text = Text.create()
      transform.insertNodeByKey(block.key, 1, text, OPTS)
    }

    invalids.forEach((node) => {
      transform.removeNodeByKey(node.key, OPTS)
    })
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
    return node.text !== ' ' || node.nodes.size !== 1
  },
  normalize: (transform, node, result) => {
    const text = Text.createFromString(' ')
    const index = node.nodes.size

    transform.insertNodeByKey(node.key, index, text, OPTS)

    node.nodes.forEach(child => {
      transform.removeNodeByKey(child.key, OPTS)
    })
  }
}

/**
 * Ensure that inline void nodes are surrounded by text nodes, by adding extra
 * blank text nodes if necessary.
 *
 * @type {Object}
 */

const INLINE_VOID_TEXTS_AROUND_RULE = {
  match: (object) => {
    return object.kind == 'block' || object.kind == 'inline'
  },
  validate: (block) => {
    const invalids = block.nodes.reduce((list, child, index) => {
      if (child.kind == 'block') return list
      if (!child.isVoid) return list

      const prev = index > 0 ? block.nodes.get(index - 1) : null
      const next = block.nodes.get(index + 1)
      const insertBefore = !prev
      const insertAfter = !next || isInlineVoid(next)

      if (insertAfter || insertBefore) {
        list = list.push({ insertAfter, insertBefore, index })
      }

      return list
    }, new List())

    return invalids.size ? invalids : null
  },
  normalize: (transform, block, invalids) => {
    // Shift for every text node inserted previously.
    let shift = 0

    invalids.forEach(({ index, insertAfter, insertBefore }) => {
      if (insertBefore) {
        transform.insertNodeByKey(block.key, shift + index, Text.create(), OPTS)
        shift++
      }

      if (insertAfter) {
        transform.insertNodeByKey(block.key, shift + index + 1, Text.create(), OPTS)
        shift++
      }
    })
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
    const invalids = node.nodes
      .map((child, i) => {
        const next = node.nodes.get(i + 1)
        if (child.kind != 'text') return
        if (!next || next.kind != 'text') return
        return [child, next]
      })
      .filter(Boolean)

    return invalids.size ? invalids : null
  },
  normalize: (transform, node, pairs) => {
    // We reverse the list to handle consecutive joins, since the earlier nodes
    // will always exist after each join.
    pairs.reverse().forEach((pair) => {
      const [ first, second ] = pair
      return transform.joinNodeByKey(second.key, first.key, OPTS)
    })
  }
}

/**
 * Prevent extra empty text nodes, except when adjacent to inline void nodes.
 *
 * @type {Object}
 */

const NO_EMPTY_TEXT_RULE = {
  match: (object) => {
    return object.kind == 'block' || object.kind == 'inline'
  },
  validate: (node) => {
    const { nodes } = node
    if (nodes.size <= 1) return

    const invalids = nodes.filter((desc, i) => {
      if (desc.kind != 'text') return
      if (desc.length > 0) return

      const prev = i > 0 ? nodes.get(i - 1) : null
      const next = nodes.get(i + 1)

      // If it's the first node, and the next is a void, preserve it.
      if (!prev && isInlineVoid(next)) return

      // It it's the last node, and the previous is a void, preserve it.
      if (!next && isInlineVoid(prev)) return

      // If it's surrounded by voids, preserve it.
      if (next && prev && isInlineVoid(next) && isInlineVoid(prev)) return

      // Otherwise, remove it.
      return true
    })

    return invalids.size ? invalids : null
  },
  normalize: (transform, node, invalids) => {
    invalids.forEach((text) => {
      transform.removeNodeByKey(text.key, OPTS)
    })
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
