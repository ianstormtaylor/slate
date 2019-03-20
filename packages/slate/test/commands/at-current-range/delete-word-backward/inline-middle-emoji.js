/** @jsx h */

import h from '../../../helpers/h'

export default function(editor) {
  editor.deleteWordBackward()
}

export const input = (
  <value>
    <document>
      <paragraph>
        <link>
          wo📛rd<cursor />
        </link>
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        <link>
          <cursor />
        </link>
      </paragraph>
    </document>
  </value>
)
