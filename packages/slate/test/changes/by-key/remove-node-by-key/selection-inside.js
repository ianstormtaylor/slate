/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  change.removeNodeByKey('a')
}

export const input = (
  <value>
    <document>
      <paragraph>one</paragraph>
      <paragraph>
        <text key="a">
          t<cursor />wo
        </text>
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        one<cursor />
      </paragraph>
      <paragraph />
    </document>
  </value>
)
