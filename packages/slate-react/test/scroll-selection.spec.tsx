import React from 'react'
import { act, render } from '@testing-library/react'
import { createEditor, Transforms } from 'slate'
import { Editable, ReactEditor, Slate, withReact } from '../src'

const setup = async () => {
  const editor = withReact(createEditor())
  const scrollSelectionIntoView = jest.fn()
  const initialValue = [
    { type: 'paragraph', children: [{ text: '' }] },
    { type: 'paragraph', children: [{ text: '' }] },
  ]
  render(
    <Slate editor={editor} initialValue={initialValue}>
      <Editable scrollSelectionIntoView={scrollSelectionIntoView} />
    </Slate>
  )
  await act(async () => {
    ReactEditor.focus(editor)
    Transforms.select(editor, { path: [1, 0], offset: 0 })
  })
  scrollSelectionIntoView.mockClear()
  return { editor, scrollSelectionIntoView }
}

test('does not scroll for an edit that did not come from user input', async () => {
  const { editor, scrollSelectionIntoView } = await setup()

  await act(async () => {
    editor.deleteBackward('character')
  })

  expect(editor.children).toHaveLength(1)
  expect(scrollSelectionIntoView).not.toHaveBeenCalled()
})

test('does not scroll an already synchronized selection on a render without input', async () => {
  const { editor, scrollSelectionIntoView } = await setup()

  await act(async () => editor.onChange())

  expect(scrollSelectionIntoView).not.toHaveBeenCalled()
})

test('does not scroll when an edit elsewhere leaves the selection unchanged', async () => {
  const { editor, scrollSelectionIntoView } = await setup()

  await act(async () => {
    Transforms.insertText(editor, 'Elsewhere', {
      at: { path: [0, 0], offset: 0 },
    })
  })

  expect(scrollSelectionIntoView).not.toHaveBeenCalled()
})

test('does not scroll an unfocused editor after its selection moves with an edit', async () => {
  const { editor, scrollSelectionIntoView } = await setup()

  await act(async () => ReactEditor.blur(editor))
  scrollSelectionIntoView.mockClear()
  await act(async () => editor.deleteBackward('character'))

  expect(scrollSelectionIntoView).not.toHaveBeenCalled()
})
