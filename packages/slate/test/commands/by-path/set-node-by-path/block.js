/** @jsx h */

import h from '../../../helpers/h'

export default function(editor) {
  editor.setNodeByPath([0], {
    type: 'quote',
    data: { thing: false },
  })
}

export const input = (
  <value>
    <document>
      <paragraph key="a">word</paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <quote thing={false}>word</quote>
    </document>
  </value>
)
