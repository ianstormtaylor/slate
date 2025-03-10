import isHotkey from 'is-hotkey'
import React, { MouseEvent, useCallback, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { Editor, createEditor, Descendant } from 'slate'
import { withHistory } from 'slate-history'
import {
  Editable,
  ReactEditor,
  RenderElementProps,
  RenderLeafProps,
  Slate,
  useSlate,
  withReact,
} from 'slate-react'

import { Button, Icon, Toolbar } from './components'
import { CustomEditor, CustomTextKey } from './custom-types.d'

const HOTKEYS: Record<string, CustomTextKey> = {
  'mod+b': 'bold',
  'mod+i': 'italic',
  'mod+u': 'underline',
  'mod+`': 'code',
}

const IFrameExample = () => {
  const renderElement = useCallback(
    ({ attributes, children }: RenderElementProps) => (
      <p {...attributes}>{children}</p>
    ),
    []
  )
  const renderLeaf = useCallback(
    (props: RenderLeafProps) => <Leaf {...props} />,
    []
  )
  const editor = useMemo(
    () => withHistory(withReact(createEditor())) as CustomEditor,
    []
  )

  const handleBlur = useCallback(() => ReactEditor.deselect(editor), [editor])

  return (
    <Slate editor={editor} initialValue={initialValue}>
      <Toolbar>
        <MarkButton format="bold" icon="format_bold" />
        <MarkButton format="italic" icon="format_italic" />
        <MarkButton format="underline" icon="format_underlined" />
        <MarkButton format="code" icon="code" />
      </Toolbar>
      <IFrame onBlur={handleBlur}>
        <Editable
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          placeholder="Enter some rich text…"
          spellCheck
          autoFocus
          onKeyDown={event => {
            for (const hotkey in HOTKEYS) {
              if (isHotkey(hotkey, event as any)) {
                event.preventDefault()
                const mark = HOTKEYS[hotkey]
                toggleMark(editor, mark)
              }
            }
          }}
        />
      </IFrame>
    </Slate>
  )
}

const toggleMark = (editor: CustomEditor, format: CustomTextKey) => {
  const isActive = isMarkActive(editor, format)
  if (isActive) {
    Editor.removeMark(editor, format)
  } else {
    Editor.addMark(editor, format, true)
  }
}

const isMarkActive = (editor: CustomEditor, format: CustomTextKey) => {
  const marks = Editor.marks(editor)
  return marks ? marks[format] === true : false
}

const Leaf = ({ attributes, children, leaf }: RenderLeafProps) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>
  }

  if (leaf.code) {
    children = <code>{children}</code>
  }

  if (leaf.italic) {
    children = <em>{children}</em>
  }

  if (leaf.underline) {
    children = <u>{children}</u>
  }

  return <span {...attributes}>{children}</span>
}

interface MarkButtonProps {
  format: CustomTextKey
  icon: string
}

const MarkButton = ({ format, icon }: MarkButtonProps) => {
  const editor = useSlate()
  return (
    <Button
      active={isMarkActive(editor, format)}
      onMouseDown={(event: MouseEvent) => {
        event.preventDefault()
        toggleMark(editor, format)
      }}
    >
      <Icon>{icon}</Icon>
    </Button>
  )
}

interface IFrameProps extends React.IframeHTMLAttributes<HTMLIFrameElement> {
  children: React.ReactNode
}

const IFrame = ({ children, ...props }: IFrameProps) => {
  const [iframeBody, setIframeBody] = useState<HTMLElement | null>(null)
  const handleLoad = (e: React.SyntheticEvent<HTMLIFrameElement>) => {
    const iframe = e.target as HTMLIFrameElement
    if (!iframe.contentDocument) return
    setIframeBody(iframe.contentDocument.body)
  }
  return (
    <iframe srcDoc={`<!DOCTYPE html>`} {...props} onLoad={handleLoad}>
      {iframeBody && createPortal(children, iframeBody)}
    </iframe>
  )
}

const initialValue: Descendant[] = [
  {
    type: 'paragraph',
    children: [
      {
        text: 'In this example, the document gets rendered into a controlled ',
      },
      { text: '<iframe>', code: true },
      {
        text: '. This is ',
      },
      {
        text: 'particularly',
        italic: true,
      },
      {
        text: ' useful, when you need to separate the styles for your editor contents from the ones addressing your UI.',
      },
    ],
  },
  {
    type: 'paragraph',
    children: [
      {
        text: 'This also the only reliable method to preview any ',
      },
      {
        text: 'media queries',
        bold: true,
      },
      {
        text: ' in your CSS.',
      },
    ],
  },
]

export default IFrameExample
