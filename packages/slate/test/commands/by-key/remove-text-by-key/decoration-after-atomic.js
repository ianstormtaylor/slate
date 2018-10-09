/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  change.removeTextByKey('a', 3, 1)
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
        w<result>or</result>
      </paragraph>
    </document>
  </value>
)
