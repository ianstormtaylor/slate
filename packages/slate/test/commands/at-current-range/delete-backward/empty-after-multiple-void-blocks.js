/** @jsx h */

import h from '../../../helpers/h'

export default function(editor) {
  editor.deleteBackward()
}

export const input = (
  <value>
    <document>
      <paragraph>
        <emoji />
        <emoji />
        <cursor />
      </paragraph>
      <paragraph />
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        <emoji />
        <cursor />
      </paragraph>
      <paragraph />
    </document>
  </value>
)
