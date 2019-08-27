/** @jsx h */

import h from '../../../helpers/h'

export default function(editor) {
  editor.delete()
}

export const input = (
  <value>
    <document>
      <quote>
        <paragraph>
          <anchor />one
        </paragraph>
        <quote>
          <paragraph>two</paragraph>
          <quote>
            <paragraph>
              three<focus />
            </paragraph>
          </quote>
        </quote>
      </quote>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <quote>
        <paragraph>
          <cursor />
        </paragraph>
      </quote>
    </document>
  </value>
)
