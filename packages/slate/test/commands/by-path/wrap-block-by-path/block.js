/** @jsx h */

import h from '../../../helpers/h'

export default function(editor) {
  editor.wrapBlockByPath([0], 'quote')
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
      <quote>
        <paragraph>word</paragraph>
      </quote>
    </document>
  </value>
)
