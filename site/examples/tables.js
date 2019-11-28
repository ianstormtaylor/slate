import React, { useCallback, useMemo } from 'react'
import { Slate, Editable, withReact } from 'slate-react'
import { Editor, Range, Point, createEditor } from 'slate'
import { withHistory } from 'slate-history'

const TablesExample = () => {
  const renderElement = useCallback(props => <Element {...props} />, [])
  const renderMark = useCallback(props => <Mark {...props} />, [])
  const editor = useMemo(
    () => withTables(withHistory(withReact(createEditor()))),
    []
  )
  return (
    <Slate editor={editor} defaultValue={initialValue}>
      <Editable renderElement={renderElement} renderMark={renderMark} />
    </Slate>
  )
}

const withTables = editor => {
  const { exec } = editor

  editor.exec = command => {
    const { selection } = editor
    const { type } = command

    if (
      (type === 'delete_forward' || type === 'delete_backward') &&
      selection &&
      Range.isCollapsed(selection)
    ) {
      const { anchor } = selection
      const cell = Editor.match(editor, anchor, { type: 'table-cell' })

      if (cell) {
        const [, cellPath] = cell
        const edge =
          type === 'delete_backward'
            ? Editor.start(editor, cellPath)
            : Editor.end(editor, cellPath)

        if (Point.equals(anchor, edge)) {
          return
        }
      }
    }

    if (
      type === 'insert_break' &&
      selection &&
      (Editor.match(editor, selection.anchor, { type: 'table' }) ||
        Editor.match(editor, selection.focus, { type: 'table' }))
    ) {
      return
    }

    exec(command)
  }

  return editor
}

const Element = ({ attributes, children, element }) => {
  switch (element.type) {
    case 'table':
      return (
        <table>
          <tbody {...attributes}>{children}</tbody>
        </table>
      )
    case 'table-row':
      return <tr {...attributes}>{children}</tr>
    case 'table-cell':
      return <td {...attributes}>{children}</td>
    default:
      return <p {...attributes}>{children}</p>
  }
}

const Mark = ({ attributes, children, mark }) => {
  switch (mark.type) {
    case 'bold':
      return <strong {...attributes}>{children}</strong>
  }
}

const initialValue = [
  {
    children: [
      {
        text:
          'Since the editor is based on a recursive tree model, similar to an HTML document, you can create complex nested structures, like tables:',
        marks: [],
      },
    ],
  },
  {
    type: 'table',
    children: [
      {
        type: 'table-row',
        children: [
          {
            type: 'table-cell',
            children: [{ text: '', marks: [] }],
          },
          {
            type: 'table-cell',
            children: [
              {
                text: 'Human',
                marks: [{ type: 'bold' }],
              },
            ],
          },
          {
            type: 'table-cell',
            children: [
              {
                text: 'Dog',
                marks: [{ type: 'bold' }],
              },
            ],
          },
          {
            type: 'table-cell',
            children: [
              {
                text: 'Cat',
                marks: [{ type: 'bold' }],
              },
            ],
          },
        ],
      },
      {
        type: 'table-row',
        children: [
          {
            type: 'table-cell',
            children: [
              {
                text: '# of Feet',
                marks: [{ type: 'bold' }],
              },
            ],
          },
          {
            type: 'table-cell',
            children: [{ text: '2', marks: [] }],
          },
          {
            type: 'table-cell',
            children: [{ text: '4', marks: [] }],
          },
          {
            type: 'table-cell',
            children: [{ text: '4', marks: [] }],
          },
        ],
      },
      {
        type: 'table-row',
        children: [
          {
            type: 'table-cell',
            children: [
              {
                text: '# of Lives',
                marks: [{ type: 'bold' }],
              },
            ],
          },
          {
            type: 'table-cell',
            children: [{ text: '1', marks: [] }],
          },
          {
            type: 'table-cell',
            children: [{ text: '1', marks: [] }],
          },
          {
            type: 'table-cell',
            children: [{ text: '9', marks: [] }],
          },
        ],
      },
    ],
  },
  {
    children: [
      {
        text:
          "This table is just a basic example of rendering a table, and it doesn't have fancy functionality. But you could augment it to add support for navigating with arrow keys, displaying table headers, adding column and rows, or even formulas if you wanted to get really crazy!",
        marks: [],
      },
    ],
  },
]

export default TablesExample
