import React, { useState, useRef, useEffect } from 'react'
import ReactDOM from 'react-dom'
import { Editable, withReact, useSlate } from 'slate-react'
import { Editor } from 'slate'
import { css } from 'emotion'
import { withHistory } from 'slate-history'

import { Button, Icon, Menu } from '../components'

class HoveringMenuEditor extends withHistory(withReact(Editor)) {
  onBeforeInput(event) {
    switch (event.inputType) {
      case 'formatBold':
        return this.toggleMarks([{ type: 'bold' }])
      case 'formatItalic':
        return this.toggleMarks([{ type: 'italic' }])
      case 'formatUnderline':
        return this.toggleMarks([{ type: 'underlined' }])
      default:
        return super.onBeforeInput(event)
    }
  }
}

const HoveringMenuExample = () => {
  const [value, setValue] = useState(initialValue)
  const editor = useSlate(HoveringMenuEditor)
  const ref = useRef()

  useEffect(() => {
    const el = ref.current
    const { selection } = value

    if (
      !el ||
      !selection ||
      !editor.isFocused() ||
      !editor.isExpanded() ||
      editor.getText(selection) === ''
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
        placeholder="Enter some text..."
        editor={editor}
        value={value}
        renderMark={props => <Mark {...props} />}
        onChange={setValue}
      />
    </div>
  )
}

const Portal = ({ children }) => ReactDOM.createPortal(children, document.body)

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
  const marks = editor.getActiveMarks()
  const isActive = marks.some(m => m.type === type)
  return (
    <Button
      reversed
      active={isActive}
      onMouseDown={event => {
        event.preventDefault()
        editor.toggleMarks([{ type }])
      }}
    >
      <Icon>{icon}</Icon>
    </Button>
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
      nodes: [
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
