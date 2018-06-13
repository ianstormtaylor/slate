/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  change.insertText('a')
}

export const input = (
  <value>
    <document>
      <paragraph>
        w<cursor />
        <b>or</b>d
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        wa<cursor />
        <b>or</b>d
      </paragraph>
    </document>
  </value>
)
