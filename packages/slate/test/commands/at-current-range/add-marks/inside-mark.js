/** @jsx h */

import h from '../../../helpers/h'

export default function(editor) {
  editor.addMarks(['bold', 'underline'])
}

export const input = (
  <value>
    <document>
      <paragraph>
        <i>
          <anchor />wo<focus />rd
        </i>
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        <u>
          <b>
            <i>
              <anchor />wo
            </i>
          </b>
        </u>
        <i>
          <focus />rd
        </i>
      </paragraph>
    </document>
  </value>
)
