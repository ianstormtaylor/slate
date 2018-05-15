/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  change.unwrapInline('hashtag')
}

export const input = (
  <value>
    <document>
      <paragraph>
        he<hashtag>ll</hashtag>o <anchor />w<hashtag>
          or<focus />
        </hashtag>d
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        he<hashtag>ll</hashtag>o <anchor />wor<focus />d
      </paragraph>
    </document>
  </value>
)
