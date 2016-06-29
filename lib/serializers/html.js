
import Block from '../models/block'
import Document from '../models/document'
import Inline from '../models/inline'
import Mark from '../models/mark'
import Raw from './raw'
import State from '../models/state'
import Text from '../models/text'
import cheerio from 'cheerio'

/**
 * A rule to serialize text nodes.
 */

const TEXT_RULE = {
  deserialize(el) {
    if (el.type != 'text') return
    return {
      kind: 'text',
      ranges: [
        {
          text: el.data
        }
      ]
    }
  }
}

/**
 * A rule to serialize <br> nodes.
 */

const BR_RULE = {
  deserialize(el) {
    if (el.tagName != 'br') return
    return {
      kind: 'text',
      ranges: [
        {
          text: '\n'
        }
      ]
    }
  }
}

/**
 * HTML serializer.
 */

class Html {

  /**
   * Create a new serializer with `rules`.
   *
   * @param {Array} rules
   * @return {Html} serializer
   */

  constructor(rules = []) {
    this.rules = [
      ...rules,
      TEXT_RULE,
      BR_RULE
    ]
  }

  /**
   * Deserialize pasted HTML.
   *
   * @param {String} html
   * @return {State} state
   */

  deserialize(html) {
    const $ = cheerio.load(html).root()
    const children = $.children().toArray()
    let nodes = this.deserializeElements(children)

    // HACK: ensure for now that all top-level inline are wrapping into a block.
    nodes = nodes.reduce((nodes, node, i, original) => {
      if (node.kind == 'block') {
        nodes.push(node)
        return nodes
      }

      if (i > 0 && original[i - 1].kind != 'block') {
        const block = nodes[nodes.length - 1]
        block.nodes.push(node)
        return nodes
      }

      const block = {
        kind: 'block',
        type: 'paragraph',
        nodes: [node]
      }

      nodes.push(block)
      return nodes
    }, [])

    const state = Raw.deserialize({ nodes })
    return state
  }

  /**
   * Deserialize an array of Cheerio `elements`.
   *
   * @param {Array} elements
   * @return {Array} nodes
   */

  deserializeElements(elements = []) {
    let nodes = []

    elements.forEach((element) => {
      const node = this.deserializeElement(element)
      if (!node) return
      if (Array.isArray(node)) {
        nodes = nodes.concat(node)
      } else {
        nodes.push(node)
      }
    })

    return nodes
  }

  /**
   * Deserialize a Cheerio `element`.
   *
   * @param {Object} element
   * @return {Mixed} node
   */

  deserializeElement(element) {
    let node

    const next = (elements) => {
      return Array.isArray(elements)
        ? this.deserializeElements(elements)
        : this.deserializeElement(elements)
    }

    for (const rule of this.rules) {
      const ret = rule.deserialize(element, next)
      if (!ret) continue
      node = ret.kind == 'mark'
        ? this.deserializeMark(ret)
        : ret
    }

    return node
      ? node
      : next(element.children)
  }

  /**
   * Deserialize a `mark` object.
   *
   * @param {Object} mark
   * @return {Array} nodes
   */

  deserializeMark(mark) {
    const { type, data } = mark

    const applyMark = (node) => {
      if (node.kind == 'mark') return this.deserializeMark(node)

      if (node.kind != 'text') {
        node.nodes = node.nodes.map(applyMark)
      } else {
        node.ranges = node.ranges.map((range) => {
          range.marks = range.marks || []
          range.marks.push({ type, data })
          return range
        })
      }

      return node
    }

    return mark.nodes.reduce((nodes, node) => {
      const ret = applyMark(node)
      if (Array.isArray(ret)) return nodes.concat(ret)
      nodes.push(ret)
      return nodes
    }, [])
  }

}

/**
 * Export.
 */

export default Html
