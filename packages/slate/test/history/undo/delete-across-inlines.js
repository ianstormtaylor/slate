/** @jsx h */

import h from '../../helpers/h'

export default function(value) {
  return value
    .change()
    .delete()
    .value.change()
    .undo().value
}

export const input = (
  <value>
    <document>
      <paragraph>
        <link data={{ url: 'https://www.google.com' }}>
          o<anchor />ne
        </link>
      </paragraph>
      <paragraph>
        <link data={{ url: 'https://www.github.com' }}>
          tw<focus />o
        </link>
      </paragraph>
    </document>
  </value>
)

export const output = input
