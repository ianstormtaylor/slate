/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  change.unwrapInline({
    type: 'hashtag',
    data: { thing: 'value' }
  })
}

export const input = (
  <state>
    <document>
      <paragraph>
        w<hashtag thing="value"><hashtag><cursor />or</hashtag></hashtag>d
      </paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph>
        w<hashtag><cursor />or</hashtag>d
      </paragraph>
    </document>
  </state>
)
