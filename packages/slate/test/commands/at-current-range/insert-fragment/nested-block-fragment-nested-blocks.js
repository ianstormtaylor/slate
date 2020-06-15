/** @jsx h */

import h from '../../../helpers/h'

export default function(editor) {
  editor.insertFragment(
    <document>
      <quote>
        <quote>one</quote>
        <quote>two</quote>
      </quote>
    </document>
  )
}

export const input = (
  <value>
    <document>
      <quote>
        <paragraph>
          wo<cursor />rd
        </paragraph>
      </quote>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <quote>
        <paragraph>woone</paragraph>
        <quote>
          tword<cursor />
        </quote>
      </quote>
    </document>
  </value>
)
