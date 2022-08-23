/** @jsx jsx */
import { Editor, Element, Transforms, Range, Text } from 'slate'
import { jsx } from '../..'
import _ from 'lodash'

export interface TableGeneratorCellsOptions {
  at?: Location
  startRow?: number
  startCol?: number
  endRow?: number
  endCol?: number
  reverse?: boolean
}

export type CellPoint = [number, number]
export interface TableSelection {
  start: CellPoint
  end: CellPoint
}

const TableEditor = {
  *cells(
    editor: Editor,
    opitons: TableGeneratorCellsOptions = {}
  ): Generator<[Element, number, number]> {
    const { at = editor.selection } = opitons
    const [tableEntry] = Editor.nodes(editor, {
      at,
      match: n => Element.isElement(n) && n.type === 'table',
    })
    if (!tableEntry) return
    const [table] = tableEntry
    const { children } = table
    const {
      startRow = 0,
      startCol = 0,
      endRow = children.length - 1,
      reverse = false,
    } = opitons
    let r = reverse ? Math.max(endRow, children.length - 1) : startRow
    while (reverse ? r >= 0 : r <= endRow) {
      const row = children[r]
      if (!row) break
      const { children: cells } = row
      const { endCol = cells.length - 1 } = opitons
      let c = reverse ? Math.max(endCol, cells.length - 1) : startCol
      while (reverse ? c >= 0 : c <= endCol) {
        const cell = cells[c]
        yield [cell, r, c]
        c = reverse ? c - 1 : c + 1
      }
      r = reverse ? r - 1 : r + 1
    }
  },

  getSelection: (editor: Editor, at?: Location): TableSelection | undefined => {
    const [tableEntry] = Editor.nodes(editor, {
      at,
      match: n => Element.isElement(n) && n.type === 'table',
    })
    if (!tableEntry) return
    const [, path] = tableEntry
    const { selection } = editor
    if (!selection) return
    const [start, end] = Range.edges(selection)
    try {
      const range = Editor.range(editor, path)
      if (
        !Range.includes(range, selection.anchor) ||
        !Range.includes(range, selection.focus)
      )
        return
    } catch (error) {
      return
    }
    const [startEntry] = Editor.nodes<Element>(editor, {
      at: start,
      match: n => Element.isElement(n) && n.type === 'table-cell',
    })
    if (!startEntry) return
    const [endEntry] = Range.isExpanded(selection)
      ? Editor.nodes<Element>(editor, {
          at: end,
          match: n => Element.isElement(n) && n.type === 'table-cell',
        })
      : [startEntry]
    if (!endEntry) return
    const [, startPath] = startEntry
    const [, endPath] = endEntry
    return {
      start: startPath.slice(startPath.length - 2) as CellPoint,
      end: endPath.slice(endPath.length - 2) as CellPoint,
    }
  },
}

const selection = {
  anchor: {
    path: [0, 0, 1, 0],
    offset: 0,
  },
  focus: {
    path: [0, 1, 1, 0],
    offset: 0,
  },
}

export const input = (
  <editor selection={selection}>
    <block type="table">
      <block type="table-row">
        <block type="table-cell">one</block>
        <block type="table-cell">two</block>
        <block type="table-cell">three</block>
      </block>
      <block type="table-row">
        <block type="table-cell">four</block>
        <block type="table-cell">five</block>
        <block type="table-cell">six</block>
      </block>
    </block>
  </editor>
)

const editor = (input as unknown) as Editor
const defaultNormalize = editor.normalizeSelection
editor.normalizeSelection = fn => {
  const [tableEntry] = Editor.nodes(editor, {
    match: n => Element.isElement(n) && n.type === 'table',
  })
  if (tableEntry) {
    const [, path] = tableEntry
    const { selection } = editor
    const sel = TableEditor.getSelection(editor, path)
    if (!sel) return defaultNormalize(fn)
    const { start, end } = sel
    const cells = TableEditor.cells(editor, {
      at: path,
      startRow: start[0],
      startCol: start[1],
      endRow: end[0],
      endCol: end[1],
    })

    for (const [cell, row, col] of cells) {
      if (!cell) break
      const anchor = Editor.start(editor, path.concat([row, col]))
      const focus = Editor.end(editor, path.concat([row, col]))
      const range = { anchor, focus }
      fn(range)
    }
    Transforms.select(editor, selection)
  } else {
    defaultNormalize(fn)
  }
}
export const run = editor => {
  Editor.addMark(editor, 'bold', true)
}

export const output = (
  <editor selection={selection}>
    <block type="table">
      <block type="table-row">
        <block type="table-cell">one</block>
        <block type="table-cell">
          <text bold>two</text>
        </block>
        <block type="table-cell">three</block>
      </block>
      <block type="table-row">
        <block type="table-cell">four</block>
        <block type="table-cell">
          <text bold>five</text>
        </block>
        <block type="table-cell">six</block>
      </block>
    </block>
  </editor>
)
