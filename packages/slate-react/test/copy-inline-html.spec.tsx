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

const renderElement = ({
  attributes,
  children,
  element,
}: RenderElementProps) =>
  (element as { type?: string }).type === 'link' ? (
    <a {...attributes} href="https://example.com">
      {children}
    </a>
  ) : (
    <p {...attributes}>{children}</p>
  )

const copy = (initialValue: Descendant[], select: (editor: Editor) => void) => {
  const editor = withReact(createEditor())
  editor.isInline = element => (element as { type?: string }).type === 'link'
  render(
    <Slate editor={editor} initialValue={initialValue}>
      <Editable renderElement={renderElement} />
    </Slate>
  )
  act(() => select(editor))
  const data: Record<string, string> = {}
  ReactEditor.setFragmentData(editor, {
    setData: (type: string, value: string) => {
      data[type] = value
    },
  } as unknown as DataTransfer)
  return data
}

const paragraphWithLink = [
  {
    children: [
      { text: 'see ' },
      { type: 'link', children: [{ text: 'the docs' }] },
      { text: ' here' },
    ],
  },
] as Descendant[]

describe('copying text inside an inline', () => {
  it('keeps the inline element around the copied text in text/html', () => {
    const data = copy(paragraphWithLink, editor =>
      Transforms.select(editor, Editor.range(editor, [0, 1]))
    )
    const html = document.createElement('div')
    html.innerHTML = data['text/html']
    const link = html.querySelector('a')

    expect(link?.getAttribute('href')).toBe('https://example.com')
    expect(link?.textContent).toBe('the docs')
    expect(link?.querySelector('[data-slate-fragment]')).not.toBeNull()
    expect(data['text/plain']).toBe('the docs')
  })

  it('does not wrap text copied outside any inline', () => {
    const data = copy(paragraphWithLink, editor =>
      Transforms.select(editor, {
        anchor: { path: [0, 0], offset: 0 },
        focus: { path: [0, 0], offset: 3 },
      })
    )

    expect(data['text/html']).not.toContain('<a')
  })
})
