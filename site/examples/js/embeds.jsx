import React, { useMemo } from 'react'
import { createEditor, Transforms } from 'slate'
import {
  Editable,
  ReactEditor,
  Slate,
  useSlateStatic,
  withReact,
} from 'slate-react'

const EmbedsExample = () => {
  const editor = useMemo(() => withEmbeds(withReact(createEditor())), [])
  return (
    <Slate editor={editor} initialValue={initialValue}>
      <Editable
        placeholder="Enter some text..."
        renderElement={(props) => <Element {...props} />}
      />
    </Slate>
  )
}
const withEmbeds = (editor) => {
  const { isVoid } = editor
  editor.isVoid = (element) =>
    element.type === 'video' ? true : isVoid(element)
  return editor
}
const Element = (props) => {
  const { attributes, children, element } = props
  switch (element.type) {
    case 'video':
      return <VideoElement {...props} />
    default:
      return <p {...attributes}>{children}</p>
  }
}
const allowedSchemes = ['http:', 'https:']
const VideoElement = ({ attributes, children, element }) => {
  const editor = useSlateStatic()
  const { url } = element
  const safeUrl = useMemo(() => {
    let parsedUrl = null
    try {
      parsedUrl = new URL(url)
      // eslint-disable-next-line no-empty
    } catch {}
    if (parsedUrl && allowedSchemes.includes(parsedUrl.protocol)) {
      return parsedUrl.href
    }
    return 'about:blank'
  }, [url])
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
            frameBorder="0"
            src={`${safeUrl}?title=0&byline=0&portrait=0`}
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
          onChange={(val) => {
            const path = ReactEditor.findPath(editor, element)
            const newProperties = {
              url: val,
            }
            Transforms.setNodes(editor, newProperties, {
              at: path,
            })
          }}
          url={url}
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
      onChange={(e) => {
        const newUrl = e.target.value
        setValue(newUrl)
        onChange(newUrl)
      }}
      onClick={(e) => e.stopPropagation()}
      style={{
        marginTop: '5px',
        boxSizing: 'border-box',
      }}
      type="text"
      value={value}
    />
  )
}
const initialValue = [
  {
    type: 'paragraph',
    children: [
      {
        text: 'In addition to simple image nodes, you can actually create complex embedded nodes. For example, this one contains an input element that lets you change the video being rendered!',
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
        text: 'Try it out! This editor is built to handle Vimeo embeds, but you could handle any type.',
      },
    ],
  },
]
export default EmbedsExample
