/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  change.toggleMark('bold')
}

export const input = (
  <value>
    <document>
      <paragraph>
        <anchor />
        <b>a</b>
        <i>
          wo<focus />rd
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
        <b>
          a<i>wo</i>
        </b>
        <focus />
        <i>rd</i>
      </paragraph>
    </document>
  </value>
)
