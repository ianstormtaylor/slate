/** @jsx h */

import h from '../../../helpers/h'

export default function(editor) {
  const { document, selection } = editor.value
  return editor.getInsertPoint(selection.anchor, document).toJSON()
}

export const input = (
  <value>
    <document>
      <paragraph>
        a
        <link>
          word
          <cursor />
        </link>
        <link>here</link>
      </paragraph>
    </document>
  </value>
)

export const output = {
  object: 'point',
  path: [0, 3, 0],
  offset: 0,
}
