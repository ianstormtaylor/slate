import { createEditor, Descendant, Editor, Node, Range } from 'slate'
import {
  deleteMovedRange,
  getMovableRange,
  getWholeTopLevelBlockPaths,
} from '../src/utils/move-range'

const block = (type: string, text: string) => ({
  type,
  children: [{ text }],
})
const p = (text: string) => block('paragraph', text)
const cell = (text: string) => block('table-cell', text)

const editorWith = (children: object[]) => {
  const editor = createEditor()
  editor.children = children as Descendant[]
  return editor
}

const range = (
  anchorPath: number[],
  anchorOffset: number,
  focusPath: number[],
  focusOffset: number
): Range => ({
  anchor: { path: anchorPath, offset: anchorOffset },
  focus: { path: focusPath, offset: focusOffset },
})

const shape = (nodes: Node[]): unknown[] =>
  nodes.map(node =>
    Node.isText(node)
      ? node.text
      : {
          type: (node as { type?: string }).type,
          children: shape(node.children),
        }
  )

const move = (children: object[], selection: Range) => {
  const editor = editorWith(children)
  const movable = getMovableRange(editor, selection)
  const fragment = shape(Node.fragment(editor, movable))
  deleteMovedRange(editor, movable)
  return { editor, movable, fragment, children: shape(editor.children) }
}

describe('moving a dragged or cut range', () => {
  it('moves whole top-level lines with their line break', () => {
    const result = move(
      [p('one'), p('two'), p('three')],
      range([1, 0], 0, [2, 0], 0)
    )

    expect(result.fragment).toEqual([
      { type: 'paragraph', children: ['two'] },
      { type: 'paragraph', children: [''] },
    ])
    expect(result.children).toEqual([
      { type: 'paragraph', children: ['one'] },
      { type: 'paragraph', children: ['three'] },
    ])
    expect(result.editor.selection).toEqual(range([1, 0], 0, [1, 0], 0))
  })

  it('works for a backward selection', () => {
    const result = move(
      [p('one'), p('two'), p('three')],
      range([2, 0], 0, [1, 0], 0)
    )

    expect(result.children).toEqual([
      { type: 'paragraph', children: ['one'] },
      { type: 'paragraph', children: ['three'] },
    ])
  })

  it('keeps the type of the block after a moved heading', () => {
    const result = move(
      [p('one'), block('heading-one', 'Title'), p('body')],
      range([1, 0], 0, [2, 0], 0)
    )

    expect(result.children).toEqual([
      { type: 'paragraph', children: ['one'] },
      { type: 'paragraph', children: ['body'] },
    ])
  })

  it('removes a moved quote line instead of leaving it empty', () => {
    const result = move(
      [p('one'), block('block-quote', 'quote'), p('after')],
      range([1, 0], 0, [2, 0], 0)
    )

    expect(result.children).toEqual([
      { type: 'paragraph', children: ['one'] },
      { type: 'paragraph', children: ['after'] },
    ])
  })

  it('moves several whole lines at once', () => {
    const result = move(
      [p('a'), p('b'), p('c'), p('d')],
      range([0, 0], 0, [3, 0], 0)
    )

    expect(result.children).toEqual([{ type: 'paragraph', children: ['d'] }])
  })

  it('moves an empty line', () => {
    const result = move(
      [p('one'), p(''), p('three')],
      range([1, 0], 0, [2, 0], 0)
    )

    expect(result.fragment).toEqual([
      { type: 'paragraph', children: [''] },
      { type: 'paragraph', children: [''] },
    ])
    expect(result.children).toEqual([
      { type: 'paragraph', children: ['one'] },
      { type: 'paragraph', children: ['three'] },
    ])
  })

  it('leaves a range that does not hang unchanged', () => {
    const selection = range([0, 0], 1, [2, 0], 0)
    const result = move([p('one'), p('two'), p('three')], selection)

    expect(result.movable).toEqual(selection)
    expect(result.children).toEqual([
      { type: 'paragraph', children: ['othree'] },
    ])
  })

  it('does not treat a range starting after an inline as whole blocks', () => {
    const editor = editorWith([
      {
        type: 'paragraph',
        children: [
          { text: 'a' },
          { type: 'link', children: [{ text: 'b' }] },
          { text: '' },
        ],
      },
      p('next'),
    ])
    editor.isInline = element => (element as { type?: string }).type === 'link'

    expect(
      getWholeTopLevelBlockPaths(editor, range([0, 2], 0, [1, 0], 0))
    ).toBeNull()
  })

  it('unhangs instead of merging list items', () => {
    const list = {
      type: 'bulleted-list',
      children: [
        block('list-item', 'one'),
        block('list-item', 'two'),
        block('list-item', 'three'),
      ],
    }
    const result = move([list], range([0, 1, 0], 0, [0, 2, 0], 0))

    expect(result.fragment).toEqual([
      {
        type: 'bulleted-list',
        children: [{ type: 'list-item', children: ['two'] }],
      },
    ])
    expect(result.children).toEqual([
      {
        type: 'bulleted-list',
        children: [
          { type: 'list-item', children: ['one'] },
          { type: 'list-item', children: [''] },
          { type: 'list-item', children: ['three'] },
        ],
      },
    ])
  })

  it('does not pull the block after a list into the list', () => {
    const list = {
      type: 'bulleted-list',
      children: [block('list-item', 'one'), block('list-item', 'two')],
    }
    const result = move([list, p('after')], range([0, 1, 0], 0, [1, 0], 0))

    expect(result.children).toEqual([
      {
        type: 'bulleted-list',
        children: [
          { type: 'list-item', children: ['one'] },
          { type: 'list-item', children: [''] },
        ],
      },
      { type: 'paragraph', children: ['after'] },
    ])
  })

  it('keeps every table cell when the range hangs into the next cell', () => {
    const table = {
      type: 'table',
      children: [
        { type: 'table-row', children: [cell('a1'), cell('b1')] },
        { type: 'table-row', children: [cell('a2'), cell('b2')] },
      ],
    }
    const result = move([table], range([0, 0, 0, 0], 0, [0, 0, 1, 0], 0))

    expect(result.children).toEqual([
      {
        type: 'table',
        children: [
          {
            type: 'table-row',
            children: [
              { type: 'table-cell', children: [''] },
              { type: 'table-cell', children: ['b1'] },
            ],
          },
          {
            type: 'table-row',
            children: [
              { type: 'table-cell', children: ['a2'] },
              { type: 'table-cell', children: ['b2'] },
            ],
          },
        ],
      },
    ])
  })

  it('unhangs a range that hangs into the next table row', () => {
    const table = {
      type: 'table',
      children: [
        { type: 'table-row', children: [cell('a1'), cell('b1')] },
        { type: 'table-row', children: [cell('a2'), cell('b2')] },
      ],
    }
    const editor = editorWith([table])
    const movable = getMovableRange(
      editor,
      range([0, 0, 0, 0], 0, [0, 1, 0, 0], 0)
    )

    expect(Range.end(movable)).toEqual({ path: [0, 0, 1, 0], offset: 2 })
  })

  it('goes through deleteFragment for nested ranges so plugins can guard it', () => {
    const editor = editorWith([
      {
        type: 'bulleted-list',
        children: [block('list-item', 'one'), block('list-item', 'two')],
      },
    ])
    const deleteFragment = jest.fn()
    editor.deleteFragment = deleteFragment

    deleteMovedRange(editor, range([0, 0, 0], 1, [0, 1, 0], 1))

    expect(deleteFragment).toHaveBeenCalledTimes(1)
    expect(Editor.string(editor, [])).toBe('onetwo')
  })
})
