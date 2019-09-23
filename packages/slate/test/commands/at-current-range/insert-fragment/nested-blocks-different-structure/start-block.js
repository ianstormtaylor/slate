/** @jsx h */

import h from '../../../../helpers/h'

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
        <cursor />word
      </paragraph>
    </document>
  </value>
)

// TODO: should "after quote" be put together with "word"?
export const output = (
  <value>
    <document>
      <quote>
        <quote>one</quote>
        <quote>two</quote>
      </quote>
      <paragraph>
        after quote<cursor />
      </paragraph>
      <paragraph>word</paragraph>
    </document>
  </value>
)
