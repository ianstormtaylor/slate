/** @jsx h */

import h from '../../../helpers/h'

export default function(editor) {
  editor.wrapBlock('quote')
}

export const input = (
  <value>
    <document>
      <paragraph>
        <cursor />word
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <quote>
        <paragraph>
          <cursor />word
        </paragraph>
      </quote>
    </document>
  </value>
)
