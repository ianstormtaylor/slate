/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  change.removeTextByKey('a', 0, 1)
}

export const input = (
  <value>
    <document>
      <paragraph>
        <link>
          <hashtag>
            <text key="a">
              <cursor />a
            </text>
          </hashtag>
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
          <hashtag>
            <cursor />
          </hashtag>
        </link>
      </paragraph>
    </document>
  </value>
)
