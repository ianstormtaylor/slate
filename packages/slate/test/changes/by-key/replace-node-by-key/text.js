/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  const key = change.state.document.getTexts().first().key
  const text = { kind: 'text', text: 'three' }
  change.replaceNodeByKey(key, text)
}

export const input = (
  <state>
    <document>
      <paragraph>
        one
      </paragraph>
      <paragraph>
        two
    </paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph>
        three
      </paragraph>
      <paragraph>
        two
      </paragraph>
    </document>
  </state>
)
