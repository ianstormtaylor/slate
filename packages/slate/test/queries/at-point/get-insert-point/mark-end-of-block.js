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
        a{' '}
        <b>
          word
          <cursor />
        </b>
      </paragraph>
    </document>
  </value>
)

export const output = {
  object: 'point',
  path: [0, 1],
  offset: 4,
}
