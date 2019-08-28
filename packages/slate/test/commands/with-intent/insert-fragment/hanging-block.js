/** @jsx h */

import h from '../../../helpers/h'

const fragment = (
  <document>
    <paragraph>1</paragraph>
    <paragraph>2</paragraph>
    <paragraph>3</paragraph>
  </document>
)

export default function(editor) {
  editor.insertFragment(fragment)
}

export const input = (
  <value>
    <document>
      <paragraph>one</paragraph>
      <paragraph>
        <anchor />two
      </paragraph>
      <quote>
        <focus />three
      </quote>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>one</paragraph>
      <quote>1</quote>
      <paragraph>2</paragraph>
      <paragraph>
        3<cursor />three
      </paragraph>
    </document>
  </value>
)
