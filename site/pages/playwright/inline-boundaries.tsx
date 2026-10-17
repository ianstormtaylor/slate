import React, { useState } from 'react'
import { createEditor, Descendant } from 'slate'
import { Editable, Slate, withReact } from 'slate-react'

const initialValue: Descendant[] = [
  {
    type: 'paragraph',
    children: [
      { text: '' },
      { type: 'link', url: '#', children: [{ text: 'link' }] },
      { text: '' },
    ],
  },
]

export default function InlineBoundaries() {
  const [editor] = useState(() => {
    const value = withReact(createEditor())
    value.isInline = element => element.type === 'link'
    return value
  })

  return (
    <Slate editor={editor} initialValue={initialValue}>
      <Editable
        renderElement={({ attributes, children, element }) =>
          element.type === 'link' ? (
            <span
              {...attributes}
              style={{ padding: '0 24px', background: '#ddd' }}
            >
              {children}
            </span>
          ) : (
            <div {...attributes}>{children}</div>
          )
        }
      />
    </Slate>
  )
}

export const getStaticProps = () =>
  process.env.NODE_ENV === 'production' ? { notFound: true } : { props: {} }
