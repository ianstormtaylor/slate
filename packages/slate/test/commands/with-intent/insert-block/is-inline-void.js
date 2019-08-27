/** @jsx h */

import h from '../../../helpers/h'

export default function(editor) {
  editor.insertBlock('quote')
}

export const input = (
  <value>
    <document>
      <paragraph>
        <text />
        <emoji>
          <cursor />
        </emoji>
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
        <emoji />
        <text />
      </paragraph>
      <quote>
        <cursor />
      </quote>
      <paragraph />
    </document>
  </value>
)
