import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import typeOf from 'type-of'
import { Node, Value } from 'slate'
import { Record } from 'immutable'

/**
 * String.
 *
 * @type {String}
 */

const String = new Record({
  object: 'string',
  text: '',
})

/**
 * A rule to (de)serialize text nodes. This is automatically added to the HTML
 * serializer so that users don't have to worry about text-level serialization.
 *
 * @type {Object}
 */

const TEXT_RULE = {
  deserialize(el) {
    if (el.tagName && el.tagName.toLowerCase() === 'br') {
      return {
        object: 'text',
        leaves: [
          {
            object: 'leaf',
            text: '\n',
          },
        ],
      }
    }

    if (el.nodeName == '#text') {
      if (el.nodeValue && el.nodeValue.match(/<!--.*?-->/)) return

      return {
        object: 'text',
        leaves: [
          {
            object: 'leaf',
            text: el.nodeValue,
          },
        ],
      }
    }
  },

  serialize(obj, children) {
    if (obj.object === 'string') {
      return children.split('\n').reduce((array, text, i) => {
        if (i != 0) array.push(<br key={i} />)
        array.push(text)
        return array
      }, [])
    }
  },
}

/**
 * A default `parseHtml` function that returns the `<body>` using `DOMParser`.
 *
 * @param {String} html
 * @return {Object}
 */

function defaultParseHtml(html) {
  if (typeof DOMParser === 'undefined') {
    throw new Error(
      'The native `DOMParser` global which the `Html` serializer uses by default is not present in this environment. You must supply the `options.parseHtml` function instead.'
    )
  }

  const parsed = new DOMParser().parseFromString(html, 'text/html')
  const { body } = parsed
  // COMPAT: in IE 11 body is null if html is an empty string
  return body || window.document.createElement('body')
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

    defaultBlock = Node.createProperties(defaultBlock)

    this.rules = [...rules, TEXT_RULE]
    this.defaultBlock = defaultBlock
    this.parseHtml = parseHtml
  }

  /**
   * Deserialize pasted HTML.
   *
   * @param {String} html
   * @param {Object} options
   *   @property {Boolean} toRaw
   * @return {Value}
   */

  deserialize = (html, options = {}) => {
    const { toJSON = false } = options
    const { defaultBlock, parseHtml } = this
    const fragment = parseHtml(html)
    const children = Array.from(fragment.childNodes)
    let nodes = this.deserializeElements(children)

    // COMPAT: ensure that all top-level inline nodes are wrapped into a block.
    nodes = nodes.reduce((memo, node, i, original) => {
      if (node.object == 'block') {
        memo.push(node)
        return memo
      }

      if (i > 0 && original[i - 1].object != 'block') {
        const block = memo[memo.length - 1]
        block.nodes.push(node)
        return memo
      }

      const block = {
        object: 'block',
        data: {},
        ...defaultBlock,
        nodes: [node],
      }

      memo.push(block)
      return memo
    }, [])

    // TODO: pretty sure this is no longer needed.
    if (nodes.length == 0) {
      nodes = [
        {
          object: 'block',
          data: {},
          ...defaultBlock,
          nodes: [
            {
              object: 'text',
              leaves: [
                {
                  object: 'leaf',
                  text: '',
                  marks: [],
                },
              ],
            },
          ],
        },
      ]
    }

    const json = {
      object: 'value',
      document: {
        object: 'document',
        data: {},
        nodes,
      },
    }

    const ret = toJSON ? json : Value.fromJSON(json)
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

    elements.filter(this.cruftNewline).forEach(element => {
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

  deserializeElement = element => {
    let node

    if (!element.tagName) {
      element.tagName = ''
    }

    const next = elements => {
      if (Object.prototype.toString.call(elements) == '[object NodeList]') {
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
          throw new Error(
            `The \`next\` argument was called with invalid children: "${elements}".`
          )
      }
    }

    for (const rule of this.rules) {
      if (!rule.deserialize) continue
      const ret = rule.deserialize(element, next)
      const type = typeOf(ret)

      if (
        type != 'array' &&
        type != 'object' &&
        type != 'null' &&
        type != 'undefined'
      ) {
        throw new Error(
          `A rule returned an invalid deserialized representation: "${node}".`
        )
      }

      if (ret === undefined) {
        continue
      } else if (ret === null) {
        return null
      } else if (ret.object == 'mark') {
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

  deserializeMark = mark => {
    const { type, data } = mark

    const applyMark = node => {
      if (node.object == 'mark') {
        return this.deserializeMark(node)
      } else if (node.object == 'text') {
        node.leaves = node.leaves.map(leaf => {
          leaf.marks = leaf.marks || []
          leaf.marks.push({ type, data })
          return leaf
        })
      } else if (node.nodes) {
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
   * Serialize a `value` object into an HTML string.
   *
   * @param {Value} value
   * @param {Object} options
   *   @property {Boolean} render
   * @return {String|Array}
   */

  serialize = (value, options = {}) => {
    const { document } = value
    const elements = document.nodes.map(this.serializeNode).filter(el => el)
    if (options.render === false) return elements

    const html = renderToStaticMarkup(<body>{elements}</body>)
    const inner = html.slice(6, -7)
    return inner
  }

  /**
   * Serialize a `node`.
   *
   * @param {Node} node
   * @return {String}
   */

  serializeNode = node => {
    if (node.object === 'text') {
      const leaves = node.getLeaves()
      return leaves.map(this.serializeLeaf)
    }

    const children = node.nodes.map(this.serializeNode)

    for (const rule of this.rules) {
      if (!rule.serialize) continue
      const ret = rule.serialize(node, children)
      if (ret === null) return
      if (ret) return addKey(ret)
    }

    throw new Error(`No serializer defined for node of type "${node.type}".`)
  }

  /**
   * Serialize a `leaf`.
   *
   * @param {Leaf} leaf
   * @return {String}
   */

  serializeLeaf = leaf => {
    const string = new String({ text: leaf.text })
    const text = this.serializeString(string)

    return leaf.marks.reduce((children, mark) => {
      for (const rule of this.rules) {
        if (!rule.serialize) continue
        const ret = rule.serialize(mark, children)
        if (ret === null) return
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

  serializeString = string => {
    for (const rule of this.rules) {
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

  cruftNewline = element => {
    return !(element.nodeName === '#text' && element.nodeValue == '\n')
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
