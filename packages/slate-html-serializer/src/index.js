import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import typeOf from 'type-of'
import { Node, Value, Annotation, Point, PathUtils } from 'slate'
import { List, Map, Record } from 'immutable'

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
        text: '\n',
        marks: [],
      }
    }

    if (el.nodeName === '#text') {
      if (el.nodeValue && el.nodeValue.match(/<!--.*?-->/)) return

      return {
        object: 'text',
        text: el.nodeValue,
        marks: [],
      }
    }
  },

  serialize(obj, children) {
    if (obj.object === 'string') {
      return children.split('\n').reduce((array, text, i) => {
        if (i !== 0) array.push(<br key={i} />)
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
  if (typeof DOMParser == 'undefined') {
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
    this.annotations = Map()
    this.nodeToAnnotationsMap = Map()
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
      if (node.object === 'block') {
        memo.push(node)
        return memo
      }

      if (i > 0 && original[i - 1].object !== 'block') {
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
    if (nodes.length === 0) {
      nodes = [
        {
          object: 'block',
          data: {},
          ...defaultBlock,
          nodes: [
            {
              object: 'text',
              text: '',
              marks: [],
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

    this.annotations = this.updateAnnotationPaths(
      nodes,
      List(),
      this.annotations
    )

    if (!this.annotations.isEmpty()) {
      json.annotations = this.annotations.toJSON()
    }

    this.annotations = this.annotations.clear()
    this.nodeToAnnotationsMap = this.nodeToAnnotationsMap.clear()

    const ret = toJSON ? json : Value.fromJSON(json)
    return ret
  }

  /**
   * Updates annotations found during deserialization to point to
   * paths in the document.
   *
   * @param {List} nodes
   * @param {List} path
   * @param {Object} annotations
   * @return {Object}
   */

  updateAnnotationPaths(nodes, path, annotations) {
    nodes.forEach((node, index) => {
      const newPath = path.concat(index)
      const annotationKeys = this.nodeToAnnotationsMap.get(node)

      if (annotationKeys) {
        annotationKeys.forEach(key => {
          annotations = annotations.set(
            key,
            this.expandAnnotationRange(
              annotations.get(key),
              newPath,
              node.text.length
            )
          )
        })
      }

      if (node.nodes) {
        annotations = this.updateAnnotationPaths(
          node.nodes,
          newPath,
          annotations
        )
      }
    })

    return annotations
  }

  /**
   * Expands an annotation's range to overlap the node at a `path`.
   *
   * @param {Object} annotation
   * @param {List} path
   * @param {Number} length
   * @return {Object}
   */

  expandAnnotationRange(annotation, path, length) {
    if (
      !annotation.anchor.path ||
      PathUtils.compare(path, annotation.anchor.path) < 0
    ) {
      annotation = annotation.setAnchor(
        Point.create({
          path,
          offset: 0,
        })
      )
    }

    if (
      !annotation.focus.path ||
      PathUtils.compare(path, annotation.focus.path) > 0 ||
      (PathUtils.compare(path, annotation.focus.path) === 0 &&
        length > annotation.focus.offset)
    ) {
      annotation = annotation.setFocus(
        Point.create({
          path,
          offset: length,
        })
      )
    }

    return annotation
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
      if (Object.prototype.toString.call(elements) === '[object NodeList]') {
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
        type !== 'array' &&
        type !== 'object' &&
        type !== 'null' &&
        type !== 'undefined'
      ) {
        throw new Error(
          `A rule returned an invalid deserialized representation: "${node}".`
        )
      }

      if (ret === undefined) {
        continue
      } else if (ret === null) {
        return null
      } else if (ret.object === 'mark') {
        node = this.deserializeMark(ret)
      } else if (ret.object === 'annotation') {
        node = this.deserializeAnnotation(ret)
      } else {
        node = ret
      }

      if (node.object === 'block' || node.object === 'inline') {
        node.data = node.data || {}
        node.nodes = node.nodes || []
      } else if (node.object === 'text') {
        node.marks = node.marks || []
        node.text = node.text || ''
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
      if (node.object === 'mark') {
        const ret = this.deserializeMark(node)
        return ret
      } else if (node.object === 'text') {
        node.marks = node.marks || []
        node.marks.push({ type, data })
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
   * Deserialize an `annotation` object.
   *
   * @param {Object} annotation
   * @return {Array}
   */

  deserializeAnnotation = annotation => {
    const addAnnotation = node => {
      if (node.object === 'annotation') {
        const ret = this.deserializeAnnotation(node)
        return ret
      } else if (node.object === 'text') {
        if (!this.annotations.get(annotation.key)) {
          delete annotation.nodes

          this.annotations = this.annotations.set(
            annotation.key,
            Annotation.create(annotation)
          )
        }

        this.nodeToAnnotationsMap = this.nodeToAnnotationsMap.set(
          node,
          (this.nodeToAnnotationsMap.get(node) || List()).concat(annotation.key)
        )
      } else if (node.nodes) {
        node.nodes = node.nodes.map(addAnnotation)
      }

      return node
    }

    return annotation.nodes.reduce((nodes, node) => {
      const ret = addAnnotation(node)
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
    const { document, annotations } = value
    const elements = document.nodes
      .map((n, index) => {
        const nodeAnnotations = annotations
          .map(a => a.relativeToChild(document, index))
          .filter(a => a)

        return this.serializeNode(n, nodeAnnotations)
      })
      .filter(el => el)
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

  serializeNode = (node, annotations) => {
    if (node.object === 'text') {
      const leaves = node.getLeaves(annotations, [])
      return leaves.map(leaf => this.serializeLeaf(leaf))
    }

    const children = node.nodes.reduce((acc, child, index) => {
      const nodeAnnotations = annotations
        .map(a => a.relativeToChild(node, index))
        .filter(a => a)

      return acc.concat(this.serializeNode(child, nodeAnnotations))
    }, [])

    for (const rule of this.rules) {
      if (!rule.serialize) continue
      const ret = rule.serialize(node, children)
      if (ret === null) return
      if (ret) return addKey(ret)
    }

    throw new Error(`No serializer defined for node of type "${node.type}".`)
  }

  serializeLeaf = leaf => {
    const string = new String({ text: leaf.text })
    const text = this.serializeString(string)

    return leaf.annotations.concat(leaf.marks).reduce((children, mark) => {
      for (const rule of this.rules) {
        if (!rule.serialize) continue
        const ret = rule.serialize(mark, children)
        if (ret === null) return
        if (ret) return addKey(ret)
      }

      throw new Error(
        `No serializer defined for ${mark.object} of type "${mark.type}".`
      )
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
    return !(element.nodeName === '#text' && element.nodeValue === '\n')
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
