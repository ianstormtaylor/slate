/** @jsx h */

import h from '../../../helpers/h'

export default function(editor) {
  editor.insertTextByPath([0, 0], 0, 'a')
}

export const input = (
  <value>
    <document>
      <paragraph>
        <text key="a" marks={[{ type: 'bold' }]}>
          wo<cursor />rd
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
          awo<cursor />rd
        </b>
      </paragraph>
    </document>
  </value>
)
