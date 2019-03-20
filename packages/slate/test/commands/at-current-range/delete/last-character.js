/** @jsx h */

import h from '../../../helpers/h'

export default function(editor) {
  editor.delete()
}

export const input = (
  <value>
    <document>
      <paragraph>
        wor<anchor />d<focus />
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        wor<cursor />
      </paragraph>
    </document>
  </value>
)
