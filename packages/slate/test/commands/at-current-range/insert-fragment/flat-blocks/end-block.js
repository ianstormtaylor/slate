/** @jsx h */

import h from '../../../../helpers/h'

export default function(editor) {
  editor.insertFragment(
    <document>
      <paragraph>one</paragraph>
      <paragraph>two</paragraph>
      <paragraph>three</paragraph>
    </document>
  )
}

export const input = (
  <value>
    <document>
      <quote>
        word<cursor />
      </quote>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <quote>wordone</quote>
      <paragraph>two</paragraph>
      <paragraph>
        three<cursor />
      </paragraph>
    </document>
  </value>
)
