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
  const placeholderMark = {
    type: 'placeholder',
    data: { key: instanceId },
  }

  const { placeholder, when, style = {} } = options

  invariant(
    placeholder,
    'You must pass `SlateReactPlaceholder` an `options.placeholder` string.'
  )

  invariant(
    when,
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
    const first = node.getFirstText()
    const last = node.getLastText()
    const decoration = {
      anchor: { key: first.key, offset: 0 },
      focus: { key: last.key, offset: last.text.length },
      mark: placeholderMark,
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

  function renderMark(props, editor, next) {
    const { children, mark } = props

    if (mark.type === 'placeholder' && mark.data.get('key') === instanceId) {
      const placeHolderStyle = {
        pointerEvents: 'none',
        display: 'inline-block',
        width: '0',
        maxWidth: '100%',
        whiteSpace: 'nowrap',
        opacity: '0.333',
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

  return { decorateNode, renderMark }
}

/**
 * Export.
 *
 * @type {Function}
 */

export default SlateReactPlaceholder
