/** @jsx h */

import h from '../../../helpers/h'

export default function(editor) {
  editor.delete()
}

export const input = (
  <value>
    <document>
      <paragraph>
        <b>
          <anchor />wo
        </b>
        rd
      </paragraph>
      <paragraph>
        two<focus />
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        <b>
          <cursor />
        </b>
      </paragraph>
    </document>
  </value>
)
