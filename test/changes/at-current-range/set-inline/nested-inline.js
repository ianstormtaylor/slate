/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  change.setInline({ type: 'comment' })
}

export const input = (
  <state>
    <document>
      <paragraph>
        <hashtag>
          <link><cursor />word</link>
        </hashtag>
      </paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph>
        <hashtag>
          <comment><cursor />word</comment>
        </hashtag>
      </paragraph>
    </document>
  </state>
)
