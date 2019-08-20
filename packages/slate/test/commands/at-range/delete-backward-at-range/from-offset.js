/** @jsx h */

import { Point, Range } from 'slate'

import h from '../../../helpers/h'

export default function(editor) {
  const { key } = editor.value.document.getFirstText()
  const range = new Range({
    anchor: new Point({ key, offset: 2, path: [key] }),
    focus: new Point({ key, offset: 2, path: [key] }),
  })
  editor.deleteBackwardAtRange(range, 2)
}

export const input = (
  <value>
    <document>
      <paragraph>
        <paragraph>
          Sample <cursor />Text
        </paragraph>
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        <paragraph>
          mple <cursor />Text
        </paragraph>
      </paragraph>
    </document>
  </value>
)
