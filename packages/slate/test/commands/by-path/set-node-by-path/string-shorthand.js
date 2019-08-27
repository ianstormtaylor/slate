/** @jsx h */

import h from '../../../helpers/h'

export default function(editor) {
  editor.setNodeByPath([0], 'quote')
}

export const input = (
  <value>
    <document>
      <paragraph>word</paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <quote>word</quote>
    </document>
  </value>
)
