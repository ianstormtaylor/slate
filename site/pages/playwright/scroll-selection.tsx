import React, { useRef, useState } from 'react'
import { createEditor } from 'slate'
import { Editable, Slate, withReact } from 'slate-react'

const initialValue = [
  {
    children: [
      {
        text: Array.from(
          { length: 40 },
          (_, index) => `Line ${index}: some text`
        ).join('\n'),
      },
    ],
  },
]

export default function ScrollSelectionFixture() {
  const [editor] = useState(() => withReact(createEditor()))
  const counter = useRef<HTMLDivElement>(null)
  const calls = useRef(0)

  return (
    <>
      <header
        style={{
          position: 'sticky',
          top: 0,
          height: 80,
          background: 'white',
          zIndex: 1,
        }}
      >
        Sticky header
      </header>
      <div ref={counter} data-test-id="scroll-calls" data-count="0" />
      <Slate editor={editor} initialValue={initialValue}>
        <Editable
          style={{ lineHeight: '24px', paddingBottom: '500px' }}
          scrollSelectionIntoView={(_, range) => {
            calls.current += 1
            counter.current!.dataset.count = String(calls.current)
            const rect = range.getBoundingClientRect()
            if (rect.top < 80) window.scrollBy(0, rect.top - 80)
            else if (rect.bottom > innerHeight)
              window.scrollBy(0, rect.bottom - innerHeight)
          }}
        />
      </Slate>
    </>
  )
}
