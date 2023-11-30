import React, { useState, useMemo } from 'react'
import { Transforms, createEditor, Descendant } from 'slate'
import { Slate, Editable, useSlateStatic, withReact } from 'slate-react'
import { withHistory } from 'slate-history'
import { css } from '@emotion/css'

import RichTextEditor from './richtext'
import { Button, Icon, Toolbar } from '../components'
import { EditableVoidElement } from './custom-types.d'

const EditableVoidsExample = () => {
  const editor = useMemo(
    () => withEditableVoids(withHistory(withReact(createEditor()))),
    []
  )

  return (
    <Slate editor={editor} initialValue={initialValue}>
      <Toolbar>
        <InsertEditableVoidButton />
      </Toolbar>

      <Editable
        renderElement={props => <Element {...props} />}
        placeholder="Enter some text..."
      />
    </Slate>
  )
}

const withEditableVoids = editor => {
  const { isVoid } = editor

  editor.isVoid = element => {
    return element.type === 'editable-void' ? true : isVoid(element)
  }

  return editor
}

const insertEditableVoid = editor => {
  const text = { text: '' }
  const voidNode: EditableVoidElement = {
    type: 'editable-void',
    children: [text],
  }
  Transforms.insertNodes(editor, voidNode)
}

const Element = props => {
  const { attributes, children, element } = props

  switch (element.type) {
    case 'editable-void':
      return <EditableVoid {...props} />
    default:
      return <p {...attributes}>{children}</p>
  }
}

const unsetWidthStyle = css`
  width: unset;
`

const EditableVoid = ({ attributes, children, element }) => {
  const [inputValue, setInputValue] = useState('')

  return (
    // Need contentEditable=false or Firefox has issues with certain input types.
    <div {...attributes} contentEditable={false}>
      <div
        className={css`
          box-shadow: 0 0 0 3px #ddd;
          padding: 8px;
        `}
      >
        <h4>Name:</h4>
        <input
          className={css`
            margin: 8px 0;
          `}
          type="text"
          value={inputValue}
          onChange={e => {
            setInputValue(e.target.value)
          }}
        />
        <h4>Left or right handed:</h4>
        <input
          className={unsetWidthStyle}
          type="radio"
          name="handedness"
          value="left"
        />{' '}
        Left
        <br />
        <input
          className={unsetWidthStyle}
          type="radio"
          name="handedness"
          value="right"
        />{' '}
        Right
        <h4>Tell us about yourself:</h4>
        <div
          className={css`
            padding: 20px;
            border: 2px solid #ddd;
          `}
        >
          <RichTextEditor />
        </div>
      </div>
      {children}
    </div>
  )
}

const InsertEditableVoidButton = () => {
  const editor = useSlateStatic()
  return (
    <Button
      onMouseDown={event => {
        event.preventDefault()
        insertEditableVoid(editor)
      }}
    >
      <Icon>add</Icon>
    </Button>
  )
}

const initialValue: Descendant[] = [
  {
    type: 'paragraph',
    children: [
      {
        text: 'In addition to nodes that contain editable text, you can insert void nodes, which can also contain editable elements, inputs, or an entire other Slate editor.',
      },
    ],
  },
  {
    type: 'editable-void',
    children: [{ text: '' }],
  },
  {
    type: 'paragraph',
    children: [
      {
        text: '',
      },
    ],
  },
]

export default EditableVoidsExample
