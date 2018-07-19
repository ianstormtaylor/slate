/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  change.wrapInline('hashtag')
}

export const input = (
  <value>
    <document>
      <paragraph>
        <link>
          <b>
            h<anchor />ell
          </b>
          <focus />o
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
          <b>h</b>
          <hashtag>
            <b>
              <anchor />ell<focus />
            </b>
          </hashtag>o
        </link>
      </paragraph>
    </document>
  </value>
)
