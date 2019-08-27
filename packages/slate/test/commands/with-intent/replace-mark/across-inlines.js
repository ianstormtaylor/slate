/** @jsx h */

import h from '../../../helpers/h'

export default function(editor) {
  editor.replaceMark('italic', 'bold')
}

export const input = (
  <value>
    <document>
      <paragraph>
        <text />
        <link>
          wo
          <i>
            <anchor />rd
          </i>
        </link>
        <text />
      </paragraph>
      <paragraph>
        <text />
        <link>
          <i>an</i>
          <focus />other
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
        <link>
          wo
          <b>
            <anchor />rd
          </b>
        </link>
        <b />
      </paragraph>
      <paragraph>
        <b />
        <link>
          <b>an</b>
          <focus />other
        </link>
        <text />
      </paragraph>
    </document>
  </value>
)
