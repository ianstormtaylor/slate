
import Raw from './raw'
import React from 'react'
import ReactDOMServer from 'react-dom/server'
import typeOf from 'type-of'
import { Record } from 'immutable'

/**
 * String.
 *
 * @type {String}
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

    if (el.nodeName == '#text') {
      if (el.value && el.value.match(/<!--.*?-->/)) return

      return {
        kind: 'text',
        text: el.value || el.nodeValue
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
   *   @property {String|Object} defaultBlockType
   *   @property {Function} parseHtml
   */

  constructor(options = {}) {
    this.rules = [
      ...(options.rules || []),
      TEXT_RULE
    ]

    this.defaultBlockType = options.defaultBlockType || 'paragraph'

    // Set DOM parser function or fallback to native DOMParser if present.
    if (typeof options.parseHtml === 'function') {
      this.parseHtml = options.parseHtml
    } else if (typeof DOMParser !== 'undefined') {
      this.parseHtml = (html) => {
        const parsed = new DOMParser().parseFromString(html, 'text/html')
        // Unwrap from <html> and <body>
        return parsed.childNodes[0].childNodes[1]
      }
    } else {
      throw new Error(
        'Native DOMParser is not present in this environment; you must supply a parse function via options.parseHtml'
      )
    }
  }

  /**
   * Deserialize pasted HTML.
   *
   * @param {String} html
   * @param {Object} options
   *   @property {Boolean} toRaw
   * @return {State}
   */

  deserialize = (html, options = {}) => {
    const children = Array.from(this.parseHtml(html).childNodes)
    let nodes = this.deserializeElements(children)

    const { defaultBlockType } = this
    const defaults = typeof defaultBlockType == 'string'
      ? { type: defaultBlockType }
      : defaultBlockType

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
        nodes: [node],
        ...defaults
      }

      memo.push(block)
      return memo
    }, [])

    if (nodes.length === 0) {
      nodes = [{
        kind: 'block',
        nodes: [],
        ...defaults
      }]
    }

    const raw = {
      kind: 'state',
      document: {
        kind: 'document',
        nodes,
      }
    }

    if (options.toRaw) {
      return raw
    }

    const state = Raw.deserialize(raw, { terse: true })
    return state
  }

  /**
   * Deserialize an array of DOM elements.
   *
   * @param {Array} elements
   * @return {Array}
   */

  deserializeElements = (elements = []) => {
    let nodes = []

    elements.filter(this.cruftNewline).forEach((element) => {
      const node = this.deserializeElement(element)
      switch (typeOf(node)) {
        case 'array':
          nodes = nodes.concat(node)
          break
        case 'object':
          nodes.push(node)
          break
      }
    })

    return nodes
  }

  /**
   * Deserialize a DOM element.
   *
   * @param {Object} element
   * @return {Any}
   */

  deserializeElement = (element) => {
    let node

    if (!element.tagName) {
      element.tagName = ''
    }

    const next = (elements) => {
      if (typeof NodeList !== 'undefined' && elements instanceof NodeList) {
        elements = Array.from(elements)
      }
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

    for (let i = 0; i < this.rules.length; i++) {
      const rule = this.rules[i]
      if (!rule.deserialize) continue
      const ret = rule.deserialize(element, next)
      const type = typeOf(ret)

      if (type != 'array' && type != 'object' && type != 'null' && type != 'undefined') {
        throw new Error(`A rule returned an invalid deserialized representation: "${node}".`)
      }

      if (ret === undefined) continue
      if (ret === null) return null

      node = ret.kind == 'mark' ? this.deserializeMark(ret) : ret
      break
    }

    return node || next(element.childNodes)
  }

  /**
   * Deserialize a `mark` object.
   *
   * @param {Object} mark
   * @return {Array}
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
   * @return {String|Array}
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

    for (let i = 0; i < this.rules.length; i++) {
      const rule = this.rules[i]
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
      for (let i = 0; i < this.rules.length; i++) {
        const rule = this.rules[i]
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
    for (let i = 0; i < this.rules.length; i++) {
      const rule = this.rules[i]
      if (!rule.serialize) continue
      const ret = rule.serialize(string, string.text)
      if (ret) return ret
    }
  }

  /**
   * Filter out cruft newline nodes inserted by the DOM parser.
   *
   * @param {Object} element
   * @return {Boolean}
   */

  cruftNewline = (element) => {
    return !(element.nodeName == '#text' && element.value == '\n')
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
 *
 * @type {Html}
 */

export default Html
