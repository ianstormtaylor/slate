/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  change.addMarks(['underline'])
}

export const input = (
  <value>
    <document>
      <paragraph>
        Some{' '}
        <b>
          <anchor />bold
        </b>{' '}
        and some{' '}
        <i>
          ita<focus />lic
        </i>
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        <anchor />
        Some{' '}
        <b>
          <u>bold</u>
        </b>
        <u> and some </u>
        <i>
          <u>ita</u>lic
        </i>
      </paragraph>
    </document>
  </value>
)
