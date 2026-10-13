import React from 'react'
import {
  createEditor,
  Descendant,
  Editor,
  Element,
  Range,
  Transforms,
} from 'slate'
import { act, render } from '@testing-library/react'
import { Editable, RenderElementProps, Slate, withReact } from '../src'

const node = (type: string, children: Descendant[]): Element =>
  ({ type, children }) as Element
const item = (text: string) => node('li', [{ text }])
const list = (type: string) => node(type, [item('one'), item('two')])

const renderElement = ({
  attributes,
  children,
  element,
}: RenderElementProps) => {
  const { type, start } = element as Element & { type: string; start?: number }
  switch (type) {
    case 'ol':
      return (
        <ol {...attributes} start={start}>
          {children}
        </ol>
      )
    case 'ul':
      return <ul {...attributes}>{children}</ul>
    case 'li':
      return <li {...attributes}>{children}</li>
    case 'link':
      return (
        <a {...attributes} href="https://example.com">
          {children}
        </a>
      )
    case 'mention':
      return (
        <span {...attributes} contentEditable={false}>
          {children}@name
        </span>
      )
    case 'table':
      return (
        <table {...attributes}>
          <tbody>{children}</tbody>
        </table>
      )
    case 'tr':
      return <tr {...attributes}>{children}</tr>
    case 'td':
      return <td {...attributes}>{children}</td>
    default:
      return <p {...attributes}>{children}</p>
  }
}

const copy = (initialValue: Descendant[], selection?: Range) => {
  const editor = withReact(createEditor())
  editor.isInline = element =>
    ['link', 'mention'].includes((element as Element & { type: string }).type)
  editor.isVoid = element =>
    (element as Element & { type: string }).type === 'mention'
  render(
    <Slate editor={editor} initialValue={initialValue}>
      <Editable renderElement={renderElement} />
    </Slate>
  )
  act(() => Transforms.select(editor, selection ?? Editor.range(editor, [])))
  const data: Record<string, string> = {}
  editor.setFragmentData({
    getData: (type: string) => data[type] || '',
    setData: (type: string, value: string) => {
      data[type] = value
    },
  } as unknown as DataTransfer)
  const html = document.createElement('div')
  html.innerHTML = data['text/html']
  return { html, data, fragment: editor.getFragment() }
}

describe('copying lists as HTML', () => {
  it.each(['ol', 'ul'])('keeps the %s wrapper for a whole list', type => {
    const { html, data, fragment } = copy([list(type)])
    expect(html.querySelectorAll(`:scope > ${type} > li`)).toHaveLength(2)
    expect(html.textContent).toBe('onetwo')
    expect(
      JSON.parse(decodeURIComponent(atob(data['application/x-slate-fragment'])))
    ).toEqual(fragment)
    expect(html.querySelector('[data-slate-fragment]')).not.toBeNull()
  })

  it('keeps an ordered list start attribute for one partial item', () => {
    const initialValue = [{ ...list('ol'), start: 4 }]
    const { html } = copy(initialValue, {
      anchor: { path: [0, 1, 0], offset: 1 },
      focus: { path: [0, 1, 0], offset: 3 },
    })
    expect(html.querySelector('ol')?.getAttribute('start')).toBe('4')
    expect(html.querySelectorAll('ol > li')).toHaveLength(1)
    expect(html.textContent).toBe('wo')
  })

  it('keeps nested list ancestry without unselected text', () => {
    const { html } = copy(
      [node('ol', [node('li', [node('p', [{ text: 'outer' }]), list('ul')])])],
      {
        anchor: { path: [0, 0, 1, 0, 0], offset: 0 },
        focus: { path: [0, 0, 1, 1, 0], offset: 3 },
      }
    )
    expect(html.querySelectorAll('ol > li > ul > li')).toHaveLength(2)
    expect(html.textContent).toBe('onetwo')
  })

  it('keeps links inside list items', () => {
    const { html } = copy(
      [
        node('ul', [
          node('li', [
            { text: '' },
            node('link', [{ text: 'link' }]),
            { text: '' },
          ]),
        ]),
      ],
      {
        anchor: { path: [0, 0, 1, 0], offset: 0 },
        focus: { path: [0, 0, 1, 0], offset: 4 },
      }
    )
    expect(html.querySelector('ul > li > a')?.textContent).toBe('link')
  })

  it.each(['start', 'end'])(
    'keeps a list whose selection has an inline void at the %s',
    edge => {
      const children =
        edge === 'start'
          ? [{ text: '' }, node('mention', [{ text: '' }]), { text: ' after' }]
          : [{ text: 'before ' }, node('mention', [{ text: '' }]), { text: '' }]
      const selection =
        edge === 'start'
          ? {
              anchor: { path: [0, 0, 1, 0], offset: 0 },
              focus: { path: [0, 0, 2], offset: 6 },
            }
          : {
              anchor: { path: [0, 0, 0], offset: 0 },
              focus: { path: [0, 0, 1, 0], offset: 0 },
            }
      const { html } = copy([node('ul', [node('li', children)])], selection)
      expect(html.querySelectorAll('ul > li')).toHaveLength(1)
      expect(html.textContent).toContain('@name')
      expect(html.querySelectorAll('[data-slate-void]')).toHaveLength(1)
    }
  )

  it('does not duplicate list wrappers when copying surrounding blocks', () => {
    const { html } = copy([
      node('p', [{ text: 'before' }]),
      list('ul'),
      node('p', [{ text: 'after' }]),
    ])
    expect(html.querySelectorAll('ul')).toHaveLength(1)
    expect(html.querySelectorAll('li')).toHaveLength(2)
    expect(html.textContent).toBe('beforeonetwoafter')
  })

  it('does not add a list or table to ordinary table-cell text', () => {
    const { html } = copy([
      node('table', [
        node('tr', [node('td', [node('p', [{ text: 'cell' }])])]),
      ]),
    ])
    expect(html.querySelector('ol, ul, li, table')).toBeNull()
    expect(html.textContent).toBe('cell')
  })
})
