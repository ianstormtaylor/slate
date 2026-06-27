import React, { useRef } from 'react'
import { createEditor, Element, Transforms } from 'slate'
import { render, act } from '@testing-library/react'
import {
  Slate,
  withReact,
  Editable,
  useSelected,
  useSlateStatic,
  RenderElementProps,
  ReactEditor,
} from '../src'
import { ElementContext } from '../src/hooks/use-element'

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

  // Regression test for https://github.com/ianstormtaylor/slate/issues/6053
  describe('when the referenced element has been removed', () => {
    // A still-mounted component that keeps referencing an element even after it
    // has been removed from the editor, mimicking an element that removes
    // "itself" while a component holding its reference is still rendering.
    const StaleConsumer = ({
      captureSelected,
    }: {
      captureSelected: (selected: boolean) => void
    }) => {
      const editor = useSlateStatic()
      const elementRef = useRef<Element>()

      if (!elementRef.current) {
        const { children } = editor
        elementRef.current = children[children.length - 1] as Element
      }

      return (
        <ElementContext.Provider value={elementRef.current}>
          <SelectedProbe captureSelected={captureSelected} />
        </ElementContext.Provider>
      )
    }

    const SelectedProbe = ({
      captureSelected,
    }: {
      captureSelected: (selected: boolean) => void
    }) => {
      captureSelected(useSelected())
      return null
    }

    const run = async (chunking: boolean) => {
      const editor = withReact(createEditor())

      if (chunking) {
        editor.getChunkSize = () => 3
      }

      let selected: boolean | undefined
      const captureSelected = (value: boolean) => {
        selected = value
      }

      render(
        <Slate
          editor={editor}
          initialValue={[
            { children: [{ text: 'one' }] },
            { children: [{ text: 'two' }] },
            { children: [{ text: 'three' }] },
          ]}
        >
          <Editable />
          <StaleConsumer captureSelected={captureSelected} />
        </Slate>
      )

      // Keep a selection on a node that survives the removal below, so the
      // selector runs past its early `!editor.selection` return.
      await act(async () => {
        Transforms.select(editor, [0, 0])
      })

      // Removing the last element leaves `StaleConsumer` referencing a node
      // whose path can no longer be resolved. `useSelected` must return `false`
      // rather than throwing.
      await act(async () => {
        Transforms.removeNodes(editor, { at: [2] })
      })

      expect(selected).toBe(false)
    }

    it('returns false instead of throwing (without chunking)', () => run(false))

    it('returns false instead of throwing (with chunking)', () => run(true))
  })
})
