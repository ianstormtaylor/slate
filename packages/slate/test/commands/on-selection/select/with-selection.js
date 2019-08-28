/** @jsx h */

import h from '../../../helpers/h'

export default function(editor) {
  const { value: { document, selection } } = editor
  const [[node]] = document.texts()

  const next = selection.setProperties({
    anchor: {
      path: [0, 0],
      key: node.key,
      offset: 0,
    },
    focus: {
      path: [0, 0],
      key: node.key,
      offset: node.text.length,
    },
  })

  editor.select(next)
}

export const input = (
  <value>
    <document>
      <paragraph>
        <cursor />one
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        <anchor />one<focus />
      </paragraph>
    </document>
  </value>
)
