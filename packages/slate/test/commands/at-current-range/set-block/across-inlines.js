/** @jsx h */

import h from '../../../helpers/h'

export default function(editor) {
  editor.setBlocks({ type: 'code' })
}

export const input = (
  <value>
    <document>
      <paragraph>
        <link>
          <anchor />word
        </link>
      </paragraph>
      <paragraph>
        <link>
          another<focus />
        </link>
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <code>
        <link>
          <anchor />word
        </link>
      </code>
      <code>
        <link>
          another<focus />
        </link>
      </code>
    </document>
  </value>
)
