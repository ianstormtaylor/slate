/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  change.insertFragment(
    <document>
      <quote>
        <hashtag>fragment</hashtag>
      </quote>
    </document>
  )
}

export const input = (
  <value>
    <document>
      <paragraph>
        <link>
          wo<cursor />rd
        </link>
      </paragraph>
    </document>
  </value>
)

// TODO: the cursor placement needs to be fixed
export const output = (
  <value>
    <document>
      <paragraph>
        <link>wo</link>
        <hashtag>fragment</hashtag>
        <cursor />
        <link>rd</link>
      </paragraph>
    </document>
  </value>
)
