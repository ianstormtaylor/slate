import React, { useState } from 'react'
import { Editor } from 'slate'
import { withHistory } from 'slate-history'
import {
  Editable,
  withReact,
  useSlate,
  useSelected,
  useFocused,
} from 'slate-react'

class EmbedsEditor extends withHistory(withReact(Editor)) {
  isVoid(element) {
    return element.type === 'video'
  }

  insertVideo(url) {
    const video = { type: 'video', url, nodes: [{ text: '', marks: [] }] }
    this.insertNodes(video)
  }

  renderElement(props) {
    return <Element {...props} />
  }
}

const EmbedsExample = () => {
  const [value, setValue] = useState(initialValue)
  const editor = useSlate(EmbedsEditor)
  return (
    <div>
      <Editable
        placeholder="Enter some text..."
        editor={editor}
        value={value}
        onChange={value => setValue(value)}
        renderElement={props => <Element {...props} />}
      />
    </div>
  )
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
  const selected = useSelected()
  const focused = useFocused()
  const { url } = element
  return (
    <div {...attributes}>
      {children}
      <div
        style={{
          position: 'relative',
          outline: focused ? '2px solid blue' : 'none',
        }}
      >
        <div
          style={{
            display: focused ? 'none' : 'block',
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
            editor.setNodes({ url: value }, { at: path })
          }}
        />
      ) : null}
    </div>
  )
}

const initialValue = {
  selection: null,
  annotations: {},
  nodes: [
    {
      nodes: [
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
      nodes: [
        {
          text: '',
          marks: [],
        },
      ],
    },
    {
      nodes: [
        {
          text:
            'Try it out! This editor is built to handle Vimeo embeds, but you could handle any type.',
          marks: [],
        },
      ],
    },
  ],
}

export default EmbedsExample
