import invariant from 'tiny-invariant'
import React from 'react'

function PlaceholderPlugin(options = {}) {
  const { placeholder = '', when } = options

  invariant(
    when,
    'You must pass the `PlaceholderPlugin` an `options.when` query.'
  )

  function decorateNode(node, editor, next) {
    const others = next() || []
    const decorations = []

    if (editor.query(when, node)) {
      const text = node.getFirstText()
      const point = { key: text.key, offset: 0 }
      const decoration = {
        anchor: point,
        focus: point,
        mark: { type: 'placeholder' },
      }
      decorations.push(decoration)
    }

    return [...others, ...decorations]
  }

  function renderMark(props, editor, next) {
    const { children, mark, node } = props

    if (mark.type === 'placeholder') {
      const style = {
        pointerEvents: 'none',
        display: 'inline-block',
        width: '0',
        maxWidth: '100%',
        whiteSpace: 'nowrap',
        opacity: '0.333',
      }

      return (
        <React.Fragment>
          <span
            contentEditable={false}
            style={style}
            onMouseDown={e => {
              e.preventDefault()
              e.stopPropagation()
              editor.moveToStartOfNode(node)
            }}
          >
            {placeholder}
          </span>
          {children}
        </React.Fragment>
      )
    } else {
      return next()
    }
  }

  return { decorateNode, renderMark }
}

export default PlaceholderPlugin
