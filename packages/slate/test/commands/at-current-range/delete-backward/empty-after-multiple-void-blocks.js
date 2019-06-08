/** @jsx h */

import h from '../../../helpers/h'

export default function(editor) {
  editor.deleteBackward()
}

export const input = (
  <value>
    <document>
      <paragraph>
        <text />
        <emoji />
        <text />
        <emoji />
        <text>
          <cursor />
        </text>
      </paragraph>
      <paragraph />
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        <text />
        <emoji />
        <text>
          <cursor />
        </text>
      </paragraph>
      <paragraph />
    </document>
  </value>
)
