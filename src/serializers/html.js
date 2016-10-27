
import Raw from './raw'
import React from 'react'
import ReactDOMServer from 'react-dom/server'
import cheerio from 'cheerio'
import typeOf from 'type-of'
import { Record } from 'immutable'

/**
 * String.
 */

const String = new Record({
  kind: 'string',
  text: ''
})

/**
 * A rule to (de)serialize text nodes. This is automatically added to the HTML
 * serializer so that users don't have to worry about text-level serialization.
 *
 * @type {Object}
 */

const TEXT_RULE = {

  deserialize(el) {
    if (el.tagName == 'br') {
      return {
        kind: 'text',
        text: '\n'
      }
    }

    if (el.type == 'text') {
      return {
        kind: 'text',
        text: el.data
      }
    }
  },

  serialize(obj, children) {
    if (obj.kind == 'string') {
      return children
        .split('\n')
        .reduce((array, text, i) => {
          if (i != 0) array.push(<br />)
          array.push(text)
          return array
        }, [])
    }
  }

}

/**
 * HTML serializer.
 *
 * @type {Html}
 */

class Html {

  /**
   * Create a new serializer with `rules`.
   *
   * @param {Object} options
   *   @property {Array} rules
   * @return {Html} serializer
   */

  constructor(options = {}) {
    this.rules = [
      ...(options.rules || []),
      TEXT_RULE
    ]
  }

  /**
   * Deserialize pasted HTML.
   *
   * @param {String} html
   * @return {State} state
   */

  deserialize = (html) => {
    const $ = cheerio.load(html).root()
    const children = $.children().toArray()
    let nodes = this.deserializeElements(children)

    // HACK: ensure for now that all top-level inline are wrapped into a block.
    nodes = nodes.reduce((memo, node, i, original) => {
      if (node.kind == 'block') {
        memo.push(node)
        return memo
      }

      if (i > 0 && original[i - 1].kind != 'block') {
        const block = memo[memo.length - 1]
        block.nodes.push(node)
        return memo
      }

      const block = {
        kind: 'block',
        type: 'paragraph',
        nodes: [node]
      }

      memo.push(block)
      return memo
    }, [])

    const state = Raw.deserialize({ nodes }, { terse: true })
    return state
  }

  /**
   * Deserialize an array of Cheerio `elements`.
   *
   * @param {Array} elements
   * @return {Array} nodes
   */

  deserializeElements = (elements = []) => {
    let nodes = []

    elements.forEach((element) => {
      const node = this.deserializeElement(element)
      switch (typeOf(node)) {
        case 'array':
          nodes = nodes.concat(node)
          break
        case 'object':
          nodes.push(node)
          break
        case 'null':
        case 'undefined':
          return
        default:
          throw new Error(`A rule returned an invalid deserialized representation: "${node}".`)
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

  deserializeElement = (element) => {
    let node

    const next = (elements) => {
      switch (typeOf(elements)) {
        case 'array':
          return this.deserializeElements(elements)
        case 'object':
          return this.deserializeElement(elements)
        case 'null':
        case 'undefined':
          return
        default:
          throw new Error(`The \`next\` argument was called with invalid children: "${elements}".`)
      }
    }

    for (const rule of this.rules) {
      if (!rule.deserialize) continue
      const ret = rule.deserialize(element, next)
      if (!ret) continue
      node = ret.kind == 'mark'
        ? this.deserializeMark(ret)
        : ret
    }

    return node || next(element.children)
  }

  /**
   * Deserialize a `mark` object.
   *
   * @param {Object} mark
   * @return {Array} nodes
   */

  deserializeMark = (mark) => {
    const { type, data } = mark

    const applyMark = (node) => {
      if (node.kind == 'mark') {
        return this.deserializeMark(node)
      }

      else if (node.kind == 'text') {
        if (!node.ranges) node.ranges = [{ text: node.text }]
        node.ranges = node.ranges.map((range) => {
          range.marks = range.marks || []
          range.marks.push({ type, data })
          return range
        })
      }

      else {
        node.nodes = node.nodes.map(applyMark)
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

  /**
   * Serialize a `state` object into an HTML string.
   *
   * @param {State} state
   * @param {Object} options
   *   @property {Boolean} render
   * @return {String|Array} html
   */

  serialize = (state, options = {}) => {
    const { document } = state
    const elements = document.nodes.map(this.serializeNode)
    if (options.render === false) return elements

    const html = ReactDOMServer.renderToStaticMarkup(<body>{elements}</body>)
    const inner = html.slice(6, -7)
    return inner
  }

  /**
   * Serialize a `node`.
   *
   * @param {Node} node
   * @return {String}
   */

  serializeNode = (node) => {
    if (node.kind == 'text') {
      const ranges = node.getRanges()
      return ranges.map(this.serializeRange)
    }

    const children = node.nodes.map(this.serializeNode)

    for (const rule of this.rules) {
      if (!rule.serialize) continue
      const ret = rule.serialize(node, children)
      if (ret) return addKey(ret)
    }

    throw new Error(`No serializer defined for node of type "${node.type}".`)
  }

  /**
   * Serialize a `range`.
   *
   * @param {Range} range
   * @return {String}
   */

  serializeRange = (range) => {
    const string = new String({ text: range.text })
    const text = this.serializeString(string)

    return range.marks.reduce((children, mark) => {
      for (const rule of this.rules) {
        if (!rule.serialize) continue
        const ret = rule.serialize(mark, children)
        if (ret) return addKey(ret)
      }

      throw new Error(`No serializer defined for mark of type "${mark.type}".`)
    }, text)
  }

  /**
   * Serialize a `string`.
   *
   * @param {String} string
   * @return {String}
   */

  serializeString = (string) => {
    for (const rule of this.rules) {
      if (!rule.serialize) continue
      const ret = rule.serialize(string, string.text)
      if (ret) return ret
    }
  }

}

/**
 * Add a unique key to a React `element`.
 *
 * @param {Element} element
 * @return {Element}
 */

let key = 0

function addKey(element) {
  return React.cloneElement(element, { key: key++ })
}

/**
 * Export.
 */

export default Html
