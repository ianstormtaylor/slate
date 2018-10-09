/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  change.insertTextByKey('a', 2, 'x', [{ type: 'bold' }])
}

export const input = (
  <value>
    <document>
      <paragraph>
        <text key="a">word</text>
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        wo<b>x</b>rd
      </paragraph>
    </document>
  </value>
)
