/* eslint-disable import/no-deprecated */
import React from 'react'
import { Transforms, createEditor } from 'slate'
import { render, act } from '@testing-library/react'
import '@testing-library/jest-dom'
import { Slate, withReact, Editable, useSlateWithV } from '../src'

describe('useSlateWithV', () => {
  const ShowVersion = () => {
    const { v } = useSlateWithV()
    return <>V = {v}</>
  }

  it('tracks a global `v` counter for the editor', async () => {
    const editor = withReact(createEditor())
    const initialValue = [{ type: 'block', children: [{ text: 'test' }] }]

    const { getByText, rerender } = render(
      <Slate editor={editor} initialValue={initialValue}>
        <Editable />
        <p>
          First: <ShowVersion key={1} />
        </p>
        <p>
          Second: <ShowVersion key={2} />
        </p>
      </Slate>
    )

    expect(getByText('First: V = 0')).toBeInTheDocument()
    expect(getByText('Second: V = 0')).toBeInTheDocument()

    await act(async () => {
      Transforms.insertText(editor, '!', { at: { path: [0, 0], offset: 4 } })
    })

    expect(getByText('First: V = 1')).toBeInTheDocument()
    expect(getByText('Second: V = 1')).toBeInTheDocument()

    rerender(
      <Slate editor={editor} initialValue={initialValue}>
        <Editable />
        <p>
          First: <ShowVersion key={1} />
        </p>
        <p>
          Second: <ShowVersion key={2} />
        </p>
        <p>
          Third: <ShowVersion key={3} />
        </p>
      </Slate>
    )

    expect(getByText('First: V = 1')).toBeInTheDocument()
    expect(getByText('Second: V = 1')).toBeInTheDocument()
    expect(getByText('Third: V = 1')).toBeInTheDocument()
  })
})
