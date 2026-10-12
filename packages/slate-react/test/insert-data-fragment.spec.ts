import { createEditor, Descendant, Node } from 'slate'
import { withReact } from '../src'

const dataTransfer = (data: Record<string, string>) =>
  ({ getData: (type: string) => data[type] ?? '' }) as unknown as DataTransfer

const setup = () => {
  const editor = withReact(createEditor())
  editor.children = [
    { type: 'paragraph', children: [{ text: '' }] } as Descendant,
  ]
  editor.selection = {
    anchor: { path: [0, 0], offset: 0 },
    focus: { path: [0, 0], offset: 0 },
  }
  return editor
}

describe('insertData with data-slate-fragment', () => {
  test('pastes as text when the attribute only appears in the text', () => {
    const editor = setup()
    const text = 'data-slate-fragment="not-a-fragment"'

    editor.insertData(
      dataTransfer({ 'text/html': `<p>${text}</p>`, 'text/plain': text })
    )

    expect(Node.string(editor)).toBe(text)
  })

  test('pastes the fragment from a real data-slate-fragment attribute', () => {
    const editor = setup()
    const fragment = [{ type: 'paragraph', children: [{ text: 'copied' }] }]
    const encoded = window.btoa(encodeURIComponent(JSON.stringify(fragment)))

    editor.insertData(
      dataTransfer({
        'text/html': `<meta charset="utf-8"><span data-slate-fragment="${encoded}">copied</span>`,
        'text/plain': 'copied',
      })
    )

    expect(Node.string(editor)).toBe('copied')
  })
})
