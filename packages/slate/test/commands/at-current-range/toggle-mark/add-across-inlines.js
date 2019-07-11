/** @jsx h */

import h from '../../../helpers/h'

export default function(editor) {
  editor.toggleMark('bold')
}

export const input = (
  <value>
    <document>
      <paragraph>
        <text />
        <link>
          wo<anchor />rd
        </link>
        <text />
      </paragraph>
      <paragraph>
        <text />
        <link>
          an<focus />other
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
