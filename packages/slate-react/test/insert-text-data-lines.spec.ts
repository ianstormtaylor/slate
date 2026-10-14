import { createEditor, Descendant, Editor, Range, Transforms } from 'slate'
import { withReact } from '../src'

const dataTransfer = (text: string) =>
  ({
    getData: (type: string) => (type === 'text/plain' ? text : ''),
  }) as unknown as DataTransfer

const pastePerLine = (editor: Editor, text: string) => {
  text.split(/\r\n|\r|\n/).forEach((line, index) => {
    if (index > 0) {
      Transforms.splitNodes(editor, { always: true })
    }
    editor.insertText(line)
  })
}

type Fixture = {
  name: string
  children: object[]
  selection: Range
  marks?: Record<string, unknown>
}

const caret = (path: number[], offset: number): Range => ({
  anchor: { path, offset },
  focus: { path, offset },
})

const fixtures: Fixture[] = [
  {
    name: 'an empty paragraph',
    children: [{ type: 'paragraph', children: [{ text: '' }] }],
    selection: caret([0, 0], 0),
  },
  {
    name: 'the middle of a paragraph followed by another block',
    children: [
      { type: 'heading', children: [{ text: 'before after' }] },
      { type: 'paragraph', children: [{ text: 'next' }] },
    ],
    selection: caret([0, 0], 7),
  },
  {
    name: 'a bold leaf between plain leaves',
    children: [
      {
        type: 'paragraph',
        children: [{ text: 'a' }, { text: 'bold', bold: true }, { text: 'z' }],
      },
    ],
    selection: caret([0, 1], 2),
  },
  {
    name: 'a caret with pending marks',
    children: [{ type: 'paragraph', children: [{ text: 'plain' }] }],
    selection: caret([0, 0], 5),
    marks: { italic: true },
  },
  {
    name: 'a paragraph nested in a list item',
    children: [
      {
        type: 'list',
        children: [
          {
            type: 'item',
            children: [{ type: 'paragraph', children: [{ text: 'one' }] }],
          },
        ],
      },
    ],
    selection: caret([0, 0, 0, 0], 1),
  },
  {
    name: 'an expanded selection across blocks',
    children: [
      { type: 'paragraph', children: [{ text: 'first' }] },
      { type: 'paragraph', children: [{ text: 'second' }] },
    ],
    selection: {
      anchor: { path: [0, 0], offset: 2 },
      focus: { path: [1, 0], offset: 3 },
    },
  },
  {
    name: 'a caret inside a link',
    children: [
      {
        type: 'paragraph',
        children: [
          { text: 'go ' },
          { type: 'link', children: [{ text: 'here' }] },
          { text: '' },
        ],
      },
    ],
    selection: caret([0, 1, 0], 2),
  },
]

const texts = [
  'single line',
  'one\ntwo',
  'one\ntwo\nthree\nfour',
  'windows\r\nline\r\nendings',
  'old mac\rendings\r',
  '\n\nblank\n\nlines\n',
  '\n',
]

describe('insertTextData with several lines', () => {
  for (const fixture of fixtures) {
    for (const text of texts) {
      test(`matches line-by-line pasting of ${JSON.stringify(text)} into ${
        fixture.name
      }`, () => {
        const create = () => {
          const editor = withReact(createEditor())
          editor.isInline = element =>
            (element as { type?: string }).type === 'link'
          editor.children = JSON.parse(JSON.stringify(fixture.children))
          editor.selection = JSON.parse(JSON.stringify(fixture.selection))
          editor.marks = fixture.marks ? { ...fixture.marks } : null
          return editor
        }
        const expected = create()
        pastePerLine(expected, text)
        const actual = create()
        actual.insertTextData(dataTransfer(text))

        expect(actual.children).toEqual(expected.children)
        expect(actual.selection).toEqual(expected.selection)
      })
    }
  }

  test('applies one operation per pasted line', () => {
    const editor = withReact(createEditor())
    editor.children = [
      { type: 'paragraph', children: [{ text: '' }] } as Descendant,
    ]
    editor.selection = caret([0, 0], 0)
    const lines = Array.from({ length: 1000 }, (_, i) => `line ${i}`)
    const { apply } = editor
    let operations = 0
    editor.apply = operation => {
      operations++
      apply(operation)
    }

    editor.insertTextData(dataTransfer(lines.join('\n')))

    expect(editor.children).toHaveLength(1000)
    expect(operations).toBeLessThan(1010)
  })
})
