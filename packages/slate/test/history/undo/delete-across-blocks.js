/** @jsx h */

import h from '../../helpers/h'

export default function(value) {
  return value
    .change()
    .delete()
    .value.change()
    .undo().value
}

// the paragraph and code blocks have some random data
// to verify that the data objects get restored to what they were after undo
export const input = (
  <value>
    <document>
      <paragraph data={{ key: 'value' }}>
        o<anchor />ne
      </paragraph>
      <code data={{ key2: 'value2' }}>
        tw<focus />o
      </code>
    </document>
  </value>
)

export const output = input
