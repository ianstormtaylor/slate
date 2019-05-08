import React from 'react'

/**
 * The default rendering behavior for the React plugin.
 *
 * @return {Object}
 */

function Rendering() {
  return {
    decorateNode() {
      return []
    },

    renderBlock({ attributes, children }) {
      return (
        <div {...attributes} style={{ position: 'relative' }}>
          {children}
        </div>
      )
    },

    renderDocument({ children }) {
      return children
    },

    renderEditor({ children }) {
      return children
    },

    renderInline({ attributes, children }) {
      return (
        <span {...attributes} style={{ position: 'relative' }}>
          {children}
        </span>
      )
    },

    renderMark({ attributes, children }) {
      return <span {...attributes}>{children}</span>
    },
  }
}

/**
 * Export.
 *
 * @type {Function}
 */

export default Rendering
