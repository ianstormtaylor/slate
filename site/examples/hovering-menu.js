import React, { useState, useMemo, useRef, useEffect } from 'react'
import { Editable, ReactEditor, withReact } from 'slate-react'
import { Editor, createEditor } from 'slate'
import { css } from 'emotion'
import { withHistory } from 'slate-history'

import { Button, Icon, Menu, Portal } from '../components'
import { Range } from 'slate'

const HoveringMenuExample = () => {
  const [value, setValue] = useState(initialValue)
  const ref = useRef()
  const editor = useMemo(
    () => withMarks(withHistory(withReact(createEditor()))),
    []
  )

  useEffect(() => {
    const el = ref.current
    const { selection } = value

    if (
      !el ||
      !selection ||
      !ReactEditor.isFocused(editor) ||
      Range.isCollapsed(selection) ||
      Editor.text(editor, selection) === ''
    ) {
      el.removeAttribute('style')
      return
    }

    const domSelection = window.getSelection()
    const domRange = domSelection.getRangeAt(0)
    const rect = domRange.getBoundingClientRect()
    el.style.opacity = 1
    el.style.top = `${rect.top + window.pageYOffset - el.offsetHeight}px`

    el.style.left = `${rect.left +
      window.pageXOffset -
      el.offsetWidth / 2 +
      rect.width / 2}px`
  })

  return (
    <div>
      <Portal>
        <Menu
          ref={ref}
          className={css`
            padding: 8px 7px 6px;
            position: absolute;
            z-index: 1;
            top: -10000px;
            left: -10000px;
            margin-top: -6px;
            opacity: 0;
            background-color: #222;
            border-radius: 4px;
            transition: opacity 0.75s;
          `}
        >
          <MarkButton editor={editor} type="bold" icon="format_bold" />
          <MarkButton editor={editor} type="italic" icon="format_italic" />
          <MarkButton
            editor={editor}
            type="underlined"
            icon="format_underlined"
          />
        </Menu>
      </Portal>
      <Editable
        editor={editor}
        value={value}
        renderMark={props => <Mark {...props} />}
        onChange={v => setValue(v)}
        placeholder="Enter some text..."
        onDOMBeforeInput={event => {
          switch (event.inputType) {
            case 'formatBold':
              return editor.exec({ type: 'toggle_mark', mark: 'bold' })
            case 'formatItalic':
              return editor.exec({ type: 'toggle_mark', mark: 'italic' })
            case 'formatUnderline':
              return editor.exec({ type: 'toggle_mark', mark: 'underlined' })
          }
        }}
      />
    </div>
  )
}

const withMarks = editor => {
  const { exec } = editor

  editor.exec = command => {
    switch (command.type) {
      case 'toggle_mark': {
        const { mark } = command
        const isActive = isMarkActive(editor, mark.type)
        const cmd = isActive ? 'remove_mark' : 'add_mark'
        editor.exec({ type: cmd, mark })
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

const isMarkActive = (editor, type) => {
  const marks = Editor.activeMarks(editor)
  const isActive = marks.some(m => m.type === type)
  return isActive
}

const Mark = ({ attributes, children, mark }) => {
  switch (mark.type) {
    case 'bold':
      return <strong {...attributes}>{children}</strong>
    case 'italic':
      return <em {...attributes}>{children}</em>
    case 'underlined':
      return <u {...attributes}>{children}</u>
  }
}

const MarkButton = ({ editor, type, icon }) => {
  return (
    <Button
      reversed
      active={isMarkActive(editor, type)}
      onMouseDown={event => {
        event.preventDefault()
        editor.exec({ type: 'toggle_mark', mark: { type } })
      }}
    >
      <Icon>{icon}</Icon>
    </Button>
  )
}

const initialValue = {
  selection: null,
  annotations: {},
  children: [
    {
      children: [
        {
          text:
            'This example shows how you can make a hovering menu appear above your content, which you can use to make text ',
          marks: [],
        },
        {
          text: 'bold',
          marks: [{ type: 'bold' }],
        },
        {
          text: ', ',
          marks: [],
        },
        {
          text: 'italic',
          marks: [{ type: 'italic' }],
        },
        {
          text: ', or anything else you might want to do!',
          marks: [],
        },
      ],
    },
    {
      children: [
        {
          text: 'Try it out yourself! Just ',
          marks: [],
        },
        {
          text: 'select any piece of text and the menu will appear',
          marks: [{ type: 'bold' }, { type: 'italic' }],
        },
        {
          text: '.',
          marks: [],
        },
      ],
    },
  ],
}

export default HoveringMenuExample
