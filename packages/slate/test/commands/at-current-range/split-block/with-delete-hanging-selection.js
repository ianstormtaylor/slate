/** @jsx h */

import h from '../../../helpers/h'

export default function(editor) {
  editor.splitBlock()
}

export const input = (
  <value>
    <document>
      <paragraph>zero</paragraph>
      <paragraph>
        <anchor />word
      </paragraph>
      <quote>
        <focus />cat is cute
      </quote>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>zero</paragraph>
      <quote />
      <quote>
        <cursor />cat is cute
      </quote>
    </document>
  </value>
)
