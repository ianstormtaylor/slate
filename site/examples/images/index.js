import React, { useState } from 'react'
import imageExtensions from 'image-extensions'
import isUrl from 'is-url'
import { Editor as BaseEditor, Path } from 'slate'
import {
  Editor,
  withReact,
  useSlate,
  useSelected,
  useFocused,
} from 'slate-react'
import { withSchema } from 'slate-schema'
import { withHistory } from 'slate-history'
import { css } from 'emotion'

import initialValue from './value.json'
import { Button, Icon, Toolbar } from '../components'

const schema = {
  value: {
    validate: {
      last: {
        properties: { type: 'paragraph' },
      },
    },
    normalize: (editor, { code, path }) => {
      if (code === 'last_child_property_invalid') {
        const paragraph = { type: 'paragraph', nodes: [] }
        editor.insertNodes(paragraph, { at: Path.next(path) })
      }
    },
  },
  blocks: {
    image: {
      define: {
        isVoid: true,
      },
    },
  },
}

class ExampleEditor extends withSchema(
  withHistory(withReact(BaseEditor)),
  schema
) {
  // Override the `insertData` method to handle inserting image files or URLs.
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

  renderElement(props) {
    return <Element {...props} />
  }
}

const Example = () => {
  const [value, setValue] = useState(initialValue)
  const editor = useSlate(ExampleEditor)
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
      <Editor
        placeholder="Enter some text..."
        editor={editor}
        value={value}
        onChange={change => setValue(change.value)}
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
            box-shadow: ${selected && focused ? '0 0 0 3px #B4D5FF;' : 'none'};
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

export default Example
