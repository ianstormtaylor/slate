import isEmpty from 'is-empty'
import isPlainObject from 'is-plain-object'
import { Block, Document, Inline, Mark, Range, Value } from 'slate'

import createChildren from './createChildren'
import { ANCHOR, CURSOR, FOCUS } from './constants/selection'
import DecoratorPoint from './DecoratorPoint'

/**
 * The default Slate hyperscript creator functions.
 *
 * @type {Object}
 */

const CREATORS = {
  anchor(tagName, attributes, children) {
    return ANCHOR
  },

  block(tagName, attributes, children) {
    return Block.create({
      ...attributes,
      nodes: createChildren(children),
    })
  },

  cursor(tagName, attributes, children) {
    return CURSOR
  },

  document(tagName, attributes, children) {
    return Document.create({
      ...attributes,
      nodes: createChildren(children),
    })
  },

  focus(tagName, attributes, children) {
    return FOCUS
  },

  inline(tagName, attributes, children) {
    return Inline.create({
      ...attributes,
      nodes: createChildren(children),
    })
  },

  mark(tagName, attributes, children) {
    const marks = Mark.createSet([attributes])
    const nodes = createChildren(children, { marks })
    return nodes
  },

  decoration(tagName, attributes, children) {
    if (attributes.key) {
      return new DecoratorPoint(attributes, [{ type: tagName }])
    }

    const nodes = createChildren(children, { key: attributes.key })

    nodes[0].__decorations = (nodes[0].__decorations || []).concat([
      {
        anchorOffset: 0,
        focusOffset: nodes.reduce((len, n) => len + n.text.length, 0),
        marks: [{ type: tagName }],
        isAtomic: !!attributes.data.atomic,
      },
    ])
    return nodes
  },

  selection(tagName, attributes, children) {
    return Range.create(attributes)
  },

  value(tagName, attributes, children) {
    const { data, normalize = true } = attributes
    const document = children.find(Document.isDocument)
    let selection = children.find(Range.isRange) || Range.create()
    const props = {}
    let decorations = []
    const partialDecorations = {}

    // Search the document's texts to see if any of them have the anchor or
    // focus information saved, so we can set the selection.
    if (document) {
      document.getTexts().forEach(text => {
        if (text.__anchor != null) {
          props.anchorKey = text.key
          props.anchorOffset = text.__anchor
        }

        if (text.__focus != null) {
          props.focusKey = text.key
          props.focusOffset = text.__focus
        }
      })

      // now check for decorations and hoist them to the top
      document.getTexts().forEach(text => {
        if (text.__decorations != null) {
          // add in all mark-like (keyless) decorations
          decorations = decorations.concat(
            text.__decorations.filter(d => d._key === undefined).map(d =>
              Range.create({
                ...d,
                anchorKey: text.key,
                focusKey: text.key,
              })
            )
          )

          // store or combine partial decorations (keyed with anchor / focus)
          text.__decorations
            .filter(d => d._key !== undefined)
            .forEach(partial => {
              if (partialDecorations[partial._key]) {
                decorations.push(
                  partialDecorations[partial._key].combine(
                    partial.withKey(text.key)
                  )
                )

                delete partialDecorations[partial._key]
                return
              }

              partialDecorations[partial._key] = partial.withKey(text.key)
            })
        }
      })
    }

    // should have no more parital decorations outstanding (all paired)
    if (Object.keys(partialDecorations).length > 0) {
      throw new Error(
        `Slate hyperscript must have both an anchor and focus defined for each keyed decorator.`
      )
    }

    if (props.anchorKey && !props.focusKey) {
      throw new Error(
        `Slate hyperscript must have both \`<anchor/>\` and \`<focus/>\` defined if one is defined, but you only defined \`<anchor/>\`. For collapsed selections, use \`<cursor/>\`.`
      )
    }

    if (!props.anchorKey && props.focusKey) {
      throw new Error(
        `Slate hyperscript must have both \`<anchor/>\` and \`<focus/>\` defined if one is defined, but you only defined \`<focus/>\`. For collapsed selections, use \`<cursor/>\`.`
      )
    }

    if (!isEmpty(props)) {
      selection = selection.merge(props).normalize(document)
    }

    const { isFocused = selection.isSet } = attributes

    let value = Value.fromJSON(
      { data, document, selection, isFocused },
      { normalize }
    )

    // apply any decorations built
    if (decorations.length > 0) {
      value = value
        .change()
        .setValue({ decorations: decorations.map(d => d.normalize(document)) })
        .value
    }

    return value
  },

  text(tagName, attributes, children) {
    const nodes = createChildren(children, { key: attributes.key })
    return nodes
  },
}

/**
 * Create a Slate hyperscript function with `options`.
 *
 * @param {Object} options
 * @return {Function}
 */

function createHyperscript(options = {}) {
  const creators = resolveCreators(options)

  function create(tagName, attributes, ...children) {
    const creator = creators[tagName]

    if (!creator) {
      throw new Error(`No hyperscript creator found for tag: "${tagName}"`)
    }

    if (attributes == null) {
      attributes = {}
    }

    if (!isPlainObject(attributes)) {
      children = [attributes].concat(children)
      attributes = {}
    }

    children = children
      .filter(child => Boolean(child))
      .reduce((memo, child) => memo.concat(child), [])

    const element = creator(tagName, attributes, children)
    return element
  }

  return create
}

/**
 * Resolve a set of hyperscript creators an `options` object.
 *
 * @param {Object} options
 * @return {Object}
 */

function resolveCreators(options) {
  const { blocks = {}, inlines = {}, marks = {}, decorators = {} } = options

  const creators = {
    ...CREATORS,
    ...(options.creators || {}),
  }

  Object.keys(blocks).map(key => {
    creators[key] = normalizeNode(key, blocks[key], 'block')
  })

  Object.keys(inlines).map(key => {
    creators[key] = normalizeNode(key, inlines[key], 'inline')
  })

  Object.keys(marks).map(key => {
    creators[key] = normalizeMark(key, marks[key])
  })

  Object.keys(decorators).map(key => {
    creators[key] = normalizeNode(key, decorators[key], 'decoration')
  })

  return creators
}

/**
 * Normalize a node creator with `key` and `value`, of `object`.
 *
 * @param {String} key
 * @param {Function|Object|String} value
 * @param {String} object
 * @return {Function}
 */

function normalizeNode(key, value, object) {
  if (typeof value == 'function') {
    return value
  }

  if (typeof value == 'string') {
    value = { type: value }
  }

  if (isPlainObject(value)) {
    return (tagName, attributes, children) => {
      const { key: attrKey, ...rest } = attributes
      const attrs = {
        ...value,
        object,
        key: attrKey,
        data: {
          ...(value.data || {}),
          ...rest,
        },
      }

      return CREATORS[object](tagName, attrs, children)
    }
  }

  throw new Error(
    `Slate hyperscript ${object} creators can be either functions, objects or strings, but you passed: ${value}`
  )
}

/**
 * Normalize a mark creator with `key` and `value`.
 *
 * @param {String} key
 * @param {Function|Object|String} value
 * @return {Function}
 */

function normalizeMark(key, value) {
  if (typeof value == 'function') {
    return value
  }

  if (typeof value == 'string') {
    value = { type: value }
  }

  if (isPlainObject(value)) {
    return (tagName, attributes, children) => {
      const attrs = {
        ...value,
        data: {
          ...(value.data || {}),
          ...attributes,
        },
      }

      return CREATORS.mark(tagName, attrs, children)
    }
  }

  throw new Error(
    `Slate hyperscript mark creators can be either functions, objects or strings, but you passed: ${value}`
  )
}

/**
 * Export.
 *
 * @type {Function}
 */

export default createHyperscript()
export { createHyperscript }
