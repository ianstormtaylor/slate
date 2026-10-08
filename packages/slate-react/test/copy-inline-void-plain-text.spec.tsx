import React from 'react'
import { createEditor, Descendant, Editor, Transforms } from 'slate'
import { render, act } from '@testing-library/react'
import {
  Slate,
  withReact,
  Editable,
  ReactEditor,
  RenderElementProps,
} from '../src'

type Mention = { type: 'mention'; character: string }

const renderElement = ({
  attributes,
  children,
  element,
}: RenderElementProps) =>
  (element as Partial<Mention>).type === 'mention' ? (
    <span {...attributes} contentEditable={false}>
      <div>@{(element as unknown as Mention).character}</div>
      {children}
    </span>
  ) : (
    <p {...attributes}>{children}</p>
  )

const copyAll = (initialValue: Descendant[]) => {
  const editor = withReact(createEditor())
  editor.isInline = element => (element as Partial<Mention>).type === 'mention'
  editor.isVoid = element => (element as Partial<Mention>).type === 'mention'
  render(
    <Slate editor={editor} initialValue={initialValue}>
      <Editable renderElement={renderElement} />
    </Slate>
  )
  act(() => {
    Transforms.select(editor, Editor.range(editor, []))
  })
  const data: Record<string, string> = {}
  ReactEditor.setFragmentData(editor, {
    setData: (type: string, value: string) => {
      data[type] = value
    },
  } as unknown as DataTransfer)
  return data
}

describe('copying inline voids as plain text', () => {
  it('keeps a mention on the same line as the text around it', () => {
    const data = copyAll([
      {
        children: [
          { text: 'like ' },
          { type: 'mention', character: 'R2-D2', children: [{ text: '' }] },
          { text: ' or ' },
          { type: 'mention', character: 'Mace', children: [{ text: '' }] },
          { text: '!' },
        ],
      },
      { children: [{ text: 'next' }] },
    ] as Descendant[])

    expect(data['text/plain']).toBe('like @R2-D2 or @Mace!\nnext\n')
  })
})
