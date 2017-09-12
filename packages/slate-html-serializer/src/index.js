
import React from 'react'
import ReactDOMServer from 'react-dom/server'
import logger from 'slate-dev-logger'
import typeOf from 'type-of'
import { Node, State } from 'slate'
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
        ranges: [{ text: '\n' }],
      }
    }

    if (el.nodeName == '#text') {
      if (el.value && el.value.match(/<!--.*?-->/)) return

      return {
        kind: 'text',
        ranges: [{ text: el.value || el.nodeValue }],
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
 * A default `parseHtml` option using the native `DOMParser`.
 *
 * @param {String} html
 * @return {Object}
 */

function defaultParseHtml(html) {
  if (typeof DOMParser == 'undefined') {
    throw new Error('The native `DOMParser` global which the `Html` serializer uses by default is not present in this environment. You must supply the `options.parseHtml` function instead.')
  }

  const parsed = new DOMParser().parseFromString(html, 'text/html')
  // Unwrap from <html> and <body>.
  const fragment = parsed.childNodes[0].childNodes[1]
  return fragment
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
   *   @property {String|Object|Block} defaultBlock
   *   @property {Function} parseHtml
   */

  constructor(options = {}) {
    let {
      defaultBlock = 'paragraph',
      parseHtml = defaultParseHtml,
      rules = [],
    } = options

    if (options.defaultBlockType) {
      logger.deprecate('0.23.0', 'The `options.defaultBlockType` argument of the `Html` serializer is deprecated, use `options.defaultBlock` instead.')
      defaultBlock = options.defaultBlockType
    }

    defaultBlock = Node.createProperties(defaultBlock)

    this.rules = [ ...rules, TEXT_RULE ]
    this.defaultBlock = defaultBlock
    this.parseHtml = parseHtml
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
    let { toJSON = false } = options

    if (options.toRaw) {
      logger.deprecate('0.23.0', 'The `options.toRaw` argument of the `Html` serializer is deprecated, use `options.toJSON` instead.')
      toJSON = options.toRaw
    }

    const { defaultBlock, parseHtml } = this
    const fragment = parseHtml(html)
    const children = Array.from(fragment.childNodes)
    let nodes = this.deserializeElements(children)

    // COMPAT: ensure that all top-level inline nodes are wrapped into a block.
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
        data: {},
        isVoid: false,
        ...defaultBlock,
        nodes: [node],
      }

      memo.push(block)
      return memo
    }, [])

    // TODO: pretty sure this is no longer needed.
    if (nodes.length == 0) {
      nodes = [{
        kind: 'block',
        data: {},
        isVoid: false,
        ...defaultBlock,
        nodes: [
          {
            kind: 'text',
            ranges: [
              {
                kind: 'range',
                text: '',
                marks: [],
              }
            ]
          }
        ],
      }]
    }

    const json = {
      kind: 'state',
      document: {
        kind: 'document',
        data: {},
        nodes,
      }
    }

    const ret = toJSON ? json : State.fromJSON(json)
    return ret
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

      if (ret === undefined) {
        continue
      } else if (ret === null) {
        return null
      } else if (ret.kind == 'mark') {
        node = this.deserializeMark(ret)
      } else {
        node = ret
      }

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
