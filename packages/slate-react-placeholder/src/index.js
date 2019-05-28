import invariant from 'tiny-invariant'
import React from 'react'

/*
 * Instance counter to enable unique marks for multiple Placeholder instances.
 */

let instanceCounter = 0

/**
 * A plugin that renders a React placeholder for a given Slate node.
 *
 * @param {Object} options
 * @return {Object}
 */

function SlateReactPlaceholder(options = {}) {
  const instanceId = instanceCounter++
  const { placeholder, when, style = {} } = options

  invariant(
    typeof placeholder === 'string',
    'You must pass `SlateReactPlaceholder` an `options.placeholder` string.'
  )

  invariant(
    typeof when === 'string' || typeof when === 'function',
    'You must pass `SlateReactPlaceholder` an `options.when` query.'
  )

  /**
   * Decorate a match node with a placeholder mark when it fits the query.
   *
   * @param {Node} node
   * @param {Editor} editor
   * @param {Function} next
   * @return {Array}
   */

  function decorateNode(node, editor, next) {
    if (!editor.query(when, node)) {
      return next()
    }

    const others = next()
    const [first] = node.texts()
    const [last] = node.texts({ direction: 'backward' })
    const [firstNode, firstPath] = first
    const [lastNode, lastPath] = last
    const decoration = {
      type: 'placeholder',
      data: { key: instanceId },
      anchor: { key: firstNode.key, offset: 0, path: firstPath },
      focus: {
        key: lastNode.key,
        offset: lastNode.text.length,
        path: lastPath,
      },
    }

    return [...others, decoration]
  }

  /**
   * Render an inline placeholder for the placeholder mark.
   *
   * @param {Object} props
   * @param {Editor} editor
   * @param {Function} next
   * @return {Element}
   */

  function renderDecoration(props, editor, next) {
    const { children, decoration: deco } = props

    if (deco.type === 'placeholder' && deco.data.get('key') === instanceId) {
      const placeHolderStyle = {
        pointerEvents: 'none',
        display: 'inline-block',
        width: '0',
        maxWidth: '100%',
        whiteSpace: 'nowrap',
        opacity: '0.333',
        verticalAlign: 'text-top',
        ...style,
      }

      return (
        <span>
          <span contentEditable={false} style={placeHolderStyle}>
            {placeholder}
          </span>
          {children}
        </span>
      )
    }

    return next()
  }

  /**
   * Return the plugin.
   *
   * @return {Object}
   */

  return { decorateNode, renderDecoration }
}

/**
 * Export.
 *
 * @type {Function}
 */

export default SlateReactPlaceholder
