/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  change.removeTextByKey('a', 0, 1)
}

export const options = {
  preserveDecorations: true,
}

export const input = (
  <value>
    <document>
      <paragraph>
        <text key="a">
          w<result>or</result>d
        </text>
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        <result>or</result>d
      </paragraph>
    </document>
  </value>
)
