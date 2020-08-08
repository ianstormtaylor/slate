import ReactDOM from 'react-dom'
import React, { useState, useMemo, useRef, useEffect } from 'react'
import { createEditor } from 'slate'
import { Slate, Editable, withReact } from 'slate-react'
import { withHistory } from 'slate-history'

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

const PlainTextExample = () => {
  const [value, setValue] = useState(initialValue)
  const editor = useMemo(() => withHistory(withReact(createEditor())), [])
  return (
    <Slate editor={editor} value={value} onChange={value => setValue(value)}>
      <Editable placeholder="Enter some plain text..." />
    </Slate>
  )
}

const initialValue = [
  {
    children: [{ text: 'This is editable plain text within a Shadow DOM.' }],
  },
]

export default ShadowDOM
