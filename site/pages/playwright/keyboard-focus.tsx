import React, { useState } from 'react'
import { createEditor } from 'slate'
import { Editable, Slate, withReact } from 'slate-react'

export default function KeyboardFocus() {
  const [editor] = useState(() => withReact(createEditor()))
  return (
    <>
      <button>Before editor</button>
      <Slate
        editor={editor}
        initialValue={[
          { type: 'paragraph', children: [{ text: 'hello world' }] },
        ]}
      >
        <Editable />
      </Slate>
      <button>After editor</button>
    </>
  )
}

export const getStaticProps = () =>
  process.env.NODE_ENV === 'production' ? { notFound: true } : { props: {} }
