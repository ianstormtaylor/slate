/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  change.insertFragment((
    <document>
      <quote>
        <hashtag>fragment</hashtag>
      </quote>
    </document>
  ))
}

export const input = (
  <state>
    <document>
      <paragraph>
        <link>wo<cursor />rd</link>
      </paragraph>
    </document>
  </state>
)

// TODO: the cursor placement needs to be fixed
export const output = (
  <state>
    <document>
      <paragraph>
        <link>wo</link><hashtag><cursor />fragment</hashtag><link>rd</link>
      </paragraph>
    </document>
  </state>
)
