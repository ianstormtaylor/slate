/** @jsx h */

import h from '../../../helpers/h'

export default function(editor) {
  editor.unwrapChildrenByPath([0])
}

export const input = (
  <value>
    <document>
      <quote key="a">
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
