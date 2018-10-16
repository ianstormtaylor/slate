/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  change.insertTextByKey('a', 4, 'x')
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
        w<result>or</result>dx
      </paragraph>
    </document>
  </value>
)
