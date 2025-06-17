import React from 'react'
import { createEditor, Transforms } from 'slate'
import { render, act } from '@testing-library/react'
import {
  Slate,
  withReact,
  Editable,
  useSelected,
  RenderElementProps,
  ReactEditor,
} from '../src'

let editor: ReactEditor
let elementSelectedRenders: Record<string, boolean[] | undefined>

const clearRenders = () =>
  Object.values(elementSelectedRenders).forEach(selectedRenders => {
    if (selectedRenders) {
      selectedRenders.length = 0
    }
  })

const initialValue = () => [
  {
    id: '0',
    children: [
      { id: '0.0', children: [{ text: '' }] },
      { id: '0.1', children: [{ text: '' }] },
      { id: '0.2', children: [{ text: '' }] },
    ],
  },
  { id: '1', children: [{ text: '' }] },
  { id: '2', children: [{ text: '' }] },
]

describe('useSelected', () => {
  const withChunking = (chunking: boolean) => {
    beforeEach(() => {
      editor = withReact(createEditor())

      if (chunking) {
        editor.getChunkSize = () => 3
      }

      elementSelectedRenders = {}

      const renderElement = ({
        element,
        attributes,
        children,
      }: RenderElementProps) => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const selected = useSelected()
        const { id } = element as any

        let selectedRenders = elementSelectedRenders[id]

        if (!selectedRenders) {
          selectedRenders = []
          elementSelectedRenders[id] = selectedRenders
        }

        selectedRenders.push(selected)

        return <div {...attributes}>{children}</div>
      }

      render(
        <Slate editor={editor} initialValue={initialValue()}>
          <Editable renderElement={renderElement} />
        </Slate>
      )
    })

    it('returns false initially', () => {
      expect(elementSelectedRenders).toEqual({
        '0': [false],
        '0.0': [false],
        '0.1': [false],
        '0.2': [false],
        '1': [false],
        '2': [false],
      })
    })

    it('re-renders elements when it becomes true or false', async () => {
      clearRenders()

      await act(async () => {
        Transforms.select(editor, [0, 0])
      })

      expect(elementSelectedRenders).toEqual({
        '0': [true],
        '0.0': [true],
        '0.1': [],
        '0.2': [],
        '1': [],
        '2': [],
      })

      clearRenders()

      await act(async () => {
        Transforms.select(editor, [2])
      })

      expect(elementSelectedRenders).toEqual({
        '0': [false],
        '0.0': [false],
        '0.1': [],
        '0.2': [],
        '1': [],
        '2': [true],
      })
    })

    it('returns true for elements in the middle of the selection', async () => {
      clearRenders()

      await act(async () => {
        Transforms.select(editor, {
          anchor: { path: [2, 0], offset: 0 },
          focus: { path: [0, 1, 0], offset: 0 },
        })
      })

      expect(elementSelectedRenders).toEqual({
        '0': [true],
        '0.0': [],
        '0.1': [true],
        '0.2': [true],
        '1': [true],
        '2': [true],
      })
    })

    it('remains true when the path changes', async () => {
      clearRenders()

      await act(async () => {
        Transforms.select(editor, { path: [2, 0], offset: 0 })
      })

      expect(elementSelectedRenders).toEqual({
        '0': [],
        '0.0': [],
        '0.1': [],
        '0.2': [],
        '1': [],
        '2': [true],
      })

      clearRenders()

      await act(async () => {
        Transforms.insertNodes(
          editor,
          { id: 'new', children: [{ text: '' }] } as any,
          { at: [2] }
        )
      })

      expect(elementSelectedRenders).toEqual({
        '0': [],
        '0.0': [],
        '0.1': [],
        '0.2': [],
        '1': [],
        new: [false],
        '2': [], // Remains true, no rerender
      })
    })
  }

  describe('without chunking', () => {
    withChunking(false)
  })

  describe('with chunking', () => {
    withChunking(true)
  })
})
