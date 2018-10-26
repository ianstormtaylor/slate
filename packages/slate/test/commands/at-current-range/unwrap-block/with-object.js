/** @jsx h */

import h from '../../../helpers/h'

export default function(editor) {
  editor.unwrapBlock({
    type: 'quote',
    data: { thing: 'value' },
  })
}

export const input = (
  <value>
    <document>
      <quote thing="value">
        <paragraph>word</paragraph>
      </quote>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>word</paragraph>
    </document>
  </value>
)
