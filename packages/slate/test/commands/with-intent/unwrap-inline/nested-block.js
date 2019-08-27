/** @jsx h */

import h from '../../../helpers/h'

export default function(editor) {
  editor.unwrapInline('hashtag')
}

export const input = (
  <value>
    <document>
      <quote>
        <paragraph>
          w<anchor />
          <hashtag>
            or<focus />
          </hashtag>d
        </paragraph>
      </quote>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <quote>
        <paragraph>
          w<anchor />or<focus />d
        </paragraph>
      </quote>
    </document>
  </value>
)
