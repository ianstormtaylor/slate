/** @jsx h */

import h from '../../../helpers/h'

export default function(editor) {
  editor.wrapBlock('quote')
}

export const input = (
  <value>
    <document>
      <paragraph>
        <link>
          wo<anchor />rd
        </link>
      </paragraph>
      <paragraph>
        <link>
          an<focus />other
        </link>
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <quote>
        <paragraph>
          <link>
            wo<anchor />rd
          </link>
        </paragraph>
        <paragraph>
          <link>
            an<focus />other
          </link>
        </paragraph>
      </quote>
    </document>
  </value>
)
