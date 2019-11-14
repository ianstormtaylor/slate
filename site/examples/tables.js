import React, { useCallback, useState } from 'react'
import { Editable, withReact, useSlate } from 'slate-react'
import { Editor, Range, Point } from 'slate'
import { withHistory } from 'slate-history'

class TablesEditor extends withHistory(withReact(Editor)) {
  delete(options = {}) {
    const { at, reverse } = options
    const { selection } = this.value

    if (!at && selection && Range.isCollapsed(selection)) {
      const { anchor } = selection
      const cell = this.getMatch(anchor, { type: 'table-cell' })

      if (cell) {
        const [, cellPath] = cell
        const edge = reverse ? this.getStart(cellPath) : this.getEnd(cellPath)

        if (Point.equals(anchor, edge)) {
          return
        }
      }
    }

    super.delete(options)
  }

  splitNodes(options = {}) {
    const { at } = options
    const { selection } = this.value

    if (
      !at &&
      selection &&
      (this.getMatch(selection.anchor, { type: 'table' }) ||
        this.getMatch(selection.focus, { type: 'table' }))
    ) {
      return
    }

    super.splitNodes(options)
  }
}

const TablesExample = () => {
  const [value, setValue] = useState(initialValue)
  const editor = useSlate(TablesEditor)
  const renderElement = useCallback(props => <Element {...props} />, [])
  const renderMark = useCallback(props => <Mark {...props} />, [])
  return (
    <div>
      <Editable
        spellCheck
        autoFocus
        editor={editor}
        value={value}
        renderElement={renderElement}
        renderMark={renderMark}
        onChange={v => setValue(v)}
      />
    </div>
  )
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

const initialValue = {
  selection: null,
  annotations: {},
  nodes: [
    {
      nodes: [
        {
          text:
            'Since the editor is based on a recursive tree model, similar to an HTML document, you can create complex nested structures, like tables:',
          marks: [],
        },
      ],
    },
    {
      type: 'table',
      nodes: [
        {
          type: 'table-row',
          nodes: [
            {
              type: 'table-cell',
              nodes: [{ text: '', marks: [] }],
            },
            {
              type: 'table-cell',
              nodes: [
                {
                  text: 'Human',
                  marks: [{ type: 'bold' }],
                },
              ],
            },
            {
              type: 'table-cell',
              nodes: [
                {
                  text: 'Dog',
                  marks: [{ type: 'bold' }],
                },
              ],
            },
            {
              type: 'table-cell',
              nodes: [
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
          nodes: [
            {
              type: 'table-cell',
              nodes: [
                {
                  text: '# of Feet',
                  marks: [{ type: 'bold' }],
                },
              ],
            },
            {
              type: 'table-cell',
              nodes: [{ text: '2', marks: [] }],
            },
            {
              type: 'table-cell',
              nodes: [{ text: '4', marks: [] }],
            },
            {
              type: 'table-cell',
              nodes: [{ text: '4', marks: [] }],
            },
          ],
        },
        {
          type: 'table-row',
          nodes: [
            {
              type: 'table-cell',
              nodes: [
                {
                  text: '# of Lives',
                  marks: [{ type: 'bold' }],
                },
              ],
            },
            {
              type: 'table-cell',
              nodes: [{ text: '1', marks: [] }],
            },
            {
              type: 'table-cell',
              nodes: [{ text: '1', marks: [] }],
            },
            {
              type: 'table-cell',
              nodes: [{ text: '9', marks: [] }],
            },
          ],
        },
      ],
    },
    {
      nodes: [
        {
          text:
            "This table is just a basic example of rendering a table, and it doesn't have fancy functionality. But you could augment it to add support for navigating with arrow keys, displaying table headers, adding column and rows, or even formulas if you wanted to get really crazy!",
          marks: [],
        },
      ],
    },
  ],
}

export default TablesExample
