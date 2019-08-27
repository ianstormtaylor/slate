/** @jsx h */

import h from '../../../helpers/h'

export default function(editor) {
  editor.unwrapBlockByPath([0, 0], 'quote')
}

export const input = (
  <value>
    <document>
      <quote>
        <paragraph key="a">word</paragraph>
      </quote>
      <quote>
        <paragraph>word</paragraph>
      </quote>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>word</paragraph>
      <quote>
        <paragraph>word</paragraph>
      </quote>
    </document>
  </value>
)
