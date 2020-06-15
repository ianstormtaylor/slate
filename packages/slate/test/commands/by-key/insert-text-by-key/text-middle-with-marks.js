/** @jsx h */

import h from '../../../helpers/h'

export default function(editor) {
  editor.insertTextByKey('a', 2, 'x', [{ type: 'bold' }])
}

export const input = (
  <value>
    <document>
      <paragraph>
        <text key="a">
          wor<cursor />d
        </text>
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        wo<b>x</b>r<cursor />d
      </paragraph>
    </document>
  </value>
)
