import ReactDOM from 'react-dom'
import React, { useState, useMemo, useRef, useEffect } from 'react'
import { createEditor } from 'slate'
import { Slate, Editable, withReact } from 'slate-react'
import { withHistory } from 'slate-history'

const ShadowDOM = () => {
  const container = useRef(null)

  useEffect(() => {
    if (container.current) {
      // Create a shadow DOM and render the Editor within
      const shadowRoot = container.current.attachShadow({ mode: 'open' })
      const reactRoot = document.createElement('div')
      shadowRoot.appendChild(reactRoot)
      ReactDOM.render(<ShadowEditor />, reactRoot)
    }
  }, [container])

  return <div ref={container} />
}

const ShadowEditor = () => {
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
    children: [{ text: 'This Editor is rendered within a Shadow DOM.' }],
  },
]

export default ShadowDOM
