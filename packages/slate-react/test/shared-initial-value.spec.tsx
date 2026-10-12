import React from 'react'
import { createEditor, Descendant, Transforms } from 'slate'
import { act, render } from '@testing-library/react'
import { Editable, ReactEditor, Slate, withReact } from '../src'

const value = () =>
  [{ children: [{ text: 'start' }] }] as unknown as Descendant[]

const renderTwo = (first: Descendant[], second: Descendant[]) => {
  const one = withReact(createEditor())
  const two = withReact(createEditor())
  const { container } = render(
    <>
      <Slate editor={one} initialValue={first}>
        <Editable data-testid="one" />
      </Slate>
      <Slate editor={two} initialValue={second}>
        <Editable data-testid="two" />
      </Slate>
    </>
  )
  return { one, two, container }
}

describe('editors sharing an initialValue', () => {
  test('both render and keep separate documents', async () => {
    const shared = value()
    const { one, two, container } = renderTwo(shared, shared)

    await act(async () => {
      Transforms.insertText(one, 'X', { at: { path: [0, 0], offset: 0 } })
    })

    const [first, second] = Array.from(
      container.querySelectorAll('[data-slate-editor]')
    )
    expect(first.textContent).toBe('Xstart')
    expect(second.textContent).toBe('start')
    expect(ReactEditor.findPath(one, one.children[0])).toEqual([0])
    expect(ReactEditor.findPath(two, two.children[0])).toEqual([0])
  })

  test('the first editor keeps the objects it was given', () => {
    const shared = value()
    const { one, two } = renderTwo(shared, shared)

    expect(one.children[0]).toBe(shared[0])
    expect(two.children[0]).not.toBe(shared[0])
    expect(two.children).toEqual(shared)
  })

  test('separate values are not copied', () => {
    const first = value()
    const second = value()
    const { one, two } = renderTwo(first, second)

    expect(one.children[0]).toBe(first[0])
    expect(two.children[0]).toBe(second[0])
  })
})
