import React from 'react'
import { createEditor, Descendant, Editor, Element, Transforms } from 'slate'
import { act, render } from '@testing-library/react'
import { Slate, withReact, Editable, RenderLeafProps } from '../src'

const setup = (
  initialValue: object[],
  isInline: (element: Element & { type?: string }) => boolean = () => false
) => {
  const editor = withReact(createEditor())
  editor.isInline = isInline
  const rendered: string[] = []
  const renderLeaf = ({ attributes, children, text }: RenderLeafProps) => {
    rendered.push(text.text)
    return <span {...attributes}>{children}</span>
  }
  const { container } = render(
    <Slate
      editor={editor}
      initialValue={initialValue as unknown as Descendant[]}
    >
      <Editable renderLeaf={renderLeaf} />
    </Slate>
  )
  rendered.length = 0
  return { editor, rendered, container }
}

describe('sibling text nodes', () => {
  it('re-render only the text that changed', async () => {
    const { editor, rendered } = setup([
      {
        type: 'paragraph',
        children: [
          { text: 'one', bold: true },
          { text: 'two' },
          { text: 'three', italic: true },
        ],
      },
    ])

    await act(async () => {
      Transforms.insertText(editor, '!', { at: { path: [0, 1], offset: 3 } })
    })

    expect(rendered).toEqual(['two!'])
  })

  it('re-render when the block properties change', async () => {
    const { editor, rendered } = setup([
      {
        type: 'paragraph',
        children: [{ text: 'one', bold: true }, { text: 'two' }],
      },
    ])

    await act(async () => {
      Transforms.setNodes(editor, { type: 'heading' } as Partial<Element>, {
        at: [0],
      })
    })

    expect(rendered.sort()).toEqual(['one', 'two'])
  })

  it('re-render the old last text when a sibling is added after it', async () => {
    const { editor, rendered } = setup([
      {
        type: 'paragraph',
        children: [{ text: 'one', bold: true }],
      },
    ])

    await act(async () => {
      Transforms.insertNodes(
        editor,
        { text: 'two', italic: true } as unknown as Descendant,
        {
          at: [0, 1],
        }
      )
    })

    expect(rendered.sort()).toEqual(['one', 'two'])
  })

  it('keeps the line break in the last text when the block empties', async () => {
    const { editor, container } = setup(
      [
        {
          type: 'paragraph',
          children: [
            { text: '' },
            { type: 'link', children: [{ text: 'x' }] },
            { text: '' },
          ],
        },
      ],
      element => element.type === 'link'
    )

    await act(async () => {
      Transforms.removeNodes(editor, { at: [0, 1] })
    })

    expect(Editor.string(editor, [0])).toBe('')
    expect(
      container.querySelectorAll('[data-slate-zero-width="n"]')
    ).toHaveLength(1)
  })
})
