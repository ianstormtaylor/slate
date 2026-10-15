import React from 'react'
import { createEditor, Transforms } from 'slate'
import { render, act } from '@testing-library/react'
import { Slate, withReact, Editable } from '../src'

describe('placeholder accessibility', () => {
  beforeEach(() => jest.useFakeTimers())
  afterEach(() => jest.useRealTimers())

  const renderEditor = (props: React.ComponentProps<typeof Editable> = {}) => {
    const editor = withReact(createEditor())
    const { container } = render(
      <Slate editor={editor} initialValue={[{ children: [{ text: '' }] }]}>
        <Editable placeholder="Type here" {...props} />
      </Slate>
    )
    act(() => {
      jest.runAllTimers()
    })
    const root = container.querySelector('[data-slate-editor]')!
    return { editor, container, root }
  }

  it('exposes the placeholder as aria-placeholder on the textbox', () => {
    const { root } = renderEditor()

    expect(root.getAttribute('aria-placeholder')).toBe('Type here')
  })

  it('hides the visual placeholder from assistive technology', () => {
    const { container } = renderEditor()
    const placeholder = container.querySelector('[data-slate-placeholder]')

    expect(placeholder?.getAttribute('aria-hidden')).toBe('true')
  })

  it('removes aria-placeholder once the editor has content', async () => {
    const { editor, root } = renderEditor()

    await act(async () => {
      Transforms.insertText(editor, 'a', { at: { path: [0, 0], offset: 0 } })
    })

    expect(root.hasAttribute('aria-placeholder')).toBe(false)
  })

  it('lets an explicit aria-placeholder prop win', () => {
    const { root } = renderEditor({ 'aria-placeholder': 'Write a comment' })

    expect(root.getAttribute('aria-placeholder')).toBe('Write a comment')
  })

  it('forwards other aria attributes to the editor root', () => {
    const { root } = renderEditor({
      'aria-label': 'Comment',
      'aria-autocomplete': 'list',
    })

    expect(root.getAttribute('aria-label')).toBe('Comment')
    expect(root.getAttribute('aria-autocomplete')).toBe('list')
  })
})
