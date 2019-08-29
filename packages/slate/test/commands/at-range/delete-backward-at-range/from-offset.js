/** @jsx h */

import { Point, Range } from 'slate'

import h from '../../../helpers/h'

export default function(editor) {
  const { value: { document } } = editor
  const [firstText, firstPath] = document.firstText()
  const point = Point.create({ key: firstText.key, offset: 2, path: firstPath })
  const range = Range.create({ anchor: point, focus: point })
  editor.deleteBackwardAtRange(range, 2)
}

export const input = (
  <value>
    <document>
      <paragraph>
        <paragraph>
          one<cursor />two
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
          e<cursor />two
        </paragraph>
      </paragraph>
    </document>
  </value>
)
