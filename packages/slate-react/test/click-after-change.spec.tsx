import React from 'react'
import { act, fireEvent, render } from '@testing-library/react'
import { createEditor, Descendant, Editor, Element, Transforms } from 'slate'
import {
  Editable,
  ReactEditor,
  RenderElementProps,
  Slate,
  withReact,
} from '../src'

describe('clicking inside the editor', () => {
  it('ignores a click whose handler already replaced the clicked element', async () => {
    const editor = withReact(createEditor())
    const initialValue: Descendant[] = [
      { type: 'code', lang: 'js', children: [{ text: 'x' }] } as Element,
    ]
    const renderElement = ({
      attributes,
      children,
      element,
    }: RenderElementProps) => (
      <div {...attributes}>
        <span contentEditable={false}>
          <button
            type="button"
            onClick={() =>
              Transforms.setNodes(editor, { lang: 'ts' } as Partial<Element>, {
                at: ReactEditor.findPath(editor, element),
              })
            }
          >
            {(element as any).lang}
          </button>
        </span>
        {children}
      </div>
    )
    const errors: unknown[] = []
    const { getByRole } = render(
      <Slate editor={editor} initialValue={initialValue}>
        <Editable renderElement={renderElement} />
      </Slate>
    )
    await act(async () => {
      try {
        fireEvent.click(getByRole('button'))
      } catch (error) {
        errors.push(error)
      }
    })
    expect(errors).toEqual([])
    expect((Editor.node(editor, [0])[0] as any).lang).toBe('ts')
  })
  it('ignores a click whose handler already replaced the clicked text', async () => {
    const editor = withReact(createEditor())
    const initialValue: Descendant[] = [
      { children: [{ text: 'ab' }] } as Element,
    ]
    const errors: unknown[] = []
    const { getByRole } = render(
      <Slate editor={editor} initialValue={initialValue}>
        <Editable
          renderLeaf={({ attributes, children }) => (
            <span {...attributes}>
              {children}
              <span contentEditable={false}>
                <button
                  type="button"
                  onClick={() =>
                    Transforms.insertText(editor, 'c', {
                      at: { path: [0, 0], offset: 2 },
                    })
                  }
                >
                  suggest
                </button>
              </span>
            </span>
          )}
        />
      </Slate>
    )
    await act(async () => {
      try {
        fireEvent.click(getByRole('button'))
      } catch (error) {
        errors.push(error)
      }
    })
    expect(errors).toEqual([])
    expect(Editor.string(editor, [])).toBe('abc')
  })
})
