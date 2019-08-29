/** @jsx h */

import h from '../../../helpers/h'

export default function(editor) {
  const { value: { document } } = editor
  const point = document.createPoint({ path: [0, 0], offset: 2 })
  editor.splitNodeAtPoint(point, [0])
}

export const input = (
  <value>
    <document>
      <paragraph>
        <text>
          w<anchor />or<focus />d
        </text>
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        w<anchor />o
      </paragraph>
      <paragraph>
        r<focus />d
      </paragraph>
    </document>
  </value>
)
