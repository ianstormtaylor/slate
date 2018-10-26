/** @jsx h */

import h from '../../../helpers/h'

export default function(editor) {
  editor.unwrapBlock('quote')
}

export const input = (
  <value>
    <document>
      <quote>
        <paragraph>
          <anchor />one
        </paragraph>
        <paragraph>
          <focus />two
        </paragraph>
        <paragraph>three</paragraph>
        <paragraph>four</paragraph>
        <paragraph>five</paragraph>
        <paragraph>six</paragraph>
      </quote>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        <anchor />one
      </paragraph>
      <paragraph>
        <focus />two
      </paragraph>
      <quote>
        <paragraph>three</paragraph>
        <paragraph>four</paragraph>
        <paragraph>five</paragraph>
        <paragraph>six</paragraph>
      </quote>
    </document>
  </value>
)
