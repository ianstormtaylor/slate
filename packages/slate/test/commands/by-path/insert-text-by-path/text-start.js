/** @jsx h */

import h from '../../../helpers/h'

export default function(editor) {
  editor.insertTextByPath([0, 0], 0, 'a')
}

export const input = (
  <value>
    <document>
      <paragraph>
        <text key="a">
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
        awo<cursor />rd
      </paragraph>
    </document>
  </value>
)
