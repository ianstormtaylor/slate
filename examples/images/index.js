import React, { useState } from 'react'
import imageExtensions from 'image-extensions'
import isUrl from 'is-url'
import { Editor as BaseEditor } from 'slate'
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
      last: { type: 'paragraph' },
    },
    normalize: (editor, { code, path }) => {
      switch (code) {
        case 'last_child_type_invalid': {
          const paragraph = { type: 'paragraph', nodes: [] }
          return editor.insertNodes(paragraph, { at: path })
        }
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
  insertImage(src) {
    const text = { text: '', marks: [] }
    const image = { type: 'image', src, nodes: [text] }
    this.insertNodes(image)
  }

  renderElement(props) {
    return <Element {...props} />
  }

  onDrop(event) {
    debugger
    const target = this.findEventRange(event)
    const transfer = this.getEventTransfer(event)
    const { type, text, files } = transfer

    if (target) {
      this.select(target)
    }

    if (type === 'files') {
      for (const file of files) {
        const reader = new FileReader()
        const [mime] = file.type.split('/')
        if (mime !== 'image') continue

        reader.addEventListener('load', () => {
          this.insertImage(reader.result)
        })

        reader.readAsDataURL(file)
      }

      return
    }

    if (type === 'text' && isUrl(text) && isImageUrl(text)) {
      this.insertImage(text)
      return
    }

    return super.onDrop(event)
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
            const src = window.prompt('Enter the URL of the image:')
            if (!src) return
            editor.insertImage(src)
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
          src={element.src}
          className={css`
            display: block;
            max-width: 100%;
            max-height: 20em;
            box-shadow: ${selected && focused ? '0 0 0 2px blue;' : 'none'};
          `}
        />
      </div>
      {children}
    </div>
  )
}

const isImageUrl = url => {
  const ext = new URL(url).pathname.split('.').pop()
  return imageExtensions.includes(ext)
}

export default Example
