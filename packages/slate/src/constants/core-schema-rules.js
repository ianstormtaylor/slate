
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
      if (node.kind != 'document') return
      const invalids = node.nodes.filter(n => n.kind != 'block')
      if (!invalids.size) return

      return (change) => {
        console.log('Only allow block nodes in documents:')
        invalids.forEach((child) => {
          console.log(JSON.stringify(child))
          change.removeNodeByKey(child.key, { normalize: false })
        })
      }
    }
  },

  /**
   * Only allow block nodes or inline and text nodes in blocks.
   *
   * @type {Object}
   */

  {
    validateNode(node) {
      if (node.kind != 'block') return
      const first = node.nodes.first()
      if (!first) return
      const kinds = first.kind == 'block' ? ['block'] : ['inline', 'text']
      const invalids = node.nodes.filter(n => !kinds.includes(n.kind))
      if (!invalids.size) return

      return (change) => {
        console.log('Only allow block nodes or inline and text nodes in blocks:')
        invalids.forEach((child) => {
          console.log(JSON.stringify(child))
          change.removeNodeByKey(child.key, { normalize: false })
        })
      }
    }
  },

  /**
   * Only allow inline and text nodes in inlines.
   *
   * @type {Object}
   */

  {
    validateNode(node) {
      if (node.kind != 'inline') return
      const invalids = node.nodes.filter(n => n.kind != 'inline' && n.kind != 'text')
      if (!invalids.size) return

      return (change) => {
        console.log('Only allow inline and text nodes in inlines.')
        invalids.forEach((child) => {
          console.log(JSON.stringify(child))
          change.removeNodeByKey(child.key, { normalize: false })
        })
      }
    }
  },

  /**
   * Ensure that block and inline nodes have at least one text child.
   *
   * @type {Object}
   */

  {
    validateNode(node) {
      if (node.kind != 'block' && node.kind != 'inline') return
      if (node.nodes.size > 0) return

      return (change) => {
        // console.log('Ensure that block and inline nodes have at least one text child.');
        const text = Text.create()
        change.insertNodeByKey(node.key, 0, text, { normalize: false })
      }
    }
  },

  /**
   * Ensure that void nodes contain a text node with a single space of text.
   *
   * @type {Object}
   */

  {
    validateNode(node) {
      if (!node.isVoid) return
      if (node.kind != 'block' && node.kind != 'inline') return
      if (node.text == ' ' && node.nodes.size == 1) return

      return (change) => {

        const text = Text.create(' ')
        const index = node.nodes.size

        change.insertNodeByKey(node.key, index, text, { normalize: false })
        console.log('Ensure that void nodes contain a text node with a single space of text.')
        node.nodes.forEach((child) => {
          console.log(JSON.stringify(child))
          change.removeNodeByKey(child.key, { normalize: false })
        })
      }
    }
  },

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

  {
    validateNode(node) {
      if (node.kind != 'block') return
      const invalids = node.nodes.filter(n => n.kind == 'inline' && n.text == '')
      if (!invalids.size) return

      return (change) => {

        // If all of the block's nodes are invalid, insert an empty text node so
        // that the selection will be preserved when they are all removed.
        if (node.nodes.size == invalids.size) {
          const text = Text.create()
          change.insertNodeByKey(node.key, 1, text, { normalize: false })
        }

        console.log('Ensure that inline nodes are never empty.')
        invalids.forEach((child) => {
          console.log(JSON.stringify(child))
          change.removeNodeByKey(child.key, { normalize: false })
        })
      }
    }
  },

  /**
   * Ensure that inline void nodes are surrounded by text nodes, by adding extra
   * blank text nodes if necessary.
   *
   * @type {Object}
   */

  {
    validateNode(node) {
      if (node.kind != 'block' && node.kind != 'inline') return

      const invalids = node.nodes.reduce((list, child, index) => {
        if (child.kind !== 'inline') return list

        const prev = index > 0 ? node.nodes.get(index - 1) : null
        const next = node.nodes.get(index + 1)
        // We don't test if "prev" is inline, since it has already been processed in the loop
        const insertBefore = !prev
        const insertAfter = !next || (next.kind == 'inline')

        if (insertAfter || insertBefore) {
          list = list.push({ insertAfter, insertBefore, index })
        }

        return list
      }, new List())

      if (!invalids.size) return

      return (change) => {

        // Shift for every text node inserted previously.
        let shift = 0

        // console.log('Ensure that inline void nodes are surrounded by text nodes, by adding extrablank text nodes if necessary.')
        invalids.forEach(({ index, insertAfter, insertBefore }) => {
          if (insertBefore) {
            change.insertNodeByKey(node.key, shift + index, Text.create(), { normalize: false })
            shift++
          }

          if (insertAfter) {
            change.insertNodeByKey(node.key, shift + index + 1, Text.create(), { normalize: false })
            shift++
          }
        })
      }
    }
  },

  /**
   * Merge adjacent text nodes.
   *
   * @type {Object}
   */

  {
    validateNode(node) {
      if (node.kind != 'block' && node.kind != 'inline') return

      const invalids = node.nodes
        .map((child, i) => {
          const next = node.nodes.get(i + 1)
          if (child.kind != 'text') return
          if (!next || next.kind != 'text') return
          return next
        })
        .filter(Boolean)

      if (!invalids.size) return

      return (change) => {
        // console.log('Merge adjacent text nodes.');
        // Reverse the list to handle consecutive merges, since the earlier nodes
        // will always exist after each merge.
        invalids.reverse().forEach((n) => {
          change.mergeNodeByKey(n.key, { normalize: false })
        })
      }
    }
  },

  /**
   * Prevent extra empty text nodes, except when adjacent to inline void nodes.
   *
   * @type {Object}
   */

  {
    validateNode(node) {
      if (node.kind != 'block' && node.kind != 'inline') return
      const { nodes } = node
      if (nodes.size <= 1) return

      const invalids = nodes.filter((desc, i) => {
        if (desc.kind != 'text') return
        if (desc.text.length > 0) return

        const prev = i > 0 ? nodes.get(i - 1) : null
        const next = nodes.get(i + 1)

        // If it's the first node, and the next is a void, preserve it.
        if (!prev && next.kind == 'inline') return

        // It it's the last node, and the previous is an inline, preserve it.
        if (!next && prev.kind == 'inline') return

        // If it's surrounded by inlines, preserve it.
        if (next && prev && next.kind == 'inline' && prev.kind == 'inline') return

        // Otherwise, remove it.
        return true
      })

      if (!invalids.size) return

      return (change) => {
        console.log('Prevent extra empty text nodes, except when adjacent to inline void nodes:')
        invalids.forEach((text) => {
          console.log(JSON.stringify(child))
          change.removeNodeByKey(text.key, { normalize: false })
        })
      }
    }
  }

]

/**
 * Export.
 *
 * @type {Array}
 */

export default CORE_SCHEMA_RULES
