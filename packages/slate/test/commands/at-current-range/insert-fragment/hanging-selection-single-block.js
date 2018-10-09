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
