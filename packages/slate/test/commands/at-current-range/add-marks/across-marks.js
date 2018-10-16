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
        Some{' '}
        <u>
          <b>
            <anchor />
            bold
          </b>
        </u>
        <u> and some </u>
        <u>
          <i>ita</i>
        </u>
        <focus />
        <i>lic</i>
      </paragraph>
    </document>
  </value>
)
