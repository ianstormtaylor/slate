import React, { useMemo } from 'react'
import { Descendant, createEditor } from 'slate'
import { withHistory } from 'slate-history'
import { Editable, RenderPlaceholderProps, Slate, withReact } from 'slate-react'

const initialValue: Descendant[] = [
  {
    type: 'paragraph',
    children: [{ text: '' }],
  },
]

const PlainTextExample = () => {
  const editor = useMemo(() => withHistory(withReact(createEditor())), [])
  return (
    <Slate editor={editor} initialValue={initialValue}>
      <Editable
        placeholder="Type something"
        renderPlaceholder={({
          children,
          attributes,
        }: RenderPlaceholderProps) => (
          <div {...attributes}>
            <p>{children}</p>
            <pre>
              Use the renderPlaceholder prop to customize rendering of the
              placeholder
            </pre>
          </div>
        )}
      />
    </Slate>
  )
}

export default PlainTextExample
