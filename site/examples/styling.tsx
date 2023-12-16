import React, { useMemo } from 'react'
import { createEditor } from 'slate'
import { Slate, Editable, withReact } from 'slate-react'
import { withHistory } from 'slate-history'

const StylingExample = () => {
  const editor1 = useMemo(() => withHistory(withReact(createEditor())), [])
  const editor2 = useMemo(() => withHistory(withReact(createEditor())), [])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
      <Slate
        editor={editor1}
        initialValue={[
          {
            type: 'paragraph',
            children: [{ text: 'This editor is styled using the style prop.' }],
          },
        ]}
      >
        <Editable
          style={{
            backgroundColor: 'rgb(255, 230, 156)',
            minHeight: '200px',
            outline: 'rgb(0, 128, 0) solid 2px',
          }}
        />
      </Slate>

      <Slate
        editor={editor2}
        initialValue={[
          {
            type: 'paragraph',
            children: [
              { text: 'This editor is styled using the className prop.' },
            ],
          },
        ]}
      >
        <Editable className="fancy" disableDefaultStyles />
      </Slate>
    </div>
  )
}

export default StylingExample
