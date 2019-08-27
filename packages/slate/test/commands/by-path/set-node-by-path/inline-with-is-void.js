/** @jsx h */

import h from '../../../helpers/h'

export default function(editor) {
  editor.setNodeByPath([0, 1], 'emoji')
}

export const input = (
  <value>
    <document>
      <paragraph>
        <text />
        <link key="a">
          <cursor />word
        </link>
        <text />
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        <text />
        <emoji>
          <cursor />word
        </emoji>
        <text />
      </paragraph>
    </document>
  </value>
)
