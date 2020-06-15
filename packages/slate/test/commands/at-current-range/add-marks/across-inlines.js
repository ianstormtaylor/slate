/** @jsx h */

import h from '../../../helpers/h'

export default function(editor) {
  editor.addMarks(['bold', 'italic'])
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
          <i>
            <b>
              <anchor />rd
            </b>
          </i>
        </link>
        <i>
          <b />
        </i>
      </paragraph>
      <paragraph>
        <i>
          <b />
        </i>
        <link>
          <i>
            <b>an</b>
          </i>
          <focus />other
        </link>
        <text />
      </paragraph>
    </document>
  </value>
)
