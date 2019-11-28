import React, { useMemo } from 'react'
import imageExtensions from 'image-extensions'
import isUrl from 'is-url'
import { Editor, createEditor } from 'slate'
import {
  Slate,
  Editable,
  useEditor,
  useSelected,
  useFocused,
  withReact,
} from 'slate-react'
import { withHistory } from 'slate-history'
import { css } from 'emotion'

import { Button, Icon, Toolbar } from '../components'

const ImagesExample = () => {
  const editor = useMemo(
    () => withImages(withHistory(withReact(createEditor()))),
    []
  )
  return (
    <Slate editor={editor} defaultValue={initialValue}>
      <Toolbar>
        <InsertImageButton />
      </Toolbar>
      <Editable
        renderElement={props => <Element {...props} />}
        placeholder="Enter some text..."
      />
    </Slate>
  )
}

const withImages = editor => {
  const { exec, isVoid } = editor

  editor.isVoid = element => {
    return element.type === 'image' ? true : isVoid(element)
  }

  editor.exec = command => {
    switch (command.type) {
      case 'insert_data': {
        const { data } = command
        const text = data.getData('text/plain')
        const { files } = data

        if (files && files.length > 0) {
          for (const file of files) {
            const reader = new FileReader()
            const [mime] = file.type.split('/')

            if (mime === 'image') {
              reader.addEventListener('load', () => {
                const url = reader.result
                editor.exec({ type: 'insert_image', url })
              })

              reader.readAsDataURL(file)
            }
          }
        } else if (isImageUrl(text)) {
          editor.exec({ type: 'insert_image', url: text })
        } else {
          exec(command)
        }

        break
      }

      case 'insert_image': {
        const { url } = command
        const text = { text: '', marks: [] }
        const image = { type: 'image', url, children: [text] }
        Editor.insertNodes(editor, image)
        break
      }

      default: {
        exec(command)
        break
      }
    }
  }

  return editor
}

const Element = props => {
  const { attributes, children, element } = props

  switch (element.type) {
    case 'image':
      return <ImageElement {...props} />
    default:
      return <p {...attributes}>{children}</p>
  }
}

const ImageElement = ({ attributes, children, element }) => {
  const selected = useSelected()
  const focused = useFocused()
  return (
    <div {...attributes}>
      <div contentEditable={false}>
        <img
          src={element.url}
          className={css`
            display: block;
            max-width: 100%;
            max-height: 20em;
            box-shadow: ${selected && focused ? '0 0 0 3px #B4D5FF' : 'none'};
          `}
        />
      </div>
      {children}
    </div>
  )
}

const InsertImageButton = () => {
  const editor = useEditor()
  return (
    <Button
      onMouseDown={event => {
        event.preventDefault()
        const url = window.prompt('Enter the URL of the image:')
        if (!url) return
        editor.exec({ type: 'insert_url', url })
      }}
    >
      <Icon>image</Icon>
    </Button>
  )
}

const isImageUrl = url => {
  if (!url) return false
  if (!isUrl(url)) return false
  const ext = new URL(url).pathname.split('.').pop()
  return imageExtensions.includes(ext)
}

const initialValue = [
  {
    type: 'paragraph',
    children: [
      {
        text:
          'In addition to nodes that contain editable text, you can also create other types of nodes, like images or videos.',
        marks: [],
      },
    ],
  },
  {
    type: 'image',
    url: 'https://source.unsplash.com/kFrdX5IeQzI',
    children: [
      {
        text: '',
        marks: [],
      },
    ],
  },
  {
    type: 'paragraph',
    children: [
      {
        text:
          'This example shows images in action. It features two ways to add images. You can either add an image via the toolbar icon above, or if you want in on a little secret, copy an image URL to your keyboard and paste it anywhere in the editor!',
        marks: [],
      },
    ],
  },
]

export default ImagesExample
