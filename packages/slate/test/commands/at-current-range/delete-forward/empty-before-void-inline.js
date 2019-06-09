/** @jsx h */

import h from '../../../helpers/h'

export default function(editor) {
  editor.deleteForward()
}

export const input = (
  <value>
    <document>
      <paragraph>
        <text>
          <cursor />
        </text>
        <emoji />
        <text />
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        <text>
          <cursor />
        </text>
      </paragraph>
    </document>
  </value>
)
