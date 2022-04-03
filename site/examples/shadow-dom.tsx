import ReactDOM from 'react-dom'
import React, { useMemo, useRef, useEffect } from 'react'
import { createEditor, Descendant } from 'slate'
import { Slate, Editable, withReact } from 'slate-react'
import { withHistory } from 'slate-history'

const ShadowDOM = () => {
  const container = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (container.current!.shadowRoot) return

    // Create a shadow DOM
    const outerShadowRoot = container.current!.attachShadow({ mode: 'open' })
    const host = document.createElement('div')
    outerShadowRoot.appendChild(host)

    // Create a nested shadow DOM
    const innerShadowRoot = host.attachShadow({ mode: 'open' })
    const reactRoot = document.createElement('div')
    innerShadowRoot.appendChild(reactRoot)

    // Render the editor within the nested shadow DOM
    ReactDOM.render(<ShadowEditor />, reactRoot)
  })

  return <div ref={container} data-cy="outer-shadow-root" />
}

const ShadowEditor = () => {
  const editor = useMemo(() => withHistory(withReact(createEditor())), [])

  return (
    <Slate editor={editor} value={initialValue}>
      <Editable placeholder="Enter some plain text..." />
    </Slate>
  )
}

const initialValue: Descendant[] = [
  {
    type: 'paragraph',
    children: [{ text: 'This Editor is rendered within a nested Shadow DOM.' }],
  },
]

export default ShadowDOM
