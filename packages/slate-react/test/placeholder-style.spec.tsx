import React from 'react'
import { createEditor } from 'slate'
import { render, act } from '@testing-library/react'
import { Slate, withReact, Editable, RenderPlaceholderProps } from '../src'

describe('placeholder style', () => {
  beforeEach(() => jest.useFakeTimers())
  afterEach(() => jest.useRealTimers())

  it('sets the WebKit-prefixed user-select so iOS Safari cannot select it', () => {
    const editor = withReact(createEditor())
    const renderedStyles: React.CSSProperties[] = []
    const renderPlaceholder = ({
      attributes,
      children,
    }: RenderPlaceholderProps) => {
      renderedStyles.push(attributes.style)
      return <span {...attributes}>{children}</span>
    }

    render(
      <Slate editor={editor} initialValue={[{ children: [{ text: '' }] }]}>
        <Editable
          placeholder="Type here"
          renderPlaceholder={renderPlaceholder}
        />
      </Slate>
    )

    act(() => {
      jest.runAllTimers()
    })

    expect(renderedStyles.length).toBeGreaterThan(0)
    expect(renderedStyles.at(-1)).toMatchObject({
      userSelect: 'none',
      WebkitUserSelect: 'none',
    })
  })
})
