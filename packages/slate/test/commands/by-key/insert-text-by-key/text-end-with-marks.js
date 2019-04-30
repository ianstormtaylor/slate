/** @jsx h */

import h from '../../../helpers/h'

export default function(editor) {
  editor.insertTextByKey('a', 4, 'x')
}

export const input = (
  <value>
    <document>
      <paragraph>
        <text key="a" marks={[{ type: 'bold' }]}>
          w<cursor />ord
        </text>
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        <b>
          w<cursor />ordx
        </b>
      </paragraph>
    </document>
  </value>
)
