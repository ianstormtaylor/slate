/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  change.insertTextByKey('a', 0, 'a')
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
