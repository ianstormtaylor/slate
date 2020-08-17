import ReactDOM from 'react-dom'
import React, { useState, useMemo, useRef, useEffect } from 'react'
import { createEditor } from 'slate'
import { Slate, Editable, withReact } from 'slate-react'
import { withHistory } from 'slate-history'

import PlainTextExample from './plaintext'

const ShadowDOM = () => {
  const container = useRef(null)

  useEffect(() => {
    if (container.current.shadowRoot) return

    // Create a shadow DOM
    const outerShadowRoot = container.current.attachShadow({ mode: 'open' })
    const host = document.createElement('div')
    outerShadowRoot.appendChild(host)

    // Create a nested shadow DOM
    const innerShadowRoot = host.attachShadow({ mode: 'open' })
    const reactRoot = document.createElement('div')
    innerShadowRoot.appendChild(reactRoot)

    // Render the editor within the nested shadow DOM
    ReactDOM.render(<PlainTextExample />, reactRoot)
  })

  return <div ref={container} />
}

export default ShadowDOM
