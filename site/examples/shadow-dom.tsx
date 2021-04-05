import ReactDOM from 'react-dom'
import React, { useState, useMemo, useRef, useEffect } from 'react'
import { createEditor, Value } from 'slate'
import { Slate, Editable, withReact } from 'slate-react'
import { withHistory } from 'slate-history'

const ShadowDOM = () => {
  const container = useRef(null)

  useEffect(() => {
    if (container.current.shadowRoot) return
    const outerShadowRoot = container.current.attachShadow({ mode: 'open' })
    const host = document.createElement('div')
    outerShadowRoot.appendChild(host)
    const innerShadowRoot = host.attachShadow({ mode: 'open' })
    const reactRoot = document.createElement('div')
    innerShadowRoot.appendChild(reactRoot)
    ReactDOM.render(<ShadowEditor />, reactRoot)
  })

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

const initialValue: Value = [
  {
    children: [{ text: 'This editor is rendered within a nested Shadow DOM.' }],
  },
]

export default ShadowDOM
