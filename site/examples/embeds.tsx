import React, { useState, useMemo } from 'react'
import {
  Transforms,
  createEditor,
  Element as SlateElement,
  Descendant,
} from 'slate'
import {
  Slate,
  Editable,
  withReact,
  useSlateStatic,
  ReactEditor,
} from 'slate-react'

const EmbedsExample = () => {
  const [value, setValue] = useState<Descendant[]>(initialValue)
  const editor = useMemo(() => withEmbeds(withReact(createEditor())), [])
  return (
    <Slate editor={editor} value={value} onChange={value => setValue(value)}>
      <Editable
        renderElement={props => <Element {...props} />}
        placeholder="Enter some text..."
      />
    </Slate>
  )
}

const withEmbeds = editor => {
  const { isVoid } = editor
  editor.isVoid = element => (element.type === 'video' ? true : isVoid(element))
  return editor
}

const Element = props => {
  const { attributes, children, element } = props
  switch (element.type) {
    case 'video':
      return <VideoElement {...props} />
    default:
      return <p {...attributes}>{children}</p>
  }
}

const VideoElement = ({ attributes, children, element }) => {
  const editor = useSlateStatic()
  const { url } = element
  return (
    <div {...attributes}>
      <div contentEditable={false}>
        <div
          style={{
            padding: '75% 0 0 0',
            position: 'relative',
          }}
        >
          <iframe
            src={`${url}?title=0&byline=0&portrait=0`}
            frameBorder="0"
            style={{
              position: 'absolute',
              top: '0',
              left: '0',
              width: '100%',
              height: '100%',
            }}
          />
        </div>
        <UrlInput
          url={url}
          onChange={val => {
            const path = ReactEditor.findPath(editor, element)
            const newProperties: Partial<SlateElement> = {
              url: val,
            }
            Transforms.setNodes(editor, newProperties, { at: path })
          }}
        />
      </div>
      {children}
    </div>
  )
}

const UrlInput = ({ url, onChange }) => {
  const [value, setValue] = React.useState(url)
  return (
    <input
      value={value}
      onClick={e => e.stopPropagation()}
      style={{
        marginTop: '5px',
        boxSizing: 'border-box',
      }}
      onChange={e => {
        const newUrl = e.target.value
        setValue(newUrl)
        onChange(newUrl)
      }}
    />
  )
}

const initialValue: Descendant[] = [
  {
    type: 'paragraph',
    children: [
      {
        text:
          'In addition to simple image nodes, you can actually create complex embedded nodes. For example, this one contains an input element that lets you change the video being rendered!',
      },
    ],
  },
  {
    type: 'video',
    url: 'https://player.vimeo.com/video/26689853',
    children: [{ text: '' }],
  },
  {
    type: 'paragraph',
    children: [
      {
        text:
          'Try it out! This editor is built to handle Vimeo embeds, but you could handle any type.',
      },
    ],
  },
]

export default EmbedsExample
