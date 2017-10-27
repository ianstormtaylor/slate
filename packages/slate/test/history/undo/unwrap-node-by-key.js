/** @jsx h */

import h from '../../helpers/h'

export default function (value) {
  return value
    .change()
    .unwrapNodeByKey('a')
    .value
    .change()
    .undo()
    .value
}

export const input = (
  <value>
    <document>
      <quote>
        <paragraph key="a">
          <cursor />one
        </paragraph>
        <paragraph>
          two
        </paragraph>
        <paragraph>
          three
        </paragraph>
      </quote>
    </document>
  </value>
)

export const output = input
