/** @jsx h */

import h from '../../../helpers/h'

export default function(editor) {
  editor.wrapBlock({
    type: 'quote',
    data: { thing: 'value' },
  })
}

export const input = (
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

export const output = (
  <value>
    <document>
      <quote>
        <quote thing="value">
          <paragraph>
            <cursor />word
          </paragraph>
        </quote>
      </quote>
    </document>
  </value>
)
