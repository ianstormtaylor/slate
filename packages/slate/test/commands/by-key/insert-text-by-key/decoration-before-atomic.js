/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  change.insertTextByKey('a', 1, 'x')
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
        wx<result>or</result>d
      </paragraph>
    </document>
  </value>
)
