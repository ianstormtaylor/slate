import React, { useState } from 'react'
import imageExtensions from 'image-extensions'
import isUrl from 'is-url'
import { Editor } from 'slate'
import {
  Editable,
  withReact,
  useSlate,
  useSelected,
  useFocused,
} from 'slate-react'
import { withHistory } from 'slate-history'
import { css } from 'emotion'

import { Button, Icon, Toolbar } from '../components'

class ImagesEditor extends withHistory(withReact(Editor)) {
  isVoid(element) {
    return element.type === 'image'
  }

  insertData(data) {
    const text = data.getData('text/plain')
    const { files } = data

    if (files && files.length > 0) {
      for (const file of files) {
        const reader = new FileReader()
        const [mime] = file.type.split('/')

        if (mime === 'image') {
          reader.addEventListener('load', () => {
            this.insertImage(reader.result)
          })

          reader.readAsDataURL(file)
        }
      }
    } else if (isImageUrl(text)) {
      this.insertImage(text)
    } else {
      super.insertData(data)
    }
  }

  insertImage(url) {
    const text = { text: '', marks: [] }
    const image = { type: 'image', url, nodes: [text] }
    this.insertNodes(image)
  }
}

const ImagesExample = () => {
  const [value, setValue] = useState(initialValue)
  const editor = useSlate(ImagesEditor)
  return (
    <div>
      <Toolbar>
        <Button
          onMouseDown={event => {
            event.preventDefault()
            const url = window.prompt('Enter the URL of the image:')
            if (!url) return
            editor.insertImage(url)
          }}
        >
          <Icon>image</Icon>
        </Button>
      </Toolbar>
      <Editable
        placeholder="Enter some text..."
        editor={editor}
        value={value}
        onChange={setValue}
        renderElement={props => <Element {...props} />}
      />
    </div>
  )
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

const isImageUrl = url => {
  if (!url) return false
  if (!isUrl(url)) return false
  const ext = new URL(url).pathname.split('.').pop()
  return imageExtensions.includes(ext)
}

const initialValue = {
  selection: null,
  annotations: {},
  nodes: [
    {
      type: 'paragraph',
      nodes: [
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
      nodes: [
        {
          text: '',
          marks: [],
        },
      ],
    },
    {
      type: 'paragraph',
      nodes: [
        {
          text:
            'This example shows images in action. It features two ways to add images. You can either add an image via the toolbar icon above, or if you want in on a little secret, copy an image URL to your keyboard and paste it anywhere in the editor!',
          marks: [],
        },
      ],
    },
  ],
}

export default ImagesExample
