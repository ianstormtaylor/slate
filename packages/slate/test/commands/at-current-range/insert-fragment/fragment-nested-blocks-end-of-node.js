/** @jsx h */

import h from '../../../helpers/h'

export default function(editor) {
  editor.insertFragment(
    <document>
      <quote>
        <quote>one</quote>
        <quote>two</quote>
      </quote>
      <paragraph>after quote</paragraph>
    </document>
  )
}

export const input = (
  <value>
    <document>
      <paragraph>
        word<cursor />
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>word</paragraph>
      <quote>
        <quote>one</quote>
        <quote>two</quote>
      </quote>
      <paragraph>
        after quote<cursor />
      </paragraph>
    </document>
  </value>
)
