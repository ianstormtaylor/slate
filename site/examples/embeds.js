import React, { useMemo } from 'react'
import { Editor, createEditor } from 'slate'
import {
  Slate,
  Editable,
  withReact,
  useEditor,
  useFocused,
  useSelected,
} from 'slate-react'

const EmbedsExample = () => {
  const editor = useMemo(() => withEmbeds(withReact(createEditor())), [])
  return (
    <Slate editor={editor} defaultValue={initialValue}>
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
  const editor = useEditor()
  const selected = useSelected()
  const focused = useFocused()
  const { url } = element
  return (
    <div {...attributes}>
      <div
        contentEditable={false}
        style={{
          position: 'relative',
          boxShaodow: selected && focused ? '0 0 0 3px #B4D5FF' : 'none',
        }}
      >
        <div
          style={{
            display: selected && focused ? 'none' : 'block',
            position: 'absolute',
            top: '0',
            left: '0',
            height: '100%',
            width: '100%',
            cursor: 'cell',
            zIndex: 1,
          }}
        />
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
        {selected && focused ? (
          <input
            value={url}
            onClick={e => e.stopPropagation()}
            style={{
              marginTop: '5px',
              boxSizing: 'border-box',
            }}
            onChange={value => {
              const path = editor.findPath(element)
              Editor.setNodes(editor, { url: value }, { at: path })
            }}
          />
        ) : null}
      </div>
      {children}
    </div>
  )
}

const initialValue = [
  {
    children: [
      {
        text:
          'In addition to simple image nodes, you can actually create complex embedded nodes. For example, this one contains an input element that lets you change the video being rendered!',
        marks: [],
      },
    ],
  },
  {
    type: 'video',
    url: 'https://player.vimeo.com/video/26689853',
    children: [
      {
        text: '',
        marks: [],
      },
    ],
  },
  {
    children: [
      {
        text:
          'Try it out! This editor is built to handle Vimeo embeds, but you could handle any type.',
        marks: [],
      },
    ],
  },
]

export default EmbedsExample
