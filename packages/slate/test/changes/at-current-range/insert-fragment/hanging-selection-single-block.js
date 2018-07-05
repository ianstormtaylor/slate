/** @jsx h */

import h from '../../../helpers/h'

const fragment = (
  <document>
    <paragraph>fragment zero</paragraph>
    <paragraph>fragment one</paragraph>
    <paragraph>fragment two</paragraph>
  </document>
)

export default function(change) {
  change.insertFragment(fragment)
}

export const input = (
  <value>
    <document>
      <paragraph>zero</paragraph>
      <paragraph>
        <anchor />one
      </paragraph>
      <quote>
        <focus />two
      </quote>
    </document>
  </value>
)

// The cursor position of insertFragment has some problems;
// If you submit PR to fixed cursor position restore in insertFragment;
// Please change this test as well
export const output = (
  <value>
    <document>
      <paragraph>zero</paragraph>
      <quote>fragment zero</quote>
      <paragraph>fragment one</paragraph>
      <paragraph>
        fragment two<cursor />two
      </paragraph>
    </document>
  </value>
)
