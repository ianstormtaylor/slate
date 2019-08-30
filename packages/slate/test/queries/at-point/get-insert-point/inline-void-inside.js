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
        <emoji>
          <cursor />
        </emoji>
        word
      </paragraph>
    </document>
  </value>
)

export const output = {
  object: 'point',
  path: [0, 1, 0],
  offset: 0,
}
