import { css } from '@emotion/css'
import imageExtensions from 'image-extensions'
import isHotkey from 'is-hotkey'
import isUrl from 'is-url'
import React, { useMemo } from 'react'
import { Editor, Path, Range, Transforms, createEditor } from 'slate'
import { withHistory } from 'slate-history'
import {
  Editable,
  ReactEditor,
  Slate,
  useFocused,
  useSelected,
  useSlateStatic,
  withReact,
} from 'slate-react'
import { Button, Icon, Toolbar } from './components'

const ImagesExample = () => {
  const editor = useMemo(
    () => withImages(withHistory(withReact(createEditor()))),
    []
  )
  return (
    <Slate editor={editor} initialValue={initialValue}>
      <Toolbar>
        <InsertImageButton />
      </Toolbar>
      <Editable
        aria-label="Editor with images"
        onKeyDown={event => {
          if (isHotkey('mod+a', event)) {
            event.preventDefault()
            Transforms.select(editor, [])
          }
        }}
        renderElement={props => <Element {...props} />}
        placeholder="Enter some text..."
      />
    </Slate>
  )
}
const withImages = editor => {
  const { insertBreak, insertData, isVoid } = editor
  editor.isVoid = element => {
    return element.type === 'image' ? true : isVoid(element)
  }
  editor.insertBreak = () => {
    const { selection } = editor
    if (selection && Range.isCollapsed(selection)) {
      const match = Editor.void(editor, { at: selection })
      if (match && Editor.isBlock(editor, match[0])) {
        const paragraph = {
          type: 'paragraph',
          children: [{ text: '' }],
        }
        Transforms.insertNodes(editor, paragraph, {
          at: Path.next(match[1]),
          select: true,
        })
        return
      }
    }
    insertBreak()
  }
  editor.insertData = data => {
    const text = data.getData('text/plain')
    const { files } = data
    if (files && files.length > 0) {
      Array.from(files).forEach(file => {
        const reader = new FileReader()
        const [mime] = file.type.split('/')
        if (mime === 'image') {
          reader.addEventListener('load', () => {
            const url = reader.result
            insertImage(editor, url)
          })
          reader.readAsDataURL(file)
        }
      })
    } else if (isImageUrl(text)) {
      insertImage(editor, text)
    } else {
      insertData(data)
    }
  }
  return editor
}
const insertImage = (editor, url) => {
  const text = { text: '' }
  const image = { type: 'image', url, children: [text] }
  Transforms.insertNodes(editor, image)
  const paragraph = {
    type: 'paragraph',
    children: [{ text: '' }],
  }
  Transforms.insertNodes(editor, paragraph)
}
const Element = props => {
  const { attributes, children, element } = props
  switch (element.type) {
    case 'image':
      return <Image {...props} />
    default:
      return <p {...attributes}>{children}</p>
  }
}
const Image = ({ attributes, children, element }) => {
  const editor = useSlateStatic()
  const path = ReactEditor.findPath(editor, element)
  const selected = useSelected()
  const focused = useFocused()
  return (
    <div {...attributes}>
      {children}
      <div
        contentEditable={false}
        className={css`
          position: relative;
        `}
      >
        <img
          src={element.url}
          alt={element.alt ?? ''}
          className={css`
            display: block;
            max-width: 100%;
            max-height: 20em;
            box-shadow: ${selected && focused ? '0 0 0 3px #B4D5FF' : 'none'};
          `}
        />
        <Button
          active
          onPointerDown={event => {
            event.preventDefault()
          }}
          onClick={() => Transforms.removeNodes(editor, { at: path })}
          className={css`
            display: ${selected && focused ? 'inline' : 'none'};
            position: absolute;
            top: 0.5em;
            left: 0.5em;
            background-color: white;
          `}
        >
          <Icon>delete</Icon>
        </Button>
      </div>
    </div>
  )
}
const InsertImageButton = () => {
  const editor = useSlateStatic()
  return (
    <Button
      onPointerDown={event => event.preventDefault()}
      onClick={() => {
        const url = window.prompt('Enter the URL of the image:')
        if (url && !isImageUrl(url)) {
          alert('URL is not an image')
          return
        }
        url && insertImage(editor, url)
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
        text: 'In addition to nodes that contain editable text, you can also create other types of nodes, like images or videos.',
      },
    ],
  },
  {
    type: 'image',
    url: 'https://images.unsplash.com/photo-1532450106241-ed30d951fbb5?w=1200&q=80',
    alt: 'A forested valley below a rocky mountain peak',
    children: [{ text: '' }],
  },
  {
    type: 'paragraph',
    children: [
      {
        text: 'This example shows images in action. It features two ways to add images. You can either add an image via the toolbar icon above, or if you want in on a little secret, copy an image URL to your clipboard and paste it anywhere in the editor!',
      },
    ],
  },
  {
    type: 'paragraph',
    children: [
      {
        text: 'You can delete images with the cross in the top left. Try deleting this sheep:',
      },
    ],
  },
  {
    type: 'image',
    url: 'https://images.unsplash.com/photo-1589229137277-70d507f80b8f?w=1200&q=80',
    alt: 'A sheep bleating in a heather field',
    children: [{ text: '' }],
  },
]
export default ImagesExample
