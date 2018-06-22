import { List } from 'immutable'

import Text from '../models/text'

/**
 * Define the core schema rules, order-sensitive.
 *
 * @type {Array}
 */

const CORE_SCHEMA_RULES = [
  /**
   * Only allow block nodes in documents.
   *
   * @type {Object}
   */

  {
    validateNode(node) {
      if (node.object != 'document') return
      const invalids = node.nodes.filter(n => n.object != 'block')
      if (!invalids.size) return

      return change => {
        invalids.forEach(child => {
          change.removeNodeByKey(child.key, { normalize: false })
        })
      }
    },
  },

  /**
   * Only allow block nodes or inline and text nodes in blocks.
   *
   * @type {Object}
   */

  {
    validateNode(node) {
      if (node.object != 'block') return
      const first = node.nodes.first()
      if (!first) return
      const objects = first.object == 'block' ? ['block'] : ['inline', 'text']
      const invalids = node.nodes.filter(n => !objects.includes(n.object))
      if (!invalids.size) return

      return change => {
        invalids.forEach(child => {
          change.removeNodeByKey(child.key, { normalize: false })
        })
      }
    },
  },

  /**
   * Only allow inline and text nodes in inlines.
   *
   * @type {Object}
   */

  {
    validateNode(node) {
      if (node.object != 'inline') return
      const invalids = node.nodes.filter(
        n => n.object != 'inline' && n.object != 'text'
      )
      if (!invalids.size) return

      return change => {
        invalids.forEach(child => {
          change.removeNodeByKey(child.key, { normalize: false })
        })
      }
    },
  },

  /**
   * Ensure that block and inline nodes have at least one text child.
   *
   * @type {Object}
   */

  {
    validateNode(node) {
      if (node.object != 'block' && node.object != 'inline') return
      if (node.nodes.size > 0) return

      return change => {
        const text = Text.create()
        change.insertNodeByKey(node.key, 0, text, { normalize: false })
      }
    },
  },

  /**
   * Ensure that inline non-void nodes are never empty.
   *
   * This rule is applied to all blocks and inlines, because when they contain an empty
   * inline, we need to remove the empty inline from that parent node. If `validate`
   * was to be memoized, it should be against the parent node, not the empty inline itself.
   *
   * @type {Object}
   */

  {
    validateNode(node) {
      if (node.object != 'inline' && node.object != 'block') return

      const invalids = node.nodes.filter(
        child => child.object === 'inline' && child.isEmpty
      )

      if (!invalids.size) return

      return change => {
        // If all of the block's nodes are invalid, insert an empty text node so
        // that the selection will be preserved when they are all removed.
        if (node.nodes.size == invalids.size) {
          const text = Text.create()
          change.insertNodeByKey(node.key, 1, text, { normalize: false })
        }

        invalids.forEach(child => {
          change.removeNodeByKey(child.key, { normalize: false })
        })
      }
    },
  },

  /**
   * Ensure that inline void nodes are surrounded by text nodes, by adding extra
   * blank text nodes if necessary.
   *
   * @type {Object}
   */

  {
    validateNode(node) {
      if (node.object != 'block' && node.object != 'inline') return

      const invalids = node.nodes.reduce((list, child, index) => {
        if (child.object !== 'inline') return list

        const prev = index > 0 ? node.nodes.get(index - 1) : null
        const next = node.nodes.get(index + 1)

        // We don't test if "prev" is inline, since it has already been
        // processed in the loop
        const insertBefore = !prev
        const insertAfter = !next || next.object == 'inline'

        if (insertAfter || insertBefore) {
          list = list.push({ insertAfter, insertBefore, index })
        }

        return list
      }, new List())

      if (!invalids.size) return

      return change => {
        // Shift for every text node inserted previously.
        let shift = 0

        invalids.forEach(({ index, insertAfter, insertBefore }) => {
          if (insertBefore) {
            change.insertNodeByKey(node.key, shift + index, Text.create(), {
              normalize: false,
            })

            shift++
          }

          if (insertAfter) {
            change.insertNodeByKey(node.key, shift + index + 1, Text.create(), {
              normalize: false,
            })

            shift++
          }
        })
      }
    },
  },

  /**
   * Merge adjacent text nodes.
   *
   * @type {Object}
   */

  {
    validateNode(node) {
      if (node.object != 'block' && node.object != 'inline') return

      const invalids = node.nodes
        .map((child, i) => {
          const next = node.nodes.get(i + 1)
          if (child.object != 'text') return
          if (!next || next.object != 'text') return
          return next
        })
        .filter(Boolean)

      if (!invalids.size) return

      return change => {
        // Reverse the list to handle consecutive merges, since the earlier nodes
        // will always exist after each merge.
        invalids.reverse().forEach(n => {
          change.mergeNodeByKey(n.key, { normalize: false })
        })
      }
    },
  },

  /**
   * Prevent extra empty text nodes, except when adjacent to inline void nodes.
   *
   * @type {Object}
   */

  {
    validateNode(node) {
      if (node.object != 'block' && node.object != 'inline') return
      const { nodes } = node
      if (nodes.size <= 1) return

      const invalids = nodes.filter((desc, i) => {
        if (desc.object != 'text') return
        if (desc.text.length > 0) return

        const prev = i > 0 ? nodes.get(i - 1) : null
        const next = nodes.get(i + 1)

        // If it's the first node, and the next is a void, preserve it.
        if (!prev && next.object == 'inline') return

        // It it's the last node, and the previous is an inline, preserve it.
        if (!next && prev.object == 'inline') return

        // If it's surrounded by inlines, preserve it.
        if (next && prev && next.object == 'inline' && prev.object == 'inline')
          return

        // Otherwise, remove it.
        return true
      })

      if (!invalids.size) return

      return change => {
        invalids.forEach(text => {
          change.removeNodeByKey(text.key, { normalize: false })
        })
      }
    },
  },
]

/**
 * Export.
 *
 * @type {Array}
 */

export default CORE_SCHEMA_RULES
